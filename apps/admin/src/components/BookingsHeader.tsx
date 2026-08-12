'use client'

import React, { useState } from 'react'
import { Filter, Plus } from 'lucide-react'
import { Button } from '@hospitality-os/ui/src/components/Button'
import { AddBookingModal } from './AddBookingModal'

export function BookingsHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Reservations</h1>
          <p className="text-sm text-[#6B7280] mt-1">Manage guest bookings, check-ins, and payments.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" leftIcon={<Filter size={16} />}>Filters</Button>
          <Button size="sm" leftIcon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>New Booking</Button>
        </div>
      </div>

      <AddBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
