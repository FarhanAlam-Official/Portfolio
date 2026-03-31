import { describe, it, expect, beforeEach, vi } from 'vitest'
import fc from 'fast-check'

// Set test environment BEFORE importing the service
process.env.NODE_ENV = 'test'
process.env.ADMIN_EMAIL = 'admin@example.com'
process.env.GMAIL_USER = 'test@gmail.com'
process.env.GMAIL_APP_PASSWORD = 'test-password'

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

// Import after mocking
import {
  generateAndSendOTP,
  verifyOTP,
  invalidateOTP,
  getOTPForTesting,
  setOTPExpirationForTesting,
  clearAllOTPs,
} from '@/lib/services/otp-service'

beforeEach(() => {
  // Clear all OTPs before each test
  clearAllOTPs()
})

/**
 * Feature: database-free-cms-admin-panel
 * Property 1: OTP Generation Format
 * 
 * For any valid OTP generation request, the generated OTP SHALL be exactly 
 * 6 numeric digits with a 10-minute expiration time.
 * 
 * **Validates: Requirements 1.2**
 */
describe('Property 1: OTP Generation Format', () => {
  it('should generate exactly 6 numeric digits with 10-minute expiration', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(process.env.ADMIN_EMAIL!),
        async (email) => {
          // Generate OTP
          const result = await generateAndSendOTP(email)
          
          // Verify success
          expect(result.success).toBe(true)
          
          // Get the generated OTP
          const otp = getOTPForTesting(email)
          
          // Verify OTP is exactly 6 digits
          expect(otp).toBeDefined()
          expect(otp).toMatch(/^\d{6}$/)
          expect(otp!.length).toBe(6)
          
          // Verify all characters are numeric
          for (const char of otp!) {
            expect(parseInt(char, 10)).toBeGreaterThanOrEqual(0)
            expect(parseInt(char, 10)).toBeLessThanOrEqual(9)
          }
          
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
      { numRuns: 100 }
    )
  })
})

/**
 * Feature: database-free-cms-admin-panel
 * Property 2: OTP Email Authorization
 * 
 * For any email address submitted for OTP generation, the system SHALL only 
 * generate OTPs when the email exactly matches the ADMIN_EMAIL environment variable.
 * 
 * **Validates: Requirements 1.4**
 */
describe('Property 2: OTP Email Authorization', () => {
  it('should only generate OTPs for the exact ADMIN_EMAIL', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        async (email) => {
          const adminEmail = process.env.ADMIN_EMAIL!
          
          try {
            const result = await generateAndSendOTP(email)
            
            if (email === adminEmail) {
              // Should succeed for admin email
              expect(result.success).toBe(true)
              const otp = getOTPForTesting(email)
              expect(otp).toBeDefined()
            } else {
              // Should fail for non-admin email
              // If we reach here, the test should fail
              expect(true).toBe(false) // Force failure
            }
          } catch (error) {
            if (email === adminEmail) {
              // Should not throw for admin email
              throw error
            } else {
              // Should throw for non-admin email
              expect(error).toBeDefined()
              expect((error as Error).message).toBe('Invalid credentials')
              
              // Verify no OTP was stored
              const otp = getOTPForTesting(email)
              expect(otp).toBeUndefined()
            }
          }
          
          // Clean up
          clearAllOTPs()
        }
      ),
      { numRuns: 100 }
    )
  })
})

/**
 * Feature: database-free-cms-admin-panel
 * Property 3: Authentication Error Opacity
 * 
 * For any invalid or unauthorized email submission, the error response SHALL 
 * not reveal whether the email is the authorized admin email.
 * 
 * **Validates: Requirements 1.5**
 */
describe('Property 3: Authentication Error Opacity', () => {
  it('should not reveal authorization status in error messages', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress().filter(email => email !== process.env.ADMIN_EMAIL),
        async (unauthorizedEmail) => {
          try {
            await generateAndSendOTP(unauthorizedEmail)
            // Should not reach here
            expect(true).toBe(false)
          } catch (error) {
            const errorMessage = (error as Error).message
            
            // Error message should be generic
            expect(errorMessage).toBe('Invalid credentials')
            
            // Error message should NOT contain:
            // - The word "admin"
            // - The word "authorized"
            // - The word "unauthorized"
            // - The actual admin email
            // - Any hint about what the correct email is
            expect(errorMessage.toLowerCase()).not.toContain('admin')
            expect(errorMessage.toLowerCase()).not.toContain('authorized')
            expect(errorMessage.toLowerCase()).not.toContain('unauthorized')
            expect(errorMessage).not.toContain(process.env.ADMIN_EMAIL!)
            expect(errorMessage.toLowerCase()).not.toContain('correct')
            expect(errorMessage.toLowerCase()).not.toContain('wrong')
            expect(errorMessage.toLowerCase()).not.toContain('match')
            
            // Error should be the same for all unauthorized emails
            // (testing consistency)
            expect(errorMessage).toBe('Invalid credentials')
          }
          
          // Clean up
          clearAllOTPs()
        }
      ),
      { numRuns: 100 }
    )
  })
})

/**
 * Feature: database-free-cms-admin-panel
 * Property 4: OTP Expiration Enforcement
 * 
 * For any OTP verification attempt, if the current time exceeds the OTP 
 * expiration time, the verification SHALL fail regardless of OTP correctness.
 * 
 * **Validates: Requirements 1.9**
 */
describe('Property 4: OTP Expiration Enforcement', () => {
  it('should reject expired OTPs regardless of correctness', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(process.env.ADMIN_EMAIL!),
        async (email) => {
          // Generate OTP
          const result = await generateAndSendOTP(email)
          expect(result.success).toBe(true)
          
          // Get the OTP
          const otp = getOTPForTesting(email)
          expect(otp).toBeDefined()
          
          // Set expiration to the past
          setOTPExpirationForTesting(email, new Date(Date.now() - 1000)) // 1 second ago
          
          // Try to verify the OTP (should fail even though OTP is correct)
          const isValid = await verifyOTP(email, otp!)
          
          // Verification should fail
          expect(isValid).toBe(false)
          
          // Clean up
          clearAllOTPs()
        }
      ),
      { numRuns: 100 }
    )
  })
})

/**
 * Feature: database-free-cms-admin-panel
 * Property 5: OTP Single-Use Enforcement
 * 
 * For any OTP that has been successfully verified once, subsequent 
 * verification attempts with the same OTP SHALL fail.
 * 
 * **Validates: Requirements 1.10**
 */
describe('Property 5: OTP Single-Use Enforcement', () => {
  it('should reject reuse of successfully verified OTPs', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(process.env.ADMIN_EMAIL!),
        async (email) => {
          // Generate OTP
          const result = await generateAndSendOTP(email)
          expect(result.success).toBe(true)
          
          // Get the OTP
          const otp = getOTPForTesting(email)
          expect(otp).toBeDefined()
          
          // First verification should succeed
          const firstVerify = await verifyOTP(email, otp!)
          expect(firstVerify).toBe(true)
          
          // Second verification with same OTP should fail
          const secondVerify = await verifyOTP(email, otp!)
          expect(secondVerify).toBe(false)
          
          // Third verification should also fail
          const thirdVerify = await verifyOTP(email, otp!)
          expect(thirdVerify).toBe(false)
          
          // Clean up
          clearAllOTPs()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should fail verification after invalidation', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(process.env.ADMIN_EMAIL!),
        async (email) => {
          // Generate OTP
          const result = await generateAndSendOTP(email)
          expect(result.success).toBe(true)
          
          // Get the OTP
          const otp = getOTPForTesting(email)
          expect(otp).toBeDefined()
          
          // Verify once (should succeed)
          const firstVerify = await verifyOTP(email, otp!)
          expect(firstVerify).toBe(true)
          
          // Invalidate the OTP
          await invalidateOTP(email)
          
          // Try to verify again (should fail)
          const secondVerify = await verifyOTP(email, otp!)
          expect(secondVerify).toBe(false)
          
          // Clean up
          clearAllOTPs()
        }
      ),
      { numRuns: 100 }
    )
  })
})
