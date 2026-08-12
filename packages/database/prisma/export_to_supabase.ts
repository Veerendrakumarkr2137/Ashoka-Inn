import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function exportData() {
  console.log('Exporting exact active Admin PMS database content to Supabase SQL...')

  const users = await prisma.user.findMany()
  const categories = await prisma.roomCategory.findMany()
  const roomImages = await prisma.roomImage.findMany()
  const rooms = await prisma.room.findMany()
  const maintenance = await prisma.maintenanceTicket.findMany()
  const bookings = await prisma.booking.findMany()
  const notes = await prisma.bookingNote.findMany()
  const folios = await prisma.folioCharge.findMany()
  const allocations = await prisma.roomAllocation.findMany()
  const payments = await prisma.payment.findMany()
  const serviceCats = await prisma.serviceCategory.findMany()
  const serviceItems = await prisma.serviceItem.findMany()
  const serviceOrders = await prisma.serviceOrder.findMany()
  const serviceOrderItems = await prisma.serviceOrderItem.findMany()
  const reviews = await prisma.review.findMany()
  const tickets = await prisma.supportTicket.findMany()
  const inquiries = await prisma.contactInquiry.findMany()
  const tasks = await prisma.task.findMany()
  const inspections = await prisma.inspection.findMany()
  const damageConfigs = await prisma.damagePriceConfig.findMany()
  const activityLogs = await prisma.activityLog.findMany()
  const settings = await prisma.systemSetting.findMany()

  const escapeSql = (val: any) => {
    if (val === null || val === undefined) return 'NULL'
    if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE'
    if (typeof val === 'number') return val
    if (val instanceof Date) return `'${val.toISOString()}'`
    const str = String(val).replace(/'/g, "''")
    return `'${str}'`
  }

  let sql = `-- ====================================================================\n`
  sql += `-- HOTEL ASHOKHA - EXACT ADMIN PMS LIVE DATABASE DUMP FOR SUPABASE\n`
  sql += `-- Created: ${new Date().toISOString()}\n`
  sql += `-- Copy & Paste into Supabase Dashboard -> SQL Editor -> Run\n`
  sql += `-- ====================================================================\n\n`

  sql += `-- 1. DROP EXISTING TABLES\n`
  sql += `DROP TABLE IF EXISTS "SystemSetting" CASCADE;\n`
  sql += `DROP TABLE IF EXISTS "ActivityLog" CASCADE;\n`
  sql += `DROP TABLE IF EXISTS "DamagePriceConfig" CASCADE;\n`
  sql += `DROP TABLE IF EXISTS "Inspection" CASCADE;\n`
  sql += `DROP TABLE IF EXISTS "Task" CASCADE;\n`
  sql += `DROP TABLE IF EXISTS "ContactInquiry" CASCADE;\n`
  sql += `DROP TABLE IF EXISTS "SupportTicket" CASCADE;\n`
  sql += `DROP TABLE IF EXISTS "Review" CASCADE;\n`
  sql += `DROP TABLE IF EXISTS "ServiceOrderItem" CASCADE;\n`
  sql += `DROP TABLE IF EXISTS "ServiceOrder" CASCADE;\n`
  sql += `DROP TABLE IF EXISTS "ServiceItem" CASCADE;\n`
  sql += `DROP TABLE IF EXISTS "ServiceCategory" CASCADE;\n`
  sql += `DROP TABLE IF EXISTS "Payment" CASCADE;\n`
  sql += `DROP TABLE IF EXISTS "RoomAllocation" CASCADE;\n`
  sql += `DROP TABLE IF EXISTS "FolioCharge" CASCADE;\n`
  sql += `DROP TABLE IF EXISTS "BookingNote" CASCADE;\n`
  sql += `DROP TABLE IF EXISTS "Booking" CASCADE;\n`
  sql += `DROP TABLE IF EXISTS "MaintenanceTicket" CASCADE;\n`
  sql += `DROP TABLE IF EXISTS "Room" CASCADE;\n`
  sql += `DROP TABLE IF EXISTS "RoomImage" CASCADE;\n`
  sql += `DROP TABLE IF EXISTS "RoomCategory" CASCADE;\n`
  sql += `DROP TABLE IF EXISTS "User" CASCADE;\n\n`

  sql += `-- 2. CREATE TABLES\n`
  sql += `CREATE TABLE "User" ("id" TEXT PRIMARY KEY, "email" TEXT UNIQUE NOT NULL, "name" TEXT NOT NULL, "role" TEXT NOT NULL DEFAULT 'GUEST', "phone" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);\n`
  sql += `CREATE TABLE "RoomCategory" ("id" TEXT PRIMARY KEY, "name" TEXT UNIQUE NOT NULL, "description" TEXT NOT NULL, "basePrice" DOUBLE PRECISION NOT NULL, "capacity" INT NOT NULL DEFAULT 2, "sizeSqm" INT, "hasAC" BOOLEAN NOT NULL DEFAULT TRUE, "hasTV" BOOLEAN NOT NULL DEFAULT TRUE, "hasKettle" BOOLEAN NOT NULL DEFAULT TRUE, "hasWater" BOOLEAN NOT NULL DEFAULT TRUE, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);\n`
  sql += `CREATE TABLE "RoomImage" ("id" TEXT PRIMARY KEY, "url" TEXT NOT NULL, "roomCategoryId" TEXT NOT NULL REFERENCES "RoomCategory"("id") ON DELETE CASCADE);\n`
  sql += `CREATE TABLE "Room" ("id" TEXT PRIMARY KEY, "roomNumber" TEXT UNIQUE NOT NULL, "status" TEXT NOT NULL DEFAULT 'AVAILABLE', "roomCategoryId" TEXT NOT NULL REFERENCES "RoomCategory"("id"), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);\n`
  sql += `CREATE TABLE "MaintenanceTicket" ("id" TEXT PRIMARY KEY, "roomId" TEXT NOT NULL REFERENCES "Room"("id") ON DELETE CASCADE, "issue" TEXT NOT NULL, "priority" TEXT NOT NULL DEFAULT 'MEDIUM', "status" TEXT NOT NULL DEFAULT 'REPORTED', "technician" TEXT DEFAULT 'Unassigned', "notes" TEXT, "reportedBy" TEXT NOT NULL DEFAULT 'Front Desk Staff', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);\n`
  sql += `CREATE TABLE "Booking" ("id" TEXT PRIMARY KEY, "bookingRef" TEXT UNIQUE NOT NULL, "userId" TEXT NOT NULL REFERENCES "User"("id"), "checkIn" TIMESTAMP(3) NOT NULL, "checkOut" TIMESTAMP(3) NOT NULL, "actualCheckIn" TIMESTAMP(3), "actualCheckOut" TIMESTAMP(3), "adults" INT NOT NULL DEFAULT 2, "children" INT NOT NULL DEFAULT 0, "totalAmount" DOUBLE PRECISION NOT NULL, "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0, "taxAmount" DOUBLE PRECISION NOT NULL DEFAULT 0, "status" TEXT NOT NULL DEFAULT 'PENDING', "specialRequests" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);\n`
  sql += `CREATE TABLE "BookingNote" ("id" TEXT PRIMARY KEY, "bookingId" TEXT NOT NULL REFERENCES "Booking"("id") ON DELETE CASCADE, "message" TEXT NOT NULL, "author" TEXT NOT NULL DEFAULT 'Front Desk Staff', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);\n`
  sql += `CREATE TABLE "FolioCharge" ("id" TEXT PRIMARY KEY, "bookingId" TEXT NOT NULL REFERENCES "Booking"("id") ON DELETE CASCADE, "category" TEXT NOT NULL, "description" TEXT NOT NULL, "quantity" INT NOT NULL DEFAULT 1, "unitPrice" DOUBLE PRECISION NOT NULL, "taxAmount" DOUBLE PRECISION NOT NULL DEFAULT 0, "totalAmount" DOUBLE PRECISION NOT NULL, "source" TEXT NOT NULL DEFAULT 'FRONT_DESK', "author" TEXT NOT NULL DEFAULT 'Staff', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);\n`
  sql += `CREATE TABLE "RoomAllocation" ("id" TEXT PRIMARY KEY, "bookingId" TEXT NOT NULL REFERENCES "Booking"("id") ON DELETE CASCADE, "roomId" TEXT NOT NULL REFERENCES "Room"("id"), "checkIn" TIMESTAMP(3) NOT NULL, "checkOut" TIMESTAMP(3) NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);\n`
  sql += `CREATE TABLE "Payment" ("id" TEXT PRIMARY KEY, "bookingId" TEXT NOT NULL REFERENCES "Booking"("id") ON DELETE CASCADE, "userId" TEXT NOT NULL REFERENCES "User"("id"), "amount" DOUBLE PRECISION NOT NULL, "currency" TEXT NOT NULL DEFAULT 'INR', "status" TEXT NOT NULL DEFAULT 'PENDING', "paymentMethod" TEXT, "transactionId" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);\n`
  sql += `CREATE TABLE "ServiceCategory" ("id" TEXT PRIMARY KEY, "name" TEXT UNIQUE NOT NULL);\n`
  sql += `CREATE TABLE "ServiceItem" ("id" TEXT PRIMARY KEY, "categoryId" TEXT NOT NULL REFERENCES "ServiceCategory"("id"), "name" TEXT NOT NULL, "description" TEXT, "price" DOUBLE PRECISION NOT NULL, "isAvailable" BOOLEAN NOT NULL DEFAULT TRUE);\n`
  sql += `CREATE TABLE "ServiceOrder" ("id" TEXT PRIMARY KEY, "bookingId" TEXT NOT NULL REFERENCES "Booking"("id") ON DELETE CASCADE, "status" TEXT NOT NULL DEFAULT 'PENDING', "totalAmount" DOUBLE PRECISION NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);\n`
  sql += `CREATE TABLE "ServiceOrderItem" ("id" TEXT PRIMARY KEY, "orderId" TEXT NOT NULL REFERENCES "ServiceOrder"("id") ON DELETE CASCADE, "serviceItemId" TEXT NOT NULL REFERENCES "ServiceItem"("id"), "quantity" INT NOT NULL DEFAULT 1, "priceAtTime" DOUBLE PRECISION NOT NULL);\n`
  sql += `CREATE TABLE "Review" ("id" TEXT PRIMARY KEY, "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE, "rating" INT NOT NULL, "comment" TEXT, "status" TEXT NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);\n`
  sql += `CREATE TABLE "SupportTicket" ("id" TEXT PRIMARY KEY, "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE, "subject" TEXT NOT NULL, "message" TEXT NOT NULL, "status" TEXT NOT NULL DEFAULT 'OPEN', "priority" TEXT NOT NULL DEFAULT 'MEDIUM', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);\n`
  sql += `CREATE TABLE "ContactInquiry" ("id" TEXT PRIMARY KEY, "fullName" TEXT NOT NULL, "email" TEXT NOT NULL, "phone" TEXT NOT NULL, "inquiryType" TEXT NOT NULL, "message" TEXT NOT NULL, "status" TEXT NOT NULL DEFAULT 'NEW', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);\n`
  sql += `CREATE TABLE "Task" ("id" TEXT PRIMARY KEY, "type" TEXT NOT NULL, "title" TEXT NOT NULL, "description" TEXT, "status" TEXT NOT NULL DEFAULT 'PENDING', "priority" TEXT NOT NULL DEFAULT 'MEDIUM', "assignedStaff" TEXT DEFAULT 'Unassigned', "roomId" TEXT, "bookingId" TEXT, "startTime" TIMESTAMP(3), "completedTime" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);\n`
  sql += `CREATE TABLE "Inspection" ("id" TEXT PRIMARY KEY, "roomId" TEXT NOT NULL, "bookingId" TEXT, "inspector" TEXT NOT NULL DEFAULT 'Housekeeping Supervisor', "status" TEXT NOT NULL DEFAULT 'PASSED', "checklistJson" TEXT NOT NULL, "totalDamageCharge" DOUBLE PRECISION NOT NULL DEFAULT 0, "notes" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);\n`
  sql += `CREATE TABLE "DamagePriceConfig" ("id" TEXT PRIMARY KEY, "itemName" TEXT UNIQUE NOT NULL, "price" DOUBLE PRECISION NOT NULL, "category" TEXT NOT NULL DEFAULT 'LINEN_ITEMS', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);\n`
  sql += `CREATE TABLE "ActivityLog" ("id" TEXT PRIMARY KEY, "category" TEXT NOT NULL, "action" TEXT NOT NULL, "message" TEXT NOT NULL, "author" TEXT NOT NULL DEFAULT 'System Audit', "roomId" TEXT, "bookingId" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);\n`
  sql += `CREATE TABLE "SystemSetting" ("id" TEXT PRIMARY KEY, "key" TEXT UNIQUE NOT NULL, "value" TEXT NOT NULL, "category" TEXT NOT NULL DEFAULT 'GENERAL', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);\n\n`

  sql += `-- 3. INSERT LIVE PMS DATA\n`

  // User
  for (const u of users) {
    sql += `INSERT INTO "User" ("id", "email", "name", "role", "phone", "createdAt", "updatedAt") VALUES (${escapeSql(u.id)}, ${escapeSql(u.email)}, ${escapeSql(u.name)}, ${escapeSql(u.role)}, ${escapeSql(u.phone)}, ${escapeSql(u.createdAt)}, ${escapeSql(u.updatedAt)});\n`
  }

  // RoomCategory
  for (const c of categories) {
    sql += `INSERT INTO "RoomCategory" ("id", "name", "description", "basePrice", "capacity", "sizeSqm", "hasAC", "hasTV", "hasKettle", "hasWater", "createdAt", "updatedAt") VALUES (${escapeSql(c.id)}, ${escapeSql(c.name)}, ${escapeSql(c.description)}, ${escapeSql(c.basePrice)}, ${escapeSql(c.capacity)}, ${escapeSql(c.sizeSqm)}, ${escapeSql(c.hasAC)}, ${escapeSql(c.hasTV)}, ${escapeSql(c.hasKettle)}, ${escapeSql(c.hasWater)}, ${escapeSql(c.createdAt)}, ${escapeSql(c.updatedAt)});\n`
  }

  // RoomImage
  for (const img of roomImages) {
    sql += `INSERT INTO "RoomImage" ("id", "url", "roomCategoryId") VALUES (${escapeSql(img.id)}, ${escapeSql(img.url)}, ${escapeSql(img.roomCategoryId)});\n`
  }

  // Room
  for (const r of rooms) {
    sql += `INSERT INTO "Room" ("id", "roomNumber", "status", "roomCategoryId", "createdAt", "updatedAt") VALUES (${escapeSql(r.id)}, ${escapeSql(r.roomNumber)}, ${escapeSql(r.status)}, ${escapeSql(r.roomCategoryId)}, ${escapeSql(r.createdAt)}, ${escapeSql(r.updatedAt)});\n`
  }

  // MaintenanceTicket
  for (const m of maintenance) {
    sql += `INSERT INTO "MaintenanceTicket" ("id", "roomId", "issue", "priority", "status", "technician", "notes", "reportedBy", "createdAt", "updatedAt") VALUES (${escapeSql(m.id)}, ${escapeSql(m.roomId)}, ${escapeSql(m.issue)}, ${escapeSql(m.priority)}, ${escapeSql(m.status)}, ${escapeSql(m.technician)}, ${escapeSql(m.notes)}, ${escapeSql(m.reportedBy)}, ${escapeSql(m.createdAt)}, ${escapeSql(m.updatedAt)});\n`
  }

  // Booking
  for (const b of bookings) {
    sql += `INSERT INTO "Booking" ("id", "bookingRef", "userId", "checkIn", "checkOut", "actualCheckIn", "actualCheckOut", "adults", "children", "totalAmount", "discountAmount", "taxAmount", "status", "specialRequests", "createdAt", "updatedAt") VALUES (${escapeSql(b.id)}, ${escapeSql(b.bookingRef)}, ${escapeSql(b.userId)}, ${escapeSql(b.checkIn)}, ${escapeSql(b.checkOut)}, ${escapeSql(b.actualCheckIn)}, ${escapeSql(b.actualCheckOut)}, ${escapeSql(b.adults)}, ${escapeSql(b.children)}, ${escapeSql(b.totalAmount)}, ${escapeSql(b.discountAmount)}, ${escapeSql(b.taxAmount)}, ${escapeSql(b.status)}, ${escapeSql(b.specialRequests)}, ${escapeSql(b.createdAt)}, ${escapeSql(b.updatedAt)});\n`
  }

  // BookingNote
  for (const n of notes) {
    sql += `INSERT INTO "BookingNote" ("id", "bookingId", "message", "author", "createdAt") VALUES (${escapeSql(n.id)}, ${escapeSql(n.bookingId)}, ${escapeSql(n.message)}, ${escapeSql(n.author)}, ${escapeSql(n.createdAt)});\n`
  }

  // FolioCharge
  for (const f of folios) {
    sql += `INSERT INTO "FolioCharge" ("id", "bookingId", "category", "description", "quantity", "unitPrice", "taxAmount", "totalAmount", "source", "author", "createdAt") VALUES (${escapeSql(f.id)}, ${escapeSql(f.bookingId)}, ${escapeSql(f.category)}, ${escapeSql(f.description)}, ${escapeSql(f.quantity)}, ${escapeSql(f.unitPrice)}, ${escapeSql(f.taxAmount)}, ${escapeSql(f.totalAmount)}, ${escapeSql(f.source)}, ${escapeSql(f.author)}, ${escapeSql(f.createdAt)});\n`
  }

  // RoomAllocation
  for (const a of allocations) {
    sql += `INSERT INTO "RoomAllocation" ("id", "bookingId", "roomId", "checkIn", "checkOut", "createdAt") VALUES (${escapeSql(a.id)}, ${escapeSql(a.bookingId)}, ${escapeSql(a.roomId)}, ${escapeSql(a.checkIn)}, ${escapeSql(a.checkOut)}, ${escapeSql(a.createdAt)});\n`
  }

  // Payment
  for (const p of payments) {
    sql += `INSERT INTO "Payment" ("id", "bookingId", "userId", "amount", "currency", "status", "paymentMethod", "transactionId", "createdAt") VALUES (${escapeSql(p.id)}, ${escapeSql(p.bookingId)}, ${escapeSql(p.userId)}, ${escapeSql(p.amount)}, ${escapeSql(p.currency)}, ${escapeSql(p.status)}, ${escapeSql(p.paymentMethod)}, ${escapeSql(p.transactionId)}, ${escapeSql(p.createdAt)});\n`
  }

  // ServiceCategory
  for (const sc of serviceCats) {
    sql += `INSERT INTO "ServiceCategory" ("id", "name") VALUES (${escapeSql(sc.id)}, ${escapeSql(sc.name)});\n`
  }

  // ServiceItem
  for (const si of serviceItems) {
    sql += `INSERT INTO "ServiceItem" ("id", "categoryId", "name", "description", "price", "isAvailable") VALUES (${escapeSql(si.id)}, ${escapeSql(si.categoryId)}, ${escapeSql(si.name)}, ${escapeSql(si.description)}, ${escapeSql(si.price)}, ${escapeSql(si.isAvailable)});\n`
  }

  // ServiceOrder
  for (const so of serviceOrders) {
    sql += `INSERT INTO "ServiceOrder" ("id", "bookingId", "status", "totalAmount", "createdAt", "updatedAt") VALUES (${escapeSql(so.id)}, ${escapeSql(so.bookingId)}, ${escapeSql(so.status)}, ${escapeSql(so.totalAmount)}, ${escapeSql(so.createdAt)}, ${escapeSql(so.updatedAt)});\n`
  }

  // ServiceOrderItem
  for (const soi of serviceOrderItems) {
    sql += `INSERT INTO "ServiceOrderItem" ("id", "orderId", "serviceItemId", "quantity", "priceAtTime") VALUES (${escapeSql(soi.id)}, ${escapeSql(soi.orderId)}, ${escapeSql(soi.serviceItemId)}, ${escapeSql(soi.quantity)}, ${escapeSql(soi.priceAtTime)});\n`
  }

  // Task
  for (const t of tasks) {
    sql += `INSERT INTO "Task" ("id", "type", "title", "description", "status", "priority", "assignedStaff", "roomId", "bookingId", "startTime", "completedTime", "createdAt", "updatedAt") VALUES (${escapeSql(t.id)}, ${escapeSql(t.type)}, ${escapeSql(t.title)}, ${escapeSql(t.description)}, ${escapeSql(t.status)}, ${escapeSql(t.priority)}, ${escapeSql(t.assignedStaff)}, ${escapeSql(t.roomId)}, ${escapeSql(t.bookingId)}, ${escapeSql(t.startTime)}, ${escapeSql(t.completedTime)}, ${escapeSql(t.createdAt)}, ${escapeSql(t.updatedAt)});\n`
  }

  // DamagePriceConfig
  for (const d of damageConfigs) {
    sql += `INSERT INTO "DamagePriceConfig" ("id", "itemName", "price", "category", "createdAt", "updatedAt") VALUES (${escapeSql(d.id)}, ${escapeSql(d.itemName)}, ${escapeSql(d.price)}, ${escapeSql(d.category)}, ${escapeSql(d.createdAt)}, ${escapeSql(d.updatedAt)});\n`
  }

  // ActivityLog
  for (const al of activityLogs) {
    sql += `INSERT INTO "ActivityLog" ("id", "category", "action", "message", "author", "roomId", "bookingId", "createdAt") VALUES (${escapeSql(al.id)}, ${escapeSql(al.category)}, ${escapeSql(al.action)}, ${escapeSql(al.message)}, ${escapeSql(al.author)}, ${escapeSql(al.roomId)}, ${escapeSql(al.bookingId)}, ${escapeSql(al.createdAt)});\n`
  }

  // SystemSetting
  for (const ss of settings) {
    sql += `INSERT INTO "SystemSetting" ("id", "key", "value", "category", "createdAt", "updatedAt") VALUES (${escapeSql(ss.id)}, ${escapeSql(ss.key)}, ${escapeSql(ss.value)}, ${escapeSql(ss.category)}, ${escapeSql(ss.createdAt)}, ${escapeSql(ss.updatedAt)});\n`
  }

  const outputPath = path.join(__dirname, 'supabase_schema_and_data.sql')
  fs.writeFileSync(outputPath, sql, 'utf8')
  console.log(`🎉 Successfully exported active PMS database (${users.length} Users, ${rooms.length} Rooms, ${bookings.length} Bookings, ${serviceOrders.length} Service Orders, ${folios.length} Folios) to ${outputPath}`)
}

exportData()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
