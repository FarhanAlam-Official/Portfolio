import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP, invalidateOTP } from '@/lib/services/otp-service';
import { createSession } from '@/lib/services/session-manager';
import { z } from 'zod';

const VerifyOTPSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must be numeric'),
});

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

    // Parse request body
    const body = await request.json();

    // Validate input
    const validation = VerifyOTPSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid OTP format',
        },
        { status: 400 }
      );
    }

    const { otp } = validation.data;

    // Verify OTP
    const isValid = await verifyOTP(adminEmail, otp);

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or expired OTP',
        },
        { status: 400 }
      );
    }

    // Invalidate OTP after successful verification
    await invalidateOTP(adminEmail);

    // Create session
    try {
      await createSession(adminEmail);
    } catch (sessionError) {
      console.error('[Auth API] Failed to create session:', sessionError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create session',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Authentication successful',
        redirectTo: '/dashboard',
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error (without sensitive data)
    console.error('[Auth API] Error verifying OTP:', {
      timestamp: new Date().toISOString(),
      endpoint: '/api/auth/verify-otp',
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Authentication failed. Please try again.',
      },
      { status: 500 }
    );
  }
}

// api: OTP verify + session
