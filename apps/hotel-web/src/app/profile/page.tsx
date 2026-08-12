import React from 'react'
import { prisma } from '@hospitality-os/database'
import { getSession } from '@/actions/auth'
import { redirect } from 'next/navigation'
import { ProfileClient } from './ProfileClient'
import { SITE_IMAGES } from '@/config/siteImages'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      bookings: {
        include: {
          allocations: { include: { room: { include: { category: true } } } },
          payments: true,
          orders: true,
        },
        orderBy: { checkIn: 'desc' },
      },
    },
  })

  if (!user) {
    redirect('/login')
  }

  const today = new Date()

  // Map bookings into serializable format
  const mappedBookings = user.bookings.map((b) => {
    const categoryName = b.allocations[0]?.room?.category?.name || 'Deluxe Room'
    let roomImage = SITE_IMAGES.rooms['deluxe-non-ac'][0]

    if (categoryName.toLowerCase().includes('suite')) {
      roomImage = SITE_IMAGES.rooms['king-suite'][0]
    } else if (categoryName.toLowerCase().includes('family')) {
      roomImage = SITE_IMAGES.rooms['family-ac'][0]
    } else if (categoryName.toLowerCase().includes('superior')) {
      roomImage = SITE_IMAGES.rooms['superior-ac'][0]
    }

    const paidInFull = b.payments.some((p) => p.status === 'COMPLETED' || p.status === 'SUCCESS')

    return {
      id: b.id,
      bookingRef: b.bookingRef,
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      adults: b.adults,
      children: b.children,
      totalAmount: b.totalAmount,
      status: b.status,
      roomName: categoryName,
      roomImage,
      paidInFull,
    }
  })

  const upcomingBookings = mappedBookings.filter(
    (b) => new Date(b.checkOut) >= today && b.status !== 'CANCELLED'
  )
  const pastBookings = mappedBookings.filter(
    (b) => new Date(b.checkOut) < today || b.status === 'CANCELLED'
  )

  const currentBooking = upcomingBookings.find((b) => {
    const checkIn = new Date(b.checkIn)
    const checkOut = new Date(b.checkOut)
    return today >= checkIn && today <= checkOut && b.status === 'CHECKED_IN'
  }) || null

  return (
    <ProfileClient
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
      }}
      upcomingBookings={upcomingBookings}
      pastBookings={pastBookings}
      currentBooking={currentBooking}
    />
  )
}
