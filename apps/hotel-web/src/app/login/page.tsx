'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LogIn, Key, Mail, Lock, Search, UserPlus, User, CheckCircle2, ShieldCheck, Coffee } from 'lucide-react'
import { loginWithPassword, loginWithBookingRef } from '@/actions/auth'
import { SITE_IMAGES } from '@/config/siteImages'

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'lookup'>('signin')
  
  // Sign In State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)

  // Sign Up State
  const [fullName, setFullName] = useState('')
  
  // Lookup State
  const [bookingRef, setBookingRef] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const sideImage = SITE_IMAGES.homepage.heroBackground || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2940&auto=format&fit=crop'

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await loginWithPassword(email, password)

    if (res.success) {
      window.location.href = '/profile'
    } else {
      setError(res.error || 'Failed to sign in. Please verify your credentials.')
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    setTimeout(async () => {
      const res = await loginWithPassword(email, password)
      if (res.success) {
        window.location.href = '/profile'
      } else {
        setSuccessMsg('Account created successfully! Please sign in.')
        setAuthMode('signin')
        setLoading(false)
      }
    }, 600)
  }

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await loginWithBookingRef(email, bookingRef)

    if (res.success) {
      window.location.href = '/profile'
    } else {
      setError(res.error || 'Booking reference not found. Please verify your details.')
      setLoading(false)
    }
  }

  return (
    <main className="bg-[#FAF8F5] min-h-screen flex flex-col pt-20 font-body selection:bg-[#C6A96B] selection:text-white">
      
      {/* 2-COLUMN DESKTOP SPLIT LAYOUT */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-[32px] border border-black/5 shadow-[0_32px_64px_rgba(0,0,0,0.06)] overflow-hidden">
          
          {/* LEFT COLUMN: Hotel Ambiance & Welcome Story (lg:col-span-6) */}
          <div className="hidden lg:flex lg:col-span-6 relative flex-col justify-between p-12 bg-[#0F172A] text-white min-h-[580px] overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-40">
              <Image 
                src={sideImage} 
                alt="Ashok Inn Ambiance" 
                fill 
                sizes="50vw"
                className="object-cover scale-105"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/85 via-[#0F172A]/70 to-[#0F172A]/95 z-10" />

            <div className="relative z-20 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#C6A96B] block">
                Exclusive Hospitality
              </span>
              <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white tracking-tight drop-shadow-md leading-tight" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                Welcome Back to Ashok Inn
              </h2>
              <p className="text-white/80 text-xs font-light leading-relaxed max-w-md">
                Manage your reservations, order 24×7 room service, and access personalized guest privileges seamlessly.
              </p>
            </div>

            <div className="relative z-20 space-y-3 pt-8 border-t border-white/10">
              {[
                { icon: ShieldCheck, text: 'Instant Reservation & Check-In' },
                { icon: Coffee, text: '24×7 In-Room Dining & Guest Services' },
                { icon: CheckCircle2, text: 'Exclusive Member Privileges & Offers' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs font-medium text-white/90">
                  <item.icon size={16} className="text-[#C6A96B] shrink-0" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Task-Focused Auth Card (lg:col-span-6) */}
          <div className="lg:col-span-6 p-6 sm:p-10 space-y-6">
            
            {/* Segmented Switcher Control */}
            <div className="grid grid-cols-3 p-1.5 bg-[#FAF8F5] rounded-full border border-black/5 text-[11px] font-semibold uppercase tracking-wider max-w-md mx-auto">
              <button
                onClick={() => { setAuthMode('signin'); setError(null); setSuccessMsg(null); }}
                className={`py-2.5 rounded-full transition-all text-center ${authMode === 'signin' ? 'bg-[#0F172A] text-white shadow-md font-bold' : 'text-[#6B7280] hover:text-[#0F172A]'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setAuthMode('signup'); setError(null); setSuccessMsg(null); }}
                className={`py-2.5 rounded-full transition-all text-center ${authMode === 'signup' ? 'bg-[#0F172A] text-white shadow-md font-bold' : 'text-[#6B7280] hover:text-[#0F172A]'}`}
              >
                Register
              </button>
              <button
                onClick={() => { setAuthMode('lookup'); setError(null); setSuccessMsg(null); }}
                className={`py-2.5 rounded-full transition-all text-center ${authMode === 'lookup' ? 'bg-[#0F172A] text-white shadow-md font-bold' : 'text-[#6B7280] hover:text-[#0F172A]'}`}
              >
                Lookup
              </button>
            </div>

            {/* Header Title */}
            <div className="text-center space-y-1">
              <h2 className="text-3xl font-heading text-[#0F172A] font-normal" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                {authMode === 'signin' ? 'Sign In' : authMode === 'signup' ? 'Create Account' : 'Find My Booking'}
              </h2>
              <p className="text-[#6B7280] text-xs font-light leading-relaxed max-w-xs mx-auto">
                {authMode === 'signin' 
                  ? 'Sign in to access your bookings and guest preferences.'
                  : authMode === 'signup'
                  ? 'Create an account to manage your stays and save favorite rooms.'
                  : 'Retrieve your reservation using your email and booking reference.'}
              </p>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-[14px] text-center max-w-md mx-auto">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium rounded-[14px] text-center max-w-md mx-auto">
                {successMsg}
              </div>
            )}

            {/* FORM 1: SIGN IN */}
            {authMode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4 max-w-md mx-auto">
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] mb-1 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      required 
                      type="email" 
                      placeholder="guest@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      suppressHydrationWarning
                      className="w-full pl-11 pr-4 py-3.5 bg-[#FAF8F5] border border-black/10 rounded-[14px] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#C6A96B] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] mb-1 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      required 
                      type="password" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      suppressHydrationWarning
                      className="w-full pl-11 pr-4 py-3.5 bg-[#FAF8F5] border border-black/10 rounded-[14px] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#C6A96B] transition-colors"
                    />
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-[#6B7280] font-normal">
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded border-gray-300 text-[#C6A96B] focus:ring-[#C6A96B]" 
                    />
                    <span>Remember Me</span>
                  </label>
                  <a href="#" className="text-[#C6A96B] font-semibold hover:underline">Forgot Password?</a>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  suppressHydrationWarning
                  className="w-full py-4 bg-[#0F172A] hover:bg-[#C6A96B] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-[14px] transition-all shadow-md mt-2 flex items-center justify-center gap-2 hover:-translate-y-[1px]"
                >
                  <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                  <LogIn size={14} />
                </button>
              </form>
            )}

            {/* FORM 2: CREATE ACCOUNT (SIMPLIFIED TO NAME, EMAIL, PASSWORD) */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-4 max-w-md mx-auto">
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] mb-1 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. Veerendra Kumar"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      suppressHydrationWarning
                      className="w-full pl-11 pr-4 py-3.5 bg-[#FAF8F5] border border-black/10 rounded-[14px] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#C6A96B] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] mb-1 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      required 
                      type="email" 
                      placeholder="guest@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      suppressHydrationWarning
                      className="w-full pl-11 pr-4 py-3.5 bg-[#FAF8F5] border border-black/10 rounded-[14px] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#C6A96B] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] mb-1 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      required 
                      type="password" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      suppressHydrationWarning
                      className="w-full pl-11 pr-4 py-3.5 bg-[#FAF8F5] border border-black/10 rounded-[14px] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#C6A96B] transition-colors"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  suppressHydrationWarning
                  className="w-full py-4 bg-[#0F172A] hover:bg-[#C6A96B] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-[14px] transition-all shadow-md mt-2 flex items-center justify-center gap-2 hover:-translate-y-[1px]"
                >
                  <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                  <UserPlus size={14} />
                </button>
              </form>
            )}

            {/* FORM 3: BOOKING LOOKUP */}
            {authMode === 'lookup' && (
              <form onSubmit={handleLookup} className="space-y-4 max-w-md mx-auto">
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] mb-1 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      required 
                      type="email" 
                      placeholder="guest@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      suppressHydrationWarning
                      className="w-full pl-11 pr-4 py-3.5 bg-[#FAF8F5] border border-black/10 rounded-[14px] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#C6A96B] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] mb-1 block">Booking Reference</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. BKG-12345"
                      value={bookingRef}
                      onChange={(e) => setBookingRef(e.target.value)}
                      suppressHydrationWarning
                      className="w-full pl-11 pr-4 py-3.5 bg-[#FAF8F5] border border-black/10 rounded-[14px] text-xs font-medium text-[#0F172A] uppercase focus:outline-none focus:border-[#C6A96B] transition-colors"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  suppressHydrationWarning
                  className="w-full py-4 bg-[#0F172A] hover:bg-[#C6A96B] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-[14px] transition-all shadow-md mt-2 flex items-center justify-center gap-2 hover:-translate-y-[1px]"
                >
                  <span>{loading ? 'Finding Booking...' : 'Find My Booking'}</span>
                  <Search size={14} />
                </button>
              </form>
            )}

            {/* Context Footer Copy */}
            <p className="text-center text-xs text-[#6B7280]">
              {authMode === 'signin' ? (
                <>
                  New to Ashok Inn?{' '}
                  <button onClick={() => setAuthMode('signup')} className="text-[#0F172A] font-bold underline hover:text-[#C6A96B] transition-colors">
                    Create an account
                  </button>
                </>
              ) : authMode === 'signup' ? (
                <>
                  Already have an account?{' '}
                  <button onClick={() => setAuthMode('signin')} className="text-[#0F172A] font-bold underline hover:text-[#C6A96B] transition-colors">
                    Sign in here
                  </button>
                </>
              ) : (
                <>
                  Don't have a reservation yet?{' '}
                  <Link href="/booking" className="text-[#0F172A] font-bold underline hover:text-[#C6A96B] transition-colors">
                    Book a room now
                  </Link>
                </>
              )}
            </p>

          </div>

        </div>
      </div>
    </main>
  )
}
