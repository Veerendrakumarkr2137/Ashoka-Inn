'use client'

import React from 'react'
import { Filter, ChefHat } from 'lucide-react'
import { Button } from '@hospitality-os/ui/src/components/Button'

export function RestaurantToolbar() {
  return (
    <div className="flex gap-2 w-full sm:w-auto">
      <Button 
        variant="outline" 
        size="sm" 
        leftIcon={<Filter size={16} />}
        onClick={() => alert("Advanced reporting and timeline filters will be unlocked in the v1.2 release.")}
      >
        Filters
      </Button>
      <Button 
        size="sm" 
        leftIcon={<ChefHat size={16} />}
        onClick={() => alert("The Point of Sale (POS) system for manual order entry is currently in development. Online guest orders will still appear automatically.")}
      >
        New Order
      </Button>
    </div>
  )
}
