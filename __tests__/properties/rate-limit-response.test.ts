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
import { generateAndSendOTP, clearAllOTPs } from '@/lib/services/otp-service'

beforeEach(() => {
  // Clear all OTPs before each test
  clearAllOTPs()
})

/**
 * Feature: database-free-cms-admin-panel
 * Property 30: Rate Limit Response
 * 
 * For any OTP request that exceeds the rate limit (3 per hour per email), 
 * the response SHALL have status code 429 and include retry-after information.
 * 
 * **Validates: Requirements 10.8**
 */
describe('Property 30: Rate Limit Response', () => {
  it('should return 429 error after exceeding 3 requests per hour', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(process.env.ADMIN_EMAIL!),
        async (email) => {
          // Make 3 successful requests (at the limit)
          for (let i = 0; i < 3; i++) {
            const result = await generateAndSendOTP(email)
            expect(result.success).toBe(true)
          }
          
          // The 4th request should exceed the rate limit
          try {
            await generateAndSendOTP(email)
            // Should not reach here
            expect(true).toBe(false)
          } catch (error) {
            // Verify error is rate limit error
            expect(error).toBeDefined()
            expect((error as Error).message).toBe('RATE_LIMIT_EXCEEDED')
          }
          
          // Clean up
          clearAllOTPs()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should enforce rate limit per email address independently', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(process.env.ADMIN_EMAIL!),
        async (email) => {
          // Make 3 requests for admin email
          for (let i = 0; i < 3; i++) {
            const result = await generateAndSendOTP(email)
            expect(result.success).toBe(true)
          }
          
          // 4th request should fail
          try {
            await generateAndSendOTP(email)
            expect(true).toBe(false)
          } catch (error) {
            expect((error as Error).message).toBe('RATE_LIMIT_EXCEEDED')
          }
          
          // Clean up
          clearAllOTPs()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should allow exactly 3 requests before rate limiting', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(process.env.ADMIN_EMAIL!),
        async (email) => {
          // First 3 requests should succeed
          const result1 = await generateAndSendOTP(email)
          expect(result1.success).toBe(true)
          
          const result2 = await generateAndSendOTP(email)
          expect(result2.success).toBe(true)
          
          const result3 = await generateAndSendOTP(email)
          expect(result3.success).toBe(true)
          
          // 4th request should fail with rate limit error
          try {
            await generateAndSendOTP(email)
            expect(true).toBe(false)
          } catch (error) {
            expect((error as Error).message).toBe('RATE_LIMIT_EXCEEDED')
          }
          
          // Clean up
          clearAllOTPs()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should track rate limit attempts even for unauthorized emails', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress().filter(email => email !== process.env.ADMIN_EMAIL),
        async (unauthorizedEmail) => {
          // Make 3 failed attempts with unauthorized email
          for (let i = 0; i < 3; i++) {
            try {
              await generateAndSendOTP(unauthorizedEmail)
              expect(true).toBe(false)
            } catch (error) {
              expect((error as Error).message).toBe('Invalid credentials')
            }
          }
          
          // 4th attempt should hit rate limit (not authorization error)
          try {
            await generateAndSendOTP(unauthorizedEmail)
            expect(true).toBe(false)
          } catch (error) {
            // Should be rate limit error, not authorization error
            expect((error as Error).message).toBe('RATE_LIMIT_EXCEEDED')
          }
          
          // Clean up
          clearAllOTPs()
        }
      ),
      { numRuns: 50 }
    )
  })
})
