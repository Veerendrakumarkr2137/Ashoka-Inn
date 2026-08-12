'use client'

import React, { useState } from 'react'
import { X, Plus, Trash2, Utensils, Coffee, ShoppingBag, CheckCircle2 } from 'lucide-react'
import { createServiceOrderAction } from '@/actions/restaurant'

interface ActiveBookingOption {
  id: string
  bookingRef: string
  guestName: string
  roomNumber: string
}

interface ServiceItemOption {
  id: string
  name: string
  price: number
  categoryName: string
}

interface NewOrderModalProps {
  isOpen: boolean
  onClose: () => void
  activeBookings: ActiveBookingOption[]
  serviceItems: ServiceItemOption[]
}

export function NewOrderModal({ isOpen, onClose, activeBookings, serviceItems }: NewOrderModalProps) {
  const [selectedBookingId, setSelectedBookingId] = useState<string>(activeBookings[0]?.id || '')
  const [selectedItems, setSelectedItems] = useState<Array<{ itemId: string; quantity: number }>>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleAddItem = (itemId: string) => {
    setSelectedItems(prev => {
      const existing = prev.find(i => i.itemId === itemId)
      if (existing) {
        return prev.map(i => i.itemId === itemId ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { itemId, quantity: 1 }]
    })
  }

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(prev => prev.filter(i => i.itemId !== itemId))
  }

  const handleQuantityChange = (itemId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(itemId)
    } else {
      setSelectedItems(prev => prev.map(i => i.itemId === itemId ? { ...i, quantity: qty } : i))
    }
  }

  const calculateTotal = () => {
    return selectedItems.reduce((sum, sel) => {
      const item = serviceItems.find(i => i.id === sel.itemId)
      return sum + (item ? item.price * sel.quantity : 0)
    }, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBookingId || selectedItems.length === 0) return

    setIsSubmitting(true)
    try {
      const itemsPayload = selectedItems.map(sel => {
        const item = serviceItems.find(i => i.id === sel.itemId)!
        return {
          itemId: sel.itemId,
          quantity: sel.quantity,
          price: item.price
        }
      })

      await createServiceOrderAction(selectedBookingId, itemsPayload)
      onClose()
      setSelectedItems([])
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl">
              <Utensils size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Create New POS / Room Service Order</h3>
              <p className="text-xs text-slate-500 font-medium">Add items directly to room kitchen display & folio.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Select Occupied Room / Guest */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Select Occupied Room & Guest
            </label>
            <select
              value={selectedBookingId}
              onChange={(e) => setSelectedBookingId(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#C6A96B]"
              required
            >
              {activeBookings.map(b => (
                <option key={b.id} value={b.id}>
                  Room {b.roomNumber} - {b.guestName} ({b.bookingRef})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Add Menu Grid */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Select Items from Menu
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
              {serviceItems.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleAddItem(item.id)}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-left flex items-center justify-between hover:border-amber-400 hover:bg-amber-50/40 transition-all text-xs group"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 group-hover:text-amber-900">{item.name}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{item.categoryName}</span>
                  </div>
                  <span className="font-extrabold text-emerald-700 font-mono">₹{item.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Order Summary */}
          {selectedItems.length > 0 && (
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Current Order Basket ({selectedItems.length} items)
              </label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {selectedItems.map(sel => {
                  const item = serviceItems.find(i => i.id === sel.itemId)
                  if (!item) return null

                  return (
                    <div key={sel.itemId} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-xl text-xs">
                      <span className="font-bold text-slate-900">{item.name}</span>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-slate-200">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(sel.itemId, sel.quantity - 1)}
                            className="text-slate-500 hover:text-slate-900 font-bold px-1"
                          >
                            -
                          </button>
                          <span className="font-mono font-extrabold text-slate-800">{sel.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(sel.itemId, sel.quantity + 1)}
                            className="text-slate-500 hover:text-slate-900 font-bold px-1"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-extrabold font-mono text-emerald-700 w-16 text-right">
                          ₹{item.price * sel.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(sel.itemId)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Total Calculation */}
              <div className="flex items-center justify-between p-3 bg-slate-900 text-white rounded-xl text-sm font-bold">
                <span>Total Amount (Billed to Folio)</span>
                <span className="text-base text-[#C6A96B] font-mono font-extrabold">
                  ₹{calculateTotal().toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || selectedItems.length === 0}
              className="px-5 py-2 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <CheckCircle2 size={15} />
              <span>{isSubmitting ? 'Sending to Kitchen...' : 'Send Order to Kitchen'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
