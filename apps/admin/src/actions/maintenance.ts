'use server'

import { prisma } from '@hospitality-os/database'
import { revalidatePath } from 'next/cache'

export async function createMaintenanceTicket(roomId: string, issue: string, priority: string = 'MEDIUM', reportedBy: string = 'Front Desk Staff') {
  try {
    await prisma.maintenanceTicket.create({
      data: {
        roomId,
        issue,
        priority,
        status: 'REPORTED',
        reportedBy
      }
    })

    // Automatically set room status to MAINTENANCE
    await prisma.room.update({
      where: { id: roomId },
      data: { status: 'MAINTENANCE' }
    })

    revalidatePath('/housekeeping')
    revalidatePath('/rooms')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error('Error creating maintenance ticket:', error)
    return { success: false, error: error.message }
  }
}

export async function createMaintenanceTicketAction(roomId: string, issue: string, priority: string, reportedBy: string): Promise<void> {
  await createMaintenanceTicket(roomId, issue, priority, reportedBy)
}

export async function updateMaintenanceStatus(ticketId: string, status: string, technician?: string, notes?: string) {
  try {
    const ticket = await prisma.maintenanceTicket.update({
      where: { id: ticketId },
      data: {
        status,
        ...(technician ? { technician } : {}),
        ...(notes ? { notes } : {})
      }
    })

    // If ticket is marked INSPECTED or COMPLETED, return room to AVAILABLE if no other open tickets
    if (status === 'INSPECTED' || status === 'COMPLETED') {
      const openTickets = await prisma.maintenanceTicket.count({
        where: {
          roomId: ticket.roomId,
          status: { in: ['REPORTED', 'ASSIGNED', 'IN_PROGRESS', 'WAITING_PARTS'] }
        }
      })

      if (openTickets === 0) {
        await prisma.room.update({
          where: { id: ticket.roomId },
          data: { status: 'AVAILABLE' }
        })
      }
    }

    revalidatePath('/housekeeping')
    revalidatePath('/rooms')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error('Error updating maintenance status:', error)
    return { success: false, error: error.message }
  }
}

export async function updateMaintenanceStatusAction(ticketId: string, status: string): Promise<void> {
  await updateMaintenanceStatus(ticketId, status)
}
