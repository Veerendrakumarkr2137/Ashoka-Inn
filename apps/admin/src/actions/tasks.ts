'use server'

import { prisma } from '@hospitality-os/database'
import { revalidatePath } from 'next/cache'

// ─── 1. FETCH ALL TASKS ────────────────────────────────────────────────────────
export async function getTasks(typeFilter?: string, statusFilter?: string) {
  try {
    const where: any = {}
    if (typeFilter && typeFilter !== 'ALL') where.type = typeFilter
    if (statusFilter && statusFilter !== 'ALL') where.status = statusFilter

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, tasks }
  } catch (error: any) {
    console.error('Failed to fetch tasks:', error)
    return { success: false, tasks: [], error: error.message }
  }
}

// ─── 2. CREATE MANUAL OPERATIONAL TASK ─────────────────────────────────────────
export async function createTask(data: {
  type: 'CLEANING' | 'INSPECTION' | 'MAINTENANCE' | 'SERVICE'
  title: string
  description?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  assignedStaff?: string
  roomId?: string
  bookingId?: string
}) {
  try {
    const task = await prisma.task.create({
      data: {
        type: data.type,
        title: data.title,
        description: data.description,
        priority: data.priority || 'MEDIUM',
        assignedStaff: data.assignedStaff || 'Unassigned',
        roomId: data.roomId,
        bookingId: data.bookingId,
      },
    })

    await prisma.activityLog.create({
      data: {
        category: 'HOUSEKEEPING',
        action: 'TASK_CREATED',
        message: `Task '${data.title}' created (${data.type})`,
        author: 'Staff Desk',
        roomId: data.roomId,
        bookingId: data.bookingId,
      },
    })

    revalidatePath('/housekeeping')
    revalidatePath('/')

    return { success: true, task }
  } catch (error: any) {
    console.error('Failed to create task:', error)
    return { success: false, error: error.message }
  }
}

// ─── 3. ASSIGN STAFF TO TASK ──────────────────────────────────────────────────
export async function assignTask(taskId: string, staffName: string) {
  try {
    const task = await prisma.task.update({
      where: { id: taskId },
      data: { assignedStaff: staffName },
    })

    revalidatePath('/housekeeping')
    return { success: true, task }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// ─── 4. START CLEANING TASK ────────────────────────────────────────────────────
export async function startCleaningTask(taskId: string) {
  try {
    const task = await prisma.task.findUnique({ where: { id: taskId } })
    if (!task) return { success: false, error: 'Task not found' }

    await prisma.$transaction(async (tx) => {
      // Update Task
      await tx.task.update({
        where: { id: taskId },
        data: {
          status: 'IN_PROGRESS',
          startTime: new Date(),
        },
      })

      // Update Room if linked
      if (task.roomId) {
        await tx.room.update({
          where: { id: task.roomId },
          data: { status: 'CLEANING' },
        })
      }

      // Log Activity
      await tx.activityLog.create({
        data: {
          category: 'HOUSEKEEPING',
          action: 'START_CLEANING',
          message: `Housekeeping started for Task '${task.title}' (Staff: ${task.assignedStaff || 'Staff'})`,
          author: task.assignedStaff || 'Housekeeping',
          roomId: task.roomId || undefined,
        },
      })
    })

    revalidatePath('/housekeeping')
    revalidatePath('/rooms')
    revalidatePath('/')

    return { success: true, message: 'Cleaning started successfully' }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// ─── 5. COMPLETE CLEANING TASK & AUTO-CREATE INSPECTION TASK ───────────────────
export async function completeCleaningTask(taskId: string) {
  try {
    const task = await prisma.task.findUnique({ where: { id: taskId } })
    if (!task) return { success: false, error: 'Task not found' }

    await prisma.$transaction(async (tx) => {
      // Update Task
      await tx.task.update({
        where: { id: taskId },
        data: {
          status: 'COMPLETED',
          completedTime: new Date(),
        },
      })

      if (task.roomId) {
        const room = await tx.room.findUnique({ where: { id: task.roomId } })
        
        // Update Room to INSPECTION_PENDING
        await tx.room.update({
          where: { id: task.roomId },
          data: { status: 'INSPECTION_PENDING' },
        })

        // AUTO CREATE SUPERVISOR INSPECTION TASK
        await tx.task.create({
          data: {
            type: 'INSPECTION',
            title: `Supervisor Inspection Room ${room?.roomNumber || ''}`,
            description: `Verify 6-point inventory & cleanliness for Room ${room?.roomNumber || ''} before marking READY.`,
            status: 'PENDING',
            priority: 'HIGH',
            assignedStaff: 'Housekeeping Supervisor',
            roomId: task.roomId,
            bookingId: task.bookingId,
          },
        })
      }

      // Log Activity
      await tx.activityLog.create({
        data: {
          category: 'HOUSEKEEPING',
          action: 'CLEANING_COMPLETED',
          message: `Cleaning completed for Task '${task.title}'. Room set to INSPECTION_PENDING. Supervisor Inspection task generated.`,
          author: task.assignedStaff || 'Housekeeping',
          roomId: task.roomId || undefined,
        },
      })
    })

    revalidatePath('/housekeeping')
    revalidatePath('/rooms')
    revalidatePath('/')

    return { success: true, message: 'Cleaning completed. Room ready for supervisor inspection.' }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// ─── 6. SUBMIT SUPERVISOR INSPECTION & AUTO DAMAGE BILLING ──────────────────────
export async function submitInspection(data: {
  taskId?: string
  roomId: string
  bookingId?: string
  inspector: string
  items: Array<{ itemName: string; status: 'OK' | 'MISSING' | 'DAMAGED'; unitPrice: number }>
  notes?: string
}) {
  try {
    const room = await prisma.room.findUnique({ where: { id: data.roomId } })
    if (!room) return { success: false, error: 'Room not found' }

    // Calculate damaged/missing charges
    const damagedItems = data.items.filter((i) => i.status === 'MISSING' || i.status === 'DAMAGED')
    const totalDamageCharge = damagedItems.reduce((acc, i) => acc + i.unitPrice, 0)
    const inspectionPassed = damagedItems.length === 0

    await prisma.$transaction(async (tx) => {
      // 1. Create Inspection Record
      const inspection = await tx.inspection.create({
        data: {
          roomId: data.roomId,
          bookingId: data.bookingId,
          inspector: data.inspector || 'Supervisor',
          status: inspectionPassed ? 'PASSED' : 'FAILED',
          checklistJson: JSON.stringify(data.items),
          totalDamageCharge,
          notes: data.notes,
        },
      })

      // 2. If Inspection Passed -> Set Room status to READY
      if (inspectionPassed) {
        await tx.room.update({
          where: { id: data.roomId },
          data: { status: 'READY' },
        })

        // Complete linked inspection task if provided
        if (data.taskId) {
          await tx.task.update({
            where: { id: data.taskId },
            data: { status: 'COMPLETED', completedTime: new Date() },
          })
        }

        await tx.activityLog.create({
          data: {
            category: 'INSPECTION',
            action: 'INSPECTION_PASSED',
            message: `Supervisor Inspection PASSED for Room ${room.roomNumber}. Room status updated to READY for check-in.`,
            author: data.inspector || 'Supervisor',
            roomId: room.id,
            bookingId: data.bookingId,
          },
        })
      } else {
        // Inspection Failed due to Damaged/Missing Inventory
        await tx.room.update({
          where: { id: data.roomId },
          data: { status: 'MAINTENANCE' },
        })

        // AUTO CREATE MAINTENANCE WORK ORDER FOR DAMAGED ITEMS
        await tx.maintenanceTicket.create({
          data: {
            roomId: data.roomId,
            issue: `Inspection Damaged/Missing: ${damagedItems.map((i) => `${i.itemName} (${i.status})`).join(', ')}`,
            priority: 'HIGH',
            status: 'REPORTED',
            reportedBy: data.inspector || 'Supervisor',
            notes: data.notes || 'Generated automatically from supervisor QA inspection.',
          },
        })

        // AUTO POST DAMAGE CHARGE TO BOOKING NOTE / FOLIO RECORD IF LINKED
        if (data.bookingId) {
          await tx.bookingNote.create({
            data: {
              bookingId: data.bookingId,
              message: `AUTO DAMAGE CHARGE POSTED: ₹${totalDamageCharge.toLocaleString('en-IN')} for [${damagedItems.map((i) => i.itemName).join(', ')}]`,
              author: 'Damage Audit Engine',
            },
          })
        }

        await tx.activityLog.create({
          data: {
            category: 'DAMAGE',
            action: 'DAMAGE_POSTED',
            message: `Supervisor Inspection FAILED for Room ${room.roomNumber}. Total Damage Charge ₹${totalDamageCharge.toLocaleString('en-IN')} posted to folio. Maintenance ticket logged.`,
            author: data.inspector || 'Supervisor',
            roomId: room.id,
            bookingId: data.bookingId,
          },
        })
      }
    })

    revalidatePath('/housekeeping')
    revalidatePath('/bookings')
    revalidatePath('/rooms')
    revalidatePath('/')

    return {
      success: true,
      inspectionPassed,
      totalDamageCharge,
      message: inspectionPassed
        ? `Room ${room.roomNumber} passed QA inspection and is now READY for guest check-in!`
        : `Inspection recorded. Total damage charges ₹${totalDamageCharge.toLocaleString('en-IN')} posted to folio.`,
    }
  } catch (error: any) {
    console.error('Failed to submit inspection:', error)
    return { success: false, error: error.message }
  }
}
