'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Users, ChevronDown, Plus, Minus, Check } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@hospitality-os/utils'

export function BookingWidget({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const [checkIn, setCheckIn] = useState<string>('')
  const [checkOut, setCheckOut] = useState<string>('')
  const [adults, setAdults] = useState<number>(2)
  const [childrenCount, setChildrenCount] = useState<number>(0)
  const [isGuestPopoverOpen, setIsGuestPopoverOpen] = useState<boolean>(false)

  const popoverRef = useRef<HTMLDivElement>(null)

  // Close guest popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsGuestPopoverOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const guestsSummary = `${adults} ${adults === 1 ? 'Adult' : 'Adults'}, ${childrenCount} ${childrenCount === 1 ? 'Child' : 'Children'}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'w-full max-w-5xl mx-auto relative z-30',
        variant === 'dark' 
          ? 'bg-white/10 backdrop-blur-[24px] rounded-[24px] border border-white/20 shadow-[0_32px_64px_rgba(0,0,0,0.2)] text-white'
          : 'bg-white rounded-[24px] border border-black/5 shadow-[0_32px_64px_rgba(0,0,0,0.08)] text-[#0F172A]',
        'p-3 sm:p-4 md:p-6'
      )}
    >
      <div className="flex flex-col md:flex-row gap-4">
        
        {/* Check-in */}
        <div className="flex-1 relative group cursor-pointer">
          <div className={cn("absolute inset-0 rounded-[14px] transition-colors", variant === 'dark' ? "bg-white/5 group-hover:bg-white/10" : "bg-black/0 group-hover:bg-black/5")} />
          <div className={cn("relative flex items-center gap-4 px-5 py-4 rounded-[14px] border", variant === 'dark' ? "border-white/10" : "border-black/5")}>
            <div className="w-10 h-10 rounded-full bg-[#C6A96B]/20 flex items-center justify-center text-[#C6A96B] shrink-0">
              <Calendar size={20} />
            </div>
            <div className="flex-1">
              <p className={cn("text-[11px] uppercase tracking-widest font-semibold mb-1", variant === 'dark' ? "text-white/50" : "text-[#0F172A]/50")}>Check-in</p>
              <input 
                id="widget-check-in"
                name="checkIn"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={cn("bg-transparent font-medium focus:outline-none w-full cursor-pointer", variant === 'dark' ? "text-white [color-scheme:dark]" : "text-[#0F172A] [color-scheme:light]")}
              />
            </div>
          </div>
        </div>

        {/* Check-out */}
        <div className="flex-1 relative group cursor-pointer">
          <div className={cn("absolute inset-0 rounded-[14px] transition-colors", variant === 'dark' ? "bg-white/5 group-hover:bg-white/10" : "bg-black/0 group-hover:bg-black/5")} />
          <div className={cn("relative flex items-center gap-4 px-5 py-4 rounded-[14px] border", variant === 'dark' ? "border-white/10" : "border-black/5")}>
            <div className="w-10 h-10 rounded-full bg-[#C6A96B]/20 flex items-center justify-center text-[#C6A96B] shrink-0">
              <Calendar size={20} />
            </div>
            <div className="flex-1">
              <p className={cn("text-[11px] uppercase tracking-widest font-semibold mb-1", variant === 'dark' ? "text-white/50" : "text-[#0F172A]/50")}>Check-out</p>
              <input 
                id="widget-check-out"
                name="checkOut"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split('T')[0]}
                className={cn("bg-transparent font-medium focus:outline-none w-full cursor-pointer", variant === 'dark' ? "text-white [color-scheme:dark]" : "text-[#0F172A] [color-scheme:light]")}
              />
            </div>
          </div>
        </div>

        {/* Guests Field (Interactive Popover) */}
        <div className="flex-1 relative" ref={popoverRef}>
          <div 
            onClick={() => setIsGuestPopoverOpen(!isGuestPopoverOpen)}
            className="group cursor-pointer select-none"
          >
            <div className={cn("absolute inset-0 rounded-[14px] transition-colors", variant === 'dark' ? "bg-white/5 group-hover:bg-white/10" : "bg-black/0 group-hover:bg-black/5")} />
            <div className={cn("relative flex items-center justify-between px-5 py-4 rounded-[14px] border transition-all", variant === 'dark' ? "border-white/10" : "border-black/5", isGuestPopoverOpen && "border-[#C6A96B]")}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#C6A96B]/20 flex items-center justify-center text-[#C6A96B] shrink-0">
                  <Users size={20} />
                </div>
                <div>
                  <p className={cn("text-[11px] uppercase tracking-widest font-semibold mb-1", variant === 'dark' ? "text-white/50" : "text-[#0F172A]/50")}>Guests</p>
                  <p className={cn("font-medium text-xs sm:text-sm", variant === 'dark' ? "text-white" : "text-[#0F172A]")}>{guestsSummary}</p>
                </div>
              </div>
              <ChevronDown size={16} className={cn("transition-transform duration-200", variant === 'dark' ? "text-white/50" : "text-[#0F172A]/50", isGuestPopoverOpen && "rotate-180 text-[#C6A96B]")} />
            </div>
          </div>

          {/* Interactive Guests Popover Dropdown */}
          <AnimatePresence>
            {isGuestPopoverOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-3 p-5 rounded-[20px] bg-[#0F172A] border border-white/20 shadow-2xl text-white z-50 space-y-4"
              >
                {/* Adults Selector */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <span className="text-xs font-bold block">Adults</span>
                    <span className="text-[10px] text-white/60 font-light">Age 12+</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAdults(prev => Math.max(1, prev - 1))}
                      disabled={adults <= 1}
                      suppressHydrationWarning
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-40 flex items-center justify-center text-white transition-all"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(prev => Math.min(6, prev + 1))}
                      disabled={adults >= 6}
                      suppressHydrationWarning
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-40 flex items-center justify-center text-white transition-all"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Children Selector */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <span className="text-xs font-bold block">Children</span>
                    <span className="text-[10px] text-white/60 font-light">Age 2–11</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setChildrenCount(prev => Math.max(0, prev - 1))}
                      disabled={childrenCount <= 0}
                      suppressHydrationWarning
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-40 flex items-center justify-center text-white transition-all"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{childrenCount}</span>
                    <button
                      type="button"
                      onClick={() => setChildrenCount(prev => Math.min(4, prev + 1))}
                      disabled={childrenCount >= 4}
                      suppressHydrationWarning
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-40 flex items-center justify-center text-white transition-all"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  type="button"
                  onClick={() => setIsGuestPopoverOpen(false)}
                  suppressHydrationWarning
                  className="w-full py-2.5 bg-[#C6A96B] hover:bg-[#B8913A] text-white text-xs font-bold uppercase tracking-wider rounded-[12px] transition-all flex items-center justify-center gap-1.5"
                >
                  <Check size={14} />
                  <span>Apply Selection</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CTA */}
        <div className="md:w-[220px] flex items-stretch">
          <Link href={`/booking?checkIn=${checkIn}&checkOut=${checkOut}&guests=${adults + childrenCount}&adults=${adults}&children=${childrenCount}`} className="w-full h-full block">
            <div
              className={cn(
                "w-full h-full rounded-[14px] flex items-center justify-center gap-2 font-semibold uppercase tracking-widest text-[11px] transition-all py-4",
                variant === 'dark' 
                  ? "bg-transparent text-white shadow-[0_0_0_1px_rgba(198,169,107,0.3),0_8px_24px_rgba(198,169,107,0.2)] hover:bg-[#C6A96B] hover:shadow-none"
                  : "bg-[#B08D57] text-white hover:bg-[#8B6E43] shadow-md hover:shadow-lg"
              )}
            >
              Check Availability <span className="ml-1">→</span>
            </div>
          </Link>
        </div>

      </div>
    </motion.div>
  )
}
