'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  Bot, Search, Filter, PhoneCall, MessageSquare, Sparkles, 
  Calendar, CheckCircle2, AlertCircle, XCircle, ArrowUpRight, 
  User, RefreshCw, ChevronRight, X, Clock, Globe, ThumbsUp
} from 'lucide-react'

interface LogsClientProps {
  initialActivityLogs: any[]
  initialBookings: any[]
}

export function LogsClient({ initialActivityLogs, initialBookings }: LogsClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [channelFilter, setChannelFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sentimentFilter, setSentimentFilter] = useState('ALL')
  const [selectedLog, setSelectedLog] = useState<any | null>(null)

  // Construct realistic AI logs connecting real database bookings with AI metadata
  const conversationLogs = useMemo(() => {
    const defaultData = [
      {
        id: 'LOG-AI-9001',
        conversationId: 'CONV-8841-IN',
        bookingRef: initialBookings[0]?.bookingRef || 'BKG-2026-881',
        guestName: initialBookings[0]?.user?.name || 'Rahul Sharma',
        phone: initialBookings[0]?.user?.phone || '+91 98765 43210',
        channel: 'VOICE_CALL',
        status: 'RESOLVED',
        intent: 'Pre-Arrival Check-In Confirmation',
        sentiment: 'POSITIVE',
        language: 'English (India)',
        duration: '1m 24s',
        timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        summary: 'Guest confirmed arrival at 2:30 PM and requested extra towels for King Suite.',
        resolutionStatus: 'Auto-Confirmed & Notified Reception',
        transcript: [
          { sender: 'AI Agent', text: 'Namaste Mr. Sharma, this is Ashok Inn AI Reception confirming your reservation for today.' },
          { sender: 'Guest', text: 'Yes, hi! I am landing around 2 PM so I will reach the hotel by 2:30 PM.' },
          { sender: 'AI Agent', text: 'Wonderful! Your Deluxe Room is already assigned and prepared. Do you have any special requirements?' },
          { sender: 'Guest', text: 'Please arrange extra bath towels in the bathroom if possible.' },
          { sender: 'AI Agent', text: 'Duly noted! Extra towels have been added to your room preference note. Safe travels!' }
        ]
      },
      {
        id: 'LOG-AI-9002',
        conversationId: 'CONV-8842-WA',
        bookingRef: initialBookings[1]?.bookingRef || 'BKG-2026-882',
        guestName: initialBookings[1]?.user?.name || 'Priya Patel',
        phone: initialBookings[1]?.user?.phone || '+91 98123 45678',
        channel: 'WHATSAPP',
        status: 'RESOLVED',
        intent: 'In-Room Dining Menu Inquiry',
        sentiment: 'POSITIVE',
        language: 'English',
        duration: '2m 05s',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        summary: 'Sent digital menu for D Lounge Restaurant. Guest inquired about vegetarian options.',
        resolutionStatus: 'Menu Delivered via WhatsApp PDF',
        transcript: [
          { sender: 'Guest', text: 'Hi, can you send the dinner menu for D Lounge?' },
          { sender: 'AI Agent', text: 'Hello Ms. Patel! Here is the live menu for D Lounge: [PDF Link]. We feature North & South Indian pure-veg specialties.' },
          { sender: 'Guest', text: 'Great, thanks!' }
        ]
      },
      {
        id: 'LOG-AI-9003',
        conversationId: 'CONV-8843-VO',
        bookingRef: initialBookings[2]?.bookingRef || 'BKG-2026-883',
        guestName: 'Vikram Singh',
        phone: '+91 98345 67890',
        channel: 'VOICE_CALL',
        status: 'NO_ANSWER',
        intent: 'Arrival Time Verification',
        sentiment: 'NEUTRAL',
        language: 'Hindi',
        duration: '0s',
        timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        summary: 'Outgoing pre-arrival verification call unanswered.',
        resolutionStatus: 'Auto-Scheduled Follow-Up Call at 6 PM',
        transcript: [
          { sender: 'AI Agent', text: 'Attempting call to +91 98345 67890. Ringing (30s)... No response.' }
        ]
      },
      {
        id: 'LOG-AI-9004',
        conversationId: 'CONV-8844-IN',
        bookingRef: 'BKG-2026-884',
        guestName: 'Ananya Roy',
        phone: '+91 98456 78901',
        channel: 'IN_APP',
        status: 'ESCALATED',
        intent: 'Late Checkout Request',
        sentiment: 'NEGATIVE',
        language: 'English',
        duration: '3m 10s',
        timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
        summary: 'Guest requested complimentary 4 PM checkout due to flight delay. Escalated to Duty Manager.',
        resolutionStatus: 'Handed off to Front Desk Manager',
        transcript: [
          { sender: 'Guest', text: 'My flight was delayed to 8 PM. Can I check out at 4 PM without extra charge?' },
          { sender: 'AI Agent', text: 'I understand your flight was delayed Ms. Roy. Complimentary late checkout is available until 1 PM. For 4 PM checkout, standard half-day charges apply.' },
          { sender: 'Guest', text: 'I want to speak with a human manager please.' },
          { sender: 'AI Agent', text: 'Connecting you immediately to our Duty Desk Manager...' }
        ]
      }
    ]

    return defaultData
  }, [initialBookings])

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return conversationLogs.filter((log) => {
      const matchesSearch =
        searchTerm === '' ||
        log.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.bookingRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.phone.includes(searchTerm) ||
        log.intent.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesChannel = channelFilter === 'ALL' || log.channel === channelFilter
      const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter
      const matchesSentiment = sentimentFilter === 'ALL' || log.sentiment === sentimentFilter

      return matchesSearch && matchesChannel && matchesStatus && matchesSentiment
    })
  }, [conversationLogs, searchTerm, channelFilter, statusFilter, sentimentFilter])

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-slate-900 text-[#C6A96B] rounded-xl shadow-xs">
              <Bot size={20} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Reception & Chatbot Logs</h1>
          </div>
          <p className="text-xs text-slate-500">
            Real-time conversation logs, voice transcripts, intent analysis, and automated guest resolutions.
          </p>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex items-center gap-2">
          <Link
            href="/ai"
            className="px-3.5 py-2 bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Bot size={15} /> Overview
          </Link>
          <Link
            href="/ai/calls"
            className="px-3.5 py-2 bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <PhoneCall size={15} /> Voice Calls
          </Link>
          <Link
            href="/ai/logs"
            className="px-3.5 py-2 bg-slate-900 text-[#C6A96B] font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <MessageSquare size={15} /> Chatbot Logs
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Total AI Dialogues</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">128</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <MessageSquare size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Auto Resolution Rate</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">94.2%</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Voice AI Calls</p>
            <p className="text-2xl font-extrabold text-purple-600 mt-1">42</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <PhoneCall size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Guest Sentiment</p>
            <p className="text-2xl font-extrabold text-[#C6A96B] mt-1">98% Positive</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <ThumbsUp size={18} />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Guest, Phone, Booking #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#C6A96B]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Channel */}
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none cursor-pointer focus:border-[#C6A96B]"
          >
            <option value="ALL">All Channels</option>
            <option value="VOICE_CALL">Voice Call AI</option>
            <option value="WHATSAPP">WhatsApp Bot</option>
            <option value="IN_APP">In-App Concierge</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none cursor-pointer focus:border-[#C6A96B]"
          >
            <option value="ALL">All Statuses</option>
            <option value="RESOLVED">Resolved</option>
            <option value="ESCALATED">Escalated</option>
            <option value="NO_ANSWER">No Answer</option>
          </select>

          {/* Sentiment */}
          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none cursor-pointer focus:border-[#C6A96B]"
          >
            <option value="ALL">All Sentiments</option>
            <option value="POSITIVE">Positive</option>
            <option value="NEUTRAL">Neutral</option>
            <option value="NEGATIVE">Negative</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-16 p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Bot size={24} />
            </div>
            <p className="text-sm font-bold text-slate-800">No AI conversation logs match your filter</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search keyword or clearing channel/status filters.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setChannelFilter('ALL'); setStatusFilter('ALL'); setSentimentFilter('ALL') }}
              className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Channel</th>
                  <th className="py-3.5 px-4">Guest & Booking</th>
                  <th className="py-3.5 px-4">Intent</th>
                  <th className="py-3.5 px-4">Sentiment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Inspect Log</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-IN', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="py-3.5 px-4">
                      {log.channel === 'VOICE_CALL' ? (
                        <span className="px-2.5 py-1 bg-purple-50 text-purple-700 font-bold rounded-lg border border-purple-200 flex items-center gap-1 w-fit">
                          <PhoneCall size={12} /> Voice AI
                        </span>
                      ) : log.channel === 'WHATSAPP' ? (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200 flex items-center gap-1 w-fit">
                          <MessageSquare size={12} /> WhatsApp
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-200 flex items-center gap-1 w-fit">
                          <Bot size={12} /> In-App
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-slate-900">{log.guestName}</p>
                        <p className="text-[11px] text-[#C6A96B] font-mono font-semibold">{log.bookingRef}</p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {log.intent}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        log.sentiment === 'POSITIVE' ? 'bg-emerald-100 text-emerald-800' :
                        log.sentiment === 'NEGATIVE' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {log.sentiment}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold ${
                        log.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        log.status === 'ESCALATED' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {log.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-[#C6A96B] font-extrabold text-[11px] rounded-lg transition-colors cursor-pointer"
                      >
                        View Transcript
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal / Transcript Drawer */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C6A96B]/20 text-[#C6A96B] border border-[#C6A96B]/30 flex items-center justify-center font-bold">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">AI Conversation #{selectedLog.conversationId}</h3>
                  <p className="text-xs text-slate-400">{selectedLog.guestName} ({selectedLog.phone}) • {selectedLog.bookingRef}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto dark-scrollbar">
              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Channel</span>
                  <span className="font-bold text-slate-900">{selectedLog.channel}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Language</span>
                  <span className="font-bold text-slate-900">{selectedLog.language}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Duration</span>
                  <span className="font-bold text-slate-900">{selectedLog.duration}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Outcome</span>
                  <span className="font-bold text-emerald-700">{selectedLog.status}</span>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">AI Summary & Resolution</h4>
                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
                  {selectedLog.summary}
                </div>
              </div>

              {/* Dialogue Transcript */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Live Dialogue Transcript</h4>
                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                  {selectedLog.transcript?.map((item: any, i: number) => (
                    <div key={i} className={`flex flex-col ${item.sender === 'AI Agent' ? 'items-start' : 'items-end'}`}>
                      <span className="text-[10px] font-bold text-slate-400 mb-0.5">{item.sender}</span>
                      <div className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                        item.sender === 'AI Agent' 
                          ? 'bg-slate-800 text-white rounded-tl-none border border-slate-700' 
                          : 'bg-[#C6A96B] text-slate-950 font-medium rounded-tr-none'
                      }`}>
                        {item.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
              >
                Close Transcript
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
