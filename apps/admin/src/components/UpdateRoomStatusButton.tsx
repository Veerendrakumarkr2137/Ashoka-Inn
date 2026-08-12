'use client'

import React, { useState } from 'react'
import { Button } from '@hospitality-os/ui/src/components/Button'
import { updateRoomStatus } from '@/actions/rooms'
import { Loader2 } from 'lucide-react'

type UpdateRoomStatusButtonProps = {
  roomId: string
  currentStatus: string
  isCleaning: boolean
}

const statuses = [
  { value: 'AVAILABLE', label: 'Mark Available' },
  { value: 'OCCUPIED', label: 'Mark Occupied' },
  { value: 'CLEANING', label: 'Requires Cleaning' },
  { value: 'MAINTENANCE', label: 'Under Maintenance' }
]

export function UpdateRoomStatusButton({ roomId, currentStatus, isCleaning }: UpdateRoomStatusButtonProps) {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleUpdate = async (status: string) => {
    setLoading(true)
    setIsOpen(false)
    await updateRoomStatus(roomId, status)
    setLoading(false)
  }

  // Quick action for cleaning
  if (isCleaning) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8"
        onClick={() => handleUpdate('AVAILABLE')}
        isLoading={loading}
      >
        Mark Clean
      </Button>
    )
  }

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8"
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : 'Update Status'}
      </Button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-xl py-1 z-20">
            {statuses.map(s => (
              <button
                key={s.value}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${currentStatus === s.value ? 'text-[#C6A96B] font-semibold bg-gray-50/50' : 'text-gray-700'}`}
                onClick={() => handleUpdate(s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
