import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Hotel Ashokha Database with dynamic live operational data...')

  // Clean existing operational data in order of foreign key dependencies
  await prisma.task.deleteMany()
  await prisma.inspection.deleteMany()
  await prisma.damagePriceConfig.deleteMany()
  await prisma.activityLog.deleteMany()
  await prisma.systemSetting.deleteMany()
  await prisma.maintenanceTicket.deleteMany()
  await prisma.bookingNote.deleteMany()
  await prisma.serviceOrderItem.deleteMany()
  await prisma.serviceOrder.deleteMany()
  await prisma.serviceItem.deleteMany()
  await prisma.serviceCategory.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.roomAllocation.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.roomImage.deleteMany()
  await prisma.room.deleteMany()
  await prisma.roomCategory.deleteMany()
  await prisma.user.deleteMany()

  // ─── 1. SEED ROOM CATEGORIES ──────────────────────────────────────
  const deluxeNonAC = await prisma.roomCategory.create({
    data: {
      name: 'Deluxe Non-AC',
      description: 'Comfortable stay with essential amenities.',
      basePrice: 3500,
      capacity: 2,
      sizeSqm: 25,
      hasAC: false,
      hasTV: true,
      hasKettle: true,
      hasWater: true,
    },
  })

  const superiorAC = await prisma.roomCategory.create({
    data: {
      name: 'Superior AC',
      description: 'Premium air-conditioned comfort with modern design.',
      basePrice: 5500,
      capacity: 2,
      sizeSqm: 32,
      hasAC: true,
      hasTV: true,
      hasKettle: true,
      hasWater: true,
    },
  })

  const familyAC = await prisma.roomCategory.create({
    data: {
      name: 'Family AC',
      description: 'Spacious accommodation perfect for families.',
      basePrice: 8500,
      capacity: 4,
      sizeSqm: 45,
      hasAC: true,
      hasTV: true,
      hasKettle: true,
      hasWater: true,
    },
  })

  const kingSuite = await prisma.roomCategory.create({
    data: {
      name: 'King Suite',
      description: 'Ultimate luxury with premium services and extra space.',
      basePrice: 15000,
      capacity: 2,
      sizeSqm: 60,
      hasAC: true,
      hasTV: true,
      hasKettle: true,
      hasWater: true,
    },
  })

  // Seed Room Images
  const roomImages = [
    { roomCategoryId: deluxeNonAC.id, url: '/images/rooms/deluxe-non-ac/1.jpg' },
    { roomCategoryId: deluxeNonAC.id, url: '/images/rooms/deluxe-non-ac/2.jpg' },
    { roomCategoryId: superiorAC.id, url: '/images/rooms/superior-ac/1.jpg' },
    { roomCategoryId: superiorAC.id, url: '/images/rooms/superior-ac/2.jpg' },
    { roomCategoryId: familyAC.id, url: '/images/rooms/family-ac/1.jpg' },
    { roomCategoryId: kingSuite.id, url: '/images/rooms/king-suite/1.jpg' },
  ]
  for (const img of roomImages) {
    await prisma.roomImage.create({ data: img })
  }

  // ─── 2. SEED 45 SPECIFIC ROOMS ────────────────────────────────────
  const roomConfig: Array<{ number: string; categoryId: string; status: string }> = []
  
  const statuses = [
    // 20 Occupied rooms
    'OCCUPIED', 'OCCUPIED', 'OCCUPIED', 'OCCUPIED', 'OCCUPIED',
    'OCCUPIED', 'OCCUPIED', 'OCCUPIED', 'OCCUPIED', 'OCCUPIED',
    'OCCUPIED', 'OCCUPIED', 'OCCUPIED', 'OCCUPIED', 'OCCUPIED',
    'OCCUPIED', 'OCCUPIED', 'OCCUPIED', 'OCCUPIED', 'OCCUPIED',
    // 2 Maintenance
    'MAINTENANCE', 'MAINTENANCE',
    // 3 Cleaning
    'CLEANING', 'CLEANING', 'CLEANING',
    // 20 Available
    ...Array(20).fill('AVAILABLE')
  ]

  let roomIndex = 0
  for (let f = 1; f <= 3; f++) {
    for (let r = 1; r <= 15; r++) {
      const roomNum = `${f}${r.toString().padStart(2, '0')}`
      let catId = superiorAC.id
      if (f === 1 && r <= 11) catId = deluxeNonAC.id
      else if (f === 3 && r >= 8 && r <= 10) catId = familyAC.id
      else if (f === 3 && r >= 11) catId = kingSuite.id

      const status = statuses[roomIndex] || 'AVAILABLE'
      roomConfig.push({ number: roomNum, categoryId: catId, status })
      roomIndex++
    }
  }

  const createdRooms: Record<string, any> = {}
  for (const r of roomConfig) {
    const room = await prisma.room.create({
      data: {
        roomNumber: r.number,
        roomCategoryId: r.categoryId,
        status: r.status,
      }
    })
    createdRooms[r.number] = room
  }

  console.log(`✔ 45 Rooms seeded with realistic live statuses`)

  // ─── 3. SEED USERS & GUESTS ───────────────────────────────────────
  await prisma.user.create({
    data: {
      email: 'admin@hotelashokha.com',
      name: 'Super Admin',
      role: 'ADMIN',
      phone: '+91 98765 43210',
    }
  })

  const sampleGuests = [
    { name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', phone: '+91 98123 45678' },
    { name: 'Priya Kumar', email: 'priya.k@yahoo.com', phone: '+91 98234 56789' },
    { name: 'John Thomas', email: 'jthomas@outlook.com', phone: '+91 98345 67890' },
    { name: 'Ananya Verma', email: 'ananya.v@gmail.com', phone: '+91 98456 78901' },
    { name: 'Vikramaditya Roy', email: 'vikram.roy@corporate.com', phone: '+91 98567 89012' },
    { name: 'Siddharth Mehta', email: 'siddharth@mehtagroup.in', phone: '+91 98678 90123' },
    { name: 'Deepika Patel', email: 'deepika.p@gmail.com', phone: '+91 98789 01234' },
    { name: 'Arjun Kapoor', email: 'arjun.kapoor@gmail.com', phone: '+91 98890 12345' },
    { name: 'Kavita Reddy', email: 'kavita.r@gmail.com', phone: '+91 98901 23456' },
    { name: 'Rohan Gupta', email: 'rohan.g@techcorp.io', phone: '+91 99012 34567' },
    { name: 'Meera Deshmukh', email: 'meera.d@gmail.com', phone: '+91 99123 45678' },
    { name: 'Amitabh Sen', email: 'asen@consulting.com', phone: '+91 99234 56789' },
  ]

  const createdGuests = []
  for (const g of sampleGuests) {
    const u = await prisma.user.create({
      data: {
        name: g.name,
        email: g.email,
        phone: g.phone,
        role: 'GUEST',
      }
    })
    createdGuests.push(u)
  }

  // ─── 4. SEED BOOKINGS, CHECK-INS, CHECK-OUTS & PAYMENTS ──────────
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
  
  const daysAgo = (d: number, hours = 10) => new Date(todayStart.getTime() - d * 86400000 + hours * 3600000)
  const daysAhead = (d: number, hours = 12) => new Date(todayStart.getTime() + d * 86400000 + hours * 3600000)

  const bookingSeeds = [
    // --- TODAY'S ARRIVALS (Check-in = Today) ---
    {
      ref: 'BKG-2026-001',
      guest: createdGuests[0], // Rahul Sharma
      roomNum: '102',
      checkIn: new Date(todayStart.getTime() + 9 * 3600000), // 09:00 AM Today
      checkOut: daysAhead(2, 11),
      amount: 11000,
      status: 'CONFIRMED',
      paymentStatus: 'COMPLETED',
      paymentMethod: 'UPI',
    },
    {
      ref: 'BKG-2026-002',
      guest: createdGuests[1], // Priya Kumar
      roomNum: '204',
      checkIn: new Date(todayStart.getTime() + 10.5 * 3600000), // 10:30 AM Today
      checkOut: daysAhead(3, 11),
      amount: 16500,
      status: 'CONFIRMED',
      paymentStatus: 'COMPLETED',
      paymentMethod: 'CARD',
    },
    {
      ref: 'BKG-2026-003',
      guest: createdGuests[2], // John Thomas
      roomNum: '311', // King Suite
      checkIn: new Date(todayStart.getTime() + 12 * 3600000), // 12:00 PM Today
      checkOut: daysAhead(4, 11),
      amount: 60000,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      paymentMethod: 'CASH',
    },
    {
      ref: 'BKG-2026-004',
      guest: createdGuests[3], // Ananya Verma
      roomNum: '208',
      checkIn: new Date(todayStart.getTime() + 14 * 3600000), // 02:00 PM Today
      checkOut: daysAhead(1, 11),
      amount: 5500,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      paymentMethod: 'CASH',
    },

    // --- TODAY'S DEPARTURES (Check-out = Today, status CHECKED_IN currently) ---
    {
      ref: 'BKG-2026-005',
      guest: createdGuests[4], // Vikramaditya Roy
      roomNum: '203',
      checkIn: daysAgo(3, 14),
      checkOut: new Date(todayStart.getTime() + 11 * 3600000), // 11:00 AM Today
      amount: 16500,
      status: 'CHECKED_IN',
      paymentStatus: 'COMPLETED',
      paymentMethod: 'CARD',
    },
    {
      ref: 'BKG-2026-006',
      guest: createdGuests[5], // Siddharth Mehta
      roomNum: '305',
      checkIn: daysAgo(2, 12),
      checkOut: new Date(todayStart.getTime() + 12 * 3600000), // 12:00 PM Today
      amount: 11000,
      status: 'CHECKED_IN',
      paymentStatus: 'COMPLETED',
      paymentMethod: 'UPI',
    },
    {
      ref: 'BKG-2026-007',
      guest: createdGuests[6], // Deepika Patel
      roomNum: '302',
      checkIn: daysAgo(4, 15),
      checkOut: new Date(todayStart.getTime() + 10 * 3600000), // 10:00 AM Today
      amount: 22000,
      status: 'CHECKED_IN',
      paymentStatus: 'COMPLETED',
      paymentMethod: 'CARD',
    },

    // --- ACTIVE CHECKED_IN ROOMS (Checked-in previously, staying past today) ---
    {
      ref: 'BKG-2026-008',
      guest: createdGuests[7], // Arjun Kapoor
      roomNum: '201',
      checkIn: daysAgo(1, 14),
      checkOut: daysAhead(2, 11),
      amount: 16500,
      status: 'CHECKED_IN',
      paymentStatus: 'COMPLETED',
      paymentMethod: 'CARD',
    },
    {
      ref: 'BKG-2026-009',
      guest: createdGuests[8], // Kavita Reddy
      roomNum: '312',
      checkIn: daysAgo(2, 14),
      checkOut: daysAhead(1, 11),
      amount: 45000,
      status: 'CHECKED_IN',
      paymentStatus: 'COMPLETED',
      paymentMethod: 'UPI',
    },

    // --- UPCOMING BOOKINGS ---
    {
      ref: 'BKG-2026-010',
      guest: createdGuests[9], // Rohan Gupta
      roomNum: '308',
      checkIn: daysAhead(1, 14),
      checkOut: daysAhead(4, 11),
      amount: 25500,
      status: 'CONFIRMED',
      paymentStatus: 'COMPLETED',
      paymentMethod: 'CARD',
    },
    {
      ref: 'BKG-2026-011',
      guest: createdGuests[10], // Meera Deshmukh
      roomNum: '105',
      checkIn: daysAhead(2, 12),
      checkOut: daysAhead(5, 11),
      amount: 10500,
      status: 'CONFIRMED',
      paymentStatus: 'COMPLETED',
      paymentMethod: 'UPI',
    },

    // --- COMPLETED & CANCELLED ---
    {
      ref: 'BKG-2026-012',
      guest: createdGuests[11], // Amitabh Sen
      roomNum: '101',
      checkIn: daysAgo(6, 12),
      checkOut: daysAgo(4, 11),
      amount: 7000,
      status: 'CHECKED_OUT',
      paymentStatus: 'COMPLETED',
      paymentMethod: 'CARD',
    },
    {
      ref: 'BKG-2026-013',
      guest: createdGuests[0],
      roomNum: '202',
      checkIn: daysAgo(5, 14),
      checkOut: daysAgo(3, 11),
      amount: 11000,
      status: 'CANCELLED',
      paymentStatus: 'REFUNDED',
      paymentMethod: 'UPI',
    },
  ]

  const createdBookingsMap: Record<string, any> = {}
  for (const b of bookingSeeds) {
    const booking = await prisma.booking.create({
      data: {
        bookingRef: b.ref,
        userId: b.guest.id,
        checkIn: b.checkIn,
        checkOut: b.checkOut,
        adults: 2,
        children: 0,
        totalAmount: b.amount,
        status: b.status,
        specialRequests: b.status === 'CONFIRMED' ? 'Late check-in requested' : null,
        allocations: {
          create: {
            roomId: createdRooms[b.roomNum]?.id || Object.values(createdRooms)[0].id,
            checkIn: b.checkIn,
            checkOut: b.checkOut,
          }
        },
        payments: {
          create: {
            userId: b.guest.id,
            amount: b.amount,
            currency: 'INR',
            status: b.paymentStatus,
            paymentMethod: b.paymentMethod,
            transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
            createdAt: b.checkIn,
          }
        }
      }
    })
    createdBookingsMap[b.ref] = booking
  }

  // ─── 5. SEED 7-DAY REVENUE PAYMENTS ───────────────
  const dayAmounts = [42000, 58000, 75000, 64000, 89000, 112000, 124500]
  const firstBooking = await prisma.booking.findFirst()
  if (firstBooking) {
    for (let i = 6; i >= 0; i--) {
      const txnDate = daysAgo(i, 15)
      await prisma.payment.create({
        data: {
          bookingId: firstBooking.id,
          userId: createdGuests[i % createdGuests.length].id,
          amount: dayAmounts[6 - i],
          currency: 'INR',
          status: 'COMPLETED',
          paymentMethod: i % 2 === 0 ? 'UPI' : 'CARD',
          transactionId: `TXN-HIST-${7 - i}`,
          createdAt: txnDate,
        }
      })
    }
  }

  // ─── 6. SEED RESTAURANT & ROOM SERVICE MENU ITEMS & LIVE ORDERS ──────
  const roomServiceCategory = await prisma.serviceCategory.create({ data: { name: 'Room Service' } })
  const restaurantCategory = await prisma.serviceCategory.create({ data: { name: 'Restaurant' } })
  const laundryCategory = await prisma.serviceCategory.create({ data: { name: 'Laundry' } })

  const item1 = await prisma.serviceItem.create({
    data: { name: 'Paneer Butter Masala & Naan', price: 380, categoryId: restaurantCategory.id }
  })
  const item2 = await prisma.serviceItem.create({
    data: { name: 'Chicken Biryani with Raita', price: 450, categoryId: restaurantCategory.id }
  })
  const item3 = await prisma.serviceItem.create({
    data: { name: 'Masala Dosa & Filter Coffee', price: 220, categoryId: restaurantCategory.id }
  })
  const item4 = await prisma.serviceItem.create({
    data: { name: 'Club Sandwich with French Fries', price: 280, categoryId: roomServiceCategory.id }
  })
  const item5 = await prisma.serviceItem.create({
    data: { name: 'Hot Masala Tea & Biscuits', price: 140, categoryId: roomServiceCategory.id }
  })
  const item6 = await prisma.serviceItem.create({
    data: { name: 'Cold Coffee with Vanilla Scoop', price: 180, categoryId: roomServiceCategory.id }
  })
  const item7 = await prisma.serviceItem.create({
    data: { name: 'Dry Cleaning Service', price: 350, categoryId: laundryCategory.id }
  })

  // Seed Live Service Orders linked to active occupied bookings!
  const b1 = createdBookingsMap['BKG-2026-001'] // Rahul Sharma (Room 102)
  const b2 = createdBookingsMap['BKG-2026-002'] // Priya Kumar (Room 204)
  const b5 = createdBookingsMap['BKG-2026-005'] // Vikramaditya Roy (Room 203)
  const b8 = createdBookingsMap['BKG-2026-008'] // Arjun Kapoor (Room 201)
  const b9 = createdBookingsMap['BKG-2026-009'] // Kavita Reddy (Room 312)

  if (b1) {
    await prisma.serviceOrder.create({
      data: {
        bookingId: b1.id,
        status: 'PENDING',
        totalAmount: 940,
        createdAt: new Date(now.getTime() - 15 * 60000), // 15 mins ago
        items: {
          create: [
            { serviceItemId: item1.id, quantity: 2, priceAtTime: 380 },
            { serviceItemId: item6.id, quantity: 1, priceAtTime: 180 },
          ]
        }
      }
    })
  }

  if (b2) {
    await prisma.serviceOrder.create({
      data: {
        bookingId: b2.id,
        status: 'PREPARING',
        totalAmount: 630,
        createdAt: new Date(now.getTime() - 25 * 60000), // 25 mins ago
        items: {
          create: [
            { serviceItemId: item2.id, quantity: 1, priceAtTime: 450 },
            { serviceItemId: item6.id, quantity: 1, priceAtTime: 180 },
          ]
        }
      }
    })
  }

  if (b5) {
    await prisma.serviceOrder.create({
      data: {
        bookingId: b5.id,
        status: 'PREPARING',
        totalAmount: 440,
        createdAt: new Date(now.getTime() - 35 * 60000), // 35 mins ago
        items: {
          create: [
            { serviceItemId: item3.id, quantity: 2, priceAtTime: 220 },
          ]
        }
      }
    })
  }

  if (b8) {
    await prisma.serviceOrder.create({
      data: {
        bookingId: b8.id,
        status: 'DELIVERED',
        totalAmount: 420,
        createdAt: new Date(now.getTime() - 60 * 60000), // 1 hour ago
        items: {
          create: [
            { serviceItemId: item4.id, quantity: 1, priceAtTime: 280 },
            { serviceItemId: item5.id, quantity: 1, priceAtTime: 140 },
          ]
        }
      }
    })
  }

  if (b9) {
    await prisma.serviceOrder.create({
      data: {
        bookingId: b9.id,
        status: 'DELIVERED',
        totalAmount: 700,
        createdAt: new Date(now.getTime() - 120 * 60000), // 2 hours ago
        items: {
          create: [
            { serviceItemId: item7.id, quantity: 2, priceAtTime: 350 },
          ]
        }
      }
    })
  }

  if (b1) {
    await prisma.bookingNote.create({
      data: {
        bookingId: b1.id,
        message: 'Guest requested quiet room away from elevator with extra towels.',
        author: 'Front Desk Staff'
      }
    })
    await prisma.bookingNote.create({
      data: {
        bookingId: b1.id,
        message: 'Pre-checked and arrival confirmed via AI Voice Bot at 09:14 AM.',
        author: 'System Audit'
      }
    })
  }

  if (b2) {
    await prisma.bookingNote.create({
      data: {
        bookingId: b2.id,
        message: 'Guest requested late check-out till 01:30 PM (Approved by General Manager).',
        author: 'General Manager'
      }
    })
  }

  // Seed sample Maintenance Engineering Tickets
  const allDbRooms = await prisma.room.findMany()
  const room402 = allDbRooms.find(r => r.roomNumber === '402') || allDbRooms[0]
  const room205 = allDbRooms.find(r => r.roomNumber === '205') || allDbRooms[1]

  if (room402) {
    await prisma.maintenanceTicket.create({
      data: {
        roomId: room402.id,
        issue: 'Air Conditioner water leaking near balcony wall',
        priority: 'URGENT',
        status: 'IN_PROGRESS',
        technician: 'Suresh Verma (HVAC)',
        notes: 'Compressor valve filter replaced; testing airflow.',
        reportedBy: 'Housekeeping Supervisor'
      }
    })
  }

  if (room205) {
    await prisma.maintenanceTicket.create({
      data: {
        roomId: room205.id,
        issue: 'Bathroom hot water geyser trip switch fault',
        priority: 'HIGH',
        status: 'REPORTED',
        technician: 'Unassigned',
        notes: 'Guest reported lukewarm water in morning.',
        reportedBy: 'Front Desk Staff'
      }
    })
  }

  // ─── 7. SEED DAMAGE PRICING CONFIGURATIONS ───────────────────────
  const damageConfigs = [
    { itemName: 'Bath Towel', price: 600, category: 'LINEN_ITEMS' },
    { itemName: 'Hand Towel', price: 300, category: 'LINEN_ITEMS' },
    { itemName: 'AC Remote', price: 1200, category: 'ELECTRONICS' },
    { itemName: 'TV Remote', price: 1000, category: 'ELECTRONICS' },
    { itemName: 'Electric Kettle', price: 1500, category: 'APPLIANCES' },
    { itemName: 'Glass Tumbler', price: 200, category: 'CROCKERY' },
    { itemName: 'Bedsheet Set', price: 1800, category: 'LINEN_ITEMS' },
    { itemName: 'Pillow Cover', price: 250, category: 'LINEN_ITEMS' },
    { itemName: 'Hair Dryer', price: 2500, category: 'APPLIANCES' },
  ]
  for (const d of damageConfigs) {
    await prisma.damagePriceConfig.create({ data: d })
  }

  // ─── 8. SEED SYSTEM SETTINGS ──────────────────────────────────────
  const systemSettings = [
    { key: 'hotel_name', value: 'Hotel Ashok Inn', category: 'GENERAL' },
    { key: 'tax_rate_gst', value: '12', category: 'FINANCIAL' },
    { key: 'checkout_time', value: '11:00 AM', category: 'OPERATIONS' },
    { key: 'checkin_time', value: '02:00 PM', category: 'OPERATIONS' },
    { key: 'auto_cleaning_task', value: 'true', category: 'AUTOMATION' },
    { key: 'currency', value: 'INR', category: 'FINANCIAL' },
  ]
  for (const s of systemSettings) {
    await prisma.systemSetting.create({ data: s })
  }

  // ─── 9. SEED OPERATIONAL TASKS & AUDIT TRAIL ─────────────────────
  const dirtyRoom104 = allDbRooms.find(r => r.roomNumber === '104') || allDbRooms[2]
  const dirtyRoom206 = allDbRooms.find(r => r.roomNumber === '206') || allDbRooms[3]

  if (dirtyRoom104) {
    await prisma.room.update({ where: { id: dirtyRoom104.id }, data: { status: 'DIRTY' } })
    await prisma.task.create({
      data: {
        type: 'CLEANING',
        title: `Clean & Sanitize Room ${dirtyRoom104.roomNumber}`,
        description: 'Deep clean linen, replace towels, sanitize bathroom surfaces.',
        status: 'PENDING',
        priority: 'HIGH',
        assignedStaff: 'Ramesh (Housekeeping)',
        roomId: dirtyRoom104.id,
      }
    })
  }

  if (dirtyRoom206) {
    await prisma.room.update({ where: { id: dirtyRoom206.id }, data: { status: 'CLEANING' } })
    await prisma.task.create({
      data: {
        type: 'CLEANING',
        title: `Express Housekeeping Room ${dirtyRoom206.roomNumber}`,
        description: 'Guest requested early check-in preparation.',
        status: 'IN_PROGRESS',
        priority: 'URGENT',
        assignedStaff: 'Sunita (Housekeeping)',
        roomId: dirtyRoom206.id,
        startTime: new Date(now.getTime() - 20 * 60000),
      }
    })
  }

  // Seed sample initial Activity Logs
  const activityLogs = [
    { category: 'BOOKING', action: 'CHECK_IN', message: 'Guest Rahul Sharma checked into Room 102', author: 'Reception Desk', roomId: createdRooms['102']?.id },
    { category: 'HOUSEKEEPING', action: 'START_CLEANING', message: 'Sunita started cleaning Room 206', author: 'Housekeeping App', roomId: createdRooms['206']?.id },
    { category: 'DAMAGE', action: 'DAMAGE_ADDED', message: 'Posted ₹600 (Bath Towel missing) to Room 203 folio', author: 'Supervisor Inspection', roomId: createdRooms['203']?.id },
    { category: 'SERVICE', action: 'ORDER_CREATED', message: 'New Room Service Order #104 (₹940) posted to Room 102', author: 'KDS System', roomId: createdRooms['102']?.id },
  ]
  for (const log of activityLogs) {
    await prisma.activityLog.create({ data: log })
  }

  console.log('✔ Live Restaurant, Room Service, & PMS Operational Data seeded!')
  console.log('🎉 Seeding finished cleanly.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
