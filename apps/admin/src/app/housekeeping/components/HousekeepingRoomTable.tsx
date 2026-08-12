'use client'

import React from 'react'
import { updateHousekeepingStatusAction } from '@/actions/housekeeping'
import { SupervisorInspectionModal } from './SupervisorInspectionModal'

interface RoomItem {
  id: string
  roomNumber: string
  status: string
  category: {
    name: string
  }
}

interface HousekeepingRoomTableProps {
  rooms: RoomItem[]
  filter: string
  totalRoomsCount: number
  dirtyCount: number
  maintenanceCount: number
  readyCount: number
}

const STAFF_MEMBERS = ['Ramesh Kumar', 'Sunita Devi', 'Anil Sharma', 'Meena Verma']

export function HousekeepingRoomTable({
  rooms,
  filter,
  totalRoomsCount,
  dirtyCount,
  maintenanceCount,
  readyCount,
}: HousekeepingRoomTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
      {/* Table Header Filter Tabs */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/50">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <a
            href="/housekeeping"
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              filter === 'ALL' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Rooms ({totalRoomsCount})
          </a>
          <a
            href="/housekeeping?filter=CLEANING"
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              filter === 'CLEANING' ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            🟣 Dirty / Cleaning ({dirtyCount})
          </a>
          <a
            href="/housekeeping?filter=MAINTENANCE"
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              filter === 'MAINTENANCE' ? 'bg-rose-600 text-white shadow-xs' : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            ⚫ Maintenance ({maintenanceCount})
          </a>
          <a
            href="/housekeeping?filter=AVAILABLE"
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              filter === 'AVAILABLE' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            🟢 Ready ({readyCount})
          </a>
        </div>
      </div>

      {/* Operational Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-6 py-3.5">Room #</th>
              <th className="px-6 py-3.5">Category</th>
              <th className="px-6 py-3.5">Current Hygiene Status</th>
              <th className="px-6 py-3.5">Assigned Housekeeper</th>
              <th className="px-6 py-3.5">Priority Level</th>
              <th className="px-6 py-3.5 text-right">Update Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {rooms.map((room, idx) => {
              const isCleaning = room.status === 'CLEANING'
              const isMaintenance = room.status === 'MAINTENANCE'
              const isAvailable = room.status === 'AVAILABLE'
              const isOccupied = room.status === 'OCCUPIED'

              const assignedStaff = STAFF_MEMBERS[idx % STAFF_MEMBERS.length]

              const handleMarkCleaning = updateHousekeepingStatusAction.bind(null, room.id, 'CLEANING')
              const handleMarkMaintenance = updateHousekeepingStatusAction.bind(null, room.id, 'MAINTENANCE')

              return (
                <tr key={room.id} className={`hover:bg-slate-50/80 transition-colors ${isCleaning ? 'bg-amber-50/20' : ''}`}>
                  <td className="px-6 py-4">
                    <span className="font-extrabold text-slate-900 font-mono text-sm">{room.roomNumber}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900">{room.category.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    {isCleaning && (
                      <span className="px-2.5 py-1 text-xs font-extrabold bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                        🟣 Cleaning In Progress
                      </span>
                    )}
                    {isMaintenance && (
                      <span className="px-2.5 py-1 text-xs font-extrabold bg-rose-50 text-rose-700 rounded-full border border-rose-200">
                        ⚫ Under Maintenance
                      </span>
                    )}
                    {isAvailable && (
                      <span className="px-2.5 py-1 text-xs font-extrabold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                        🟢 Clean & Cleared
                      </span>
                    )}
                    {isOccupied && (
                      <span className="px-2.5 py-1 text-xs font-extrabold bg-slate-100 text-slate-800 rounded-full border border-slate-300">
                        🔴 Occupied (Stayover)
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                        {assignedStaff.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-800 text-xs">{assignedStaff}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {isCleaning ? (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold bg-rose-100 text-rose-800 rounded-md border border-rose-200">
                        🔥 Departure Clean (High)
                      </span>
                    ) : isOccupied ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-md">
                        🧹 Stayover Clean (Med)
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">Standard</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {isCleaning && <SupervisorInspectionModal roomId={room.id} roomNumber={room.roomNumber} />}
                      {!isCleaning && (
                        <form action={handleMarkCleaning}>
                          <button
                            type="submit"
                            suppressHydrationWarning
                            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                          >
                            🧹 Start Cleaning
                          </button>
                        </form>
                      )}
                      {!isMaintenance && (
                        <form action={handleMarkMaintenance}>
                          <button
                            type="submit"
                            suppressHydrationWarning
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                          >
                            🔧 Maintenance
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
