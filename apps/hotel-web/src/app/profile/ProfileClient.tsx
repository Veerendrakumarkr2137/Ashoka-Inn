'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  User as UserIcon, Mail, Phone, Calendar as CalendarIcon, MapPin, ShieldCheck,
  LogOut, Coffee, CreditCard, Clock, Heart, Award, Key, Save, CheckCircle2,
  ChevronRight, ArrowLeft, BedDouble, Bell, Settings
} from 'lucide-react'
import { logout } from '@/actions/auth'

interface BookingData {
  id: string
  bookingRef: string
  checkIn: Date
  checkOut: Date
  adults: number
  children: number
  totalAmount: number
  status: string
  roomName: string
  roomImage: string
  paidInFull: boolean
}

interface UserData {
  id: string
  name: string
  email: string
  phone: string | null
  createdAt: Date
}

interface ProfileClientProps {
  user: UserData
  upcomingBookings: BookingData[]
  pastBookings: BookingData[]
  currentBooking: BookingData | null
}

export function ProfileClient({ user, upcomingBookings, pastBookings, currentBooking }: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'personal' | 'security'>('overview')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Personal Info Form State
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    dob: '1990-05-15',
    address: 'PB Road, Davanagere, KA 577002'
  })

  // Password Form State
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirmPass: ''
  })
  const [passSuccess, setPassSuccess] = useState(false)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }, 800)
  }

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault()
    setPassSuccess(true)
    setPasswords({ current: '', newPass: '', confirmPass: '' })
    setTimeout(() => setPassSuccess(false), 3000)
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full border border-emerald-200">🟢 CONFIRMED</span>
      case 'CHECKED_IN':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 text-[11px] font-bold rounded-full border border-blue-200">🔵 CHECKED IN</span>
      case 'CHECKED_OUT':
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-[11px] font-bold rounded-full border border-gray-200">⚪ CHECKED OUT</span>
      case 'CANCELLED':
        return <span className="px-3 py-1 bg-rose-100 text-rose-800 text-[11px] font-bold rounded-full border border-rose-200">🔴 CANCELLED</span>
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-[11px] font-bold rounded-full border border-gray-200">{status}</span>
    }
  }

  return (
    <main className="bg-[#FAF8F5] min-h-screen pb-32 font-body selection:bg-[#C6A96B] selection:text-white">

      {/* 1. LUXURY HERO HEADER */}
      <div className="relative bg-[#0F172A] text-white pt-32 pb-20 px-6 sm:px-12 overflow-hidden border-b border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C6A96B] rounded-full blur-[140px] opacity-20 -mr-24 -mt-24 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white/80 font-semibold mb-6">
            <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
              <ArrowLeft size={13} /> Home
            </Link>
            <span>/</span>
            <span className="text-[#C6A96B]">Guest Portal</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#C6A96B] block mb-2">
                Ashok Privilege Member
              </span>
              <h1 className="text-4xl sm:text-5xl font-heading text-white font-normal" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                My Account
              </h1>
              <p className="text-white/70 text-xs sm:text-sm font-light mt-1 max-w-lg">
                Manage your reservations, personal preferences, and exclusive guest privileges.
              </p>
            </div>

            <form action={async () => { await logout() }}>
              <button 
                type="submit" 
                suppressHydrationWarning
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-[14px] transition-all border border-white/15 backdrop-blur-md"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 -mt-8 relative z-20 space-y-12">

        {/* 2. PROFILE SUMMARY CARD & QUICK STATS GRID */}
        <div className="bg-white rounded-[28px] p-8 border border-black/5 shadow-xl space-y-8">
          
          {/* User Profile Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-black/5">
            <div className="flex items-center gap-5 text-center sm:text-left">
              <div className="w-20 h-20 rounded-[22px] bg-[#0F172A] border-2 border-[#C6A96B] flex items-center justify-center text-[#C6A96B] text-3xl font-heading font-bold shadow-md shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0F172A] mb-1" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                  {user.name}
                </h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[#6B7280]">
                  <span className="flex items-center gap-1.5"><Mail size={14} className="text-[#C6A96B]" /> {user.email}</span>
                  {user.phone && <span className="flex items-center gap-1.5"><Phone size={14} className="text-[#C6A96B]" /> {user.phone}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-5 py-2.5 bg-[#FAF8F5] border border-black/5 rounded-[16px] text-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] block">Member Since</span>
                <span className="text-xs font-bold text-[#0F172A]">{memberSince}</span>
              </div>
              <button 
                onClick={() => setActiveTab('personal')}
                className="px-5 py-2.5 bg-[#0F172A] hover:bg-[#C6A96B] text-white text-xs font-bold uppercase tracking-wider rounded-[14px] transition-all shadow-sm"
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => setActiveTab('bookings')} 
              className={`p-5 rounded-[20px] border text-left transition-all group ${activeTab === 'bookings' ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-[#FAF8F5] hover:bg-white border-black/5 text-[#0F172A]'}`}
            >
              <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center mb-3 transition-colors ${activeTab === 'bookings' ? 'bg-[#C6A96B] text-white' : 'bg-white text-[#C6A96B] shadow-sm'}`}>
                <BedDouble size={20} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider block ${activeTab === 'bookings' ? 'text-white/70' : 'text-[#6B7280]'}`}>Upcoming Stay</span>
              <span className="text-xl font-bold font-heading">{upcomingBookings.length} {upcomingBookings.length === 1 ? 'Booking' : 'Bookings'}</span>
            </button>

            <button 
              onClick={() => setActiveTab('bookings')} 
              className="p-5 rounded-[20px] border border-black/5 bg-[#FAF8F5] hover:bg-white text-[#0F172A] text-left transition-all group"
            >
              <div className="w-10 h-10 rounded-[14px] bg-white text-[#C6A96B] shadow-sm flex items-center justify-center mb-3">
                <Clock size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block">Past Stays</span>
              <span className="text-xl font-bold font-heading">{pastBookings.length} {pastBookings.length === 1 ? 'Visit' : 'Visits'}</span>
            </button>

            <div className="p-5 rounded-[20px] border border-black/5 bg-[#FAF8F5] text-[#0F172A] text-left">
              <div className="w-10 h-10 rounded-[14px] bg-white text-[#C6A96B] shadow-sm flex items-center justify-center mb-3">
                <Heart size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block">Saved Rooms</span>
              <span className="text-xl font-bold font-heading">2 Saved</span>
            </div>

            <div className="p-5 rounded-[20px] border border-black/5 bg-[#FAF8F5] text-[#0F172A] text-left">
              <div className="w-10 h-10 rounded-[14px] bg-white text-[#C6A96B] shadow-sm flex items-center justify-center mb-3">
                <Award size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block">Reward Points</span>
              <span className="text-xl font-bold font-heading">500 Points</span>
            </div>
          </div>

        </div>

        {/* ACTIVE CHECKED-IN BANNER (If any) */}
        {currentBooking && (
          <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white rounded-[28px] p-8 shadow-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-[18px] bg-[#C6A96B] flex items-center justify-center text-white shrink-0 shadow-lg">
                <ShieldCheck size={28} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C6A96B] block">Active Guest Stay</span>
                <h3 className="text-2xl font-heading font-normal" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                  You are currently checked in!
                </h3>
                <p className="text-xs text-white/70 font-light mt-0.5">
                  Ref: {currentBooking.bookingRef} • Room Category: {currentBooking.roomName}
                </p>
              </div>
            </div>

            <Link
              href="/restaurant/room-service"
              className="px-7 py-3.5 bg-[#C6A96B] hover:bg-[#B8913A] text-white text-xs font-bold uppercase tracking-widest rounded-[14px] transition-all shadow-md flex items-center gap-2 shrink-0"
            >
              <Coffee size={16} />
              <span>Order Room Service</span>
            </Link>
          </div>
        )}

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-3 border-b border-black/8 pb-4">
          {[
            { id: 'overview', label: 'My Bookings' },
            { id: 'personal', label: 'Personal Information' },
            { id: 'security', label: 'Account & Security' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab.id ? 'bg-[#0F172A] text-white shadow-md' : 'bg-white hover:bg-[#FAF8F5] text-[#6B7280] border border-black/5'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: MY BOOKINGS (UPCOMING & PAST ROOM CARDS) */}
        {(activeTab === 'overview' || activeTab === 'bookings') && (
          <div className="space-y-10">
            
            {/* Upcoming Bookings */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-heading text-[#0F172A]" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                  Upcoming Reservations
                </h3>
                <Link href="/booking" className="text-xs font-bold text-[#C6A96B] uppercase tracking-wider hover:underline">
                  + Book Another Room
                </Link>
              </div>

              {upcomingBookings.length === 0 ? (
                <div className="bg-white rounded-[28px] p-12 text-center border border-black/5 shadow-sm space-y-4">
                  <div className="w-16 h-16 bg-[#FAF8F5] rounded-full flex items-center justify-center mx-auto text-[#C6A96B]">
                    <BedDouble size={28} />
                  </div>
                  <h4 className="text-xl font-bold text-[#0F172A]" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>No Upcoming Reservations</h4>
                  <p className="text-xs text-[#6B7280] max-w-sm mx-auto font-light">
                    You have no active stays scheduled. Plan your upcoming trip to Davanagere with Ashok Inn.
                  </p>
                  <Link href="/booking" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#0F172A] text-white text-xs font-bold uppercase tracking-widest rounded-[14px] hover:bg-[#C6A96B] transition-all shadow-md">
                    <span>Explore Available Rooms</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {upcomingBookings.map(b => (
                    <div key={b.id} className="bg-white rounded-[28px] border border-black/5 shadow-md overflow-hidden hover:shadow-xl transition-all flex flex-col justify-between">
                      <div className="relative h-56 w-full bg-[#0F172A] overflow-hidden">
                        <Image src={b.roomImage || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2874&auto=format&fit=crop'} alt={b.roomName || 'Ashok Room'} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-90" />
                        
                        {/* Gradient Mask Overlay for Maximum Font Visibility & Legibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent z-0" />

                        <div className="absolute top-4 left-4 z-10">
                          {getStatusBadge(b.status)}
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 z-10 text-white space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-slate-900/90 text-[#C6A96B] px-2.5 py-1 rounded-lg border border-[#C6A96B]/40 backdrop-blur-md shadow-sm font-mono">
                              REF: {b.bookingRef}
                            </span>
                          </div>
                          <h4 className="text-2xl font-extrabold text-white drop-shadow-md" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                            {b.roomName}
                          </h4>
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-xs border-b border-black/5 pb-4">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-[#6B7280] block">Check-in</span>
                            <span className="font-bold text-[#0F172A]" suppressHydrationWarning>{new Date(b.checkIn).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase text-[#6B7280] block">Check-out</span>
                            <span className="font-bold text-[#0F172A]" suppressHydrationWarning>{new Date(b.checkOut).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-[#6B7280] block">Total Amount</span>
                            <span className="text-lg font-bold text-[#0F172A]" suppressHydrationWarning>₹{b.totalAmount.toLocaleString()}</span>
                          </div>
                          <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 flex items-center gap-1">
                            <CreditCard size={12} /> {b.paidInFull ? 'Paid in Full' : 'Pay at Hotel'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Past Stays */}
            {pastBookings.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-black/8">
                <h3 className="text-2xl font-heading text-[#0F172A]" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                  Past Visits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pastBookings.map(b => (
                    <div key={b.id} className="bg-white rounded-[22px] p-6 border border-black/5 shadow-sm flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-[#0F172A]">{b.roomName}</span>
                          {getStatusBadge(b.status)}
                        </div>
                        <p className="text-xs text-[#6B7280]" suppressHydrationWarning>
                          {new Date(b.checkIn).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} – {new Date(b.checkOut).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-[#0F172A]" suppressHydrationWarning>₹{b.totalAmount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: PERSONAL INFORMATION */}
        {activeTab === 'personal' && (
          <div className="bg-white rounded-[28px] p-8 sm:p-10 border border-black/5 shadow-xl space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C6A96B] block">Personal Details</span>
              <h3 className="text-3xl font-heading text-[#0F172A]" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                Guest Information
              </h3>
            </div>

            {saveSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-[14px] flex items-center gap-2">
                <CheckCircle2 size={16} /> Profile changes saved successfully.
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3.5 bg-[#FAF8F5] border border-black/10 rounded-[14px] text-xs font-semibold focus:outline-none focus:border-[#C6A96B]" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3.5 bg-[#FAF8F5] border border-black/10 rounded-[14px] text-xs font-semibold focus:outline-none focus:border-[#C6A96B]" 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-1.5">Phone Number</label>
                  <input 
                    type="tel" 
                    value={formData.phone} 
                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3.5 bg-[#FAF8F5] border border-black/10 rounded-[14px] text-xs font-semibold focus:outline-none focus:border-[#C6A96B]" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-1.5">Date of Birth (Optional)</label>
                  <input 
                    type="date" 
                    value={formData.dob} 
                    onChange={e => setFormData(prev => ({ ...prev, dob: e.target.value }))}
                    className="w-full px-4 py-3.5 bg-[#FAF8F5] border border-black/10 rounded-[14px] text-xs font-semibold focus:outline-none focus:border-[#C6A96B]" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-1.5">Residential Address</label>
                <input 
                  type="text" 
                  value={formData.address} 
                  onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-4 py-3.5 bg-[#FAF8F5] border border-black/10 rounded-[14px] text-xs font-semibold focus:outline-none focus:border-[#C6A96B]" 
                />
              </div>

              <button 
                type="submit" 
                disabled={isSaving}
                className="px-8 py-4 bg-[#0F172A] hover:bg-[#C6A96B] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-[14px] transition-all shadow-md inline-flex items-center gap-2"
              >
                <Save size={14} />
                <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: ACCOUNT & SECURITY */}
        {activeTab === 'security' && (
          <div className="space-y-8">
            {/* Change Password Card */}
            <div className="bg-white rounded-[28px] p-8 sm:p-10 border border-black/5 shadow-xl space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C6A96B] block">Security</span>
                <h3 className="text-3xl font-heading text-[#0F172A]" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                  Change Password
                </h3>
              </div>

              {passSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-[14px] flex items-center gap-2">
                  <CheckCircle2 size={16} /> Password updated successfully.
                </div>
              )}

              <form onSubmit={handleSavePassword} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-1.5">Current Password</label>
                  <input 
                    type="password" 
                    value={passwords.current}
                    onChange={e => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                    className="w-full px-4 py-3.5 bg-[#FAF8F5] border border-black/10 rounded-[14px] text-xs font-semibold focus:outline-none focus:border-[#C6A96B]" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-1.5">New Password</label>
                  <input 
                    type="password" 
                    value={passwords.newPass}
                    onChange={e => setPasswords(prev => ({ ...prev, newPass: e.target.value }))}
                    className="w-full px-4 py-3.5 bg-[#FAF8F5] border border-black/10 rounded-[14px] text-xs font-semibold focus:outline-none focus:border-[#C6A96B]" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-1.5">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={passwords.confirmPass}
                    onChange={e => setPasswords(prev => ({ ...prev, confirmPass: e.target.value }))}
                    className="w-full px-4 py-3.5 bg-[#FAF8F5] border border-black/10 rounded-[14px] text-xs font-semibold focus:outline-none focus:border-[#C6A96B]" 
                    required 
                  />
                </div>

                <button 
                  type="submit" 
                  className="px-8 py-4 bg-[#0F172A] hover:bg-[#C6A96B] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-[14px] transition-all shadow-md inline-flex items-center gap-2"
                >
                  <Key size={14} />
                  <span>Update Password</span>
                </button>
              </form>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white rounded-[28px] p-8 sm:p-10 border border-black/5 shadow-xl space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C6A96B] block">Preferences</span>
                <h3 className="text-3xl font-heading text-[#0F172A]" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                  Notification Settings
                </h3>
              </div>

              <div className="space-y-4 max-w-lg">
                {[
                  { title: 'Booking Confirmations & Receipts', desc: 'Receive instant email and SMS receipts for all your stay reservations.' },
                  { title: 'Special Offers & Dining Invitations', desc: 'Get exclusive seasonal room discounts and chef dining recommendations.' },
                  { title: 'Pre-Arrival Concierge Updates', desc: 'Receive helpful travel reminders 24 hours prior to check-in.' }
                ].map((item, idx) => (
                  <label key={idx} className="flex items-start gap-3.5 p-4 rounded-[16px] bg-[#FAF8F5] border border-black/5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="mt-0.5 rounded text-[#C6A96B] focus:ring-[#C6A96B]" />
                    <div>
                      <span className="text-xs font-bold text-[#0F172A] block">{item.title}</span>
                      <span className="text-[11px] text-[#6B7280] font-light">{item.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

    </main>
  )
}
