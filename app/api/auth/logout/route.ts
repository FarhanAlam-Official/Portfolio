import { NextRequest, NextResponse } from 'next/server'
import { clearSession } from '@/lib/services/session-manager'

export async function POST(request: NextRequest) {
  try {
    // Clear session cookie
    await clearSession()
    
    // Log logout
    console.log('[Auth API] User logged out:', {
      timestamp: new Date().toISOString(),
    })
    
    return NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    // Log error
    console.error('[Auth API] Error during logout:', {
      timestamp: new Date().toISOString(),
      endpoint: '/api/auth/logout',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    
    return NextResponse.json(
      {
        success: false,
        error: 'Logout failed. Please try again.',
      },
      { status: 500 }
    )
  }
}
