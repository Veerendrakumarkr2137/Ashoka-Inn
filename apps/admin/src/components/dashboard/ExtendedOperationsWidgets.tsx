'use client'

import React from 'react'
import Link from 'next/link'
import { 
  CalendarDays, CreditCard, Sparkles, Bot, MessageSquare, 
  ArrowRight, CheckCircle2, Clock, AlertCircle, PhoneCall, ChevronRight 
} from 'lucide-react'
import { markPaymentCompletedAction } from '@/actions/finance'

interface RecentBookingItem {
  id: string
  bookingRef: string
  guestName: string
  categoryName: string
  status: string
  totalAmount: number
}

interface PendingPaymentItem {
  id: string
  bookingId: string
  guestName: string
  amount: number
  paymentMethod: string
}

interface ExtendedOperationsProps {
  recentBookings: RecentBookingItem[]
  pendingPayments: PendingPaymentItem[]
  housekeepingStats: { cleaned: number; pending: number; cleaning: number }
}

const guestMessages = [
  { id: '1', room: '102', guest: 'Rahul Sharma', text: 'Requested early check-in at 09:00 AM (Confirmed by AI Bot)', time: '10m ago', tag: 'Early Check-in' },
  { id: '2', room: '311', guest: 'John Thomas', text: 'Airport pickup shuttle requested for 04:00 PM from IGI T3', time: '25m ago', tag: 'Transfer' },
  { id: '3', room: '204', guest: 'Priya Kumar', text: 'Extra feather pillows & 2 bath towels requested', time: '40m ago', tag: 'Housekeeping' },
  { id: '4', room: '305', guest: 'Siddharth Mehta', text: 'Requested late checkout till 01:30 PM due to evening flight', time: '1h ago', tag: 'Late Checkout' },
]

export function ExtendedOperationsWidgets({ recentBookings, pendingPayments, housekeepingStats }: ExtendedOperationsProps) {
  return (
    <div className="space-y-6 pt-2">
      {/* 2-Column Grid: Recent Bookings & Pending Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Widget 1: Recent Bookings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#0F172A] text-[#C6A96B] rounded-xl">
                <CalendarDays size={16} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Recent Bookings & CRM</h3>
            </div>
            <Link href="/bookings" className="text-xs font-bold text-[#C6A96B] hover:underline flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentBookings.map((b) => (
              <div key={b.id} className="py-3 flex items-center justify-between hover:bg-slate-50/80 rounded-xl px-2 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-extrabold text-slate-900 text-xs px-2 py-1 bg-slate-100 rounded-md border border-slate-200">
                    {b.bookingRef}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{b.guestName}</p>
                    <p className="text-[11px] text-slate-400 font-semibold">{b.categoryName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full ${
                    b.status === 'CONFIRMED' || b.status === 'CHECKED_IN'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {b.status}
                  </span>
                  <span className="font-mono font-extrabold text-xs text-slate-900">₹{b.totalAmount.toLocaleString('en-IN')}</span>
                  <Link 
                    href={`/bookings/${b.id}`} 
                    className="p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 2: Pending Payments Collector */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
                <CreditCard size={16} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Pending Pay-at-Hotel Receivables</h3>
            </div>
            <Link href="/finance" className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1">
              Finance Center <ArrowRight size={12} />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {pendingPayments.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs font-medium">
                All payments cleared. Zero pending receivables.
              </div>
            ) : pendingPayments.map((p) => {
              const handleCollect = markPaymentCompletedAction.bind(null, p.id)

              return (
                <div key={p.id} className="py-3 flex items-center justify-between hover:bg-slate-50/80 rounded-xl px-2 transition-colors">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{p.guestName}</p>
                    <p className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                      <Clock size={11} /> Pay at Hotel ({p.paymentMethod})
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-extrabold text-sm text-slate-900">₹{p.amount.toLocaleString('en-IN')}</span>
                    <form action={handleCollect}>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        Collect
                      </button>
                    </form>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>

      {/* 2-Column Grid: Housekeeping Progress & AI Reception Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Widget 3: Housekeeping Progress */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-50 text-purple-700 rounded-xl border border-purple-200">
                <Sparkles size={16} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Housekeeping Operational Progress</h3>
            </div>
            <Link href="/housekeeping" className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1">
              Kanban Board <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-center">
              <p className="text-[11px] font-bold text-emerald-800 uppercase">Cleaned & Ready</p>
              <p className="text-2xl font-extrabold text-emerald-900 mt-1">{housekeepingStats.cleaned}</p>
            </div>
            <div className="p-3 bg-purple-50/80 border border-purple-200 rounded-xl text-center">
              <p className="text-[11px] font-bold text-purple-800 uppercase">In Cleaning</p>
              <p className="text-2xl font-extrabold text-purple-900 mt-1">{housekeepingStats.cleaning}</p>
            </div>
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-center">
              <p className="text-[11px] font-bold text-amber-800 uppercase">Pending Clean</p>
              <p className="text-2xl font-extrabold text-amber-900 mt-1">{housekeepingStats.pending}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span>Turnaround Progress</span>
              <span>{Math.round((housekeepingStats.cleaned / 45) * 100)}% Rooms Ready</span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div 
                className="bg-emerald-500 h-full transition-all" 
                style={{ width: `${(housekeepingStats.cleaned / 45) * 100}%` }}
              />
              <div 
                className="bg-purple-500 h-full transition-all" 
                style={{ width: `${(housekeepingStats.cleaning / 45) * 100}%` }}
              />
              <div 
                className="bg-amber-400 h-full transition-all" 
                style={{ width: `${(housekeepingStats.pending / 45) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Widget 4: AI Reception Activity & Guest Messages Feed */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#C6A96B]/10 text-[#C6A96B] rounded-xl border border-[#C6A96B]/30">
                <Bot size={16} />
              </div>
              <h3 className="text-base font-bold text-slate-900">AI Reception & Today's Guest Requests</h3>
            </div>
            <Link href="/ai" className="text-xs font-bold text-[#C6A96B] hover:underline flex items-center gap-1">
              AI Center <ArrowRight size={12} />
            </Link>
          </div>

          {/* AI Call Stats Row */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] text-slate-500 font-bold">Calls Today</p>
              <p className="text-base font-extrabold text-slate-900">14</p>
            </div>
            <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-[10px] text-emerald-700 font-bold">Confirmed</p>
              <p className="text-base font-extrabold text-emerald-900">9</p>
            </div>
            <div className="p-2 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-[10px] text-amber-700 font-bold">No Answer</p>
              <p className="text-base font-extrabold text-amber-900">3</p>
            </div>
            <div className="p-2 bg-rose-50 rounded-xl border border-rose-100">
              <p className="text-[10px] text-rose-700 font-bold">Callback</p>
              <p className="text-base font-extrabold text-rose-900">2</p>
            </div>
          </div>

          {/* Guest Requests Feed */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Today's Guest Messages & AI Requests</p>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {guestMessages.map((m) => (
                <div key={m.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5 text-xs">
                  <div className="p-1.5 bg-[#C6A96B]/10 text-[#C6A96B] rounded-lg shrink-0 mt-0.5">
                    <MessageSquare size={13} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 truncate">
                        Room {m.room} • {m.guest}
                      </span>
                      <span className="text-[10px] font-bold text-[#C6A96B] bg-[#C6A96B]/10 px-1.5 py-0.5 rounded">
                        {m.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
