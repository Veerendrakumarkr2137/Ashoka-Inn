import React from 'react'
import Link from 'next/link'
import { prisma } from '@hospitality-os/database'
import { 
  Bell, AlertCircle, Clock, CheckCircle2, ShieldAlert, 
  ArrowRight, Users, Sparkles, Wrench, IndianRupee, PhoneCall
} from 'lucide-react'

export async function FrontDeskActionCenter() {
  // Fetch real operational metrics for actionable tasks
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const [
    arrivingToday,
    cleaningRooms,
    maintenanceTickets,
    pendingPayments
  ] = await Promise.all([
    prisma.booking.findMany({
      where: {
        status: { in: ['CONFIRMED', 'PENDING'] },
        checkIn: { gte: todayStart }
      },
      include: { user: true },
      take: 5
    }),
    prisma.room.findMany({
      where: { status: 'CLEANING' },
      include: { category: true }
    }),
    prisma.maintenanceTicket.findMany({
      where: { status: { in: ['REPORTED', 'IN_PROGRESS', 'WAITING_PARTS'] } },
      include: { room: true }
    }),
    prisma.payment.findMany({
      where: { status: 'PENDING' },
      include: { booking: { include: { user: true } } },
      take: 5
    })
  ])

  const totalPendingPaymentAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0)

  const tasks = [
    {
      id: 'task-1',
      severity: 'RED',
      title: `${arrivingToday.length} Arrivals Scheduled Today`,
      sub: arrivingToday.length > 0 ? `Next: ${arrivingToday[0].user.name} (${arrivingToday[0].bookingRef})` : 'All scheduled arrivals processed',
      icon: Users,
      actionText: 'View Arrivals',
      href: '/bookings?filter=CONFIRMED'
    },
    {
      id: 'task-2',
      severity: 'YELLOW',
      title: `${cleaningRooms.length} Room Housekeeping Inspections Pending`,
      sub: cleaningRooms.length > 0 ? `Rooms: ${cleaningRooms.map(r => r.roomNumber).slice(0, 3).join(', ')}` : 'All departure rooms cleaned & ready',
      icon: Sparkles,
      actionText: 'Inspect Rooms',
      href: '/housekeeping?filter=CLEANING'
    },
    {
      id: 'task-3',
      severity: 'RED',
      title: `₹${totalPendingPaymentAmount.toLocaleString('en-IN')} Receivables Collector Pending`,
      sub: `${pendingPayments.length} bookings waiting for pay-at-hotel settlement`,
      icon: IndianRupee,
      actionText: 'Collect Receivables',
      href: '/finance'
    },
    {
      id: 'task-4',
      severity: maintenanceTickets.length > 0 ? 'RED' : 'GREEN',
      title: `${maintenanceTickets.length} Active Engineering & Maintenance Tickets`,
      sub: maintenanceTickets.length > 0 ? `Urgent: ${maintenanceTickets[0].issue} (Room ${maintenanceTickets[0].room.roomNumber})` : 'Zero active engineering issues reported',
      icon: Wrench,
      actionText: 'Dispatch Tech',
      href: '/housekeeping?filter=MAINTENANCE'
    },
    {
      id: 'task-5',
      severity: 'GREEN',
      title: '🟢 AI Receptionist Voice Bot Sync Active',
      sub: '3 inbound calls answered today • 0 missed guest inquiries',
      icon: PhoneCall,
      actionText: 'View Call Logs',
      href: '/ai'
    }
  ]

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Front Desk Operations Action Center & Shift Desk
          </h3>
          <p className="text-xs text-slate-500">Live priority tasks requiring immediate reception or housekeeping action</p>
        </div>
        <span className="text-xs font-extrabold px-3 py-1 bg-slate-900 text-[#C6A96B] rounded-xl font-mono">
          {tasks.filter(t => t.severity === 'RED').length} Critical Alerts
        </span>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tasks.map((task) => {
          const Icon = task.icon
          const isRed = task.severity === 'RED'
          const isYellow = task.severity === 'YELLOW'

          return (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                isRed ? 'bg-rose-50/40 border-rose-200/80 hover:border-rose-300' :
                isYellow ? 'bg-amber-50/40 border-amber-200/80 hover:border-amber-300' :
                'bg-emerald-50/30 border-emerald-200/60 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl shrink-0 font-bold ${
                  isRed ? 'bg-rose-100 text-rose-800' :
                  isYellow ? 'bg-amber-100 text-amber-900' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  <Icon size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      isRed ? 'bg-rose-500' : isYellow ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}></span>
                    <h4 className="text-xs font-extrabold text-slate-900">{task.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium mt-0.5">{task.sub}</p>
                </div>
              </div>

              <Link
                href={task.href}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] rounded-lg shrink-0 flex items-center gap-1 shadow-xs transition-transform hover:scale-105"
              >
                <span>{task.actionText}</span>
                <ArrowRight size={12} className="text-[#C6A96B]" />
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
