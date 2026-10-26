'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, ArrowRight, ArrowLeft, CheckCircle2, ChefHat } from 'lucide-react'
import { SITE_IMAGES } from '@/config/siteImages'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { TableReservationModal } from '@/components/restaurant/TableReservationModal'

export default function DLoungePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const defaultFallback = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2940&auto=format&fit=crop'
  const venueImages = SITE_IMAGES.dining.dLounge || []
  const getLoopImg = (index: number) => {
    if (!venueImages || venueImages.length === 0) return defaultFallback
    return venueImages[index % venueImages.length] || defaultFallback
  }
  const heroImage = getLoopImg(0)
  const galleryImages = venueImages.length > 1 ? venueImages.slice(1) : venueImages

  const signatureStories = [
    {
      title: 'Davangere Benne Dosa',
      subtitle: 'REGIONAL CULINARY HERITAGE',
      story: 'Our tribute to Davangere’s legendary culinary heritage. Prepared fresh every morning with pure artisanal benne (butter), slow-roasted to golden crispness, and served alongside homemade coconut chutneys and spiced potato palya.',
      image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=2940&auto=format&fit=crop',
    },
    {
      title: 'Royal Chicken Dum Biryani',
      subtitle: 'CHEF’S CULINARY SIGNATURE',
      story: 'Slow-cooked for over four hours using long-grain Basmati rice, tender chicken, saffron infusion, and house-ground spices sealed in a clay handi. A celebration of royal Mughlai tradition.',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=2940&auto=format&fit=crop',
    },
    {
      title: 'Paneer Tikka Butter Masala',
      subtitle: 'NORTH INDIAN CLASSIC',
      story: 'Charcoal-grilled cottage cheese cubes simmered in a velvety cashew tomato gravy, served alongside piping hot garlic butter naan.',
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=2940&auto=format&fit=crop',
    },
  ]

  const venueExperienceTags = [
    'Indoor Air Conditioned Seating',
    'Family Friendly Dining Space',
    'Executive Business Breakfast & Lunch',
    'Valet & Ample Free Parking',
    'Fresh Artisanal Cooking',
    'Veg & Non-Veg Multi-Cuisine',
    'Live Charcoal BBQ Options',
    'Attentive Personal Service',
  ]

  return (
    <main className="bg-[#FAF8F5] min-h-screen pb-32 font-body selection:bg-[#C6A96B] selection:text-white">

      {/* 1. HERO (Full Screen Destination Reveal) */}
      <div className="relative h-[75vh] sm:h-[88vh] min-h-[520px] sm:min-h-[650px] w-full flex items-center justify-center bg-[#0F172A] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-65">
          <Image 
            src={heroImage} 
            alt="D Lounge Restaurant Destination Hero" 
            fill 
            sizes="100vw"
            className="object-cover scale-105 transition-transform duration-1000"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/70 via-[#0F172A]/40 to-[#FAF8F5] z-10" />

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-16 sm:pt-24">
          
          {/* Integrated Clean Breadcrumb */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white/80 font-semibold mb-4 sm:mb-6">
            <Link href="/restaurant" className="hover:text-white flex items-center gap-1 transition-colors">
              <ArrowLeft size={13} /> Dining
            </Link>
            <span>/</span>
            <span className="text-[#C6A96B]">D Lounge</span>
          </div>

          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.3em] sm:tracking-[0.4em] text-[#C6A96B] uppercase mb-3 sm:mb-4 block">
            A Contemporary Dining Experience at Ashok Inn
          </span>
          <h1 
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal text-white mb-4 sm:mb-6 tracking-tight font-heading leading-none"
            style={{ fontFamily: 'var(--font-cormorant, serif)' }}
          >
            D Lounge
          </h1>
          <p className="text-white/90 text-sm sm:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-8 sm:mb-10">
            A contemporary multi-cuisine dining destination blending natural wooden textures, soft lighting, and regional culinary artistry.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#C6A96B] hover:bg-[#B8913A] text-white px-8 sm:px-9 py-3.5 sm:py-4 rounded-[14px] text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-xl hover:-translate-y-[1px]"
            suppressHydrationWarning
          >
            Reserve Your Table
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-16 sm:space-y-32 pt-12 sm:pt-24">

        {/* 2. OVERLAPPING EDITORIAL SECTION (MAGAZINE STYLE 9.7/10 REFINED) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left Text Column */}
          <ScrollReveal type="text" className="lg:col-span-6 space-y-5 sm:space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#C6A96B] block">
              The Experience
            </span>
            
            <h2 
              className="text-3xl sm:text-5xl lg:text-6xl font-heading text-[#0F172A] leading-[1.15] font-normal" 
              style={{ fontFamily: 'var(--font-cormorant, serif)' }}
            >
              Where Taste Meets Warm Hospitality
            </h2>

            <div className="w-16 h-[1px] bg-[#C6A96B] opacity-60" />

            <p className="text-base sm:text-lg italic font-heading text-[#0F172A] leading-relaxed" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
              &ldquo;At D Lounge, every meal begins with thoughtful ingredients, attentive service, and the warmth of Karnataka&apos;s hospitality.&rdquo;
            </p>

            <p className="text-[#6B7280] text-sm sm:text-base leading-relaxed font-light max-w-xl">
              Walk into a warm and inviting dining space where handcrafted interiors, regional flavours, and attentive service come together. Whether you&apos;re enjoying a family dinner, a business lunch, or a quiet breakfast, D Lounge offers a relaxed setting for every occasion.
            </p>

            <div className="flex items-center gap-4 pt-2 flex-wrap">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#0F172A] hover:bg-[#C6A96B] text-white px-7 py-3.5 rounded-[14px] text-xs font-bold uppercase tracking-[0.18em] transition-all shadow-md"
                suppressHydrationWarning
              >
                Reserve a Table
              </button>
              <a 
                href="#signature-stories"
                className="text-xs font-bold uppercase tracking-[0.18em] text-[#0F172A] hover:text-[#C6A96B] transition-colors flex items-center gap-1.5 py-3.5"
              >
                <span>Our Culinary Story</span>
                <ArrowRight size={14} />
              </a>
            </div>

            {/* Elegant Sub-Text Detail */}
            <div className="pt-4 border-t border-black/5 text-[11px] font-semibold text-[#6B7280] uppercase tracking-widest space-y-1">
              <div>Open Daily • Breakfast • Lunch • Dinner</div>
              <div className="text-[#C6A96B]">Family Dining • Business Lunch • Private Gatherings</div>
            </div>
          </ScrollReveal>

          {/* Right Overlapping Images Column (Restrained Overlap) */}
          <div className="lg:col-span-6 relative pt-4 lg:pt-0">
            {/* Primary Large Image */}
            <ScrollReveal type="image" className="relative aspect-[4/3] w-full rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl border border-black/5">
              <Image 
                src={getLoopImg(1)} 
                alt="D Lounge Dining Hall Interior" 
                fill 
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </ScrollReveal>

            {/* Secondary Image (Clean stack on mobile, overlapping on desktop) */}
            <ScrollReveal type="image" className="relative lg:absolute mt-4 lg:mt-0 lg:-bottom-8 lg:-left-8 w-full sm:w-2/3 aspect-[4/3] rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-xl lg:shadow-2xl border-2 sm:border-4 border-[#FAF8F5] z-20">
              <Image 
                src={getLoopImg(2)} 
                alt="Illuminated Evening Bar at D Lounge" 
                fill 
                sizes="(max-width: 1024px) 100vw, 35vw"
                className="object-cover"
              />
            </ScrollReveal>
          </div>
        </section>


        {/* 3. THE ARCHITECTURE (Designed to Welcome) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-4 sm:pt-8">
          <ScrollReveal type="image" className="relative aspect-[4/3] lg:col-span-6 rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-xl">
            <Image 
              src={getLoopImg(3)} 
              alt="D Lounge Architecture Entrance" 
              fill 
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </ScrollReveal>

          <ScrollReveal type="text" className="lg:col-span-6 space-y-5 sm:space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#C6A96B] block">
              Architectural Thought
            </span>
            <h3 className="text-3xl sm:text-4xl font-heading text-[#0F172A] font-normal" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
              Designed to Welcome
            </h3>
            <div className="w-12 h-[1px] bg-[#C6A96B]" />
            <p className="text-[#6B7280] text-sm sm:text-base leading-relaxed font-light">
              From the open courtyard walkway to the grand welcoming entrance, D Lounge is architecturally planned to ease guests from the busy city into a calm, elevated dining atmosphere.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs font-semibold text-[#0F172A]">
                <CheckCircle2 size={16} className="text-[#C6A96B]" />
                <span>Lush Courtyard Walkway & Calming Atmosphere</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-[#0F172A]">
                <CheckCircle2 size={16} className="text-[#C6A96B]" />
                <span>High Ceilings & Woven Pendant Lighting</span>
              </div>
            </div>
          </ScrollReveal>
        </section>


        {/* 4. CHEF'S PHILOSOPHY SECTION */}
        <ScrollReveal type="text" className="bg-[#0F172A] text-white rounded-[28px] sm:rounded-[36px] p-6 sm:p-16 border border-white/10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          <div className="lg:col-span-4 flex flex-col items-center text-center lg:text-left lg:items-start space-y-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#C6A96B]/20 flex items-center justify-center text-[#C6A96B]">
              <ChefHat size={28} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C6A96B] block mb-1">Chef’s Philosophy</span>
              <h4 className="text-xl sm:text-2xl font-heading text-white font-bold" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                Crafted with Passion & Local Heritage
              </h4>
            </div>
          </div>

          <div className="lg:col-span-8 border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-8">
            <p className="text-white/90 text-sm sm:text-lg leading-relaxed font-light italic" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
              &ldquo;At D Lounge, every dish is prepared using fresh local ingredients, regional recipes, and modern culinary techniques that celebrate the rich flavours of Davangere and Karnataka.&rdquo;
            </p>
            <span className="text-xs font-bold text-[#C6A96B] uppercase tracking-widest block mt-3 sm:mt-4">— Executive Chef Rajan</span>
          </div>
        </ScrollReveal>


        {/* 5. CHEF'S SIGNATURE STORIES */}
        <section id="signature-stories" className="space-y-16 scroll-mt-28">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#C6A96B] block mb-3">
              Culinary Artistry
            </span>
            <h3 className="text-3xl sm:text-5xl font-heading text-[#0F172A] font-normal" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
              Signature Creations
            </h3>
            <p className="text-[#6B7280] text-sm font-light mt-2">
              Three iconic culinary offerings that define the flavour identity of D Lounge.
            </p>
          </div>

          <div className="space-y-12 sm:space-y-24">
            {signatureStories.map((story, idx) => {
              const isEven = idx % 2 === 0
              return (
                <ScrollReveal key={story.title} type="text" className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 items-center">
                  <div className={`relative aspect-[4/3] lg:col-span-7 rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-xl ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <Image 
                      src={story.image} 
                      alt={story.title} 
                      fill 
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover"
                    />
                  </div>

                  <div className={`lg:col-span-5 space-y-3 sm:space-y-4 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C6A96B] block">
                      {story.subtitle}
                    </span>
                    <h4 className="text-2xl sm:text-4xl font-heading text-[#0F172A] font-normal" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                      {story.title}
                    </h4>
                    <div className="w-12 h-[1px] bg-[#C6A96B]" />
                    <p className="text-[#6B7280] text-sm sm:text-base leading-relaxed font-light">
                      {story.story}
                    </p>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </section>


        {/* 6. GUEST EXPERIENCE HIGHLIGHTS */}
        <section className="bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-14 border border-black/5 shadow-lg space-y-8 sm:space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C6A96B]">The Complete Comfort</span>
            <h3 className="text-2xl sm:text-3xl font-heading text-[#0F172A]" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
              Everything Planned For Your Ease
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {venueExperienceTags.map((tag) => (
              <div key={tag} className="bg-[#FAF8F5] border border-black/5 rounded-[16px] sm:rounded-[18px] p-3.5 sm:p-4 text-center flex flex-col items-center justify-center">
                <CheckCircle2 size={16} className="text-[#C6A96B] mx-auto mb-2 shrink-0" />
                <span className="text-[11px] sm:text-xs font-bold text-[#0F172A] leading-tight block">{tag}</span>
              </div>
            ))}
          </div>
        </section>


        {/* 7. VISUAL STORY GALLERY */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#C6A96B] block mb-2">
              Visual Journey
            </span>
            <h3 className="text-3xl font-heading text-[#0F172A] font-normal" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
              A Peek Into D Lounge
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {galleryImages.map((imgUrl, idx) => (
              <ScrollReveal key={idx} type="image" className="relative aspect-[4/3] rounded-[24px] overflow-hidden shadow-md group">
                <Image 
                  src={imgUrl || defaultFallback} 
                  alt={`D Lounge Visual Journey ${idx + 1}`} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 33vw" 
                  className="object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              </ScrollReveal>
            ))}
          </div>
        </section>


        {/* 8. RESERVATION (CTA Bar) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 sm:p-10 bg-[#0F172A] text-white rounded-[28px] shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#C6A96B]/20 flex items-center justify-center shrink-0">
              <Clock size={24} className="text-[#C6A96B]" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#C6A96B] font-bold block">Open Daily</span>
              <span className="text-lg font-semibold font-heading" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>7:00 AM – 11:30 PM</span>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-9 py-4 bg-[#C6A96B] hover:bg-[#B8913A] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-[14px] transition-all shadow-md flex items-center justify-center gap-2"
            suppressHydrationWarning
          >
            <span>Reserve Your Table</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>

      {/* Table Reservation Modal */}
      <TableReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultVenue="dLounge"
      />

    </main>
  )
}
