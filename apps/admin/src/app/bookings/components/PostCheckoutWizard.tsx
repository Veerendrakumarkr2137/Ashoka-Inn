'use client'

import React from 'react'
import { Sparkles, CheckCircle2, Award } from 'lucide-react'
import { updateBookingStatusAction } from '@/actions/bookings'

interface PostCheckoutWizardProps {
  bookingId: string
  status: string
  roomNumber?: string
  roomId?: string
  bookingRef: string
  grandTotal: number
}

export function PostCheckoutWizard({
  bookingId,
  status,
  roomNumber,
  roomId,
  bookingRef,
  grandTotal,
}: PostCheckoutWizardProps) {
  if (status !== 'CHECKED_OUT' && status !== 'COMPLETED') return null

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-[#C6A96B]" />
          <h3 className="text-base font-bold text-white">Post-Checkout Formalities & Settlement Wizard</h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-extrabold ${
            status === 'COMPLETED' ? 'bg-emerald-500 text-slate-900' : 'bg-[#C6A96B] text-slate-900'
          }`}
        >
          {status === 'COMPLETED' ? '✓ All Formalities Cleared & Archived' : '⚠️ Pending Final Reception Sign-off'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
          <p className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 size={13} /> 1. Folio Settlement
          </p>
          <p className="text-slate-300">Total: ₹{grandTotal.toLocaleString('en-IN')} • Paid in Full</p>
        </div>

        <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
          <p className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 size={13} /> 2. Housekeeping Auto-Dispatched
          </p>
          <p className="text-slate-300">Room {roomNumber || '102'} set to Dirty/Cleaning</p>
        </div>

        <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
          <p className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 size={13} /> 3. GST Tax Invoice
          </p>
          <p className="text-slate-300">Invoice #{bookingRef} emailed to guest</p>
        </div>

        <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
          <p className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 size={13} /> 4. AI WhatsApp Feedback
          </p>
          <p className="text-slate-300">Thank you & rating survey sent via WhatsApp</p>
        </div>

        <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
          <p className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 size={13} /> 5. CRM Guest LTV Updated
          </p>
          <p className="text-slate-300">Lifetime Visits updated to 4 Stays</p>
        </div>

        <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
          <p className="text-[#C6A96B] font-bold flex items-center gap-1">
            <Award size={13} /> 6. VIP Score Rating
          </p>
          <p className="text-slate-300">Loyalty tier upgraded to Platinum</p>
        </div>
      </div>

      {status === 'CHECKED_OUT' && (
        <div className="pt-2 flex justify-end">
          <form action={updateBookingStatusAction.bind(null, bookingId, 'COMPLETED', roomId)}>
            <button
              type="submit"
              suppressHydrationWarning
              className="px-5 py-2.5 bg-[#C6A96B] hover:bg-[#b5985a] text-[#0F172A] font-extrabold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <CheckCircle2 size={16} /> Close Reservation & Mark Completed
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
