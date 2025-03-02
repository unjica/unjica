import { auth } from "auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnAdminPage = req.nextUrl.pathname.startsWith("/admin");
  const isOnArtNewsDigestPage = req.nextUrl.pathname.startsWith("/art-news/digest");
  
  // Allow public access to art-news/digest pages
  if (isOnArtNewsDigestPage) {
    return NextResponse.next();
  }
  
  // Check for admin access
  if (isOnAdminPage) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/login", req.nextUrl));
    }
    
    const isAdmin = req.auth?.user?.role === "ADMIN";
    
    if (!isAdmin) {
      return Response.redirect(new URL("/", req.nextUrl));
    }
  }
  
  return NextResponse.next();
});

// See https://nextjs.org/docs/app/building-your-application/routing/middleware
export const config = {
  matcher: [
    // Protect admin routes
    "/admin/:path*",
    // Skip all static files
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}; 