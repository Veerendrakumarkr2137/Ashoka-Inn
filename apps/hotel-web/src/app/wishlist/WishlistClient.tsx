'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Heart, Star, Trash2, ArrowRight, ArrowLeft, BedDouble, Check, Calendar,
  ShieldCheck, RefreshCw, Layers, Sparkles, Scale
} from 'lucide-react'
import { SITE_IMAGES } from '@/config/siteImages'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export interface WishlistItem {
  id: string
  slug: string
  name: string
  price: number
  rating: number
  image: string
  description: string
  capacity: number
  hasAC: boolean
}

interface WishlistClientProps {
  initialItems: WishlistItem[]
}

export function WishlistClient({ initialItems }: WishlistClientProps) {
  const [items, setItems] = useState<WishlistItem[]>(initialItems)
  const [compareList, setCompareList] = useState<string[]>([])
  const [showCompareModal, setShowCompareModal] = useState(false)

  const handleRemove = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
    setCompareList(prev => prev.filter(itemId => itemId !== id))
  }

  const toggleCompare = (id: string) => {
    if (compareList.includes(id)) {
      setCompareList(prev => prev.filter(itemId => itemId !== id))
    } else {
      if (compareList.length >= 3) {
        alert('You can compare up to 3 rooms at a time.')
        return
      }
      setCompareList(prev => [...prev, id])
    }
  }

  const recommendedRooms: WishlistItem[] = [
    {
      id: 'rec-1',
      slug: 'king-suite',
      name: 'King Suite Experience',
      price: 6999,
      rating: 4.9,
      image: SITE_IMAGES.rooms['king-suite'][0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2874&auto=format&fit=crop',
      description: 'Master luxury suite featuring separate living room, plush king bedding, and VIP amenities.',
      capacity: 3,
      hasAC: true
    },
    {
      id: 'rec-2',
      slug: 'family-ac',
      name: 'Family AC Suite',
      price: 5499,
      rating: 4.8,
      image: SITE_IMAGES.rooms['family-ac'][0] || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2874&auto=format&fit=crop',
      description: 'Spacious family layout with dual beds, climate control, and high-speed Wi-Fi.',
      capacity: 4,
      hasAC: true
    },
    {
      id: 'rec-3',
      slug: 'superior-ac',
      name: 'Superior AC Room',
      price: 3999,
      rating: 4.7,
      image: SITE_IMAGES.rooms['superior-ac'][0] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2874&auto=format&fit=crop',
      description: 'Refined modern guestroom with air conditioning, workspace, and premium bath essentials.',
      capacity: 2,
      hasAC: true
    }
  ]

  const handleAddRecommended = (room: WishlistItem) => {
    if (!items.some(i => i.slug === room.slug)) {
      setItems(prev => [...prev, room])
    }
  }

  const estimatedTotal = items.reduce((acc, item) => acc + item.price, 0)

  return (
    <main className="bg-[#FAF8F5] min-h-screen pb-32 font-body selection:bg-[#C6A96B] selection:text-white">

      {/* 1. HERO (28vh Sleek Compact Luxury Header) */}
      <div className="relative h-[28vh] min-h-[250px] w-full flex items-center justify-center bg-[#0F172A] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-60">
          <Image 
            src={SITE_IMAGES.homepage.heroBackground} 
            alt="Ashok Inn Wishlist" 
            fill 
            sizes="100vw"
            className="object-cover scale-105"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/85 via-[#0F172A]/50 to-[#FAF8F5] z-10" />

        <div className="relative z-20 text-center px-4 max-w-3xl mx-auto pt-16 pb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white/80 font-semibold mb-3 shadow-sm">
            <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
              <ArrowLeft size={13} /> Home
            </Link>
            <span>/</span>
            <span className="text-[#C6A96B]">My Wishlist</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading text-white font-normal mb-1.5" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
            Your Favourite Stays, Saved for Later
          </h1>
          <p className="text-white/80 text-xs sm:text-sm font-light max-w-md mx-auto leading-relaxed">
            Keep your preferred accommodations and experiences in one private collection until you're ready to book.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-20 -mt-6 relative z-30">

        {/* 2. QUICK STATS SUMMARY BAR (SAVED ROOMS PRIMARY METRIC HIGHLIGHT) */}
        <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-black/5 shadow-xl flex flex-wrap items-center justify-between gap-6">
          
          {/* Primary Metric: Saved Rooms */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[20px] bg-[#0F172A] border-2 border-[#C6A96B] flex items-center justify-center text-[#C6A96B] shadow-md shrink-0">
              <Heart size={26} className="fill-[#C6A96B]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C6A96B] block">Primary Collection</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-bold font-heading text-[#0F172A]" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                  {items.length}
                </span>
                <span className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
                  {items.length === 1 ? 'Saved Stay' : 'Saved Stays'}
                </span>
              </div>
            </div>
          </div>

          {/* Secondary Metrics */}
          <div className="flex items-center gap-8 text-xs">
            <div className="hidden sm:block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block">Average Rating</span>
              <span className="font-bold text-[#0F172A] flex items-center gap-1 mt-0.5">
                ⭐ 4.9 / 5.0 (TripAdvisor)
              </span>
            </div>

            <div className="hidden md:block w-px h-10 bg-black/8" />

            <div className="hidden md:block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block">Last Updated</span>
              <span className="font-bold text-[#0F172A] mt-0.5 block">Today</span>
            </div>

            <div className="hidden lg:block w-px h-10 bg-black/8" />

            <div className="hidden lg:block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block">Est. 1-Night Total</span>
              <span className="font-bold text-[#0F172A] text-sm mt-0.5 block">₹{estimatedTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Compare Action Button */}
          {items.length > 0 && compareList.length > 0 && (
            <button
              onClick={() => setShowCompareModal(true)}
              suppressHydrationWarning
              className="px-6 py-3.5 bg-[#0F172A] hover:bg-[#C6A96B] text-white text-xs font-bold uppercase tracking-widest rounded-[14px] shadow-md flex items-center gap-2 transition-all hover:-translate-y-[1px]"
            >
              <Layers size={15} />
              <span>Compare Selected ({compareList.length})</span>
            </button>
          )}
        </div>

        {/* 3. SAVED ROOMS GRID OR LUXURY EMPTY STATE */}
        {items.length === 0 ? (
          /* LUXURY EMPTY STATE */
          <div className="relative rounded-[32px] overflow-hidden bg-[#0F172A] text-white p-12 sm:p-20 text-center shadow-2xl border border-white/10">
            <div className="absolute inset-0 z-0 opacity-40">
              <Image 
                src={SITE_IMAGES.homepage.welcomeLobby} 
                alt="Ashok Inn Ambiance" 
                fill 
                sizes="100vw"
                className="object-cover scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/85 via-[#0F172A]/70 to-[#0F172A]/95 z-10" />

            <div className="relative z-20 max-w-md mx-auto space-y-5">
              <div className="w-16 h-16 rounded-full bg-[#C6A96B]/20 border border-[#C6A96B]/30 flex items-center justify-center mx-auto text-[#C6A96B] shadow-inner">
                <Heart size={30} />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C6A96B] block">Your Wishlist is Waiting</span>
                <h3 className="text-3xl font-heading font-normal" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                  Save Rooms You’d Like to Revisit
                </h3>
                <p className="text-white/70 text-xs font-light leading-relaxed">
                  Explore our luxury suites and guestrooms. Save your favorite options to compare prices and plan your visit.
                </p>
              </div>

              <Link
                href="/rooms"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#C6A96B] hover:bg-[#B8913A] text-white font-bold text-xs uppercase tracking-widest rounded-[14px] transition-all shadow-lg hover:-translate-y-[1px]"
              >
                <span>Explore Luxury Rooms</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          /* SAVED ROOMS 3-COLUMN DESKTOP GRID */
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-heading text-[#0F172A]" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                Your Saved Accommodations
              </h2>
              <span className="text-xs text-[#6B7280] font-light">
                {items.length} {items.length === 1 ? 'item' : 'items'} in your wishlist
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {items.map(item => {
                const isCompared = compareList.includes(item.id)
                return (
                  <ScrollReveal key={item.id} type="text" className="h-full">
                    <div className="bg-white rounded-[28px] border border-black/5 shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between h-full">
                      <div>
                        {/* Image Header */}
                        <div className="relative aspect-[16/10] w-full bg-[#0F172A] overflow-hidden">
                          <Image 
                            src={item.image} 
                            alt={item.name} 
                            fill 
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4 z-10">
                            <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                              ⭐ {item.rating}
                            </span>
                          </div>

                          <button
                            onClick={() => handleRemove(item.id)}
                            suppressHydrationWarning
                            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-rose-500 text-gray-700 hover:text-white flex items-center justify-center transition-all shadow-md"
                            title="Remove from wishlist"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Card Body */}
                        <div className="p-6 space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                              {item.name}
                            </h3>
                          </div>
                          
                          <p className="text-xs text-[#6B7280] font-light leading-relaxed line-clamp-2">
                            {item.description}
                          </p>

                          <div className="flex items-center justify-between pt-3 border-t border-black/5">
                            <div>
                              <span className="text-[10px] font-bold uppercase text-[#6B7280] block">Price per night</span>
                              <span className="text-xl font-bold text-[#0F172A]">₹{item.price.toLocaleString()}</span>
                            </div>
                            <span className="text-xs text-[#6B7280] font-medium">Up to {item.capacity} Guests</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Actions (Remove, Compare, Book Now) */}
                      <div className="p-6 pt-0 space-y-2.5">
                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            onClick={() => handleRemove(item.id)}
                            suppressHydrationWarning
                            className="py-2.5 px-3 bg-[#FAF8F5] hover:bg-rose-50 text-gray-600 hover:text-rose-700 text-[11px] font-bold uppercase tracking-wider rounded-[12px] transition-all border border-black/8 flex items-center justify-center gap-1.5"
                          >
                            <Trash2 size={13} />
                            <span>Remove</span>
                          </button>

                          <button
                            onClick={() => toggleCompare(item.id)}
                            suppressHydrationWarning
                            className={`py-2.5 px-3 text-[11px] font-bold uppercase tracking-wider rounded-[12px] transition-all border flex items-center justify-center gap-1.5 ${isCompared ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-sm' : 'bg-[#FAF8F5] text-[#0F172A] border-black/8 hover:bg-gray-100'}`}
                          >
                            {isCompared ? <Check size={13} className="text-[#C6A96B]" /> : <Scale size={13} />}
                            <span>{isCompared ? 'Compared' : 'Compare'}</span>
                          </button>
                        </div>

                        <Link
                          href={`/booking?room=${item.slug}`}
                          className="w-full py-3 bg-[#C6A96B] hover:bg-[#B8913A] text-white text-xs font-bold uppercase tracking-wider rounded-[12px] transition-all shadow-md text-center flex items-center justify-center gap-1.5 hover:-translate-y-[1px]"
                        >
                          <span>Book Now</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>

                    </div>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        )}

        {/* 4. RECOMMENDED FOR YOU SECTION (SPACED BY 80px) */}
        <section className="space-y-8 pt-12 border-t border-black/8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C6A96B] block mb-1">
                Curated Suggestions
              </span>
              <h2 className="text-3xl font-heading text-[#0F172A]" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                Recommended Rooms for You
              </h2>
            </div>

            <Link href="/rooms" className="text-xs font-bold text-[#C6A96B] uppercase tracking-wider hover:underline flex items-center gap-1">
              <span>View All Accommodations</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedRooms.map(room => (
              <div key={room.id} className="bg-white rounded-[24px] p-5 border border-black/5 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] w-full rounded-[18px] overflow-hidden bg-[#0F172A]">
                    <Image src={room.image} alt={room.name} fill sizes="33vw" className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-[#0F172A]" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>{room.name}</h4>
                    <p className="text-xs text-[#6B7280] font-light leading-relaxed mt-1">{room.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-black/5">
                  <span className="text-base font-bold text-[#0F172A]">₹{room.price.toLocaleString()} <span className="text-xs text-[#6B7280] font-normal">/ night</span></span>
                  <button
                    onClick={() => handleAddRecommended(room)}
                    suppressHydrationWarning
                    className="px-4 py-2 bg-[#FAF8F5] hover:bg-[#0F172A] hover:text-white text-[#0F172A] text-xs font-bold uppercase tracking-wider rounded-[10px] transition-all border border-black/5"
                  >
                    + Add to Wishlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. RECENTLY VIEWED CAROUSEL / STRIP */}
        <section className="bg-white rounded-[32px] p-8 sm:p-10 border border-black/5 shadow-lg space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-heading text-[#0F172A]" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
              Recently Viewed Stays
            </h3>
            <span className="text-xs text-[#6B7280] font-light">Browsing History</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recommendedRooms.slice(0, 4).map((r, idx) => (
              <Link key={idx} href={`/rooms?type=${r.slug}`} className="group space-y-2 block">
                <div className="relative aspect-[4/3] rounded-[16px] overflow-hidden bg-black/5 border border-black/5">
                  <Image src={r.image} alt={r.name} fill sizes="25vw" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <h5 className="font-bold text-xs text-[#0F172A] group-hover:text-[#C6A96B] transition-colors">{r.name}</h5>
              </Link>
            ))}
          </div>
        </section>

        {/* 6. FINAL BOOKING CTA BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 sm:p-12 bg-[#0F172A] text-white rounded-[32px] shadow-2xl">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C6A96B] block">Personalized Hospitality</span>
            <h4 className="text-2xl sm:text-3xl font-heading font-normal" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
              Ready to Confirm Your Reservation?
            </h4>
            <p className="text-xs text-white/70 font-light max-w-md">
              Enjoy best rates guaranteed, complimentary breakfast, and flexible cancellation when booking directly with Ashok Inn.
            </p>
          </div>

          <Link
            href="/booking"
            className="w-full sm:w-auto px-9 py-4 bg-[#C6A96B] hover:bg-[#B8913A] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-[14px] transition-all shadow-md flex items-center justify-center gap-2 shrink-0 hover:-translate-y-[1px]"
          >
            <span>Proceed to Booking</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>

      {/* COMPARE MODAL */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-4xl w-full p-8 space-y-6 shadow-2xl border border-black/5">
            <div className="flex items-center justify-between border-b border-black/8 pb-4">
              <h3 className="text-2xl font-heading text-[#0F172A]" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                Compare Saved Accommodations
              </h3>
              <button onClick={() => setShowCompareModal(false)} suppressHydrationWarning className="text-gray-400 hover:text-gray-700 font-bold text-sm">
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {items.filter(i => compareList.includes(i.id)).map(compItem => (
                <div key={compItem.id} className="space-y-3 bg-[#FAF8F5] p-5 rounded-[20px] border border-black/5">
                  <div className="relative aspect-[16/10] w-full rounded-[14px] overflow-hidden">
                    <Image src={compItem.image} alt={compItem.name} fill sizes="33vw" className="object-cover" />
                  </div>
                  <h4 className="font-bold text-base text-[#0F172A]">{compItem.name}</h4>
                  <p className="text-lg font-bold text-[#C6A96B]">₹{compItem.price.toLocaleString()} <span className="text-xs text-gray-500 font-normal">/ night</span></p>
                  <div className="space-y-1 text-xs text-gray-600 font-light border-t border-black/5 pt-2">
                    <p>Capacity: {compItem.capacity} Guests</p>
                    <p>Rating: ⭐ {compItem.rating}</p>
                    <p>Climate Control: {compItem.hasAC ? 'AC Room' : 'Non-AC'}</p>
                  </div>
                  <Link href={`/booking?room=${compItem.slug}`} className="block w-full py-2.5 bg-[#0F172A] text-white text-center text-xs font-bold uppercase rounded-[10px] mt-2">
                    Book Now
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </main>
  )
}
