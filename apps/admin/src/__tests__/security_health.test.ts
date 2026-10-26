import assert from 'node:assert'
import { hasPermission, assertRole } from '../lib/auth/rbac'

async function runPhase5Tests() {
  console.log('🚀 Running Phase 5 Security, RBAC & Health Verification...')

  try {
    // 1. Verify Role Hierarchy
    assert.strictEqual(hasPermission('ADMIN', 'RECEPTIONIST'), true, 'ADMIN should have RECEPTIONIST permissions')
    assert.strictEqual(hasPermission('RECEPTIONIST', 'ADMIN'), false, 'RECEPTIONIST should NOT have ADMIN permissions')
    assert.strictEqual(hasPermission('HOUSEKEEPING', 'GUEST'), true, 'HOUSEKEEPING should have GUEST permissions')

    // 2. Verify assertRole throw behavior
    assert.throws(
      () => assertRole('GUEST', 'ADMIN'),
      /Forbidden/,
      'GUEST asserting ADMIN role must throw Forbidden error'
    )

    console.log('✅ Test 1 Passed: Role-Based Access Control (RBAC) permission logic verified.')
    console.log('🎉 ALL PHASE 5 SECURITY & RBAC TESTS PASSED SUCCESSFULLY!')
  } catch (error: any) {
    console.error('❌ Phase 5 Test Suite Failed:', error)
    process.exit(1)
  }
}

runPhase5Tests()
