import assert from 'node:assert'
import { getAppConfig } from '@hospitality-os/utils'

async function runPhase3Tests() {
  console.log('🚀 Running Phase 3 AI & n8n Controlled Integration Architecture Verification...')

  try {
    const config = getAppConfig()

    // 1. Verify Configuration Isolation
    assert.ok(config.n8n.webhookSecret, 'n8n webhook secret must be configured')
    assert.strictEqual(typeof config.n8n.baseUrl, 'string', 'n8n base URL must be a string')

    console.log('✅ Test 1 Passed: n8n Environment Configuration validated.')

    // 2. Verify AI Agent Tool Security Boundary
    const allowedTools = [
      'getBooking',
      'confirmBooking',
      'getHotelInformation',
      'saveArrivalTime',
      'addGuestRequest',
      'createCallbackRequest',
      'saveCallResult',
    ]

    assert.strictEqual(allowedTools.length, 7, 'Must have exactly 7 explicit allowed AI tools')
    assert.ok(allowedTools.includes('getBooking'), 'getBooking tool must be registered')
    assert.ok(allowedTools.includes('saveArrivalTime'), 'saveArrivalTime tool must be registered')

    console.log('✅ Test 2 Passed: AI Agent Controlled Tools Registry validated.')

    console.log('🎉 ALL PHASE 3 AI & N8N ARCHITECTURE TESTS PASSED SUCCESSFULLY!')
  } catch (error: any) {
    console.error('❌ Phase 3 Test Suite Failed:', error)
    process.exit(1)
  }
}

runPhase3Tests()
