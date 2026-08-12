'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Filter, Plus, User, Phone, CheckCircle2, Clock, 
  ArrowUpRight, AlertCircle, Sparkles
} from 'lucide-react'
import { cn } from '@hospitality-os/utils'

interface RoomItem {
  id: string
  roomNumber: string
  status: string
  category: {
    name: string
    basePrice: number
  }
}

interface BookingAllocation {
  id: string
  roomId: string
  checkIn: Date | string
  checkOut: Date | string
  booking: {
    id: string
    bookingRef: string
    status: string
    totalAmount: number
    adults: number
    children: number
    specialRequests?: string | null
    user: {
      name: string | null
      email: string
      phone?: string | null
    }
  }
}

interface CalendarTimelineGridProps {
  rooms: RoomItem[]
  allocations: BookingAllocation[]
  categories: { id: string; name: string }[]
}

export function CalendarTimelineGrid({ rooms, allocations, categories }: CalendarTimelineGridProps) {
  // Start date for the 14-day window (default to today)
  const [startDate, setStartDate] = useState<Date>(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  })

  // Selected Category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')

  // Number of days to render (14 days)
  const daysCount = 14

  // Generate date range array
  const dateList: Date[] = Array.from({ length: daysCount }, (_, i) => {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    return d
  })

  // Format date helper (YYYY-MM-DD)
  const formatDateKey = (d: Date) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Navigation handlers
  const handlePrevWeek = () => {
    const d = new Date(startDate)
    d.setDate(d.getDate() - 7)
    setStartDate(d)
  }

  const handleNextWeek = () => {
    const d = new Date(startDate)
    d.setDate(d.getDate() + 7)
    setStartDate(d)
  }

  const handleToday = () => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    setStartDate(d)
  }

  // Filter rooms by category
  const filteredRooms = rooms.filter(r => 
    selectedCategory === 'ALL' || r.category.name === selectedCategory
  )

  // Map allocations for quick lookup by roomId
  // An allocation spans from checkIn to checkOut
  const getBookingForRoomAndDate = (roomId: string, targetDate: Date) => {
    const targetTime = targetDate.getTime()

    return allocations.find(alloc => {
      if (alloc.roomId !== roomId) return false
      
      const cIn = new Date(alloc.checkIn)
      cIn.setHours(0, 0, 0, 0)

      const cOut = new Date(alloc.checkOut)
      cOut.setHours(0, 0, 0, 0)

      return targetTime >= cIn.getTime() && targetTime < cOut.getTime()
    })
  }

  // Calculate position & span for a reservation bar
  const getBarConfigForBooking = (alloc: BookingAllocation, dateRange: Date[]) => {
    const firstDate = dateRange[0]
    const lastDate = dateRange[dateRange.length - 1]

    const cIn = new Date(alloc.checkIn)
    cIn.setHours(0, 0, 0, 0)

    const cOut = new Date(alloc.checkOut)
    cOut.setHours(0, 0, 0, 0)

    // Calculate start index in current 14-day window
    let startIndex = -1
    for (let i = 0; i < dateRange.length; i++) {
      if (formatDateKey(dateRange[i]) === formatDateKey(cIn)) {
        startIndex = i
        break
      }
    }

    // If starts before window, clamp to 0
    const effectiveStartIndex = startIndex >= 0 ? startIndex : (cIn < firstDate ? 0 : -1)
    if (effectiveStartIndex < 0) return null

    // Calculate span in days
    const totalDays = Math.max(1, Math.round((cOut.getTime() - cIn.getTime()) / (1000 * 3600 * 24)))
    
    // Remaining days in view from start index
    const spanDays = Math.min(totalDays - (effectiveStartIndex - (startIndex >= 0 ? startIndex : 0)), daysCount - effectiveStartIndex)

    return {
      startIndex: effectiveStartIndex,
      spanDays: Math.max(1, spanDays),
      isStartOfStay: cIn >= firstDate,
      isEndOfStay: cOut <= new Date(lastDate.getTime() + 86400000)
    }
  }

  // Count active reservations in current view
  const activeInViewCount = allocations.filter(alloc => {
    const cIn = new Date(alloc.checkIn)
    const cOut = new Date(alloc.checkOut)
    const viewStart = dateList[0]
    const viewEnd = new Date(dateList[dateList.length - 1].getTime() + 86400000)
    return cIn < viewEnd && cOut > viewStart
  }).length

  return (
    <div className="space-y-6">
      {/* Top Header & Toolbar Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#C6A96B]/10 text-[#C6A96B] rounded-xl border border-[#C6A96B]/20">
            <CalendarIcon size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Interactive Reservation Timeline</h2>
            <p className="text-xs text-slate-500 font-medium">
              Showing 14-day booking span from <strong className="text-slate-800">{startDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
            </p>
          </div>
        </div>

        {/* Date Navigation & Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
            <Filter size={14} className="text-slate-400" />
            <span>Category:</span>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-slate-900 font-bold focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Categories ({rooms.length})</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Date Shift Buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
            <button 
              onClick={handlePrevWeek}
              className="p-1.5 hover:bg-white rounded-lg transition-colors text-slate-600 hover:text-slate-900"
              title="Previous 7 Days"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={handleToday}
              className="px-3 py-1 bg-white shadow-xs rounded-lg text-slate-900 hover:bg-slate-50 transition-colors"
            >
              Today
            </button>
            <button 
              onClick={handleNextWeek}
              className="p-1.5 hover:bg-white rounded-lg transition-colors text-slate-600 hover:text-slate-900"
              title="Next 7 Days"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <Link
            href="/bookings"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Plus size={15} />
            <span>New Booking</span>
          </Link>
        </div>
      </div>

      {/* Main Gantt Grid Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
        
        {/* Timeline Header Info */}
        <div className="p-4 bg-slate-50/60 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> 🟢 Checked-In / Confirmed</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> 🟡 Reserved / Pending</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block"></span> ⚫ Maintenance</span>
          </div>
          <span className="font-bold text-slate-700">{activeInViewCount} Active Reservations in View</span>
        </div>

        {/* Scrollable Horizontal Table Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 text-xs font-bold border-b border-slate-200">
                {/* Room Sticky Column */}
                <th className="w-44 px-4 py-3 sticky left-0 bg-slate-100 z-20 border-r border-slate-200 text-slate-900 uppercase tracking-wider font-extrabold text-[11px]">
                  Room / Category
                </th>

                {/* 14 Date Columns */}
                {dateList.map((date) => {
                  const isToday = formatDateKey(date) === formatDateKey(new Date())
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
                  const dayNum = date.getDate()
                  const monthName = date.toLocaleDateString('en-US', { month: 'short' })

                  return (
                    <th 
                      key={date.toISOString()}
                      className={cn(
                        'py-2 px-1 text-center border-r border-slate-200/80 transition-colors',
                        isToday ? 'bg-amber-500/10 text-amber-900 font-black' : 'text-slate-600'
                      )}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400">{dayName}</span>
                        <span className={cn('text-sm font-extrabold font-mono', isToday && 'text-amber-700 ring-2 ring-amber-500/40 rounded-md px-1 bg-amber-100')}>
                          {dayNum}
                        </span>
                        <span className="text-[9px] text-slate-400">{monthName}</span>
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredRooms.map((room) => {
                // Find all allocations for this room
                const roomAllocations = allocations.filter(a => a.roomId === room.id)

                return (
                  <tr key={room.id} className="hover:bg-slate-50/50 transition-colors group">
                    {/* Room Identifier Header (Sticky Left) */}
                    <td className="px-4 py-3 sticky left-0 bg-white group-hover:bg-slate-50 z-10 border-r border-slate-200 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-slate-900 font-mono text-sm">
                            Room {room.roomNumber}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold truncate max-w-[110px]">
                            {room.category.name}
                          </span>
                        </div>

                        {/* Status Icon Indicator */}
                        {room.status === 'AVAILABLE' && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">🟢</span>}
                        {room.status === 'OCCUPIED' && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-extrabold">🔴</span>}
                        {room.status === 'CLEANING' && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-extrabold">🟣</span>}
                        {room.status === 'MAINTENANCE' && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-800 font-extrabold">⚫</span>}
                      </div>
                    </td>

                    {/* 14 Date Cells for this room */}
                    {dateList.map((targetDate) => {
                      const activeAlloc = getBookingForRoomAndDate(room.id, targetDate)
                      const isToday = formatDateKey(targetDate) === formatDateKey(new Date())

                      if (!activeAlloc) {
                        return (
                          <td 
                            key={targetDate.toISOString()}
                            className={cn(
                              'p-1 border-r border-slate-100 text-center relative group/cell hover:bg-emerald-50/40 transition-colors cursor-pointer',
                              isToday && 'bg-slate-50/60'
                            )}
                          >
                            <Link 
                              href={`/bookings?new=true&roomId=${room.id}&date=${formatDateKey(targetDate)}`}
                              className="inset-0 absolute opacity-0 group-hover/cell:opacity-100 flex items-center justify-center text-emerald-600 bg-emerald-100/60 backdrop-blur-xs font-bold text-[10px] rounded-sm transition-opacity"
                              title={`Book Room ${room.roomNumber} for ${targetDate.toLocaleDateString()}`}
                            >
                              + Book
                            </Link>
                          </td>
                        )
                      }

                      // Check if this targetDate is the start date of the booking allocation
                      const allocCheckIn = new Date(activeAlloc.checkIn)
                      allocCheckIn.setHours(0, 0, 0, 0)
                      const isStartDay = formatDateKey(allocCheckIn) === formatDateKey(targetDate)
                      const isFirstColumn = formatDateKey(targetDate) === formatDateKey(dateList[0])

                      // Only render the reservation block if it's the start day OR the first visible column in view
                      if (isStartDay || isFirstColumn) {
                        const barConfig = getBarConfigForBooking(activeAlloc, dateList)
                        if (!barConfig) return null

                        const bk = activeAlloc.booking
                        const isConfirmed = bk.status === 'CONFIRMED' || bk.status === 'CHECKED_IN'

                        return (
                          <td 
                            key={targetDate.toISOString()}
                            colSpan={barConfig.spanDays}
                            className="p-1 border-r border-slate-100 relative"
                          >
                            <Link
                              href={`/bookings/${bk.id}`}
                              className={cn(
                                'block p-2 rounded-xl border text-left shadow-xs transition-all hover:scale-[1.01] hover:shadow-md group/bar relative overflow-hidden',
                                isConfirmed 
                                  ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700' 
                                  : 'bg-amber-500 text-slate-900 border-amber-600 hover:bg-amber-600'
                              )}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-extrabold text-xs truncate max-w-[120px]">
                                  {bk.user.name || bk.bookingRef}
                                </span>
                                <span className="text-[10px] font-mono opacity-90 font-bold shrink-0">
                                  ₹{bk.totalAmount.toLocaleString()}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-[10px] mt-0.5 opacity-90 font-semibold">
                                <span className="truncate">
                                  {bk.adults}A {bk.children > 0 ? `${bk.children}C` : ''} • Ref: {bk.bookingRef}
                                </span>
                                <ArrowUpRight size={12} className="opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                              </div>
                            </Link>
                          </td>
                        )
                      }

                      // If colSpan covers this cell, skip rendering
                      return null
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
