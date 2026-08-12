'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  MapPin, Phone, Mail, Instagram, Facebook, Twitter, Youtube,
  ArrowRight, Star, Award, Wifi, Coffee, Car
} from 'lucide-react'
import { cn } from '@hospitality-os/utils'

const footerLinks = {
  hotel: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Story', href: '/about#story' },
    { label: 'Awards', href: '/about#awards' },
    { label: 'Sustainability', href: '/about#sustainability' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
  ],
  rooms: [
    { label: 'Standard Rooms', href: '/rooms?type=standard' },
    { label: 'Deluxe Rooms', href: '/rooms?type=deluxe' },
    { label: 'Executive Suites', href: '/rooms?type=suite' },
    { label: 'Presidential Suite', href: '/rooms?type=presidential' },
    { label: 'Family Rooms', href: '/rooms?type=family' },
    { label: 'View All Rooms', href: '/rooms' },
  ],
  experiences: [
    { label: 'Restaurant & Bar', href: '/restaurant' },
    { label: 'Spa & Wellness', href: '/spa' },
    { label: 'Swimming Pool', href: '/experiences#pool' },
    { label: 'Events & Meetings', href: '/events' },
    { label: 'Weddings', href: '/wedding' },
    { label: 'Nearby Attractions', href: '/attractions' },
  ],
  support: [
    { label: 'Book a Room', href: '/booking' },
    { label: 'Manage Booking', href: '/profile/bookings' },
    { label: 'Guest Reviews', href: '/reviews' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'AI Concierge', href: '/ai-concierge' },
  ],
}

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-400' },
  { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-400' },
  { icon: Twitter, href: '#', label: 'Twitter/X', color: 'hover:text-sky-400' },
  { icon: Youtube, href: '#', label: 'YouTube', color: 'hover:text-red-400' },
]

const highlights = [
  { icon: Star, text: '4.9 Rating', sub: 'TripAdvisor' },
  { icon: Award, text: 'Best Hotel', sub: '2024 Award' },
  { icon: Wifi, text: 'Free WiFi', sub: 'Ultra-Fast' },
  { icon: Car, text: 'Valet', sub: 'Parking' },
]

import { usePathname } from 'next/navigation'

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const pathname = usePathname()

  const isAuthPage = pathname === '/login' || pathname === '/manage-booking'

  if (isAuthPage) {
    return (
      <footer className="bg-[#0F172A] border-t border-white/10 py-6 text-xs text-white/50 font-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Ashok Inn. All rights reserved.</p>
          <div className="flex items-center gap-4 text-white/60">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <span>•</span>
            <a href="tel:+918012345678" className="hover:text-white transition-colors">Help: +91 80 1234 5678</a>
          </div>
        </div>
      </footer>
    )
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="bg-[#0F172A] text-white">
      {/* Top highlights bar */}
      <div className="border-b border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {highlights.map(({ icon: Icon, text, sub }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-[#C6A96B]/15 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-[#C6A96B]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{text}</p>
                  <p className="text-xs text-white/40">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-4">
            {/* Logo */}
            <div className="mb-6">
              <h2
                className="text-2xl font-bold text-white mb-1"
                style={{ fontFamily: 'var(--font-playfair, serif)' }}
              >
                Ashok Inn
              </h2>
              <p className="text-[10px] tracking-[0.25em] text-[#C6A96B] uppercase">
                Luxury & Elegance
              </p>
            </div>

            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              Where timeless luxury meets modern comfort. Every stay is crafted to exceed your
              expectations and create memories that last a lifetime.
            </p>

            {/* Contact info */}
            <div className="space-y-3 mb-8">
              <a
                href="https://www.google.com/maps/place/Ashok+Inn+Hotel/@14.4584023,75.93056,17z/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-sm text-white/50 hover:text-white/80 transition-colors group"
              >
                <MapPin size={16} className="text-[#C6A96B] mt-0.5 shrink-0" />
                <span>No. 113/4, Beside New KSRTC Bus Stand, P B Road, Link Road, Nittuvalli, Davangere, Karnataka 577002</span>
              </a>
              <a href="tel:+918012345678" className="flex items-center gap-3 text-sm text-white/50 hover:text-white/80 transition-colors">
                <Phone size={16} className="text-[#C6A96B] shrink-0" />
                <span>+91 80 1234 5678</span>
              </a>
              <a href="mailto:reservations@ashok-inn.com" className="flex items-center gap-3 text-sm text-white/50 hover:text-white/80 transition-colors">
                <Mail size={16} className="text-[#C6A96B] shrink-0" />
                <span>reservations@ashok-inn.com</span>
              </a>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={cn(
                    'w-9 h-9 rounded-[10px] bg-white/5 border border-white/8',
                    'flex items-center justify-center text-white/40',
                    'hover:bg-white/10 hover:border-white/15 transition-all duration-200',
                    color,
                  )}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links grid */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-8">
            {/* Column 1 — Hotel & Rooms */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-semibold text-[#C6A96B] uppercase tracking-widest mb-4">
                  The Hotel
                </h3>
                <ul className="space-y-2.5">
                  {footerLinks.hotel.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="group inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-[#C6A96B] transition-all duration-250">
                        <span>{link.label}</span>
                        <ArrowRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-250 text-[#C6A96B]" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-semibold text-[#C6A96B] uppercase tracking-widest mb-4">
                  Rooms & Suites
                </h3>
                <ul className="space-y-2.5">
                  {footerLinks.rooms.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="group inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-[#C6A96B] transition-all duration-250">
                        <span>{link.label}</span>
                        <ArrowRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-250 text-[#C6A96B]" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter + experiences col */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-[#C6A96B] uppercase tracking-widest mb-4">
                Experiences
              </h3>
              <ul className="space-y-2.5">
                {footerLinks.experiences.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="group inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-[#C6A96B] transition-all duration-250">
                      <span>{link.label}</span>
                      <ArrowRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-250 text-[#C6A96B]" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="bg-white/4 border border-white/8 rounded-[20px] p-5">
              <h3 className="text-sm font-semibold text-white mb-1">Stay Inspired</h3>
              <p className="text-xs text-white/40 mb-4">
                Exclusive offers, travel inspiration, and early access to deals.
              </p>
              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-sm text-[#10B981] font-medium flex items-center gap-2"
                >
                  <span>✓</span> You&apos;re subscribed!
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full px-4 py-3 rounded-[10px] bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#C6A96B] transition-colors"
                    required
                    suppressHydrationWarning
                  />
                  <button
                    type="submit"
                    className="bg-[#C6A96B] hover:bg-[#B8913A] text-white px-3 py-2 rounded-[10px] transition-colors"
                    aria-label="Subscribe"
                    suppressHydrationWarning
                  >
                    <ArrowRight size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30">
              &copy; {new Date().getFullYear()} Ashok Inn. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Sitemap'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-xs text-white/30 hover:text-white/60 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-white/20">
              <span>Powered by</span>
              <span className="text-[#C6A96B]">Ashok Inn</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
