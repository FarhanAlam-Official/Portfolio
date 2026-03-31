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
import { clearSession } from '@/lib/services/session-manager'

beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks()
})

/**
 * Feature: database-free-cms-admin-panel
 * Property 32: Logout Cookie Expiration
 * 
 * For any logout request, the session cookie SHALL be set with an 
 * expiration date in the past, effectively clearing it.
 * 
 * **Validates: Requirements 11.2**
 */
describe('Property 32: Logout Cookie Expiration', () => {
  it('should set maxAge to 0 when clearing session', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(null), // No input needed for logout
        async () => {
          // Clear session (logout)
          await clearSession()
          
          // Verify cookie was set
          expect(mockCookieStore.set).toHaveBeenCalled()
          
          // Get the cookie call arguments
          const setCalls = mockCookieStore.set.mock.calls
          expect(setCalls.length).toBeGreaterThan(0)
          
          const [cookieName, cookieValue, cookieOptions] = setCalls[0]
          
          // Verify cookie name
          expect(cookieName).toBe('admin_session')
          
          // Verify maxAge is 0 (immediate expiration)
          expect(cookieOptions.maxAge).toBe(0)
          expect(typeof cookieOptions.maxAge).toBe('number')
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should set expires to epoch (past date) when clearing session', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(null),
        async () => {
          // Clear session (logout)
          await clearSession()
          
          // Verify cookie was set
          expect(mockCookieStore.set).toHaveBeenCalled()
          
          // Get the cookie call arguments
          const setCalls = mockCookieStore.set.mock.calls
          expect(setCalls.length).toBeGreaterThan(0)
          
          const [, , cookieOptions] = setCalls[0]
          
          // Verify expires is set to a date in the past
          expect(cookieOptions.expires).toBeDefined()
          expect(cookieOptions.expires).toBeInstanceOf(Date)
          
          // Verify the date is in the past (epoch time: Jan 1, 1970)
          const expiresDate = cookieOptions.expires as Date
          const epochDate = new Date(0)
          
          expect(expiresDate.getTime()).toBe(epochDate.getTime())
          expect(expiresDate.getTime()).toBeLessThan(Date.now())
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should set cookie value to empty string when clearing session', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(null),
        async () => {
          // Clear session (logout)
          await clearSession()
          
          // Verify cookie was set
          expect(mockCookieStore.set).toHaveBeenCalled()
          
          // Get the cookie call arguments
          const setCalls = mockCookieStore.set.mock.calls
          expect(setCalls.length).toBeGreaterThan(0)
          
          const [, cookieValue] = setCalls[0]
          
          // Verify cookie value is empty string
          expect(cookieValue).toBe('')
          expect(typeof cookieValue).toBe('string')
          expect(cookieValue.length).toBe(0)
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should maintain security flags when clearing session', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(null),
        async () => {
          // Clear session (logout)
          await clearSession()
          
          // Verify cookie was set
          expect(mockCookieStore.set).toHaveBeenCalled()
          
          // Get the cookie call arguments
          const setCalls = mockCookieStore.set.mock.calls
          expect(setCalls.length).toBeGreaterThan(0)
          
          const [, , cookieOptions] = setCalls[0]
          
          // Verify security flags are still set correctly
          expect(cookieOptions.httpOnly).toBe(true)
          expect(cookieOptions.sameSite).toBe('strict')
          
          // Verify Secure matches environment
          const isProduction = process.env.NODE_ENV === 'production'
          expect(cookieOptions.secure).toBe(isProduction)
          
          // Verify path is set
          expect(cookieOptions.path).toBe('/')
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should set both maxAge=0 and expires=epoch together', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(null),
        async () => {
          // Clear session (logout)
          await clearSession()
          
          // Verify cookie was set
          expect(mockCookieStore.set).toHaveBeenCalled()
          
          // Get the cookie call arguments
          const setCalls = mockCookieStore.set.mock.calls
          expect(setCalls.length).toBeGreaterThan(0)
          
          const [, , cookieOptions] = setCalls[0]
          
          // Verify BOTH expiration mechanisms are used
          expect(cookieOptions.maxAge).toBe(0)
          expect(cookieOptions.expires).toBeDefined()
          expect(cookieOptions.expires).toBeInstanceOf(Date)
          
          const expiresDate = cookieOptions.expires as Date
          expect(expiresDate.getTime()).toBe(new Date(0).getTime())
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should clear session consistently across multiple logout calls', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 2, max: 10 }),
        async (numLogouts) => {
          // Clear previous calls
          vi.clearAllMocks()
          
          // Perform multiple logout operations
          for (let i = 0; i < numLogouts; i++) {
            await clearSession()
          }
          
          // Get all cookie calls
          const setCalls = mockCookieStore.set.mock.calls
          expect(setCalls.length).toBe(numLogouts)
          
          // Verify all logout calls set the same expiration values
          for (let i = 0; i < setCalls.length; i++) {
            const [cookieName, cookieValue, cookieOptions] = setCalls[i]
            
            // All logout calls should have identical behavior
            expect(cookieName).toBe('admin_session')
            expect(cookieValue).toBe('')
            expect(cookieOptions.maxAge).toBe(0)
            expect(cookieOptions.expires).toBeInstanceOf(Date)
            expect((cookieOptions.expires as Date).getTime()).toBe(new Date(0).getTime())
          }
        }
      ),
      { numRuns: 50 }
    )
  })
  
  it('should never set maxAge to a positive value when clearing session', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(null),
        async () => {
          // Clear session (logout)
          await clearSession()
          
          // Get the cookie call arguments
          const setCalls = mockCookieStore.set.mock.calls
          expect(setCalls.length).toBeGreaterThan(0)
          
          const [, , cookieOptions] = setCalls[0]
          
          // maxAge MUST be 0, never positive
          expect(cookieOptions.maxAge).toBe(0)
          expect(cookieOptions.maxAge).not.toBeGreaterThan(0)
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should never set expires to a future date when clearing session', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(null),
        async () => {
          // Clear session (logout)
          await clearSession()
          
          // Get the cookie call arguments
          const setCalls = mockCookieStore.set.mock.calls
          expect(setCalls.length).toBeGreaterThan(0)
          
          const [, , cookieOptions] = setCalls[0]
          
          // expires MUST be in the past, never in the future
          const expiresDate = cookieOptions.expires as Date
          const now = Date.now()
          
          expect(expiresDate.getTime()).toBeLessThan(now)
          expect(expiresDate.getTime()).not.toBeGreaterThan(now)
        }
      ),
      { numRuns: 100 }
    )
  })
})
