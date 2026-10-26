# Commercial Production Deployment Guide

This guide details deployment procedures for **Hospitality OS / Hotel PMS** across **Local Demo (Windows/Docker)** and **Managed Cloud Production (Vercel, Supabase, LiveKit, n8n)** environments.

---

## 1. Local Demo Deployment (Windows / Docker)

### Prerequisites
- Node.js 20+ / pnpm 9+
- Docker Desktop (Optional for local PostgreSQL / n8n)

### Step-by-Step Setup
1. Clone repository and install dependencies:
   ```bash
   pnpm install
   ```
2. Prepare environment variables:
   ```bash
   cp .env.example .env.local
   ```
3. Run Prisma database push & seed:
   ```bash
   pnpm --filter database db:push
   pnpm --filter database db:seed
   ```
4. Start local development servers:
   ```bash
   pnpm dev
   ```
   - Guest Web Portal: `http://localhost:3000`
   - Admin PMS Dashboard: `http://localhost:3001`

---

## 2. Managed Cloud Production Deployment

### Architecture & Service Selection
- **Frontend / Guest Portal**: Managed Next.js on Vercel (`apps/hotel-web`).
- **Admin PMS Dashboard**: Managed Next.js on Vercel (`apps/admin`).
- **Database**: Managed PostgreSQL on Supabase Cloud.
- **Voice Agent**: Managed LiveKit Cloud / Twilio SIP Trunking.
- **WhatsApp Messaging**: Meta Cloud API.
- **Automation / Orchestration**: Hosted n8n instance.

### Vercel Production Environment Variables
Set the following variables in Vercel Project Settings for both `admin` and `hotel-web`:

```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://hotelashokha.com
NEXT_PUBLIC_ADMIN_URL=https://admin.hotelashokha.com
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?schema=public
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=[YOUR_SUPABASE_ANON_KEY]

VOICE_PROVIDER=livekit
LIVEKIT_URL=https://livekit.hotelashokha.com
LIVEKIT_API_KEY=[YOUR_LIVEKIT_KEY]
LIVEKIT_API_SECRET=[YOUR_LIVEKIT_SECRET]

WHATSAPP_PROVIDER=meta
WHATSAPP_API_KEY=[YOUR_META_API_TOKEN]
WHATSAPP_PHONE_NUMBER_ID=[YOUR_PHONE_NUMBER_ID]

PAYMENT_PROVIDER=razorpay
PAYMENT_SECRET=[YOUR_RAZORPAY_SECRET]
NEXT_PUBLIC_PAYMENT_KEY_ID=[YOUR_RAZORPAY_KEY_ID]

EMAIL_PROVIDER=resend
EMAIL_API_KEY=[YOUR_RESEND_KEY]

N8N_BASE_URL=https://n8n.hotelashokha.com
N8N_WEBHOOK_SECRET=[YOUR_CRYPTOGRAPHIC_RANDOM_SECRET]
```

### Production Health Verification
Invoke the production readiness health endpoint:
```bash
curl https://admin.hotelashokha.com/api/health
```

Expected Response (`200 OK`):
```json
{
  "status": "ok",
  "service": "admin-pms",
  "version": "1.0.0",
  "timestamp": "2026-08-13T12:00:00.000Z",
  "latencyMs": 14,
  "checks": {
    "database": "connected"
  }
}
```
