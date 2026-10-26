import assert from 'node:assert'
import {
  getVoiceProvider,
  getWhatsAppProvider,
  getPaymentProvider,
  getEmailProvider,
  MockVoiceProvider,
  LiveKitVoiceProvider,
  MockWhatsAppProvider,
  MetaWhatsAppProvider,
  MockPaymentProvider,
  RazorpayPaymentProvider,
  MockEmailProvider,
  ResendEmailProvider,
  NormalizedProviderError,
} from '../lib/providers'

async function runTests() {
  console.log('🚀 Running Phase 2 Provider Abstraction Layer Verification Suite...')
  const originalEnv = { ...process.env }

  try {
    // ─── TEST 1: MOCK MODE VERIFICATION ─────────────────────────────────────────
    process.env.VOICE_PROVIDER = 'mock'
    process.env.WHATSAPP_PROVIDER = 'mock'
    process.env.PAYMENT_PROVIDER = 'mock'
    process.env.EMAIL_PROVIDER = 'mock'

    const voice = getVoiceProvider()
    const whatsapp = getWhatsAppProvider()
    const payment = getPaymentProvider()
    const email = getEmailProvider()

    assert.ok(voice instanceof MockVoiceProvider, 'Voice should be MockVoiceProvider')
    assert.ok(whatsapp instanceof MockWhatsAppProvider, 'WhatsApp should be MockWhatsAppProvider')
    assert.ok(payment instanceof MockPaymentProvider, 'Payment should be MockPaymentProvider')
    assert.ok(email instanceof MockEmailProvider, 'Email should be MockEmailProvider')

    // Execute mock operations
    const callRes = await voice.startOutboundCall({ toPhone: '+919876543210', bookingRef: 'BKG-TEST-1' })
    assert.strictEqual(callRes.success, true)
    assert.ok(callRes.callId.includes('mock-call'))

    const waRes = await whatsapp.sendMessage({ toPhone: '+919876543210', messageBody: 'Test Message' })
    assert.strictEqual(waRes.success, true)
    assert.strictEqual(waRes.status, 'DELIVERED')

    const payRes = await payment.createPayment({ amount: 5000, currency: 'INR', bookingRef: 'BKG-TEST-1', customerEmail: 'guest@example.com' })
    assert.strictEqual(payRes.success, true)
    assert.ok(payRes.orderId.includes('order_mock'))

    const mailRes = await email.sendEmail({ to: 'guest@example.com', subject: 'Confirmation', htmlBody: '<p>Confirmed</p>' })
    assert.strictEqual(mailRes.success, true)
    assert.ok(mailRes.messageId.includes('msg_mock'))

    console.log('✅ Test 1 Passed: Mock Mode deterministic operation & provider instantiation verified.')

    // ─── TEST 2: PRODUCTION PROVIDER SELECTION ──────────────────────────────────
    process.env.VOICE_PROVIDER = 'livekit'
    process.env.LIVEKIT_URL = 'https://livekit.test.domain'
    process.env.LIVEKIT_API_KEY = 'test_key'
    process.env.LIVEKIT_API_SECRET = 'test_secret'

    process.env.WHATSAPP_PROVIDER = 'meta'
    process.env.WHATSAPP_API_KEY = 'meta_test_key'
    process.env.WHATSAPP_PHONE_NUMBER_ID = '123456789'

    process.env.PAYMENT_PROVIDER = 'razorpay'
    process.env.PAYMENT_SECRET = 'rzp_secret_key'

    process.env.EMAIL_PROVIDER = 'resend'
    process.env.EMAIL_API_KEY = 're_test_key'

    assert.ok(getVoiceProvider() instanceof LiveKitVoiceProvider, 'Should select LiveKitVoiceProvider')
    assert.ok(getWhatsAppProvider() instanceof MetaWhatsAppProvider, 'Should select MetaWhatsAppProvider')
    assert.ok(getPaymentProvider() instanceof RazorpayPaymentProvider, 'Should select RazorpayPaymentProvider')
    assert.ok(getEmailProvider() instanceof ResendEmailProvider, 'Should select ResendEmailProvider')

    console.log('✅ Test 2 Passed: Dynamic Production Provider Selection verified.')

    // ─── TEST 3: PRODUCTION CREDENTIAL FAILURE (NO FAKE SUCCESS) ────────────────
    process.env.VOICE_PROVIDER = 'livekit'
    delete process.env.LIVEKIT_URL
    delete process.env.LIVEKIT_API_KEY
    delete process.env.LIVEKIT_API_SECRET

    assert.throws(() => getVoiceProvider(), NormalizedProviderError, 'LiveKit missing credentials must throw error')

    process.env.WHATSAPP_PROVIDER = 'meta'
    delete process.env.WHATSAPP_API_KEY
    delete process.env.WHATSAPP_PHONE_NUMBER_ID

    assert.throws(() => getWhatsAppProvider(), NormalizedProviderError, 'Meta WhatsApp missing credentials must throw error')

    process.env.PAYMENT_PROVIDER = 'razorpay'
    delete process.env.PAYMENT_SECRET

    assert.throws(() => getPaymentProvider(), NormalizedProviderError, 'Razorpay missing credentials must throw error')

    process.env.EMAIL_PROVIDER = 'resend'
    delete process.env.EMAIL_API_KEY

    assert.throws(() => getEmailProvider(), NormalizedProviderError, 'Resend missing credentials must throw error')

    console.log('✅ Test 3 Passed: Production credential validation & NormalizedProviderError failure verified.')

    console.log('🎉 ALL PHASE 2 PROVIDER TESTS PASSED SUCCESSFULLY!')
  } finally {
    process.env = originalEnv
  }
}

runTests().catch((err) => {
  console.error('❌ Provider Test Suite Failed:', err)
  process.exit(1)
})
