'use client'

import React from 'react'
import { Filter, Sparkles } from 'lucide-react'
import { Button } from '@hospitality-os/ui/src/components/Button'

export function HousekeepingToolbar() {
  const handleAssignStaff = () => {
    alert('The Staff Assignment module is currently under development and will be available in the next update.')
  }

  const handleFilters = () => {
    alert('Advanced filtering is coming soon!')
  }

  return (
    <div className="flex gap-2 w-full sm:w-auto">
      <Button variant="outline" size="sm" leftIcon={<Filter size={16} />} onClick={handleFilters}>Filters</Button>
      <Button size="sm" leftIcon={<Sparkles size={16} />} onClick={handleAssignStaff}>Assign Staff</Button>
    </div>
  )
}
