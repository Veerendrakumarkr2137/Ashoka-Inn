'use server'

import { prisma } from '@hospitality-os/database'
import { revalidatePath } from 'next/cache'

export async function createRoom(data: { roomNumber: string; roomCategoryId: string; status: string }) {
  try {
    const existingRoom = await prisma.room.findUnique({
      where: { roomNumber: data.roomNumber }
    })

    if (existingRoom) {
      return { success: false, error: 'Room number already exists' }
    }

    const room = await prisma.room.create({
      data: {
        roomNumber: data.roomNumber,
        roomCategoryId: data.roomCategoryId,
        status: data.status || 'AVAILABLE'
      }
    })

    revalidatePath('/rooms')
    return { success: true, room }
  } catch (error: any) {
    console.error('Failed to create room:', error)
    return { success: false, error: error.message || 'Failed to create room' }
  }
}

export async function updateRoomStatus(roomId: string, status: string) {
  try {
    const room = await prisma.room.update({
      where: { id: roomId },
      data: { status }
    })
    
    revalidatePath('/housekeeping')
    revalidatePath('/rooms')
    revalidatePath('/bookings')
    
    return { success: true, room }
  } catch (error: any) {
    console.error('Failed to update room status:', error)
    return { success: false, error: error.message || 'Failed to update room status' }
  }
}
