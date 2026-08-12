import React from 'react'
import { prisma } from '@hospitality-os/database'
import { BookingsHeader } from '@/components/BookingsHeader'
import { BookingsTable } from '@/components/bookings/BookingsTable'
import { CalendarDays, UserCheck, AlertCircle, Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminBookingsPage() {
  // Fetch all bookings with user, allocations, room details, and payments
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

  // Fetch all rooms for allocation dropdown
  const allRooms = await prisma.room.findMany({
    include: { category: true },
    orderBy: { roomNumber: 'asc' }
  })

  const totalBookings = bookings.length
  
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
  
  const checkInsToday = bookings.filter(b => {
    const d = new Date(b.checkIn)
    return d >= todayStart && d <= todayEnd
  }).length

  const checkedInCount = bookings.filter(b => b.status === 'CHECKED_IN').length

  const pendingPaymentsCount = bookings.filter(b => 
    b.payments.some(p => p.status === 'PENDING')
  ).length

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Header */}
      <BookingsHeader />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bookings</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{totalBookings}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <CalendarDays size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Check-ins Today</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{checkInsToday}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <UserCheck size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Active Checked-In</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{checkedInCount}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Sparkles size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pay at Hotel / Pending</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{pendingPaymentsCount}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <AlertCircle size={20} />
          </div>
        </div>
      </div>

      {/* Bookings Table with Filters & Search */}
      <BookingsTable initialBookings={bookings} allRooms={allRooms} />
    </div>
  )
}
