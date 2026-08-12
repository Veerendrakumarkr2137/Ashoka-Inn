'use client'

import React from 'react'
import { X, User, Phone, Mail, Calendar, BedDouble, CreditCard, ShieldAlert, CheckCircle2, Clock } from 'lucide-react'

interface BookingDetailsModalProps {
  booking: any
  onClose: () => void
}

export function BookingDetailsModal({ booking, onClose }: BookingDetailsModalProps) {
  if (!booking) return null

  const room = booking.allocations[0]?.room
  const payment = booking.payments[0]

  return (
    <div className="fixed inset-[#0] bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C6A96B] text-[#0F172A] flex items-center justify-center font-bold text-lg">
              {booking.user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">{booking.bookingRef}</h3>
                <span className="px-2 py-0.5 text-xs font-bold bg-white/20 text-white rounded-md uppercase">
                  {booking.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">Created on {new Date(booking.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Guest Profile Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold">
                <User size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{booking.user.name}</h4>
                <p className="text-xs text-slate-500">{booking.user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {booking.user.phone && (
                <a
                  href={`tel:${booking.user.phone}`}
                  className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 hover:bg-emerald-700 transition-colors"
                >
                  <Phone size={14} /> Call Guest
                </a>
              )}
              <a
                href={`mailto:${booking.user.email}`}
                className="px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 hover:bg-slate-900 transition-colors"
              >
                <Mail size={14} /> Email
              </a>
            </div>
          </div>

          {/* Grid: Dates & Room Allocation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={14} className="text-[#C6A96B]" /> Reservation Dates
              </h4>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Check-in:</span>
                  <span className="font-bold text-emerald-700">{new Date(booking.checkIn).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Check-out:</span>
                  <span className="font-bold text-rose-700">{new Date(booking.checkOut).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-slate-100">
                  <span className="text-slate-500">Guests:</span>
                  <span className="font-medium text-slate-800">{booking.adults} Adults, {booking.children} Children</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BedDouble size={14} className="text-[#C6A96B]" /> Room Allocation
              </h4>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Room Number:</span>
                  <span className="font-extrabold text-slate-900 bg-amber-50 px-2 py-0.5 rounded text-amber-800">
                    Room {room?.roomNumber || 'Unassigned'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-medium text-slate-800">{room?.category?.name || 'Deluxe'}</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-slate-100">
                  <span className="text-slate-500">Room Status:</span>
                  <span className="font-bold text-slate-700">{room?.status || 'AVAILABLE'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment & Billing Breakdown */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard size={14} className="text-[#C6A96B]" /> Financial & Payment Info
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500">Total Amount</span>
                <p className="text-base font-extrabold text-slate-900 mt-0.5">₹{booking.totalAmount.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500">Payment Status</span>
                <p className={`text-xs font-bold mt-1 ${payment?.status === 'COMPLETED' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {payment?.status || 'PENDING'}
                </p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500">Payment Method</span>
                <p className="text-xs font-bold text-slate-800 mt-1">{payment?.paymentMethod || 'UPI'}</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500">Transaction ID</span>
                <p className="text-xs font-mono font-medium text-slate-600 mt-1 truncate">{payment?.transactionId || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {booking.specialRequests && (
            <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldAlert size={14} /> Special Requests / Guest Notes
              </p>
              <p>{booking.specialRequests}</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  )
}
