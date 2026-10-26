import { NextResponse } from 'next/server'
import { prisma } from '@hospitality-os/database'

export async function GET() {
  const startTime = Date.now()
  let dbStatus = 'disconnected'

  try {
    // Check DB readiness
    await prisma.$queryRaw`SELECT 1`
    dbStatus = 'connected'
  } catch (err: any) {
    console.error('[Health Check DB Failure]', err)
  }

  const isHealthy = dbStatus === 'connected'

  return NextResponse.json(
    {
      status: isHealthy ? 'ok' : 'degraded',
      service: 'admin-pms',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      latencyMs: Date.now() - startTime,
      checks: {
        database: dbStatus,
      },
    },
    { status: isHealthy ? 200 : 503 }
  )
}
