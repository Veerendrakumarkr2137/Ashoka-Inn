import { NextResponse } from 'next/server'
import { getAppConfig } from '@hospitality-os/utils'
import { getWhatsAppProvider, getVoiceProvider } from '@/lib/providers'
import { AiReceptionService } from '@/lib/services/AiReceptionService'

export async function POST(req: Request) {
  try {
    const config = getAppConfig()
    const secret = req.headers.get('X-N8N-Webhook-Secret')

    // Authenticate n8n webhook secret
    if (config.nodeEnv === 'production' || secret) {
      const expectedSecret = process.env.N8N_WEBHOOK_SECRET || config.authSecret
      if (expectedSecret && secret !== expectedSecret) {
        return NextResponse.json({ success: false, error: 'Unauthorized n8n webhook' }, { status: 401 })
      }
    }

    const { action, bookingId, bookingRef, payload } = await req.json()

    console.log(`[n8n Webhook] Received action: ${action} for bookingId: ${bookingId || bookingRef}`)

    switch (action) {
      case 'TRIGGER_PRE_ARRIVAL_CALL': {
        if (!bookingId && !bookingRef) {
          return NextResponse.json({ success: false, error: 'bookingId or bookingRef is required' }, { status: 400 })
        }

        const safeContext = await AiReceptionService.getSafeBookingContext(bookingId || bookingRef)
        if (!safeContext) {
          return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 })
        }

        // Create persistent AI Call Session
        const session = await AiReceptionService.createCallSession(safeContext.bookingId, config.providers.voice)


        // Initiate Voice Provider call (Mock or LiveKit)
        const voiceProvider = getVoiceProvider()
        const callResult = await voiceProvider.startOutboundCall({
          toPhone: safeContext.guestPhone || '+919876543210',
          bookingRef: safeContext.bookingRef,
          guestName: safeContext.guestName,
          promptMessage: `Pre-arrival check-in call for ${safeContext.roomCategory}`,
        })



        // Idempotent Call Result Processing
        await AiReceptionService.saveCallResult({
          sessionId: session.id,
          bookingId: safeContext.bookingId,
          callStatus: 'COMPLETED',
          outcome: 'PRE_ARRIVAL_CONFIRMED',
          language: 'en-IN',
          duration: 45,
          summary: `[Mock AI Pre-Arrival Call] Guest ${safeContext.guestName} confirmed reservation for ${safeContext.checkIn.split('T')[0]}. Expected arrival time: 3:00 PM.`,
          sentiment: 'POSITIVE',
          arrivalTime: payload?.arrivalTime || '15:00',
          guestRequest: payload?.guestRequest || 'Quiet room preferred',
        })

        return NextResponse.json({
          success: true,
          action,
          sessionId: session.id,
          callResult,
        })
      }

      case 'PROCESS_AI_CALL_RESULT': {
        if (!bookingId || !payload?.summary) {
          return NextResponse.json({ success: false, error: 'bookingId and payload.summary are required' }, { status: 400 })
        }

        const result = await AiReceptionService.saveCallResult({
          sessionId: payload?.sessionId,
          bookingId,
          callStatus: payload?.callStatus || 'COMPLETED',
          outcome: payload?.outcome || 'PRE_ARRIVAL_CALL_PROCESSED',
          language: payload?.language || 'en-IN',
          duration: payload?.duration || 30,
          summary: payload.summary,
          sentiment: payload?.sentiment || 'NEUTRAL',
          arrivalTime: payload?.arrivalTime,
          guestRequest: payload?.guestRequest,
          escalationRequired: payload?.escalationRequired || false,
        })

        return NextResponse.json({ success: true, action, result })
      }

      case 'SEND_CHECKIN_VOUCHER': {
        const whatsapp = getWhatsAppProvider()
        const result = await whatsapp.sendTemplateMessage(
          payload?.phone || '+919876543210',
          'booking_voucher',
          { bookingRef: bookingRef || 'BKG-DEFAULT', voucherUrl: payload?.voucherUrl || 'https://ashokainn.com/vouchers/default.pdf' }
        )
        return NextResponse.json({ success: true, action, result })
      }

      default:
        return NextResponse.json({ success: false, error: `Unknown n8n action: ${action}` }, { status: 400 })
    }
  } catch (error: any) {
    console.error('[n8n Webhook Error]', error)
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 })
  }
}
