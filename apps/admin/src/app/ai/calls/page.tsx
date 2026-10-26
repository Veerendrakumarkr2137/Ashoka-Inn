import React from 'react'
import Link from 'next/link'
import { prisma } from '@hospitality-os/database'
import { PhoneCall, Bot, MessageSquare, Sparkles, Phone, CheckCircle2, PhoneOff, Clock, User, ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AiCallsPage() {
  const callSessions = await prisma.aiCallSession.findMany({
    include: {
      booking: {
        include: {
          user: true,
          allocations: { include: { room: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 30,
  })

  // Map real database AI call sessions
  const callsList = callSessions.map((session) => {
    const booking = session.booking
    const durationSec = session.duration || 0
    const durationStr = durationSec > 60 ? `${Math.floor(durationSec / 60)}m ${durationSec % 60}s` : `${durationSec}s`

    return {
      id: session.id,
      bookingId: booking?.id,
      bookingRef: booking?.bookingRef || 'BKG-MOCK',
      guestName: booking?.user?.name || 'Guest',
      phone: booking?.user?.phone || '+91 98765 43210',
      roomNumber: booking?.allocations[0]?.room?.roomNumber || 'TBD',
      checkInDate: booking ? new Date(booking.checkIn).toLocaleDateString('en-IN', { month: 'short', day: '2-digit' }) : 'N/A',
      status: session.status,
      outcome: session.summary || 'Call Completed Successfully',
      duration: durationStr,
      language: session.language || 'en-IN',
      sentiment: session.sentiment || 'NEUTRAL',
      arrivalTime: session.arrivalTime || 'N/A',
    }
  })


  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-slate-900 text-[#C6A96B] rounded-xl shadow-xs">
              <PhoneCall size={20} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Voice Calls Center</h1>
          </div>
          <p className="text-xs text-slate-500">
            Autonomous pre-arrival check-in phone calls, guest arrival time verification, and voice assistance.
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
            className="px-3.5 py-2 bg-slate-900 text-[#C6A96B] font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <PhoneCall size={15} /> Voice Calls ({callsList.length})
          </Link>
          <Link
            href="/ai/whatsapp"
            className="px-3.5 py-2 bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <MessageSquare size={15} /> WhatsApp
          </Link>
          <Link
            href="/ai/logs"
            className="px-3.5 py-2 bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Sparkles size={15} /> Chatbot Logs
          </Link>
        </div>
      </div>

      {/* Operational Voice Calls Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Pre-Arrival Outbound AI Calls ({callsList.length})</h3>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            🟢 AI Voice Engine Active
          </span>
        </div>

        {callsList.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs font-bold space-y-2">
            <PhoneCall size={28} className="mx-auto text-slate-300" />
            <p>No AI voice calls scheduled or logged yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4">Booking Ref</th>
                  <th className="py-3.5 px-4">Guest Name & Phone</th>
                  <th className="py-3.5 px-4">Target Room</th>
                  <th className="py-3.5 px-4">Check-In Date</th>
                  <th className="py-3.5 px-4">Call Outcome</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Call Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {callsList.map((call) => (
                  <tr key={call.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#C6A96B]">
                      <Link href={`/bookings/${call.id}`} className="hover:underline">
                        #{call.bookingRef}
                      </Link>
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-slate-900">{call.guestName}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{call.phone}</p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-slate-800">
                      Room {call.roomNumber}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {call.checkInDate}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {call.outcome}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {call.duration}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        call.status.includes('Confirmed') ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {call.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
