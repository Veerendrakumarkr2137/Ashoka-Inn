'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, ArrowRight, CheckCircle2, Search, ArrowLeft, Loader2, ShieldCheck, Coffee, Wifi, Phone, Mail, AlertTriangle } from 'lucide-react'
import { Button } from '@hospitality-os/ui/src/components/Button'
import { checkAvailability, createBooking } from '@/actions/booking'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { getCategoryImages } from '@/config/siteImages'
import { generateVoucherHtml } from '@/lib/voucherReceipt'

type Step = 1 | 2 | 3 | 4

export function BookingEngine() {
  const searchParams = useSearchParams()
  const initialCheckIn = searchParams.get('checkIn') || ''
  const initialCheckOut = searchParams.get('checkOut') || ''
  const preselectedRoomSlug = searchParams.get('room') || searchParams.get('type') || ''
  
  const rawGuests = searchParams.get('guests')
  const rawAdults = searchParams.get('adults')
  const rawChildren = searchParams.get('children')

  const initialGuests = rawGuests 
    ? parseInt(rawGuests, 10) 
    : (rawAdults ? parseInt(rawAdults, 10) + (rawChildren ? parseInt(rawChildren, 10) : 0) : 2)

  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [roomUnavailableNotice, setRoomUnavailableNotice] = useState<string | null>(null)
  
  // Search State
  const [checkIn, setCheckIn] = useState<string>(initialCheckIn)
  const [checkOut, setCheckOut] = useState<string>(initialCheckOut)
  const [guests, setGuests] = useState<number>(initialGuests)

  // Results State
  const [availableCategories, setAvailableCategories] = useState<any[]>([])
  
  // Selection State
  const [selectedCategory, setSelectedCategory] = useState<any>(null)

  // Guest Details State
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')

  // Confirmation State
  const [bookingRef, setBookingRef] = useState('')
  const [copied, setCopied] = useState(false)

  // Fetch availability on mount if preselected room or dates exist
  const handleSearch = async () => {
    if (!checkIn || !checkOut) {
      setError('Please select check-in and check-out dates.')
      return
    }
    if (new Date(checkIn) >= new Date(checkOut)) {
      setError('Check-out must be after check-in.')
      return
    }

    setError(null)
    setRoomUnavailableNotice(null)
    setLoading(true)
    
    const res = await checkAvailability(checkIn, checkOut, guests)
    
    setLoading(false)
    if (res.success && res.data) {
      setAvailableCategories(res.data)

      // Industry-Standard Preselected Room Logic
      if (preselectedRoomSlug) {
        const matched = res.data.find((c: any) => 
          c.id === preselectedRoomSlug || 
          c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') === preselectedRoomSlug
        )

        if (matched) {
          // Available -> Instantly advance straight to Guest Details (Step 3)!
          setSelectedCategory(matched)
          setStep(3)
          return
        } else {
          // Room Sold Out -> Show notice and list alternative rooms
          setRoomUnavailableNotice('Your pre-selected room is unavailable for the selected dates. Please choose from recommended available options below:')
          setStep(2)
          return
        }
      }

      // General Search without preselected room -> Go to Room List
      setStep(2)
    } else {
      setError(res.error || 'Failed to search for rooms')
    }
  }

  // Auto-trigger search if url params are present on mount
  useEffect(() => {
    if (initialCheckIn && initialCheckOut && step === 1 && !loading && availableCategories.length === 0) {
      handleSearch()
    }
  }, [initialCheckIn, initialCheckOut])

  // Fully-Booked Convenience Notice State
  const [fullyBookedData, setFullyBookedData] = useState<{
    convenienceMessage: string
    contactInfo: { phone: string; email: string }
    availableAlternatives: Array<{ id: string; name: string; basePrice: number; capacity: number; availableRoomsCount: number }>
  } | null>(null)

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFullyBookedData(null)
    setLoading(true)

    const res = await createBooking({
      checkIn,
      checkOut,
      categoryId: selectedCategory?.id || availableCategories[0]?.id || 'default-room',
      guests,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests
    })

    setLoading(false)
    if (res.success && res.bookingRef) {
      setBookingRef(res.bookingRef)
      setStep(4)
    } else if (res.isFullyBooked) {
      setFullyBookedData({
        convenienceMessage: res.convenienceMessage || 'Room is fully booked for your selected dates.',
        contactInfo: res.contactInfo || { phone: '+91 80 1234 5678', email: 'reservations@ashokinn.com' },
        availableAlternatives: res.availableAlternatives || []
      })
    } else {
      setError(res.error || 'Failed to create booking')
    }
  }

  const handleDownloadVoucherPDF = () => {
    const ref = bookingRef || 'BKG-ASHOK-9842'
    const nights = getNights()
    const totalPrice = currentRoomInfo.price * nights
    const gst = Math.round(totalPrice * 0.12)
    const grandTotal = totalPrice + gst
    const checkInDate = checkIn ? new Date(checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Jan 15, 2026'
    const checkOutDate = checkOut ? new Date(checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Jan 17, 2026'

    const printWin = window.open('', '_blank', 'width=850,height=1000')
    if (printWin) {
      const htmlContent = generateVoucherHtml({
        ref,
        guestName,
        guestEmail,
        guestPhone,
        roomName: currentRoomInfo.name,
        maxGuests: currentRoomInfo.maxGuests,
        checkInDate,
        checkOutDate,
        nights,
        totalPrice,
        gst,
        grandTotal
      })
      printWin.document.write(htmlContent)
      printWin.document.close()
      setTimeout(() => {
        printWin.focus()
        printWin.print()
      }, 300)
    }
  }

  const getNights = () => {
    if (!checkIn || !checkOut) return 1
    const diff = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 1
  }

  // Helper: Get Clean Room Display Name, Thumbnail, and Max Capacity (Fixes Database ID & Occupancy Overbooking bugs!)
  const getDisplayRoomInfo = () => {
    if (selectedCategory) {
      return {
        name: selectedCategory.name,
        price: selectedCategory.basePrice,
        image: getCategoryImages(selectedCategory)[0],
        ac: selectedCategory.hasAC ?? true,
        maxGuests: selectedCategory.capacity || 2,
      }
    }
    
    // If preselected slug is passed (e.g. deluxe-non-ac or cms0...)
    if (preselectedRoomSlug) {
      if (preselectedRoomSlug.includes('non-ac')) {
        return { name: 'Deluxe Non-AC Room', price: 2499, image: '/images/rooms/deluxe-non-ac.jpg', ac: false, maxGuests: 2 }
      }
      if (preselectedRoomSlug.includes('superior')) {
        return { name: 'Superior AC Room', price: 3499, image: '/images/rooms/superior-ac/f87a83c1-6a12-4a70-9ab4-ed44f587ebb5.png', ac: true, maxGuests: 2 }
      }
      if (preselectedRoomSlug.includes('king') || preselectedRoomSlug.includes('suite')) {
        return { name: 'King Suite Lounge', price: 5499, image: '/images/rooms/king-suite/ChatGPT Image Jul 28, 2026, 08_31_17 PM.png', ac: true, maxGuests: 3 }
      }
      if (preselectedRoomSlug.includes('family')) {
        return { name: 'Executive Family AC Room', price: 4499, image: '/images/rooms/family-ac/ChatGPT Image Jul 28, 2026, 08_50_09 PM.png', ac: true, maxGuests: 4 }
      }
    }

    // Default fallback
    return { name: 'Deluxe Room', price: 3500, image: '/images/rooms/king-suite/ChatGPT Image Jul 28, 2026, 08_31_17 PM.png', ac: true, maxGuests: 2 }
  }

  const currentRoomInfo = getDisplayRoomInfo()

  // Enforce Max Capacity Clamp when room is preselected
  useEffect(() => {
    if (preselectedRoomSlug && guests > currentRoomInfo.maxGuests) {
      setGuests(currentRoomInfo.maxGuests)
      setRoomUnavailableNotice(`Note: Maximum occupancy for ${currentRoomInfo.name} is ${currentRoomInfo.maxGuests} guests. Guests count has been adjusted to ${currentRoomInfo.maxGuests}.`)
    }
  }, [preselectedRoomSlug])

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-[28px] shadow-[0_32px_64px_rgba(0,0,0,0.06)] border border-black/5 overflow-hidden">
      
      {/* 1. FORM HEADER TITLE (Pure White High Contrast) & 6. LABELED PROGRESS STEPS HEADER */}
      <div className="bg-[#0F172A] px-6 sm:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C6A96B] block mb-0.5">
            Hotel Ashok Inn
          </span>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-white tracking-tight">Complete Your Reservation</h2>
        </div>

        {/* Labeled Progress Steps */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${step >= 1 ? 'bg-[#C6A96B] text-white' : 'bg-white/10 text-white/50'}`}>1</span>
            <span className={step >= 1 ? 'text-white font-semibold hidden md:inline' : 'text-white/40 hidden md:inline'}>Dates & Guests</span>
          </div>
          
          <div className={`w-6 h-[2px] ${step >= 3 ? 'bg-[#C6A96B]' : 'bg-white/15'}`} />

          <div className="flex items-center gap-1.5">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${step >= 3 ? 'bg-[#C6A96B] text-white' : 'bg-white/10 text-white/50'}`}>2</span>
            <span className={step >= 3 ? 'text-white font-semibold hidden md:inline' : 'text-white/40 hidden md:inline'}>Guest Details</span>
          </div>

          <div className={`w-6 h-[2px] ${step >= 4 ? 'bg-[#C6A96B]' : 'bg-white/15'}`} />

          <div className="flex items-center gap-1.5">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${step >= 4 ? 'bg-[#C6A96B] text-white' : 'bg-white/10 text-white/50'}`}>3</span>
            <span className={step >= 4 ? 'text-white font-semibold hidden md:inline' : 'text-white/40 hidden md:inline'}>Confirmation</span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-10">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-[14px] border border-red-100 text-sm">
            {error}
          </div>
        )}

        {/* STEP 1: Search Dates & Sticky Summary Grid */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: Date & Guest Form */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Pre-Selected Room Header Bar with Room Specs Line */}
                {preselectedRoomSlug && (
                  <div className="p-4 rounded-[20px] bg-[#FAF8F5] border border-black/5 flex items-center gap-4 shadow-xs">
                    <div className="relative w-20 h-16 rounded-[12px] overflow-hidden shrink-0 bg-gray-200">
                      <Image src={currentRoomInfo.image || '/images/rooms/deluxe-non-ac.jpg'} alt={currentRoomInfo.name} fill sizes="100px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C6A96B]">Selected Room ✓</span>
                      </div>
                      <h4 className="text-base font-bold font-heading text-[#0F172A] truncate">
                        {currentRoomInfo.name}
                      </h4>
                      {/* 8. ROOM SPECIFICATIONS LINE */}
                      <span className="text-xs text-[#6B7280]">
                        Max {currentRoomInfo.maxGuests} Guests • {currentRoomInfo.name.includes('Suite') ? '1 King Bed' : '1 Queen Bed'} • ₹{currentRoomInfo.price.toLocaleString()} / night
                      </span>
                    </div>
                  </div>
                )}

                <h3 className="text-2xl font-heading text-[#0F172A]">Select your travel dates</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 6. CLEAR DATE PLACEHOLDERS */}
                  <div className="space-y-2">
                    <label htmlFor="engine-check-in" className="text-xs font-bold text-[#6B7280] uppercase tracking-wider cursor-pointer">Choose Check-in Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C6A96B]" size={18} />
                      <input 
                        id="engine-check-in"
                        name="checkIn"
                        type="date" 
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        suppressHydrationWarning
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-[14px] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C6A96B] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="engine-check-out" className="text-xs font-bold text-[#6B7280] uppercase tracking-wider cursor-pointer">Choose Check-out Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C6A96B]" size={18} />
                      <input 
                        id="engine-check-out"
                        name="checkOut"
                        type="date" 
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || new Date().toISOString().split('T')[0]}
                        suppressHydrationWarning
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-[14px] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C6A96B] focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* 2 & 7. INTENTIONAL GUEST SELECTOR COUNTER WITH [-] [+] BUTTONS */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Adults & Guests</label>
                    <span className="text-[11px] text-[#C6A96B] font-semibold">Max: {currentRoomInfo.maxGuests} Guests</span>
                  </div>
                  
                  <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-[14px] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users size={18} className="text-[#C6A96B]" />
                      <span className="text-xs font-bold text-[#0F172A]">{guests} {guests === 1 ? 'Adult' : 'Adults'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                        disabled={guests <= 1}
                        suppressHydrationWarning
                        className="w-8 h-8 rounded-full bg-white border border-gray-300 disabled:opacity-40 flex items-center justify-center text-xs font-bold text-[#0F172A] hover:bg-gray-100 transition-all shadow-xs"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-[#0F172A] w-4 text-center">{guests}</span>
                      <button
                        type="button"
                        onClick={() => setGuests(prev => Math.min(currentRoomInfo.maxGuests, prev + 1))}
                        disabled={guests >= currentRoomInfo.maxGuests}
                        suppressHydrationWarning
                        className="w-8 h-8 rounded-full bg-white border border-gray-300 disabled:opacity-40 flex items-center justify-center text-xs font-bold text-[#0F172A] hover:bg-gray-100 transition-all shadow-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* 8. FULL WIDTH BUTTON ALIGNMENT & 5. TRUST INDICATORS */}
                <div className="pt-2 space-y-3">
                  <Button 
                    size="xl" 
                    onClick={handleSearch} 
                    isLoading={loading} 
                    rightIcon={<ArrowRight size={16} />}
                    className="w-full py-4 bg-[#0F172A] hover:bg-[#C6A96B] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-[14px] transition-all shadow-md"
                  >
                    Check Availability & Continue
                  </Button>

                  <div className="text-center text-[11px] text-[#6B7280] font-medium flex items-center justify-center gap-2">
                    <span>🔒 Secure Reservation</span>
                    <span>•</span>
                    <span>No Hidden Charges</span>
                    <span>•</span>
                    <span>Instant Confirmation</span>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: STICKY BOOKING SUMMARY CARD (Bugs 3 & 4 Fixed!) */}
              <div className="lg:col-span-5 bg-[#FAF8F5] rounded-[24px] border border-black/5 p-6 space-y-5 sticky top-8">
                <h4 className="font-heading font-semibold text-lg text-[#0F172A] border-b border-black/8 pb-3">
                  Booking Summary
                </h4>

                {/* Room Thumbnail & Title */}
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-16 rounded-[14px] overflow-hidden shrink-0 bg-gray-200 shadow-sm">
                    <Image src={currentRoomInfo.image || '/images/rooms/deluxe-non-ac.jpg'} alt={currentRoomInfo.name} fill sizes="120px" className="object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#C6A96B] uppercase tracking-wider font-bold block mb-0.5">Ashok Inn</span>
                    <h5 className="font-heading font-bold text-base text-[#0F172A] leading-tight">{currentRoomInfo.name}</h5>
                    <span className="text-xs text-[#6B7280]">₹{currentRoomInfo.price.toLocaleString()} / night</span>
                  </div>
                </div>

                {/* 3. DATES & GUESTS DYNAMIC DISPLAY */}
                <div className="pt-3 border-t border-black/5 space-y-2 text-xs text-[#0F172A]">
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Check-In</span>
                    <span className="font-semibold text-[#0F172A]">{checkIn ? new Date(checkIn).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : '--'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Check-Out</span>
                    <span className="font-semibold text-[#0F172A]">{checkOut ? new Date(checkOut).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : '--'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Guests</span>
                    <span className="font-semibold text-[#0F172A]">{guests} {guests === 1 ? 'Adult' : 'Adults'}</span>
                  </div>
                </div>

                {/* Inclusions */}
                <div className="pt-3 border-t border-black/5 space-y-2 text-xs text-[#0F172A]">
                  <div className="flex items-center gap-2">
                    <Coffee size={14} className="text-[#C6A96B]" />
                    <span>Complimentary CP Breakfast Included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wifi size={14} className="text-[#C6A96B]" />
                    <span>High-Speed Wi-Fi Access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-[#C6A96B]" />
                    <span>Free Cancellation up to 24h prior</span>
                  </div>
                </div>

                {/* 4. DYNAMIC MULTI-NIGHT PRICE BREAKDOWN */}
                <div className="pt-4 border-t border-black/5 space-y-2 text-xs">
                  <div className="flex justify-between text-[#6B7280]">
                    <span>Rate Calculation</span>
                    <span className="font-semibold text-[#0F172A]">₹{currentRoomInfo.price.toLocaleString()} × {getNights()} Night(s)</span>
                  </div>
                  <div className="flex justify-between text-[#6B7280]">
                    <span>Taxes & Fees</span>
                    <span className="font-semibold text-emerald-600">Included</span>
                  </div>
                </div>

                {/* Total Estimate */}
                <div className="pt-4 border-t border-black/8 flex items-baseline justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Estimated Total</span>
                  <span className="text-2xl font-bold font-heading text-[#0F172A]">₹{(currentRoomInfo.price * getNights()).toLocaleString()}</span>
                </div>

              </div>

            </div>

          </motion.div>
        )}

        {/* STEP 2: Select Alternative Room (Displayed only if sold out or general search) */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {roomUnavailableNotice && (
              <div className="p-5 rounded-[16px] bg-amber-50 border border-amber-200 text-amber-900 text-sm font-medium flex items-center gap-3">
                <span className="text-xl">⚠️</span>
                <span>{roomUnavailableNotice}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-heading text-[#0F172A]">Available Rooms</h3>
              <button onClick={() => setStep(1)} className="text-[#6B7280] hover:text-[#0F172A] text-sm font-medium flex items-center gap-1">
                <ArrowLeft size={16} /> Edit Search
              </button>
            </div>

            {availableCategories.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-[16px] border border-gray-200">
                <p className="text-lg text-[#0F172A] font-medium mb-2">No rooms available</p>
                <p className="text-[#6B7280]">Please try different dates or fewer guests.</p>
                <Button variant="outline" className="mt-6" onClick={() => setStep(1)}>Modify Search</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {availableCategories.map(category => {
                  const roomImages = getCategoryImages(category)
                  const roomImg = roomImages[0]
                  const categoryLabel = category.name.toLowerCase().includes('suite')
                    ? 'LUXURY COLLECTION'
                    : category.hasAC
                    ? 'AIR-CONDITIONED COMFORT'
                    : 'ESSENTIAL COMFORT'

                  return (
                    <div key={category.id} className="flex flex-col sm:flex-row gap-6 p-6 rounded-[24px] border border-black/5 hover:border-[#C6A96B] hover:shadow-lg transition-all group bg-white">
                      <div className="relative w-full sm:w-56 h-40 rounded-[16px] overflow-hidden shrink-0 bg-gray-100 shadow-sm">
                        <Image 
                          src={roomImg} 
                          alt={category.name} 
                          fill 
                          sizes="(max-width: 1024px) 100vw, 300px"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex justify-between items-start mb-1.5">
                            <span className="text-[10px] font-bold text-[#C6A96B] uppercase tracking-[0.25em]">
                              {categoryLabel}
                            </span>
                            <span className="text-xs bg-[#FAF8F5] text-[#0F172A] font-medium px-3 py-1 rounded-full border border-black/5">
                              {category.availableRoomsCount} Left
                            </span>
                          </div>
                          <h4 className="text-2xl font-heading font-normal text-[#0F172A] mb-2">{category.name}</h4>
                          <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed font-light">{category.description}</p>
                        </div>

                        <div className="pt-3 border-t border-black/5 flex items-center justify-between">
                          <div>
                            <span className="text-[9px] text-[#6B7280] uppercase tracking-[0.2em] font-semibold block mb-0.5">
                              STARTING FROM
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-heading font-bold text-[#0F172A]">₹{category.basePrice.toLocaleString()}</span>
                              <span className="text-xs text-[#6B7280]">per night</span>
                            </div>
                          </div>

                          <Button 
                            onClick={() => { setSelectedCategory(category); setStep(3); }} 
                            variant="primary"
                            className="bg-[#0F172A] hover:bg-[#C6A96B] text-white text-xs font-bold uppercase tracking-[0.15em] px-6 py-3 rounded-[12px] transition-all hover:-translate-y-[1px]"
                            rightIcon={<ArrowRight size={14} />}
                          >
                            Reserve Room
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* STEP 3: Guest Details Form */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* FULLY BOOKED CONVENIENCE NOTICE MODAL CARD */}
            {fullyBookedData ? (
              <div className="bg-white rounded-[28px] p-8 sm:p-10 border border-[#C6A96B]/30 shadow-2xl space-y-8 max-w-3xl mx-auto my-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#C6A96B]/30 flex items-center justify-center text-[#C6A96B] shrink-0">
                    <AlertTriangle size={24} />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-[#C6A96B] uppercase tracking-[0.25em]">Room Fully Booked Notice</span>
                    <h3 className="text-2xl sm:text-3xl font-heading text-[#0F172A]" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                      We Apologize for the Inconvenience
                    </h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed font-light">
                      {fullyBookedData.convenienceMessage}
                    </p>
                  </div>
                </div>

                {/* Front Desk Priority Contact */}
                <div className="bg-[#FAF8F5] rounded-[20px] p-5 border border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#0F172A] uppercase tracking-wider block">Priority Front Desk Assistance</span>
                    <p className="text-xs text-[#6B7280] mt-0.5">Call or email us directly to check instant cancellation openings.</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <a 
                      href={`tel:${fullyBookedData.contactInfo.phone}`} 
                      className="px-5 py-2.5 bg-[#0F172A] hover:bg-[#C6A96B] text-white text-xs font-bold rounded-[12px] transition-all flex items-center gap-2"
                    >
                      <Phone size={14} /> Call Front Desk
                    </a>
                    <a 
                      href={`mailto:${fullyBookedData.contactInfo.email}`} 
                      className="px-4 py-2.5 bg-white border border-black/10 text-[#0F172A] hover:bg-gray-50 text-xs font-semibold rounded-[12px] transition-all flex items-center gap-1.5"
                    >
                      <Mail size={14} /> Email Us
                    </a>
                  </div>
                </div>

                {/* Available Alternative Rooms */}
                {fullyBookedData.availableAlternatives && fullyBookedData.availableAlternatives.length > 0 ? (
                  <div className="space-y-4 pt-2 border-t border-black/5">
                    <div>
                      <span className="text-[10px] font-bold text-[#C6A96B] uppercase tracking-[0.2em]">Available Alternatives</span>
                      <h4 className="text-lg font-heading text-[#0F172A]">Rooms Available For Your Selected Dates</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {fullyBookedData.availableAlternatives.map(alt => (
                        <div key={alt.id} className="bg-white rounded-[18px] p-5 border border-black/8 hover:border-[#C6A96B] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3">
                          <div>
                            <span className="text-[9px] font-bold text-[#10B981] uppercase tracking-wider block mb-1">
                              ✓ {alt.availableRoomsCount} {alt.availableRoomsCount === 1 ? 'Room' : 'Rooms'} Left
                            </span>
                            <h5 className="text-base font-bold text-[#0F172A]">{alt.name}</h5>
                            <span className="text-xs text-[#6B7280]">Fits up to {alt.capacity} guests</span>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-black/5">
                            <span className="text-base font-bold text-[#0F172A]">₹{alt.basePrice.toLocaleString()} <span className="text-[10px] text-[#6B7280] font-normal">/ night</span></span>
                            <button
                              onClick={() => {
                                const cat = availableCategories.find(c => c.id === alt.id)
                                if (cat) setSelectedCategory(cat)
                                setFullyBookedData(null)
                                setError(null)
                              }}
                              className="px-4 py-2 bg-[#C6A96B] hover:bg-[#B8913A] text-white text-xs font-bold rounded-[10px] transition-all flex items-center gap-1"
                            >
                              <span>Switch to This Room</span>
                              <ArrowRight size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 border-t border-black/5">
                    <p className="text-xs text-[#6B7280]">All room types are currently fully booked for these dates. Please try selecting different dates above.</p>
                    <button onClick={() => { setFullyBookedData(null); setStep(1); }} className="mt-3 text-xs font-bold text-[#C6A96B] hover:underline">
                      ← Change Check-in / Check-out Dates
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-heading text-[#0F172A]">Guest Information</h3>
                  <button onClick={() => setStep(1)} className="text-[#6B7280] hover:text-[#0F172A] text-sm font-medium flex items-center gap-1">
                    <ArrowLeft size={16} /> Edit Dates
                  </button>
                </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form */}
              <form onSubmit={handleBook} className="lg:col-span-7 space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="guest-full-name" className="text-xs font-bold text-[#6B7280] uppercase tracking-wider cursor-pointer">Full Name *</label>
                  <input id="guest-full-name" name="guestName" required type="text" value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="e.g. Veerendra Kumar" suppressHydrationWarning className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-[14px] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C6A96B] focus:bg-white transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="guest-email" className="text-xs font-bold text-[#6B7280] uppercase tracking-wider cursor-pointer">Email Address *</label>
                  <input id="guest-email" name="guestEmail" required type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} placeholder="e.g. veerendra@example.com" suppressHydrationWarning className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-[14px] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C6A96B] focus:bg-white transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="guest-phone" className="text-xs font-bold text-[#6B7280] uppercase tracking-wider cursor-pointer">Phone Number *</label>
                  <input id="guest-phone" name="guestPhone" required type="tel" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} placeholder="+91 98765 43210" suppressHydrationWarning className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-[14px] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C6A96B] focus:bg-white transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="guest-requests" className="text-xs font-bold text-[#6B7280] uppercase tracking-wider cursor-pointer">Special Requests / Arrival Time</label>
                  <textarea id="guest-requests" name="specialRequests" value={specialRequests} onChange={e => setSpecialRequests(e.target.value)} rows={3} placeholder="Late check-in, ground floor request, or extra pillows..." suppressHydrationWarning className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-[14px] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C6A96B] focus:bg-white transition-all resize-none" />
                </div>
                
                <Button type="submit" size="xl" isLoading={loading} className="w-full mt-4 py-4 bg-[#0F172A] hover:bg-[#C6A96B] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-[14px] transition-all shadow-md">
                  Confirm & Pay at Hotel
                </Button>
              </form>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-5 bg-[#FAF8F5] rounded-[24px] border border-black/5 p-6 space-y-4">
                <h4 className="font-heading font-semibold text-lg text-[#0F172A] border-b border-black/8 pb-3">Stay Summary</h4>
                
                <div className="flex items-center gap-3 pb-3 border-b border-black/5">
                  <div className="relative w-16 h-14 rounded-[12px] overflow-hidden shrink-0 bg-gray-200">
                    <Image src={currentRoomInfo.image || '/images/rooms/deluxe-non-ac.jpg'} alt={currentRoomInfo.name} fill sizes="80px" className="object-cover" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-[#0F172A]">{currentRoomInfo.name}</h5>
                    <span className="text-xs text-[#6B7280]">₹{currentRoomInfo.price.toLocaleString()} / night</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-[#6B7280]">
                    <span>Check-In</span>
                    <span className="font-medium text-[#0F172A]">{new Date(checkIn).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-[#6B7280]">
                    <span>Check-Out</span>
                    <span className="font-medium text-[#0F172A]">{new Date(checkOut).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-[#6B7280]">
                    <span>Guests</span>
                    <span className="font-medium text-[#0F172A]">{guests} Guest(s)</span>
                  </div>
                </div>

                <div className="border-t border-black/8 pt-3 flex justify-between items-baseline">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#0F172A]">Total Amount</span>
                  <span className="font-bold text-xl text-[#0F172A]">₹{(currentRoomInfo.price * getNights()).toLocaleString()}</span>
                </div>
              </div>
            </>
          )}
          </motion.div>
        )}

        {/* STEP 4: Executive Booking Confirmation Suite (Tailored for Ashok Inn Davangere) */}
        {step === 4 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="py-2 space-y-8"
          >
            {/* 1. TOP SECTION (Warmer Luxury Greeting & Gold Accent Divider) */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 size={36} />
              </div>
              
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C6A96B] block">
                We're Delighted to Welcome You
              </span>
              
              <h3 className="text-3xl sm:text-5xl font-heading text-[#0F172A] font-normal" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                Your Reservation is Confirmed
              </h3>
              
              <div className="w-16 h-[1px] bg-[#C6A96B] mx-auto opacity-70" />

              <p className="text-[#6B7280] text-sm max-w-md mx-auto font-light leading-relaxed">
                Thank you, <span className="font-semibold text-[#0F172A]">{guestName.split(' ')[0]}</span>. Your booking at <span className="font-semibold text-[#0F172A]">Hotel Ashok Inn</span> has been logged. A confirmation email was sent to <span className="underline font-medium text-[#0F172A]">{guestEmail}</span>.
              </p>
            </div>

            {/* 2. PREMIUM CONFIRMATION SUMMARY CARD */}
            <div className="bg-[#FAF8F5] rounded-[24px] border border-black/5 p-6 sm:p-8 space-y-6 shadow-sm">
              
              {/* Copyable Reference ID & Refined Payment Status Badge */}
              <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-black/8 gap-4 text-center sm:text-left">
                <div>
                  <span className="text-[10px] text-[#6B7280] uppercase tracking-[0.2em] font-semibold block mb-1">Booking Reference</span>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold font-mono tracking-wider text-[#0F172A]">{bookingRef || 'BKG-ASHOK-9842'}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(bookingRef || 'BKG-ASHOK-9842')
                        setCopied(true)
                        setTimeout(() => setCopied(false), 2500)
                      }}
                      suppressHydrationWarning
                      className="px-3 py-1 bg-white hover:bg-gray-100 border border-black/10 rounded-full text-[11px] font-bold text-[#0F172A] transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <span>{copied ? '✓ Copied' : '📋 Copy ID'}</span>
                    </button>
                  </div>
                </div>

                {/* 3. REFINED PAYMENT BADGE */}
                <div className="text-center sm:text-right">
                  <span className="text-[10px] text-[#6B7280] uppercase tracking-[0.2em] font-semibold block mb-1">Payment Status</span>
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 text-amber-900 rounded-full text-xs font-bold border border-amber-500/25">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>🟡 Pay at Hotel (Payment Pending)</span>
                  </span>
                </div>
              </div>

              {/* STRUCTURED SCANABLE INFO CARDS WITH ICONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Check-In Card */}
                <div className="p-4 bg-white rounded-[16px] border border-black/5 space-y-1">
                  <div className="flex items-center gap-2 text-[#C6A96B] text-xs font-bold uppercase tracking-wider mb-1">
                    <Calendar size={14} />
                    <span>Check-In</span>
                  </div>
                  <p className="text-sm font-bold text-[#0F172A]">
                    {checkIn ? new Date(checkIn).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Confirmed Date'}
                  </p>
                  <span className="text-[10px] text-[#6B7280] block font-light">From 12:00 PM onwards</span>
                </div>

                {/* Check-Out Card */}
                <div className="p-4 bg-white rounded-[16px] border border-black/5 space-y-1">
                  <div className="flex items-center gap-2 text-[#C6A96B] text-xs font-bold uppercase tracking-wider mb-1">
                    <Calendar size={14} />
                    <span>Check-Out</span>
                  </div>
                  <p className="text-sm font-bold text-[#0F172A]">
                    {checkOut ? new Date(checkOut).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Confirmed Date'}
                  </p>
                  <span className="text-[10px] text-[#6B7280] block font-light">Until 11:00 AM</span>
                </div>

                {/* Accommodation Card */}
                <div className="p-4 bg-white rounded-[16px] border border-black/5 space-y-1">
                  <div className="flex items-center gap-2 text-[#C6A96B] text-xs font-bold uppercase tracking-wider mb-1">
                    <Users size={14} />
                    <span>Accommodation</span>
                  </div>
                  <p className="text-xs font-bold text-[#0F172A] truncate">
                    {currentRoomInfo.name}
                  </p>
                  <span className="text-[10px] text-[#6B7280] block font-light">{guests} Guest(s) • {getNights()} Night(s)</span>
                </div>

                {/* Total Payable Card (Rate Calculation Details) */}
                <div className="p-4 bg-white rounded-[16px] border border-black/5 space-y-1">
                  <div className="flex items-center justify-between text-[#C6A96B] text-xs font-bold uppercase tracking-wider mb-1">
                    <span>💰 Total Amount</span>
                    <span className="text-[10px] text-[#6B7280]">₹{currentRoomInfo.price.toLocaleString()} × {getNights()}</span>
                  </div>
                  <p className="text-base font-bold text-[#0F172A]">
                    ₹{(currentRoomInfo.price * getNights()).toLocaleString()}
                  </p>
                  <span className="text-[10px] text-emerald-600 block font-semibold">Taxes & CP Breakfast Included</span>
                </div>

              </div>

              {/* 5. VISUAL STAY TIMELINE (Enjoy Your Stay Label) */}
              <div className="pt-4 border-t border-black/5">
                <span className="text-[10px] text-[#6B7280] uppercase tracking-[0.2em] font-semibold block mb-4 text-center">Your Stay Timeline</span>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-3 bg-white rounded-[12px] border border-black/5 space-y-1">
                    <span className="text-emerald-600 font-bold block text-[11px]">✓ STEP 1</span>
                    <span className="font-semibold text-[#0F172A] block text-[11px]">Reservation Logged</span>
                  </div>

                  <div className="p-3 bg-white rounded-[12px] border border-black/5 space-y-1">
                    <span className="text-[#C6A96B] font-bold block text-[11px]">STEP 2</span>
                    <span className="font-semibold text-[#0F172A] block text-[11px]">Check-In (12 PM)</span>
                  </div>

                  <div className="p-3 bg-white rounded-[12px] border border-black/5 space-y-1">
                    <span className="text-[#C6A96B] font-bold block text-[11px]">STEP 3</span>
                    <span className="font-semibold text-[#0F172A] block text-[11px]">Enjoy Your Stay</span>
                  </div>

                  <div className="p-3 bg-white rounded-[12px] border border-black/5 space-y-1">
                    <span className="text-[#6B7280] font-bold block text-[11px]">STEP 4</span>
                    <span className="font-semibold text-[#0F172A] block text-[11px]">Check-Out (11 AM)</span>
                  </div>
                </div>
              </div>

            </div>

            {/* WHAT HAPPENS NEXT? */}
            <div className="bg-white rounded-[20px] border border-black/5 p-6 space-y-3 shadow-xs">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] border-b border-black/5 pb-2">What Happens Next?</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#6B7280] font-light">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Confirmation email has been sent to your inbox.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Front desk & 24×7 reception have been notified.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Present your Booking Reference <strong className="text-[#0F172A]">{bookingRef || 'BKG-ASHOK-9842'}</strong> at check-in.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Need changes or special care? Contact our desk anytime.</span>
                </div>
              </div>
            </div>

            {/* 7. NEED ANYTHING BEFORE ARRIVAL? (AUTHENTIC ASHOK INN PRE-ARRIVAL ASSISTANCE) */}
            <div className="bg-[#FAF8F5] rounded-[20px] border border-black/5 p-6 space-y-4 shadow-xs">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] border-b border-black/5 pb-2">
                Need Anything Before Arrival?
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-medium text-[#0F172A]">
                <div className="p-3 bg-white rounded-[12px] border border-black/5 space-y-1">
                  <span className="block font-bold text-[#C6A96B]">🚖 Taxi Assistance</span>
                  <span className="text-[11px] text-[#6B7280] block font-light">Pickup support from Davangere Railway Station or KSRTC Bus Stand.</span>
                </div>

                <div className="p-3 bg-white rounded-[12px] border border-black/5 space-y-1">
                  <span className="block font-bold text-[#C6A96B]">🎉 Celebration Setup</span>
                  <span className="text-[11px] text-[#6B7280] block font-light">Birthday or anniversary special room decoration on request.</span>
                </div>

                <div className="p-3 bg-white rounded-[12px] border border-black/5 space-y-1">
                  <span className="block font-bold text-[#C6A96B]">⏰ Flexible Timing</span>
                  <span className="text-[11px] text-[#6B7280] block font-light">Early check-in / late check-out requests (subject to availability).</span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button 
                onClick={handleDownloadVoucherPDF}
                suppressHydrationWarning
                className="py-3.5 px-4 bg-white hover:bg-gray-50 text-[#0F172A] text-xs font-bold uppercase tracking-wider rounded-[14px] border border-black/10 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>📥 Download Voucher (PDF)</span>
              </button>
              
              <a 
                href={`https://wa.me/918012345678?text=Hello%20Ashok%20Inn%2C%20my%20booking%20ref%20is%20${bookingRef || 'BKG-ASHOK-9842'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] text-xs font-bold uppercase tracking-wider rounded-[14px] border border-[#25D366]/30 transition-all flex items-center justify-center gap-2 font-semibold"
              >
                <span>💬 Send Booking to WhatsApp</span>
              </a>

              <a 
                href="/profile"
                className="py-3.5 px-4 bg-[#0F172A] hover:bg-[#C6A96B] text-white text-xs font-bold uppercase tracking-wider rounded-[14px] transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <span>👤 My Guest Portal</span>
              </a>

              <a 
                href="/"
                className="py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-[#0F172A] text-xs font-bold uppercase tracking-wider rounded-[14px] transition-all flex items-center justify-center gap-2"
              >
                <span>🏠 Return to Website</span>
              </a>
            </div>

            {/* 6. ASHOK INN 24x7 DIRECT RECEPTION ASSISTANCE DESK */}
            <div className="pt-4 border-t border-black/5 text-center text-xs text-[#6B7280]">
              <p className="font-semibold text-[#0F172A] mb-1.5">Need Immediate Assistance with Your Reservation?</p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-medium text-[#0F172A]">
                <span>☎ Reception: +91 80 1234 5678</span>
                <span>•</span>
                <span>✉ Reservations: reservations@ashokinn.com</span>
                <span>•</span>
                <span>📍 Location: Beside New KSRTC Bus Stand, Davangere</span>
              </div>
            </div>

          </motion.div>
        )}
      </div>
    </div>
  )
}
