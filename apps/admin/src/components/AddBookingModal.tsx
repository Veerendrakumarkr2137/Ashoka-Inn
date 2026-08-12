'use client'

import React, { useState } from 'react'
import { X, Calendar, Search, Users, CheckCircle2, Loader2, Info } from 'lucide-react'
import { Button } from '@hospitality-os/ui/src/components/Button'
import { checkAvailability, createAdminBooking } from '@/actions/bookings'

type AddBookingModalProps = {
  isOpen: boolean
  onClose: () => void
}

type Step = 1 | 2 | 3 | 4

export function AddBookingModal({ isOpen, onClose }: AddBookingModalProps) {
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Search State
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)

  // Results State
  const [availableCategories, setAvailableCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [selectedRoomId, setSelectedRoomId] = useState<string>('')

  // Guest Details State
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')

  // Confirmation
  const [bookingRef, setBookingRef] = useState('')

  // Reset form when closed
  React.useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1)
        setCheckIn('')
        setCheckOut('')
        setGuests(2)
        setAvailableCategories([])
        setSelectedCategory(null)
        setSelectedRoomId('')
        setGuestName('')
        setGuestEmail('')
        setGuestPhone('')
        setError(null)
      }, 300)
    }
  }, [isOpen])

  if (!isOpen) return null

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
    setLoading(true)
    
    const res = await checkAvailability(checkIn, checkOut)
    
    setLoading(false)
    if (res.success && res.data) {
      setAvailableCategories(res.data)
      setStep(2)
    } else {
      setError(res.error || 'Failed to search for rooms')
    }
  }

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRoomId) {
      setError('Please select a specific room for this booking.')
      return
    }
    
    setError(null)
    setLoading(true)

    const res = await createAdminBooking({
      checkIn,
      checkOut,
      roomId: selectedRoomId,
      categoryId: selectedCategory.id,
      guests,
      guestName,
      guestEmail,
      guestPhone
    })

    setLoading(false)
    if (res.success && res.bookingRef) {
      setBookingRef(res.bookingRef)
      setStep(4)
    } else {
      setError(res.error || 'Failed to create booking')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className="relative w-full max-w-xl h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-[#0F172A]">New Offline Booking</h2>
            <p className="text-sm text-gray-500">Walk-in or phone reservation</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors text-gray-500"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm flex gap-2">
              <Info size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Dates */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Check-in Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="date" 
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C6A96B] transition-all text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Check-out Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="date" 
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C6A96B] transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Number of Guests</label>
                <div className="relative w-full">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <select 
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C6A96B] transition-all text-sm appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Category & Room Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-900">Available Rooms</h3>
                <button onClick={() => setStep(1)} className="text-sm text-[#C6A96B] hover:underline font-medium">Edit Dates</button>
              </div>

              {availableCategories.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-500">No rooms available for these dates.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableCategories.map(category => (
                    <div 
                      key={category.id} 
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedCategory?.id === category.id ? 'border-[#C6A96B] bg-[#FDF9F0]' : 'border-gray-100 bg-white hover:border-gray-300'}`}
                      onClick={() => {
                        setSelectedCategory(category)
                        setSelectedRoomId(category.availableRooms[0]?.id || '')
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-900">{category.name}</h4>
                        <span className="font-semibold text-[#0F172A]">₹{category.basePrice.toLocaleString()} / night</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-1">{category.description}</p>
                      
                      {selectedCategory?.id === category.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200/50">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Assign Specific Room</label>
                          <div className="flex flex-wrap gap-2">
                            {category.availableRooms.map((room: any) => (
                              <button
                                key={room.id}
                                onClick={(e) => { e.stopPropagation(); setSelectedRoomId(room.id) }}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${selectedRoomId === room.id ? 'bg-[#C6A96B] text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-[#C6A96B]'}`}
                              >
                                {room.roomNumber}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Guest Details */}
          {step === 3 && (
            <form id="booking-form" onSubmit={handleCreateBooking} className="space-y-5">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-900">Guest Information</h3>
                <button type="button" onClick={() => setStep(2)} className="text-sm text-[#C6A96B] hover:underline font-medium">Back to Rooms</button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Full Name *</label>
                <input 
                  required 
                  type="text" 
                  value={guestName} 
                  onChange={e => setGuestName(e.target.value)} 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C6A96B]" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email Address *</label>
                <input 
                  required 
                  type="email" 
                  value={guestEmail} 
                  onChange={e => setGuestEmail(e.target.value)} 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C6A96B]" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Phone Number *</label>
                <input 
                  required 
                  type="tel" 
                  value={guestPhone} 
                  onChange={e => setGuestPhone(e.target.value)} 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C6A96B]" 
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Dates:</span> <span className="font-medium">{new Date(checkIn).toLocaleDateString()} - {new Date(checkOut).toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Room:</span> <span className="font-medium">{selectedCategory?.name}</span></div>
                <div className="flex justify-between pt-2 border-t border-gray-200"><span className="font-bold text-gray-900">Total:</span> <span className="font-bold text-[#C6A96B]">₹{(selectedCategory?.basePrice * Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))).toLocaleString()}</span></div>
              </div>
            </form>
          )}

          {/* STEP 4: Success */}
          {step === 4 && (
            <div className="text-center py-12 h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} className="text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-500 mb-6">The walk-in reservation was successfully created.</p>
              
              <div className="inline-block bg-gray-50 border border-gray-200 rounded-xl px-6 py-3 mb-8">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Booking Reference</span>
                <span className="text-xl font-bold tracking-widest text-[#0F172A]">{bookingRef}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-white">
          {step === 1 && (
            <Button className="w-full" onClick={handleSearch} isLoading={loading}>Search Availability</Button>
          )}
          {step === 2 && (
            <Button className="w-full" onClick={() => setStep(3)} disabled={!selectedCategory || !selectedRoomId}>Continue</Button>
          )}
          {step === 3 && (
            <Button className="w-full" type="submit" form="booking-form" isLoading={loading}>Confirm Booking (Paid at Desk)</Button>
          )}
          {step === 4 && (
            <Button className="w-full" onClick={onClose}>Close & Return to Dashboard</Button>
          )}
        </div>
      </div>
    </div>
  )
}
