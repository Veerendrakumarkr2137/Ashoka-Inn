'use client'

import React, { useState, useTransition } from 'react'
import { 
  Utensils, Clock, CheckCircle, Car, Shirt, Sparkles, Plus, AlertTriangle, ConciergeBell
} from 'lucide-react'

export function ServiceHubClient({ orders, serviceItems, occupiedBookings }: { orders: any[]; serviceItems: any[]; occupiedBookings: any[] }) {
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'FOOD' | 'LAUNDRY' | 'TAXI' | 'HOUSEKEEPING'>('ALL')

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-lg bg-[#C8A96A]/10 text-[#C8A96A] border border-[#C8A96A]/20">
              <Utensils size={20} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Multi-Service Hub & KDS Engine</h1>
          </div>
          <p className="text-xs text-white/60">
            Real-time status tracking for Room Dining, Laundry, Taxi Requests & Housekeeping. All charges automatically post to guest folio.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-3">
        {[
          { id: 'ALL', label: 'All Orders', icon: Utensils },
          { id: 'FOOD', label: 'In-Room Dining', icon: Utensils },
          { id: 'LAUNDRY', label: 'Laundry Service', icon: Shirt },
          { id: 'TAXI', label: 'Taxi & Shuttle', icon: Car },
          { id: 'HOUSEKEEPING', label: 'Room Requests', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeCategory === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#C8A96A] text-[#07121E] shadow-lg font-bold'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-[#0B1726] rounded-2xl border border-white/10 text-white/50 text-xs">
            No active service orders found in queue.
          </div>
        ) : (
          orders.map((order) => {
            const roomNum = order.booking?.allocations[0]?.room?.roomNumber || 'N/A'
            const guestName = order.booking?.user?.name || 'Guest'
            const statusColor = 
              order.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
              order.status === 'PREPARING' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
              'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'

            return (
              <div key={order.id} className="bg-[#0B1726] p-5 rounded-2xl border border-white/10 space-y-4 hover:border-white/20 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">Room {roomNum}</span>
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${statusColor}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="text-xs text-white/60 font-light">
                    Guest: <span className="text-white font-semibold">{guestName}</span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between text-xs">
                        <span className="text-white/80">{item.quantity}x {item.serviceItem.name}</span>
                        <span className="text-white/50">₹{(item.priceAtTime * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                  <span className="text-xs text-white/50">Total Folio Charge:</span>
                  <span className="text-sm font-bold text-[#C8A96A]">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
