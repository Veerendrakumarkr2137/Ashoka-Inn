# Environment Configuration & Security Specification

This document details the environment strategy, variable mappings, security boundaries, and service configurations for **Hospitality OS / Hotel PMS**.

---

## 1. Environment Strategy

The codebase uses explicit environment configuration to ensure zero hardcoded production URLs or secrets.

| Environment | Config File | Tracking | Purpose |
| :--- | :--- | :--- | :--- |
| **Template** | `.env.example` | Git Tracked | Reference template with all configurable keys and safe default fallbacks. |
| **Local Development** | `.env.local` | Git Ignored | Local developer credentials and local service overrides. |
| **Cloud Production** | Hosting Environment | Platform Managed | Injected securely via hosting platform dashboard (Vercel, Supabase, Render, AWS). |

> [!WARNING]
> **Git Discipline**: Never commit `.env`, `.env.local`, or any file containing real API keys or production secrets to Git.

---

## 2. Variable Scope & Security Mapping

### Browser vs Server Boundary Rules
- **Public Variables (`NEXT_PUBLIC_*`)**: Safe to expose to the browser. Contains public app URLs, public Supabase endpoints, public gateway key IDs, and hotel branding.
- **Server Variables**: Secret credentials accessible **ONLY** on Node.js / Next.js server-side code (API routes, Server Actions, Middleware). Never prefix with `NEXT_PUBLIC_`.

### Service Mapping Matrix

| Variable | Scope | Target Service | Purpose |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Server Only | ORM / Database Layer | PostgreSQL or SQLite connection string. |
| `ADMIN_PASSWORD` | Server Only | Admin App Auth | Master password for local admin portal access. |
| `AUTH_SECRET` | Server Only | Admin & Web Auth | Secret key used for signing session cookies. |
| `JWT_SECRET` | Server Only | API / n8n Auth | Secret key used for verifying API tokens and webhook signatures. |
| `NEXT_PUBLIC_SUPABASE_URL` | Both | Supabase Client | Endpoint for Supabase cloud services. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Both | Supabase Client | Anon publishable key for public client queries. |
| `VOICE_PROVIDER` | Server Only | AI Voice Adapter | Active voice provider (`mock`, `livekit`, `twilio`). |
| `LIVEKIT_URL` / `LIVEKIT_API_KEY` | Server Only | Voice Agent | Credentials for LiveKit SIP & WebRTC rooms. |
| `WHATSAPP_PROVIDER` | Server Only | Messaging Adapter | Active WhatsApp provider (`mock`, `meta`, `twilio`). |
| `WHATSAPP_API_KEY` | Server Only | WhatsApp Service | Meta/Twilio API access token. |
| `EMAIL_PROVIDER` | Server Only | Email Adapter | Active email provider (`mock`, `resend`, `smtp`). |
| `EMAIL_API_KEY` / `SMTP_*` | Server Only | Email Service | Resend API key or SMTP server connection credentials. |
| `PAYMENT_PROVIDER` | Server Only | Payment Gateway | Active gateway (`mock`, `razorpay`, `stripe`). |
| `PAYMENT_SECRET` | Server Only | Payment Gateway | Merchant secret key for server-side charge verification. |
| `NEXT_PUBLIC_PAYMENT_KEY_ID` | Both | Frontend Checkout | Public client key ID for Razorpay/Stripe checkout SDK. |
| `N8N_BASE_URL` | Server Only | n8n Orchestrator | Base URL of n8n automation engine. |
| `N8N_WEBHOOK_SECRET` | Server Only | Webhook Verification | Shared secret key for verifying incoming n8n webhook HTTP headers (`X-N8N-Webhook-Secret`). |

---

## 3. Local Demo vs Production Setup

### Local Demo Mode
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Local defaults rely on SQLite (`dev.db`) or local Docker PostgreSQL and `mock` provider adapters.

### Managed Cloud Production Mode
In Vercel / Render / Supabase settings:
1. Set `DATABASE_URL` to your managed PostgreSQL connection string (`postgresql://postgres:...@db.xxx.supabase.co:5432/postgres`).
2. Set `VOICE_PROVIDER=livekit`, `WHATSAPP_PROVIDER=meta`, `PAYMENT_PROVIDER=razorpay`.
3. Fill in corresponding API secrets (`LIVEKIT_API_KEY`, `WHATSAPP_API_KEY`, `PAYMENT_SECRET`).
4. Set `N8N_WEBHOOK_SECRET` to a cryptographically random secret string.
