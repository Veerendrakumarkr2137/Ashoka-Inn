import { NextResponse } from 'next/server'
import { prisma } from '@hospitality-os/database'

export async function GET() {
  const startTime = Date.now()
  let dbStatus = 'disconnected'

  try {
    await prisma.$queryRaw`SELECT 1`
    dbStatus = 'connected'
  } catch (err: any) {
    console.error('[Guest Web Health Check DB Failure]', err)
  }

  const isHealthy = dbStatus === 'connected'

  return NextResponse.json(
    {
      status: isHealthy ? 'ok' : 'degraded',
      service: 'hotel-guest-web',
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
