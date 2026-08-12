import React from 'react'
import { prisma } from '@hospitality-os/database'
import { CalendarTimelineGrid } from './components/CalendarTimelineGrid'

export const dynamic = 'force-dynamic'

export default async function CalendarPage() {
  const rooms = await prisma.room.findMany({
    include: {
      category: true,
    },
    orderBy: {
      roomNumber: 'asc'
    }
  })

  const categories = await prisma.roomCategory.findMany({
    orderBy: { basePrice: 'desc' }
  })

  // Fetch active allocations with booking and guest info
  const rawAllocations = await prisma.roomAllocation.findMany({
    include: {
      booking: {
        include: {
          user: true
        }
      }
    }
  })

  // Format serializable allocations for client component
  const allocations = rawAllocations.map(a => ({
    id: a.id,
    roomId: a.roomId,
    checkIn: a.checkIn.toISOString(),
    checkOut: a.checkOut.toISOString(),
    booking: {
      id: a.booking.id,
      bookingRef: a.booking.bookingRef,
      status: a.booking.status,
      totalAmount: a.booking.totalAmount,
      adults: a.booking.adults,
      children: a.booking.children,
      specialRequests: a.booking.specialRequests,
      user: {
        name: a.booking.user.name,
        email: a.booking.user.email,
        phone: a.booking.user.phone,
      }
    }
  }))

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Horizontal Reservation Calendar</h1>
          <p className="text-sm text-slate-500 mt-1">
            Visual room Gantt chart displaying physical rooms vs reservation stay dates.
          </p>
        </div>
      </div>

      {/* Main Grid View Component */}
      <CalendarTimelineGrid 
        rooms={rooms.map(r => ({
          id: r.id,
          roomNumber: r.roomNumber,
          status: r.status,
          category: {
            name: r.category.name,
            basePrice: r.category.basePrice
          }
        }))} 
        allocations={allocations}
        categories={categories.map(c => ({ id: c.id, name: c.name }))}
      />
    </div>
  )
}
