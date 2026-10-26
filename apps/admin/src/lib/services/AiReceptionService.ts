import { prisma } from '@hospitality-os/database'
import { getAppConfig } from '@hospitality-os/utils'
import { BookingService } from './BookingService'
import { AuditLogger } from '../logging/auditLogger'
import { SafeBookingContext, SaveCallResultParams, CallbackRequestParams } from '@hospitality-os/types'

export class AiReceptionService {
  /**
   * Determine whether bookings are eligible for AI Reception pre-arrival calls
   * Returns sanitized safe contexts for n8n orchestration
   */
  static async getEligibleBookings(): Promise<SafeBookingContext[]> {
    const config = getAppConfig()
    const now = new Date()
    const futureWindow = new Date(now.getTime() + 48 * 60 * 60 * 1000)

    const bookings = await prisma.booking.findMany({
      where: {
        status: { in: ['CONFIRMED', 'PENDING'] },
        checkIn: {
          gte: now,
          lte: futureWindow,
        },
      },
      include: {
        user: true,
        allocations: { include: { room: { include: { category: true } } } },
        payments: true,
        aiCallSessions: true,
      },
      orderBy: { checkIn: 'asc' },
    })

    // Filter out bookings that already have a COMPLETED pre-arrival call session
    const eligibleBookings = bookings.filter((b) => {
      const hasCompletedCall = b.aiCallSessions.some((s) => s.status === 'COMPLETED')
      return !hasCompletedCall
    })

    return eligibleBookings.map((b) => this.toSafeContext(b, config.hotelName))
  }

  /**
   * Build safe guest booking context (no sensitive fields, credentials or secrets)
   */
  static async getSafeBookingContext(bookingIdOrRef: string): Promise<SafeBookingContext | null> {
    const config = getAppConfig()
    const booking = await prisma.booking.findFirst({
      where: {
        OR: [{ id: bookingIdOrRef }, { bookingRef: bookingIdOrRef }],
      },
      include: {
        user: true,
        allocations: { include: { room: { include: { category: true } } } },
        payments: true,
      },
    })

    if (!booking) return null
    return this.toSafeContext(booking, config.hotelName)
  }

  /**
   * Helper to format booking into SafeBookingContext
   */
  private static toSafeContext(b: any, hotelName: string): SafeBookingContext {
    const payment = b.payments[0]
    const allocation = b.allocations[0]
    const isPaid = payment?.status === 'COMPLETED'

    return {
      bookingId: b.id,
      bookingRef: b.bookingRef,
      guestName: b.user?.name || 'Guest',
      guestPhone: b.user?.phone || undefined,
      checkIn: b.checkIn.toISOString(),
      checkOut: b.checkOut.toISOString(),
      roomCategory: allocation?.room?.category?.name || 'Deluxe Room',
      roomNumber: allocation?.room?.roomNumber || undefined,
      status: b.status,
      paymentStatus: isPaid ? 'PAID' : 'PAY_AT_HOTEL',
      totalAmount: b.totalAmount,
      hotelName: hotelName || 'Ashok Inn',
      hotelContact: '+91 98765 43210',
      specialRequests: b.specialRequests || undefined,
    }
  }

  /**
   * Create a persistent AI Call Session
   */
  static async createCallSession(bookingId: string, provider = 'mock') {
    const session = await prisma.aiCallSession.create({
      data: {
        bookingId,
        provider,
        status: 'CREATED',
        language: 'en-IN',
      },
    })

    await AuditLogger.log({
      category: 'BOOKING',
      action: 'AI_RECEPTION_SESSION_CREATED',
      message: `AI Reception call session ${session.id} created for booking ${bookingId}`,
      author: 'AI Receptionist',
      bookingId,
    })

    return session
  }

  /**
   * Idempotently save guest expected arrival time
   */
  static async saveArrivalTime(bookingId: string, arrivalTime: string, source = 'ai_voice') {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
    if (!booking) {
      throw new Error(`Booking ${bookingId} not found`)
    }

    if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED') {
      throw new Error(`Cannot update arrival time for ${booking.status} booking`)
    }

    const noteText = `[AI Receptionist] Expected arrival time confirmed: ${arrivalTime}`

    // Check if arrival time note already logged to maintain strict idempotency
    const existingNote = await prisma.bookingNote.findFirst({
      where: {
        bookingId,
        message: { contains: arrivalTime },
      },
    })

    if (!existingNote) {
      await BookingService.addNote(bookingId, noteText, 'AI Receptionist')
    }

    await AuditLogger.log({
      category: 'BOOKING',
      action: 'AI_RECEPTION_ARRIVAL_TIME_UPDATED',
      message: `Guest expected arrival time updated to ${arrivalTime} via ${source}`,
      author: 'AI Receptionist',
      bookingId,
    })

    return { success: true, bookingId, arrivalTime }
  }

  /**
   * Save call summary, status & sentiment
   */
  static async saveCallResult(params: SaveCallResultParams) {
    const {
      sessionId,
      bookingId,
      callStatus,
      outcome,
      language = 'en-IN',
      duration = 0,
      summary,
      sentiment = 'NEUTRAL',
      arrivalTime,
      guestRequest,
      escalationRequired = false,
      failureReason,
    } = params

    let session = sessionId
      ? await prisma.aiCallSession.findUnique({ where: { id: sessionId } })
      : null

    if (!session && bookingId) {
      session = await prisma.aiCallSession.findFirst({
        where: { bookingId },
        orderBy: { createdAt: 'desc' },
      })
    }

    if (session) {
      await prisma.aiCallSession.update({
        where: { id: session.id },
        data: {
          status: callStatus,
          summary,
          sentiment,
          arrivalTime,
          duration,
          language,
          escalationRequired,
          failureReason,
          endedAt: new Date(),
        },
      })
    } else if (bookingId) {
      await prisma.aiCallSession.create({
        data: {
          bookingId,
          status: callStatus,
          summary,
          sentiment,
          arrivalTime,
          duration,
          language,
          escalationRequired,
          failureReason,
          endedAt: new Date(),
        },
      })
    }

    // If arrival time captured during call, update booking idempotently
    if (arrivalTime && bookingId) {
      await this.saveArrivalTime(bookingId, arrivalTime, 'ai_voice_call')
    }

    // If guest request captured during call, update booking notes
    if (guestRequest && bookingId) {
      await BookingService.addNote(bookingId, `[AI Pre-Arrival Request] ${guestRequest}`, 'AI Receptionist')
    }

    await AuditLogger.log({
      category: 'BOOKING',
      action: 'AI_RECEPTION_CALL_COMPLETED',
      message: `AI Call Outcome: ${outcome} | Summary: ${summary}`,
      author: 'AI Receptionist',
      bookingId,
    })

    return { success: true, callStatus, outcome }
  }

  /**
   * Create callback request for human front desk staff
   */
  static async createCallbackRequest(params: CallbackRequestParams) {
    const { bookingId, guestName = 'Guest', phone = 'N/A', reason, priority = 'MEDIUM' } = params

    const task = await prisma.task.create({
      data: {
        type: 'SERVICE',
        title: `Callback Request: ${guestName} (${phone})`,
        description: `Reason: ${reason}`,
        priority,
        status: 'PENDING',
        bookingId: bookingId || null,
        assignedStaff: 'Front Desk Team',
      },
    })

    await AuditLogger.log({
      category: 'SERVICE',
      action: 'AI_CALLBACK_REQUESTED',
      message: `Front Desk callback task created for ${guestName}: ${reason}`,
      author: 'AI Receptionist',
      bookingId,
    })

    return task
  }
}
