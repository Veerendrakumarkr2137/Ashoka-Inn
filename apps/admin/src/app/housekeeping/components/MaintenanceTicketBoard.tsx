'use client'

import React, { useState } from 'react'
import { Wrench, Plus, Loader2 } from 'lucide-react'
import { updateMaintenanceStatus, createMaintenanceTicket } from '@/actions/maintenance'
import { useRouter } from 'next/navigation'

interface TicketItem {
  id: string
  roomId: string
  room: { roomNumber: string }
  issue: string
  priority: string
  status: string
  technician: string | null
  notes: string | null
  reportedBy: string
  createdAt: Date | string
}

interface RoomItem {
  id: string
  roomNumber: string
}

interface MaintenanceTicketBoardProps {
  tickets: TicketItem[]
  rooms: RoomItem[]
}

export function MaintenanceTicketBoard({ tickets, rooms }: MaintenanceTicketBoardProps) {
  const router = useRouter()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || '')
  const [issueText, setIssueText] = useState('')
  const [priority, setPriority] = useState('MEDIUM')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!issueText.trim() || !selectedRoomId || isSubmitting) return

    setIsSubmitting(true)
    try {
      const res = await createMaintenanceTicket(selectedRoomId, issueText.trim(), priority, 'Front Desk Staff')
      if (res.success) {
        setIssueText('')
        setIsFormOpen(false)
        router.refresh()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    setIsSubmitting(true)
    try {
      await updateMaintenanceStatus(ticketId, newStatus)
      router.refresh()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Wrench size={18} className="text-rose-600" /> Maintenance Engineering & Work Orders Board
          </h3>
          <p className="text-xs text-slate-500">Track reported room faults, technician dispatches, and supervisor sign-offs</p>
        </div>

        <button
          onClick={() => setIsFormOpen(prev => !prev)}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          suppressHydrationWarning
        >
          <Plus size={14} className="text-[#C6A96B]" />
          <span>+ Log Maintenance Issue</span>
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleCreateTicket} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Log Room Engineering Fault</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Select Room #</label>
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                suppressHydrationWarning
              >
                {rooms.map(r => (
                  <option key={r.id} value={r.id}>Room {r.roomNumber}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                suppressHydrationWarning
              >
                <option value="LOW">LOW — Minor cosmetic fix</option>
                <option value="MEDIUM">MEDIUM — Standard repair</option>
                <option value="HIGH">HIGH — Appliance fault</option>
                <option value="URGENT">URGENT — Water leak / Power trip</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Issue Description</label>
              <input
                type="text"
                value={issueText}
                onChange={(e) => setIssueText(e.target.value)}
                placeholder="e.g. AC unit leaking water onto floor near balcony"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#C6A96B]"
                suppressHydrationWarning
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
              suppressHydrationWarning
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!issueText.trim() || isSubmitting}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
              suppressHydrationWarning
            >
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Wrench size={14} />}
              <span>Submit & Set Room Maintenance</span>
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {tickets.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 font-medium">
            Zero active maintenance engineering tickets. All hotel rooms operational!
          </div>
        ) : (
          tickets.map(t => (
            <div
              key={t.id}
              className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 font-mono text-sm px-2 py-0.5 bg-slate-200 rounded-md">
                    Room {t.room.roomNumber}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md uppercase bg-rose-100 text-rose-800 border border-rose-200">
                    {t.priority}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-purple-100 text-purple-800">
                    {t.status}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900">{t.issue}</p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Reported by {t.reportedBy} • Assigned Tech: <span className="font-bold text-slate-800">{t.technician || 'Unassigned'}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 shrink-0 w-full sm:w-auto justify-end">
                {t.status === 'REPORTED' && (
                  <button
                    onClick={() => handleStatusChange(t.id, 'IN_PROGRESS')}
                    disabled={isSubmitting}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                    suppressHydrationWarning
                  >
                    Dispatch Technician
                  </button>
                )}

                {t.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => handleStatusChange(t.id, 'COMPLETED')}
                    disabled={isSubmitting}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                    suppressHydrationWarning
                  >
                    Mark Work Done
                  </button>
                )}

                {t.status === 'COMPLETED' && (
                  <button
                    onClick={() => handleStatusChange(t.id, 'INSPECTED')}
                    disabled={isSubmitting}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-[#C6A96B] font-extrabold text-xs rounded-xl shadow-xs cursor-pointer"
                    suppressHydrationWarning
                  >
                    Supervisor Sign-off & Clear
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
