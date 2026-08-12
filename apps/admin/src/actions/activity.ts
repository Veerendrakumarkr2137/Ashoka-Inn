'use server'

import { prisma } from '@hospitality-os/database'
import { revalidatePath } from 'next/cache'

export async function getActivityLogs(categoryFilter?: string, limit = 50) {
  try {
    const where: any = {}
    if (categoryFilter && categoryFilter !== 'ALL') {
      where.category = categoryFilter
    }

    const logs = await prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return { success: true, logs }
  } catch (error: any) {
    console.error('Failed to fetch activity logs:', error)
    return { success: false, logs: [], error: error.message }
  }
}

export async function logActivity(data: {
  category: 'BOOKING' | 'ROOM' | 'HOUSEKEEPING' | 'INSPECTION' | 'DAMAGE' | 'PAYMENT' | 'SERVICE' | 'SETTINGS'
  action: string
  message: string
  author?: string
  roomId?: string
  bookingId?: string
}) {
  try {
    const log = await prisma.activityLog.create({
      data: {
        category: data.category,
        action: data.action,
        message: data.message,
        author: data.author || 'System Audit',
        roomId: data.roomId,
        bookingId: data.bookingId,
      },
    })
    revalidatePath('/activity')
    return { success: true, log }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
