import { prisma } from '@hospitality-os/database'
import { revalidatePath } from 'next/cache'

export interface CreateTicketOptions {
  roomId: string
  issue: string
  priority?: string
  reportedBy?: string
  notes?: string
}

export class MaintenanceService {
  /**
   * Create a new maintenance ticket and update room status to MAINTENANCE
   */
  static async createTicket(options: CreateTicketOptions) {
    const { roomId, issue, priority = 'HIGH', reportedBy = 'Staff', notes } = options

    const result = await prisma.$transaction(async (tx) => {
      const ticket = await tx.maintenanceTicket.create({
        data: {
          roomId,
          issue,
          priority: priority as any,
          status: 'OPEN',
          reportedBy,
          notes,
        },
      })

      await tx.room.update({
        where: { id: roomId },
        data: { status: 'MAINTENANCE' },
      })

      await tx.activityLog.create({
        data: {
          category: 'HOUSEKEEPING',
          action: 'MAINTENANCE_TICKET_CREATED',
          message: `Work order created for Room: ${issue}`,
          author: reportedBy,
          roomId,
        },
      })

      return ticket
    })

    revalidatePath('/housekeeping')
    revalidatePath('/rooms')

    return result
  }

  /**
   * Resolve a maintenance ticket and mark room back as AVAILABLE
   */
  static async resolveTicket(ticketId: string, resolvedBy = 'Engineering') {
    const ticket = await prisma.maintenanceTicket.findUnique({
      where: { id: ticketId },
    })

    if (!ticket) {
      throw new Error('Ticket not found')
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedTicket = await tx.maintenanceTicket.update({
        where: { id: ticketId },
        data: {
          status: 'RESOLVED',
        },
      })

      // Check if any other open tickets exist for this room
      const openTickets = await tx.maintenanceTicket.count({
        where: { roomId: ticket.roomId, status: 'OPEN', id: { not: ticketId } },
      })

      if (openTickets === 0) {
        await tx.room.update({
          where: { id: ticket.roomId },
          data: { status: 'AVAILABLE' },
        })
      }

      await tx.activityLog.create({
        data: {
          category: 'HOUSEKEEPING',
          action: 'MAINTENANCE_TICKET_RESOLVED',
          message: `Maintenance work order resolved by ${resolvedBy}`,
          author: resolvedBy,
          roomId: ticket.roomId,
        },
      })

      return updatedTicket
    })

    revalidatePath('/housekeeping')
    revalidatePath('/rooms')

    return result
  }
}
