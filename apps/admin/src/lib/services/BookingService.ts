import { prisma } from '@hospitality-os/database'
import { revalidatePath } from 'next/cache'

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path)
  } catch {
    // Ignore static generation store error outside Next.js request context
  }
}


export interface CheckInOptions {

  bookingId: string
  assignedRoomId: string
  authorName?: string
}

export interface CheckOutOptions {
  bookingId: string
  roomId?: string
  paymentMethod?: string
  authorName?: string
}

export class BookingService {
  /**
   * Check in a guest, set assigned room status to OCCUPIED, and create activity audit log.
   */
  static async checkInGuest(options: CheckInOptions) {
    const { bookingId, assignedRoomId, authorName = 'Front Desk' } = options

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { user: true, allocations: true },
    })

    if (!booking) {
      throw new Error('Booking not found')
    }

    // Idempotency: Return immediately if already checked in
    if (booking.status === 'CHECKED_IN') {
      console.log(`[BookingService:Idempotency] Booking ${booking.bookingRef} is already checked in. Skipping duplicate check-in.`)
      return booking
    }

    const room = await prisma.room.findUnique({
      where: { id: assignedRoomId },
    })

    if (!room) {
      throw new Error('Target room not found')
    }

    if (room.status !== 'AVAILABLE' && room.status !== 'READY') {
      throw new Error(`Room ${room.roomNumber} is currently ${room.status} and cannot be assigned for check-in.`)
    }


    const updatedBooking = await prisma.$transaction(async (tx) => {
      // 1. Update booking status
      const b = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CHECKED_IN',
          actualCheckIn: new Date(),
        },
      })

      // 2. Update room allocation
      if (booking.allocations.length > 0) {
        await tx.roomAllocation.update({
          where: { id: booking.allocations[0].id },
          data: { roomId: assignedRoomId },
        })
      } else {
        await tx.roomAllocation.create({
          data: {
            bookingId,
            roomId: assignedRoomId,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
          },
        })
      }

      // 3. Mark room as OCCUPIED
      await tx.room.update({
        where: { id: assignedRoomId },
        data: { status: 'OCCUPIED' },
      })

      // 4. Audit Log
      await tx.activityLog.create({
        data: {
          category: 'BOOKING',
          action: 'CHECK_IN',
          message: `Guest ${booking.user.name} checked in to Room ${room.roomNumber}`,
          author: authorName,
          bookingId,
          roomId: assignedRoomId,
        },
      })

      return b
    })

    revalidatePath('/bookings')
    revalidatePath(`/bookings/${bookingId}`)
    revalidatePath('/rooms')
    revalidatePath('/calendar')

    return updatedBooking
  }

  /**
   * Check out a guest, calculate total balance, settle payments, set room to DIRTY, and create cleaning task.
   */
  static async checkOutGuest(options: CheckOutOptions) {
    const { bookingId, roomId, paymentMethod = 'CASH', authorName = 'Front Desk' } = options

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
        allocations: { include: { room: true } },
        payments: true,
        orders: true,
        folioCharges: true,
      },
    })

    if (!booking) {
      throw new Error('Booking not found')
    }

    // Idempotency: Return immediately if already checked out
    if (booking.status === 'CHECKED_OUT' || booking.status === 'COMPLETED') {
      console.log(`[BookingService:Idempotency] Booking ${booking.bookingRef} is already checked out. Skipping duplicate checkout & billing.`)
      return booking
    }

    const targetRoomId = roomId || booking.allocations[0]?.roomId


    // Calculate total folio balance
    const totalPayments = booking.payments
      .filter((p) => p.status === 'COMPLETED' || p.status === 'SUCCESS')
      .reduce((sum, p) => sum + p.amount, 0)

    const totalOrders = booking.orders
      .filter((o) => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + o.totalAmount, 0)

    const totalFolioCharges = booking.folioCharges.reduce((sum, f) => sum + f.totalAmount, 0)

    const grandTotal = booking.totalAmount + totalOrders + totalFolioCharges
    const remainingBalance = Math.max(0, grandTotal - totalPayments)

    const result = await prisma.$transaction(async (tx) => {
      // 1. Record final settlement payment if balance remains
      if (remainingBalance > 0) {
        await tx.payment.create({
          data: {
            bookingId,
            userId: booking.userId,
            amount: remainingBalance,
            paymentMethod: paymentMethod as any,
            status: 'COMPLETED',
            transactionId: `SETTLE-${Date.now()}`,
          },
        })
      }

      // 2. Update booking status
      const b = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CHECKED_OUT',
          actualCheckOut: new Date(),
        },
      })

      // 3. Mark room as DIRTY if assigned
      if (targetRoomId) {
        const r = await tx.room.findUnique({ where: { id: targetRoomId } })
        await tx.room.update({
          where: { id: targetRoomId },
          data: { status: 'DIRTY' },
        })

        // 4. Auto-generate Housekeeping Cleaning task
        await tx.task.create({
          data: {
            type: 'CLEANING',
            title: 'CHECK_OUT_CLEAN',
            description: `Auto-generated post checkout cleaning for Guest ${booking.user.name} (Room ${r?.roomNumber || 'N/A'})`,
            priority: 'HIGH',
            status: 'PENDING',
            assignedStaff: 'Housekeeping Staff',
            roomId: targetRoomId,
            bookingId,
          },
        })
      }

      // 5. Activity Log
      await tx.activityLog.create({
        data: {
          category: 'BOOKING',
          action: 'CHECK_OUT',
          message: `Guest ${booking.user.name} checked out. Total settled: ₹${grandTotal.toLocaleString()}`,
          author: authorName,
          bookingId,
          roomId: targetRoomId,
        },
      })

      return b
    })

    safeRevalidatePath('/bookings')
    safeRevalidatePath(`/bookings/${bookingId}`)
    safeRevalidatePath('/rooms')
    safeRevalidatePath('/housekeeping')

    return result
  }


  /**
   * Add internal receptionist note to a booking
   */
  static async addNote(bookingId: string, content: string, authorName = 'Reception') {
    const note = await prisma.bookingNote.create({
      data: {
        bookingId,
        message: content,
        author: authorName,
      },
    })
    safeRevalidatePath(`/bookings/${bookingId}`)
    return note
  }

  /**
   * Cancel a booking
   */
  static async cancelBooking(bookingId: string) {
    return this.updateStatus(bookingId, 'CANCELLED')
  }

  /**
   * Check room availability for a category
   */
  static async checkAvailability(categoryId: string, checkIn?: Date, checkOut?: Date) {
    const availableRooms = await prisma.room.findMany({
      where: {
        roomCategoryId: categoryId,
        status: 'AVAILABLE',
      },
      include: { category: true },
    })
    return availableRooms
  }

  /**
   * Get booking by bookingRef
   */
  static async getByRef(bookingRef: string) {
    return prisma.booking.findUnique({
      where: { bookingRef },
      include: {
        user: true,
        allocations: { include: { room: true } },
        payments: true,
        folioCharges: true,
      },
    })
  }

  /**
   * Update booking status with room status synchronization
   */
  static async updateStatus(bookingId: string, status: string, roomId?: string) {

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: status as any },
    })

    if (roomId) {
      if (status === 'CHECKED_IN') {
        await prisma.room.update({ where: { id: roomId }, data: { status: 'OCCUPIED' } })
      } else if (status === 'CHECKED_OUT') {
        await prisma.room.update({ where: { id: roomId }, data: { status: 'DIRTY' } })
      } else if (status === 'CANCELLED' || status === 'COMPLETED') {
        const room = await prisma.room.findUnique({ where: { id: roomId } })
        if (room && room.status === 'OCCUPIED') {
          await prisma.room.update({ where: { id: roomId }, data: { status: 'AVAILABLE' } })
        }
      }
    }

    safeRevalidatePath('/bookings')
    safeRevalidatePath(`/bookings/${bookingId}`)
    safeRevalidatePath('/rooms')

    return booking
  }
}



