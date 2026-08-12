import React from 'react'
import { prisma } from '@hospitality-os/database'
import { getSession } from '@/actions/auth'
import { redirect } from 'next/navigation'
import { RoomServiceMenu } from '@/components/booking/RoomServiceMenu'

export const dynamic = 'force-dynamic'

export default async function RoomServicePage() {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }

  // Verify the guest has an active, checked-in booking today
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      bookings: {
        include: {
          allocations: { include: { room: true } }
        }
      }
    }
  })

  if (!user) {
    redirect('/login')
  }

  const today = new Date()
  const currentBooking = user.bookings.find(b => {
    const checkIn = new Date(b.checkIn)
    const checkOut = new Date(b.checkOut)
    return today >= checkIn && today <= checkOut && b.status === 'CHECKED_IN'
  })

  if (!currentBooking) {
    // If they aren't checked in, they can't order room service. Send them to profile.
    redirect('/profile')
  }

  const room = currentBooking.allocations[0]?.room

  // Fetch the menu catalog
  const categories = await prisma.serviceCategory.findMany({
    include: {
      services: {
        where: { isAvailable: true }
      }
    }
  })

  return (
    <main className="bg-[#F7F5F2] min-h-screen flex flex-col">
      
      <div className="flex-1 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-10">
            <h2 className="text-sm font-bold tracking-[0.2em] text-[#C6A96B] uppercase mb-2">
              In-Room Dining
            </h2>
            <h1 className="text-4xl md:text-5xl font-heading text-[#0F172A] mb-4">
              Room Service
            </h1>
            <p className="text-[#6B7280] text-lg max-w-2xl">
              Delivering to Room <span className="font-bold text-[#0F172A]">{room?.roomNumber || 'Unknown'}</span>. Browse our curated menu and enjoy fine dining from the comfort of your room.
            </p>
          </div>

          <RoomServiceMenu categories={categories} bookingId={currentBooking.id} />

        </div>
      </div>
    </main>
  )
}
