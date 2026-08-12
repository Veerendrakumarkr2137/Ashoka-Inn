'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Bell, Plus, UserPlus, BedDouble, Sparkles, CheckCircle2, AlertCircle, Clock, X, PhoneCall, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { AddBookingModal } from '@/components/AddBookingModal'

interface Notification {
  id: string
  title: string
  desc: string
  time: string
  unread: boolean
  type: 'success' | 'info' | 'warning' | 'ai'
}

const mockNotifications: Notification[] = [
  { id: '1', title: 'Room 204 Cleared', desc: 'Housekeeping marked Room 204 as Clean & Ready.', time: '3m ago', unread: true, type: 'success' },
  { id: '2', title: 'Guest Rahul Checked In', desc: 'Rahul Sharma checked into Room 102. Key card issued.', time: '8m ago', unread: true, type: 'success' },
  { id: '3', title: 'Payment Received', desc: 'Received ₹16,500 via UPI for BKG-2026-002 (Priya Kumar).', time: '14m ago', unread: true, type: 'success' },
  { id: '4', title: 'AI Reception Call', desc: 'AI Receptionist confirmed arrival for Rahul Sharma @ 09:00 AM.', time: '25m ago', unread: true, type: 'ai' },
  { id: '5', title: 'Housekeeping Completed', desc: 'Housekeeping completed deep clean for Room 305.', time: '45m ago', unread: false, type: 'info' },
]

export function Header() {
  const pathname = usePathname()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [showBellMenu, setShowBellMenu] = useState(false)
  const [isAddBookingOpen, setIsAddBookingOpen] = useState(false)

  // Do not render Header on login page
  if (pathname === '/login') {
    return null
  }

  const unreadCount = notifications.filter(n => n.unread).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  return (
    <>
      <header className="h-[var(--header-height)] bg-white border-b border-[var(--border-subtle)] flex items-center justify-between px-8 sticky top-0 z-40 shadow-xs">
        {/* Left: Title & Quick Actions */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-xs" />
            <div className="flex flex-col">
              <h1 className="text-xs font-extrabold text-slate-900 tracking-tight leading-none">Hotel Ashokha PMS</h1>
              <span className="text-[10px] text-emerald-700 font-bold leading-none mt-0.5">Live DB Sync: Online</span>
            </div>
          </div>

          {/* Quick Action Bar */}
          <div className="hidden lg:flex items-center gap-2 border-l border-slate-200 pl-6">
            <button
              onClick={() => setIsAddBookingOpen(true)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
              suppressHydrationWarning
            >
              <Plus size={14} className="text-[#C6A96B]" /> + Walk-in / New Booking
            </button>

            <Link
              href="/rooms"
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <BedDouble size={14} className="text-slate-500" /> Room Rack <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded-full">20 Free</span>
            </Link>

            <Link
              href="/housekeeping"
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/60 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Sparkles size={14} className="text-amber-600" /> Housekeeping <span className="text-[10px] bg-amber-200 text-amber-900 font-extrabold px-1.5 py-0.5 rounded-full">5 Dirty</span>
            </Link>

            <Link
              href="/ai"
              className="px-3 py-1.5 bg-[#C6A96B]/10 hover:bg-[#C6A96B]/20 text-[#9A7D3C] border border-[#C6A96B]/30 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <PhoneCall size={14} /> AI Calls <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse ml-0.5"></span><span className="text-[10px] font-mono text-amber-900 font-black">3 Pending</span>
            </Link>
          </div>
        </div>

        {/* Right: Notifications Bell & Receptionist Info */}
        <div className="flex items-center gap-5">
          <div className="text-right hidden sm:block">
            <div className="flex items-center gap-1.5 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-xs font-bold text-slate-900">🟢 Reception Online</p>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Shift: Morning • 2 Staff Active</p>
          </div>

          {/* Notification Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowBellMenu(prev => !prev)}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center relative transition-colors cursor-pointer"
              title="Notifications"
              suppressHydrationWarning
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Menu Popup */}
            {showBellMenu && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell size={16} className="text-[#C6A96B]" />
                    <h4 className="text-sm font-bold">Front Desk Operational Alerts</h4>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold bg-[#C6A96B] text-[#0F172A] rounded-full">
                        {unreadCount} New
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllRead} 
                      className="text-[11px] text-[#C6A96B] hover:underline font-semibold cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.map((n) => (
                    <div 
                      key={n.id}
                      className={`p-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3 ${n.unread ? 'bg-amber-50/30' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center mt-0.5 ${
                        n.type === 'success' ? 'bg-emerald-100 text-emerald-700' :
                        n.type === 'ai' ? 'bg-[#C6A96B]/20 text-[#9A7D3C]' :
                        n.type === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {n.type === 'success' && <CheckCircle2 size={16} />}
                        {n.type === 'ai' && <PhoneCall size={16} />}
                        {n.type === 'warning' && <AlertCircle size={16} />}
                        {n.type === 'info' && <Clock size={16} />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <p className="text-xs font-bold text-slate-900 truncate">{n.title}</p>
                          <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 leading-snug">{n.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                  <Link 
                    href="/bookings" 
                    onClick={() => setShowBellMenu(false)}
                    className="text-xs font-bold text-slate-900 hover:text-[#C6A96B] flex items-center justify-center gap-1"
                  >
                    View Operational Queue <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Walk-in Add Booking Modal */}
      <AddBookingModal isOpen={isAddBookingOpen} onClose={() => setIsAddBookingOpen(false)} />
    </>
  )
}
