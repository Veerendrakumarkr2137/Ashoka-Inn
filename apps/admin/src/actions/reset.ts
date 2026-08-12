'use server'

import { DemoEngineService } from '@/lib/services/DemoEngineService'

export async function resetTransactionalData() {
  try {
    const res = await DemoEngineService.resetTransactionalData()
    return { success: true, message: 'All transactional test data reset successfully!' }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to reset data' }
  }
}

export async function seedDemoData() {
  try {
    const res = await DemoEngineService.seedDemoData()
    return { success: true, message: 'Clean 20-room demo dataset seeded successfully!' }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to seed demo data' }
  }
}
