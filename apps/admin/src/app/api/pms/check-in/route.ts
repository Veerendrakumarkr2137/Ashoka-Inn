import { NextResponse } from 'next/server'
import { BookingService } from '@/lib/services/BookingService'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { bookingId, assignedRoomId, authorName } = body

    if (!bookingId || !assignedRoomId) {
      return NextResponse.json({ success: false, error: 'Missing bookingId or assignedRoomId' }, { status: 400 })
    }

    const booking = await BookingService.checkInGuest({ bookingId, assignedRoomId, authorName })
    return NextResponse.json({ success: true, booking })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Check-in failed' }, { status: 500 })
  }
}
