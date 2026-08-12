import React from 'react'
import { prisma } from '@hospitality-os/database'
import { ActivityClient } from './ActivityClient'

export const dynamic = 'force-dynamic'

export default async function ActivityLogPage() {
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return <ActivityClient initialLogs={logs} />
}
