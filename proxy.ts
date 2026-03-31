
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/services/session-manager';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('admin_session')?.value;

    // No token - redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verify token
      const session = await verifySession(token);

      // Invalid, expired, or wrong signature - redirect to login
      if (!session) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // Add user email to request headers for route handlers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-email', session.email);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      // Any error during verification - redirect to login
      console.error('[Proxy] Session verification error:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}


// proxy: route protection
