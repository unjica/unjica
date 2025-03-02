import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Skip middleware for static files
  const url = request.nextUrl.clone();
  const path = url.pathname;
  
  // Skip middleware for static files and assets
  if (
    path.includes('.') || // Files with extensions (like .js, .css, .png)
    path.startsWith('/_next') ||
    path.startsWith('/static') ||
    path.startsWith('/favicon') ||
    path === '/site.webmanifest' ||
    path.startsWith('/android-chrome-') ||
    path.startsWith('/apple-touch-icon') ||
    path.includes('/api/art-digest') // Skip auth for art-digest API
  ) {
    return NextResponse.next();
  }
  
  // Create a Supabase client for auth
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Refresh session if expired
  const { data: { session } } = await supabase.auth.getSession();

  // Check if user is accessing protected routes
  if (path.startsWith('/admin')) {
    if (!session) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== 'sanja.malovic2@gmail.com') {
      // Redirect to home if not admin
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

// Only run middleware on auth-related routes and protected routes
export const config = {
  matcher: [
    '/api/auth/:path*',
    '/admin/:path*',
    '/profile/:path*',
  ],
}; 