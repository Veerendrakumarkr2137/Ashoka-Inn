'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, Loader2, DollarSign, X, ShieldCheck, AlertTriangle, Tag, Layers } from 'lucide-react'

interface AddFolioChargeModalProps {
  bookingId: string
  guestName: string
  roomNumber?: string
}

const CHARGE_CATEGORIES = [
  { id: 'ROOM_SERVICE', label: 'Room Service / Dining' },
  { id: 'LAUNDRY', label: 'Laundry & Dry Cleaning' },
  { id: 'EXTRA_BED', label: 'Extra Bed / Extra Guest' },
  { id: 'TRANSPORT', label: 'Airport Pick-up / Transport' },
  { id: 'MINIBAR', label: 'Minibar & Refreshments' },
  { id: 'OTHER_SERVICES', label: 'Spa / Special Services' },
  { id: 'DAMAGE', label: 'Damage Charge' },
  { id: 'MISSING_ITEMS', label: 'Missing Inventory Item' },
  { id: 'CUSTOM', label: 'Custom Miscellaneous Charge' },
]

export function AddFolioChargeModal({ bookingId, guestName, roomNumber }: AddFolioChargeModalProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [category, setCategory] = useState('CUSTOM')
  const [description, setDescription] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [unitPrice, setUnitPrice] = useState('')
  const [taxAmount, setTaxAmount] = useState('0')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim() || !unitPrice || Number(unitPrice) <= 0) {
      setErrorMsg('Please enter a valid description and positive unit price.')
      return
    }

    setErrorMsg(null)
    setSuccessMsg(null)

    startTransition(async () => {
      try {
        const response = await fetch('/api/pms/folio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId,
            category,
            description: description.trim(),
            quantity: Number(quantity) || 1,
            unitPrice: Number(unitPrice),
            taxAmount: Number(taxAmount) || 0,
            source: 'FRONT_DESK',
            author: 'Front Desk Staff',
          }),
        })

        const res = await response.json()

        if (res && res.success) {
          setSuccessMsg('Charge posted to guest folio successfully!')
          setTimeout(() => {
            setIsOpen(false)
            setDescription('')
            setUnitPrice('')
            setTaxAmount('0')
            setSuccessMsg(null)
            router.refresh()
            window.location.reload()
          }, 600)
        } else {
          setErrorMsg(res?.error || 'Failed to post folio charge')
        }
      } catch (err: any) {
        console.error('Folio charge error:', err)
        setErrorMsg(err.message || 'Server error occurred')
      }
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        suppressHydrationWarning
        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-[#C6A96B] font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
      >
        <PlusCircle size={14} /> Add Folio Charge
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold flex items-center gap-2 text-[#C6A96B]">
                  <DollarSign size={18} /> Post Folio Charge
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Guest: <span className="font-bold text-white">{guestName}</span> • Room:{' '}
                  <span className="font-bold text-white">{roomNumber || 'N/A'}</span>
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                suppressHydrationWarning
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-start gap-2">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5 text-rose-600" />
                  <div>{errorMsg}</div>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <ShieldCheck size={16} className="shrink-0 text-emerald-600" />
                  <div>{successMsg}</div>
                </div>
              )}

              {/* Category */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Charge Category
                </label>
                <div className="relative">
                  <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C6A96B] transition-all appearance-none cursor-pointer"
                  >
                    {CHARGE_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Item / Service Description *
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input
                    type="text"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Extra Bed for 2 nights, Express Laundry, Pick-up Service"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C6A96B] transition-all"
                  />
                </div>
              </div>

              {/* Price & Quantity Breakdown */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C6A96B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Unit Price (₹) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    required
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    placeholder="500"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C6A96B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tax GST (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={taxAmount}
                    onChange={(e) => setTaxAmount(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C6A96B]"
                  />
                </div>
              </div>

              {/* Total Calculation Banner */}
              <div className="p-3 bg-slate-900 text-white rounded-xl text-xs flex items-center justify-between">
                <span className="text-slate-400 font-semibold">Total Charge to Add</span>
                <span className="font-extrabold text-[#C6A96B] text-sm">
                  ₹{(quantity * (Number(unitPrice) || 0) + (Number(taxAmount) || 0)).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Footer */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  suppressHydrationWarning
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isPending || !description.trim() || !unitPrice || !!successMsg}
                  suppressHydrationWarning
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-[#C6A96B] font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Posting Charge...
                    </>
                  ) : (
                    <>
                      <PlusCircle size={16} /> Post Charge to Folio
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
