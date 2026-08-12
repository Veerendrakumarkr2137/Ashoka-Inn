import { NextResponse } from 'next/server'
import { BookingService } from '@/lib/services/BookingService'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { bookingId, roomId, paymentMethod, authorName } = body

    if (!bookingId) {
      return NextResponse.json({ success: false, error: 'Missing bookingId' }, { status: 400 })
    }

    const booking = await BookingService.checkOutGuest({ bookingId, roomId, paymentMethod, authorName })
    return NextResponse.json({ success: true, booking })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Check-out failed' }, { status: 500 })
  }
}
