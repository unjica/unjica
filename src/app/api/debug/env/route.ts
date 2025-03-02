import { NextResponse } from 'next/server';

// GET handler to fetch environment variables for debugging
export async function GET(request: Request) {
  try {
    // Safely expose environment variables (redact sensitive values)
    const envVars: Record<string, string> = {
      // Database
      DATABASE_URL: process.env.DATABASE_URL || 'not set',
      
      // Supabase (server-side)
      SUPABASE_URL: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'not set',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '[REDACTED]' : 'not set',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '[REDACTED]' : 'not set',
      
      // Next.js
      NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || 'not set',
      VERCEL_URL: process.env.VERCEL_URL || 'not set',
      VERCEL_ENV: process.env.VERCEL_ENV || 'not set',
      NODE_ENV: process.env.NODE_ENV || 'not set',
      
      // Auth
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'not set',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '[REDACTED]' : 'not set',
      
      // API Keys (redacted for security)
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? '[REDACTED]' : 'not set',
      
      // Server info
      SERVER_TIMESTAMP: new Date().toISOString(),
    };
    
    return NextResponse.json(envVars);
  } catch (error) {
    console.error('Error fetching environment variables:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch environment variables',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Make this API route dynamic to avoid caching
export const dynamic = 'force-dynamic'; 