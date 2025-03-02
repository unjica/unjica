import { NextResponse } from 'next/server';

// Define the scheduled tasks
const tasks = {
  artDigestGeneration: {
    name: 'Art Digest Generation',
    interval: 60 * 60 * 1000, // 1 hour
    lastRun: null as Date | null,
    handler: async () => {
      console.log('Running scheduled art digest generation...');
      try {
        // Use the dedicated endpoint for article generation
        const response = await fetch(new URL('/api/art-digest', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to generate article: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Successfully generated art digest:', data.article.title);
        return true;
      } catch (error) {
        console.error('Failed to generate art digest:', error);
        return false;
      }
    }
  }
};

// Track last run time in memory (note: this will reset when the app is redeployed)
let lastRunTime: Date | null = null;

/**
 * IMPORTANT: This scheduler implementation will NOT work reliably in Next.js.
 * 
 * In serverless environments like Next.js API routes, the server doesn't maintain a long-running
 * process between requests. This means setInterval-based scheduling won't work as expected.
 * 
 * For reliable scheduling, use one of these approaches instead:
 * 1. Vercel Cron Jobs (https://vercel.com/docs/cron-jobs)
 * 2. External cron service (e.g., cron-job.org, Upstash, or GitHub Actions)
 * 3. Use a service like Inngest or Trigger.dev for workflow scheduling
 * 
 * Set up a cron job to call this endpoint every hour to generate a new digest.
 */

// Handle GET requests to check scheduler status and manually trigger
export async function GET() {
  // Run the task immediately if requested
  const canRunNow = !lastRunTime || (new Date().getTime() - lastRunTime.getTime() > 30 * 60 * 1000); // 30 minutes
  
  return NextResponse.json({
    status: 'OK',
    message: 'Scheduler API is working',
    lastRun: lastRunTime?.toISOString() || null,
    canRunNow: canRunNow,
    note: "This API doesn't provide actual scheduling. Set up an external cron job to call this API with POST to generate articles."
  });
}

// Handle POST requests to manually trigger the digest generation
export async function POST() {
  try {
    lastRunTime = new Date();
    await tasks.artDigestGeneration.handler();
    
    return NextResponse.json({
      status: 'OK',
      message: 'Article digest generation triggered successfully',
      lastRun: lastRunTime.toISOString()
    });
  } catch (error) {
    console.error('Error running scheduled task:', error);
    return NextResponse.json(
      { error: 'Failed to run scheduled task' },
      { status: 500 }
    );
  }
}

// Make this route dynamic to avoid caching
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 1 minute max execution time (Vercel Hobby plan limit) 