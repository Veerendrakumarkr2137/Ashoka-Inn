import { NextResponse } from 'next/server'
import { getAppConfig } from '@hospitality-os/utils'
import { BookingService } from '@/lib/services/BookingService'
import { AiReceptionService } from '@/lib/services/AiReceptionService'

type AllowedTool =
  | 'getBooking'
  | 'confirmBooking'
  | 'saveArrivalTime'
  | 'addGuestRequest'
  | 'createCallbackRequest'
  | 'saveCallResult'

export async function POST(req: Request) {
  try {
    const config = getAppConfig()
    const agentToken = req.headers.get('Authorization')?.replace('Bearer ', '') || req.headers.get('X-Agent-Secret')

    // Validate Auth Header
    if (config.nodeEnv === 'production' || agentToken) {
      const expectedToken = process.env.N8N_WEBHOOK_SECRET || config.authSecret
      if (expectedToken && agentToken !== expectedToken && agentToken !== config.jwtSecret) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized AI Tool invocation' },
          { status: 401 }
        )
      }
    }

    const body = await req.json()
    const { toolName, args } = body || {}

    if (!toolName) {
      return NextResponse.json(
        { success: false, error: 'Tool name is required' },
        { status: 400 }
      )
    }

    switch (toolName as AllowedTool) {
      case 'getBooking': {
        const { bookingRef, bookingId } = args || {}
        const refOrId = bookingRef || bookingId
        if (!refOrId) {
          return NextResponse.json({ success: false, error: 'bookingRef or bookingId is required' }, { status: 400 })
        }
        const safeContext = await AiReceptionService.getSafeBookingContext(refOrId)
        if (!safeContext) {
          return NextResponse.json({ success: false, error: `Booking not found for ${refOrId}` }, { status: 404 })
        }
        return NextResponse.json({ success: true, data: safeContext })
      }

      case 'confirmBooking': {
        const { bookingId, roomId } = args || {}
        if (!bookingId) {
          return NextResponse.json({ success: false, error: 'bookingId is required' }, { status: 400 })
        }
        const booking = await BookingService.updateStatus(bookingId, 'CONFIRMED', roomId)
        return NextResponse.json({
          success: true,
          bookingReference: booking.bookingRef,
          status: booking.status,
        })
      }

      case 'saveArrivalTime': {
        const { bookingId, arrivalTime } = args || {}
        if (!bookingId || !arrivalTime) {
          return NextResponse.json({ success: false, error: 'bookingId and arrivalTime are required' }, { status: 400 })
        }
        const result = await AiReceptionService.saveArrivalTime(bookingId, arrivalTime, 'ai_voice')
        return NextResponse.json(result)
      }

      case 'addGuestRequest': {
        const { bookingId, requestText } = args || {}
        if (!bookingId || !requestText) {
          return NextResponse.json({ success: false, error: 'bookingId and requestText are required' }, { status: 400 })
        }
        await BookingService.addNote(bookingId, `[Guest Request] ${requestText}`, 'AI Receptionist')
        return NextResponse.json({ success: true, message: 'Special request saved to booking' })
      }

      case 'createCallbackRequest': {
        const { bookingId, guestName, phone, reason, priority } = args || {}
        if (!reason) {
          return NextResponse.json({ success: false, error: 'reason is required for callback request' }, { status: 400 })
        }
        const task = await AiReceptionService.createCallbackRequest({ bookingId, guestName, phone, reason, priority })
        return NextResponse.json({ success: true, taskId: task.id, status: task.status })
      }

      case 'saveCallResult': {
        const { sessionId, bookingId, callStatus, outcome, language, duration, summary, sentiment, arrivalTime, guestRequest, escalationRequired } = args || {}
        if (!bookingId || !summary) {
          return NextResponse.json({ success: false, error: 'bookingId and summary are required' }, { status: 400 })
        }
        const result = await AiReceptionService.saveCallResult({
          sessionId,
          bookingId,
          callStatus: callStatus || 'COMPLETED',
          outcome: outcome || 'CALL_COMPLETED',
          language,
          duration,
          summary,
          sentiment,
          arrivalTime,
          guestRequest,
          escalationRequired,
        })
        return NextResponse.json(result)
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unauthorized tool name: ${toolName}. AI agents cannot execute arbitrary queries.` },
          { status: 403 }
        )
    }
  } catch (error: any) {
    console.error('[AI Tool Routing Error]', error)
    return NextResponse.json(
      { success: false, error: error.message || 'AI Tool execution failure' },
      { status: 500 }
    )
  }
}
