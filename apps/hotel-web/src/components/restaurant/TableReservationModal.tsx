'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, Users, CheckCircle2, Utensils, Wine, IceCream, ArrowRight } from 'lucide-react'

interface TableReservationModalProps {
  isOpen: boolean
  onClose: () => void
  defaultVenue?: 'dLounge' | 'hikkups' | 'mercelys'
}

export function TableReservationModal({
  isOpen,
  onClose,
  defaultVenue = 'dLounge'
}: TableReservationModalProps) {
  const [venue, setVenue] = useState<'dLounge' | 'hikkups' | 'mercelys'>(defaultVenue)
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [timeSlot, setTimeSlot] = useState<string>('07:30 PM')
  const [guests, setGuests] = useState<number>(2)
  const [guestName, setGuestName] = useState<string>('')
  const [guestPhone, setGuestPhone] = useState<string>('')
  const [specialRequests, setSpecialRequests] = useState<string>('')
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [reservationRef, setReservationRef] = useState<string>('')

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault()
    const ref = `TBL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    setReservationRef(ref)
    setIsSuccess(true)
  }

  const resetAndClose = () => {
    setIsSuccess(false)
    onClose()
  }

  const venueNames = {
    dLounge: 'D Lounge Restaurant',
    hikkups: 'The Hikkups BBQ & Bar',
    mercelys: 'Mercely’s Kefi Ice Cream'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-md z-[300]"
          />

          {/* Centered Modal */}
          <div className="fixed inset-0 z-[310] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="bg-white rounded-[32px] w-full max-w-xl shadow-[0_32px_80px_rgba(0,0,0,0.25)] border border-black/5 overflow-hidden my-8"
            >
              {/* Header */}
              <div className="bg-[#0F172A] p-6 sm:p-8 text-white flex items-center justify-between relative">
                <div>
                  <span className="text-[10px] font-bold text-[#C6A96B] uppercase tracking-[0.3em] block mb-1">
                    Dining Reservations
                  </span>
                  <h3 className="text-2xl font-heading font-normal" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                    Reserve a Table
                  </h3>
                </div>
                <button
                  onClick={resetAndClose}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  aria-label="Close modal"
                  suppressHydrationWarning
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8">
                {isSuccess ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={36} className="text-emerald-600" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C6A96B] block mb-1">
                      Table Reserved
                    </span>
                    <h4 className="text-3xl font-heading text-[#0F172A] mb-2" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
                      Reservation Confirmed!
                    </h4>
                    <p className="text-xs text-[#6B7280] max-w-sm mx-auto mb-6 leading-relaxed">
                      Thank you, {guestName}. Your table at <strong>{venueNames[venue]}</strong> is reserved for {guests} guests on {date} at {timeSlot}.
                    </p>

                    <div className="inline-block bg-[#FAF8F5] border border-black/5 rounded-[16px] px-6 py-3 mb-8">
                      <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-0.5">Reference ID</span>
                      <span className="text-xl font-bold tracking-widest text-[#0F172A]">{reservationRef}</span>
                    </div>

                    <div>
                      <button
                        onClick={resetAndClose}
                        className="px-8 py-3.5 bg-[#0F172A] hover:bg-[#C6A96B] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-[14px] transition-all shadow-md"
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleReserve} className="space-y-6">
                    {/* Venue Selector */}
                    <div>
                      <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block mb-2">
                        Select Venue
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'dLounge', label: 'D Lounge', icon: Utensils },
                          { id: 'hikkups', label: 'Hikkups BBQ', icon: Wine },
                          { id: 'mercelys', label: 'Mercely’s', icon: IceCream },
                        ].map((v) => (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setVenue(v.id as any)}
                            className={`p-3 rounded-[14px] text-xs font-medium border flex flex-col items-center gap-1.5 transition-all ${
                              venue === v.id
                                ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-sm'
                                : 'bg-[#FAF8F5] text-[#6B7280] border-black/5 hover:border-black/15'
                            }`}
                            suppressHydrationWarning
                          >
                            <v.icon size={16} className={venue === v.id ? 'text-[#C6A96B]' : ''} />
                            <span>{v.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Date & Guests Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Date */}
                      <div>
                        <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block mb-1.5">
                          Reservation Date
                        </label>
                        <div className="relative">
                          <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C6A96B]" />
                          <input
                            type="date"
                            required
                            value={date}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full pl-10 pr-3 py-3 bg-[#FAF8F5] border border-black/8 rounded-[14px] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#C6A96B]"
                            suppressHydrationWarning
                          />
                        </div>
                      </div>

                      {/* Guests */}
                      <div>
                        <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block mb-1.5">
                          Number of Guests
                        </label>
                        <div className="relative">
                          <Users size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C6A96B]" />
                          <select
                            value={guests}
                            onChange={(e) => setGuests(Number(e.target.value))}
                            className="w-full pl-10 pr-3 py-3 bg-[#FAF8F5] border border-black/8 rounded-[14px] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#C6A96B] appearance-none"
                            suppressHydrationWarning
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                              <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Time Slot */}
                    <div>
                      <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block mb-2">
                        Time Slot
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          '12:30 PM', '01:30 PM', '02:30 PM',
                          '07:00 PM', '07:30 PM', '08:30 PM', '09:30 PM', '10:00 PM'
                        ].map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setTimeSlot(slot)}
                            className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-all ${
                              timeSlot === slot
                                ? 'bg-[#C6A96B] text-white border-[#C6A96B]'
                                : 'bg-[#FAF8F5] text-[#0F172A] border-black/5 hover:border-black/15'
                            }`}
                            suppressHydrationWarning
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Contact Form */}
                    <div className="space-y-3 pt-2 border-t border-black/5">
                      <div>
                        <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rahul Sharma"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          className="w-full px-4 py-3 bg-[#FAF8F5] border border-black/8 rounded-[14px] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#C6A96B]"
                          suppressHydrationWarning
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +91 98765 43210"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          className="w-full px-4 py-3 bg-[#FAF8F5] border border-black/8 rounded-[14px] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#C6A96B]"
                          suppressHydrationWarning
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block mb-1">
                          Special Requests (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Window table, Birthday celebration, High chair"
                          value={specialRequests}
                          onChange={(e) => setSpecialRequests(e.target.value)}
                          className="w-full px-4 py-3 bg-[#FAF8F5] border border-black/8 rounded-[14px] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#C6A96B]"
                          suppressHydrationWarning
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-4 bg-[#0F172A] hover:bg-[#C6A96B] active:scale-[0.99] text-white rounded-[16px] text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-md mt-4"
                    >
                      Confirm Table Reservation <ArrowRight size={14} />
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
