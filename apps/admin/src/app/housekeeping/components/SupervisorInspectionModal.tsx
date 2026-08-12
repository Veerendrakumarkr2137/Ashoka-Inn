'use client'

import React, { useState, useTransition } from 'react'
import { CheckCircle2, ShieldCheck, X, Loader2, AlertTriangle, DollarSign } from 'lucide-react'
import { submitInspection } from '@/actions/tasks'
import { useRouter } from 'next/navigation'

interface SupervisorInspectionModalProps {
  roomId: string
  roomNumber: string
  bookingId?: string
  taskId?: string
  damageConfigs?: Array<{ itemName: string; price: number }>
}

const defaultDamageItems = [
  { itemName: 'Bath Towel', price: 600 },
  { itemName: 'Hand Towel', price: 300 },
  { itemName: 'AC Remote', price: 1200 },
  { itemName: 'TV Remote', price: 1000 },
  { itemName: 'Electric Kettle', price: 1500 },
  { itemName: 'Glass Tumbler', price: 200 },
  { itemName: 'Bedsheet Set', price: 1800 },
  { itemName: 'Hair Dryer', price: 2500 },
]

export function SupervisorInspectionModal({
  roomId,
  roomNumber,
  bookingId,
  taskId,
  damageConfigs,
}: SupervisorInspectionModalProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [inspectorName, setInspectorName] = useState('Housekeeping Supervisor')
  const [notes, setNotes] = useState('')

  // Inventory Checklist Status: OK | MISSING | DAMAGED
  const inventoryItems = damageConfigs && damageConfigs.length > 0 ? damageConfigs : defaultDamageItems
  const [itemsStatus, setItemsStatus] = useState<Record<string, 'OK' | 'MISSING' | 'DAMAGED'>>(
    Object.fromEntries(inventoryItems.map((i) => [i.itemName, 'OK']))
  )

  const handleStatusChange = (itemName: string, status: 'OK' | 'MISSING' | 'DAMAGED') => {
    setItemsStatus((prev) => ({ ...prev, [itemName]: status }))
  }

  // Calculate total damage
  const damagedItems = inventoryItems.filter(
    (i) => itemsStatus[i.itemName] === 'MISSING' || itemsStatus[i.itemName] === 'DAMAGED'
  )
  const totalDamageCharge = damagedItems.reduce((acc, i) => acc + i.price, 0)
  const isPassed = damagedItems.length === 0

  const handleSubmit = () => {
    startTransition(async () => {
      const payloadItems = inventoryItems.map((i) => ({
        itemName: i.itemName,
        status: itemsStatus[i.itemName] || 'OK',
        unitPrice: i.price,
      }))

      const res = await submitInspection({
        taskId,
        roomId,
        bookingId,
        inspector: inspectorName,
        items: payloadItems,
        notes,
      })

      if (res.success) {
        setIsOpen(false)
        router.refresh()
      } else {
        alert(res.error || 'Failed to submit inspection')
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1"
        suppressHydrationWarning
      >
        <ShieldCheck size={14} />
        <span>Supervisor QA</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 space-y-4 p-6 text-left">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Supervisor Final Inspection (Room {roomNumber})</h3>
                  <p className="text-xs text-slate-500">Quality check room inventory. Damaged/missing items auto-bill to folio.</p>
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

            {/* Inventory Checklist Grid */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
                Room Inventory Checklist & Condition
              </span>
              
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {inventoryItems.map((item) => {
                  const currentStatus = itemsStatus[item.itemName] || 'OK'
                  return (
                    <div key={item.itemName} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{item.itemName}</span>
                        <span className="text-[10px] text-slate-500">Standard Rate: ₹{item.price.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(item.itemName, 'OK')}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                            currentStatus === 'OK'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          ✓ OK
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(item.itemName, 'MISSING')}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                            currentStatus === 'MISSING'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Missing
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(item.itemName, 'DAMAGED')}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                            currentStatus === 'DAMAGED'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Damaged
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Damage Summary Banner */}
            {totalDamageCharge > 0 && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-900 font-bold">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-rose-600" />
                  <span>Damages Found: {damagedItems.map((i) => i.itemName).join(', ')}</span>
                </div>
                <span className="text-rose-700 font-extrabold">+₹{totalDamageCharge.toLocaleString('en-IN')} Folio Charge</span>
              </div>
            )}

            {/* Supervisor Notes */}
            <div>
              <label className="text-[11px] text-slate-500 font-bold block mb-1">Supervisor Notes / Remarks</label>
              <input
                type="text"
                placeholder="Optional inspection remarks..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                suppressHydrationWarning
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={isPending}
                className={`px-4 py-2 ${isPassed ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'} text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs`}
                suppressHydrationWarning
              >
                {isPending ? <Loader2 size={14} className="animate-spin" /> : isPassed ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                <span>{isPassed ? 'Approve & Mark Room READY' : `Post Damage Charge (₹${totalDamageCharge.toLocaleString('en-IN')})`}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
