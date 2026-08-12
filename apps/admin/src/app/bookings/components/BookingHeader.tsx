'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react'
import { updateBookingStatusAction } from '@/actions/bookings'

interface BookingHeaderProps {
  bookingId: string
  bookingRef: string
  guestName: string
  status: string
  createdAt: Date
  roomId?: string
  actionControls: React.ReactNode
}

export function BookingHeader({
  bookingId,
  bookingRef,
  guestName,
  status,
  createdAt,
  roomId,
  actionControls,
}: BookingHeaderProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-full">🟢 CONFIRMED</span>
      case 'CHECKED_IN':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-extrabold rounded-full">🔵 CHECKED IN</span>
      case 'CHECKED_OUT':
        return <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-extrabold rounded-full flex items-center gap-1">🟣 CHECKED OUT</span>
      case 'COMPLETED':
        return <span className="px-3 py-1 bg-slate-900 text-[#C6A96B] text-xs font-extrabold rounded-full flex items-center gap-1">✓ COMPLETED</span>
      case 'CANCELLED':
        return <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-extrabold rounded-full">🔴 CANCELLED</span>
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-extrabold rounded-full">{status}</span>
    }
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link href="/bookings" className="text-xs font-extrabold text-slate-500 hover:text-slate-900 flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Reservations
          </Link>
          <span className="text-slate-300">•</span>
          <span className="text-xs font-extrabold text-[#C6A96B] uppercase tracking-wider">Enterprise Folio</span>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Booking #{bookingRef}
          </h1>
          {getStatusBadge(status)}
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Guest: <span className="font-bold text-slate-800">{guestName}</span> • Created on{' '}
          <span suppressHydrationWarning>{new Date(createdAt).toLocaleString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        {actionControls}

        {status === 'CHECKED_OUT' && (
          <form action={updateBookingStatusAction.bind(null, bookingId, 'COMPLETED', roomId)}>
            <button
              type="submit"
              suppressHydrationWarning
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-[#C6A96B] font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <CheckCircle2 size={14} /> Close Reservation & Mark Completed
            </button>
          </form>
        )}

        {status !== 'CANCELLED' && status !== 'COMPLETED' && (
          <form action={updateBookingStatusAction.bind(null, bookingId, 'CANCELLED', roomId)}>
            <button
              type="submit"
              suppressHydrationWarning
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <XCircle size={14} /> Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
