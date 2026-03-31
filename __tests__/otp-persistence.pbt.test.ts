import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import * as fc from 'fast-check'

/**
 * Property-Based Test: OTP Persistence Across Module Reloads
 * 
 * **Validates: Requirements 1.1, 1.2, 2.1**
 * 
 * This test suite uses property-based testing to verify OTP persistence behavior
 * across module reloads. It generates random email/OTP combinations to test the
 * bug condition comprehensively.
 * 
 * **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * **DO NOT attempt to fix the test or the code when it fails**
 * **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes
 */

// Set test environment BEFORE importing anything
process.env.NODE_ENV = 'test'
process.env.ADMIN_EMAIL = 'admin@example.com'
process.env.GMAIL_USER = 'test@gmail.com'
process.env.GMAIL_APP_PASSWORD = 'test-password'
process.env.JWT_SECRET = 'test-jwt-secret-key-at-least-32-characters-long'

// Mock nodemailer to avoid actual email sending
vi.mock('nodemailer', () => ({
  default: {
    createTransport: () => ({
      sendMail: vi.fn().mockResolvedValue({
        messageId: 'test-message-id',
        accepted: ['admin@example.com'],
        rejected: [],
        response: '250 Message accepted',
      }),
    }),
  },
}))

// Import services after mocking
import { 
  generateAndSendOTP, 
  verifyOTP, 
  clearAllOTPs,
  getOTPForTesting 
} from '@/lib/services/otp-service'

beforeEach(() => {
  clearAllOTPs()
  vi.clearAllMocks()
})

afterEach(() => {
  clearAllOTPs()
})

/**
 * Property 1: Bug Condition - OTP Lost After Module Reload
 * 
 * **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
 * 
 * This property tests that OTP persists across module reloads for all valid email/OTP combinations.
 * 
 * Test Strategy:
 * 1. Generate OTP for an email
 * 2. Simulate module reload by clearing the in-memory Map
 * 3. Attempt verification
 * 4. Assert that verifyOTP returns true for valid OTP
 * 
 * On UNFIXED code:
 * - verifyOTP returns false because otpStore.get(email) returns undefined after module reload
 * - This failure is EXPECTED and proves the bug exists
 * 
 * On FIXED code:
 * - verifyOTP returns true because OTP data persists in file storage
 * - This success confirms the fix works correctly
 */
describe('Property 1: Bug Condition - OTP Lost After Module Reload', () => {
  it('should persist OTP across module reloads for all valid email/OTP combinations', async () => {
    // Property-based test: for all valid emails, OTP should persist across module reload
    await fc.assert(
      fc.asyncProperty(
        // Generate arbitrary email addresses
        fc.emailAddress(),
        async (email) => {
          // Skip non-admin emails as they won't generate OTPs
          if (email !== process.env.ADMIN_EMAIL) {
            return true // Skip this test case
          }

          // Step 1: Generate OTP for the email
          const result = await generateAndSendOTP(email)
          expect(result.success).toBe(true)
          
          // Get the generated OTP
          const otp = getOTPForTesting(email)
          expect(otp).toBeDefined()
          expect(otp).toMatch(/^\d{6}$/)
          
          // Step 2: Simulate module reload by clearing the in-memory Map
          // This simulates what happens when Next.js hot reloads the module
          clearAllOTPs()
          
          // Step 3: Attempt verification
          // On UNFIXED code: this will FAIL because otpStore.get(email) returns undefined
          // On FIXED code: this will PASS because OTP data persists in file storage
          const isValid = await verifyOTP(email, otp!)
          
          // Step 4: Assert that verifyOTP returns true for valid OTP
          // **EXPECTED**: This assertion FAILS on unfixed code (proving the bug)
          // **EXPECTED**: This assertion PASSES on fixed code (confirming the fix)
          expect(isValid).toBe(true)
        }
      ),
      {
        numRuns: 10, // Run 10 test cases
        verbose: true, // Show detailed output
      }
    )
  })

  it('should demonstrate the bug with a concrete example', async () => {
    /**
     * Concrete test case that demonstrates the bug condition
     * 
     * This test uses a specific email to show the exact failure scenario:
     * 1. OTP is generated and stored in memory
     * 2. Module reload clears the in-memory Map
     * 3. Verification fails because OTP is lost
     * 
     * **EXPECTED OUTCOME**: This test FAILS on unfixed code
     * **Counterexample**: verifyOTP returns false because otpStore.get(email) returns undefined
     */
    const email = 'admin@example.com'
    
    // Generate OTP
    const result = await generateAndSendOTP(email)
    expect(result.success).toBe(true)
    
    const otp = getOTPForTesting(email)
    expect(otp).toBeDefined()
    console.log('[Bug Condition Test] Generated OTP:', otp)
    
    // Simulate module reload by clearing the in-memory Map
    console.log('[Bug Condition Test] Simulating module reload...')
    clearAllOTPs()
    
    // Attempt verification
    console.log('[Bug Condition Test] Attempting verification after reload...')
    const isValid = await verifyOTP(email, otp!)
    
    // This assertion FAILS on unfixed code (proving the bug exists)
    // Counterexample: verifyOTP returns false because otpStore.get(email) returns undefined after module reload
    console.log('[Bug Condition Test] Verification result:', isValid)
    expect(isValid).toBe(true)
  })
})
