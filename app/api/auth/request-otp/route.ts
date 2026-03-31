import { NextRequest, NextResponse } from 'next/server';
import { generateAndSendOTP } from '@/lib/services/otp-service';

export async function POST(request: NextRequest) {
  try {
    // Get admin email from environment
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      console.error('[Auth API] ADMIN_EMAIL not configured');
      return NextResponse.json(
        {
          success: false,
          error: 'Server configuration error',
        },
        { status: 500 }
      );
    }

    // Generate and send OTP to admin email
    await generateAndSendOTP(adminEmail);

    // Log authentication attempt (without OTP value)
    console.log('[Auth API] OTP request:', {
      timestamp: new Date().toISOString(),
      email: adminEmail,
      success: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'OTP sent to admin email',
        expiresIn: 600, // 10 minutes in seconds
      },
      { status: 200 }
    );
  } catch (error) {
    const adminEmail = process.env.ADMIN_EMAIL || 'unknown';

    // Handle rate limit error
    if (error instanceof Error && error.message === 'RATE_LIMIT_EXCEEDED') {
      console.log('[Auth API] Rate limit exceeded:', {
        timestamp: new Date().toISOString(),
        endpoint: '/api/auth/request-otp',
        email: adminEmail,
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please try again later.',
          retryAfter: 3600, // 1 hour in seconds
        },
        { status: 429 }
      );
    }

    // Log error (without sensitive data)
    console.error('[Auth API] Error requesting OTP:', {
      timestamp: new Date().toISOString(),
      endpoint: '/api/auth/request-otp',
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    // Return generic error message
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send OTP. Please try again.',
      },
      { status: 500 }
    );
  }
}
