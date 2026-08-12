'use client'

import React from 'react'
import { Receipt, Coffee, AlertCircle, PlusCircle, CreditCard, ShieldCheck } from 'lucide-react'
import { AddFolioChargeModal } from './AddFolioChargeModal'

interface GuestFolioBreakdownProps {
  bookingId: string
  guestName: string
  roomNumber?: string
  roomCharges: number
  orders: any[]
  folioCharges: any[]
  payments: any[]
  grandTotal: number
  totalPaid: number
  balanceDue: number
}

export function GuestFolioBreakdown({
  bookingId,
  guestName,
  roomNumber,
  roomCharges,
  orders,
  folioCharges,
  payments,
  grandTotal,
  totalPaid,
  balanceDue,
}: GuestFolioBreakdownProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <Receipt size={18} className="text-[#C6A96B]" />
          <h3 className="text-base font-bold text-slate-900">Billing & Financial Folio Breakdown</h3>
        </div>

        <AddFolioChargeModal bookingId={bookingId} guestName={guestName} roomNumber={roomNumber} />
      </div>

      {/* Itemized Line Items Table */}
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5">Category</th>
                <th className="px-4 py-2.5">Item Description</th>
                <th className="px-4 py-2.5 text-center">Qty</th>
                <th className="px-4 py-2.5 text-right">Unit Price</th>
                <th className="px-4 py-2.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {/* Room Rent */}
              <tr>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-800 font-extrabold rounded-md text-[10px]">ROOM</span>
                </td>
                <td className="px-4 py-3 font-bold text-slate-900">Room Accommodation (Standard Rate)</td>
                <td className="px-4 py-3 text-center">1</td>
                <td className="px-4 py-3 text-right text-slate-600">₹{roomCharges.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-bold text-slate-900">₹{roomCharges.toLocaleString()}</td>
              </tr>

              {/* F&B Orders */}
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-800 font-extrabold rounded-md text-[10px] flex items-center gap-1 w-fit">
                      <Coffee size={10} /> F&B DINING
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900">
                    Room Service Order #{o.id.slice(-6)} ({o.items?.length || 1} items)
                  </td>
                  <td className="px-4 py-3 text-center">1</td>
                  <td className="px-4 py-3 text-right text-slate-600">₹{o.totalAmount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">₹{o.totalAmount.toLocaleString()}</td>
                </tr>
              ))}

              {/* Custom Folio Charges */}
              {folioCharges.map((fc) => (
                <tr key={fc.id} className="bg-purple-50/30">
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 font-extrabold rounded-md text-[10px]">
                      {fc.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900">
                    {fc.description} <span className="text-[10px] text-slate-400 font-normal">({fc.author})</span>
                  </td>
                  <td className="px-4 py-3 text-center">{fc.quantity}</td>
                  <td className="px-4 py-3 text-right text-slate-600">₹{fc.unitPrice.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-extrabold text-purple-900">₹{fc.totalAmount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payments & Totals Summary Card */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-600">Room Accommodation</span>
            <span className="font-bold text-slate-900">₹{roomCharges.toLocaleString()}</span>
          </div>

          {orders.length > 0 && (
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-amber-800">F&B Room Service Total</span>
              <span className="font-bold text-amber-900">
                + ₹{orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}
              </span>
            </div>
          )}

          {folioCharges.length > 0 && (
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-purple-800">Custom Folio Charges & Services</span>
              <span className="font-bold text-purple-900">
                + ₹{folioCharges.reduce((sum, f) => sum + f.totalAmount, 0).toLocaleString()}
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-extrabold text-slate-900">
            <span>Grand Total Charges</span>
            <span className="text-base text-slate-900 font-black">₹{grandTotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center text-xs font-bold text-emerald-700 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} /> Total Payments Received
            </span>
            <span>- ₹{totalPaid.toLocaleString()}</span>
          </div>

          <div className="pt-2 border-t border-slate-300 flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">Remaining Balance Due</span>
              <p className="text-[10px] text-slate-500">Auto-settled during final checkout</p>
            </div>
            <span className={`text-xl font-black ${balanceDue > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              ₹{balanceDue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
