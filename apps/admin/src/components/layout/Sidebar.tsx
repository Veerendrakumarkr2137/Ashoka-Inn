'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { logout } from '@/actions/auth'
import { cn } from '@hospitality-os/utils'
import { 
  LayoutDashboard, CalendarDays, BedDouble, Users, 
  Sparkles, Coffee, Utensils, ReceiptText, Settings,
  Bot, ShieldCheck, LineChart, LogOut, ChevronDown, MessageSquare
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: string
}

interface NavGroup {
  title: string
  icon: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    title: 'Operations',
    icon: '🏨',
    items: [
      { label: 'Dashboard', href: '/', icon: LayoutDashboard },
      { label: 'Bookings', href: '/bookings', icon: CalendarDays },
      { label: 'Room Rack', href: '/rooms', icon: BedDouble },
      { label: 'Calendar Grid', href: '/calendar', icon: CalendarDays },
      { label: 'Guests', href: '/guests', icon: Users },
    ]
  },
  {
    title: 'Services',
    icon: '🛎',
    items: [
      { label: 'Housekeeping', href: '/housekeeping', icon: Sparkles },
      { label: 'Multi-Service Hub', href: '/service-hub', icon: Utensils },
      { label: 'Restaurant', href: '/restaurant', icon: Utensils },
      { label: 'Room Service', href: '/room-service', icon: Coffee },
    ]
  },
  {
    title: 'Finance',
    icon: '💰',
    items: [
      { label: 'Invoices & Payments', href: '/finance', icon: ReceiptText },
      { label: 'Reports', href: '/reports', icon: LineChart },
    ]
  },
  {
    title: 'AI Automation',
    icon: '🤖',
    items: [
      { label: 'AI Reception', href: '/ai', icon: Bot, badge: 'USP' },
      { label: 'Chatbot Logs', href: '/ai/logs', icon: MessageSquare },
    ]
  },
  {
    title: 'Settings',
    icon: '⚙',
    items: [
      { label: 'Super Admin Settings', href: '/settings', icon: Settings },
      { label: 'Audit Trail Logs', href: '/activity', icon: ShieldCheck },
    ]
  }
]

export function Sidebar() {
  const pathname = usePathname()
  
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'Operations': true,
    'Services': true,
    'Finance': true,
    'AI Automation': true,
    'Settings': true,
  })

  // Do not render sidebar on login page
  if (pathname === '/login') {
    return null
  }

  const toggleGroup = (title: string) => {
    setOpenGroups(prev => ({ ...prev, [title]: !prev[title] }))
  }

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await logout()
    } catch (err) {
      // NEXT_REDIRECT throws internally in Next.js server actions
    }
  }

  return (
    <aside className="w-[var(--sidebar-width)] h-screen fixed left-0 top-0 bg-[var(--bg-sidebar)] flex flex-col border-r border-[var(--border-sidebar)] z-50 select-none">
      
      {/* Brand Header */}
      <div className="h-[var(--header-height)] flex items-center justify-between px-6 border-b border-[var(--border-sidebar)] shrink-0">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#C6A96B] flex items-center justify-center shadow-sm">
            <ShieldCheck size={18} className="text-[#0F172A]" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold tracking-wide text-sm font-sans">Ashok Inn</span>
            <span className="text-[#C6A96B] text-[10px] uppercase font-bold tracking-widest leading-none mt-0.5">Admin PMS</span>
          </div>
        </Link>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto dark-scrollbar py-4 px-3 space-y-4">
        {navGroups.map((group) => {
          const isOpen = openGroups[group.title] ?? true
          const hasActiveChild = group.items.some(
            item => pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          )

          return (
            <div key={group.title} className="rounded-xl transition-all">
              {/* Group Title Bar / Accordion Header */}
              <button
                onClick={() => toggleGroup(group.title)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-bold text-[var(--text-muted)] hover:text-white uppercase tracking-wider transition-colors rounded-md group"
                suppressHydrationWarning
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm opacity-80">{group.icon}</span>
                  <span className={cn('transition-colors', hasActiveChild && 'text-[#C6A96B]')}>
                    {group.title}
                  </span>
                </div>
                <ChevronDown 
                  size={14} 
                  className={cn('transition-transform duration-200 opacity-60 group-hover:opacity-100', isOpen && 'rotate-180')} 
                />
              </button>

              {/* Group Items */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden space-y-1 mt-1 pl-1"
                  >
                    {group.items.map((item) => {
                      const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                      
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          className={cn(
                            'flex items-center justify-between px-3 py-2 rounded-[8px] text-sm font-medium transition-all relative group',
                            isActive 
                              ? 'text-white bg-white/10 shadow-sm' 
                              : 'text-[var(--text-sidebar)] hover:text-white hover:bg-white/5'
                          )}
                        >
                          {isActive && (
                            <motion.div 
                              layoutId="active-nav-indicator"
                              className="absolute left-0 top-[12%] bottom-[12%] w-[3.5px] bg-[#C6A96B] rounded-r-full"
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                          <div className="flex items-center gap-3">
                            <item.icon size={17} className={cn(
                              'transition-colors',
                              isActive ? 'text-[#C6A96B]' : 'text-[var(--text-muted)] group-hover:text-white'
                            )} />
                            <span>{item.label}</span>
                          </div>

                          {item.badge && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#C6A96B]/20 text-[#C6A96B] border border-[#C6A96B]/30">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* User Profile & Logout Footer */}
      <div className="p-4 border-t border-[var(--border-sidebar)] flex flex-col gap-2 shrink-0">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-[#C6A96B] text-[#0F172A] flex items-center justify-center text-sm font-bold shrink-0">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Super Admin</p>
            <p className="text-xs text-[var(--text-muted)] truncate">admin@hotelashokha.com</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          suppressHydrationWarning
          className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group text-[var(--text-sidebar)] hover:text-red-400 hover:bg-red-400/10 w-full"
        >
          <LogOut size={16} className="transition-colors group-hover:text-red-400" />
          <span className="text-sm font-medium tracking-wide">Log Out</span>
        </button>
      </div>
    </aside>
  )
}
