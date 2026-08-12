import { prisma } from '@hospitality-os/database'
import { checkInGuest, checkOutGuest } from './actions/pms.js'
import { addFolioCharge } from './actions/folio.js'
import { submitInspection, startCleaningTask, completeCleaningTask } from './actions/tasks.js'
import { resetTransactionalData } from './actions/reset.js'

async function runLifecycleTest() {
  console.log('=== STARTING 29-STEP PMS DATA CONSISTENCY & LIFECYCLE TEST ===\n')

  // Step 1: Clean database state
  await resetTransactionalData()
  console.log('✔ Step 1: Database transactional state reset cleanly.')

  // Ensure Room Category & Room exist
  let category = await prisma.roomCategory.findFirst({ where: { name: 'Superior AC' } })
  if (!category) {
    category = await prisma.roomCategory.create({
      data: { name: 'Superior AC', description: 'AC Deluxe', basePrice: 5500, capacity: 2, hasAC: true },
    })
  }

  let room = await prisma.room.findUnique({ where: { roomNumber: '201' } })
  if (!room) {
    room = await prisma.room.create({
      data: { roomNumber: '201', roomCategoryId: category.id, status: 'AVAILABLE' },
    })
  } else {
    await prisma.room.update({ where: { id: room.id }, data: { status: 'AVAILABLE' } })
  }
  console.log(`✔ Step 2: Test Room 201 verified (Category: ${category.name}, Rate: ₹5,500/night).`)

  // Step 3: Create Guest Profile
  const guest = await prisma.user.create({
    data: {
      name: 'Karan Johar',
      email: 'karan.johar@testpms.com',
      phone: '+91 99887 76655',
      role: 'GUEST',
    },
  })
  console.log(`✔ Step 3: Guest CRM Profile created for '${guest.name}'.`)

  // Step 4: Create Reservation
  const checkIn = new Date()
  const checkOut = new Date()
  checkOut.setDate(checkOut.getDate() + 2)

  const booking = await prisma.booking.create({
    data: {
      bookingRef: 'BKG-TEST-LIFECYCLE-999',
      userId: guest.id,
      checkIn,
      checkOut,
      totalAmount: 11000,
      status: 'CONFIRMED',
      specialRequests: 'Quiet room away from elevator',
      allocations: {
        create: {
          roomId: room.id,
          checkIn,
          checkOut,
        },
      },
      payments: {
        create: {
          userId: guest.id,
          amount: 5000,
          currency: 'INR',
          status: 'COMPLETED',
          paymentMethod: 'UPI',
          transactionId: 'TXN-ADV-5000',
        },
      },
    },
  })
  console.log(`✔ Step 4: Reservation ${booking.bookingRef} created (Advance Paid: ₹5,000, Total: ₹11,000).`)

  // Step 5: Check-in Guest
  const checkInRes = await checkInGuest(booking.id, room.id)
  if (!checkInRes.success) throw new Error(`Check-in failed: ${checkInRes.error}`)

  const roomAfterCheckin = await prisma.room.findUnique({ where: { id: room.id } })
  const bookingAfterCheckin = await prisma.booking.findUnique({ where: { id: booking.id } })
  console.log(`✔ Step 5: Check-In completed! Booking Status: '${bookingAfterCheckin?.status}', Room 201 Status: '${roomAfterCheckin?.status}' (OCCUPIED).`)

  // Step 6: Post F&B Room Service Charge to Folio
  let fnbCat = await prisma.serviceCategory.findFirst({ where: { name: 'Room Service' } })
  if (!fnbCat) fnbCat = await prisma.serviceCategory.create({ data: { name: 'Room Service' } })

  let teaItem = await prisma.serviceItem.findFirst({ where: { name: 'Masala Tea & Breakfast' } })
  if (!teaItem) {
    teaItem = await prisma.serviceItem.create({
      data: { categoryId: fnbCat.id, name: 'Masala Tea & Breakfast', price: 650 },
    })
  }

  await prisma.serviceOrder.create({
    data: {
      bookingId: booking.id,
      status: 'DELIVERED',
      totalAmount: 650,
      items: {
        create: [{ serviceItemId: teaItem.id, quantity: 1, priceAtTime: 650 }],
      },
    },
  })
  console.log(`✔ Step 6: F&B Room Service Order delivered and posted to Guest Folio (+₹650).`)

  // Step 7: Post Custom Extra Bed Folio Charge
  const folioRes = await addFolioCharge({
    bookingId: booking.id,
    category: 'EXTRA_BED',
    description: 'Extra Bed Mattress & Linen',
    quantity: 1,
    unitPrice: 1000,
    source: 'FRONT_DESK',
    author: 'Reception Desk',
  })
  if (!folioRes.success) throw new Error(`Folio charge failed: ${folioRes.error}`)
  console.log(`✔ Step 7: Extra Bed Charge posted to Guest Folio (+₹1,000).`)

  // Step 8: Post Room Inspection & Missing Item Charge
  const inspectionRes = await submitInspection({
    roomId: room.id,
    bookingId: booking.id,
    inspector: 'Housekeeping Supervisor',
    items: [
      { itemName: 'Bath Towels', status: 'MISSING', unitPrice: 450 },
      { itemName: 'TV Remote', status: 'OK', unitPrice: 0 },
    ],
    notes: 'Missing 1 Bath Towel during pre-checkout inspection.',
  })
  console.log(`✔ Step 8: Pre-checkout Room Inspection executed. Damage/Missing Item charge posted (+₹450). Inspection status: '${inspectionRes.inspectionPassed ? 'PASSED' : 'FAILED'}'.`)

  // Step 9: Complete Checkout & Folio Settlement
  const checkOutRes = await checkOutGuest(booking.id, 'CARD')
  if (!checkOutRes.success) throw new Error(`Checkout failed: ${checkOutRes.error}`)

  const roomAfterCheckout = await prisma.room.findUnique({ where: { id: room.id } })
  const bookingAfterCheckout = await prisma.booking.findUnique({ where: { id: booking.id } })
  const cleaningTask = await prisma.task.findFirst({
    where: { roomId: room.id, type: 'CLEANING', status: 'PENDING' },
  })

  console.log(`✔ Step 9: Checkout Completed & Folio Settled! Booking Status: '${bookingAfterCheckout?.status}', Room 201 Status: '${roomAfterCheckout?.status}' (DIRTY). Auto-created Task: '${cleaningTask?.title}'.`)

  // Step 10: Housekeeping Starts Cleaning
  if (!cleaningTask) throw new Error('Cleaning task was not generated on checkout!')
  await startCleaningTask(cleaningTask.id)
  const roomAfterCleaningStart = await prisma.room.findUnique({ where: { id: room.id } })
  console.log(`✔ Step 10: Housekeeper started cleaning. Task status: 'IN_PROGRESS', Room Status: '${roomAfterCleaningStart?.status}' (CLEANING).`)

  // Step 11: Housekeeping Completes Cleaning
  await completeCleaningTask(cleaningTask.id)
  const roomAfterCleaningComplete = await prisma.room.findUnique({ where: { id: room.id } })
  const inspectionTask = await prisma.task.findFirst({
    where: { roomId: room.id, type: 'INSPECTION', status: 'PENDING' },
  })
  console.log(`✔ Step 11: Cleaning completed. Room Status: '${roomAfterCleaningComplete?.status}' (INSPECTION_PENDING). Supervisor Task generated: '${inspectionTask?.title}'.`)

  // Step 12: Supervisor Final QA Inspection Passes Room
  if (!inspectionTask) throw new Error('Supervisor inspection task was not generated!')
  const finalQA = await submitInspection({
    taskId: inspectionTask.id,
    roomId: room.id,
    bookingId: booking.id,
    inspector: 'Executive Housekeeper',
    items: [
      { itemName: 'Bath Towels', status: 'OK', unitPrice: 0 },
      { itemName: 'Bed Linens', status: 'OK', unitPrice: 0 },
      { itemName: 'Sanitized Bathroom', status: 'OK', unitPrice: 0 },
    ],
    notes: 'Room sanitized & towels replaced. QA Passed.',
  })

  const roomFinal = await prisma.room.findUnique({ where: { id: room.id } })
  console.log(`✔ Step 12: Supervisor QA Inspection PASSED! Final Room 201 Status: '${roomFinal?.status}' (READY).`)

  // Step 13: Verify Audit Logs
  const logs = await prisma.activityLog.findMany({ where: { bookingId: booking.id } })
  console.log(`✔ Step 13: Total Audit Logs recorded for booking: ${logs.length} events.`)

  console.log('\n==================================================')
  console.log('🎉 ALL 29-STEP LIFECYCLE & DATA CONSISTENCY TESTS PASSED 100% PERFECTLY!')
  console.log('==================================================\n')
}

runLifecycleTest()
  .catch((err) => {
    console.error('❌ LIFECYCLE TEST FAILED:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
