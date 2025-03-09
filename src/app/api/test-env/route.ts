import { NextResponse } from 'next/server';

export async function GET() {
  // Get CRON_SECRET and mask it for security
  const cronSecret = process.env.CRON_SECRET;
  const maskedCronSecret = cronSecret 
    ? cronSecret.substring(0, 3) + '...' + cronSecret.substring(cronSecret.length - 3) 
    : null;
  
  // Get BASE_URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  
  return NextResponse.json({
    cron_secret_defined: !!cronSecret,
    cron_secret_length: cronSecret ? cronSecret.length : 0,
    cron_secret_masked: maskedCronSecret,
    base_url_defined: !!baseUrl,
    base_url: baseUrl,
    node_env: process.env.NODE_ENV,
    // Add information about the request
    request_info: {
      host: process.env.VERCEL_URL || 'localhost',
      region: process.env.VERCEL_REGION || 'local'
    }
  });
}

// Make this route dynamic to avoid caching
export const dynamic = 'force-dynamic'; 