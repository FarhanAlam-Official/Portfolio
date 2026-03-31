import { describe, it, expect, beforeEach, vi } from 'vitest'
import fc from 'fast-check'

// Mock Next.js cookies
const mockCookieStore = {
  set: vi.fn(),
  get: vi.fn(),
}

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}))

beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks()
})

/**
 * Feature: database-free-cms-admin-panel
 * Property 25: JWT Secret Strength
 * 
 * For any JWT_SECRET value, if it is less than 32 characters long, 
 * the application SHALL reject it and fail to start.
 * 
 * **Validates: Requirements 9.8**
 */
describe('Property 25: JWT Secret Strength', () => {
  it('should reject JWT_SECRET with less than 32 characters', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 31 }),
        fc.emailAddress(),
        async (weakSecret, email) => {
          // Set weak JWT_SECRET
          process.env.JWT_SECRET = weakSecret
          
          // Clear module cache to force re-import with new env var
          vi.resetModules()
          
          // Import createSession with weak secret
          const { createSession } = await import('@/lib/services/session-manager')
          
          // Attempt to create session should throw error
          await expect(createSession(email)).rejects.toThrow(
            'JWT_SECRET must be at least 32 characters long'
          )
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should accept JWT_SECRET with exactly 32 characters', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 32, maxLength: 32 }),
        fc.emailAddress(),
        async (validSecret, email) => {
          // Set valid JWT_SECRET with exactly 32 characters
          process.env.JWT_SECRET = validSecret
          process.env.NODE_ENV = 'test'
          
          // Clear module cache to force re-import with new env var
          vi.resetModules()
          
          // Import createSession with valid secret
          const { createSession } = await import('@/lib/services/session-manager')
          
          // Attempt to create session should succeed
          const token = await createSession(email)
          
          // Verify token was created
          expect(token).toBeDefined()
          expect(typeof token).toBe('string')
          expect(token.length).toBeGreaterThan(0)
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should accept JWT_SECRET with more than 32 characters', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 33, maxLength: 128 }),
        fc.emailAddress(),
        async (strongSecret, email) => {
          // Set strong JWT_SECRET with more than 32 characters
          process.env.JWT_SECRET = strongSecret
          process.env.NODE_ENV = 'test'
          
          // Clear module cache to force re-import with new env var
          vi.resetModules()
          
          // Import createSession with strong secret
          const { createSession } = await import('@/lib/services/session-manager')
          
          // Attempt to create session should succeed
          const token = await createSession(email)
          
          // Verify token was created
          expect(token).toBeDefined()
          expect(typeof token).toBe('string')
          expect(token.length).toBeGreaterThan(0)
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should reject empty or missing JWT_SECRET', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.emailAddress(),
        async (email) => {
          // Set empty JWT_SECRET
          process.env.JWT_SECRET = ''
          
          // Clear module cache to force re-import with new env var
          vi.resetModules()
          
          // Import createSession with empty secret
          const { createSession } = await import('@/lib/services/session-manager')
          
          // Attempt to create session should throw error
          // Empty string is treated as "not set"
          await expect(createSession(email)).rejects.toThrow(
            /JWT_SECRET/
          )
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should reject JWT_SECRET with exactly 31 characters (boundary test)', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 31, maxLength: 31 }),
        fc.emailAddress(),
        async (boundarySecret, email) => {
          // Ensure exactly 31 characters
          expect(boundarySecret.length).toBe(31)
          
          // Set JWT_SECRET with exactly 31 characters
          process.env.JWT_SECRET = boundarySecret
          
          // Clear module cache to force re-import with new env var
          vi.resetModules()
          
          // Import createSession with boundary secret
          const { createSession } = await import('@/lib/services/session-manager')
          
          // Attempt to create session should throw error
          await expect(createSession(email)).rejects.toThrow(
            'JWT_SECRET must be at least 32 characters long'
          )
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should enforce minimum length regardless of secret content', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(
          fc.string({ minLength: 1, maxLength: 31 }),
          fc.constantFrom('a'.repeat(31), '1'.repeat(31), 'x'.repeat(15))
        ),
        fc.emailAddress(),
        async (weakSecret, email) => {
          // Ensure secret is less than 32 characters
          if (weakSecret.length >= 32) {
            return // Skip this test case
          }
          
          // Set weak JWT_SECRET
          process.env.JWT_SECRET = weakSecret
          
          // Clear module cache to force re-import with new env var
          vi.resetModules()
          
          // Import createSession with weak secret
          const { createSession } = await import('@/lib/services/session-manager')
          
          // Attempt to create session should throw error
          await expect(createSession(email)).rejects.toThrow(
            'JWT_SECRET must be at least 32 characters long'
          )
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('should validate secret length before any token operations', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 31 }),
        fc.emailAddress(),
        async (secretLength, email) => {
          // Generate secret with specific length
          const weakSecret = 'a'.repeat(secretLength)
          
          // Set weak JWT_SECRET
          process.env.JWT_SECRET = weakSecret
          
          // Clear module cache to force re-import with new env var
          vi.resetModules()
          
          // Import createSession with weak secret
          const { createSession } = await import('@/lib/services/session-manager')
          
          // Attempt to create session should throw error immediately
          // (before any JWT operations)
          const startTime = Date.now()
          
          await expect(createSession(email)).rejects.toThrow(
            'JWT_SECRET must be at least 32 characters long'
          )
          
          const endTime = Date.now()
          const duration = endTime - startTime
          
          // Validation should be fast (less than 100ms)
          // This ensures it fails early before expensive operations
          expect(duration).toBeLessThan(100)
        }
      ),
      { numRuns: 100 }
    )
  })
})
