'use client'

import React, { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { BookingWidget } from '@/components/booking/BookingWidget'
import { LoadingScreen } from '@/components/Loader/LoadingScreen'
import { 
  ArrowRight, Users, 
  MapPin, Quote, Phone, Navigation, ArrowDown, X
} from 'lucide-react'
import { SITE_IMAGES, getCategoryImages } from '@/config/siteImages'
import { TableReservationModal } from '@/components/restaurant/TableReservationModal'

gsap.registerPlugin(useGSAP)

export interface RoomCategoryData {
  id: string
  name: string
  description: string
  basePrice: number
  capacity: number
  sizeSqm?: number | null
  hasAC: boolean
  images: { id: string; url: string }[]
}

// ─── Motion System v1.0 Timing Standard ──────────────────────────────────────
// Text Reveal: 0.9s | Image Reveal: 1.2s | Testimonial: 0.8s | Ease: [0.25, 0.46, 0.45, 0.94]

const textReveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-10%" },
  transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }
}

const imageReveal = {
  initial: { opacity: 0, y: 20, scale: 1.015 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-10%" },
  transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }
}

export function HomePageClient({ categories }: { categories: RoomCategoryData[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)
  const [activeGalleryTab, setActiveGalleryTab] = useState<'all' | 'rooms' | 'architecture' | 'dining' | 'courtyard'>('all')
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0)
  const [isTableModalOpen, setIsTableModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{ src: string; title: string; category?: string } | null>(null)

  // Listen for loader completion
  useEffect(() => {
    if (document.body.classList.contains('loading-complete') || sessionStorage.getItem('ashok-loader') === 'true') {
      setIsReady(true)
    } else {
      const handleReady = () => setIsReady(true)
      window.addEventListener('loadingComplete', handleReady)
      return () => window.removeEventListener('loadingComplete', handleReady)
    }
  }, [])

  // Pure opacity cross-fade for testimonials (0.8s duration)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  // GSAP 10.0s Ultra-Slow Hero Camera Breathing
  useGSAP(() => {
    if (!isReady) return

    const tl = gsap.timeline()
    
    gsap.set('.hero-bg-image', { scale: 1.04, opacity: 0 })
    gsap.set('.hero-overlay', { opacity: 0 })
    gsap.set('.hero-content-element', { opacity: 0, y: 20 })

    tl.to('.hero-bg-image', {
      opacity: 1,
      duration: 1.8,
      ease: 'power2.out'
    })
    .to('.hero-overlay', {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.out'
    }, '-=1.5')
    .to('.hero-content-element', {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.18,
      ease: 'power3.out'
    }, '-=0.9')

    // Continuous 10.0s Camera Breathing
    gsap.to('.hero-bg-image', {
      scale: 1,
      duration: 10,
      ease: 'none',
      repeat: -1,
      yoyo: true
    })

  }, { dependencies: [isReady], scope: containerRef })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const heroY = useTransform(smoothProgress, [0, 0.25], ['0%', '20%'])
  const heroOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0])

  // Single Signature Room Spotlight (King Suite)
  const signatureRoom = categories.find(c => c.name.toLowerCase().includes('suite') || c.name.toLowerCase().includes('king')) || categories[0]
  const signatureImages = signatureRoom ? getCategoryImages(signatureRoom) : [SITE_IMAGES.homepage.heroBackground]

  // Testimonials Data
  const testimonials = [
    {
      quote: "Ashok Inn provides an atmosphere of rare calm and warmth. The suite was magnificent, and the personal care made our stay in Davangere unforgettable.",
      author: "Dr. Ramesh Kumar",
      role: "Verified Executive Traveler"
    },
    {
      quote: "The open atrium architecture is breathtaking. Dinner at D Lounge was exceptional, and the service was genuinely attentive.",
      author: "Priya & Vikram Sharma",
      role: "Family Guest Stay"
    },
    {
      quote: "A true sanctuary in the heart of Davangere. Perfectly positioned, serene ambiance, and impeccable hospitality standards.",
      author: "Siddharth Mehta",
      role: "Corporate Traveler"
    }
  ]

  // Gallery Items (Configured in siteImages.ts)
  const galleryItems = SITE_IMAGES.homepage.immersiveGallery

  const filteredGallery = activeGalleryTab === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeGalleryTab)

  return (
    <main ref={containerRef} className="relative bg-[#FAF8F5] min-h-screen font-body selection:bg-[#C6A96B] selection:text-white">
      <LoadingScreen />

      {/* =================================================================== */}
      {/* 🎭 ACT I — FALL IN LOVE (0–30% Scroll)                              */}
      {/* =================================================================== */}

      {/* CHAPTER 1 — HERO: THE FIRST IMPRESSION (100VH) */}
      <section className="relative h-screen flex flex-col justify-between overflow-hidden bg-[#0F172A]">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 w-full h-[115%] -top-[7.5%]"
        >
          <div 
            className="absolute inset-0 z-10 hero-overlay" 
            style={{ 
              background: 'linear-gradient(180deg, rgba(15,23,42,0.45) 0%, rgba(15,23,42,0.3) 50%, rgba(15,23,42,0.75) 100%)' 
            }} 
          />
          <Image
            src={SITE_IMAGES.homepage.heroBackground}
            alt="Ashok Inn Exterior"
            fill
            sizes="100vw"
            className="object-cover hero-bg-image"
            priority
            style={{ filter: 'brightness(1.05) contrast(1.08)' }}
          />
        </motion.div>

        {/* Top Space for Fixed Transparent Navbar */}
        <div className="relative z-20 pt-32" />

        {/* Hero Central Headline */}
        <div className="relative z-20 w-full max-w-5xl mx-auto px-6 text-center">
          <div className="mb-6 hero-content-element">
            <span className="text-[11px] font-bold tracking-[0.35em] text-[#C6A96B] uppercase inline-block border-b border-[#C6A96B]/30 pb-2">
              Ashok Inn • Davangere
            </span>
          </div>

          <h1 
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-white mb-8 tracking-tight font-heading leading-[1.08] hero-content-element"
            style={{ fontFamily: 'var(--font-playfair, serif)' }}
          >
            Where Elegance Meets <br className="hidden sm:block" />
            <span className="italic font-light text-[#C6A96B]">Warm Hospitality</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-white/85 max-w-2xl mx-auto font-light leading-relaxed hero-content-element">
            An oasis of tranquility and refined luxury in the heart of Davangere.
          </p>
        </div>

        {/* Hero Scroll Indicator */}
        <div className="relative z-20 pb-12 flex flex-col items-center justify-center hero-content-element">
          <span className="text-[10px] tracking-[0.3em] text-white/50 uppercase mb-3 font-medium">
            Scroll To Discover
          </span>
          <motion.div 
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/60"
          >
            <ArrowDown size={14} />
          </motion.div>
        </div>
      </section>


      {/* CHAPTER 2 — OUR STORY */}
      <section className="py-28 md:py-36 px-6 max-w-5xl mx-auto text-center">
        <motion.div variants={textReveal} initial="initial" whileInView="whileInView">
          <span className="text-xs font-bold tracking-[0.3em] text-[#C6A96B] uppercase block mb-6">
            Our Story
          </span>
          <h2 
            className="text-3xl sm:text-5xl md:text-6xl font-heading text-[#0F172A] font-normal leading-[1.18] mb-10 tracking-tight"
            style={{ fontFamily: 'var(--font-playfair, serif)' }}
          >
            A Place Designed for Comfort
          </h2>
          <p className="text-[#6B7280] text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed font-light mb-16">
            Nestled in the heart of Davangere, Ashok Inn is designed for travelers who appreciate thoughtful hospitality, refined comfort, and memorable experiences.
          </p>
          <div className="w-16 h-[1px] bg-[#C6A96B] mx-auto mb-16" />
        </motion.div>

        {/* Reception & Logo Photo Soft Reveal */}
        <motion.div 
          variants={imageReveal}
          initial="initial"
          whileInView="whileInView"
          className="relative aspect-[16/9] md:aspect-[21/9] rounded-[32px] overflow-hidden shadow-2xl border border-black/5"
        >
          <Image
            src={SITE_IMAGES.homepage.welcomeLobby}
            alt="Ashok Inn Reception"
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
        </motion.div>
      </section>


      {/* CHAPTER 3 — SPACES THAT DEFINE YOUR STAY (LUXURY PROPERTY SHOWCASE) */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <motion.span variants={textReveal} initial="initial" whileInView="whileInView" className="text-xs font-bold tracking-[0.3em] text-[#C6A96B] uppercase block mb-4">
              Spaces That Define Your Stay
            </motion.span>
            <motion.h2 variants={textReveal} initial="initial" whileInView="whileInView" className="text-4xl sm:text-5xl font-heading text-[#0F172A] font-normal leading-[1.15]" style={{ fontFamily: 'var(--font-playfair, serif)' }}>
              Designed for Comfort. <br className="hidden sm:block" />
              Crafted for Every Stay.
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                category: 'Arrival',
                title: 'Elegant Arrival', 
                desc: 'A welcoming entrance that reflects modern design and warm hospitality.', 
                img: SITE_IMAGES.homepage.showcaseCards.arrival 
              },
              { 
                category: 'Warm Welcome',
                title: 'Refined Reception', 
                desc: 'A serene lobby where every guest is greeted with personalized care.', 
                img: SITE_IMAGES.homepage.showcaseCards.reception 
              },
              { 
                category: 'Suites',
                title: 'Spacious Comfort', 
                desc: 'Thoughtfully designed rooms featuring contemporary interiors and premium comfort.', 
                img: SITE_IMAGES.homepage.showcaseCards.suites 
              },
              { 
                category: 'Dining & Relaxation',
                title: 'Dining & Relaxation', 
                desc: 'Atmospheric dining and lounge spaces crafted for memorable moments.', 
                img: SITE_IMAGES.homepage.showcaseCards.dining 
              },
            ].map((card, idx) => (
              <motion.div
                key={card.title}
                variants={imageReveal}
                initial="initial"
                whileInView="whileInView"
                transition={{ delay: idx * 0.1 }}
                className="group relative rounded-[28px] overflow-hidden bg-[#FAF8F5] border border-black/5 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#0F172A]">
                  <Image
                    src={card.img}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3.5 py-1 bg-black/65 backdrop-blur-md text-[#C6A96B] text-[9px] font-bold uppercase tracking-[0.2em] rounded-full border border-[#C6A96B]/30">
                      {card.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-heading font-bold text-[#0F172A] mb-1.5 transition-colors group-hover:text-[#C6A96B]" style={{ fontFamily: 'var(--font-playfair, serif)' }}>
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#6B7280] leading-relaxed font-light">
                      {card.desc}
                    </p>
                    <div className="h-[2px] w-0 group-hover:w-10 bg-[#C6A96B] transition-all duration-300 mt-3 rounded-full" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* CHAPTER 4 — WHY CHOOSE ASHOK INN (EDITORIAL TRUST METRICS) */}
      <section className="py-24 md:py-32 bg-[#FAF8F5]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.span variants={textReveal} initial="initial" whileInView="whileInView" className="text-xs font-bold tracking-[0.3em] text-[#C6A96B] uppercase block mb-3">
              Hospitality Standards
            </motion.span>
            <motion.h2 variants={textReveal} initial="initial" whileInView="whileInView" className="text-3xl sm:text-4xl font-heading text-[#0F172A] font-normal" style={{ fontFamily: 'var(--font-playfair, serif)' }}>
              Why Choose Ashok Inn
            </motion.h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-black/8">
            {[
              { stat: '25+', label: 'Years of Hospitality' },
              { stat: 'Prime', label: 'Davangere Location' },
              { stat: '24×7', label: 'In-Room Dining Care' },
              { stat: 'Fine', label: 'Dining & Spirits' },
              { stat: '100%', label: 'Guest Satisfaction' },
            ].map((item, idx) => (
              <motion.div
                key={item.label}
                variants={textReveal}
                initial="initial"
                whileInView="whileInView"
                transition={{ delay: idx * 0.08 }}
                className="pt-6 md:pt-0 px-4"
              >
                <span className="text-3xl sm:text-4xl font-heading font-bold text-[#0F172A] block mb-2" style={{ fontFamily: 'var(--font-playfair, serif)' }}>
                  {item.stat}
                </span>
                <span className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold block leading-tight">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* =================================================================== */}
      {/* 🛡️ ACT II — BUILD TRUST (30–70% Scroll)                              */}
      {/* =================================================================== */}

      {/* CHAPTER 5 — SIGNATURE ACCOMMODATION (ONE SPOTLIGHT ROOM) */}
      <section className="py-28 md:py-36 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-bold tracking-[0.3em] text-[#C6A96B] uppercase block mb-4">
              Signature Accommodation
            </span>
            <h2 className="text-4xl sm:text-6xl font-heading text-[#0F172A] font-normal" style={{ fontFamily: 'var(--font-playfair, serif)' }}>
              The King Suite
            </h2>
          </div>

          {signatureRoom && (
            <motion.div variants={imageReveal} initial="initial" whileInView="whileInView" className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-7 relative">
                <div className="relative aspect-[16/10] rounded-[32px] overflow-hidden shadow-2xl">
                  <Image
                    src={signatureImages[0]}
                    alt={signatureRoom.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C6A96B] block">
                  Luxury Collection
                </span>

                <h3 className="text-3xl sm:text-4xl font-heading text-[#0F172A] font-normal" style={{ fontFamily: 'var(--font-playfair, serif)' }}>
                  {signatureRoom.name}
                </h3>

                <p className="text-[#6B7280] text-base leading-relaxed font-light">
                  {signatureRoom.description || 'Ultimate luxury with premium services, expansive living area, and personalized hospitality care.'}
                </p>

                <div className="py-4 border-y border-black/8 flex items-center gap-6 text-xs text-[#6B7280] font-medium">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-[#C6A96B]" />
                    <span>Up to {signatureRoom.capacity} Guests</span>
                  </div>
                  {signatureRoom.sizeSqm && (
                    <div className="flex items-center gap-2">
                      <span>• {signatureRoom.sizeSqm} sq.m</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold block">From</span>
                    <span className="text-2xl font-heading font-bold text-[#0F172A]">₹{signatureRoom.basePrice.toLocaleString()}</span>
                    <span className="text-xs text-[#6B7280]"> / night</span>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Primary CTA (1px tactile lift) */}
                    <Link
                      href={`/rooms/${signatureRoom.id}`}
                      className="px-6 py-3 bg-[#0F172A] hover:bg-[#C6A96B] text-white text-xs font-bold uppercase tracking-widest rounded-[12px] transition-all duration-250 hover:-translate-y-[1px] hover:shadow-md"
                    >
                      Reserve Suite
                    </Link>

                    {/* Secondary CTA (Gold Underline Expansion) */}
                    <Link
                      href="/rooms"
                      className="group relative inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#C6A96B] transition-colors py-1"
                    >
                      <span>Explore the Collection</span>
                      <ArrowRight size={14} />
                      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C6A96B] transition-all duration-250 group-hover:w-full" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>


      {/* CHAPTER 6 — CULINARY EXPERIENCES (MERGED D LOUNGE & HIKKUPS) */}
      <section className="py-28 md:py-36 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-bold tracking-[0.3em] text-[#C6A96B] uppercase block mb-4">
              Gastronomy & Spirits
            </span>
            <h2 className="text-4xl sm:text-6xl font-heading text-[#0F172A] font-normal" style={{ fontFamily: 'var(--font-playfair, serif)' }}>
              Culinary Experiences
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div variants={imageReveal} initial="initial" whileInView="whileInView" className="relative aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl">
              <Image src={SITE_IMAGES.homepage.fineDining} alt="D Lounge Dining" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </motion.div>

            <motion.div variants={textReveal} initial="initial" whileInView="whileInView" className="space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C6A96B] block mb-2">D Lounge & Hikkups</span>
                <h3 className="text-3xl sm:text-4xl font-heading text-[#0F172A] font-normal leading-tight" style={{ fontFamily: 'var(--font-playfair, serif)' }}>
                  Where Every Meal Becomes a Memory
                </h3>
              </div>
              
              <p className="text-[#6B7280] text-base leading-relaxed font-light">
                From multi-cuisine fine dining at D Lounge and Mercely’s Ice Cream Parlour featuring signature Trikulfi desserts, to handcrafted cocktails and BBQ at The Hikkups Bar, our culinary offerings cater to every palate.
              </p>

              <div className="pt-4 flex items-center gap-4">
                <button 
                  onClick={() => setIsTableModalOpen(true)}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#0F172A] hover:bg-[#C6A96B] text-white font-bold text-xs uppercase tracking-widest rounded-[14px] transition-all duration-250 hover:-translate-y-[1px] shadow-lg"
                  suppressHydrationWarning
                >
                  <span>Reserve Table</span>
                  <ArrowRight size={14} />
                </button>
                <Link href="/restaurant" className="text-xs font-bold uppercase tracking-widest text-[#C6A96B] hover:underline">
                  View Menu
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* CHAPTER 7 — OUR HOSPITALITY (WARMTH & HUMAN CARE) */}
      <section className="py-28 md:py-36 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <motion.div variants={textReveal} initial="initial" whileInView="whileInView" className="lg:col-span-6 space-y-8">
            <span className="text-xs font-bold tracking-[0.3em] text-[#C6A96B] uppercase block">
              Thoughtfully Designed
            </span>
            <h2 className="text-4xl sm:text-5xl font-heading text-[#0F172A] font-normal leading-tight" style={{ fontFamily: 'var(--font-playfair, serif)' }}>
              Our Hospitality
            </h2>
            <p className="text-[#6B7280] text-base sm:text-lg leading-relaxed font-light">
              Hospitality at Ashok Inn is defined by quiet warmth. From attentive front desk reception to lush indoor plants and sunlit skylights, every detail is engineered to make you feel genuinely cared for.
            </p>
          </motion.div>

          <motion.div variants={imageReveal} initial="initial" whileInView="whileInView" className="lg:col-span-6 relative aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl">
            <Image src={SITE_IMAGES.homepage.welcomeLobby} alt="Our Hospitality" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </motion.div>
        </div>
      </section>

      {/* CHAPTER 7.5 — BUSINESS & EVENTS (BUSINESS FACILITIES FEATURE) */}
      <section className="py-24 bg-[#FAF8F5] border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Image */}
            <motion.div variants={imageReveal} initial="initial" whileInView="whileInView" className="lg:col-span-6 relative aspect-[16/10] rounded-[32px] overflow-hidden shadow-2xl">
              <Image 
                src={SITE_IMAGES.homepage.executiveMeetings} 
                alt="Ashok Inn Executive Meeting Room" 
                fill 
                sizes="(max-width: 1024px) 100vw, 50vw" 
                className="object-cover" 
              />
            </motion.div>

            {/* Right Column: Content */}
            <motion.div variants={textReveal} initial="initial" whileInView="whileInView" className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold tracking-[0.3em] text-[#C6A96B] uppercase block">
                Business & Events
              </span>

              <h2 className="text-3xl sm:text-5xl font-heading text-[#0F172A] font-normal leading-tight" style={{ fontFamily: 'var(--font-playfair, serif)' }}>
                Elegant Spaces for Business & Events
              </h2>

              <div className="w-12 h-[1px] bg-[#C6A96B]" />

              <p className="text-[#6B7280] text-base leading-relaxed font-light">
                Whether you&apos;re hosting a client presentation, a corporate discussion, or a private workshop, our executive meeting room offers a comfortable and well-equipped environment within Ashok Inn.
              </p>

              {/* Refined 6-Item Feature Specs Grid */}
              <div className="py-4 border-y border-black/8 grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6 text-xs font-semibold text-[#0F172A]">
                <div>
                  <span className="text-[10px] text-[#6B7280] uppercase tracking-wider block font-medium">Capacity</span>
                  <span>20–30 Guests</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B7280] uppercase tracking-wider block font-medium">Connectivity</span>
                  <span>High-Speed Wi-Fi</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B7280] uppercase tracking-wider block font-medium">Display</span>
                  <span>Presentation Screen</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B7280] uppercase tracking-wider block font-medium">Refreshments</span>
                  <span>Tea & Coffee Service</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B7280] uppercase tracking-wider block font-medium">Setup</span>
                  <span>Flexible Seating</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B7280] uppercase tracking-wider block font-medium">Parking</span>
                  <span>Free On-Site Parking</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/meetings"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#0F172A] hover:bg-[#C6A96B] text-white text-xs font-bold uppercase tracking-widest rounded-[12px] transition-all duration-250 hover:-translate-y-[1px] shadow-md"
                >
                  <span>Explore Meeting Space</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* CHAPTER 8 — CURATED GALLERY (THEMED CURATION) */}
      {/* =================================================================== */}
      {/* IMMERSIVE GALLERY: DYNAMIC LUXURY EDITORIAL MASONRY COLLAGE */}
      {/* =================================================================== */}
      <section className="py-24 md:py-36 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-[0.3em] text-[#C6A96B] uppercase block mb-3">
              Curated Photography
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading text-[#0F172A] font-normal mb-8" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
              Immersive Gallery
            </h2>

            {/* Gallery Category Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {[
                { id: 'all', label: 'All Showcase' },
                { id: 'rooms', label: 'Rooms & Suites' },
                { id: 'architecture', label: 'Architecture' },
                { id: 'dining', label: 'Dining & BBQ' },
                { id: 'courtyard', label: 'Courtyard' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveGalleryTab(tab.id as any)}
                  className={`px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                    activeGalleryTab === tab.id
                      ? 'bg-[#0F172A] text-white shadow-lg shadow-black/10 scale-105'
                      : 'bg-white text-[#6B7280] hover:text-[#0F172A] border border-black/5 hover:border-[#C6A96B]/30'
                  }`}
                  suppressHydrationWarning
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* PERFECT SQUARE & RECTANGLE MATRIX COLLAGE GRID */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 auto-rows-[250px] sm:auto-rows-[280px]">
            <AnimatePresence mode="popLayout">
              {filteredGallery.map((item, idx) => {
                const total = filteredGallery.length;
                
                // MATHEMATICALLY GUARANTEED PERFECT RECTANGLE / SQUARE MATRIX FORMULA
                // Ensures zero trailing gaps, zero cutout holes, and a 100% flush flat bottom edge!
                let gridClasses = "col-span-1 row-span-1";

                if (total === 1) {
                  gridClasses = "md:col-span-3 md:row-span-2";
                } else if (total === 2) {
                  gridClasses = idx === 0 ? "md:col-span-2 md:row-span-2" : "md:col-span-1 md:row-span-2";
                } else if (idx === 0) {
                  // Hero 2x2 Feature
                  gridClasses = "md:col-span-2 md:row-span-2";
                } else {
                  const rem = (total - 3) % 3; // Remaining items after 2x2 + 2 side items
                  const isLastItem = idx === total - 1;
                  const isSecondLast = idx === total - 2;

                  if (rem === 1 && isLastItem) {
                    // Single trailing item -> Full-width panoramic banner across 3 columns!
                    gridClasses = "md:col-span-3 md:row-span-1";
                  } else if (rem === 2 && isSecondLast) {
                    // 2 trailing items -> First takes 2 cols, second takes 1 col!
                    gridClasses = "md:col-span-2 md:row-span-1";
                  } else if (rem === 2 && isLastItem) {
                    gridClasses = "md:col-span-1 md:row-span-1";
                  }
                }

                return (
                  <motion.div
                    key={`${item.title}-${idx}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: (idx % 6) * 0.05 }}
                    onClick={() => {
                      // Open fullscreen Lightbox modal
                      setSelectedImage({ src: item.src, title: item.title, category: item.category });
                    }}
                    className={`group relative rounded-[28px] overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 bg-[#0F172A] ${gridClasses}`}
                  >
                    {/* Image with smooth luxury zoom */}
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />

                    {/* Gradient Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/20 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300" />

                    {/* Top Gold Category Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/20 text-[9px] font-bold uppercase tracking-[0.25em] text-[#C6A96B] rounded-full">
                        {item.category || 'Ashok Inn'}
                      </span>
                    </div>

                    {/* Bottom Info & Zoom Icon */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex items-end justify-between transition-transform duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div>
                        <h3 className={`font-heading text-white font-bold drop-shadow-md leading-tight ${idx === 0 ? 'text-xl sm:text-2xl md:text-3xl' : 'text-base sm:text-lg'}`} style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                          {item.title}
                        </h3>
                        <p className="text-white/70 text-[11px] font-light mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Click to expand view
                        </p>
                      </div>

                      {/* Expand Button */}
                      <div className="w-9 h-9 rounded-full bg-[#C6A96B] text-[#0F172A] flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 shadow-lg">
                        <span className="text-base font-bold">+</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* View Full Gallery Link Button */}
          <div className="text-center mt-12">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#0F172A] hover:bg-[#C6A96B] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-full transition-all duration-300 shadow-xl hover:-translate-y-0.5"
            >
              <span>Explore Complete Gallery ({filteredGallery.length} Photos)</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>


      {/* =================================================================== */}
      {/* ⚡ ACT III — CONVERT (70–100% Scroll)                              */}
      {/* =================================================================== */}

      {/* CHAPTER 9 — GUEST STORIES (PURE OPACITY CROSS-FADE TESTIMONIAL) */}
      <section className="py-32 md:py-44 bg-white text-center px-6">
        <div className="max-w-[860px] mx-auto">
          <Quote size={36} className="text-[#C6A96B]/35 mx-auto mb-10" />
          
          <div className="min-h-[200px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonialIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="space-y-8"
              >
                <p 
                  className="text-2xl sm:text-4xl md:text-5xl font-heading text-[#0F172A] font-normal leading-[1.35] tracking-tight"
                >
                  {testimonials[currentTestimonialIndex].quote}
                </p>

                <div className="space-y-1">
                  <span className="text-base sm:text-lg font-heading font-medium text-[#0F172A] block">
                    {testimonials[currentTestimonialIndex].author}
                  </span>
                  <span className="text-xs text-[#6B7280] font-light uppercase tracking-[0.2em] block">
                    {testimonials[currentTestimonialIndex].role}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>


      {/* CHAPTER 10 — RESERVE YOUR STAY (DEDICATED DARK BOOKING CTA) */}
      <section className="py-28 md:py-36 bg-[#0F172A] text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <span className="text-xs font-bold tracking-[0.3em] text-[#C6A96B] uppercase block mb-6">
            Begin Your Experience
          </span>

          <h2 
            className="text-4xl sm:text-6xl font-heading text-white font-normal mb-8 leading-tight"
            style={{ fontFamily: 'var(--font-playfair, serif)' }}
          >
            Reserve Your Stay
          </h2>

          <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto font-light leading-relaxed mb-16">
            Select your travel dates and let our team prepare a customized luxury stay for you.
          </p>

          <div className="max-w-5xl mx-auto text-left">
            <BookingWidget />
          </div>
        </div>
      </section>


      {/* CHAPTER 11 — IN THE HEART OF DAVANGERE (LOCATION & TRANSIT) */}
      <section className="py-28 md:py-36 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 space-y-8">
            <span className="text-xs font-bold tracking-[0.3em] text-[#C6A96B] uppercase block">
              Prime Location
            </span>
            <h2 
              className="text-4xl sm:text-5xl font-heading text-[#0F172A] font-normal leading-tight"
              style={{ fontFamily: 'var(--font-playfair, serif)' }}
            >
              In the Heart of <br />
              <span className="italic font-light text-[#C6A96B]">Davangere</span>
            </h2>
            <p className="text-[#6B7280] text-base leading-relaxed font-light">
              Ashok Inn is situated in prime central Davangere, offering effortless proximity to major transit hubs and commercial centers.
            </p>

            <div className="space-y-4 pt-4 border-t border-black/8">
              <div className="flex items-center gap-4">
                <MapPin className="text-[#C6A96B]" size={20} />
                <span className="text-sm text-[#0F172A] font-medium">Near KSRTC Bus Stand & Railway Station</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="text-[#C6A96B]" size={20} />
                <span className="text-sm text-[#0F172A] font-medium">+91 80 1234 5678</span>
              </div>
            </div>

            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#0F172A] hover:bg-[#C6A96B] text-white font-bold text-xs uppercase tracking-widest rounded-[14px] transition-all duration-250 hover:-translate-y-[1px] shadow-lg"
            >
              Get Directions <Navigation size={14} />
            </a>
          </div>

          <div className="lg:col-span-7 relative aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl border border-black/5">
            <Image
              src={SITE_IMAGES.homepage.heroBackground}
              alt="Ashok Inn Davangere Location"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-6">
              <div className="p-8 rounded-[24px] bg-black/60 backdrop-blur-md border border-white/20 text-center">
                <MapPin size={40} className="text-[#C6A96B] mx-auto mb-3" />
                <h4 className="text-xl font-bold font-heading text-white mb-1">Ashok Inn Davangere</h4>
                <span className="text-xs text-white/80">Central Business & Transit Hub</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Table Reservation Modal */}
      <TableReservationModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
      />

      {/* Fullscreen Luxury Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-xl p-4 sm:p-8 flex items-center justify-center cursor-zoom-out"
          >
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="relative max-w-5xl w-full max-h-[88vh] bg-[#0F172A] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl flex flex-col cursor-default"
            >
              {/* Top Header Bar */}
              <div className="p-4 sm:p-6 bg-black/40 backdrop-blur-md flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-[#C6A96B]/20 border border-[#C6A96B]/40 text-[#C6A96B] text-[10px] font-bold uppercase tracking-widest rounded-full">
                    {selectedImage.category || 'Curated Showcase'}
                  </span>
                  <h3 className="text-white font-heading text-lg sm:text-xl font-bold" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                    {selectedImage.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Image Viewport */}
              <div className="relative flex-1 min-h-[350px] sm:min-h-[500px] w-full bg-black/40">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  fill
                  priority
                  className="object-contain p-2 sm:p-4"
                />
              </div>

              {/* Bottom Caption Bar */}
              <div className="p-4 bg-black/60 text-center text-xs text-white/70 border-t border-white/10 flex items-center justify-between px-6">
                <span>Ashok Inn Davangere • Curated Collection</span>
                <span className="text-[#C6A96B]">Press ESC or click anywhere to close</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
