'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Loader2, CreditCard, Banknote, QrCode, AlertCircle, X, ShieldCheck } from 'lucide-react'

interface CheckoutActionButtonProps {
  bookingId: string
  guestName: string
  roomNumber?: string
  totalAmount: number
  hasPendingPayment?: boolean
}

export function CheckoutActionButton({
  bookingId,
  guestName,
  roomNumber,
  totalAmount,
  hasPendingPayment = true,
}: CheckoutActionButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'CARD'>('CASH')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleConfirmCheckout = () => {
    setErrorMsg(null)
    setSuccessMsg(null)

    startTransition(async () => {
      try {
        const response = await fetch('/api/pms/check-out', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId,
            paymentMethod,
          }),
        })

        const res = await response.json()

        if (res && res.success) {
          setSuccessMsg(res.message || 'Check-out completed successfully!')
          setTimeout(() => {
            setIsOpen(false)
            router.refresh()
            window.location.reload()
          }, 600)
        } else {
          setErrorMsg(res?.error || 'Failed to process check-out')
        }
      } catch (err: any) {
        console.error('Checkout fetch error:', err)
        setErrorMsg(err.message || 'Server error occurred during check-out.')
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
      >
        <CheckCircle2 size={14} /> Process Check-Out & Settle
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold flex items-center gap-2">
                  <CheckCircle2 size={18} /> Front Desk Check-Out Protocol
                </h3>
                <p className="text-xs text-amber-100 mt-0.5">
                  Guest: <span className="font-bold text-white">{guestName}</span> • Room:{' '}
                  <span className="font-bold text-white">{roomNumber || 'Unassigned'}</span>
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-amber-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Messages */}
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
                  <div>{errorMsg}</div>
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <ShieldCheck size={16} className="shrink-0 text-emerald-600" />
                  <div>{successMsg}</div>
                </div>
              )}

              {/* Settlement Summary */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Total Folio Charge</span>
                  <span className="font-bold text-slate-900">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Payment Settlement</span>
                  <span className="font-bold text-emerald-600">Auto-Settle at Counter</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-extrabold">
                  <span className="text-slate-700">Room Post-Checkout Status</span>
                  <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    🔴 DIRTY (Needs Cleaning)
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Settlement Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CASH')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'CASH'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Banknote size={18} className={paymentMethod === 'CASH' ? 'text-amber-600' : 'text-slate-400'} />
                    Cash
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'UPI'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode size={18} className={paymentMethod === 'UPI' ? 'text-amber-600' : 'text-slate-400'} />
                    UPI / QR
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'CARD'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard size={18} className={paymentMethod === 'CARD' ? 'text-amber-600' : 'text-slate-400'} />
                    POS Card
                  </button>
                </div>
              </div>

              {/* Automated Actions Info */}
              <div className="text-[11px] text-slate-500 bg-amber-50/50 p-3 rounded-xl border border-amber-100 leading-relaxed">
                ⚡ <strong>System Automations Triggered on Confirm:</strong>
                <ul className="list-disc pl-4 mt-1 space-y-0.5">
                  <li>Room status automatically changes to <strong>DIRTY</strong>.</li>
                  <li>Auto-creates <strong>CLEANING task</strong> for Housekeeping staff.</li>
                  <li>Folio is locked and recorded in <strong>Activity Log</strong>.</li>
                </ul>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmCheckout}
                disabled={isPending || !!successMsg}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Processing Check-Out...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} /> Confirm Check-Out & Settle
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
