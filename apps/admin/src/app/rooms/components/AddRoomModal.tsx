'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@hospitality-os/ui/src/components/Button'
import { createRoom } from '@/actions/rooms'
import { RoomCategory } from '@hospitality-os/database'

interface AddRoomModalProps {
  isOpen: boolean
  onClose: () => void
  categories: RoomCategory[]
}

export function AddRoomModal({ isOpen, onClose, categories }: AddRoomModalProps) {
  const [roomNumber, setRoomNumber] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState('AVAILABLE')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!roomNumber || !categoryId) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)
    setError('')

    const result = await createRoom({
      roomNumber,
      roomCategoryId: categoryId,
      status
    })

    if (result.success) {
      setRoomNumber('')
      setStatus('AVAILABLE')
      onClose()
    } else {
      setError(result.error || 'Failed to create room')
    }
    
    setLoading(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-white rounded-[24px] shadow-2xl p-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#0F172A]">Add New Room</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Number *</label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full px-4 py-2 rounded-[14px] border border-gray-200 focus:outline-none focus:border-[#C6A96B] focus:ring-1 focus:ring-[#C6A96B] transition-all"
                  placeholder="e.g. 101, 305A"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2 rounded-[14px] border border-gray-200 focus:outline-none focus:border-[#C6A96B] focus:ring-1 focus:ring-[#C6A96B] transition-all bg-white"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 rounded-[14px] border border-gray-200 focus:outline-none focus:border-[#C6A96B] focus:ring-1 focus:ring-[#C6A96B] transition-all bg-white"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="OUT_OF_SERVICE">Out of Service</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={loading}>
                  Create Room
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
