'use client'

import React, { useState } from 'react'
import { MoreVertical, LogOut, Loader2, KeyRound } from 'lucide-react'
import { createPortal } from 'react-dom'
import { updateBookingStatus } from '@/actions/bookings'

type BookingActionsDropdownProps = {
  bookingId: string
  currentStatus: string
  roomId?: string
}

export function BookingActionsDropdown({ bookingId, currentStatus, roomId }: BookingActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (status: string) => {
    setLoading(true)
    setIsOpen(false)
    await updateBookingStatus(bookingId, status, roomId)
    setLoading(false)
  }

  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null)

  React.useEffect(() => {
    const handleScroll = () => setIsOpen(false)
    if (isOpen) {
      window.addEventListener('scroll', handleScroll, true)
      window.addEventListener('resize', handleScroll)
    }
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleScroll)
    }
  }, [isOpen])

  // Quick actions to bypass dropdown if it's a common flow
  if (currentStatus === 'CONFIRMED' && roomId) {
    return (
      <button 
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C6A96B] hover:bg-[#B39659] text-white rounded-lg text-xs font-semibold transition-colors"
        onClick={() => handleUpdate('CHECKED_IN')}
        disabled={loading}
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
        Check In
      </button>
    )
  }

  if (currentStatus === 'CHECKED_IN') {
    return (
      <button 
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors border border-gray-200"
        onClick={() => handleUpdate('CHECKED_OUT')}
        disabled={loading}
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} className="rotate-180" />}
        Check Out
      </button>
    )
  }

  return (
    <div className="relative">
      <button 
        className="p-1.5 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors text-gray-400"
        onClick={(e) => {
          setButtonRect(e.currentTarget.getBoundingClientRect())
          setIsOpen(!isOpen)
        }}
        disabled={loading}
        suppressHydrationWarning
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <MoreVertical size={16} />}
      </button>
      
      {isOpen && buttonRect && typeof document !== 'undefined' && createPortal(
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)} />
          <div 
            className="fixed bg-white border border-gray-100 shadow-xl rounded-xl py-1 z-[110] overflow-hidden w-48"
            style={{
              top: buttonRect.bottom + 4,
              left: buttonRect.right - 192
            }}
          >
            <button
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => handleUpdate('CONFIRMED')}
            >
              Mark Confirmed
            </button>
            <button
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors"
              onClick={() => handleUpdate('CHECKED_IN')}
              disabled={!roomId}
            >
              Check In Guest
            </button>
            <button
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
              onClick={() => handleUpdate('CHECKED_OUT')}
            >
              Check Out Guest
            </button>
            <div className="h-px bg-gray-100 my-1" />
            <button
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
              onClick={() => handleUpdate('CANCELLED')}
            >
              Cancel Booking
            </button>
          </div>
        </>,
        document.body
      )}
    </div>
  )
}
