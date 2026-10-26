# Database & Migration Specification

This document outlines the database schema, Prisma ORM configuration, migration strategy, and transactional guarantees for **Hospitality OS / Hotel PMS**.

---

## 1. Engine Consistency Strategy

To prevent engine mismatch bugs between SQLite and PostgreSQL, **Hospitality OS** uses **PostgreSQL as the standard database engine across Development, Staging, and Production**.

- **Dev / Staging**: Local Docker PostgreSQL or Supabase PostgreSQL branch.
- **Production**: Supabase Managed PostgreSQL Instance.

---

## 2. Core Entity Relational Map

- `User`: Guests, Receptionists, Admins, Staff with unique emails and roles.
- `RoomCategory`: Defines inventory category, amenities, base price, and images.
- `Room`: Physical room units (`101`, `102`) with real-time status (`AVAILABLE`, `OCCUPIED`, `DIRTY`, `CLEANING`, `MAINTENANCE`).
- `Booking`: Guest stay reservations with `bookingRef`, check-in/out timestamps, adults/children, financial breakdown, and status lifecycle.
- `RoomAllocation`: Junction linking specific rooms to active bookings.
- `FolioCharge`: Granular charges posted to guest folio (`ROOM`, `RESTAURANT`, `ROOM_SERVICE`, `LAUNDRY`, `DAMAGE`, `MISSING_ITEMS`).
- `Payment`: Financial ledger entries (`amount`, `currency`, `status`, `paymentMethod`, `transactionId`).
- `Task`: Housekeeping and inspection operational tasks.
- `ActivityLog`: Audit trail entries for security and operational compliance.

---

## 3. Database Migration & Supabase SQL Export

### Reproducible Prisma Migrations
Generate and apply migrations:
```bash
pnpm --filter database prisma migrate dev --name init
```

### Export SQL Migration File
To export the complete PostgreSQL schema and seed data into a standalone SQL script:
```bash
pnpm --filter database tsx prisma/export_to_supabase.ts
```
This produces `packages/database/prisma/supabase_schema_and_data.sql` which can be executed directly inside the Supabase SQL Editor.
