'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ChevronDown, ArrowLeft, ArrowRight, Navigation, Bus, Train, Plane, Car } from 'lucide-react'
import { SITE_IMAGES } from '@/config/siteImages'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

import { submitContactInquiry } from '@/actions/contact'

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    inquiryType: 'Room Booking Inquiry',
    message: ''
  })

  const heroImage = SITE_IMAGES.homepage.heroBackground || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2940&auto=format&fit=crop'
  const sideImage = SITE_IMAGES.homepage.welcomeLobby || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2940&auto=format&fit=crop'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    const res = await submitContactInquiry(formData)

    setIsSubmitting(false)
    if (res.success) {
      setFormSubmitted(true)
    } else {
      setSubmitError(res.error || 'Failed to submit inquiry.')
    }
  }

  const contactCards = [
    {
      icon: MapPin,
      title: 'Visit Us',
      lines: ['No. 113/4, Beside New KSRTC Bus Stand', 'PB Road, Link Road, Nittuvalli, Davangere 577002'],
      actionText: 'Get Directions',
      actionUrl: 'https://www.google.com/maps/place/Ashok+Inn+Hotel/@14.4584023,75.93056,17z/',
    },
    {
      icon: Phone,
      title: 'Call Us',
      lines: ['+91 80 1234 5678', '+91 8192 234567'],
      actionText: 'Call Reception',
      actionUrl: 'tel:+918012345678',
    },
    {
      icon: Mail,
      title: 'Email Us',
      lines: ['reservations@ashokinn.com', 'info@ashokinn.com'],
      actionText: 'Send Email',
      actionUrl: 'mailto:reservations@ashokinn.com',
    },
    {
      icon: Clock,
      title: 'Reception',
      lines: ['Open 24 Hours a Day', '365 Days a Year Service'],
      actionText: '24×7 Service',
      actionUrl: '#inquiry-form',
    },
  ]

  const whyContactUs = [
    'Instant Booking Assistance',
    'Group & Event Reservations',
    'Corporate Meeting Rates',
    'Custom Catering Inquiries',
    '24×7 Guest Support',
  ]

  const transportOptions = [
    {
      icon: Bus,
      title: 'From KSRTC Bus Stand',
      distance: 'Adjacent (2 Mins Walk)',
      desc: 'Located right next to the New KSRTC Bus Stand on main PB Road.'
    },
    {
      icon: Train,
      title: 'From Railway Station',
      distance: '2.5 km (5 Mins Drive)',
      desc: 'Quick auto-rickshaw or taxi ride from Davangere Railway Station.'
    },
    {
      icon: Plane,
      title: 'Nearest Airport',
      distance: 'Hubballi (HBX) / Shivamogga',
      desc: '1.5 hours drive via NH48 highway. Airport pickup available on request.'
    },
    {
      icon: Car,
      title: 'Guest Parking',
      distance: 'Free On-Site & Valet',
      desc: 'Ample secure private parking space with complimentary valet assistance.'
    },
  ]

  const faqs = [
    {
      q: 'What are the check-in and check-out times?',
      a: 'Standard check-in time is at 12:00 PM and check-out time is at 11:00 AM. If you require early check-in or late check-out, please notify our reception team in advance.'
    },
    {
      q: 'Can I check in early or request late check-out?',
      a: 'Early check-in and late check-out are subject to room availability. Our front desk team will always do their best to accommodate your travel schedule.'
    },
    {
      q: 'Is parking available on-site for hotel guests?',
      a: 'Yes, we offer complimentary secure private parking and valet assistance for all staying guests and restaurant visitors.'
    },
    {
      q: 'Can I book dining table reservations or room service by phone?',
      a: 'Absolutely! You can call our front desk at +91 80 1234 5678 anytime to reserve tables at D Lounge, The Hikkups, or order 24×7 room service.'
    },
    {
      q: 'How do I modify or cancel my reservation?',
      a: 'You can modify or cancel your booking by calling our reservations team directly or emailing reservations@ashokinn.com with your booking reference.'
    },
  ]



  return (
    <main className="bg-[#FAF8F5] min-h-screen pb-32 font-body selection:bg-[#C6A96B] selection:text-white">

      {/* 1. HERO (58vh Header — Generous Breathing Room) */}
      <div className="relative h-[58vh] min-h-[500px] w-full flex items-center justify-center bg-[#0F172A] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-70">
          <Image 
            src={heroImage} 
            alt="Ashok Inn Front Entrance Hero" 
            fill 
            sizes="100vw"
            className="object-cover scale-105 transition-transform duration-1000"
            priority
          />
        </div>
        
        {/* Preserved Photo Overlay (Dark at top, subtle fade at bottom) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/85 via-[#0F172A]/40 to-transparent z-10" />

        <div className="relative z-20 text-center px-4 max-w-2xl mx-auto pt-24 pb-20">
          
          {/* Integrated Clean Breadcrumb */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white/80 font-semibold mb-5">
            <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
              <ArrowLeft size={13} /> Home
            </Link>
            <span>/</span>
            <span className="text-[#C6A96B]">Contact Us</span>
          </div>

          <span className="text-[11px] font-bold tracking-[0.4em] text-[#C6A96B] uppercase mb-3 block">
            24×7 Guest Hospitality Assistance
          </span>
          <h1 
            className="text-4xl sm:text-6xl font-normal text-white mb-4 tracking-tight font-heading leading-tight"
            style={{ fontFamily: 'var(--font-cormorant, serif)' }}
          >
            We’re Here to Help You Plan Your Stay
          </h1>
          <p className="text-white/90 text-sm sm:text-base max-w-lg mx-auto font-light leading-relaxed">
            Whether planning a relaxing stay, a family gathering, or a business visit, our team is always happy to assist you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-28">

        {/* 2. FLOATING CONTACT CARDS (-mt-14 sm:-mt-16 OVER HERO BOTTOM EDGE) */}
        <section className="relative z-30 -mt-14 sm:-mt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {contactCards.map((card) => {
              const Icon = card.icon
              return (
                <ScrollReveal key={card.title} type="text" className="h-full">
                  <div className="bg-white rounded-[28px] p-8 border border-black/5 shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] hover:-translate-y-2 hover:border-[#C6A96B] transition-all duration-300 group flex flex-col justify-between h-full space-y-6">
                    <div className="space-y-5">
                      <div className="w-14 h-14 rounded-[18px] bg-[#FAF8F5] border border-black/5 flex items-center justify-center text-[#C6A96B] group-hover:bg-[#C6A96B] group-hover:text-white transition-all duration-300 shadow-sm">
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-[#0F172A] mb-2" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                          {card.title}
                        </h3>
                        <div className="space-y-1">
                          {card.lines.map((line, i) => (
                            <p key={i} className="text-xs text-[#6B7280] font-light leading-relaxed">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>

                    <a 
                      href={card.actionUrl}
                      target={card.actionUrl.startsWith('http') ? '_blank' : '_self'}
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C6A96B] group-hover:text-[#0F172A] transition-colors pt-4 border-t border-black/5"
                    >
                      <span>{card.actionText}</span>
                      <ArrowRight size={13} className="transition-transform duration-250 group-hover:translate-x-1" />
                    </a>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </section>

        {/* 3. VISIT ASHOK INN (MAP & DIRECTIONS SECTION) */}
        <section className="bg-white rounded-[32px] p-6 sm:p-10 border border-black/5 shadow-lg space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C6A96B] block mb-1">
                Visit Ashok Inn
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading text-[#0F172A]" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                Conveniently Positioned on PB Road
              </h2>
              <p className="text-xs text-[#6B7280] font-light mt-1">
                No. 113/4, Beside New KSRTC Bus Stand, P B Road, Link Road, Nittuvalli, Davangere, Karnataka 577002
              </p>
            </div>

            <a
              href="https://www.google.com/maps/place/Ashok+Inn+Hotel/@14.4584023,75.93056,17z/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#0F172A] hover:bg-[#C6A96B] text-white text-xs font-bold uppercase tracking-widest rounded-[14px] transition-all shadow-md shrink-0 hover:-translate-y-[1px]"
            >
              <Navigation size={14} />
              <span>Get Directions</span>
            </a>
          </div>

          {/* Full-width Map Container */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-[24px] overflow-hidden border border-black/8 bg-[#FAF8F5] shadow-inner">
            <iframe
              title="Ashok Inn Davanagere Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1707.331312931057!2d75.93056004036528!3d14.458402295408439!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bba2533855432e9%3A0xd6f8d05d795ddbbe!2sAshok%20Inn%20Hotel!5e0!3m2!1sen!2sin!4v1785421616577!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'contrast(1.02) saturate(0.95)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </section>

        {/* 4. SPLIT TWO-COLUMN FORM & HOTEL ATMOSPHERE IMAGE */}
        <section id="inquiry-form" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Form (lg:col-span-7) */}
          <ScrollReveal type="text" className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-[32px] border border-black/5 shadow-xl flex flex-col justify-between">
            {formSubmitted ? (
              <div className="text-center py-16 space-y-4 my-auto">
                <div className="w-16 h-16 bg-[#10B981]/15 text-[#10B981] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-3xl font-heading font-normal text-[#0F172A]" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                  Message Received
                </h4>
                <p className="text-xs text-[#6B7280] max-w-md mx-auto leading-relaxed">
                  Thank you! Our guest relations manager will review your inquiry and get back to you within two business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C6A96B] block">
                    Inquiry Form
                  </span>
                  <h3 className="text-3xl font-heading text-[#0F172A]" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                    Send Us a Message
                  </h3>
                </div>

                {submitError && (
                  <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-[12px]">
                    {submitError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-1.5">Full Name</label>
                    <input name="fullName" value={formData.fullName} onChange={handleInputChange} required type="text" placeholder="e.g. Ramesh Kumar" suppressHydrationWarning className="w-full px-4 py-3.5 bg-[#FAF8F5] border border-black/10 rounded-[14px] text-xs font-semibold focus:outline-none focus:border-[#C6A96B] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-1.5">Email Address</label>
                    <input name="email" value={formData.email} onChange={handleInputChange} required type="email" placeholder="ramesh@example.com" suppressHydrationWarning className="w-full px-4 py-3.5 bg-[#FAF8F5] border border-black/10 rounded-[14px] text-xs font-semibold focus:outline-none focus:border-[#C6A96B] transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-1.5">Phone Number</label>
                    <input name="phone" value={formData.phone} onChange={handleInputChange} required type="tel" placeholder="+91 98765 43210" suppressHydrationWarning className="w-full px-4 py-3.5 bg-[#FAF8F5] border border-black/10 rounded-[14px] text-xs font-semibold focus:outline-none focus:border-[#C6A96B] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-1.5">Purpose of Inquiry</label>
                    <select name="inquiryType" value={formData.inquiryType} onChange={handleInputChange} required suppressHydrationWarning className="w-full px-4 py-3.5 bg-[#FAF8F5] border border-black/10 rounded-[14px] text-xs font-semibold focus:outline-none focus:border-[#C6A96B] transition-colors">
                      <option value="Room Booking Inquiry">Room Booking Inquiry</option>
                      <option value="Dining Table Reservation">Dining Table Reservation</option>
                      <option value="Business Meeting / Event">Business Meeting / Event</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-1.5">Your Message</label>
                  <textarea name="message" value={formData.message} onChange={handleInputChange} rows={4} required placeholder="How can our team assist you with your upcoming visit?" suppressHydrationWarning className="w-full px-4 py-3.5 bg-[#FAF8F5] border border-black/10 rounded-[14px] text-xs font-semibold focus:outline-none focus:border-[#C6A96B] transition-colors" />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#0F172A] hover:bg-[#C6A96B] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-[14px] transition-all shadow-md flex items-center justify-center gap-2 hover:-translate-y-[1px]"
                  suppressHydrationWarning
                >
                  <span>{isSubmitting ? 'Submitting Inquiry...' : 'Send Inquiry'}</span>
                  <Send size={14} />
                </button>
              </form>
            )}
          </ScrollReveal>

          {/* Right Column: Hotel Atmosphere Image + Trust Card (lg:col-span-5) */}
          <ScrollReveal type="image" className="lg:col-span-5 relative flex flex-col justify-between bg-[#0F172A] text-white rounded-[32px] overflow-hidden shadow-2xl border border-white/10 min-h-[460px]">
            <div className="absolute inset-0 z-0 opacity-55">
              <Image 
                src={sideImage} 
                alt="Ashok Inn Atmosphere" 
                fill 
                sizes="(max-width: 1024px) 100vw, 40vw" 
                className="object-cover" 
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/70 via-[#0F172A]/50 to-[#0F172A]/90 z-10" />

            <div className="relative z-20 p-8 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C6A96B] block">
                Personalized Care
              </span>
              <h3 className="text-3xl font-heading font-normal leading-tight" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                Dedicated Guest Assistance
              </h3>
              <p className="text-white/80 text-xs font-light leading-relaxed">
                Our front desk and concierge team are available 24 hours a day to make your visit effortless.
              </p>
            </div>

            <div className="relative z-20 p-8 space-y-3 bg-[#0F172A]/80 backdrop-blur-md border-t border-white/10">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#C6A96B] block mb-2">
                Why Contact Us
              </span>
              {whyContactUs.map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-xs font-medium text-white/90">
                  <CheckCircle2 size={15} className="text-[#C6A96B] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>

        </section>

        {/* 5. TRANSPORTATION & TRAVEL DISTANCE GUIDE */}
        <section className="space-y-10">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#C6A96B] block mb-2">
              Getting Here
            </span>
            <h2 className="text-3xl font-heading text-[#0F172A] font-normal" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
              Transportation & Arrival
            </h2>
            <p className="text-xs text-[#6B7280] font-light mt-1">
              Convenient travel connections from major transit hubs directly to our front entrance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {transportOptions.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="bg-white rounded-[24px] p-7 border border-black/5 shadow-sm space-y-3">
                  <div className="w-12 h-12 rounded-[16px] bg-[#FAF8F5] border border-black/5 flex items-center justify-center text-[#C6A96B]">
                    <Icon size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C6A96B] block">{item.distance}</span>
                    <h3 className="font-bold text-base text-[#0F172A]">{item.title}</h3>
                  </div>
                  <p className="text-xs text-[#6B7280] leading-relaxed font-light">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* 6. FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
        <section className="bg-white rounded-[32px] p-8 sm:p-14 border border-black/5 shadow-lg space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C6A96B]">Common Questions</span>
            <h2 className="text-3xl font-heading text-[#0F172A]" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div key={faq.q} className="border border-black/8 rounded-[18px] overflow-hidden transition-colors bg-[#FAF8F5]">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#0F172A] focus:outline-none"
                    suppressHydrationWarning
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={16} className={`text-[#C6A96B] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs text-[#6B7280] leading-relaxed font-light border-t border-black/5">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* 7. FINAL WARM BOOKING CTA BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 sm:p-12 bg-[#0F172A] text-white rounded-[32px] shadow-2xl">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C6A96B] block">Your Stay Awaits</span>
            <h4 className="text-2xl sm:text-3xl font-heading font-normal" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
              We Look Forward to Welcoming You
            </h4>
            <p className="text-xs text-white/70 font-light max-w-lg">
              Whether planning a relaxing stay, a family getaway, or a business visit, our team is always happy to help.
            </p>
          </div>

          <Link
            href="/booking"
            className="w-full sm:w-auto px-9 py-4 bg-[#C6A96B] hover:bg-[#B8913A] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-[14px] transition-all shadow-md flex items-center justify-center gap-2 shrink-0 hover:-translate-y-[1px]"
          >
            <span>Book Your Stay</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>

    </main>
  )
}
