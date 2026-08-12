import React from 'react'
import Link from 'next/link'
import { PhoneCall, CheckCircle2, Clock, PhoneOff, RotateCcw, Bot, MessageSquare, Sparkles, User, Play, ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminAiPage() {
  const aiStats = [
    { label: 'Calls Today', value: '26', icon: PhoneCall, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Confirmed Arrival', value: '18', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Calls', value: '4', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'No Response', value: '3', icon: PhoneOff, color: 'text-slate-600', bg: 'bg-slate-100' },
    { label: 'Callback Needed', value: '1', icon: RotateCcw, color: 'text-rose-600', bg: 'bg-rose-50' },
  ]

  const recentCalls = [
    {
      id: '1',
      guestName: 'Rahul Sharma',
      phone: '+91 98123 45678',
      time: '09:14 AM',
      intent: 'Arrival Confirmation',
      status: 'Completed',
      response: 'Confirmed arrival @ 2:00 PM',
      duration: '45s',
      transcript: `"Hello Mr. Rahul, Hotel Ashokha AI confirming your reservation BKG-2026-001 for today." -> "Yes, I will arrive at around 2 PM."`
    },
    {
      id: '2',
      guestName: 'John Thomas',
      phone: '+91 98345 67890',
      time: '10:02 AM',
      intent: 'Pre-Arrival Check-in',
      status: 'No Answer',
      response: 'Retry scheduled @ 6:00 PM',
      duration: '0s',
      transcript: `"Attempted call to +91 98345 67890. No answer. Auto-retry set for 18:00."`
    },
    {
      id: '3',
      guestName: 'Priya Kumar',
      phone: '+91 98234 56789',
      time: '11:20 AM',
      intent: 'Special Request',
      status: 'Completed',
      response: 'Requested Extra Pillow & Late Check-in',
      duration: '1m 12s',
      transcript: `"Guest confirmed check-in and requested high floor room with extra pillows."`
    },
    {
      id: '4',
      guestName: 'Ananya Verma',
      phone: '+91 98456 78901',
      time: '12:05 PM',
      intent: 'Cancellation Request',
      status: 'Cancelled Booking',
      response: 'Cancelled reservation via AI voice agent',
      duration: '52s',
      transcript: `"Guest requested cancellation due to travel delay. Reservation BKG-2026-004 cancelled."`
    }
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Reception & Voice Call Center</h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-[#C6A96B]/20 text-[#9A7D3C] rounded-full border border-[#C6A96B]/30">
              USP Module
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Autonomous AI phone receptionist for pre-arrival calls, confirmations, and WhatsApp automation.</p>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto dark-scrollbar">
        <Link
          href="/ai"
          className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2"
        >
          <Bot size={16} className="text-[#C6A96B]" /> AI Reception Overview
        </Link>
        <Link
          href="/ai/calls"
          className="px-4 py-2 bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors"
        >
          <PhoneCall size={16} /> Voice Calls (26)
        </Link>
        <Link
          href="/ai/whatsapp"
          className="px-4 py-2 bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors"
        >
          <MessageSquare size={16} /> WhatsApp Automation
        </Link>
        <Link
          href="/ai/logs"
          className="px-4 py-2 bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors"
        >
          <Sparkles size={16} /> Call Logs & Transcripts
        </Link>
      </div>

      {/* 5 KPI Stat Cards requested by user */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {aiStats.map((s) => (
          <div key={s.label} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.label}</span>
              <div className={`w-8 h-8 rounded-lg ${s.bg} ${s.color} flex items-center justify-center font-bold`}>
                <s.icon size={16} />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 mt-3">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent AI Calls Grid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">Recent AI Reception Calls</h3>
          <span className="text-xs font-bold text-slate-500">Live AI Agent Stream</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentCalls.map((call) => (
            <div 
              key={call.id}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3 hover:border-[#C6A96B]/50 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    {call.guestName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-xs">{call.guestName}</p>
                    <p className="text-[11px] text-slate-400">{call.phone}</p>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                  call.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                  call.status === 'No Answer' ? 'bg-slate-200 text-slate-700' : 'bg-rose-100 text-rose-800'
                }`}>
                  {call.status}
                </span>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs italic text-slate-700 leading-relaxed">
                {call.transcript}
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                <span>Outcome: <strong className="text-slate-900">{call.response}</strong></span>
                <span className="font-mono">{call.time} ({call.duration})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
