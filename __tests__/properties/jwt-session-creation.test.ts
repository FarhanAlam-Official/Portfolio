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
import { createSession, verifySession } from '@/lib/services/session-manager'

beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks()
})

/**
 * Feature: database-free-cms-admin-panel
 * Property 6: JWT Session Creation
 * 
 * For any successful OTP verification, the system SHALL create a JWT token 
 * with exactly 7-day expiration and store it in an HTTP-only, secure, 
 * SameSite=Strict cookie.
 * 
 * **Validates: Requirements 1.7, 1.8**
 */
describe('Property 6: JWT Session Creation', () => {
  it('should create JWT tokens with exactly 7-day expiration', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        async (email) => {
          // Create session
          const token = await createSession(email)
          
          // Verify token was created
          expect(token).toBeDefined()
          expect(typeof token).toBe('string')
          expect(token.length).toBeGreaterThan(0)
          
          // Decode token to check expiration
          const decoded = jwt.decode(token) as any
          expect(decoded).toBeDefined()
          expect(decoded.email).toBe(email)
          expect(decoded.iat).toBeDefined()
          expect(decoded.exp).toBeDefined()
          
          // Calculate expiration duration
          const expirationDuration = decoded.exp - decoded.iat
          const expectedDuration = 7 * 24 * 60 * 60 // 7 days in seconds
          
          // Verify expiration is exactly 7 days
          expect(expirationDuration).toBe(expectedDuration)
          
          // Verify token can be verified
          const verified = await verifySession(token)
          expect(verified).toBeDefined()
          expect(verified?.email).toBe(email)
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should set cookies with HTTP-only, Secure, and SameSite=Strict flags', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        async (email) => {
          // Create session
          await createSession(email)
          
          // Verify cookie was set
          expect(mockCookieStore.set).toHaveBeenCalled()
          
          // Get the cookie call arguments
          const setCalls = mockCookieStore.set.mock.calls
          expect(setCalls.length).toBeGreaterThan(0)
          
          const [cookieName, cookieValue, cookieOptions] = setCalls[0]
          
          // Verify cookie name
          expect(cookieName).toBe('admin_session')
          
          // Verify cookie value is a JWT token
          expect(typeof cookieValue).toBe('string')
          expect(cookieValue.length).toBeGreaterThan(0)
          
          // Verify cookie options
          expect(cookieOptions).toBeDefined()
          
          // Verify HTTP-only flag (MUST be true)
          expect(cookieOptions.httpOnly).toBe(true)
          
          // Verify SameSite flag (MUST be 'strict')
          expect(cookieOptions.sameSite).toBe('strict')
          
          // Verify Secure flag (depends on NODE_ENV)
          // In test environment, should be false
          // In production, should be true
          const isProduction = process.env.NODE_ENV === 'production'
          expect(cookieOptions.secure).toBe(isProduction)
          
          // Verify maxAge is 7 days in seconds
          const expectedMaxAge = 7 * 24 * 60 * 60
          expect(cookieOptions.maxAge).toBe(expectedMaxAge)
          
          // Verify path is root
          expect(cookieOptions.path).toBe('/')
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should set Secure flag to true in production environment', async () => {
    // Save original NODE_ENV
    const originalEnv = process.env.NODE_ENV
    
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        async (email) => {
          // Clear previous calls
          vi.clearAllMocks()
          
          // Set production environment
          process.env.NODE_ENV = 'production'
          
          // Create session
          await createSession(email)
          
          // Get the cookie call arguments
          const setCalls = mockCookieStore.set.mock.calls
          expect(setCalls.length).toBeGreaterThan(0)
          
          const [, , cookieOptions] = setCalls[0]
          
          // Verify Secure flag is true in production
          expect(cookieOptions.secure).toBe(true)
          
          // Restore original environment
          process.env.NODE_ENV = originalEnv
        }
      ),
      { numRuns: 100 }
    )
    
    // Restore original environment
    process.env.NODE_ENV = originalEnv
  })
  
  it('should create valid JWT tokens that can be verified', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        async (email) => {
          // Create session
          const token = await createSession(email)
          
          // Verify the token using the session manager
          const verified = await verifySession(token)
          
          // Verification should succeed
          expect(verified).toBeDefined()
          expect(verified).not.toBeNull()
          
          // Verify payload contains correct email
          expect(verified?.email).toBe(email)
          
          // Verify payload contains iat and exp
          expect(verified?.iat).toBeDefined()
          expect(verified?.exp).toBeDefined()
          
          // Verify token is not expired
          const now = Math.floor(Date.now() / 1000)
          expect(verified!.exp).toBeGreaterThan(now)
          
          // Verify token was issued recently (within last minute)
          expect(verified!.iat).toBeLessThanOrEqual(now)
          expect(verified!.iat).toBeGreaterThan(now - 60)
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should reject tokens with invalid signatures', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        async (email) => {
          // Create a token with wrong secret
          const invalidToken = jwt.sign(
            { email },
            'wrong-secret-key-that-does-not-match',
            { expiresIn: '7d' }
          )
          
          // Try to verify the token
          const verified = await verifySession(invalidToken)
          
          // Verification should fail
          expect(verified).toBeNull()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should reject expired tokens', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        async (email) => {
          // Create a token that expired 1 hour ago
          const expiredToken = jwt.sign(
            { email },
            process.env.JWT_SECRET!,
            { expiresIn: '-1h' }
          )
          
          // Try to verify the token
          const verified = await verifySession(expiredToken)
          
          // Verification should fail
          expect(verified).toBeNull()
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should preserve email in JWT payload through full cycle', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        async (email) => {
          // Create session
          const token = await createSession(email)
          
          // Decode token
          const decoded = jwt.decode(token) as any
          
          // Verify email is preserved in token
          expect(decoded.email).toBe(email)
          
          // Verify through session manager
          const verified = await verifySession(token)
          expect(verified?.email).toBe(email)
          
          // Verify email is exactly the same (no transformation)
          expect(verified?.email).toStrictEqual(email)
        }
      ),
      { numRuns: 100 }
    )
  })
})
