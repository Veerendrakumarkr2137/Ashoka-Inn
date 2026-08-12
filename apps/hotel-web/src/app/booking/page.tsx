import React from 'react'
import { BookingEngine } from '@/components/booking/BookingEngine'

export default function BookingPage() {
  return (
    <main className="bg-[#FAF8F5] min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C6A96B] block mb-2">
          Hotel Ashok Inn Davangere
        </span>
        <h1 className="text-3xl md:text-5xl font-heading text-[#0F172A] mb-2 font-normal" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
          Reserve Your Stay
        </h1>
        <p className="text-[#6B7280] text-sm sm:text-base max-w-xl mx-auto font-light">
          Experience true hospitality. Select your dates to verify availability and confirm your stay.
        </p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <React.Suspense fallback={<div className="h-96 flex items-center justify-center"><p>Loading...</p></div>}>
          <BookingEngine />
        </React.Suspense>
      </div>
    </main>
  )
}
