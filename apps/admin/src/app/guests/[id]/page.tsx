import React from 'react'
import { prisma } from '@hospitality-os/database'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Phone, Mail, Star, Calendar, BedDouble, CreditCard, ShieldAlert, CheckCircle2, History } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function GuestDetailsPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params

  const guest = await prisma.user.findUnique({
    where: { id },
    include: {
      bookings: {
        include: {
          allocations: { include: { room: { include: { category: true } } } },
          payments: true,
        },
        orderBy: { checkIn: 'desc' }
      }
    }
  })

  if (!guest) {
    notFound()
  }

  const totalStays = guest.bookings.length
  const totalSpend = guest.bookings.reduce((sum, b) => sum + b.totalAmount, 0)
  const isVIP = totalStays >= 2 || totalSpend > 30000
  const lastStay = guest.bookings[0]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-6xl mx-auto pb-12">
      {/* Back & Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/guests"
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100 transition-colors shadow-xs"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">{guest.name}</h1>
            <p className="text-xs text-slate-500">Registered Guest since {new Date(guest.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {isVIP && (
          <span className="px-3.5 py-1.5 bg-amber-50 text-amber-800 font-extrabold text-xs rounded-full border border-amber-300 flex items-center gap-1.5 shadow-xs">
            <Star size={15} className="fill-amber-500 text-amber-500" /> VIP GUEST
          </span>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Profile Summary & Quick Contact */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-[#C6A96B] text-[#0F172A] flex items-center justify-center font-extrabold text-4xl shadow-md mb-3">
                {guest.name.charAt(0)}
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">{guest.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{guest.email}</p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-medium text-xs">Total Lifetime Stays</span>
                <p className="text-xl font-extrabold text-slate-900 mt-0.5">{totalStays}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-medium text-xs">Lifetime Spend</span>
                <p className="text-lg font-extrabold text-emerald-600 mt-0.5">₹{totalSpend.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              {guest.phone && (
                <a
                  href={`tel:${guest.phone}`}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Phone size={15} /> Call {guest.phone}
                </a>
              )}
              <a
                href={`mailto:${guest.email}`}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Mail size={15} /> Email Guest
              </a>
            </div>
          </div>

          {/* Preferences & VIP Notes */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert size={14} className="text-[#C6A96B]" /> VIP Guest Preferences
            </h4>
            <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1 font-medium">
              <p>• High Floor King Suite preferred</p>
              <p>• Prefers late check-in at 2:00 PM</p>
              <p>• Non-smoking room strict requirement</p>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Complete Stay History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <History size={18} className="text-[#C6A96B]" /> Complete Stay History ({totalStays} Reservations)
              </h3>
            </div>

            <div className="space-y-3">
              {guest.bookings.length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center">No stay history recorded for this guest.</p>
              ) : guest.bookings.map((b) => {
                const room = b.allocations[0]?.room
                return (
                  <div 
                    key={b.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#C6A96B]/50 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 font-mono text-xs">{b.bookingRef}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                          b.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                          b.status === 'CHECKED_IN' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800'
                        }`}>
                          {b.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 font-semibold mt-1">
                        Room {room?.roomNumber || 'Unassigned'} • {room?.category?.name || 'Deluxe'}
                      </p>

                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(b.checkIn).toLocaleDateString()} — {new Date(b.checkOut).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-start sm:items-end justify-between gap-1">
                      <span className="text-sm font-extrabold text-slate-900">₹{b.totalAmount.toLocaleString('en-IN')}</span>
                      <Link
                        href={`/bookings/${b.id}`}
                        className="text-xs font-bold text-[#C6A96B] hover:underline"
                      >
                        View Reservation →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
