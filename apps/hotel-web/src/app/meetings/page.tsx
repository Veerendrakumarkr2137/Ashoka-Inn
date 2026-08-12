'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Phone, Mail, Send, Calendar, Users, Monitor, Wifi, Coffee, ShieldCheck } from 'lucide-react'
import { SITE_IMAGES } from '@/config/siteImages'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export default function MeetingsPage() {
  const [submitted, setSubmitted] = useState(false)
  const meetingHeroImage = SITE_IMAGES.homepage.executiveMeetings || 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=2940&auto=format&fit=crop'

  const meetingFeatures = [
    { title: 'Flexible Capacity', desc: 'Accommodates 20–30 guests in boardroom, U-shape, or theater seating arrangements.', icon: Users },
    { title: 'High-Speed Wi-Fi', desc: 'Dedicated high-speed fiber internet for seamless video conferencing & live presentations.', icon: Wifi },
    { title: 'AV & Presentation Screen', desc: 'High-definition widescreen display with HDMI/wireless casting for sharp decks.', icon: Monitor },
    { title: 'Tea & Coffee Service', desc: 'Freshly brewed tea, artisanal coffee, and light refreshment catering available.', icon: Coffee },
    { title: 'Climate Control', desc: 'Individual air-conditioning and sound-insulated acoustic wall panelling.', icon: ShieldCheck },
    { title: 'Free On-Site Parking', desc: 'Ample secure parking & valet assistance for all your meeting attendees.', icon: CheckCircle2 },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="bg-[#FAF8F5] min-h-screen pb-32 font-body selection:bg-[#C6A96B] selection:text-white">

      {/* 1. HERO (Dark Destination Header) */}
      <div className="relative h-[75vh] min-h-[550px] w-full flex items-center justify-center bg-[#0F172A] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-65">
          <Image 
            src={meetingHeroImage} 
            alt="Ashok Inn Executive Meeting Room Hero" 
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
            <span className="text-[#C6A96B]">Business & Meetings</span>
          </div>

          <span className="text-[11px] font-bold tracking-[0.4em] text-[#C6A96B] uppercase mb-4 block">
            Executive Facilities at Ashok Inn
          </span>
          <h1 
            className="text-5xl sm:text-7xl lg:text-8xl font-normal text-white mb-6 tracking-tight font-heading leading-none"
            style={{ fontFamily: 'var(--font-cormorant, serif)' }}
          >
            Business & Events
          </h1>
          <p className="text-white/90 text-base sm:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-10">
            A thoughtfully designed executive meeting space equipped for productive corporate discussions, client presentations, and private workshops.
          </p>
          <a 
            href="#inquiry-form"
            className="inline-flex items-center gap-2 bg-[#C6A96B] hover:bg-[#B8913A] text-white px-9 py-4 rounded-[14px] text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-xl hover:-translate-y-[1px]"
          >
            <span>Reserve Meeting Space</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-28 pt-20">

        {/* 2. OVERVIEW & FEATURES GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <ScrollReveal type="text" className="lg:col-span-6 space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#C6A96B] block">
              Professional Environment
            </span>
            
            <h2 
              className="text-4xl sm:text-5xl font-heading text-[#0F172A] leading-tight font-normal" 
              style={{ fontFamily: 'var(--font-cormorant, serif)' }}
            >
              Engineered for Productive Gatherings
            </h2>

            <div className="w-16 h-[1px] bg-[#C6A96B] opacity-60" />

            <p className="text-[#6B7280] text-base leading-relaxed font-light">
              Located conveniently within Hotel Ashok Inn, our executive meeting room provides a quiet, professional backdrop away from city noise. Combined with attentive hospitality, on-site catering, and executive support.
            </p>

            <div className="pt-2 border-t border-black/5 text-xs font-semibold text-[#0F172A] space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#C6A96B]" />
                <span>Ideal for Board Meetings, Corporate Training & Client Pitches</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#C6A96B]" />
                <span>In-House Dining Support from D Lounge Restaurant</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal type="image" className="lg:col-span-6 relative aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl border border-black/5">
            <Image 
              src={meetingHeroImage} 
              alt="Executive Meeting Hall Interior" 
              fill 
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </ScrollReveal>
        </section>

        {/* 3. 6-FEATURE HIGHLIGHTS */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#C6A96B] block mb-2">
              Room Specifications
            </span>
            <h3 className="text-3xl sm:text-4xl font-heading text-[#0F172A] font-normal" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
              Everything Prepared For Your Success
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetingFeatures.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="bg-white rounded-[24px] p-8 border border-black/5 shadow-sm space-y-3">
                  <div className="w-12 h-12 rounded-[16px] bg-[#FAF8F5] border border-black/5 flex items-center justify-center text-[#C6A96B]">
                    <Icon size={22} />
                  </div>
                  <h4 className="font-bold text-base text-[#0F172A]">{item.title}</h4>
                  <p className="text-xs text-[#6B7280] leading-relaxed font-light">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* 4. INQUIRY FORM SECTION */}
        <section id="inquiry-form" className="bg-[#0F172A] text-white rounded-[36px] p-8 sm:p-16 border border-white/10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#C6A96B] block">
              Meeting Reservation
            </span>
            <h3 className="text-3xl sm:text-5xl font-heading font-normal leading-tight text-white" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
              Plan Your Next Meeting
            </h3>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed font-light">
              Submit your preferred date and guest count. Our events coordinator will contact you within two business hours with layout options and catering details.
            </p>

            <div className="pt-4 space-y-3 border-t border-white/10 text-xs text-white/70 font-medium">
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-[#C6A96B]" />
                <span>+91 80 1234 5678 (Corporate Desk)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[#C6A96B]" />
                <span>events@ashokinn.com</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white text-[#0F172A] p-8 rounded-[28px] shadow-xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-[#10B981]/15 text-[#10B981] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-2xl font-heading font-bold">Inquiry Received</h4>
                <p className="text-sm text-[#6B7280] max-w-md mx-auto">
                  Thank you! Our events team will reach out shortly with customized meeting packages and availability.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">Your Full Name</label>
                    <input required type="text" placeholder="e.g. Anand Sharma" className="w-full px-4 py-3 bg-[#FAF8F5] border border-black/10 rounded-[12px] text-xs font-semibold focus:outline-none focus:border-[#C6A96B]" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">Company / Organization</label>
                    <input required type="text" placeholder="e.g. Acme Corp" className="w-full px-4 py-3 bg-[#FAF8F5] border border-black/10 rounded-[12px] text-xs font-semibold focus:outline-none focus:border-[#C6A96B]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">Phone Number</label>
                    <input required type="tel" placeholder="+91 98765 43210" className="w-full px-4 py-3 bg-[#FAF8F5] border border-black/10 rounded-[12px] text-xs font-semibold focus:outline-none focus:border-[#C6A96B]" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">Expected Guests</label>
                    <input required type="number" placeholder="15" className="w-full px-4 py-3 bg-[#FAF8F5] border border-black/10 rounded-[12px] text-xs font-semibold focus:outline-none focus:border-[#C6A96B]" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">Special Requirements / Catering</label>
                  <textarea rows={3} placeholder="Tell us about your preferred date, layout, or tea/coffee requirements..." className="w-full px-4 py-3 bg-[#FAF8F5] border border-black/10 rounded-[12px] text-xs font-semibold focus:outline-none focus:border-[#C6A96B]" />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-[#0F172A] hover:bg-[#C6A96B] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-[14px] transition-all shadow-md flex items-center justify-center gap-2"
                  suppressHydrationWarning
                >
                  <span>Submit Meeting Inquiry</span>
                  <Send size={14} />
                </button>
              </form>
            )}
          </div>
        </section>

      </div>

    </main>
  )
}
