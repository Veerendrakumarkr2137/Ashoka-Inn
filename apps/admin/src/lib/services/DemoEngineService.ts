import { prisma } from '@hospitality-os/database'
import { revalidatePath } from 'next/cache'

export class DemoEngineService {
  /**
   * Clear test data while preserving room categories & catalog settings
   */
  static async resetTransactionalData() {
    await prisma.$transaction([
      prisma.activityLog.deleteMany(),
      prisma.folioCharge.deleteMany(),
      prisma.payment.deleteMany(),
      prisma.serviceOrderItem.deleteMany(),
      prisma.serviceOrder.deleteMany(),
      prisma.task.deleteMany(),
      prisma.maintenanceTicket.deleteMany(),
      prisma.roomAllocation.deleteMany(),
      prisma.booking.deleteMany(),
    ])

    // Reset room statuses to AVAILABLE
    await prisma.room.updateMany({
      data: { status: 'AVAILABLE' },
    })

    revalidatePath('/')
    revalidatePath('/bookings')
    revalidatePath('/rooms')
    revalidatePath('/housekeeping')
    revalidatePath('/settings')

    return { success: true }
  }

  /**
   * Seed clean 20-room sample dataset with active stays, dirty rooms, and tasks
   */
  static async seedDemoData() {
    await this.resetTransactionalData()

    const categories = await prisma.roomCategory.findMany()
    let rooms = await prisma.room.findMany({ orderBy: { roomNumber: 'asc' } })

    // Ensure 20 rooms exist across categories
    if (rooms.length < 20 && categories.length > 0) {
      const roomTypes = [
        { num: '101', catIdx: 0 }, { num: '102', catIdx: 0 }, { num: '103', catIdx: 0 }, { num: '104', catIdx: 0 }, { num: '105', catIdx: 0 },
        { num: '201', catIdx: 1 }, { num: '202', catIdx: 1 }, { num: '203', catIdx: 1 }, { num: '204', catIdx: 1 }, { num: '205', catIdx: 1 },
        { num: '301', catIdx: 2 }, { num: '302', catIdx: 2 }, { num: '303', catIdx: 2 }, { num: '304', catIdx: 2 }, { num: '305', catIdx: 2 },
        { num: '401', catIdx: 3 }, { num: '402', catIdx: 3 }, { num: '403', catIdx: 3 }, { num: '404', catIdx: 3 }, { num: '405', catIdx: 3 },
      ]

      for (const rt of roomTypes) {
        const cat = categories[rt.catIdx % categories.length]
        const exists = rooms.some((r) => r.roomNumber === rt.num)
        if (!exists) {
          await prisma.room.create({
            data: {
              roomNumber: rt.num,
              status: 'AVAILABLE',
              roomCategoryId: cat.id,
            },
          })
        }
      }
      rooms = await prisma.room.findMany({ orderBy: { roomNumber: 'asc' } })
    }

    const today = new Date()

    // 1. Create Active Stay (Checked in)
    if (rooms.length > 0) {
      const r1 = rooms[0]

      let user1 = await prisma.user.findFirst({ where: { email: 'rajesh.kumar@example.com' } })
      if (!user1) {
        user1 = await prisma.user.create({
          data: { name: 'Rajesh Kumar', email: 'rajesh.kumar@example.com', phone: '+91 98765 43210', role: 'GUEST' },
        })
      }

      const checkIn1 = new Date(today.getTime() - 86400000)
      const checkOut1 = new Date(today.getTime() + 86400000 * 2)

      const b1 = await prisma.booking.create({
        data: {
          bookingRef: `BKG-DEMO-${Math.floor(1000 + Math.random() * 9000)}`,
          userId: user1.id,
          checkIn: checkIn1,
          checkOut: checkOut1,
          status: 'CHECKED_IN',
          totalAmount: 7000,
          adults: 2,
          children: 0,
        },
      })
      await prisma.roomAllocation.create({ data: { bookingId: b1.id, roomId: r1.id, checkIn: checkIn1, checkOut: checkOut1 } })
      await prisma.room.update({ where: { id: r1.id }, data: { status: 'OCCUPIED' } })

      await prisma.payment.create({
        data: {
          bookingId: b1.id,
          userId: user1.id,
          amount: 3500,
          paymentMethod: 'UPI',
          status: 'COMPLETED',
          transactionId: 'PAY-UPI-001',
        },
      })
    }

    // 2. Create Confirmed Upcoming Reservation
    if (rooms.length > 1) {
      const r2 = rooms[1]

      let user2 = await prisma.user.findFirst({ where: { email: 'priya.sharma@example.com' } })
      if (!user2) {
        user2 = await prisma.user.create({
          data: { name: 'Priya Sharma', email: 'priya.sharma@example.com', phone: '+91 98123 45678', role: 'GUEST' },
        })
      }

      const checkIn2 = new Date(today.getTime() + 86400000)
      const checkOut2 = new Date(today.getTime() + 86400000 * 3)

      const b2 = await prisma.booking.create({
        data: {
          bookingRef: `BKG-DEMO-${Math.floor(1000 + Math.random() * 9000)}`,
          userId: user2.id,
          checkIn: checkIn2,
          checkOut: checkOut2,
          status: 'CONFIRMED',
          totalAmount: 10500,
          adults: 2,
          children: 1,
        },
      })
      await prisma.roomAllocation.create({ data: { bookingId: b2.id, roomId: r2.id, checkIn: checkIn2, checkOut: checkOut2 } })
    }

    // 3. Mark a room as DIRTY with pending housekeeping task
    if (rooms.length > 2) {
      const r3 = rooms[2]
      await prisma.room.update({ where: { id: r3.id }, data: { status: 'DIRTY' } })
      await prisma.task.create({
        data: {
          type: 'CLEANING',
          title: 'CHECK_OUT_CLEAN',
          description: 'Checkout cleaning required for guest arrival at 2:00 PM',
          priority: 'HIGH',
          status: 'PENDING',
          assignedStaff: 'Ramesh Kumar',
          roomId: r3.id,
        },
      })
    }

    revalidatePath('/')
    revalidatePath('/bookings')
    revalidatePath('/rooms')
    revalidatePath('/housekeeping')

    return { success: true }
  }
}
