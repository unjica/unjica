import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  try {
    // Attempt to get the session, which will refresh the token if needed
    const { data: { session } } = await supabase.auth.getSession();
    
    // If no session and trying to access protected routes, redirect to login
    if (!session && isProtectedRoute(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } catch (error) {
    // Clear all auth cookies to ensure a clean state
    const cookiesToClear = ['sb-access-token', 'sb-refresh-token', 'supabase-auth-token'];
    
    cookiesToClear.forEach(cookieName => {
      response.cookies.set({
        name: cookieName,
        value: '',
        maxAge: 0,
        path: '/',
      });
    });
    
    // If there's an error with the token refresh, log it for debugging
    if (error instanceof Error) {
      console.error('Auth error in middleware:', error.message);
      
      // If trying to access protected routes, redirect to login
      if (isProtectedRoute(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/login?error=session_expired', request.url));
      }
    }
  }

  return response;
}

// Helper function to check if a route is protected
function isProtectedRoute(pathname: string): boolean {
  const protectedPaths = ['/admin', '/profile'];
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