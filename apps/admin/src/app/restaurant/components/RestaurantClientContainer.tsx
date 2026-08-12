'use client'

import React, { useState } from 'react'
import { Plus, Clock, ChefHat, CheckCircle2, DollarSign, Utensils } from 'lucide-react'
import { updateOrderStatusAction } from '@/actions/restaurant'
import { NewOrderModal } from './NewOrderModal'

interface OrderItem {
  id: string
  status: string
  totalAmount: number
  createdAt: string | Date
  booking: {
    user: { name: string | null }
    allocations: Array<{ room: { roomNumber: string } }>
  }
  items: Array<{
    quantity: number
    serviceItem: { name: string }
  }>
}

interface RestaurantClientContainerProps {
  orders: OrderItem[]
  activeBookings: Array<{ id: string; bookingRef: string; guestName: string; roomNumber: string }>
  serviceItems: Array<{ id: string; name: string; price: number; categoryName: string }>
}

const formatTimeString = (dateInput: string | Date) => {
  const d = new Date(dateInput)
  let hours = d.getHours()
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  return `${hours}:${minutes} ${ampm}`
}

export function RestaurantClientContainer({ orders, activeBookings, serviceItems }: RestaurantClientContainerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const pendingOrders = orders.filter(o => o.status === 'PENDING')
  const preparingOrders = orders.filter(o => o.status === 'PREPARING')
  const completedOrders = orders.filter(o => o.status === 'DELIVERED' || o.status === 'COMPLETED')
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0)

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Restaurant & Room Service KDS/POS</h1>
          <p className="text-sm text-slate-500 mt-1">Live Kitchen Display System (KDS), room service order fulfillment, and folio billing.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Plus size={16} />
          <span>New POS / Room Service Order</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={15} /> Pending Orders
            </span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-200 text-amber-900 rounded-full">New</span>
          </div>
          <p className="text-3xl font-extrabold text-amber-900 mt-3">{pendingOrders.length}</p>
        </div>

        <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
              <ChefHat size={15} /> In Kitchen / Preparing
            </span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-200 text-blue-900 rounded-full">Active</span>
          </div>
          <p className="text-3xl font-extrabold text-blue-900 mt-3">{preparingOrders.length}</p>
        </div>

        <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 size={15} /> Delivered & Completed
            </span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-200 text-emerald-900 rounded-full">Done</span>
          </div>
          <p className="text-3xl font-extrabold text-emerald-900 mt-3">{completedOrders.length}</p>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xs flex flex-col justify-between text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign size={15} className="text-[#C6A96B]" /> F&B Revenue Today
            </span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-[#C6A96B] text-[#0F172A] rounded-full">Live</span>
          </div>
          <p className="text-3xl font-extrabold text-[#C6A96B] mt-3">₹{totalRevenue.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Active Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-900">Active Kitchen Queue ({orders.length} Total Orders)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Order Ref</th>
                <th className="px-6 py-3.5">Room & Guest</th>
                <th className="px-6 py-3.5">Items Ordered</th>
                <th className="px-6 py-3.5">Total Amount</th>
                <th className="px-6 py-3.5">KDS Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No active restaurant orders. New guest orders will appear here automatically.
                  </td>
                </tr>
              ) : orders.map((order) => {
                const room = order.booking.allocations[0]?.room
                const isPending = order.status === 'PENDING'
                const isPreparing = order.status === 'PREPARING'
                const isDelivered = order.status === 'DELIVERED' || order.status === 'COMPLETED'

                const handleAccept = updateOrderStatusAction.bind(null, order.id, 'PREPARING')
                const handleDeliver = updateOrderStatusAction.bind(null, order.id, 'DELIVERED')

                return (
                  <tr key={order.id} className={`hover:bg-slate-50/80 transition-colors ${isPending ? 'bg-amber-50/20' : ''}`}>
                    <td className="px-6 py-4">
                      <span className="font-extrabold text-slate-900 font-mono">ORD-{order.id.substring(order.id.length - 6).toUpperCase()}</span>
                      <p className="text-[11px] text-slate-400 font-mono" suppressHydrationWarning>
                        {formatTimeString(order.createdAt)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">Room {room?.roomNumber || 'Walk-in Table'}</span>
                        <span className="text-[11px] text-slate-500">{order.booking.user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        {order.items.map((item, idx) => (
                          <span key={idx} className="text-xs font-medium text-slate-800">
                            {item.quantity}x {item.serviceItem.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-extrabold text-emerald-700 text-sm">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                      <p className="text-[10px] text-slate-400 font-medium">Billed to Folio</p>
                    </td>
                    <td className="px-6 py-4">
                      {isPending && (
                        <span className="px-2.5 py-1 text-xs font-extrabold bg-amber-50 text-amber-800 rounded-full border border-amber-200">
                          ⏳ Pending Kitchen
                        </span>
                      )}
                      {isPreparing && (
                        <span className="px-2.5 py-1 text-xs font-extrabold bg-blue-50 text-blue-800 rounded-full border border-blue-200">
                          🍳 Preparing in Kitchen
                        </span>
                      )}
                      {isDelivered && (
                        <span className="px-2.5 py-1 text-xs font-extrabold bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                          ✓ Delivered & Billed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isPending && (
                          <form action={handleAccept}>
                            <button
                              type="submit"
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                            >
                              🍳 Accept & Start Cooking
                            </button>
                          </form>
                        )}
                        {isPreparing && (
                          <form action={handleDeliver}>
                            <button
                              type="submit"
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                            >
                              🚀 Out for Room Delivery
                            </button>
                          </form>
                        )}
                        {isDelivered && (
                          <span className="text-xs text-slate-400 italic font-semibold">Folio Billed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <NewOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeBookings={activeBookings}
        serviceItems={serviceItems}
      />
    </div>
  )
}
