import { NextResponse } from 'next/server'
import { getAppConfig } from '@hospitality-os/utils'
import { AiReceptionService } from '@/lib/services/AiReceptionService'

export async function GET(req: Request) {
  try {
    const config = getAppConfig()
    const webhookSecret = req.headers.get('X-N8N-Webhook-Secret') || req.headers.get('Authorization')?.replace('Bearer ', '')

    // Validate n8n / API authentication secret
    if (config.nodeEnv === 'production' || webhookSecret) {
      const expectedSecret = process.env.N8N_WEBHOOK_SECRET || config.authSecret
      if (expectedSecret && webhookSecret !== expectedSecret) {
        return NextResponse.json({ success: false, error: 'Unauthorized n8n invocation' }, { status: 401 })
      }
    }

    const eligibleBookings = await AiReceptionService.getEligibleBookings()

    return NextResponse.json({
      success: true,
      count: eligibleBookings.length,
      bookings: eligibleBookings,
    })
  } catch (error: any) {
    console.error('[AI Reception Eligible Bookings Error]', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch eligible bookings' },
      { status: 500 }
    )
  }
}
