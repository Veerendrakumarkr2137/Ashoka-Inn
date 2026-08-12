'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Users, Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function MobileBookingDrawer({
  isOpen,
  onClose,
  category
}: {
  isOpen: boolean
  onClose: () => void
  category: {
    id: string
    name: string
    basePrice: number
  }
}) {
  const [checkIn, setCheckIn] = useState<string>('')
  const [checkOut, setCheckOut] = useState<string>('')
  const [guests, setGuests] = useState('2')

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300]"
          />

          {/* Bottom Sheet Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed bottom-0 inset-x-0 bg-white rounded-t-[32px] z-[310] max-h-[90vh] overflow-y-auto p-6 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.2)]"
          >
            {/* Handlebar */}
            <div className="w-12 h-1.5 bg-black/10 rounded-full mx-auto mb-6" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/5">
              <div>
                <span className="text-[10px] font-bold text-[#C6A96B] uppercase tracking-[0.2em] block mb-1">
                  Reserve Your Stay
                </span>
                <h3 className="text-xl font-heading text-[#0F172A]">{category.name}</h3>
              </div>
              <button
                onClick={onClose}
                className="w-11 h-11 rounded-full bg-black/5 flex items-center justify-center text-[#0F172A] hover:bg-black/10 transition-colors"
                aria-label="Close booking drawer"
                suppressHydrationWarning
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Inputs */}
            <div className="space-y-4 mb-6">
              {/* Check-In */}
              <div className="p-4 rounded-[16px] bg-[#FAF8F5] border border-black/5 flex items-center gap-4">
                <Calendar size={20} className="text-[#C6A96B] shrink-0" />
                <div className="flex-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#6B7280] block mb-1">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="bg-transparent text-sm font-semibold text-[#0F172A] focus:outline-none w-full"
                  />
                </div>
              </div>

              {/* Check-Out */}
              <div className="p-4 rounded-[16px] bg-[#FAF8F5] border border-black/5 flex items-center gap-4">
                <Calendar size={20} className="text-[#C6A96B] shrink-0" />
                <div className="flex-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#6B7280] block mb-1">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    className="bg-transparent text-sm font-semibold text-[#0F172A] focus:outline-none w-full"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="p-4 rounded-[16px] bg-[#FAF8F5] border border-black/5 flex items-center gap-4">
                <Users size={20} className="text-[#C6A96B] shrink-0" />
                <div className="flex-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-[#6B7280] block mb-1">
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="bg-transparent text-sm font-semibold text-[#0F172A] focus:outline-none w-full"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="p-4 rounded-[16px] bg-black/[0.02] border border-black/5 mb-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#6B7280] uppercase tracking-widest font-semibold block mb-0.5">
                  Total Rate
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-heading text-[#0F172A]">
                    ₹{category.basePrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#6B7280]">/ night</span>
                </div>
              </div>
              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 flex items-center gap-1">
                <Check size={12} /> Free Cancellation
              </span>
            </div>

            {/* Submit Action */}
            <Link
              href={`/booking?room=${category.id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}
              className="w-full h-14 bg-[#0F172A] hover:bg-[#C6A96B] active:scale-[0.99] text-white rounded-[16px] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              Continue to Reservation <ArrowRight size={16} />
            </Link>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
