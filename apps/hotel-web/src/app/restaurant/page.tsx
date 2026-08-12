'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Utensils, Wine, Coffee, ArrowRight, Clock, CheckCircle2, IceCream, Flame, Compass } from 'lucide-react'
import { SITE_IMAGES } from '@/config/siteImages'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { TableReservationModal } from '@/components/restaurant/TableReservationModal'

export default function RestaurantOverviewPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeVenue, setActiveVenue] = useState<'dLounge' | 'hikkups' | 'mercelys'>('dLounge')

  const openReservation = (venue: 'dLounge' | 'hikkups' | 'mercelys') => {
    setActiveVenue(venue)
    setIsModalOpen(true)
  }

  const defaultFallback = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2940&auto=format&fit=crop'

  const venues = [
    {
      id: 'd-lounge',
      name: 'D Lounge Restaurant',
      tagline: 'Multi-Cuisine Fine Dining',
      description: 'Our flagship dining destination offering a rich multi-cuisine menu for Breakfast, Lunch & Dinner. Enjoy regional South Indian tiffins, North Indian curries, and international gourmet cuisine.',
      image: (SITE_IMAGES.dining.dLounge && SITE_IMAGES.dining.dLounge[0]) || defaultFallback,
      hours: '7:00 AM – 11:30 PM',
      href: '/restaurant/d-lounge',
      venueKey: 'dLounge' as const,
      highlights: ['Multi-Cuisine Buffets', 'Regional & Global Specialties', 'Sunlit Family Atmosphere']
    },
    {
      id: 'mercelys',
      name: 'Mercely’s Kefi Ice Cream',
      tagline: 'Premium Ice Creams & Trikulfi',
      description: 'A dedicated dessert parlour located at the hotel facade. Featuring Mercely’s Kefi ice cream scoops, authentic Trikulfi specialties, sundaes, and a sweet corner for families.',
      image: (SITE_IMAGES.dining.mercelys && SITE_IMAGES.dining.mercelys[0]) || defaultFallback,
      hours: '10:00 AM – 11:30 PM',
      href: '/restaurant/mercelys',
      venueKey: 'mercelys' as const,
      highlights: ['Premium Mercely’s Kefi Ice Cream', 'Signature Trikulfi Specialties', 'Family Dessert Corner']
    },
    {
      id: 'the-hikkups',
      name: 'The Hikkups BBQ & Bar',
      tagline: 'Signature Live BBQ & Cocktails',
      description: 'Our signature BBQ outlet and full-service lounge featuring live sizzlers, charcoal grilled meats and veggies, handcrafted cocktails, fine spirits, and evening music.',
      image: (SITE_IMAGES.dining.hikkups && SITE_IMAGES.dining.hikkups[0]) || defaultFallback,
      hours: '11:00 AM – 11:30 PM',
      href: '/restaurant/the-hikkups',
      venueKey: 'hikkups' as const,
      highlights: ['Live Charcoal BBQ & Sizzlers', 'Handcrafted Craft Cocktails', 'Energetic Evening Lounge']
    },
    {
      id: 'room-service',
      name: '24×7 In-Room Dining',
      tagline: 'Round-The-Clock In-Room Care',
      description: 'Freshly prepared delicacies from D Lounge and The Hikkups, delivered straight to your room folio whenever you choose, 24 hours a day.',
      image: (SITE_IMAGES.dining.roomService && SITE_IMAGES.dining.roomService[0]) || defaultFallback,
      hours: 'Available 24 Hours / 7 Days',
      href: '/restaurant/room-service',
      venueKey: null,
      highlights: ['24/7 Fast Room Delivery', 'Billed Directly to Room Folio', 'Custom Dietary Orders']
    }
  ]

  return (
    <main className="bg-[#FAF8F5] min-h-screen pb-32 font-body">

      {/* 1. Hero Section */}
      <div className="relative h-[70vh] min-h-[600px] w-full flex items-center justify-center bg-[#0F172A] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-55">
          <Image 
            src={(SITE_IMAGES.dining.dLounge && SITE_IMAGES.dining.dLounge[0]) || defaultFallback} 
            alt="Dining at Ashok Inn Davangere" 
            fill 
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/50 via-[#0F172A]/30 to-[#FAF8F5] z-10" />

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-20">
          <span className="text-[11px] font-bold tracking-[0.35em] text-[#C6A96B] uppercase mb-4 block">
            Culinary Experiences
          </span>
          <h1 
            className="text-5xl sm:text-7xl md:text-8xl font-normal text-white mb-6 tracking-tight font-heading leading-none"
            style={{ fontFamily: 'var(--font-cormorant, serif)' }}
          >
            Dining at Ashok Inn
          </h1>
          <p className="text-white/90 text-base sm:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-10">
            Four distinct culinary destinations crafted to offer unique gastronomic journeys.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a 
              href="#venues" 
              className="bg-[#0F172A] hover:bg-[#C6A96B] text-white px-8 py-4 rounded-[14px] text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-lg hover:-translate-y-[1px]"
            >
              Explore All Venues
            </a>
            <button 
              onClick={() => openReservation('dLounge')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-[14px] text-xs font-bold uppercase tracking-[0.2em] transition-all"
              suppressHydrationWarning
            >
              Reserve a Table
            </button>
          </div>
        </div>
      </div>


      {/* 2. Intro Philosophy */}
      <section className="py-24 sm:py-32 px-6 max-w-4xl mx-auto text-center">
        <ScrollReveal type="text">
          <span className="text-[11px] font-bold tracking-[0.3em] text-[#C6A96B] uppercase block mb-4">
            Four Distinct Destinations
          </span>
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-heading text-[#0F172A] font-normal leading-[1.3] tracking-tight mb-8"
            style={{ fontFamily: 'var(--font-cormorant, serif)' }}
          >
            Four Dedicated Venues Under One Roof — Each created to answer your appetite with authentic flavor, warm service, and unique atmosphere.
          </h2>
          <div className="w-16 h-[1px] bg-[#C6A96B] mx-auto" />
        </ScrollReveal>
      </section>


      {/* 3. Venue Showcase Cards */}
      <section id="venues" className="scroll-mt-32 max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
        {venues.map((venue, idx) => {
          const isEven = idx % 2 === 0
          return (
            <ScrollReveal 
              key={venue.id} 
              type="text" 
              className="bg-white rounded-[32px] overflow-hidden border border-black/5 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-0"
            >
              {/* Image Column */}
              <div className={`relative aspect-[4/3] lg:aspect-auto lg:col-span-6 group ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                <Image 
                  src={venue.image || defaultFallback} 
                  alt={venue.name} 
                  fill 
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>

              {/* Text Content Column */}
              <div className={`p-8 sm:p-12 lg:col-span-6 flex flex-col justify-between space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C6A96B] block mb-2">
                    0{idx + 1} • {venue.tagline}
                  </span>
                  <h3 
                    className="text-3xl sm:text-4xl font-heading text-[#0F172A] mb-4 font-normal" 
                    style={{ fontFamily: 'var(--font-cormorant, serif)' }}
                  >
                    {venue.name}
                  </h3>
                  <p className="text-[#6B7280] text-sm sm:text-base leading-relaxed font-light mb-6">
                    {venue.description}
                  </p>

                  <div className="space-y-2 border-y border-black/5 py-4 mb-6">
                    {venue.highlights.map((item) => (
                      <div key={item} className="flex items-center gap-2.5 text-xs font-semibold text-[#0F172A]">
                        <CheckCircle2 size={15} className="text-[#C6A96B] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div>
                    <span className="text-[10px] uppercase text-[#6B7280] font-semibold tracking-wider block">Hours</span>
                    <span className="text-xs font-bold text-[#0F172A]">{venue.hours}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={venue.href}
                      className="px-6 py-3.5 bg-[#0F172A] hover:bg-[#C6A96B] text-white text-xs font-bold uppercase tracking-[0.18em] rounded-[14px] transition-all shadow-md flex items-center gap-2 group"
                    >
                      <span>Explore Venue</span>
                      <ArrowRight size={14} className="transition-transform duration-250 group-hover:translate-x-1" />
                    </Link>

                    {venue.venueKey && (
                      <button
                        onClick={() => openReservation(venue.venueKey!)}
                        className="px-4 py-3.5 bg-[#FAF8F5] hover:bg-black/5 text-[#0F172A] border border-black/10 text-xs font-bold uppercase tracking-[0.15em] rounded-[14px] transition-all"
                        suppressHydrationWarning
                      >
                        Reserve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )
        })}
      </section>

      {/* Table Reservation Modal */}
      <TableReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultVenue={activeVenue}
      />

    </main>
  )
}
