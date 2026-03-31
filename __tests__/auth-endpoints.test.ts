import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

/**
 * Unit Tests for Authentication Endpoints
 * 
 * This test suite validates the authentication API routes for the database-free CMS admin panel.
 * 
 * **Task 5.6: Write unit tests for authentication endpoints**
 * - Test OTP request with valid/invalid emails
 * - Test OTP verification with valid/expired/used OTPs
 * - Test logout functionality
 * 
 * **Validates: Requirements 1.1-1.10, 11.1-11.3**
 * 
 * Test Coverage:
 * 1. POST /api/auth/request-otp
 *    - Valid email scenarios (1.1, 1.2, 1.3)
 *    - Invalid email scenarios (1.4, 1.5)
 *    - Rate limiting (1.4)
 * 
 * 2. POST /api/auth/verify-otp
 *    - Valid OTP scenarios (1.6, 1.7, 1.8)
 *    - Invalid OTP scenarios (1.6)
 *    - Expired OTP scenarios (1.9)
 *    - Used OTP scenarios (1.10)
 * 
 * 3. POST /api/auth/logout
 *    - Successful logout (11.1, 11.2, 11.3)
 *    - Cookie clearing (11.2, 11.4)
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

// Mock next/headers for cookie management
const mockCookieStore = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
}

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}))

// Import services and routes after mocking
import { clearAllOTPs, getOTPForTesting, setOTPExpirationForTesting } from '@/lib/services/otp-service'
import { POST as requestOTPHandler } from '@/app/api/auth/request-otp/route'
import { POST as verifyOTPHandler } from '@/app/api/auth/verify-otp/route'
import { POST as logoutHandler } from '@/app/api/auth/logout/route'

/**
 * Helper function to create a mock NextRequest
 */
function createMockRequest(body: any): NextRequest {
  return {
    json: async () => body,
  } as NextRequest
}

beforeEach(() => {
  // Clear all OTPs and mocks before each test
  clearAllOTPs()
  vi.clearAllMocks()
})

afterEach(() => {
  clearAllOTPs()
})

/**
 * Test Suite: Request OTP Endpoint
 * Validates: Requirements 1.1-1.5
 */
describe('POST /api/auth/request-otp', () => {
  describe('Valid Email Scenarios', () => {
    it('should return 200 and success message for valid admin email', async () => {
      const request = createMockRequest({ email: 'admin@example.com' })
      
      const response = await requestOTPHandler(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('OTP sent to email')
      expect(data.expiresIn).toBe(600) // 10 minutes
    })

    it('should generate a 6-digit OTP for valid admin email', async () => {
      const request = createMockRequest({ email: 'admin@example.com' })
      
      await requestOTPHandler(request)
      
      const otp = getOTPForTesting('admin@example.com')
      expect(otp).toBeDefined()
      expect(otp).toMatch(/^\d{6}$/)
      expect(otp!.length).toBe(6)
    })

    it('should set OTP expiration to 10 minutes', async () => {
      const request = createMockRequest({ email: 'admin@example.com' })
      
      const beforeTime = Date.now()
      const response = await requestOTPHandler(request)
      const data = await response.json()
      
      expect(data.expiresIn).toBe(600)
      
      // The response doesn't include expiresAt in the actual implementation
      // Just verify the expiresIn field is correct
      expect(data.expiresIn).toBe(600) // 10 minutes in seconds
    })
  })

  describe('Invalid Email Scenarios', () => {
    it('should return 400 for invalid email format', async () => {
      const request = createMockRequest({ email: 'not-an-email' })
      
      const response = await requestOTPHandler(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid email format')
    })

    it('should return 400 for missing email', async () => {
      const request = createMockRequest({})
      
      const response = await requestOTPHandler(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid email format')
    })

    it('should return 400 for empty email', async () => {
      const request = createMockRequest({ email: '' })
      
      const response = await requestOTPHandler(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid email format')
    })

    it('should return 500 for unauthorized email without revealing authorization status', async () => {
      const request = createMockRequest({ email: 'unauthorized@example.com' })
      
      const response = await requestOTPHandler(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to send OTP. Please try again.')
      
      // Verify no OTP was generated
      const otp = getOTPForTesting('unauthorized@example.com')
      expect(otp).toBeUndefined()
    })
  })

  describe('Rate Limiting', () => {
    it('should return 429 after 3 OTP requests within an hour', async () => {
      const request = createMockRequest({ email: 'admin@example.com' })
      
      // Make 3 requests (rate limit allows 3)
      const response1 = await requestOTPHandler(request)
      expect(response1.status).toBe(200)
      
      const response2 = await requestOTPHandler(request)
      expect(response2.status).toBe(200)
      
      const response3 = await requestOTPHandler(request)
      expect(response3.status).toBe(200)
      
      // Fourth request should be rate limited
      const response4 = await requestOTPHandler(request)
      const data4 = await response4.json()
      
      expect(response4.status).toBe(429)
      expect(data4.success).toBe(false)
      expect(data4.error).toBe('Too many requests. Please try again later.')
      expect(data4.retryAfter).toBe(3600) // 1 hour
    })
  })
})

/**
 * Test Suite: Verify OTP Endpoint
 * Validates: Requirements 1.6-1.10
 */
describe('POST /api/auth/verify-otp', () => {
  describe('Valid OTP Scenarios', () => {
    it('should return 200 and create session for valid OTP', async () => {
      // First, request an OTP
      const requestOTP = createMockRequest({ email: 'admin@example.com' })
      await requestOTPHandler(requestOTP)
      
      const otp = getOTPForTesting('admin@example.com')
      expect(otp).toBeDefined()
      
      // Verify the OTP
      const verifyRequest = createMockRequest({
        email: 'admin@example.com',
        otp: otp!,
      })
      
      const response = await verifyOTPHandler(verifyRequest)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('Authentication successful')
      expect(data.redirectTo).toBe('/dashboard')
    })

    it('should set HTTP-only session cookie on successful verification', async () => {
      // Request OTP
      const requestOTP = createMockRequest({ email: 'admin@example.com' })
      await requestOTPHandler(requestOTP)
      
      const otp = getOTPForTesting('admin@example.com')
      
      // Verify OTP
      const verifyRequest = createMockRequest({
        email: 'admin@example.com',
        otp: otp!,
      })
      
      await verifyOTPHandler(verifyRequest)
      
      // Check that cookie was set
      expect(mockCookieStore.set).toHaveBeenCalled()
      const cookieCall = mockCookieStore.set.mock.calls[0]
      
      expect(cookieCall[0]).toBe('admin_session') // Cookie name
      expect(cookieCall[1]).toBeDefined() // Token value
      expect(cookieCall[2]).toMatchObject({
        httpOnly: true,
        secure: false, // false in test environment
        sameSite: 'strict',
        path: '/',
      })
    })

    it('should invalidate OTP after successful verification', async () => {
      // Request OTP
      const requestOTP = createMockRequest({ email: 'admin@example.com' })
      await requestOTPHandler(requestOTP)
      
      const otp = getOTPForTesting('admin@example.com')
      
      // First verification
      const verifyRequest1 = createMockRequest({
        email: 'admin@example.com',
        otp: otp!,
      })
      
      const response1 = await verifyOTPHandler(verifyRequest1)
      expect(response1.status).toBe(200)
      
      // Second verification with same OTP should fail
      const verifyRequest2 = createMockRequest({
        email: 'admin@example.com',
        otp: otp!,
      })
      
      const response2 = await verifyOTPHandler(verifyRequest2)
      const data2 = await response2.json()
      
      expect(response2.status).toBe(400)
      expect(data2.success).toBe(false)
      expect(data2.error).toBe('Invalid or expired OTP')
    })
  })

  describe('Invalid OTP Scenarios', () => {
    it('should return 400 for incorrect OTP', async () => {
      // Request OTP
      const requestOTP = createMockRequest({ email: 'admin@example.com' })
      await requestOTPHandler(requestOTP)
      
      // Verify with wrong OTP
      const verifyRequest = createMockRequest({
        email: 'admin@example.com',
        otp: '000000', // Wrong OTP
      })
      
      const response = await verifyOTPHandler(verifyRequest)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid or expired OTP')
    })

    it('should return 400 for OTP with wrong length', async () => {
      const verifyRequest = createMockRequest({
        email: 'admin@example.com',
        otp: '12345', // Only 5 digits
      })
      
      const response = await verifyOTPHandler(verifyRequest)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid input')
    })

    it('should return 400 for non-numeric OTP', async () => {
      const verifyRequest = createMockRequest({
        email: 'admin@example.com',
        otp: 'abcdef',
      })
      
      const response = await verifyOTPHandler(verifyRequest)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid input')
    })

    it('should return 400 for missing OTP', async () => {
      const verifyRequest = createMockRequest({
        email: 'admin@example.com',
      })
      
      const response = await verifyOTPHandler(verifyRequest)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid input')
    })

    it('should return 400 for invalid email format', async () => {
      const verifyRequest = createMockRequest({
        email: 'not-an-email',
        otp: '123456',
      })
      
      const response = await verifyOTPHandler(verifyRequest)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid input')
    })
  })

  describe('Expired OTP Scenarios', () => {
    it('should return 400 for expired OTP', async () => {
      // Request OTP
      const requestOTP = createMockRequest({ email: 'admin@example.com' })
      await requestOTPHandler(requestOTP)
      
      const otp = getOTPForTesting('admin@example.com')
      expect(otp).toBeDefined()
      
      // Set expiration to the past
      setOTPExpirationForTesting('admin@example.com', new Date(Date.now() - 1000))
      
      // Try to verify expired OTP
      const verifyRequest = createMockRequest({
        email: 'admin@example.com',
        otp: otp!,
      })
      
      const response = await verifyOTPHandler(verifyRequest)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid or expired OTP')
    })

    it('should reject expired OTP even if it was valid when generated', async () => {
      // Request OTP
      const requestOTP = createMockRequest({ email: 'admin@example.com' })
      const otpResponse = await requestOTPHandler(requestOTP)
      const otpData = await otpResponse.json()
      
      expect(otpData.success).toBe(true)
      
      const otp = getOTPForTesting('admin@example.com')
      
      // Expire the OTP
      setOTPExpirationForTesting('admin@example.com', new Date(Date.now() - 60000)) // 1 minute ago
      
      // Verification should fail
      const verifyRequest = createMockRequest({
        email: 'admin@example.com',
        otp: otp!,
      })
      
      const response = await verifyOTPHandler(verifyRequest)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid or expired OTP')
    })
  })

  describe('Used OTP Scenarios', () => {
    it('should reject OTP that has already been used', async () => {
      // Request OTP
      const requestOTP = createMockRequest({ email: 'admin@example.com' })
      await requestOTPHandler(requestOTP)
      
      const otp = getOTPForTesting('admin@example.com')
      
      // First verification (should succeed)
      const verifyRequest1 = createMockRequest({
        email: 'admin@example.com',
        otp: otp!,
      })
      
      const response1 = await verifyOTPHandler(verifyRequest1)
      expect(response1.status).toBe(200)
      
      // Second verification (should fail)
      const verifyRequest2 = createMockRequest({
        email: 'admin@example.com',
        otp: otp!,
      })
      
      const response2 = await verifyOTPHandler(verifyRequest2)
      const data2 = await response2.json()
      
      expect(response2.status).toBe(400)
      expect(data2.error).toBe('Invalid or expired OTP')
    })
  })
})

/**
 * Test Suite: Logout Endpoint
 * Validates: Requirements 11.1-11.3
 */
describe('POST /api/auth/logout', () => {
  it('should return 200 and success message', async () => {
    const request = createMockRequest({})
    
    const response = await logoutHandler(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.message).toBe('Logged out successfully')
  })

  it('should clear session cookie by setting it with expired date', async () => {
    const request = createMockRequest({})
    
    await logoutHandler(request)
    
    // Check that cookie was set with expired date
    expect(mockCookieStore.set).toHaveBeenCalled()
    const cookieCall = mockCookieStore.set.mock.calls[0]
    
    expect(cookieCall[0]).toBe('admin_session')
    expect(cookieCall[1]).toBe('') // Empty value
    expect(cookieCall[2]).toMatchObject({
      httpOnly: true,
      secure: false, // false in test environment
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    })
    expect(cookieCall[2].expires).toEqual(new Date(0))
  })

  it('should successfully logout even without an active session', async () => {
    // Logout without prior login
    const request = createMockRequest({})
    
    const response = await logoutHandler(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })

  it('should set cookie with correct security flags', async () => {
    const request = createMockRequest({})
    
    await logoutHandler(request)
    
    const cookieCall = mockCookieStore.set.mock.calls[0]
    const cookieOptions = cookieCall[2]
    
    expect(cookieOptions.httpOnly).toBe(true)
    expect(cookieOptions.sameSite).toBe('strict')
    expect(cookieOptions.path).toBe('/')
  })
})
