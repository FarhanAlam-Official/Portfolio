import { describe, it, expect, beforeEach, vi } from 'vitest'
import fc from 'fast-check'

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
import { createSession } from '@/lib/services/session-manager'

beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks()
})

/**
 * Feature: database-free-cms-admin-panel
 * Property 31: Session Cookie Security Flags
 * 
 * For any session cookie created by the Session Manager, the cookie SHALL 
 * have HttpOnly, Secure (in production), and SameSite=Strict flags set.
 * 
 * **Validates: Requirements 11.4**
 */
describe('Property 31: Session Cookie Security Flags', () => {
  it('should set HttpOnly flag to true for all session cookies', async () => {
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
          
          const [cookieName, , cookieOptions] = setCalls[0]
          
          // Verify cookie name
          expect(cookieName).toBe('admin_session')
          
          // Verify HttpOnly flag is EXACTLY true (not truthy, but boolean true)
          expect(cookieOptions.httpOnly).toBe(true)
          expect(typeof cookieOptions.httpOnly).toBe('boolean')
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should set SameSite flag to strict for all session cookies', async () => {
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
          
          const [, , cookieOptions] = setCalls[0]
          
          // Verify SameSite flag is EXACTLY 'strict' (case-sensitive)
          expect(cookieOptions.sameSite).toBe('strict')
          expect(typeof cookieOptions.sameSite).toBe('string')
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should set Secure flag based on NODE_ENV (false in test, true in production)', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        async (email) => {
          // Clear previous calls
          vi.clearAllMocks()
          
          // Create session in test environment
          await createSession(email)
          
          // Get the cookie call arguments
          const setCalls = mockCookieStore.set.mock.calls
          expect(setCalls.length).toBeGreaterThan(0)
          
          const [, , cookieOptions] = setCalls[0]
          
          // In test environment, Secure should be false
          const isProduction = process.env.NODE_ENV === 'production'
          expect(cookieOptions.secure).toBe(isProduction)
          expect(typeof cookieOptions.secure).toBe('boolean')
          
          // Since we're in test environment, it should be false
          expect(cookieOptions.secure).toBe(false)
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
          
          // In production environment, Secure MUST be true
          expect(cookieOptions.secure).toBe(true)
          expect(typeof cookieOptions.secure).toBe('boolean')
          
          // Restore original environment
          process.env.NODE_ENV = originalEnv
        }
      ),
      { numRuns: 100 }
    )
    
    // Restore original environment
    process.env.NODE_ENV = originalEnv
  })
  
  it('should set all three security flags together for every session cookie', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        async (email) => {
          // Clear previous calls
          vi.clearAllMocks()
          
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
          
          // Verify cookie value exists
          expect(cookieValue).toBeDefined()
          expect(typeof cookieValue).toBe('string')
          expect(cookieValue.length).toBeGreaterThan(0)
          
          // Verify all three security flags are present
          expect(cookieOptions).toBeDefined()
          expect(cookieOptions).toHaveProperty('httpOnly')
          expect(cookieOptions).toHaveProperty('secure')
          expect(cookieOptions).toHaveProperty('sameSite')
          
          // Verify HttpOnly is true
          expect(cookieOptions.httpOnly).toBe(true)
          
          // Verify SameSite is 'strict'
          expect(cookieOptions.sameSite).toBe('strict')
          
          // Verify Secure matches environment
          const isProduction = process.env.NODE_ENV === 'production'
          expect(cookieOptions.secure).toBe(isProduction)
          
          // Verify all flags are the correct type
          expect(typeof cookieOptions.httpOnly).toBe('boolean')
          expect(typeof cookieOptions.secure).toBe('boolean')
          expect(typeof cookieOptions.sameSite).toBe('string')
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should never set HttpOnly to false', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        async (email) => {
          // Clear previous calls
          vi.clearAllMocks()
          
          // Create session
          await createSession(email)
          
          // Get the cookie call arguments
          const setCalls = mockCookieStore.set.mock.calls
          expect(setCalls.length).toBeGreaterThan(0)
          
          const [, , cookieOptions] = setCalls[0]
          
          // HttpOnly MUST NEVER be false
          expect(cookieOptions.httpOnly).not.toBe(false)
          expect(cookieOptions.httpOnly).toBe(true)
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should never set SameSite to lax or none', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        async (email) => {
          // Clear previous calls
          vi.clearAllMocks()
          
          // Create session
          await createSession(email)
          
          // Get the cookie call arguments
          const setCalls = mockCookieStore.set.mock.calls
          expect(setCalls.length).toBeGreaterThan(0)
          
          const [, , cookieOptions] = setCalls[0]
          
          // SameSite MUST NEVER be 'lax' or 'none'
          expect(cookieOptions.sameSite).not.toBe('lax')
          expect(cookieOptions.sameSite).not.toBe('none')
          expect(cookieOptions.sameSite).toBe('strict')
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should set security flags consistently across multiple session creations', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.emailAddress(), { minLength: 2, maxLength: 10 }),
        async (emails) => {
          // Clear previous calls
          vi.clearAllMocks()
          
          // Create multiple sessions
          for (const email of emails) {
            await createSession(email)
          }
          
          // Get all cookie calls
          const setCalls = mockCookieStore.set.mock.calls
          expect(setCalls.length).toBe(emails.length)
          
          // Verify all cookies have the same security flags
          const isProduction = process.env.NODE_ENV === 'production'
          
          for (let i = 0; i < setCalls.length; i++) {
            const [, , cookieOptions] = setCalls[i]
            
            // All cookies should have identical security flags
            expect(cookieOptions.httpOnly).toBe(true)
            expect(cookieOptions.sameSite).toBe('strict')
            expect(cookieOptions.secure).toBe(isProduction)
          }
        }
      ),
      { numRuns: 50 }
    )
  })
})
