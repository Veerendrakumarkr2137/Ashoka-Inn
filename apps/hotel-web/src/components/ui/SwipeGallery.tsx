'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Hand } from 'lucide-react'

export function SwipeGallery({
  images,
  altPrefix = 'Gallery Image',
  aspectRatio = 'aspect-[4/3]'
}: {
  images: string[]
  altPrefix?: string
  aspectRatio?: string
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showHint, setShowHint] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (!containerRef.current) return
    const { scrollLeft, clientWidth } = containerRef.current
    const index = Math.round(scrollLeft / clientWidth)
    setActiveIndex(index)
    if (showHint && scrollLeft > 10) {
      setShowHint(false)
    }
  }

  const scrollToIndex = (index: number) => {
    if (!containerRef.current) return
    const clientWidth = containerRef.current.clientWidth
    containerRef.current.scrollTo({
      left: index * clientWidth,
      behavior: 'smooth'
    })
    setActiveIndex(index)
  }

  return (
    <div className="relative w-full overflow-hidden group">
      {/* Scrollable Container with Snap points */}
      <motion.div
        ref={containerRef}
        onScroll={handleScroll}
        initial={{ x: 15 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className={`flex w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide ${aspectRatio}`}
      >
        {images.map((src, idx) => (
          <div key={idx} className={`w-full shrink-0 snap-center relative ${aspectRatio}`}>
            <Image
              src={src}
              alt={`${altPrefix} ${idx + 1}`}
              fill
              className="object-cover"
              priority={idx === 0}
            />
          </div>
        ))}
      </motion.div>

      {/* Swipe Affordance Badge Hint (Fades out when swiped) */}
      {showHint && images.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute top-4 right-4 z-20 bg-black/65 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 shadow-lg pointer-events-none"
        >
          <motion.span
            animate={{ x: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex items-center gap-1"
          >
            Swipe <Hand size={12} className="text-[#C6A96B]" />
          </motion.span>
        </motion.div>
      )}

      {/* Touch & Desktop Mouse Arrow Controls */}
      {images.length > 1 && (
        <div className="absolute inset-x-3 lg:inset-x-4 top-1/2 -translate-y-1/2 flex justify-between items-center z-20 pointer-events-none">
          <button
            onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            className={`w-9 h-9 lg:w-11 lg:h-11 rounded-full bg-black/40 lg:bg-white/90 backdrop-blur-md text-white lg:text-[#0F172A] flex items-center justify-center transition-all pointer-events-auto shadow-md ${
              activeIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-80 active:scale-95 hover:opacity-100 hover:scale-105'
            }`}
            aria-label="Previous image"
            suppressHydrationWarning
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={() => scrollToIndex(Math.min(images.length - 1, activeIndex + 1))}
            disabled={activeIndex === images.length - 1}
            className={`w-9 h-9 lg:w-11 lg:h-11 rounded-full bg-black/40 lg:bg-white/90 backdrop-blur-md text-white lg:text-[#0F172A] flex items-center justify-center transition-all pointer-events-auto shadow-md ${
              activeIndex === images.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-80 active:scale-95 hover:opacity-100 hover:scale-105'
            }`}
            aria-label="Next image"
            suppressHydrationWarning
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Pagination Indicators (Dots + Counter) */}
      {images.length > 1 && (
        <div className="absolute bottom-4 inset-x-0 z-20 flex items-center justify-between px-4 pointer-events-none">
          <div className="bg-black/50 backdrop-blur-md text-white text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full">
            {activeIndex + 1} / {images.length}
          </div>

          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 pointer-events-auto ${
                  i === activeIndex ? 'w-5 bg-[#C6A96B]' : 'w-1.5 bg-white/50'
                }`}
                aria-label={`Go to slide ${i + 1}`}
                suppressHydrationWarning
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
