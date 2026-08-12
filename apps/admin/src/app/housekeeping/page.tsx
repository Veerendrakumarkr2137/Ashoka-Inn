import React from 'react'
import { prisma } from '@hospitality-os/database'
import { HousekeepingStatsGrid } from './components/HousekeepingStatsGrid'
import { HousekeepingRoomTable } from './components/HousekeepingRoomTable'
import { MaintenanceTicketBoard } from './components/MaintenanceTicketBoard'

export const dynamic = 'force-dynamic'

export default async function AdminHousekeepingPage(props: { searchParams: Promise<{ filter?: string; q?: string }> }) {
  const searchParams = await props.searchParams
  const filter = searchParams?.filter || 'ALL'
  const q = searchParams?.q || ''

  const [rooms, maintenanceTickets] = await Promise.all([
    prisma.room.findMany({
      where: q ? { roomNumber: { contains: q } } : undefined,
      include: { category: true },
      orderBy: { roomNumber: 'asc' },
    }),
    prisma.maintenanceTicket.findMany({
      include: { room: true },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const dirtyRooms = rooms.filter((r) => r.status === 'CLEANING')
  const maintenanceRooms = rooms.filter((r) => r.status === 'MAINTENANCE')
  const readyRooms = rooms.filter((r) => r.status === 'AVAILABLE')
  const occupiedRooms = rooms.filter((r) => r.status === 'OCCUPIED')

  const filteredRooms = rooms.filter((r) => {
    if (filter === 'CLEANING') return r.status === 'CLEANING'
    if (filter === 'MAINTENANCE') return r.status === 'MAINTENANCE'
    if (filter === 'AVAILABLE') return r.status === 'AVAILABLE'
    if (filter === 'OCCUPIED') return r.status === 'OCCUPIED'
    return true
  })

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Housekeeping & Room Hygiene Operations</h1>
          <p className="text-sm text-slate-500 mt-1">Live room cleaning dispatch, staff assignment, and supervisor inspection board.</p>
        </div>
      </div>

      {/* Stats Grid Component */}
      <HousekeepingStatsGrid
        dirtyCount={dirtyRooms.length}
        maintenanceCount={maintenanceRooms.length}
        readyCount={readyRooms.length}
        occupiedCount={occupiedRooms.length}
      />

      {/* Room Table Component */}
      <HousekeepingRoomTable
        rooms={filteredRooms}
        filter={filter}
        totalRoomsCount={rooms.length}
        dirtyCount={dirtyRooms.length}
        maintenanceCount={maintenanceRooms.length}
        readyCount={readyRooms.length}
      />

      {/* Maintenance Engineering & Work Orders Board */}
      <MaintenanceTicketBoard tickets={maintenanceTickets} rooms={rooms.map((r) => ({ id: r.id, roomNumber: r.roomNumber }))} />
    </div>
  )
}
