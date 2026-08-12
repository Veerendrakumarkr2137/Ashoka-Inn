'use client'

import React, { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { MobileBookingDrawer } from './MobileBookingDrawer'

export function MobileBookingBarAndDrawer({
  category
}: {
  category: {
    id: string
    name: string
    basePrice: number
  }
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <>
      {/* Fixed Floating Bottom Reservation Bar for Mobile */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-[200] bg-white/95 backdrop-blur-md border-t border-black/5 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.1)] flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-[#6B7280] uppercase tracking-widest font-bold block mb-0.5">
            Starting From
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-heading text-[#0F172A]">
              ₹{category.basePrice.toLocaleString()}
            </span>
            <span className="text-xs text-[#6B7280]">/ night</span>
          </div>
        </div>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="min-h-[48px] px-6 bg-[#0F172A] active:bg-[#C6A96B] text-white rounded-[14px] font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-md"
          suppressHydrationWarning
        >
          Reserve Your Stay <ArrowRight size={16} />
        </button>
      </div>

      {/* Bottom Sheet Drawer Modal */}
      <MobileBookingDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        category={category}
      />
    </>
  )
}
