import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, ArrowRight, ArrowLeft, Phone, Zap, ConciergeBell } from 'lucide-react'
import { SITE_IMAGES } from '@/config/siteImages'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export default function RoomServicePage() {
  const defaultFallback = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2940&auto=format&fit=crop'
  const venueImages = SITE_IMAGES.dining.roomService || []
  const heroImage = venueImages[0] || defaultFallback

  const signatureStories = [
    {
      title: 'The Ashok Inn Midnight Club Sandwich',
      subtitle: 'IN-SUITE FAVORITE',
      story: 'Triple-decker toasted sourdough stacked with grilled chicken breast, sharp cheddar, fried egg, crisp lettuce, and served with hot golden french fries.',
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=2940&auto=format&fit=crop',
    },
    {
      title: 'Royal South Indian Sunrise Spread',
      subtitle: 'IN-ROOM BREAKFAST HERITAGE',
      story: 'Piping hot steamed idlis, crispy vada, benne dosa, aromatic sambar, trio of coconut chutneys & artisanal South Indian filter coffee served right to your bed.',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=2940&auto=format&fit=crop',
    },
    {
      title: 'Slow-Simmered Tomato Basil Soup',
      subtitle: 'SOUL-SOOTHING COMFORT',
      story: 'Velvety roasted Roma tomato soup infused with fresh garden basil, served alongside toasted garlic herb crostinis for late night comfort.',
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2940&auto=format&fit=crop',
    },
  ]

  const howItWorks = [
    {
      icon: Clock,
      title: 'Available Anytime',
      description: 'Round-the-clock service 24 hours a day, 365 days a year for early risers and late arrivals.'
    },
    {
      icon: Zap,
      title: 'Thermal Delivery',
      description: 'Meals delivered in insulated thermal covers within 25–35 minutes to guarantee hot temperature.'
    },
    {
      icon: ConciergeBell,
      title: 'Room Folio Billing',
      description: 'No immediate payment required—all orders are seamlessly charged directly to your suite folio.'
    }
  ]

  return (
    <main className="bg-[#FAF8F5] min-h-screen pb-24 font-body selection:bg-[#C6A96B] selection:text-white">

      {/* 1. HERO (Concise Hero Banner) */}
      <div className="relative h-[65vh] min-h-[480px] w-full flex items-center justify-center bg-[#0F172A] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-60">
          <Image 
            src={heroImage} 
            alt="24x7 In-Room Dining Destination Hero" 
            fill 
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/70 via-[#0F172A]/40 to-[#FAF8F5] z-10" />

        <div className="relative z-20 text-center px-4 max-w-3xl mx-auto pt-24">
          
          {/* Integrated Clean Breadcrumb */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white/80 font-semibold mb-6">
            <Link href="/restaurant" className="hover:text-white flex items-center gap-1 transition-colors">
              <ArrowLeft size={13} /> Dining
            </Link>
            <span>/</span>
            <span className="text-[#C6A96B]">Room Service</span>
          </div>

          <span className="text-[11px] font-bold tracking-[0.4em] text-[#C6A96B] uppercase mb-3 block">
            Comfort, Delivered
          </span>
          <h1 
            className="text-5xl sm:text-7xl font-normal text-white mb-4 tracking-tight font-heading leading-none"
            style={{ fontFamily: 'var(--font-cormorant, serif)' }}
          >
            24×7 Room Service
          </h1>
          <p className="text-white/90 text-base sm:text-lg max-w-xl mx-auto font-light leading-relaxed mb-8">
            Whether starting your morning with breakfast in bed or savoring a late-night meal, our team delivers fresh gourmet dishes directly to your room.
          </p>
          <Link 
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#C6A96B] hover:bg-[#B8913A] text-white px-8 py-3.5 rounded-[14px] text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-lg hover:-translate-y-[1px]"
          >
            <span>Call Room Service</span>
            <Phone size={14} />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-24 pt-16">

        {/* 2. HOW IT WORKS (Concise 3-Card Grid) */}
        <section className="space-y-10">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#C6A96B] block mb-2">
              In-Suite Care
            </span>
            <h2 className="text-3xl font-heading text-[#0F172A] font-normal" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
              How In-Room Dining Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howItWorks.map((step) => {
              const Icon = step.icon
              return (
                <div key={step.title} className="bg-white rounded-[24px] p-8 border border-black/5 shadow-md space-y-3">
                  <div className="w-12 h-12 rounded-[16px] bg-[#FAF8F5] border border-black/5 flex items-center justify-center text-[#C6A96B]">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-bold text-base text-[#0F172A]">{step.title}</h3>
                  <p className="text-xs text-[#6B7280] leading-relaxed font-light">{step.description}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* 3. POPULAR IN-ROOM DINING (3 Concise Items) */}
        <section id="signature-stories" className="space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#C6A96B] block mb-2">
              Curated Selections
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading text-[#0F172A] font-normal" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
              Popular In-Room Favorites
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {signatureStories.map((story) => (
              <ScrollReveal key={story.title} type="text" className="bg-white rounded-[28px] overflow-hidden border border-black/5 shadow-md group">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image 
                    src={story.image} 
                    alt={story.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#C6A96B] block">{story.subtitle}</span>
                  <h3 className="text-xl font-heading text-[#0F172A] font-normal" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>{story.title}</h3>
                  <p className="text-xs text-[#6B7280] leading-relaxed font-light">{story.story}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* 4. CALL ROOM SERVICE CTA BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 bg-[#0F172A] text-white rounded-[24px] shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#C6A96B]/20 flex items-center justify-center shrink-0">
              <Clock size={22} className="text-[#C6A96B]" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#C6A96B] font-bold block">Delivery Time</span>
              <span className="text-base font-semibold">25–35 Minutes • Billed to Room Folio</span>
            </div>
          </div>

          <Link
            href="/contact"
            className="w-full sm:w-auto px-8 py-4 bg-[#C6A96B] hover:bg-[#B8913A] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-[14px] transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Call Room Service</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>

    </main>
  )
}
