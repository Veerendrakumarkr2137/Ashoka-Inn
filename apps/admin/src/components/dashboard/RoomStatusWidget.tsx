'use client'

import React from 'react'
import { BedDouble, Sparkles, Wrench, CalendarCheck, CheckCircle2 } from 'lucide-react'

interface RoomStatusWidgetProps {
  totalRooms: number
  availableCount: number
  occupiedCount: number
  reservedCount: number
  maintenanceCount: number
  cleaningCount: number
  categories: Array<{
    id: string
    name: string
    _count: { rooms: number }
  }>
}

export function RoomStatusWidget({
  totalRooms,
  availableCount,
  occupiedCount,
  reservedCount,
  maintenanceCount,
  cleaningCount,
  categories,
}: RoomStatusWidgetProps) {
  const statusItems = [
    { label: 'Available', count: availableCount, color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: '🟢' },
    { label: 'Occupied', count: occupiedCount, color: 'bg-rose-500', text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', dot: '🔴' },
    { label: 'Reserved', count: reservedCount, color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', dot: '🟡' },
    { label: 'Maintenance / Clean', count: maintenanceCount + cleaningCount, color: 'bg-slate-700', text: 'text-slate-800', bg: 'bg-slate-100', border: 'border-slate-200', dot: '⚫' },
  ]

  return (
    <div className="bg-white p-6 rounded-[var(--radius-card)] shadow-card border border-[var(--border-subtle)] space-y-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Room Status</h3>
            <p className="text-xs text-slate-500">Live operational room allocation</p>
          </div>
          <div className="px-3 py-1 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm">
            <BedDouble size={14} className="text-[#C6A96B]" />
            {totalRooms} Total Rooms
          </div>
        </div>

        {/* 4 Cards Grid requested by user */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {statusItems.map((item) => (
            <div key={item.label} className={`p-3.5 rounded-xl border ${item.border} ${item.bg} flex items-center justify-between transition-transform hover:scale-[1.02]`}>
              <div className="flex items-center gap-2">
                <span className="text-sm">{item.dot}</span>
                <span className="text-xs font-bold text-slate-700">{item.label}</span>
              </div>
              <span className={`text-xl font-extrabold ${item.text}`}>{item.count}</span>
            </div>
          ))}
        </div>

        {/* Category Inventory Breakdown */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category Breakdown</h4>
          {categories.map((cat) => {
            const count = cat._count.rooms
            const pct = Math.round((count / totalRooms) * 100)
            return (
              <div key={cat.id} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{cat.name}</span>
                  <span className="text-slate-500">{count} rooms ({pct}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#C6A96B] rounded-full transition-all duration-500" 
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Housekeeping Quick Note */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5 font-medium text-slate-600">
          <Sparkles size={14} className="text-amber-500" />
          {cleaningCount} Rooms in Cleaning
        </span>
        <span className="flex items-center gap-1.5 font-medium text-slate-600">
          <Wrench size={14} className="text-slate-500" />
          {maintenanceCount} In Maintenance
        </span>
      </div>
    </div>
  )
}
