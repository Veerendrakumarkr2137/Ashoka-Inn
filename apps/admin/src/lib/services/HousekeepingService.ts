import { prisma } from '@hospitality-os/database'
import { revalidatePath } from 'next/cache'

export interface InspectionSubmissionOptions {
  roomId: string
  inspectorName?: string
  passed: boolean
  checklist: Record<string, boolean>
  damageItem?: string
  damageAmount?: number
  notes?: string
}

export class HousekeepingService {
  /**
   * Start room cleaning (Status: DIRTY / PENDING -> CLEANING)
   */
  static async startCleaning(roomId: string, housekeeperName = 'Housekeeper') {
    const room = await prisma.room.update({
      where: { id: roomId },
      data: { status: 'CLEANING' },
    })

    await prisma.activityLog.create({
      data: {
        category: 'HOUSEKEEPING',
        action: 'START_CLEANING',
        message: `Housekeeper started cleaning Room ${room.roomNumber}`,
        author: housekeeperName,
        roomId,
      },
    })

    revalidatePath('/housekeeping')
    revalidatePath('/rooms')

    return room
  }

  /**
   * Submit supervisor QA inspection result
   */
  static async submitInspection(options: InspectionSubmissionOptions) {
    const { roomId, inspectorName = 'Supervisor', passed, damageItem, damageAmount = 0, notes } = options

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { allocations: { include: { booking: true } } },
    })

    if (!room) {
      throw new Error('Room not found')
    }

    const activeBooking = room.allocations.find((a) => a.booking.status === 'CHECKED_IN')?.booking

    const result = await prisma.$transaction(async (tx) => {
      let updatedRoom

      if (passed) {
        // Room passed QA inspection -> Available / Ready
        updatedRoom = await tx.room.update({
          where: { id: roomId },
          data: { status: 'AVAILABLE' },
        })

        // Complete housekeeping tasks
        await tx.task.updateMany({
          where: { roomId, status: { in: ['PENDING', 'IN_PROGRESS'] } },
          data: { status: 'COMPLETED' },
        })
      } else {
        // Room failed QA inspection -> Maintenance
        updatedRoom = await tx.room.update({
          where: { id: roomId },
          data: { status: 'MAINTENANCE' },
        })

        // Create Maintenance Work Order
        await tx.maintenanceTicket.create({
          data: {
            roomId,
            issue: `QA Inspection Failed: ${damageItem || 'Damaged / Dirty Items'}`,
            priority: 'HIGH',
            status: 'OPEN',
            reportedBy: inspectorName,
            notes: notes || 'Inspection failed by housekeeping supervisor',
          },
        })

        // If damage charge applies and guest is active, post charge to folio
        if (damageAmount > 0 && activeBooking) {
          await tx.folioCharge.create({
            data: {
              bookingId: activeBooking.id,
              category: 'DAMAGE',
              description: `Damaged Item: ${damageItem || 'Room Asset'}`,
              quantity: 1,
              unitPrice: damageAmount,
              taxAmount: 0,
              totalAmount: damageAmount,
              source: 'HOUSEKEEPING_INSPECTION',
              author: inspectorName,
            },
          })
        }
      }

      // Audit Log
      await tx.activityLog.create({
        data: {
          category: 'INSPECTION',
          action: passed ? 'INSPECTION_PASSED' : 'INSPECTION_FAILED',
          message: passed
            ? `Supervisor passed QA inspection for Room ${room.roomNumber}`
            : `Supervisor failed QA inspection for Room ${room.roomNumber}: ${damageItem || 'Issues found'}`,
          author: inspectorName,
          roomId,
          bookingId: activeBooking?.id,
        },
      })

      return updatedRoom
    })

    revalidatePath('/housekeeping')
    revalidatePath('/rooms')
    if (activeBooking) {
      revalidatePath(`/bookings/${activeBooking.id}`)
    }

    return result
  }

  /**
   * Update raw room housekeeping status (AVAILABLE, CLEANING, MAINTENANCE)
   */
  static async updateRoomStatus(roomId: string, status: string) {
    const room = await prisma.room.update({
      where: { id: roomId },
      data: { status: status as any },
    })

    revalidatePath('/housekeeping')
    revalidatePath('/rooms')

    return room
  }
}
