'use client'

import React from 'react'
import { Clock, CheckCircle2 } from 'lucide-react'

interface BookingTimelineStepperProps {
  status: string
  createdAt: Date
  actualCheckIn?: Date | null
  actualCheckOut?: Date | null
}

export function BookingTimelineStepper({
  status,
  createdAt,
  actualCheckIn,
  actualCheckOut,
}: BookingTimelineStepperProps) {
  const timelineStages = [
    { label: 'Reservation Booked', status: 'PENDING', time: new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    { label: 'Confirmed & Assigned', status: 'CONFIRMED', time: 'Auto System' },
    { label: 'Guest Check-In', status: 'CHECKED_IN', time: actualCheckIn ? new Date(actualCheckIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending Arrival' },
    { label: 'Guest Check-Out', status: 'CHECKED_OUT', time: actualCheckOut ? new Date(actualCheckOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending Checkout' },
    { label: 'Settled & Closed', status: 'COMPLETED', time: status === 'COMPLETED' ? 'Archived' : 'In Progress' },
  ]

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Clock size={14} className="text-[#C6A96B]" /> Enterprise Booking Lifecycle Timeline
        </h4>
        <span className="text-[11px] font-bold text-slate-400">5-Stage PMS Protocol</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
        {timelineStages.map((stage) => {
          const isCompleted =
            stage.status === 'PENDING' ||
            (stage.status === 'CONFIRMED' && ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'COMPLETED'].includes(status)) ||
            (stage.status === 'CHECKED_IN' && ['CHECKED_IN', 'CHECKED_OUT', 'COMPLETED'].includes(status)) ||
            (stage.status === 'CHECKED_OUT' && ['CHECKED_OUT', 'COMPLETED'].includes(status)) ||
            (stage.status === 'COMPLETED' && status === 'COMPLETED')

          const isCurrent = status === stage.status

          return (
            <div
              key={stage.label}
              className={`p-3 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/30'
                  : isCompleted
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider">{stage.label}</span>
                {isCompleted ? <CheckCircle2 size={14} className="text-emerald-600" /> : <Clock size={14} className="text-slate-400" />}
              </div>
              <p className="text-[10px] font-mono font-semibold mt-1 opacity-80 truncate" suppressHydrationWarning>{stage.time}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
