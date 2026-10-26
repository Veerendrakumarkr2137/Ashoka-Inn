'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Search, Eye, Edit, Phone, Mail, XCircle, Filter, CheckCircle2, 
  UserCheck, AlertTriangle, Volume2, VolumeX, BellRing, Sparkles, ArrowRight, X 
} from 'lucide-react'
import { EditBookingModal } from './EditBookingModal'
import { cancelBooking } from '@/actions/bookings'
import { playHotelBellChime } from '@/utils/audioChime'

interface BookingsTableProps {
  initialBookings: any[]
  allRooms: any[]
}

type FilterTab = 'ALL' | 'TODAY' | 'TOMORROW' | 'UPCOMING' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | 'PENDING'

export function BookingsTable({ initialBookings, allRooms }: BookingsTableProps) {
  const router = useRouter()
  const [bookings, setBookings] = useState<any[]>(initialBookings)
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBookingForEdit, setSelectedBookingForEdit] = useState<any | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  // Real-time Sound & New Booking Notification State
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)
  const [newBookingAlert, setNewBookingAlert] = useState<{ show: boolean; booking: any | null }>({ show: false, booking: null })
  const [highlightedBookingId, setHighlightedBookingId] = useState<string | null>(null)

  const tabs: { id: FilterTab; label: string }[] = [
    { id: 'ALL', label: 'All Bookings' },
    { id: 'TODAY', label: 'Today' },
    { id: 'TOMORROW', label: 'Tomorrow' },
    { id: 'UPCOMING', label: 'Upcoming' },
    { id: 'CHECKED_IN', label: 'Checked-in' },
    { id: 'CHECKED_OUT', label: 'Checked-out' },
    { id: 'CANCELLED', label: 'Cancelled' },
    { id: 'PENDING', label: 'Pending' },
  ]

  // ─── BACKGROUND SILENT POLLING FOR REALTIME RESERVATIONS ──────────────────────
  useEffect(() => {
    let isMounted = true

    const pollReservations = async () => {
      try {
        const res = await fetch('/api/bookings/sync', { cache: 'no-store' }).then((r) => r.json())
        if (!isMounted || !res.success || !res.bookings) return

        setBookings((currentBookings) => {
          const currentCount = currentBookings.length
          const currentLatestId = currentBookings[0]?.id

          // Check if new booking arrived
          if (res.count > currentCount || (res.latestId && res.latestId !== currentLatestId)) {
            const latestBooking = res.latestBooking

            // 1. Play Hotel Bell Chime Sound
            if (isSoundEnabled) {
              playHotelBellChime()
            }

            // 2. Trigger Slide-in Notification Toast
            if (latestBooking) {
              setNewBookingAlert({ show: true, booking: latestBooking })
              setHighlightedBookingId(latestBooking.id)

              // Auto-dismiss glow highlight after 8 seconds
              setTimeout(() => {
                setHighlightedBookingId(null)
              }, 8000)
            }

            return res.bookings
          }

          return res.bookings
        })
      } catch (err) {
        console.warn('Silent booking sync error:', err)
      }
    }

    // Poll every 6 seconds silently in the background
    const interval = setInterval(pollReservations, 6000)
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [isSoundEnabled])

  const filteredBookings = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return bookings.filter((b) => {
      const q = searchQuery.toLowerCase().trim()
      const roomNum = b.allocations[0]?.room?.roomNumber || ''
      const guestName = b.user?.name || ''
      const guestPhone = b.user?.phone || ''
      const ref = b.bookingRef || ''

      const matchesSearch =
        !q ||
        ref.toLowerCase().includes(q) ||
        guestName.toLowerCase().includes(q) ||
        guestPhone.toLowerCase().includes(q) ||
        roomNum.toLowerCase().includes(q)

      if (!matchesSearch) return false

      const checkInDate = new Date(b.checkIn)
      checkInDate.setHours(0, 0, 0, 0)

      const checkOutDate = new Date(b.checkOut)
      checkOutDate.setHours(0, 0, 0, 0)

      switch (activeTab) {
        case 'TODAY':
          return checkInDate.getTime() === today.getTime() || checkOutDate.getTime() === today.getTime()
        case 'TOMORROW':
          return checkInDate.getTime() === tomorrow.getTime()
        case 'UPCOMING':
          return checkInDate.getTime() > tomorrow.getTime() && b.status !== 'CANCELLED'
        case 'CHECKED_IN':
          return b.status === 'CHECKED_IN'
        case 'CHECKED_OUT':
          return b.status === 'CHECKED_OUT'
        case 'CANCELLED':
          return b.status === 'CANCELLED'
        case 'PENDING':
          return b.status === 'PENDING'
        case 'ALL':
        default:
          return true
      }
    })
  }, [bookings, activeTab, searchQuery])

  const handleQuickCancel = async (e: React.MouseEvent, bookingId: string) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to cancel this reservation?')) {
      setCancellingId(bookingId)
      await cancelBooking(bookingId)
      setCancellingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 text-xs font-bold bg-blue-50 text-blue-700 rounded-full border border-blue-200">🟢 CONFIRMED</span>
      case 'CHECKED_IN':
        return <span className="px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">🔴 CHECKED-IN</span>
      case 'CHECKED_OUT':
        return <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-700 rounded-full border border-slate-200">⚫ CHECKED-OUT</span>
      case 'CANCELLED':
        return <span className="px-2.5 py-1 text-xs font-bold bg-rose-50 text-rose-700 rounded-full border border-rose-200">❌ CANCELLED</span>
      case 'PENDING':
        return <span className="px-2.5 py-1 text-xs font-bold bg-amber-50 text-amber-700 rounded-full border border-amber-200">🟡 PENDING</span>
      default:
        return <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-600 rounded-full">{status}</span>
    }
  }

  return (
    <div className="space-y-4 relative">
      {/* REAL-TIME SLIDE-IN NEW BOOKING NOTIFICATION TOAST */}
      {newBookingAlert.show && newBookingAlert.booking && (
        <div className="fixed top-20 right-6 z-50 max-w-md w-full bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border-2 border-emerald-500 animate-in slide-in-from-top-5 duration-300 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 animate-pulse">
            <BellRing size={20} />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={12} /> New Reservation Received!
              </span>
              <button
                onClick={() => setNewBookingAlert({ show: false, booking: null })}
                className="text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-sm font-extrabold text-white">
              {newBookingAlert.booking.user?.name} ({newBookingAlert.booking.bookingRef})
            </p>
            <p className="text-xs text-slate-300">
              Room: <strong className="text-[#C6A96B]">{newBookingAlert.booking.allocations[0]?.room?.roomNumber || 'Unassigned'}</strong> • Total: <strong className="text-emerald-400">₹{newBookingAlert.booking.totalAmount?.toLocaleString('en-IN')}</strong>
            </p>
            <div className="pt-1">
              <Link
                href={`/bookings/${newBookingAlert.booking.id}`}
                onClick={() => setNewBookingAlert({ show: false, booking: null })}
                className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-400 hover:text-emerald-300 underline"
              >
                Open Booking Details <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs & Real-time Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 dark-scrollbar flex-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                suppressHydrationWarning
                className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Real-time Sound Alert Toggle */}
        <button
          type="button"
          onClick={() => setIsSoundEnabled(!isSoundEnabled)}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            isSoundEnabled
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-xs'
              : 'bg-slate-100 border-slate-200 text-slate-500'
          }`}
          title="Toggle Front Desk Bell Sound Alert for New Reservations"
          suppressHydrationWarning
        >
          {isSoundEnabled ? (
            <>
              <Volume2 size={15} className="text-emerald-600 animate-bounce" />
              <span>Bell Sound On</span>
            </>
          ) : (
            <>
              <VolumeX size={15} className="text-slate-400" />
              <span>Sound Muted</span>
            </>
          )}
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
        {/* Search & Counter Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, guest, phone, room..."
              suppressHydrationWarning
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C6A96B] transition-all"
            />
          </div>

          <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Live Sync Active
            </span>
            <span>
              Showing <span className="text-slate-900">{filteredBookings.length}</span> of {bookings.length} Bookings
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Booking ID</th>
                <th className="px-6 py-3.5">Guest</th>
                <th className="px-6 py-3.5">Phone</th>
                <th className="px-6 py-3.5">Room</th>
                <th className="px-6 py-3.5">Check-in</th>
                <th className="px-6 py-3.5">Check-out</th>
                <th className="px-6 py-3.5">Payment</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                    No matching bookings found for this filter tab.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const room = b.allocations[0]?.room
                  const payment = b.payments[0]
                  const isPaid = payment?.status === 'COMPLETED'
                  const isNewlyArrived = highlightedBookingId === b.id

                  return (
                    <tr
                      key={b.id}
                      onClick={() => router.push(`/bookings/${b.id}`)}
                      className={`transition-colors cursor-pointer group ${
                        isNewlyArrived
                          ? 'bg-emerald-100/80 hover:bg-emerald-100 border-l-4 border-emerald-600 animate-pulse'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Booking ID */}
                      <td className="px-6 py-4">
                        <span className="font-extrabold text-slate-900 font-mono group-hover:text-[#C6A96B] transition-colors flex items-center gap-1.5">
                          {b.bookingRef}
                          {isNewlyArrived && (
                            <span className="bg-emerald-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                              NEW
                            </span>
                          )}
                        </span>
                      </td>

                      {/* Guest */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-xs">
                            {b.user?.name?.charAt(0) || 'G'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{b.user?.name}</p>
                            <p className="text-[11px] text-slate-400">{b.user?.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        {b.user?.phone ? (
                          <a
                            href={`tel:${b.user.phone}`}
                            className="font-bold text-slate-700 hover:text-emerald-600 flex items-center gap-1.5 hover:underline"
                          >
                            <Phone size={13} className="text-emerald-600" />
                            {b.user.phone}
                          </a>
                        ) : (
                          <span className="text-slate-400">N/A</span>
                        )}
                      </td>

                      {/* Room */}
                      <td className="px-6 py-4">
                        {room ? (
                          <div>
                            <span className="font-bold text-slate-900 bg-amber-50 px-2 py-0.5 rounded text-amber-800">
                              Room {room.roomNumber}
                            </span>
                            <p className="text-[10px] text-slate-500 mt-0.5">{room.category?.name}</p>
                          </div>
                        ) : (
                          <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">Unassigned</span>
                        )}
                      </td>

                      {/* Check-in */}
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800" suppressHydrationWarning>
                          {new Date(b.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                        <p className="text-[10px] text-slate-400" suppressHydrationWarning>
                          {new Date(b.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </p>
                      </td>

                      {/* Check-out */}
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800" suppressHydrationWarning>
                          {new Date(b.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                        <p className="text-[10px] text-slate-400" suppressHydrationWarning>
                          {new Date(b.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </p>
                      </td>

                      {/* Payment */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-extrabold text-slate-900">₹{b.totalAmount?.toLocaleString('en-IN')}</p>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider ${
                              isPaid ? 'text-emerald-600' : 'text-amber-600'
                            }`}
                          >
                            {isPaid ? 'Paid' : 'Pay at Hotel'}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">{getStatusBadge(b.status)}</td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()} suppressHydrationWarning>
                        <div className="flex items-center justify-end gap-1.5" suppressHydrationWarning>
                          {/* View Dedicated CRM Page */}
                          <Link
                            href={`/bookings/${b.id}`}
                            title="View Full Booking Details Page"
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            suppressHydrationWarning
                          >
                            <Eye size={15} />
                          </Link>

                          {/* Edit Modal */}
                          <button
                            onClick={() => setSelectedBookingForEdit(b)}
                            title="Edit Reservation Status & Room"
                            className="p-1.5 text-slate-600 hover:text-[#C6A96B] hover:bg-amber-50 rounded-lg transition-colors"
                            suppressHydrationWarning
                          >
                            <Edit size={15} />
                          </button>

                          {/* Direct Phone Call */}
                          {b.user?.phone && (
                            <a
                              href={`tel:${b.user.phone}`}
                              title="Call Guest"
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              suppressHydrationWarning
                            >
                              <Phone size={15} />
                            </a>
                          )}

                          {/* Email Guest */}
                          <a
                            href={`mailto:${b.user?.email}`}
                            title="Send Confirmation Email"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            suppressHydrationWarning
                          >
                            <Mail size={15} />
                          </a>

                          {/* Cancel Reservation */}
                          {b.status !== 'CANCELLED' && (
                            <button
                              onClick={(e) => handleQuickCancel(e, b.id)}
                              disabled={cancellingId === b.id}
                              title="Cancel Reservation"
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                              suppressHydrationWarning
                            >
                              <XCircle size={15} />
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Booking Modal */}
      {selectedBookingForEdit && (
        <EditBookingModal
          booking={selectedBookingForEdit}
          allRooms={allRooms}
          onClose={() => setSelectedBookingForEdit(null)}
        />
      )}
    </div>
  )
}
