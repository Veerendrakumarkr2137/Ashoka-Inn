'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone, ChevronDown, Globe, Heart, User, ArrowRight, Key } from 'lucide-react'
import { cn } from '@hospitality-os/utils'

// ─── Refined Primary Navigation Links ────────────────────────
const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Rooms', href: '/rooms' },
  {
    label: 'Dining',
    href: '/restaurant',
    dropdown: [
      { label: 'D Lounge Restaurant', subtitle: 'Multi-Cuisine Fine Dining', href: '/restaurant/d-lounge' },
      { label: 'Mercely’s Kefi', subtitle: 'Ice Creams & Trikulfi', href: '/restaurant/mercelys' },
      { label: 'The Hikkups BBQ & Bar', subtitle: 'Signature BBQ & Cocktails', href: '/restaurant/the-hikkups' },
      { label: '24×7 Room Service', subtitle: 'In-Room Dining Care', href: '/restaurant/room-service' },
    ],
  },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

// ─── Navbar Component ─────────────────────────────────────────
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // HERO PAGES with Dark Hero Backgrounds where navbar starts transparent with white text
  const darkHeroRoutes = [
    '/', 
    '/rooms', 
    '/restaurant', 
    '/restaurant/d-lounge', 
    '/restaurant/the-hikkups', 
    '/restaurant/mercelys', 
    '/restaurant/room-service',
    '/meetings',
    '/gallery',
    '/about',
    '/contact',
    '/login',
    '/manage-booking',
    '/wishlist'
  ]
  
  const isDarkHeroPage = darkHeroRoutes.includes(pathname)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Scroll threshold: Top (transparent over hero) vs Scrolled (Ivory glass blur)
  const isScrolled = scrollY > 85

  // Text is white ONLY when on a dark hero page AND at top of page (scrollY <= 85)
  const isWhiteText = isDarkHeroPage && !isScrolled

  const isAuthPage = pathname === '/login' || pathname === '/manage-booking'

  if (isAuthPage) {
    return (
      <header className="fixed top-0 left-0 right-0 z-[200] bg-[#0F172A]/90 backdrop-blur-md border-b border-white/10 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          <Link href="/" className="flex flex-col">
            <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
              Ashok Inn
            </span>
            <span className="text-[9px] tracking-[0.3em] text-[#C6A96B] uppercase font-bold">
              Luxury & Elegance
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6 text-xs font-semibold">
            <a href="tel:+918012345678" className="hidden sm:flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <Phone size={14} className="text-[#C6A96B]" />
              <span>Need Help? +91 80 1234 5678</span>
            </a>
            <Link href="/" className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/15">
              <ArrowRight size={13} className="rotate-180" />
              <span>Back to Website</span>
            </Link>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-[200] transition-all duration-500 ease-in-out',
          
          // 1. DARK HERO PAGES - INITIAL (Top over hero photo): Transparent
          isDarkHeroPage && !isScrolled && 'bg-transparent border-transparent',

          // 2. SCROLLED OR LIGHT PAGES: Warm Ivory Glass Blur / Solid
          (!isDarkHeroPage || isScrolled) && 'bg-[#FAF8F5]/95 backdrop-blur-md border-b border-black/8 shadow-sm'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex flex-col">
                <span
                  className={cn(
                    "font-heading text-xl sm:text-2xl font-bold tracking-tight leading-none transition-colors duration-300",
                    isWhiteText ? "text-white" : "text-[#0F172A]"
                  )}
                  style={{ fontFamily: 'var(--font-cormorant, serif)' }}
                >
                  Ashok Inn
                </span>
                <span className="text-[9px] tracking-[0.3em] text-[#C6A96B] uppercase mt-0.5 font-bold">
                  Luxury & Elegance
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
              {navLinks.map((link) => (
                <div key={link.label} className="relative">
                  {link.dropdown ? (
                    <button
                      onClick={() =>
                        setOpenDropdown(openDropdown === link.label ? null : link.label)
                      }
                      className={cn(
                        'flex items-center gap-1 px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded-lg',
                        'transition-colors duration-200',
                        isWhiteText 
                          ? 'text-white/90 hover:text-white hover:bg-white/10' 
                          : 'text-[#0F172A]/80 hover:text-[#0F172A] hover:bg-black/5',
                        openDropdown === link.label && 'text-[#C6A96B]',
                      )}
                      suppressHydrationWarning
                    >
                      {link.label}
                      <motion.span
                        animate={{ rotate: openDropdown === link.label ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={14} />
                      </motion.span>
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className={cn(
                        "px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded-lg transition-colors duration-200 block",
                        isWhiteText
                          ? "text-white/90 hover:text-white hover:bg-white/10"
                          : "text-[#0F172A]/80 hover:text-[#0F172A] hover:bg-black/5"
                      )}
                    >
                      {link.label}
                    </Link>
                  )}

                  {/* Dropdown Menu */}
                  {link.dropdown && (
                    <AnimatePresence>
                      {openDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className={cn(
                            'absolute top-full left-0 mt-2 w-72',
                            'bg-[#0F172A] border border-white/10 rounded-[20px]',
                            'shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden p-2',
                          )}
                        >
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              onClick={() => setOpenDropdown(null)}
                              className={cn(
                                'flex flex-col px-4 py-3 text-white/80',
                                'hover:text-white hover:bg-white/8 rounded-[12px]',
                                'transition-all duration-150 group',
                              )}
                            >
                              <span className="text-sm font-semibold group-hover:text-[#C6A96B] transition-colors">{item.label}</span>
                              {item.subtitle && (
                                <span className="text-[11px] text-white/50 font-light mt-0.5">{item.subtitle}</span>
                              )}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Language */}
              <button 
                className={cn("p-2 rounded-lg transition-all", isWhiteText ? "text-white/70 hover:text-white hover:bg-white/10" : "text-[#0F172A]/60 hover:text-[#0F172A] hover:bg-black/5")} 
                suppressHydrationWarning
              >
                <Globe size={18} />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className={cn("p-2 rounded-lg transition-all hover:text-[#C6A96B]", isWhiteText ? "text-white/70 hover:bg-white/10" : "text-[#0F172A]/60 hover:bg-black/5")}
              >
                <Heart size={18} />
              </Link>

              {/* User / Profile */}
              <Link
                href="/profile"
                className={cn("p-2 rounded-lg transition-all", isWhiteText ? "text-white/70 hover:text-white hover:bg-white/10" : "text-[#0F172A]/60 hover:text-[#0F172A] hover:bg-black/5")}
              >
                <User size={18} />
              </Link>

              {/* Divider */}
              <div className={cn("w-px h-6 mx-1", isWhiteText ? "bg-white/20" : "bg-black/10")} />

              {/* Phone */}
              <a
                href="tel:+918012345678"
                className={cn("flex items-center gap-2 text-xs font-semibold tracking-wider transition-colors", isWhiteText ? "text-white/80 hover:text-white" : "text-[#0F172A]/80 hover:text-[#0F172A]")}
              >
                <Phone size={14} className="text-[#C6A96B]" />
                <span>+91 80 1234 5678</span>
              </a>

              {/* CTA Button */}
              <Link
                href="/booking"
                className="ml-2 inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-[12px] text-[11px] font-bold uppercase tracking-[0.18em] transition-all duration-300 bg-[#C6A96B] hover:bg-[#B8913A] text-white shadow-md hover:-translate-y-[1px]"
              >
                <span>Book Now →</span>
              </Link>
            </div>

            {/* Mobile: Profile Icon, Book CTA & Hamburger */}
            <div className="flex items-center gap-2 sm:gap-3 lg:hidden">
              <Link
                href="/profile"
                className={cn("p-2 rounded-lg transition-colors", isWhiteText ? "text-white hover:bg-white/10" : "text-[#0F172A] hover:bg-black/5")}
                aria-label="Guest Profile"
              >
                <User size={20} />
              </Link>
              <Link href="/booking" className="bg-[#C6A96B] text-white px-3.5 py-1.5 rounded-[12px] text-xs font-bold uppercase tracking-wider">
                Book
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={cn("p-2 rounded-lg transition-colors", isWhiteText ? "text-white hover:bg-white/10" : "text-[#0F172A] hover:bg-black/5")}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                suppressHydrationWarning
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[190] bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={cn(
                'fixed top-0 right-0 bottom-0 z-[195] w-80 lg:hidden',
                'bg-[#0F172A] border-l border-white/8',
                'overflow-y-auto',
              )}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between p-6 border-b border-white/8">
                <span className="font-heading text-lg font-bold text-white">Ashok Inn</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 text-white/60 hover:text-white rounded-lg" suppressHydrationWarning>
                  <X size={20} />
                </button>
              </div>

              {/* Mobile nav links */}
              <nav className="p-4 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center px-4 py-3 text-white/80 hover:text-white hover:bg-white/8 rounded-[12px] font-medium transition-all"
                    >
                      {link.label}
                    </Link>
                    {link.dropdown && (
                      <div className="ml-4 mt-1 space-y-1">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-white/50 hover:text-white/80 hover:bg-white/5 rounded-[10px] transition-all"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </nav>

              {/* Mobile bottom actions */}
              <div className="p-6 border-t border-white/8 space-y-3">
                <a href="tel:+918012345678" className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                  <Phone size={16} className="text-[#C6A96B]" />
                  <span className="text-sm font-medium">+91 80 1234 5678</span>
                </a>
                <Link
                  href="/booking"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center bg-[#C6A96B] hover:bg-[#B8913A] text-white py-3.5 rounded-[14px] font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  Book Your Stay
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
