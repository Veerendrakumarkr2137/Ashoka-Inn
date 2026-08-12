import React from 'react'
import { prisma } from '@hospitality-os/database'
import { LogsClient } from './LogsClient'

export const dynamic = 'force-dynamic'

export default async function AiLogsPage() {
  // Fetch actual activity logs related to AI or bookings, and recent bookings for AI context
  const [activityLogs, bookings] = await Promise.all([
    prisma.activityLog.findMany({
      where: {
        OR: [
          { category: 'AI' },
          { author: { contains: 'AI' } },
          { message: { contains: 'AI' } },
          { message: { contains: 'call' } },
          { message: { contains: 'WhatsApp' } },
          { message: { contains: 'bot' } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    prisma.booking.findMany({
      include: { user: true, allocations: { include: { room: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
  ])

  return <LogsClient initialActivityLogs={activityLogs} initialBookings={bookings} />
}
