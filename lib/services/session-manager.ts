import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export interface SessionPayload {
  email: string
  iat: number  // Issued at
  exp: number  // Expiration
}

interface CookieOptions {
  httpOnly: true
  secure: boolean
  sameSite: 'strict'
  maxAge: number
  path: '/'
}

// Session duration: 7 days
const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60

// Cookie name
const COOKIE_NAME = 'admin_session'

/**
 * Create JWT token and set cookie
 */
export async function createSession(email: string): Promise<string> {
  const jwtSecret = process.env.JWT_SECRET
  
  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not set')
  }
  
  if (jwtSecret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long')
  }
  
  // Create JWT token with 7-day expiration
  const token = jwt.sign(
    { email },
    jwtSecret,
    { expiresIn: `${SESSION_DURATION_SECONDS}s` }
  )
  
  // Set HTTP-only cookie
  const cookieStore = await cookies()
  const isProduction = process.env.NODE_ENV === 'production'
  
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: SESSION_DURATION_SECONDS,
    path: '/',
  })
  
  return token
}

/**
 * Verify JWT token from cookie
 */
export async function verifySession(token: string): Promise<SessionPayload | null> {
  const jwtSecret = process.env.JWT_SECRET
  
  if (!jwtSecret) {
    console.error('[Session Manager] JWT_SECRET not configured')
    return null
  }
  
  try {
    const decoded = jwt.verify(token, jwtSecret) as SessionPayload
    return decoded
  } catch (error) {
    // Token is invalid, expired, or has wrong signature
    console.error('[Session Manager] Token verification failed:', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return null
  }
}

/**
 * Get session from cookie
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  
  if (!token) {
    return null
  }
  
  return verifySession(token)
}

/**
 * Clear session cookie
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  
  // Set cookie with expired date to clear it
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    expires: new Date(0),
    path: '/',
  })
}

/**
 * Get session expiration time
 */
export async function getSessionExpiration(): Promise<Date | null> {
  const session = await getSession()
  
  if (!session) {
    return null
  }
  
  return new Date(session.exp * 1000)
}

/**
 * Check if session expires within specified minutes
 */
export async function isSessionExpiringSoon(minutes: number): Promise<boolean> {
  const expiration = await getSessionExpiration()
  
  if (!expiration) {
    return false
  }
  
  const now = new Date()
  const minutesUntilExpiration = (expiration.getTime() - now.getTime()) / (1000 * 60)
  
  return minutesUntilExpiration <= minutes && minutesUntilExpiration > 0
}

// session: JWT manager
