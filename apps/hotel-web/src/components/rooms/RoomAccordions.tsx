'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, BedDouble, Wind, Sparkles, HeartHandshake, Wifi, Tv, 
  Key, Bath, Droplets, Check, Clock, ShieldAlert, Star, ThumbsUp 
} from 'lucide-react'

export function RoomAccordions({
  category
}: {
  category: {
    name: string
    description: string
    hasAC: boolean
    hasTV: boolean
    hasKettle: boolean
    hasWater: boolean
    capacity: number
    sizeSqm?: number | null
  }
}) {
  const [openSection, setOpenSection] = useState<string | null>('overview')

  const toggle = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <div className="w-full space-y-4 my-8">
      {/* 1. OVERVIEW */}
      <div className="bg-white rounded-[20px] border border-black/5 overflow-hidden shadow-sm">
        <button
          onClick={() => toggle('overview')}
          className="w-full min-h-[52px] p-5 flex items-center justify-between text-left font-heading text-lg text-[#0F172A] font-semibold"
          aria-expanded={openSection === 'overview'}
          suppressHydrationWarning
        >
          <span>Overview & Details</span>
          <ChevronDown
            size={20}
            className={`text-[#C6A96B] transition-transform duration-300 ${
              openSection === 'overview' ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {openSection === 'overview' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-6 pt-1 border-t border-black/5 text-sm text-[#6B7280] leading-relaxed">
                <p className="mb-4">{category.description}</p>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/5 text-xs">
                  <div>
                    <span className="text-[#6B7280] block text-[10px] uppercase font-bold tracking-wider mb-1">Capacity</span>
                    <span className="font-semibold text-[#0F172A]">Up to {category.capacity} Guests</span>
                  </div>
                  {category.sizeSqm && (
                    <div>
                      <span className="text-[#6B7280] block text-[10px] uppercase font-bold tracking-wider mb-1">Room Size</span>
                      <span className="font-semibold text-[#0F172A]">{category.sizeSqm} sq.m</span>
                    </div>
                  )}
                  <div>
                    <span className="text-[#6B7280] block text-[10px] uppercase font-bold tracking-wider mb-1">Type</span>
                    <span className="font-semibold text-[#0F172A]">{category.hasAC ? 'AC Included' : 'Non-AC'}</span>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block text-[10px] uppercase font-bold tracking-wider mb-1">Bedding</span>
                    <span className="font-semibold text-[#0F172A]">1 Double Bed</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. GROUPED AMENITIES */}
      <div className="bg-white rounded-[20px] border border-black/5 overflow-hidden shadow-sm">
        <button
          onClick={() => toggle('amenities')}
          className="w-full min-h-[52px] p-5 flex items-center justify-between text-left font-heading text-lg text-[#0F172A] font-semibold"
          aria-expanded={openSection === 'amenities'}
          suppressHydrationWarning
        >
          <span>Room Amenities</span>
          <ChevronDown
            size={20}
            className={`text-[#C6A96B] transition-transform duration-300 ${
              openSection === 'amenities' ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {openSection === 'amenities' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-6 pt-2 border-t border-black/5 space-y-6">
                {/* Comfort */}
                <div>
                  <h5 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-3">Comfort</h5>
                  <div className="grid grid-cols-2 gap-3 text-xs text-[#6B7280]">
                    <div className="flex items-center gap-2"><BedDouble size={16} className="text-[#C6A96B]" /> King Bed</div>
                    {category.hasAC && <div className="flex items-center gap-2"><Wind size={16} className="text-[#C6A96B]" /> Air Conditioning</div>}
                    <div className="flex items-center gap-2"><Sparkles size={16} className="text-[#C6A96B]" /> Housekeeping</div>
                    <div className="flex items-center gap-2"><HeartHandshake size={16} className="text-[#C6A96B]" /> 24x7 Service</div>
                  </div>
                </div>

                {/* Tech */}
                <div>
                  <h5 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-3">Technology</h5>
                  <div className="grid grid-cols-2 gap-3 text-xs text-[#6B7280]">
                    <div className="flex items-center gap-2"><Wifi size={16} className="text-[#C6A96B]" /> High-Speed Wi-Fi</div>
                    {category.hasTV && <div className="flex items-center gap-2"><Tv size={16} className="text-[#C6A96B]" /> Smart TV</div>}
                    <div className="flex items-center gap-2"><Key size={16} className="text-[#C6A96B]" /> In-Room Safe</div>
                  </div>
                </div>

                {/* Bathroom */}
                <div>
                  <h5 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-3">Bathroom</h5>
                  <div className="grid grid-cols-2 gap-3 text-xs text-[#6B7280]">
                    <div className="flex items-center gap-2"><Bath size={16} className="text-[#C6A96B]" /> Premium Toiletries</div>
                    <div className="flex items-center gap-2"><Droplets size={16} className="text-[#C6A96B]" /> Hot Water</div>
                    <div className="flex items-center gap-2"><Check size={16} className="text-[#C6A96B]" /> Fresh Towels</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. POLICIES */}
      <div className="bg-white rounded-[20px] border border-black/5 overflow-hidden shadow-sm">
        <button
          onClick={() => toggle('policies')}
          className="w-full min-h-[52px] p-5 flex items-center justify-between text-left font-heading text-lg text-[#0F172A] font-semibold"
          aria-expanded={openSection === 'policies'}
          suppressHydrationWarning
        >
          <span>Hotel Policies</span>
          <ChevronDown
            size={20}
            className={`text-[#C6A96B] transition-transform duration-300 ${
              openSection === 'policies' ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {openSection === 'policies' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-6 pt-2 border-t border-black/5 space-y-4 text-xs text-[#6B7280]">
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-[#C6A96B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#0F172A] block mb-0.5">Check-in & Check-out</span>
                    Check-in starts at 12:00 PM. Check-out is until 11:00 AM. Early check-in subject to availability.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldAlert size={18} className="text-[#C6A96B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#0F172A] block mb-0.5">Cancellation Policy</span>
                    Free cancellation up to 24 hours prior to check-in. Late cancellations incur a 1-night charge.
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. REVIEWS */}
      <div className="bg-white rounded-[20px] border border-black/5 overflow-hidden shadow-sm">
        <button
          onClick={() => toggle('reviews')}
          className="w-full min-h-[52px] p-5 flex items-center justify-between text-left font-heading text-lg text-[#0F172A] font-semibold"
          aria-expanded={openSection === 'reviews'}
          suppressHydrationWarning
        >
          <div className="flex items-center gap-2">
            <span>Guest Reviews</span>
            <span className="text-xs bg-[#C6A96B]/15 text-[#C6A96B] font-bold px-2 py-0.5 rounded-full">4.9 ★</span>
          </div>
          <ChevronDown
            size={20}
            className={`text-[#C6A96B] transition-transform duration-300 ${
              openSection === 'reviews' ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {openSection === 'reviews' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-6 pt-2 border-t border-black/5 space-y-4">
                <div className="p-4 bg-[#FAF8F5] rounded-[16px] border border-black/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-[#0F172A]">Ananya S.</span>
                    <div className="flex text-amber-500 text-xs">★★★★★</div>
                  </div>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    "Exceptionally clean room, extremely comfortable bed, and warm staff hospitality. Highly recommend!"
                  </p>
                </div>
                <div className="p-4 bg-[#FAF8F5] rounded-[16px] border border-black/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-[#0F172A]">Rahul M.</span>
                    <div className="flex text-amber-500 text-xs">★★★★★</div>
                  </div>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    "Seamless booking and great room service. The quiet atmosphere was perfect."
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
