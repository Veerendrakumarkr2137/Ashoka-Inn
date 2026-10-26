# Hospitality OS Architecture & Provider Specification

This document details the high-level system architecture and the **Provider Abstraction Layer** implemented in **Hospitality OS / Hotel PMS**.

---

## 1. High-Level Architecture Overview

```text
       [ Guest Web Portal ]             [ Admin PMS Dashboard ]
       (apps/hotel-web:3000)             (apps/admin:3001)
                 │                                │
                 └────────────────┬───────────────┘
                                  │
                          [ Server Actions ]
                                  │
                 ┌────────────────┴────────────────┐
                 │                                 │
     [ Core Domain Services ]             [ Provider Abstraction Layer ]
  (BookingService, FolioService)        (getVoiceProvider, getPaymentProvider)
                 │                                 │
        [ Prisma ORM Layer ]               [ External Vendor Adapters ]
                 │                    (LiveKit, Meta, Razorpay, Resend, Mock)
     [ PostgreSQL Database ]
 (Supabase / Local PostgreSQL)
```

---

## 2. Provider Abstraction Layer

All external integrations are isolated behind clean, normalized TypeScript interfaces located in `apps/admin/src/lib/providers/`. Application services depend exclusively on factory functions (`getVoiceProvider()`, `getWhatsAppProvider()`, `getPaymentProvider()`, `getEmailProvider()`), never on direct vendor SDKs.

### Provider Matrix & Supported Adapters

| Provider Domain | Interface | Environment Switch | Available Adapters |
| :--- | :--- | :--- | :--- |
| **Voice Receptionist** | `IVoiceProvider` | `VOICE_PROVIDER` | `mock` (`MockVoiceProvider`), `livekit` (`LiveKitVoiceProvider`) |
| **WhatsApp Messaging** | `IWhatsAppProvider` | `WHATSAPP_PROVIDER` | `mock` (`MockWhatsAppProvider`), `meta` (`MetaWhatsAppProvider`), `twilio` (`TwilioWhatsAppProvider`) |
| **Payment Gateway** | `IPaymentProvider` | `PAYMENT_PROVIDER` | `mock` (`MockPaymentProvider`), `razorpay` (`RazorpayPaymentProvider`), `stripe` (`StripePaymentProvider`) |
| **Email Service** | `IEmailProvider` | `EMAIL_PROVIDER` | `mock` (`MockEmailProvider`), `resend` (`ResendEmailProvider`), `smtp` (`SMTPEmailProvider`) |

---

## 3. Environment Modes & Safety

### Demo / Development Mode (`mock`)
Setting `VOICE_PROVIDER=mock`, `WHATSAPP_PROVIDER=mock`, `PAYMENT_PROVIDER=mock`, `EMAIL_PROVIDER=mock` enables 100% offline local development without paid API accounts.
- Deterministic response shapes (e.g. `mock-call-1786604505`, `order_mock_12345`).
- Structured console logs detailing operations.
- Zero network requests to third-party APIs.

### Managed Cloud Production Mode
Setting `VOICE_PROVIDER=livekit`, `WHATSAPP_PROVIDER=meta`, `PAYMENT_PROVIDER=razorpay`, `EMAIL_PROVIDER=resend` selects production adapters.
- **Production Safety Rule**: Missing required credentials (e.g. `LIVEKIT_URL`, `WHATSAPP_API_KEY`, `PAYMENT_SECRET`, `EMAIL_API_KEY`) causes the factory to throw `NormalizedProviderError` with code `MISSING_CREDENTIALS`.
- **No Silent Mock Fallbacks**: Production mode will **never** silently fall back to mock or pretend an uncredentialed operation succeeded.

---

## 4. Running Provider Verification Tests

Run the standalone verification test suite:
```bash
pnpm dlx tsx apps/admin/src/__tests__/providers.test.ts
```

Output:
```text
🚀 Running Phase 2 Provider Abstraction Layer Verification Suite...
✅ Test 1 Passed: Mock Mode deterministic operation & provider instantiation verified.
✅ Test 2 Passed: Dynamic Production Provider Selection verified.
✅ Test 3 Passed: Production credential validation & NormalizedProviderError failure verified.
🎉 ALL PHASE 2 PROVIDER TESTS PASSED SUCCESSFULLY!
```
