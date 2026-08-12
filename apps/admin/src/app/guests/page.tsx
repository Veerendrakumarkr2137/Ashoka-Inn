import React from 'react'
import { prisma } from '@hospitality-os/database'
import Link from 'next/link'
import { Search, Filter, Download, Star, Phone, Eye, ArrowRight } from 'lucide-react'
import { Button } from '@hospitality-os/ui/src/components/Button'

export const dynamic = 'force-dynamic'

export default async function AdminGuestsPage() {
  const guests = await prisma.user.findMany({
    where: {
      role: 'GUEST'
    },
    include: {
      bookings: {
        orderBy: { checkIn: 'desc' }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const totalGuests = guests.length
  const repeatGuests = guests.filter(g => g.bookings.length > 1).length
  const totalRevenue = guests.reduce((sum, guest) => {
    return sum + guest.bookings.reduce((bSum, b) => bSum + b.totalAmount, 0)
  }, 0)

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Guest CRM Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Comprehensive guest history, lifetime spend, and VIP preferences.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" leftIcon={<Filter size={16} />}>Filters</Button>
          <Button size="sm" leftIcon={<Download size={16} />}>Export CRM CSV</Button>
        </div>
      </div>

      {/* Stats KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Registered Guests</p>
          <p className="text-3xl font-extrabold text-slate-900">{totalGuests}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-center">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Repeat Hotel Guests</p>
          <p className="text-3xl font-extrabold text-slate-900">{repeatGuests}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-center">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Total Guest Lifetime Spend</p>
          <p className="text-3xl font-extrabold text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Data Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search guest name, phone, or email..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C6A96B]"
              suppressHydrationWarning
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Guest</th>
                <th className="px-6 py-3.5">Phone</th>
                <th className="px-6 py-3.5">Last Stay</th>
                <th className="px-6 py-3.5">Lifetime Spend</th>
                <th className="px-6 py-3.5">VIP Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {guests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No guest profiles found.
                  </td>
                </tr>
              ) : guests.map((guest) => {
                const totalStays = guest.bookings.length
                const totalSpend = guest.bookings.reduce((sum, b) => sum + b.totalAmount, 0)
                const lastBooking = guest.bookings[0]
                const isVIP = totalStays >= 2 || totalSpend > 30000

                return (
                  <tr key={guest.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Guest Name & Avatar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#C6A96B] text-[#0F172A] flex items-center justify-center font-bold text-xs shrink-0">
                          {guest.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <Link 
                            href={`/guests/${guest.id}`}
                            className="font-bold text-slate-900 hover:text-[#C6A96B] transition-colors flex items-center gap-1.5"
                          >
                            {guest.name}
                            {isVIP && <Star size={14} className="text-amber-500 fill-amber-500" />}
                          </Link>
                          <p className="text-[11px] text-slate-400">{guest.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4">
                      {guest.phone ? (
                        <a 
                          href={`tel:${guest.phone}`}
                          className="font-bold text-slate-700 hover:text-emerald-600 flex items-center gap-1 hover:underline"
                        >
                          <Phone size={13} className="text-emerald-600" />
                          {guest.phone}
                        </a>
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </td>

                    {/* Last Stay */}
                    <td className="px-6 py-4">
                      {lastBooking ? (
                        <div>
                          <span className="font-semibold text-slate-800">
                            {new Date(lastBooking.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <p className="text-[10px] text-slate-400">{totalStays} total stays</p>
                        </div>
                      ) : (
                        <span className="text-slate-400">No visits recorded</span>
                      )}
                    </td>

                    {/* Lifetime Spend */}
                    <td className="px-6 py-4">
                      <span className="font-extrabold text-emerald-600 text-sm">
                        ₹{totalSpend.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* VIP Badge */}
                    <td className="px-6 py-4">
                      {isVIP ? (
                        <span className="px-2.5 py-1 text-[11px] font-bold bg-amber-50 text-amber-800 rounded-full border border-amber-200 flex items-center gap-1 w-fit">
                          ★ VIP GUEST
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 text-slate-600 rounded-full w-fit">
                          STANDARD
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/guests/${guest.id}`}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye size={14} /> View CRM Profile
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
