import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SITE_IMAGES } from '@/config/siteImages'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { ArrowRight } from 'lucide-react'

export default function GalleryPage() {
  // Dynamically assemble all site images from centralized config
  const allImages = [
    { title: 'Ashok Inn Exterior', category: 'Exterior', url: SITE_IMAGES.homepage.heroBackground },
    { title: 'Welcome Lobby', category: 'Lobby', url: SITE_IMAGES.homepage.welcomeLobby },
    { title: 'Executive Meetings', category: 'Events', url: SITE_IMAGES.homepage.executiveMeetings },
    { title: 'Fine Dining Atmosphere', category: 'Dining', url: SITE_IMAGES.homepage.fineDining },
    
    // Dining Venues
    ...SITE_IMAGES.dining.dLounge.map((url, i) => ({ title: `D Lounge Restaurant ${i > 0 ? `#${i + 1}` : ''}`, category: 'Dining', url })),
    ...SITE_IMAGES.dining.hikkups.map((url, i) => ({ title: `The Hikkups BBQ & Bar ${i > 0 ? `#${i + 1}` : ''}`, category: 'Dining', url })),
    ...SITE_IMAGES.dining.mercelys.map((url, i) => ({ title: `Mercely's Kefi Parlour ${i > 0 ? `#${i + 1}` : ''}`, category: 'Dining', url })),
    ...SITE_IMAGES.dining.roomService.map((url, i) => ({ title: `24×7 In-Room Service ${i > 0 ? `#${i + 1}` : ''}`, category: 'Dining', url })),

    // Room Accommodations
    ...(SITE_IMAGES.rooms['deluxe-non-ac'] || []).map((url, i) => ({ title: `Deluxe Room ${i > 0 ? `#${i + 1}` : ''}`, category: 'Rooms', url })),
    ...(SITE_IMAGES.rooms['superior-ac'] || []).map((url, i) => ({ title: `Superior AC Room ${i > 0 ? `#${i + 1}` : ''}`, category: 'Rooms', url })),
    ...(SITE_IMAGES.rooms['family-ac'] || []).map((url, i) => ({ title: `Family AC Room ${i > 0 ? `#${i + 1}` : ''}`, category: 'Rooms', url })),
    ...(SITE_IMAGES.rooms['king-suite'] || []).map((url, i) => ({ title: `King Suite ${i > 0 ? `#${i + 1}` : ''}`, category: 'Suites', url })),
  ].filter(img => img.url && img.url.trim() !== '')

  return (
    <main className="bg-[#FAF8F5] min-h-screen pb-24 font-body selection:bg-[#C6A96B] selection:text-white">
      
      {/* Hero Banner */}
      <div className="relative w-full h-[500px] flex items-center justify-center bg-[#0F172A] overflow-hidden">
        <Image
          src={SITE_IMAGES.homepage.heroBackground}
          alt="Ashok Inn Gallery"
          fill
          className="object-cover opacity-50 scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/70 via-[#0F172A]/40 to-[#FAF8F5] z-10" />

        <div className="relative z-20 text-center px-4 max-w-3xl mx-auto pt-16">
          <span className="text-[10px] font-bold tracking-[0.35em] text-[#C6A96B] uppercase mb-3 block">
            Visual Journey
          </span>
          <h1 className="text-5xl sm:text-6xl font-heading text-white mb-4 font-normal" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
            Our Gallery
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
            Explore the timeless elegance, luxurious accommodations, and refined atmosphere of Ashok Inn.
          </p>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 -mt-12 relative z-30">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {allImages.map((img, idx) => (
            <ScrollReveal key={`${img.url}-${idx}`} type="image" delay={(idx % 6) * 0.06}>
              <div className="group relative aspect-[4/3] rounded-[28px] overflow-hidden bg-black/5 shadow-md border border-black/5 hover:shadow-2xl transition-all duration-300">
                <Image
                  src={img.url}
                  alt={img.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-[10px] font-bold text-[#C6A96B] uppercase tracking-[0.2em] mb-1">
                    {img.category}
                  </span>
                  <h3 className="text-xl font-heading text-white font-bold" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                    {img.title}
                  </h3>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA Footer Banner */}
        <div className="mt-24 rounded-[32px] bg-[#0F172A] p-10 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl border border-white/10">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-[10px] font-bold text-[#C6A96B] uppercase tracking-[0.3em] block">
              Experience It In Person
            </span>
            <h2 className="text-3xl sm:text-5xl font-heading font-normal leading-tight" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
              Ready for an Unforgettable Stay?
            </h2>
            <p className="text-white/70 text-xs sm:text-sm font-light max-w-lg mx-auto leading-relaxed">
              Book your luxurious room today and immerse yourself in world-class Davanagere hospitality.
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#C6A96B] hover:bg-[#B8913A] text-white font-bold text-xs uppercase tracking-widest rounded-[14px] transition-all shadow-lg hover:-translate-y-[1px]"
            >
              <span>Book Your Stay</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </div>
    </main>
  )
}
