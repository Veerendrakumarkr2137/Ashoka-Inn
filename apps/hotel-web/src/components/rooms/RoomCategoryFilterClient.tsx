'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Wifi, Tv, Coffee, Sparkles, ArrowRight, ShieldCheck, Check } from 'lucide-react'
import { SwipeGallery } from '@/components/ui/SwipeGallery'
import { getCategoryImages } from '@/config/siteImages'

interface Category {
  id: string
  name: string
  description: string
  basePrice: number
  capacity: number
  sizeSqm?: number | null
  hasAC: boolean
  images: { id: string; url: string }[]
}

export function RoomCategoryFilterClient({ categories }: { categories: Category[] }) {
  const [filter, setFilter] = useState<'all' | 'suites' | 'executive' | 'family' | 'classic'>('all')

  const filterPills = [
    { id: 'all', label: 'All Accommodations' },
    { id: 'suites', label: 'Luxury Suites' },
    { id: 'executive', label: 'Executive Rooms' },
    { id: 'family', label: 'Family Accommodation' },
    { id: 'classic', label: 'Classic Rooms' },
  ]

  const CORE_ROOMS = ['deluxe non-ac', 'superior ac', 'family ac', 'king suite', 'deluxe', 'superior', 'family', 'suite']

  const validCategories = categories.filter((cat) => {
    const name = cat.name.toLowerCase()
    return CORE_ROOMS.some((core) => name.includes(core))
  })

  const filteredCategories = validCategories.filter((cat) => {
    const name = cat.name.toLowerCase()
    if (filter === 'all') return true
    if (filter === 'suites') return name.includes('suite') || name.includes('king')
    if (filter === 'executive') return name.includes('executive') || name.includes('superior')
    if (filter === 'family') return name.includes('family')
    if (filter === 'classic') return name.includes('deluxe') || !cat.hasAC
    return true
  })

  // Editorial description fallbacks
  const getEditorialDescription = (cat: Category) => {
    const name = cat.name.toLowerCase()
    if (name.includes('king') || name.includes('suite')) {
      return 'Expansive luxury suite featuring an executive living room, sunlit ambiance, and personalized hospitality services.'
    }
    if (name.includes('superior') || name.includes('executive')) {
      return 'A thoughtfully designed air-conditioned room offering quiet warmth, modern aesthetics, and everything needed for a relaxing stay.'
    }
    if (name.includes('family')) {
      return 'Spacious family sanctuary crafted for group comfort, featuring serene courtyard views and modern room care.'
    }
    return 'Designed for travelers seeking understated comfort, natural atrium light, and a peaceful night’s rest.'
  }

  return (
    <div className="space-y-16">
      {/* Category Filter Pills */}
      <div className="flex items-center justify-center flex-wrap gap-3 bg-white p-3 rounded-full shadow-sm border border-black/5 max-w-3xl mx-auto">
        {filterPills.map((pill) => (
          <button
            key={pill.id}
            onClick={() => setFilter(pill.id as any)}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all uppercase tracking-[0.15em] ${
              filter === pill.id
                ? 'bg-[#0F172A] text-white shadow-md'
                : 'text-[#6B7280] hover:text-[#0F172A] hover:bg-[#FAF8F5]'
            }`}
            suppressHydrationWarning
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Room Directory List (Version 2.0 Editorial Architecture) */}
      <div className="space-y-16">
        <AnimatePresence mode="popLayout">
          {filteredCategories.map((category, cardIdx) => {
            const galleryImages = getCategoryImages(category)
            const categoryLabel = category.name.toLowerCase().includes('suite')
              ? 'LUXURY COLLECTION'
              : category.hasAC
              ? 'AIR-CONDITIONED COMFORT'
              : 'ESSENTIAL COMFORT'

            return (
              <motion.div
                key={category.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.9, delay: cardIdx * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="bg-white rounded-[36px] p-8 sm:p-10 lg:p-12 border border-black/5 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition-all duration-350 flex flex-col lg:flex-row gap-10 lg:gap-14 items-center"
              >
                {/* 1. Large Premium Photo / Swipe Gallery with Micro Hover Zoom */}
                <div className="w-full lg:w-[50%] relative rounded-[28px] overflow-hidden min-h-[320px] sm:min-h-[380px] shadow-md group">
                  <SwipeGallery 
                    images={galleryImages}
                    altPrefix={category.name}
                    aspectRatio="aspect-[4/3] min-h-[320px] sm:min-h-[380px]"
                  />
                </div>

                {/* 2. Editorial Details & Pricing Structure */}
                <div className="w-full lg:w-[50%] flex flex-col justify-between space-y-8">
                  {/* Top Metadata */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#C6A96B]">
                        {categoryLabel}
                      </span>
                      <span className="text-xs font-medium text-[#6B7280]">
                        Designed for <strong className="text-[#0F172A] font-semibold">{category.capacity} Guests</strong>
                      </span>
                    </div>

                    {/* 15-20% Larger Heading in Cormorant Garamond */}
                    <h2 
                      className="text-4xl sm:text-5xl lg:text-6xl font-heading text-[#0F172A] font-normal leading-[1.08] tracking-tight"
                    >
                      {category.name}
                    </h2>

                    {/* Editorial Emotion-Led Description */}
                    <p className="text-base text-[#6B7280] leading-relaxed font-light">
                      {getEditorialDescription(category)}
                    </p>

                    {/* Thin Light Gold Accent Line */}
                    <div className="w-full h-[1px] bg-[#C6A96B]/25 my-6" />

                    {/* Compact Premium Amenity Chips */}
                    <div className="flex flex-wrap gap-2.5 pt-1">
                      {[
                        'High-Speed Wi-Fi',
                        'Smart HD TV',
                        'Tea & Coffee',
                        'Work Desk',
                        'Daily Housekeeping'
                      ].map((chip) => (
                        <span 
                          key={chip} 
                          className="px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-black/5 text-xs text-[#0F172A] font-medium flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C6A96B]" />
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Editorial Price & Warm CTA Row */}
                  <div className="pt-6 border-t border-black/5 flex items-center justify-between gap-6">
                    <div>
                      <span className="text-[10px] text-[#6B7280] uppercase tracking-[0.25em] font-semibold block mb-1">
                        STARTING FROM
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl sm:text-4xl font-heading font-bold text-[#0F172A]">
                          ₹{category.basePrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-[#6B7280] font-light">per night</span>
                      </div>
                    </div>

                    {/* Warm CTA "Reserve Your Stay →" with 1px Tactile Lift */}
                    <Link
                      href={`/rooms/${category.id}`}
                      className="inline-flex items-center gap-2.5 px-7 py-4 bg-[#0F172A] hover:bg-[#C6A96B] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-[14px] transition-all duration-250 hover:-translate-y-[1px] shadow-md hover:shadow-lg shrink-0"
                    >
                      Reserve Your Stay <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
