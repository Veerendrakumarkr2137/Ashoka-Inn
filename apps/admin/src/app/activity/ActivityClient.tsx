'use client'

import React, { useState, useMemo } from 'react'
import { 
  History, ShieldCheck, DoorOpen, Sparkles, AlertTriangle, 
  CreditCard, Utensils, Settings, Clock, User, Search, Filter, Bot, Key
} from 'lucide-react'

interface ActivityClientProps {
  initialLogs: any[]
}

export function ActivityClient({ initialLogs }: ActivityClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [authorFilter, setAuthorFilter] = useState('ALL')

  const categories = ['ALL', 'BOOKING', 'ROOM', 'HOUSEKEEPING', 'INSPECTION', 'DAMAGE', 'PAYMENT', 'SERVICE', 'SETTINGS', 'AI']

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'BOOKING':
        return { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: DoorOpen }
      case 'ROOM':
        return { bg: 'bg-[#C6A96B]/10 text-[#9A7D3C] border-[#C6A96B]/30', icon: Key }
      case 'HOUSEKEEPING':
        return { bg: 'bg-cyan-50 text-cyan-700 border-cyan-200', icon: Sparkles }
      case 'INSPECTION':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: ShieldCheck }
      case 'DAMAGE':
        return { bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: AlertTriangle }
      case 'PAYMENT':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: CreditCard }
      case 'SERVICE':
        return { bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: Utensils }
      case 'AI':
        return { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Bot }
      default:
        return { bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: Settings }
    }
  }

  const authorsList = useMemo(() => {
    const authors = new Set<string>()
    initialLogs.forEach((l) => { if (l.author) authors.add(l.author) })
    return Array.from(authors)
  }, [initialLogs])

  const filteredLogs = useMemo(() => {
    return initialLogs.filter((log) => {
      const matchesSearch =
        searchTerm === '' ||
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.bookingId && log.bookingId.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = categoryFilter === 'ALL' || log.category === categoryFilter
      const matchesAuthor = authorFilter === 'ALL' || log.author === authorFilter

      return matchesSearch && matchesCategory && matchesAuthor
    })
  }, [initialLogs, searchTerm, categoryFilter, authorFilter])

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-slate-900 text-[#C6A96B] rounded-xl shadow-xs">
              <History size={20} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Audit Trail & Operational Security Logs</h1>
          </div>
          <p className="text-xs text-slate-500">
            Immutable system audit logs recording room state transitions, task lifecycles, folio damage billings, AI triggers, and check-in/outs.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl border border-slate-200/80 shadow-xs text-xs font-bold text-slate-700">
          <Clock size={14} className="text-[#C6A96B]" />
          <span>Real-time System Audit Stream</span>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit trail by keyword, actor, or action..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#C6A96B]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none cursor-pointer focus:border-[#C6A96B]"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>
            ))}
          </select>

          {/* Actor / Author */}
          <select
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none cursor-pointer focus:border-[#C6A96B]"
          >
            <option value="ALL">All Actors & Staff</option>
            {authorsList.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Stream List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs font-bold space-y-2">
            <History size={28} className="mx-auto text-slate-300" />
            <p>No audit trail logs match your filter criteria.</p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-[2px] before:bg-slate-200">
            {filteredLogs.map((log) => {
              const badge = getCategoryBadge(log.category)
              const Icon = badge.icon

              return (
                <div key={log.id} className="relative flex items-start justify-between gap-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-all">
                  {/* Icon badge on timeline line */}
                  <div className={`absolute -left-6 top-4 w-5 h-5 rounded-full ${badge.bg} border flex items-center justify-center -translate-x-1/2 shadow-xs`}>
                    <Icon size={12} />
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider border ${badge.bg}`}>
                        {log.category}
                      </span>
                      <span className="text-xs font-extrabold text-slate-900">
                        {log.action}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {log.message}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1 font-bold text-slate-600">
                        <User size={12} className="text-[#C6A96B]" />
                        {log.author}
                      </span>
                      <span>•</span>
                      <span className="font-mono" suppressHydrationWarning>
                        {new Date(log.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
