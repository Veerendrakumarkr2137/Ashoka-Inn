'use client'

import React from 'react'
import { Sparkles, AlertCircle, CheckCircle2, UserCheck } from 'lucide-react'

interface HousekeepingStatsGridProps {
  dirtyCount: number
  maintenanceCount: number
  readyCount: number
  occupiedCount: number
}

export function HousekeepingStatsGrid({
  dirtyCount,
  maintenanceCount,
  readyCount,
  occupiedCount,
}: HousekeepingStatsGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={15} /> Dirty / Cleaning
          </span>
          <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-200 text-amber-900 rounded-full">High</span>
        </div>
        <p className="text-3xl font-extrabold text-amber-900 mt-3">{dirtyCount}</p>
      </div>

      <div className="bg-rose-50/70 p-5 rounded-2xl border border-rose-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle size={15} /> Maintenance
          </span>
          <span className="px-2 py-0.5 text-[10px] font-extrabold bg-rose-200 text-rose-900 rounded-full">Urgent</span>
        </div>
        <p className="text-3xl font-extrabold text-rose-900 mt-3">{maintenanceCount}</p>
      </div>

      <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 size={15} /> Ready & Inspected
          </span>
          <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-200 text-emerald-900 rounded-full">Cleared</span>
        </div>
        <p className="text-3xl font-extrabold text-emerald-900 mt-3">{readyCount}</p>
      </div>

      <div className="bg-slate-100 p-5 rounded-2xl border border-slate-300 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck size={15} /> Occupied Stayover
          </span>
          <span className="px-2 py-0.5 text-[10px] font-extrabold bg-slate-200 text-slate-900 rounded-full">In House</span>
        </div>
        <p className="text-3xl font-extrabold text-slate-900 mt-3">{occupiedCount}</p>
      </div>
    </div>
  )
}
