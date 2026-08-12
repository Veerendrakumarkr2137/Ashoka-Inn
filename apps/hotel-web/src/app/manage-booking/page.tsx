'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Key, Mail, Search, ArrowLeft } from 'lucide-react'
import { loginWithBookingRef } from '@/actions/auth'

export default function ManageBookingPage() {
  const [email, setEmail] = useState('')
  const [bookingRef, setBookingRef] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    <main className="bg-[#FAF8F5] min-h-screen flex flex-col justify-between font-body selection:bg-[#C6A96B] selection:text-white">
      
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="w-full max-w-md space-y-6">

          {/* Breadcrumb pill */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-black/5 text-xs text-[#6B7280] font-semibold mb-2 shadow-sm">
              <Link href="/" className="hover:text-[#0F172A] flex items-center gap-1 transition-colors">
                <ArrowLeft size={13} /> Home
              </Link>
              <span>/</span>
              <span className="text-[#C6A96B]">Manage Booking</span>
            </div>
          </div>

          {/* Luxury Card */}
          <div className="bg-white rounded-[28px] shadow-[0_24px_50px_rgba(0,0,0,0.06)] border border-black/5 p-8 md:p-10 space-y-6">
            
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-[#FAF8F5] rounded-[18px] flex items-center justify-center mx-auto border border-black/5 text-[#C6A96B]">
                <Search size={24} />
              </div>
              <h2 className="text-3xl font-heading text-[#0F172A] font-normal" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                Manage Your Reservation
              </h2>
              <p className="text-[#6B7280] text-xs font-light leading-relaxed">
                Retrieve your stay details using your email address and booking reference number.
              </p>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-[14px] text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLookup} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    required 
                    type="email" 
                    placeholder="guest@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    suppressHydrationWarning
                    className="w-full pl-11 pr-4 py-3.5 bg-[#FAF8F5] border border-black/10 rounded-[14px] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#C6A96B] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-1.5 block">Booking Reference Number</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. BKG-12345"
                    value={bookingRef}
                    onChange={(e) => setBookingRef(e.target.value)}
                    suppressHydrationWarning
                    className="w-full pl-11 pr-4 py-3.5 bg-[#FAF8F5] border border-black/10 rounded-[14px] text-xs font-semibold text-[#0F172A] uppercase focus:outline-none focus:border-[#C6A96B] transition-colors"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                suppressHydrationWarning
                className="w-full py-4 bg-[#0F172A] hover:bg-[#C6A96B] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-[14px] transition-all shadow-md mt-2 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Retrieving Booking...' : 'Retrieve Booking'}</span>
                <Search size={14} />
              </button>
            </form>

          </div>

          <p className="text-center text-xs text-[#6B7280]">
            Looking for guest sign in?{' '}
            <Link href="/login" className="text-[#0F172A] font-bold hover:text-[#C6A96B] underline transition-colors">
              Sign in to your account
            </Link>
          </p>

        </div>
      </div>
    </main>
  )
}
