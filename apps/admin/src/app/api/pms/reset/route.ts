import { NextResponse } from 'next/server'
import { DemoEngineService } from '@/lib/services/DemoEngineService'

export async function POST(req: Request) {
  try {
    const { action } = await req.json().catch(() => ({}))

    if (action === 'seed') {
      const res = await DemoEngineService.seedDemoData()
      return NextResponse.json({ success: true, message: 'Demo dataset seeded successfully' })
    }

    const res = await DemoEngineService.resetTransactionalData()
    return NextResponse.json({ success: true, message: 'Transactional test data cleared successfully' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Reset operations failed' }, { status: 500 })
  }
}
