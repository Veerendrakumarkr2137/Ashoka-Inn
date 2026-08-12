'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Coffee, Minus, Plus, ShoppingBag, CheckCircle2 } from 'lucide-react'
import { Button } from '@hospitality-os/ui/src/components/Button'
import { placeOrder } from '@/actions/room-service'

type ServiceItem = {
  id: string
  name: string
  description: string | null
  price: number
}

type ServiceCategory = {
  id: string
  name: string
  services: ServiceItem[]
}

type CartItem = ServiceItem & { quantity: number }

export function RoomServiceMenu({ 
  categories, 
  bookingId 
}: { 
  categories: ServiceCategory[],
  bookingId: string 
}) {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id || '')
  const [cart, setCart] = useState<Record<string, CartItem>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  const updateQuantity = (item: ServiceItem, delta: number) => {
    setCart(prev => {
      const current = prev[item.id]
      const currentQuantity = current ? current.quantity : 0
      const newQuantity = Math.max(0, currentQuantity + delta)

      if (newQuantity === 0) {
        const newCart = { ...prev }
        delete newCart[item.id]
        return newCart
      }

      return {
        ...prev,
        [item.id]: { ...item, quantity: newQuantity }
      }
    })
  }

  const cartItems = Object.values(cart)
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return
    
    setLoading(true)
    setError(null)
    
    const items = cartItems.map(item => ({
      serviceItemId: item.id,
      quantity: item.quantity
    }))

    const res = await placeOrder(bookingId, items)
    
    setLoading(false)
    if (res.success) {
      setSuccess(true)
      setCart({})
    } else {
      setError(res.error || 'Failed to place order.')
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-[24px] shadow-sm border border-black/5 p-12 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-emerald-600" />
        </div>
        <h3 className="text-3xl font-heading text-[#0F172A] mb-2">Order Received!</h3>
        <p className="text-[#6B7280] text-lg max-w-md mx-auto mb-8">
          Our kitchen is preparing your order. It will be delivered to your room shortly. The total amount has been added to your folio.
        </p>
        <Button onClick={() => setSuccess(false)} variant="outline">
          Order More
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Menu Area */}
      <div className="flex-1">
        {/* Category Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-6 dark-scrollbar">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                activeCategory === category.id 
                  ? 'bg-[#0F172A] text-white shadow-md' 
                  : 'bg-white text-[#6B7280] hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {categories.find(c => c.id === activeCategory)?.services.map(item => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={item.id} 
                className="bg-white rounded-[16px] p-5 border border-gray-100 shadow-sm flex flex-col justify-between"
              >
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-[#0F172A]">{item.name}</h4>
                    <span className="font-bold text-[#C6A96B]">₹{item.price}</span>
                  </div>
                  {item.description && (
                    <p className="text-sm text-[#6B7280] line-clamp-2">{item.description}</p>
                  )}
                </div>
                
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <button 
                      onClick={() => updateQuantity(item, -1)}
                      className="w-7 h-7 rounded flex items-center justify-center text-gray-500 hover:bg-white hover:text-gray-900 transition-colors shadow-sm"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-4 text-center text-sm font-bold text-[#0F172A]">
                      {cart[item.id]?.quantity || 0}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item, 1)}
                      className="w-7 h-7 rounded flex items-center justify-center text-gray-500 hover:bg-white hover:text-gray-900 transition-colors shadow-sm"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  {cart[item.id]?.quantity > 0 && (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">In Cart</span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Cart Sidebar (Desktop) or Drawer (Mobile overlay trigger) */}
      <div className="w-full lg:w-80 shrink-0 relative">
        <div className="sticky top-24 bg-white rounded-[24px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 bg-[#FDF9F0] rounded-full flex items-center justify-center text-[#C6A96B]">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-[#0F172A]">Your Tray</h3>
              <p className="text-xs text-[#6B7280]">{totalItems} items</p>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <Coffee size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-400">Your tray is empty.</p>
            </div>
          ) : (
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto dark-scrollbar pr-2">
              <AnimatePresence>
                {cartItems.map(item => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    key={item.id} 
                    className="flex justify-between text-sm"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-[#0F172A]">{item.quantity}x {item.name}</p>
                    </div>
                    <div className="font-semibold text-[#0F172A]">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-xs font-medium text-center border border-red-100">
              {error}
            </div>
          )}

          <div className="border-t border-gray-100 pt-4">
            <div className="flex justify-between items-end mb-6">
              <span className="font-semibold text-gray-500 text-sm">Total Amount</span>
              <span className="font-bold text-2xl text-[#0F172A]">₹{cartTotal.toLocaleString()}</span>
            </div>
            <Button 
              className="w-full" 
              size="lg" 
              disabled={cartItems.length === 0}
              isLoading={loading}
              onClick={handlePlaceOrder}
            >
              Order to Room
            </Button>
            <p className="text-center text-[10px] text-gray-400 mt-3 uppercase tracking-wider">
              Amount will be added to your final folio.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
