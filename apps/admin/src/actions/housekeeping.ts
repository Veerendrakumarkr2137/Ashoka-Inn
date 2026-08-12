'use server'

import { HousekeepingService } from '@/lib/services/HousekeepingService'

export async function updateHousekeepingStatusAction(roomId: string, status: string) {
  await HousekeepingService.updateRoomStatus(roomId, status)
}

export async function updateHousekeepingStatus(roomId: string, status: string) {
  try {
    const room = await HousekeepingService.updateRoomStatus(roomId, status)
    return { success: true, room }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update housekeeping status' }
  }
}

export async function startCleaningAction(roomId: string, housekeeperName?: string) {
  try {
    const room = await HousekeepingService.startCleaning(roomId, housekeeperName)
    return { success: true, room }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to start cleaning' }
  }
}
