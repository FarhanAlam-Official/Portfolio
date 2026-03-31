import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import * as fc from 'fast-check'

/**
 * Property-Based Test: OTP Service Preservation Properties
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**
 * 
 * This test suite uses property-based testing to verify that existing OTP service
 * behavior is preserved after implementing the fix. These tests capture the baseline
 * behavior on UNFIXED code and should continue to pass after the fix.
 * 
 * **IMPORTANT**: Follow observation-first methodology
 * - These tests observe behavior on UNFIXED code for non-storage operations
 * - Tests should PASS on unfixed code (confirms baseline behavior)
 * - Tests should PASS on fixed code (confirms no regressions)
 * 
 * **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
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
  getOTPForTesting,
  setOTPExpirationForTesting
} from '@/lib/services/otp-service'

beforeEach(() => {
  clearAllOTPs()
  vi.clearAllMocks()
})

afterEach(() => {
  clearAllOTPs()
})

/**
 * Property 2.1: OTP Generation Format Preservation
 * 
 * For all emails, generateOTP produces 6-digit numeric string
 * 
 * **Validates: Requirements 3.1**
 */
describe('Property 2.1: OTP Generation Format Preservation', () => {
  it('should generate 6-digit numeric codes for all valid requests', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(process.env.ADMIN_EMAIL!),
        async (email) => {
          // Generate OTP
          const result = await generateAndSendOTP(email)
          expect(result.success).toBe(true)
          
          // Get the generated OTP
          const otp = getOTPForTesting(email)
          
          // Verify OTP format: exactly 6 digits
          expect(otp).toBeDefined()
          expect(otp).toMatch(/^\d{6}$/)
          expect(otp!.length).toBe(6)
          
          // Verify all characters are numeric (0-9)
          const numericValue = parseInt(otp!, 10)
          expect(numericValue).toBeGreaterThanOrEqual(100000)
          expect(numericValue).toBeLessThanOrEqual(999999)
          
          // Clean up
          clearAllOTPs()
        }
      ),
      { numRuns: 50 }
    )
  })
})

/**
 * Property 2.2: OTP Validation Logic Preservation (without reload)
 * 
 * For all valid OTPs within expiration, verification succeeds (without reload)
 * 
 * **Validates: Requirements 3.2**
 */
describe('Property 2.2: OTP Validation Logic Preservation', () => {
  it('should successfully verify valid OTPs within expiration (no reload)', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(process.env.ADMIN_EMAIL!),
        async (email) => {
          // Generate OTP
          const result = await generateAndSendOTP(email)
          expect(result.success).toBe(true)
          
          // Get the generated OTP
          const otp = getOTPForTesting(email)
          expect(otp).toBeDefined()
          
          // Verify OTP immediately (no reload, within expiration)
          const isValid = await verifyOTP(email, otp!)
          
          // Should succeed
          expect(isValid).toBe(true)
          
          // Clean up
          clearAllOTPs()
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should handle OTP trimming correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(process.env.ADMIN_EMAIL!),
        fc.constantFrom('', ' ', '  ', '\t', '\n'),
        fc.constantFrom('', ' ', '  ', '\t', '\n'),
        async (email, prefix, suffix) => {
          // Generate OTP
          const result = await generateAndSendOTP(email)
          expect(result.success).toBe(true)
          
          // Get the generated OTP
          const otp = getOTPForTesting(email)
          expect(otp).toBeDefined()
          
          // Add whitespace prefix and suffix
          const otpWithWhitespace = prefix + otp! + suffix
          
          // Verify OTP with whitespace (should be trimmed)
          const isValid = await verifyOTP(email, otpWithWhitespace)
          
          // Should succeed (whitespace is trimmed)
          expect(isValid).toBe(true)
          
          // Clean up
          clearAllOTPs()
        }
      ),
      { numRuns: 30 }
    )
  })

  it('should mark OTP as used after successful verification', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(process.env.ADMIN_EMAIL!),
        async (email) => {
          // Generate OTP
          const result = await generateAndSendOTP(email)
          expect(result.success).toBe(true)
          
          // Get the generated OTP
          const otp = getOTPForTesting(email)
          expect(otp).toBeDefined()
          
          // First verification should succeed
          const firstVerify = await verifyOTP(email, otp!)
          expect(firstVerify).toBe(true)
          
          // Second verification should fail (used flag)
          const secondVerify = await verifyOTP(email, otp!)
          expect(secondVerify).toBe(false)
          
          // Clean up
          clearAllOTPs()
        }
      ),
      { numRuns: 30 }
    )
  })
})

/**
 * Property 2.3: OTP Expiration Preservation
 * 
 * For all expired OTPs, verification fails with appropriate error
 * 
 * **Validates: Requirements 3.3**
 */
describe('Property 2.3: OTP Expiration Preservation', () => {
  it('should reject expired OTPs for all cases', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(process.env.ADMIN_EMAIL!),
        async (email) => {
          // Generate OTP
          const result = await generateAndSendOTP(email)
          expect(result.success).toBe(true)
          
          // Get the generated OTP
          const otp = getOTPForTesting(email)
          expect(otp).toBeDefined()
          
          // Set expiration to the past (expired)
          const expiredTime = new Date(Date.now() - 1000) // 1 second ago
          setOTPExpirationForTesting(email, expiredTime)
          
          // Verify expired OTP
          const isValid = await verifyOTP(email, otp!)
          
          // Should fail (expired)
          expect(isValid).toBe(false)
          
          // Clean up
          clearAllOTPs()
        }
      ),
      { numRuns: 30 }
    )
  })

  it('should set expiration to 10 minutes from generation', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(process.env.ADMIN_EMAIL!),
        async (email) => {
          // Generate OTP
          const result = await generateAndSendOTP(email)
          expect(result.success).toBe(true)
          
          // Verify expiration is 10 minutes from now
          const now = new Date()
          const expiresAt = result.expiresAt
          const diffMs = expiresAt.getTime() - now.getTime()
          const diffMinutes = diffMs / (1000 * 60)
          
          // Allow small tolerance for execution time (9.9 to 10.1 minutes)
          expect(diffMinutes).toBeGreaterThan(9.9)
          expect(diffMinutes).toBeLessThanOrEqual(10.1)
          
          // Clean up
          clearAllOTPs()
        }
      ),
      { numRuns: 30 }
    )
  })
})

/**
 * Property 2.4: Rate Limiting Preservation
 * 
 * For all emails exceeding rate limit, request fails with RATE_LIMIT_EXCEEDED
 * 
 * **Validates: Requirements 3.4**
 */
describe('Property 2.4: Rate Limiting Preservation', () => {
  it('should enforce rate limit of 3 requests per hour', async () => {
    const email = process.env.ADMIN_EMAIL!
    
    // Make 3 requests (should all succeed)
    for (let i = 0; i < 3; i++) {
      const result = await generateAndSendOTP(email)
      expect(result.success).toBe(true)
    }
    
    // 4th request should fail with rate limit error
    await expect(generateAndSendOTP(email)).rejects.toThrow('RATE_LIMIT_EXCEEDED')
    
    // Clean up
    clearAllOTPs()
  })
})

/**
 * Property 2.5: Invalid OTP Rejection Preservation
 * 
 * For all invalid OTP formats, validation fails appropriately
 * 
 * **Validates: Requirements 3.5**
 */
describe('Property 2.5: Invalid OTP Rejection Preservation', () => {
  it('should reject invalid OTP formats', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(process.env.ADMIN_EMAIL!),
        fc.oneof(
          fc.string().filter(s => !/^\d{6}$/.test(s)), // Non-6-digit strings
          fc.integer().map(n => n.toString()), // Numbers that aren't 6 digits
          fc.constant(''), // Empty string
          fc.constant('abc123'), // Mixed alphanumeric
          fc.constant('12345'), // Too short
          fc.constant('1234567'), // Too long
        ),
        async (email, invalidOTP) => {
          // Generate a valid OTP first
          const result = await generateAndSendOTP(email)
          expect(result.success).toBe(true)
          
          // Try to verify with invalid OTP
          const isValid = await verifyOTP(email, invalidOTP)
          
          // Should fail
          expect(isValid).toBe(false)
          
          // Clean up
          clearAllOTPs()
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should reject OTP for non-existent email', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress().filter(e => e !== process.env.ADMIN_EMAIL),
        fc.integer({ min: 100000, max: 999999 }).map(n => n.toString()),
        async (email, otp) => {
          // Try to verify OTP for email that never requested one
          const isValid = await verifyOTP(email, otp)
          
          // Should fail (no OTP stored for this email)
          expect(isValid).toBe(false)
        }
      ),
      { numRuns: 30 }
    )
  })
})

/**
 * Property 2.6: Email Sending Functionality Preservation
 * 
 * Email sending functionality works correctly
 * 
 * **Validates: Requirements 3.6**
 */
describe('Property 2.6: Email Sending Functionality Preservation', () => {
  it('should successfully send emails for all valid requests', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(process.env.ADMIN_EMAIL!),
        async (email) => {
          // Generate and send OTP
          const result = await generateAndSendOTP(email)
          
          // Should succeed
          expect(result.success).toBe(true)
          expect(result.expiresAt).toBeInstanceOf(Date)
          
          // Verify OTP was generated
          const otp = getOTPForTesting(email)
          expect(otp).toBeDefined()
          expect(otp).toMatch(/^\d{6}$/)
          
          // Clean up
          clearAllOTPs()
        }
      ),
      { numRuns: 30 }
    )
  })
})
