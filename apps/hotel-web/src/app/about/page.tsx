'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle2, Heart, ShieldCheck, Sparkles, MapPin, Star, Award, Users } from 'lucide-react'
import { SITE_IMAGES } from '@/config/siteImages'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export default function AboutPage() {
  const heroImage = SITE_IMAGES.homepage.heroBackground || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2940&auto=format&fit=crop'
  const storyImage = SITE_IMAGES.homepage.welcomeLobby || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2940&auto=format&fit=crop'

  const philosophyPillars = [
    {
      icon: Heart,
      title: 'Quiet Warmth',
      desc: 'Hospitality is defined by quiet attentiveness. From warm greetings to personalized guest care, we ensure you feel genuinely welcomed.',
    },
    {
      icon: Sparkles,
      title: 'Culinary Artistry',
      desc: 'Every dish across D Lounge, The Hikkups, and Mercely’s is crafted with fresh regional ingredients, authentic recipes, and culinary passion.',
    },
    {
      icon: ShieldCheck,
      title: 'Refined Comfort',
      desc: 'High ceilings, acoustic wall insulation, lush courtyard walkways, and sunlit atriums designed to offer rare calm in the city.',
    },
    {
      icon: Award,
      title: 'Uncompromising Quality',
      desc: 'Impeccable hygiene standards, transparent pricing, and 24×7 dedicated service for corporate executives and traveling families alike.',
    },
  ]

  const trustValues = [
    { title: 'Prime Location', detail: 'Conveniently situated on PB Road with rapid access to railway stations and business hubs.' },
    { title: '24×7 In-Suite Care', detail: 'Round-the-clock room service and dedicated guest reception available 365 days a year.' },
    { title: 'Multi-Venue Dining', detail: 'Three distinct culinary destinations under one roof: D Lounge, Hikkups BBQ, & Mercely’s Kefi.' },
    { title: 'Executive Facilities', detail: 'Well-equipped meeting room with high-speed fiber internet and AV presentation screen.' },
  ]

  const verifiedReviews = [
    {
      quote: "Ashok Inn provides an atmosphere of rare calm and warmth. The suite was magnificent, and the personal care made our stay in Davangere unforgettable.",
      author: "Dr. Ramesh Kumar",
      role: "Executive Guest"
    },
    {
      quote: "The open atrium architecture is breathtaking. Dinner at D Lounge was exceptional, and the service was genuinely attentive.",
      author: "Priya & Vikram Sharma",
      role: "Family Stay"
    },
    {
      quote: "A true sanctuary in Davangere. Perfectly positioned, serene ambiance, and impeccable hospitality standards.",
      author: "Siddharth Mehta",
      role: "Corporate Traveler"
    }
  ]

  return (
    <main className="bg-[#FAF8F5] min-h-screen pb-32 font-body selection:bg-[#C6A96B] selection:text-white">

      {/* 1. HERO (Editorial Magazine Header — Pure Storytelling Focus) */}
      <div className="relative h-[80vh] min-h-[580px] w-full flex items-center justify-center bg-[#0F172A] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-65">
          <Image 
            src={heroImage} 
            alt="Ashok Inn Heritage Architecture Hero" 
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
            <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
              <ArrowLeft size={13} /> Home
            </Link>
            <span>/</span>
            <span className="text-[#C6A96B]">Our Story</span>
          </div>

          <span className="text-[11px] font-bold tracking-[0.4em] text-[#C6A96B] uppercase mb-4 block">
            A Legacy of Hospitality in Davangere
          </span>
          <h1 
            className="text-5xl sm:text-7xl lg:text-8xl font-normal text-white mb-6 tracking-tight font-heading leading-none"
            style={{ fontFamily: 'var(--font-cormorant, serif)' }}
          >
            Our Story
          </h1>
          <p className="text-white/90 text-base sm:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-8">
            An oasis of tranquility, refined comfort, and authentic regional warmth created for travelers who value genuine hospitality.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-32 pt-24">

        {/* 2. THE ASHOK INN STORY (EDITORIAL NARRATIVE) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <ScrollReveal type="text" className="lg:col-span-6 space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#C6A96B] block">
              Who We Are
            </span>
            
            <h2 
              className="text-4xl sm:text-5xl lg:text-6xl font-heading text-[#0F172A] leading-[1.15] font-normal" 
              style={{ fontFamily: 'var(--font-cormorant, serif)' }}
            >
              A Heritage Built on Quiet Care & Warmth
            </h2>

            <div className="w-16 h-[1px] bg-[#C6A96B] opacity-60" />

            <p className="text-base sm:text-lg italic font-heading text-[#0F172A] leading-relaxed" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
              &ldquo;At Ashok Inn, we believe true luxury is not defined by excess, but by quiet comfort, thoughtful details, and sincere human care.&rdquo;
            </p>

            <p className="text-[#6B7280] text-sm sm:text-base leading-relaxed font-light">
              Situated gracefully on PB Road in Davangere, Hotel Ashok Inn was established with a singular vision: to offer business travelers, families, and leisure guests a serene sanctuary that combines modern elegance with the rich heritage of Karnataka&apos;s warmth.
            </p>

            <p className="text-[#6B7280] text-sm sm:text-base leading-relaxed font-light">
              From our open courtyard atrium filled with natural light to our curated multi-venue dining options, every corner of Ashok Inn has been planned to provide quiet rest and memorable moments.
            </p>
          </ScrollReveal>

          <ScrollReveal type="image" className="lg:col-span-6 relative aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl border border-black/5">
            <Image 
              src={storyImage} 
              alt="Ashok Inn Welcome Lobby Atrium" 
              fill 
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </ScrollReveal>
        </section>

        {/* 3. OUR HOSPITALITY PHILOSOPHY (4 PILLARS) */}
        <section className="space-y-16">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#C6A96B] block mb-3">
              Core Principles
            </span>
            <h3 className="text-3xl sm:text-5xl font-heading text-[#0F172A] font-normal" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
              Our Hospitality Philosophy
            </h3>
            <p className="text-[#6B7280] text-sm font-light mt-2">
              Four fundamental values that guide every interaction and service at Ashok Inn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {philosophyPillars.map((pillar) => {
              const Icon = pillar.icon
              return (
                <div key={pillar.title} className="bg-white rounded-[24px] p-8 border border-black/5 shadow-sm space-y-4">
                  <div className="w-12 h-12 rounded-[16px] bg-[#FAF8F5] border border-black/5 flex items-center justify-center text-[#C6A96B]">
                    <Icon size={22} />
                  </div>
                  <h4 className="font-bold text-lg text-[#0F172A]" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>{pillar.title}</h4>
                  <p className="text-xs text-[#6B7280] leading-relaxed font-light">{pillar.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* 4. WHY GUESTS TRUST US (VALUES & AMENITIES GRID) */}
        <section className="bg-white rounded-[36px] p-8 sm:p-16 border border-black/5 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#C6A96B] block">
              Peace of Mind
            </span>
            <h3 className="text-3xl sm:text-5xl font-heading text-[#0F172A] font-normal leading-tight" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
              Why Guests Choose Ashok Inn
            </h3>
            <p className="text-[#6B7280] text-sm sm:text-base leading-relaxed font-light">
              Whether visiting for a corporate conference, a weekend getaway, or a family celebration, guests return to Ashok Inn for our consistent quality and reliable warmth.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {trustValues.map((val) => (
              <div key={val.title} className="bg-[#FAF8F5] border border-black/5 rounded-[20px] p-6 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
                  <CheckCircle2 size={16} className="text-[#C6A96B]" />
                  <span>{val.title}</span>
                </div>
                <p className="text-xs text-[#6B7280] leading-relaxed font-light pl-6">{val.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. GUEST REVIEWS (VERIFIED TESTIMONIALS) */}
        <section className="space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#C6A96B] block mb-2">
              Guest Experiences
            </span>
            <h3 className="text-3xl sm:text-4xl font-heading text-[#0F172A] font-normal" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
              Words From Our Visitors
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {verifiedReviews.map((rev) => (
              <div key={rev.author} className="bg-white rounded-[28px] p-8 border border-black/5 shadow-md flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-[#C6A96B]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-xs text-[#6B7280] italic leading-relaxed font-light">
                    &ldquo;{rev.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-black/5">
                  <span className="text-sm font-semibold text-[#0F172A] block">{rev.author}</span>
                  <span className="text-[11px] text-[#6B7280] block font-light">{rev.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. FINAL INVITATION (LOW PRESSURE INVITATION BAR) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 sm:p-12 bg-[#0F172A] text-white rounded-[32px] shadow-2xl">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C6A96B] block">Warm Invitation</span>
            <h4 className="text-2xl sm:text-3xl font-heading font-normal" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
              We Look Forward to Welcoming You
            </h4>
            <p className="text-xs text-white/70 font-light max-w-lg">
              Experience authentic hospitality, comfortable suites, and regional gastronomy at Hotel Ashok Inn, Davangere.
            </p>
          </div>

          <Link
            href="/rooms"
            className="w-full sm:w-auto px-9 py-4 bg-[#C6A96B] hover:bg-[#B8913A] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-[14px] transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
          >
            <span>Explore Rooms & Suites</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>

    </main>
  )
}
