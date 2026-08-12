'use client'

import React, { useState } from 'react'
import { X, Check, AlertCircle } from 'lucide-react'
import { updateBookingStatus } from '@/actions/bookings'

interface EditBookingModalProps {
  booking: any
  allRooms: any[]
  onClose: () => void
}

export function EditBookingModal({ booking, allRooms, onClose }: EditBookingModalProps) {
  const [status, setStatus] = useState(booking.status)
  const [selectedRoomId, setSelectedRoomId] = useState(booking.allocations[0]?.roomId || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    setLoading(true)
    setError('')
    const res = await updateBookingStatus(booking.id, status, selectedRoomId)
    setLoading(false)

    if (res.success) {
      onClose()
    } else {
      setError(res.error || 'Failed to update reservation')
    }
  }

  return (
    <div className="fixed inset-[#0] bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">Edit Booking: {booking.bookingRef}</h3>
            <p className="text-xs text-slate-400">Guest: {booking.user.name}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Status Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 uppercase tracking-wider">Booking Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C6A96B]"
            >
              <option value="CONFIRMED">CONFIRMED (Reservation Accepted)</option>
              <option value="CHECKED_IN">CHECKED_IN (Guest Currently In Room)</option>
              <option value="CHECKED_OUT">CHECKED_OUT (Guest Departed)</option>
              <option value="CANCELLED">CANCELLED (Reservation Voided)</option>
              <option value="PENDING">PENDING (Awaiting Confirmation)</option>
            </select>
          </div>

          {/* Room Allocation */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 uppercase tracking-wider">Assigned Room</label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C6A96B]"
            >
              <option value="">-- Select Available Room --</option>
              {allRooms.map((r) => (
                <option key={r.id} value={r.id}>
                  Room {r.roomNumber} ({r.category.name}) - {r.status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2 bg-[#C6A96B] hover:bg-[#b5985b] text-[#0F172A] font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
          >
            {loading ? 'Saving...' : <><Check size={14} /> Update Reservation</>}
          </button>
        </div>

      </div>
    </div>
  )
}
