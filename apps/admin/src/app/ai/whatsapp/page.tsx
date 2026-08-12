import React from 'react'
import Link from 'next/link'
import { PhoneCall, Bot, MessageSquare, Sparkles, Send, CheckCheck } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AiWhatsAppPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">WhatsApp Automation & Vouchers</h1>
        <p className="text-sm text-slate-500 mt-1">Automated WhatsApp reservation vouchers, digital key passes, and concierge support.</p>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <Link href="/ai" className="px-4 py-2 bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 font-bold text-xs rounded-xl flex items-center gap-2">
          <Bot size={16} /> AI Reception Overview
        </Link>
        <Link href="/ai/calls" className="px-4 py-2 bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 font-bold text-xs rounded-xl flex items-center gap-2">
          <PhoneCall size={16} /> Voice Calls (26)
        </Link>
        <Link href="/ai/whatsapp" className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-2">
          <MessageSquare size={16} className="text-[#C6A96B]" /> WhatsApp Automation
        </Link>
        <Link href="/ai/logs" className="px-4 py-2 bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 font-bold text-xs rounded-xl flex items-center gap-2">
          <Sparkles size={16} /> Call Logs
        </Link>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">WhatsApp Automated Message Logs</h3>
        <p className="text-xs text-slate-500">Automated check-in vouchers, WiFi details, and room service menus sent via WhatsApp API.</p>
      </div>
    </div>
  )
}
