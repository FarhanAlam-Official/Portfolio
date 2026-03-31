import { describe, it, expect, beforeEach, vi } from 'vitest'
import fc from 'fast-check'
import jwt from 'jsonwebtoken'

// Set test environment BEFORE importing the service
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-secret-key-at-least-32-characters-long-for-testing'
process.env.ADMIN_EMAIL = 'admin@example.com'

// Mock Next.js cookies
const mockCookieStore = {
  set: vi.fn(),
  get: vi.fn(),
}

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}))

// Import after mocking
import { verifySession } from '@/lib/services/session-manager'

beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks()
})

/**
 * Feature: database-free-cms-admin-panel
 * Property 8: JWT Signature Verification
 * 
 * For any JWT token, if the signature does not match when verified with 
 * the JWT_SECRET, the token SHALL be rejected.
 * 
 * **Validates: Requirements 2.5**
 */
describe('Property 8: JWT Signature Verification', () => {
  it('should reject tokens signed with incorrect secrets', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        fc.string({ minLength: 32, maxLength: 64 }).filter(
          secret => secret !== process.env.JWT_SECRET
        ),
        async (email, wrongSecret) => {
          // Create a token with wrong secret
          const invalidToken = jwt.sign(
            { email },
            wrongSecret,
            { expiresIn: '7d' }
          )
          
          // Try to verify the token
          const verified = await verifySession(invalidToken)
          
          // Verification MUST fail
          expect(verified).toBeNull()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should reject tokens with tampered payloads', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        fc.emailAddress(),
        async (originalEmail, tamperedEmail) => {
          // Skip if emails are the same
          if (originalEmail === tamperedEmail) {
            return
          }
          
          // Create a valid token
          const validToken = jwt.sign(
            { email: originalEmail },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
          )
          
          // Tamper with the payload by manually modifying the token
          // JWT format: header.payload.signature
          const parts = validToken.split('.')
          expect(parts.length).toBe(3)
          
          // Decode the payload
          const payload = JSON.parse(
            Buffer.from(parts[1], 'base64url').toString()
          )
          
          // Tamper with the email
          payload.email = tamperedEmail
          
          // Re-encode the payload
          const tamperedPayload = Buffer.from(
            JSON.stringify(payload)
          ).toString('base64url')
          
          // Create tampered token with original signature
          const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`
          
          // Try to verify the tampered token
          const verified = await verifySession(tamperedToken)
          
          // Verification MUST fail due to signature mismatch
          expect(verified).toBeNull()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should reject tokens with tampered headers', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        async (email) => {
          // Create a valid token
          const validToken = jwt.sign(
            { email },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
          )
          
          // Tamper with the header
          const parts = validToken.split('.')
          expect(parts.length).toBe(3)
          
          // Decode the header
          const header = JSON.parse(
            Buffer.from(parts[0], 'base64url').toString()
          )
          
          // Tamper with the algorithm
          header.alg = 'none'
          
          // Re-encode the header
          const tamperedHeader = Buffer.from(
            JSON.stringify(header)
          ).toString('base64url')
          
          // Create tampered token with original signature
          const tamperedToken = `${tamperedHeader}.${parts[1]}.${parts[2]}`
          
          // Try to verify the tampered token
          const verified = await verifySession(tamperedToken)
          
          // Verification MUST fail due to signature mismatch
          expect(verified).toBeNull()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should reject tokens with missing signatures', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        async (email) => {
          // Create a valid token
          const validToken = jwt.sign(
            { email },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
          )
          
          // Remove the signature
          const parts = validToken.split('.')
          expect(parts.length).toBe(3)
          
          // Create token without signature
          const unsignedToken = `${parts[0]}.${parts[1]}.`
          
          // Try to verify the unsigned token
          const verified = await verifySession(unsignedToken)
          
          // Verification MUST fail
          expect(verified).toBeNull()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should reject tokens with corrupted signatures', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        fc.string({ minLength: 10, maxLength: 50 }),
        async (email, corruptedSignature) => {
          // Create a valid token
          const validToken = jwt.sign(
            { email },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
          )
          
          // Replace signature with corrupted one
          const parts = validToken.split('.')
          expect(parts.length).toBe(3)
          
          // Skip if corrupted signature happens to match
          if (corruptedSignature === parts[2]) {
            return
          }
          
          // Create token with corrupted signature
          const corruptedToken = `${parts[0]}.${parts[1]}.${corruptedSignature}`
          
          // Try to verify the corrupted token
          const verified = await verifySession(corruptedToken)
          
          // Verification MUST fail
          expect(verified).toBeNull()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should accept only tokens signed with correct secret', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        async (email) => {
          // Create a token with correct secret
          const validToken = jwt.sign(
            { email },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
          )
          
          // Verify the token
          const verified = await verifySession(validToken)
          
          // Verification MUST succeed
          expect(verified).not.toBeNull()
          expect(verified?.email).toBe(email)
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should reject tokens when JWT_SECRET changes', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        fc.string({ minLength: 32, maxLength: 64 }),
        async (email, newSecret) => {
          // Skip if new secret is the same
          if (newSecret === process.env.JWT_SECRET) {
            return
          }
          
          // Create a token with current secret
          const token = jwt.sign(
            { email },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
          )
          
          // Save original secret
          const originalSecret = process.env.JWT_SECRET
          
          // Change the secret
          process.env.JWT_SECRET = newSecret
          
          // Try to verify the token with new secret
          const verified = await verifySession(token)
          
          // Verification MUST fail
          expect(verified).toBeNull()
          
          // Restore original secret
          process.env.JWT_SECRET = originalSecret
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should reject malformed tokens', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }).filter(
          str => !str.includes('.') || str.split('.').length !== 3
        ),
        async (malformedToken) => {
          // Try to verify the malformed token
          const verified = await verifySession(malformedToken)
          
          // Verification MUST fail
          expect(verified).toBeNull()
        }
      ),
      { numRuns: 100 }
    )
  })
})
