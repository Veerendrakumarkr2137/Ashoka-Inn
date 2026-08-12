'use client'

import React, { useState, useTransition } from 'react'
import { ClipboardCheck, CheckCircle2, AlertTriangle, Plus, ShieldAlert, Loader2, X } from 'lucide-react'
import { postDamageCharge } from '@/actions/bookings'
import { useRouter } from 'next/navigation'

interface RoomInspectionModalProps {
  bookingId: string
  roomNumber: string
}

const standardItems = [
  { id: '1', name: 'Bath Towels & Hand Towels', checked: true },
  { id: '2', name: 'Bedsheets & Pillows', checked: true },
  { id: '3', name: 'TV & AC Remotes', checked: true },
  { id: '4', name: 'Electric Kettle & Tray', checked: true },
  { id: '5', name: 'Hair Dryer & Hangers', checked: true },
  { id: '6', name: 'Glassware & Water Bottles', checked: true },
]

const presetDamages = [
  { label: 'Bath Towel Missing', amount: 600 },
  { label: 'Broken Electric Kettle', amount: 1200 },
  { label: 'Damaged Glassware', amount: 350 },
  { label: 'Stained Linen / Sheet', amount: 800 },
  { label: 'Missing Remote Control', amount: 500 },
]

export function RoomInspectionModal({ bookingId, roomNumber }: RoomInspectionModalProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState(standardItems)
  const [customDesc, setCustomDesc] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const [isPending, startTransition] = useTransition()
  const [successMsg, setSuccessMsg] = useState('')

  const toggleCheck = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i))
  }

  const handlePostPresetDamage = (desc: string, amount: number) => {
    startTransition(async () => {
      const res = await postDamageCharge(bookingId, desc, amount)
      if (res.success) {
        setSuccessMsg(`Posted ₹${amount.toLocaleString('en-IN')} for "${desc}" to guest folio!`)
        setTimeout(() => setSuccessMsg(''), 4000)
        router.refresh()
      }
    })
  }

  const handlePostCustomDamage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customDesc.trim() || !customAmount || isPending) return

    const amountNum = parseFloat(customAmount)
    if (isNaN(amountNum) || amountNum <= 0) return

    const descToSave = customDesc.trim()
    setCustomDesc('')
    setCustomAmount('')

    startTransition(async () => {
      const res = await postDamageCharge(bookingId, descToSave, amountNum)
      if (res.success) {
        setSuccessMsg(`Posted ₹${amountNum.toLocaleString('en-IN')} for "${descToSave}" to guest folio!`)
        setTimeout(() => setSuccessMsg(''), 4000)
        router.refresh()
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
        suppressHydrationWarning
      >
        <ClipboardCheck size={14} className="text-amber-700" />
        <span>Room Inspection & Damage Charges</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 space-y-4 p-6">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <ClipboardCheck size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Housekeeping Room Inspection (Room {roomNumber})</h3>
                  <p className="text-xs text-slate-500">Verify room inventory & post missing/damaged item charges to folio</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                suppressHydrationWarning
              >
                <X size={18} />
              </button>
            </div>

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Step 1: Inventory Checklist */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
                1. Standard Room Amenities Inventory Checklist
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {items.map(item => (
                  <label key={item.id} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100/80 transition-colors">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleCheck(item.id)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      suppressHydrationWarning
                    />
                    <span className={`font-semibold ${item.checked ? 'text-slate-900' : 'text-rose-600 line-through'}`}>
                      {item.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 2: Quick Damage Add-on */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-amber-600" /> 2. Preset Missing / Damaged Item Add-ons
              </span>
              <div className="flex flex-wrap gap-2">
                {presetDamages.map(p => (
                  <button
                    key={p.label}
                    onClick={() => handlePostPresetDamage(p.label, p.amount)}
                    disabled={isPending}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    suppressHydrationWarning
                  >
                    <Plus size={13} className="text-rose-600" />
                    <span>{p.label} (+₹{p.amount.toLocaleString('en-IN')})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Custom Damage Form */}
            <form onSubmit={handlePostCustomDamage} className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
                3. Custom Damage / Extra Fee Entry
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  placeholder="Charge Description (e.g. Broken Mirror)"
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#C6A96B]"
                  suppressHydrationWarning
                />
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Amount (₹)"
                  className="w-28 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-[#C6A96B]"
                  suppressHydrationWarning
                />
                <button
                  type="submit"
                  disabled={!customDesc.trim() || !customAmount || isPending}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                  suppressHydrationWarning
                >
                  {isPending ? <Loader2 size={14} className="animate-spin text-[#C6A96B]" /> : <Plus size={14} className="text-[#C6A96B]" />}
                  <span>Post to Bill</span>
                </button>
              </div>
            </form>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                suppressHydrationWarning
              >
                Done / Close Inspection
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
