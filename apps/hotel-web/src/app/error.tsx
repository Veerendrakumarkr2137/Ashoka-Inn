'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('App Error:', error)
  }, [error])

  return (
    <div className="min-h-[70vh] bg-[#FAF8F5] flex items-center justify-center p-6 text-center font-body">
      <div className="max-w-md w-full bg-white rounded-[32px] p-8 shadow-xl border border-black/5">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} className="text-amber-600" />
        </div>

        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C6A96B] block mb-2">
          Something went wrong
        </span>
        <h2 className="text-3xl font-heading text-[#0F172A] mb-3" style={{ fontFamily: 'var(--font-cormorant, serif)' }}>
          Unexpected Error
        </h2>
        <p className="text-xs text-[#6B7280] leading-relaxed mb-8">
          We encountered a temporary issue while loading this page. Please try refreshing or return to the homepage.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#0F172A] hover:bg-[#C6A96B] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-[14px] transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 bg-[#FAF8F5] hover:bg-black/5 text-[#0F172A] border border-black/10 text-xs font-bold uppercase tracking-[0.2em] rounded-[14px] transition-all flex items-center justify-center gap-2"
          >
            <Home size={14} />
            <span>Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
