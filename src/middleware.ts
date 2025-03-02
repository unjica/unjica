import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Skip authentication check for profile page - we'll handle it client-side
  if (request.nextUrl.pathname.startsWith('/profile')) {
    return response;
  }

  // Debug: Log all cookies for troubleshooting
  const allCookies = request.cookies.getAll();
  
  // Check for Authorization header
  const authHeader = request.headers.get('authorization');
  const hasAuthHeader = !!authHeader && authHeader.startsWith('Bearer ');
  
  // Check if auth cookies exist before creating client
  const hasAuthCookie = allCookies.some(cookie => 
    cookie.name.includes('sb-') || cookie.name.includes('supabase-auth')
  );

  // If this is a protected route and there's no auth header or cookie,
  // check for a token in the URL (for client-side auth)
  if (isProtectedRoute(request.nextUrl.pathname) && !hasAuthHeader && !hasAuthCookie) {
    // For client-side navigation, we'll let the client handle auth
    // This prevents redirects for client-side authenticated users
    if (request.headers.get('accept')?.includes('text/html')) {
      return response;
    }
    
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

// Helper function to check if a route is protected
function isProtectedRoute(pathname: string): boolean {
  // Profile is handled client-side, so we only check for admin routes here
  const protectedPaths = ['/admin'];
  return protectedPaths.some(path => pathname.startsWith(path));
}

// Only run middleware on auth-related routes and protected routes
export const config = {
  matcher: [
    '/api/auth/:path*',
    '/admin/:path*',
    '/profile/:path*',
    '/api/art-digest/:path*',
  ],
}; 