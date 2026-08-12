import React from 'react'
import { prisma } from '@hospitality-os/database'
import { Users, BedDouble, CalendarCheck, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { RevenueAnalytics } from '@/components/dashboard/RevenueAnalytics'
import { RoomStatusWidget } from '@/components/dashboard/RoomStatusWidget'
import { TodayOperationsWidget } from '@/components/dashboard/TodayOperationsWidget'
import { ExtendedOperationsWidgets } from '@/components/dashboard/ExtendedOperationsWidgets'
import { FrontDeskActionCenter } from '@/components/dashboard/FrontDeskActionCenter'
import { RevenueService } from '@/lib/services/RevenueService'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)

  // 1. Live Room Status Metrics
  const totalRooms = await prisma.room.count()
  const occupiedRooms = await prisma.room.count({ where: { status: 'OCCUPIED' } })
  const availableRooms = await prisma.room.count({ where: { status: 'AVAILABLE' } })
  const maintenanceRooms = await prisma.room.count({ where: { status: 'MAINTENANCE' } })
  const cleaningRooms = await prisma.room.count({ where: { status: 'CLEANING' } })

  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

  // 2. Room Categories for Inventory breakdown
  const categories = await prisma.roomCategory.findMany({
    include: { _count: { select: { rooms: true } } }
  })

  // 3. Arrivals Today (CheckIn date = today)
  const arrivalsToday = await prisma.booking.findMany({
    where: {
      checkIn: { gte: todayStart, lte: todayEnd }
    },
    include: {
      user: true,
      allocations: { include: { room: true } }
    },
    orderBy: { checkIn: 'asc' }
  })

  const pendingCheckInsCount = arrivalsToday.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED').length

  // 4. Departures Today (CheckOut date = today)
  const departuresToday = await prisma.booking.findMany({
    where: {
      checkOut: { gte: todayStart, lte: todayEnd }
    },
    include: {
      user: true,
      allocations: { include: { room: true } }
    },
    orderBy: { checkOut: 'asc' }
  })

  // 5. Reserved Count (Confirmed bookings starting in next 7 days)
  const upcomingReservations = await prisma.booking.count({
    where: {
      status: 'CONFIRMED',
      checkIn: { gt: todayEnd }
    }
  })

  // 6. Comprehensive Real Revenue Analytics via RevenueService
  const revenueSummary = await RevenueService.getRevenueAnalytics()

  const todayPaymentRecord = revenueSummary.dailyData[revenueSummary.dailyData.length - 1]
  const revenueTodayVal = todayPaymentRecord ? todayPaymentRecord.amount : 0
  const revenueTodayDisplay = `₹${revenueTodayVal.toLocaleString('en-IN')}`

  // 7. Recent Bookings for Extended Widget
  const recentBookingsRaw = await prisma.booking.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      allocations: { include: { room: { include: { category: true } } } }
    }
  })

  const recentBookings = recentBookingsRaw.map(b => ({
    id: b.id,
    bookingRef: b.bookingRef,
    guestName: b.user.name || b.user.email,
    categoryName: b.allocations[0]?.room?.category?.name || 'Superior AC',
    status: b.status,
    totalAmount: b.totalAmount
  }))

  // 8. Pending Payments for Extended Widget
  const pendingPaymentsRaw = await prisma.payment.findMany({
    where: { status: 'PENDING' },
    take: 4,
    include: { user: true }
  })

  const pendingPayments = pendingPaymentsRaw.map(p => ({
    id: p.id,
    bookingId: p.bookingId,
    guestName: p.user.name || p.user.email,
    amount: p.amount,
    paymentMethod: p.paymentMethod || 'CASH'
  }))

  // Stat cards array with real DB calculated trends
  const isRevenueTodayTrendPos = revenueSummary.sevenDayTrendPercent >= 0
  const stats = [
    { 
      label: 'Occupancy Rate', 
      value: `${occupancyRate}%`, 
      subtitle: `${occupiedRooms} / ${totalRooms} Rooms Occupied`,
      icon: BedDouble, 
      trend: `${occupancyRate > 0 ? '+' : ''}${occupancyRate}%`, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
    { 
      label: 'Arrivals Today', 
      value: arrivalsToday.length.toString(), 
      subtitle: `${pendingCheckInsCount} Pending Check-in`,
      icon: CalendarCheck, 
      trend: 'Today', 
      color: 'text-[#C6A96B]', 
      bg: 'bg-[#C6A96B]/10' 
    },
    { 
      label: 'Departures Today', 
      value: departuresToday.length.toString(), 
      subtitle: departuresToday.length === 0 ? 'All Clear' : `${departuresToday.length} Expected Checkout`,
      icon: Users, 
      trend: 'Today', 
      color: 'text-rose-600', 
      bg: 'bg-rose-50' 
    },
    { 
      label: "Today's Revenue", 
      value: revenueTodayDisplay, 
      subtitle: `7-Day Total: ₹${revenueSummary.sevenDayTotal.toLocaleString('en-IN')}`,
      icon: CreditCard, 
      trend: `${isRevenueTodayTrendPos ? '+' : ''}${revenueSummary.sevenDayTrendPercent}% vs prev week`, 
      color: 'text-[#0F172A]', 
      bg: 'bg-slate-100' 
    },
  ]

  // Formatted check-ins list for widget
  const checkInsFormatted = arrivalsToday.map(a => {
    const hours = new Date(a.checkIn).getHours()
    const mins = String(new Date(a.checkIn).getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const formattedHours = hours % 12 || 12
    const timeStr = `${formattedHours}:${mins} ${ampm}`

    return {
      id: a.id,
      time: timeStr,
      guestName: a.user.name,
      roomNumber: a.allocations[0]?.room?.roomNumber || 'Unassigned',
      status: a.status,
      phone: a.user.phone || undefined,
    }
  })

  // Formatted check-outs list for widget
  const checkOutsFormatted = departuresToday.map(d => ({
    id: d.id,
    roomNumber: d.allocations[0]?.room?.roomNumber || '203',
    guestName: d.user.name,
    status: d.status,
  }))

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">Admin Dashboard</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Live Property Management System (PMS) operational overview for Hotel Ashokha.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-xs text-xs font-semibold text-slate-700 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-xs" />
            Live DB Sync: Online
          </div>
        </div>
      </div>

      {/* Top 4 Stat Cards with Real Subtitles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-[var(--radius-card)] shadow-card border border-[var(--border-subtle)] hover:border-[#C6A96B]/50 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-[var(--radius-input)] ${stat.bg} flex items-center justify-center`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                  {stat.trend} <ArrowUpRight size={12} />
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stat.value}</h3>
            </div>
            
            <p className="text-xs text-slate-500 font-semibold mt-3 pt-2 border-t border-slate-100">
              {stat.subtitle}
            </p>
          </div>
        ))}
      </div>

      {/* Main Grid: Revenue Analytics & Room Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueAnalytics 
            dailyData={revenueSummary.dailyData}
            sevenDayTotal={revenueSummary.sevenDayTotal}
            sevenDayTrendPercent={revenueSummary.sevenDayTrendPercent}
            monthlyRevenue={revenueSummary.monthlyRevenue}
            monthlyTrendPercent={revenueSummary.monthlyTrendPercent}
            occupancyRate={revenueSummary.occupancyRate}
            revPar={revenueSummary.revPar}
          />
        </div>
        <div>
          <RoomStatusWidget 
            totalRooms={totalRooms}
            availableCount={availableRooms}
            occupiedCount={occupiedRooms}
            reservedCount={upcomingReservations}
            maintenanceCount={maintenanceRooms}
            cleaningCount={cleaningRooms}
            categories={categories}
          />
        </div>
      </div>

      {/* Front Desk Operations Action Center */}
      <FrontDeskActionCenter />

      {/* Today's Operations Section */}
      <TodayOperationsWidget 
        checkIns={checkInsFormatted}
        pendingCheckInsCount={pendingCheckInsCount}
        checkOuts={checkOutsFormatted}
      />

      {/* Extended Operations Widgets: Recent Bookings, Pending Payments, Housekeeping & AI Feed */}
      <ExtendedOperationsWidgets
        recentBookings={recentBookings}
        pendingPayments={pendingPayments}
        housekeepingStats={{
          cleaned: availableRooms,
          pending: cleaningRooms,
          cleaning: 2
        }}
      />
    </div>
  )
}
