'use client'

import React, { useState } from 'react'
import { MoreVertical, Loader2, Sparkles, Wrench, CheckCircle2 } from 'lucide-react'
import { createPortal } from 'react-dom'
import { updateRoomStatus } from '@/actions/rooms'

type RoomActionsDropdownProps = {
  roomId: string
  currentStatus: string
}

export function RoomActionsDropdown({ roomId, currentStatus }: RoomActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
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

  const handleUpdate = async (status: string) => {
    setLoading(true)
    setIsOpen(false)
    await updateRoomStatus(roomId, status)
    setLoading(false)
  }

  return (
    <div className="relative">
      <button 
        className="p-1 hover:bg-gray-100 hover:text-gray-900 rounded transition-colors text-gray-400"
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
            {currentStatus !== 'AVAILABLE' && (
              <button
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors"
                onClick={() => handleUpdate('AVAILABLE')}
              >
                <CheckCircle2 size={14} /> Mark Available
              </button>
            )}
            {currentStatus !== 'CLEANING' && (
              <button
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 transition-colors"
                onClick={() => handleUpdate('CLEANING')}
              >
                <Sparkles size={14} /> Send to Cleaning
              </button>
            )}
            {currentStatus !== 'MAINTENANCE' && (
              <button
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => handleUpdate('MAINTENANCE')}
              >
                <Wrench size={14} /> Mark Maintenance
              </button>
            )}
          </div>
        </>,
        document.body
      )}
    </div>
  )
}
