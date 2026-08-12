import React from 'react'
import { prisma } from '@hospitality-os/database'
import { Filter, Search, Plus, BedDouble, Wrench, Sparkles, AlertCircle } from 'lucide-react'
import { RoomsToolbar, RoomsSearchInput } from './components/RoomsToolbar'
import { RoomActionsDropdown } from '@/components/RoomActionsDropdown'

export const dynamic = 'force-dynamic'

export default async function AdminRoomsPage(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams
  const q = searchParams?.q || ''

  const categories = await prisma.roomCategory.findMany({
    orderBy: { basePrice: 'desc' }
  })

  const rooms = await prisma.room.findMany({
    where: q ? {
      OR: [
        { roomNumber: { contains: q } },
        { category: { name: { contains: q } } }
      ]
    } : undefined,
    include: {
      category: true,
    },
    orderBy: [
      { roomNumber: 'asc' }
    ]
  })

  // Calculate 5-color room status breakdown
  const totalRooms = rooms.length
  const availableRooms = rooms.filter(r => r.status === 'AVAILABLE').length
  const occupiedRooms = rooms.filter(r => r.status === 'OCCUPIED').length
  const reservedRooms = rooms.filter(r => r.status === 'RESERVED').length
  const cleaningRooms = rooms.filter(r => r.status === 'CLEANING').length
  const maintenanceRooms = rooms.filter(r => r.status === 'MAINTENANCE').length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <span className="px-2.5 py-1 text-xs font-extrabold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">🟢 Available</span>
      case 'OCCUPIED':
        return <span className="px-2.5 py-1 text-xs font-extrabold bg-rose-50 text-rose-700 rounded-full border border-rose-200">🔴 Occupied</span>
      case 'RESERVED':
        return <span className="px-2.5 py-1 text-xs font-extrabold bg-amber-50 text-amber-700 rounded-full border border-amber-200">🟡 Reserved</span>
      case 'CLEANING':
        return <span className="px-2.5 py-1 text-xs font-extrabold bg-purple-50 text-purple-700 rounded-full border border-purple-200">🟣 Cleaning</span>
      case 'MAINTENANCE':
        return <span className="px-2.5 py-1 text-xs font-extrabold bg-slate-100 text-slate-800 rounded-full border border-slate-300">⚫ Maintenance</span>
      default:
        return <span className="px-2.5 py-1 text-xs font-extrabold bg-slate-100 text-slate-700 rounded-full">{status}</span>
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Room Rack & Operational Inventory</h1>
          <p className="text-sm text-slate-500 mt-1">Live 5-status room rack matrix for Hotel Ashokha ({totalRooms} Rooms).</p>
        </div>
        <RoomsToolbar categories={categories} />
      </div>

      {/* 5-Status Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 flex flex-col justify-between">
          <p className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
            <span>🟢</span> Available
          </p>
          <p className="text-3xl font-extrabold text-emerald-900 mt-2">{availableRooms}</p>
        </div>

        <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200 flex flex-col justify-between">
          <p className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
            <span>🔴</span> Occupied
          </p>
          <p className="text-3xl font-extrabold text-rose-900 mt-2">{occupiedRooms}</p>
        </div>

        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 flex flex-col justify-between">
          <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
            <span>🟡</span> Reserved
          </p>
          <p className="text-3xl font-extrabold text-amber-900 mt-2">{reservedRooms}</p>
        </div>

        <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200 flex flex-col justify-between">
          <p className="text-xs font-bold text-purple-800 flex items-center gap-1.5">
            <span>🟣</span> Cleaning
          </p>
          <p className="text-3xl font-extrabold text-purple-900 mt-2">{cleaningRooms}</p>
        </div>

        <div className="bg-slate-100 p-4 rounded-2xl border border-slate-300 flex flex-col justify-between col-span-2 sm:col-span-1">
          <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <span>⚫</span> Maintenance
          </p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{maintenanceRooms}</p>
        </div>
      </div>

      {/* Visual Room Rack Grid View */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">Room Matrix Grid View</h3>
          <span className="text-xs font-bold text-slate-500">Click room to update status</span>
        </div>

        {/* Room Rack Tile Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
          {rooms.map((room) => {
            const isAvailable = room.status === 'AVAILABLE'
            const isOccupied = room.status === 'OCCUPIED'
            const isReserved = room.status === 'RESERVED'
            const isCleaning = room.status === 'CLEANING'
            const isMaintenance = room.status === 'MAINTENANCE'

            return (
              <div
                key={room.id}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 text-center transition-all hover:scale-105 cursor-pointer shadow-xs ${
                  isAvailable ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' :
                  isOccupied ? 'bg-rose-50/80 border-rose-200 text-rose-900' :
                  isReserved ? 'bg-amber-50/80 border-amber-200 text-amber-900' :
                  isCleaning ? 'bg-purple-50/80 border-purple-200 text-purple-900' :
                  'bg-slate-100 border-slate-300 text-slate-900'
                }`}
              >
                <span className="text-base font-extrabold font-mono">{room.roomNumber}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {isAvailable && '🟢 Available'}
                  {isOccupied && '🔴 Occupied'}
                  {isReserved && '🟡 Reserved'}
                  {isCleaning && '🟣 Cleaning'}
                  {isMaintenance && '⚫ Maint.'}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <RoomsSearchInput />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Room #</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Live Status</th>
                <th className="px-6 py-3.5">Features & Capacity</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-extrabold text-slate-900 font-mono text-sm">{room.roomNumber}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{room.category.name}</span>
                      <span className="text-[11px] text-slate-400">₹{room.category.basePrice.toLocaleString()} / night</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(room.status)}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {room.category.capacity} Guests • {room.category.hasAC ? 'Air-Conditioned' : 'Non-AC'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <RoomActionsDropdown roomId={room.id} currentStatus={room.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
