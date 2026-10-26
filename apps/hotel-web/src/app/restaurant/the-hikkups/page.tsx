'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { SITE_IMAGES } from '@/config/siteImages'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { TableReservationModal } from '@/components/restaurant/TableReservationModal'

export default function TheHikkupsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const defaultFallback = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2940&auto=format&fit=crop'
  const venueImages = SITE_IMAGES.dining.hikkups || []
  const getLoopImg = (index: number) => {
    if (!venueImages || venueImages.length === 0) return defaultFallback
    return venueImages[index % venueImages.length] || defaultFallback
  }
  const heroImage = getLoopImg(0)
  const galleryImages = venueImages.length > 1 ? venueImages.slice(1) : venueImages

  const signatureStories = [
    {
      title: 'Hikkups Live Charcoal Sizzler Platter',
      subtitle: 'CHARCOAL BBQ MASTERPIECE',
      story: 'An exhilarating sizzler platter featuring smoked chicken tikka, succulent lamb chops, seekh kebabs, and grilled bell peppers served over live charcoal coals on cast iron.',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2940&auto=format&fit=crop',
    },
    {
      title: 'The Smoked Old Fashioned',
      subtitle: 'CRAFT MIXOLOGY SIGNATURE',
      story: 'Aged bourbon infused with real oak wood smoke, aromatic bitters, maraschino cherry, and flame-singed orange peel. Prepared by our master mixologist at your table side.',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2940&auto=format&fit=crop',
    },
    {
      title: 'Smoked Hickory BBQ Wings',
      subtitle: 'SLOW-SMOKED SPECIALTY',
      story: 'Jumbo chicken wings slow-smoked for three hours and tossed in our house-brewed applewood hickory BBQ glaze with toasted white sesame.',
      image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?q=80&w=2940&auto=format&fit=crop',
    },
  ]

  const venueExperienceTags = [
    'Live Charcoal BBQ Grills',
    'Handcrafted Cocktail Bar',
    'Evening Lounge Ambience',
    'Live Sports Screenings',
    'Indoor & Outdoor Seating',
    'Craft Mocktails & Fine Brews',
    'Valet & Free Parking',
    'Attentive Lounge Service',
  ]

  return (
    <main className="bg-[#FAF8F5] min-h-screen pb-32 font-body selection:bg-[#C6A96B] selection:text-white">

      {/* 1. HERO (Full Screen Destination Reveal) */}
      <div className="relative h-[88vh] min-h-[650px] w-full flex items-center justify-center bg-[#0F172A] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-65">
          <Image 
            src={heroImage} 
            alt="The Hikkups BBQ & Bar Destination Hero" 
            fill 
            sizes="100vw"
            className="object-cover scale-105 transition-transform duration-1000"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/70 via-[#0F172A]/40 to-[#FAF8F5] z-10" />

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-24">
          
          {/* Integrated Clean Breadcrumb */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white/80 font-semibold mb-6">
            <Link href="/restaurant" className="hover:text-white flex items-center gap-1 transition-colors">
              <ArrowLeft size={13} /> Dining
            </Link>
            <span>/</span>
            <span className="text-[#C6A96B]">The Hikkups</span>
          </div>

          <span className="text-[11px] font-bold tracking-[0.4em] text-[#C6A96B] uppercase mb-4 block">
            Signature BBQ & Cocktails Lounge
          </span>
          <h1 
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-normal text-white mb-6 tracking-tight font-heading leading-none"
            style={{ fontFamily: 'var(--font-cormorant, serif)' }}
          >
            The Hikkups
          </h1>
          <p className="text-white/90 text-base sm:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-10">
            A high-energy lounge destination featuring live charcoal sizzlers, oak-smoked spirits, and vibrant evening gatherings.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#C6A96B] hover:bg-[#B8913A] text-white px-9 py-4 rounded-[14px] text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-xl hover:-translate-y-[1px]"
            suppressHydrationWarning
          >
            Reserve Bar Table
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-32 pt-24">

        {/* 2. OVERLAPPING EDITORIAL SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text Column */}
          <ScrollReveal type="text" className="lg:col-span-6 space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#C6A96B] block">
              The Evening Vibe
            </span>
            
            <h2 
              className="text-4xl sm:text-5xl lg:text-6xl font-heading text-[#0F172A] leading-[1.15] font-normal" 
              style={{ fontFamily: 'var(--font-cormorant, serif)' }}
            >
              Where Live Charcoal Flames Meet Craft Spirits
            </h2>

            <div className="w-16 h-[1px] bg-[#C6A96B] opacity-60" />

            <p className="text-base sm:text-lg italic font-heading text-[#0F172A] leading-relaxed" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
              &ldquo;At The Hikkups, evenings come alive with the aroma of live charcoal grills, oak wood smoke, and handcrafted pours.&rdquo;
            </p>

            <p className="text-[#6B7280] text-sm sm:text-base leading-relaxed font-light max-w-xl">
              Step into an energetic evening space designed for post-work relaxation and lively gatherings. Enjoy smoked BBQ sizzlers, imported brews, and table-side mixology in a warm lounge setting.
            </p>

            <div className="flex items-center gap-4 pt-2 flex-wrap">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#0F172A] hover:bg-[#C6A96B] text-white px-7 py-3.5 rounded-[14px] text-xs font-bold uppercase tracking-[0.18em] transition-all shadow-md"
                suppressHydrationWarning
              >
                Reserve Bar Table
              </button>
              <a 
                href="#signature-stories"
                className="text-xs font-bold uppercase tracking-[0.18em] text-[#0F172A] hover:text-[#C6A96B] transition-colors flex items-center gap-1.5 py-3.5"
              >
                <span>Flames & Spirits</span>
                <ArrowRight size={14} />
              </a>
            </div>

            {/* Elegant Sub-Text Detail */}
            <div className="pt-4 border-t border-black/5 text-[11px] font-semibold text-[#6B7280] uppercase tracking-widest space-y-1">
              <div>Open Daily • 11:00 AM – 11:30 PM</div>
              <div className="text-[#C6A96B]">Live BBQ • Craft Cocktails • Lounge Music • Live Sports</div>
            </div>
          </ScrollReveal>

          {/* Right Overlapping Images Column */}
          <div className="lg:col-span-6 relative pt-6 lg:pt-0">
            {/* Primary Large Image */}
            <ScrollReveal type="image" className="relative aspect-[4/3] w-full rounded-[32px] overflow-hidden shadow-2xl border border-black/5">
              <Image 
                src={getLoopImg(1)} 
                alt="The Hikkups Bar Lounge Interior" 
                fill 
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </ScrollReveal>

            {/* Overlapping Secondary Image */}
            <ScrollReveal type="image" className="relative lg:absolute -mt-14 lg:mt-0 lg:-bottom-8 lg:-left-8 w-4/5 sm:w-2/3 aspect-[4/3] rounded-[28px] overflow-hidden shadow-2xl border-4 border-[#FAF8F5] z-20">
              <Image 
                src={getLoopImg(2)} 
                alt="Live Charcoal BBQ Grilling at The Hikkups" 
                fill 
                sizes="(max-width: 1024px) 70vw, 35vw"
                className="object-cover"
              />
            </ScrollReveal>
          </div>
        </section>


        {/* 3. BAR COUNTER & EVENING TRANSITION */}
        <section className="bg-[#0F172A] text-white rounded-[36px] p-8 sm:p-16 border border-white/10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#C6A96B] block">
              Craft Mixology
            </span>
            <h3 className="text-3xl sm:text-5xl font-heading text-white font-bold leading-tight drop-shadow-sm" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
              Evenings at the Bar
            </h3>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed font-light">
              Our master mixologists prepare smoked bourbon cocktails, tropical muddled mojitos, fine spirits, and artisanal mocktails directly over the illuminated bar counter.
            </p>
          </div>

          <div className="relative aspect-[16/10] lg:col-span-7 rounded-[28px] overflow-hidden border border-white/10 shadow-lg">
            <Image 
              src={getLoopImg(3)} 
              alt="Handcrafted Mixology Bar at The Hikkups" 
              fill 
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
            />
          </div>
        </section>


        {/* 4. SIGNATURE CREATIONS */}
        <section id="signature-stories" className="space-y-16 scroll-mt-28">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#C6A96B] block mb-3">
              Flames & Spirits
            </span>
            <h3 className="text-3xl sm:text-5xl font-heading text-[#0F172A] font-normal" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
              Signature Grills & Craft Drinks
            </h3>
          </div>

          <div className="space-y-24">
            {signatureStories.map((story, idx) => {
              const isEven = idx % 2 === 0
              return (
                <ScrollReveal key={story.title} type="text" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                  <div className={`relative aspect-[4/3] lg:col-span-7 rounded-[32px] overflow-hidden shadow-xl ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <Image 
                      src={story.image} 
                      alt={story.title} 
                      fill 
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover"
                    />
                  </div>

                  <div className={`lg:col-span-5 space-y-4 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C6A96B] block">
                      {story.subtitle}
                    </span>
                    <h4 className="text-3xl sm:text-4xl font-heading text-[#0F172A] font-normal" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                      {story.title}
                    </h4>
                    <div className="w-12 h-[1px] bg-[#C6A96B]" />
                    <p className="text-[#6B7280] text-base leading-relaxed font-light">
                      {story.story}
                    </p>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </section>


        {/* 5. GUEST EXPERIENCE HIGHLIGHTS */}
        <section className="bg-white rounded-[32px] p-8 sm:p-14 border border-black/5 shadow-lg space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C6A96B]">The Lounge Atmosphere</span>
            <h3 className="text-3xl font-heading text-[#0F172A]" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
              Everything Planned For Your Night Out
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {venueExperienceTags.map((tag) => (
              <div key={tag} className="bg-[#FAF8F5] border border-black/5 rounded-[18px] p-4 text-center">
                <CheckCircle2 size={18} className="text-[#C6A96B] mx-auto mb-2" />
                <span className="text-xs font-bold text-[#0F172A] leading-tight block">{tag}</span>
              </div>
            ))}
          </div>
        </section>


        {/* 6. VISUAL STORY GALLERY */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#C6A96B] block mb-2">
              Visual Journey
            </span>
            <h3 className="text-3xl font-heading text-[#0F172A] font-normal" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
              A Peek Into The Hikkups
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {galleryImages.map((imgUrl, idx) => (
              <ScrollReveal key={idx} type="image" className="relative aspect-[4/3] rounded-[24px] overflow-hidden shadow-md group">
                <Image 
                  src={imgUrl || defaultFallback} 
                  alt={`The Hikkups Visual Journey ${idx + 1}`} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 33vw" 
                  className="object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              </ScrollReveal>
            ))}
          </div>
        </section>


        {/* 7. RESERVATION (CTA Bar) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 sm:p-10 bg-[#0F172A] text-white rounded-[28px] shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#C6A96B]/20 flex items-center justify-center shrink-0">
              <Clock size={24} className="text-[#C6A96B]" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#C6A96B] font-bold block">Open Daily</span>
              <span className="text-lg font-semibold font-heading" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>11:00 AM – 11:30 PM</span>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-9 py-4 bg-[#C6A96B] hover:bg-[#B8913A] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-[14px] transition-all shadow-md flex items-center justify-center gap-2"
            suppressHydrationWarning
          >
            <span>Reserve Bar Table</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>

      {/* Table Reservation Modal */}
      <TableReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultVenue="hikkups"
      />

    </main>
  )
}
