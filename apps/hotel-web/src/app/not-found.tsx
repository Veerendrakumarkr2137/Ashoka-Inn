'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Compass, Home, ArrowRight } from 'lucide-react'
import { SITE_IMAGES } from '@/config/siteImages'

export default function NotFound() {
  const heroImage = SITE_IMAGES.homepage.heroBackground || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2940&auto=format&fit=crop'

  return (
    <div className="relative h-screen min-h-[650px] w-full flex items-center justify-center bg-[#0F172A] overflow-hidden font-body selection:bg-[#C6A96B] selection:text-white">

      {/* 1. Full-Screen Hotel Photo Background */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Image 
          src={heroImage} 
          alt="Ashok Inn Heritage Hotel Atmosphere" 
          fill 
          sizes="100vw"
          className="object-cover scale-105 transition-transform duration-1000"
          priority
        />
      </div>

      {/* 2. Dark Luxury Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/85 via-[#0F172A]/65 to-[#0F172A]/90 z-10" />

      {/* 3. Centered Luxury 404 Content */}
      <div className="relative z-20 text-center px-6 max-w-2xl mx-auto flex flex-col items-center">

        {/* Glowing Gold Icon Ring */}
        <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-[#C6A96B] mb-8 shadow-2xl">
          <Compass size={36} className="animate-pulse" />
        </div>

        {/* 404 Tag */}
        <span className="text-[11px] font-bold tracking-[0.4em] text-[#C6A96B] uppercase mb-4 block">
          404 • Page Not Found
        </span>

        {/* Warm Luxury Headline */}
        <h1 
          className="text-4xl sm:text-6xl md:text-7xl font-normal text-white mb-6 tracking-tight font-heading leading-tight"
          style={{ fontFamily: 'var(--font-cormorant, serif)' }}
        >
          Looks Like You’ve Taken a Wrong Turn
        </h1>

        {/* Warm Brand Copy */}
        <p className="text-white/85 text-base sm:text-lg max-w-lg mx-auto font-light leading-relaxed mb-10">
          While this page isn’t available, Ashok Inn still has plenty to explore. Discover our luxury suites, dining experiences, and warm hospitality.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-4 bg-[#C6A96B] hover:bg-[#B8913A] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-[14px] transition-all shadow-xl hover:-translate-y-[1px] flex items-center justify-center gap-2"
          >
            <Home size={14} />
            <span>Return Home</span>
          </Link>

          <Link
            href="/rooms"
            className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-[0.2em] rounded-[14px] transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Rooms</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>

    </div>
  )
}
