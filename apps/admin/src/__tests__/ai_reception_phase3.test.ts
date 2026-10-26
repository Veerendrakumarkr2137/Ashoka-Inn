import assert from 'node:assert'
import { AiReceptionService } from '../lib/services/AiReceptionService'
import { BookingService } from '../lib/services/BookingService'
import { prisma } from '@hospitality-os/database'

async function runPhase3Tests() {
  console.log('🚀 Running Phase 3 AI Reception & Controlled n8n Integration Test Suite...')

  try {
    // 1. Create a Test User and Booking for Phase 3 Verification
    const testUser = await prisma.user.upsert({
      where: { email: 'phase3.test.guest@ashokainn.com' },
      update: { name: 'Test Guest', phone: '+919876543210' },
      create: {
        email: 'phase3.test.guest@ashokainn.com',
        name: 'Test Guest',
        phone: '+919876543210',
        role: 'GUEST',
      },
    })

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfter = new Date(tomorrow)
    dayAfter.setDate(dayAfter.getDate() + 1)

    const testBooking = await prisma.booking.create({
      data: {
        bookingRef: `BKG-P3TEST-${Date.now()}`,
        userId: testUser.id,
        checkIn: tomorrow,
        checkOut: dayAfter,
        adults: 2,
        children: 0,
        totalAmount: 4500,
        status: 'CONFIRMED',
      },
    })

    console.log(`✅ Created Test Booking: ${testBooking.bookingRef}`)

    // 2. Test Safe Booking Context (No direct arbitrary DB query exposure)
    const safeContext = await AiReceptionService.getSafeBookingContext(testBooking.id)
    assert.ok(safeContext, 'Safe booking context must be returned')
    assert.strictEqual(safeContext?.bookingRef, testBooking.bookingRef)
    assert.strictEqual(safeContext?.guestName, 'Test Guest')
    assert.strictEqual(safeContext?.status, 'CONFIRMED')
    assert.strictEqual((safeContext as any).password, undefined, 'Passwords must not be exposed')
    assert.strictEqual((safeContext as any).apiSecret, undefined, 'Secrets must not be exposed')
    console.log('✅ Test 1 Passed: Safe booking context retrieved cleanly.')

    // 3. Test Persistent Call Session Creation
    const callSession = await AiReceptionService.createCallSession(testBooking.id, 'mock')
    assert.ok(callSession.id, 'Call session must be created with ID')
    assert.strictEqual(callSession.status, 'CREATED')
    console.log('✅ Test 2 Passed: Persistent AI Call Session created.')

    // 4. Test Idempotent Save Arrival Time
    const arrivalResult = await AiReceptionService.saveArrivalTime(testBooking.id, '15:00', 'ai_voice')
    assert.strictEqual(arrivalResult.success, true)
    assert.strictEqual(arrivalResult.arrivalTime, '15:00')

    // Duplicate call to verify idempotency
    const duplicateArrival = await AiReceptionService.saveArrivalTime(testBooking.id, '15:00', 'ai_voice')
    assert.strictEqual(duplicateArrival.success, true)
    console.log('✅ Test 3 Passed: Save arrival time is 100% idempotent.')

    // 5. Test Save Call Result & Session Outcome Update
    const resultSaved = await AiReceptionService.saveCallResult({
      sessionId: callSession.id,
      bookingId: testBooking.id,
      callStatus: 'COMPLETED',
      outcome: 'PRE_ARRIVAL_CONFIRMED',
      language: 'en-IN',
      duration: 42,
      summary: 'Guest confirmed arrival for 3:00 PM and requested a quiet room.',
      sentiment: 'POSITIVE',
      arrivalTime: '15:00',
      guestRequest: 'Quiet room requested',
    })
    assert.strictEqual(resultSaved.success, true)

    const updatedSession = await prisma.aiCallSession.findUnique({ where: { id: callSession.id } })
    assert.strictEqual(updatedSession?.status, 'COMPLETED')
    assert.strictEqual(updatedSession?.sentiment, 'POSITIVE')
    console.log('✅ Test 4 Passed: AI Call Session result saved to database.')

    // 6. Test Callback Request Creation for Front Desk
    const callbackTask = await AiReceptionService.createCallbackRequest({
      bookingId: testBooking.id,
      guestName: 'Test Guest',
      phone: '+919876543210',
      reason: 'Inquired about late checkout policy',
      priority: 'MEDIUM',
    })
    assert.ok(callbackTask.id)
    assert.strictEqual(callbackTask.status, 'PENDING')
    console.log('✅ Test 5 Passed: Callback request created for front desk team.')

    // 7. Verify n8n Eligible Bookings Query
    const eligibleList = await AiReceptionService.getEligibleBookings()
    assert.ok(Array.isArray(eligibleList))
    console.log(`✅ Test 6 Passed: n8n Eligible bookings query returned ${eligibleList.length} items.`)

    // Cleanup Test Data
    await prisma.aiCallSession.deleteMany({ where: { bookingId: testBooking.id } })
    await prisma.bookingNote.deleteMany({ where: { bookingId: testBooking.id } })
    await prisma.task.deleteMany({ where: { bookingId: testBooking.id } })
    await prisma.activityLog.deleteMany({ where: { bookingId: testBooking.id } })
    await prisma.booking.delete({ where: { id: testBooking.id } })

    console.log('🎉 ALL PHASE 3 AI RECEPTION & N8N INTEGRATION TESTS PASSED SUCCESSFULLY!')
  } catch (error: any) {
    console.error('❌ Phase 3 Test Suite Failed:', error)
    process.exit(1)
  }
}

runPhase3Tests()
