'use server'

import { BookingService } from '@/lib/services/BookingService'
import { HousekeepingService } from '@/lib/services/HousekeepingService'

export async function checkInGuest(bookingId: string, assignedRoomId: string, authorName?: string) {
  try {
    const booking = await BookingService.checkInGuest({ bookingId, assignedRoomId, authorName })
    return { success: true, booking }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to complete check-in' }
  }
}

export async function checkInGuestAction(formData: FormData) {
  const bookingId = formData.get('bookingId') as string
  const assignedRoomId = formData.get('assignedRoomId') as string
  await BookingService.checkInGuest({ bookingId, assignedRoomId })
}

export async function checkOutGuest(bookingId: string, roomId?: string, paymentMethod?: string, authorName?: string) {
  try {
    const booking = await BookingService.checkOutGuest({ bookingId, roomId, paymentMethod, authorName })
    return { success: true, booking }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to complete check-out' }
  }
}

export async function checkOutGuestAction(formData: FormData) {
  const bookingId = formData.get('bookingId') as string
  const roomId = formData.get('roomId') as string
  const paymentMethod = formData.get('paymentMethod') as string
  await BookingService.checkOutGuest({ bookingId, roomId, paymentMethod })
}

export async function submitRoomInspection(data: {
  roomId: string
  inspectorName?: string
  passed: boolean
  checklist: Record<string, boolean>
  damageItem?: string
  damageAmount?: number
  notes?: string
}) {
  try {
    const room = await HousekeepingService.submitInspection(data)
    return { success: true, room }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to submit inspection' }
  }
}
