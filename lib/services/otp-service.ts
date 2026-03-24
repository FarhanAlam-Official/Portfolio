import nodemailer from 'nodemailer'
import { randomInt, createHash } from 'crypto'
import { readFileSync, writeFileSync, unlinkSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

interface OTPStore {
  email: string
  otp: string
  expiresAt: Date
  used: boolean
}

interface OTPResult {
  success: boolean
  expiresAt: Date
  error?: string
}

interface RateLimitStore {
  attempts: number
  resetAt: Date
}

// In-memory storage for OTPs and rate limiting
const otpStore = new Map<string, OTPStore>()
const rateLimitStore = new Map<string, RateLimitStore>()

// Storage directory for persistent OTP data
const OTP_STORAGE_DIR = join(process.cwd(), '.next', 'cache', 'otp')

// Rate limit: 3 requests per hour per email
const RATE_LIMIT_MAX_ATTEMPTS = 3
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour

// OTP expiration: 10 minutes
const OTP_EXPIRATION_MS = 10 * 60 * 1000

/**
 * Hash email address for use as filename
 */
function hashEmail(email: string): string {
  return createHash('sha256').update(email.toLowerCase()).digest('hex')
}

/**
 * Ensure OTP storage directory exists
 */
function ensureStorageDir(): void {
  if (!existsSync(OTP_STORAGE_DIR)) {
    mkdirSync(OTP_STORAGE_DIR, { recursive: true })
  }
}

/**
 * Read OTP data from file
 */
function readOTPFromFile(email: string): OTPStore | null {
  try {
    ensureStorageDir()
    const filename = join(OTP_STORAGE_DIR, `${hashEmail(email)}.json`)
    
    if (!existsSync(filename)) {
      return null
    }
    
    const data = readFileSync(filename, 'utf-8')
    const parsed = JSON.parse(data)
    
    // Convert expiresAt string back to Date object
    return {
      ...parsed,
      expiresAt: new Date(parsed.expiresAt),
    }
  } catch (error) {
    console.error('[OTP Service] Error reading OTP from file:', error)
    return null
  }
}

/**
 * Write OTP data to file
 */
function writeOTPToFile(email: string, data: OTPStore): void {
  try {
    ensureStorageDir()
    const filename = join(OTP_STORAGE_DIR, `${hashEmail(email)}.json`)
    writeFileSync(filename, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('[OTP Service] Error writing OTP to file:', error)
    throw error
  }
}

/**
 * Delete OTP file
 */
function deleteOTPFile(email: string): void {
  try {
    ensureStorageDir()
    const filename = join(OTP_STORAGE_DIR, `${hashEmail(email)}.json`)
    
    if (existsSync(filename)) {
      unlinkSync(filename)
    }
  } catch (error) {
    console.error('[OTP Service] Error deleting OTP file:', error)
    // Don't throw - deletion failure shouldn't break the flow
  }
}

/**
 * Read rate limit data from file
 */
function readRateLimitFromFile(email: string): RateLimitStore | null {
  try {
    ensureStorageDir()
    const filename = join(OTP_STORAGE_DIR, `${hashEmail(email)}_ratelimit.json`)
    
    if (!existsSync(filename)) {
      return null
    }
    
    const data = readFileSync(filename, 'utf-8')
    const parsed = JSON.parse(data)
    
    // Convert resetAt string back to Date object
    return {
      ...parsed,
      resetAt: new Date(parsed.resetAt),
    }
  } catch (error) {
    console.error('[OTP Service] Error reading rate limit from file:', error)
    return null
  }
}

/**
 * Write rate limit data to file
 */
function writeRateLimitToFile(email: string, data: RateLimitStore): void {
  try {
    ensureStorageDir()
    const filename = join(OTP_STORAGE_DIR, `${hashEmail(email)}_ratelimit.json`)
    writeFileSync(filename, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('[OTP Service] Error writing rate limit to file:', error)
    throw error
  }
}

/**
 * Generate a 6-digit numeric OTP
 */
function generateOTP(): string {
  return randomInt(100000, 999999).toString()
}

/**
 * Check if email has exceeded rate limit
 */
function checkRateLimit(email: string): boolean {
  const now = new Date()
  const rateLimit = readRateLimitFromFile(email)
  
  if (!rateLimit) {
    return true // No attempts yet, allow
  }
  
  // Reset if window has passed
  if (now > rateLimit.resetAt) {
    // Delete rate limit file
    try {
      ensureStorageDir()
      const filename = join(OTP_STORAGE_DIR, `${hashEmail(email)}_ratelimit.json`)
      if (existsSync(filename)) {
        unlinkSync(filename)
      }
    } catch (error) {
      console.error('[OTP Service] Error deleting rate limit file:', error)
    }
    return true
  }
  
  // Check if under limit
  return rateLimit.attempts < RATE_LIMIT_MAX_ATTEMPTS
}

/**
 * Track OTP request attempt
 */
function trackAttempt(email: string): void {
  const now = new Date()
  const rateLimit = rateLimitStore.get(email)
  
  if (!rateLimit || now > rateLimit.resetAt) {
    // Start new window
    const newRateLimit = {
      attempts: 1,
      resetAt: new Date(now.getTime() + RATE_LIMIT_WINDOW_MS),
    }
    rateLimitStore.set(email, newRateLimit)
    writeRateLimitToFile(email, newRateLimit)
  } else {
    // Increment attempts
    rateLimit.attempts++
    writeRateLimitToFile(email, rateLimit)
  }
}

/**
 * Generate and send OTP via Gmail SMTP
 */
export async function generateAndSendOTP(email: string): Promise<OTPResult> {
  try {
    // Check rate limit
    if (!checkRateLimit(email)) {
      throw new Error('RATE_LIMIT_EXCEEDED')
    }
    
    // Generate OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + OTP_EXPIRATION_MS)
    
    // Store OTP
    writeOTPToFile(email, {
      email,
      otp,
      expiresAt,
      used: false,
    })
    
    // Configure Gmail SMTP transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })
    
    // Send email with clean, professional template
    await transporter.sendMail({
      from: `"Portfolio CMS" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Your Admin Login Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; border: 1px solid #e5e5e5; max-width: 600px;">
                  
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 30px; border-bottom: 1px solid #e5e5e5;">
                      <h1 style="margin: 0; color: #1a1a1a; font-size: 24px; font-weight: 600;">
                        Admin Login Verification
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 24px; color: #404040; font-size: 16px; line-height: 1.5;">
                        Use the following code to log in to your admin panel:
                      </p>
                      
                      <!-- OTP Code -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 0 0 32px 0;">
                            <table cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border: 2px solid #e5e5e5; border-radius: 8px; padding: 24px 32px;">
                              <tr>
                                <td>
                                  <div style="font-size: 36px; font-weight: 600; letter-spacing: 6px; color: #1a1a1a; font-family: 'Courier New', Courier, monospace;">
                                    ${otp}
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Info Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; border-radius: 6px; padding: 16px; margin-bottom: 24px;">
                        <tr>
                          <td>
                            <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.5;">
                              <strong>This code will expire in 10 minutes.</strong><br>
                              For security reasons, do not share this code with anyone.
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 0; color: #737373; font-size: 14px; line-height: 1.5;">
                        If you didn't request this code, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 24px 40px; background-color: #f9f9f9; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e5e5;">
                      <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.5; text-align: center;">
                        This is an automated message from your Portfolio CMS.<br>
                        Please do not reply to this email.
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    })
    
    // Track attempt
    trackAttempt(email)
    
    return {
      success: true,
      expiresAt,
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'RATE_LIMIT_EXCEEDED') {
      throw error
    }
    
    // Log error but return generic message
    console.error('[OTP Service] Error generating/sending OTP:', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    
    throw new Error('Failed to send OTP')
  }
}

/**
 * Verify OTP
 */
export async function verifyOTP(email: string, otp: string): Promise<boolean> {
  const stored = readOTPFromFile(email)
  
  if (!stored) {
    return false
  }
  
  // Check if already used
  if (stored.used) {
    return false
  }
  
  // Check if expired
  const now = new Date()
  if (now > stored.expiresAt) {
    deleteOTPFile(email)
    return false
  }
  
  // Trim and compare OTP
  const providedOTP = otp.trim()
  const storedOTP = stored.otp.trim()
  
  if (storedOTP !== providedOTP) {
    return false
  }
  
  // Mark as used
  stored.used = true
  writeOTPToFile(email, stored)
  
  return true
}

/**
 * Invalidate OTP after use
 */
export async function invalidateOTP(email: string): Promise<void> {
  deleteOTPFile(email)
}

/**
 * Get OTP for testing purposes only
 * This should only be used in test environment
 */
export function getOTPForTesting(email: string): string | undefined {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('getOTPForTesting can only be used in test environment')
  }
  // Try file storage first, then fall back to in-memory
  const fromFile = readOTPFromFile(email)
  if (fromFile) {
    return fromFile.otp
  }
  return otpStore.get(email)?.otp
}

/**
 * Set OTP expiration for testing purposes only
 * This should only be used in test environment
 */
export function setOTPExpirationForTesting(email: string, expiresAt: Date): void {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('setOTPExpirationForTesting can only be used in test environment')
  }
  // Update file storage
  const stored = readOTPFromFile(email)
  if (stored) {
    stored.expiresAt = expiresAt
    writeOTPToFile(email, stored)
  }
  // Also update in-memory for backward compatibility
  const inMemory = otpStore.get(email)
  if (inMemory) {
    inMemory.expiresAt = expiresAt
  }
}

/**
 * Clear all OTPs (for testing)
 * 
 * This function simulates a module reload by clearing the in-memory stores.
 * It does NOT delete the file-based storage, which is the whole point of the fix -
 * file-based storage should persist across module reloads.
 */
export function clearAllOTPs(): void {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('clearAllOTPs can only be used in test environment')
  }
  // Clear in-memory stores to simulate module reload
  otpStore.clear()
  rateLimitStore.clear()
  
  // DO NOT delete files - file-based storage should persist across module reloads
  // This is the whole point of the fix!
}

// otp: email auth service
