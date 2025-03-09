import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    cron_secret_defined: !!process.env.CRON_SECRET,
    base_url_defined: !!process.env.NEXT_PUBLIC_BASE_URL,
    base_url: process.env.NEXT_PUBLIC_BASE_URL,
    node_env: process.env.NODE_ENV
  });
}

// Make this route dynamic to avoid caching
export const dynamic = 'force-dynamic'; 