# AI Receptionist & n8n Architecture Specification

This document details the security model, controlled tool boundaries, and n8n automation flow for the **AI Receptionist & Automation Engine**.

---

## 1. Security Architecture & Flow

> [!IMPORTANT]
> **Zero Direct Database Access**: The AI agent and n8n automation engine are **NEVER** given direct database access or arbitrary SQL/ORM query capabilities.

```text
  [ Voice Call / WhatsApp / Web Chat ]
                  │
                  ▼
          [ LiveKit / n8n ]
                  │ (HTTP POST with X-N8N-Webhook-Secret or Bearer Token)
                  ▼
  [ /api/ai/agent-tools OR /api/webhooks/n8n ]
                  │
                  ▼ (Strict Tool Registry & Argument Validation)
  [ Backend Domain Services ] (BookingService, FolioService)
                  │
                  ▼ (Atomic Transactions & Audit Logging)
         [ PostgreSQL Database ]
```

---

## 2. Controlled AI Tool Registry

All agent operations are restricted to the 7 explicit tools registered in `apps/admin/src/app/api/ai/agent-tools/route.ts`:

1. `getBooking`: Retrieves booking details (Ref, Guest Name, Stay Dates, Status) by `bookingRef`.
2. `confirmBooking`: Confirms a reservation and assigns a room.
3. `getHotelInformation`: Returns hotel check-in/out policies, amenities, and contact info.
4. `saveArrivalTime`: Logs confirmed guest arrival time to booking notes.
5. `addGuestRequest`: Logs special requests (extra pillows, late check-in) to booking.
6. `createCallbackRequest`: Logs callback request for human front desk staff in activity logs.
7. `saveCallResult`: Records AI call transcript summary and sentiment to audit trail.

---

## 3. n8n Webhook Authentication & Verification

Incoming webhooks from n8n (`/api/webhooks/n8n`) require the header:
```http
X-N8N-Webhook-Secret: [N8N_WEBHOOK_SECRET]
```
Requests lacking a valid secret are rejected with `401 Unauthorized`.
