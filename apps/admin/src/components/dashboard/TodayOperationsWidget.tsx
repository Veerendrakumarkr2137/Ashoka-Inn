'use client'

import React from 'react'
import { LogIn, LogOut, Clock, CheckCircle, UserCheck, AlertCircle } from 'lucide-react'

interface CheckInItem {
  id: string
  time: string
  guestName: string
  roomNumber: string
  status: string
  phone?: string
}

interface CheckOutItem {
  id: string
  roomNumber: string
  guestName: string
  status: string
}

interface TodayOperationsWidgetProps {
  checkIns: CheckInItem[]
  pendingCheckInsCount: number
  checkOuts: CheckOutItem[]
}

export function TodayOperationsWidget({
  checkIns,
  pendingCheckInsCount,
  checkOuts,
}: TodayOperationsWidgetProps) {
  return (
    <div className="bg-white p-6 rounded-[var(--radius-card)] shadow-card border border-[var(--border-subtle)] space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Today's Operations</h3>
          <p className="text-xs text-slate-500">Morning front-desk check-ins and departures</p>
        </div>
        <span className="px-3 py-1 bg-[#C6A96B]/10 text-[#C6A96B] font-bold text-xs rounded-full border border-[#C6A96B]/20">
          Receptionist Desk
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Check-ins */}
        <div className="space-y-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold">
                <LogIn size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Today's Check-ins</h4>
                <p className="text-[11px] text-slate-500">{checkIns.length} scheduled today</p>
              </div>
            </div>
            {pendingCheckInsCount > 0 && (
              <span className="px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                {pendingCheckInsCount} Pending
              </span>
            )}
          </div>

          <div className="space-y-2 pt-2">
            {checkIns.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No arrivals scheduled today</p>
            ) : (
              checkIns.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-1 rounded-md font-mono">
                      {item.time}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{item.guestName}</p>
                      <p className="text-[11px] text-slate-500">Room {item.roomNumber}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.status === 'CHECKED_IN' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : item.status === 'CONFIRMED'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Today's Check-outs */}
        <div className="space-y-3 p-4 bg-rose-50/50 rounded-2xl border border-rose-100/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center font-bold">
                <LogOut size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Today's Check-outs</h4>
                <p className="text-[11px] text-slate-500">{checkOuts.length} departures expected</p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-700 rounded-full">
              {checkOuts.filter(c => c.status === 'CHECKED_OUT').length} Cleared
            </span>
          </div>

          <div className="space-y-2 pt-2">
            {checkOuts.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No departures scheduled today</p>
            ) : (
              checkOuts.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-rose-300 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-800 font-extrabold text-xs flex items-center justify-center">
                      {item.roomNumber}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{item.guestName}</p>
                      <p className="text-[11px] text-slate-500">Departure Pending</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.status === 'CHECKED_OUT' 
                      ? 'bg-slate-200 text-slate-800' 
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {item.status === 'CHECKED_OUT' ? 'Cleared' : 'Occupied'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
