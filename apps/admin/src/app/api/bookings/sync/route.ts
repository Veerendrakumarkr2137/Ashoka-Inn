import { NextResponse } from 'next/server'
import { prisma } from '@hospitality-os/database'

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        allocations: {
          include: {
            room: {
              include: { category: true }
            }
          }
        },
        payments: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      count: bookings.length,
      latestId: bookings[0]?.id || null,
      latestBooking: bookings[0] || null,
      bookings
    })
  } catch (error: any) {
    console.error('Error syncing bookings:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
