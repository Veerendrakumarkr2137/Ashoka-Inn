import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@hospitality-os/database'
import { Wifi, Tv, Coffee, Droplets, Users, ChevronLeft, ChevronRight, Heart, ArrowRight, ShieldCheck, Sparkles, Fan } from 'lucide-react'
import { BookingWidget } from '@/components/booking/BookingWidget'
import { SwipeGallery } from '@/components/ui/SwipeGallery'
import { SITE_IMAGES, getCategoryImages } from '@/config/siteImages'
import { RoomCategoryFilterClient } from '@/components/rooms/RoomCategoryFilterClient'

// Server Component fetching categories directly from Prisma
export default async function RoomsPage() {
  const categories = await prisma.roomCategory.findMany({
    include: {
      images: true,
      rooms: true,
    },
    orderBy: {
      basePrice: 'asc',
    },
  })

  return (
    <main className="bg-[#FAF8F5] min-h-screen pb-24 font-body">
      {/* Hero Banner */}
      <div className="relative w-full h-[450px] sm:h-[500px] flex items-center justify-center bg-[#0F172A] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image 
            src={SITE_IMAGES.roomsListingPage.heroBackground}
            alt="Hotel Room"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/70 via-[#0F172A]/40 to-[#FAF8F5] z-10" />

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-16">
          <span className="text-[10px] sm:text-xs font-bold tracking-[0.3em] text-[#C6A96B] uppercase mb-4 block">
            Accommodations at Ashok Inn
          </span>
          <h1 
            className="text-4xl sm:text-6xl lg:text-7xl font-normal text-white mb-6 tracking-tight font-heading leading-tight"
            style={{ fontFamily: 'var(--font-playfair, serif)' }}
          >
            Sanctuary of Comfort
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
            Thoughtfully designed accommodations, blending modern refinement with tranquil open atrium architecture.
          </p>
        </div>
      </div>

      {/* Main Room Directory with Category Pills */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-30">
        <RoomCategoryFilterClient categories={categories} />
      </div>

      {/* Hospitality Standards & Amenities Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="bg-white rounded-[32px] p-8 sm:p-12 lg:p-16 border border-black/5 shadow-sm text-center">
          <span className="text-xs font-bold tracking-[0.3em] text-[#C6A96B] uppercase block mb-3">
            Inclusions
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading text-[#0F172A] mb-12" style={{ fontFamily: 'var(--font-playfair, serif)' }}>
            Every Stay Includes
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Wifi, title: 'High-Speed Wi-Fi', desc: 'Seamless connectivity throughout' },
              { icon: Sparkles, title: '24/7 Room Service', desc: 'Around-the-clock dining & care' },
              { icon: Coffee, title: 'Complimentary Tea/Coffee', desc: 'In-room kettle & refreshers' },
              { icon: ShieldCheck, title: '24/7 Security', desc: 'Safe & secure environment' },
            ].map((item) => (
              <div key={item.title} className="p-4">
                <div className="w-12 h-12 rounded-full bg-[#FAF8F5] flex items-center justify-center mx-auto mb-4 text-[#C6A96B]">
                  <item.icon size={22} />
                </div>
                <h3 className="font-heading font-bold text-[#0F172A] mb-1">{item.title}</h3>
                <p className="text-xs text-[#6B7280]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
