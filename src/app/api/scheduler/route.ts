import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Define the scheduled tasks
const tasks = {
  artDigestGeneration: {
    name: 'Art Digest Generation',
    interval: 60 * 60 * 1000, // 1 hour
    lastRun: null as Date | null,
    handler: async () => {
      console.log('Running scheduled art digest generation...');
      try {
        // Check if an art digest has already been generated today
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to beginning of day
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Check if there's already an article published today
        const existingArticle = await prisma.generatedArticle.findFirst({
          where: {
            publishedAt: {
              gte: today,
              lt: tomorrow
            }
          },
          orderBy: {
            publishedAt: 'desc'
          }
        });
        
        if (existingArticle) {
          console.log(`Art digest already generated today (${existingArticle.id}): ${existingArticle.title}`);
          return true;
        }
        
        // Check if CRON_SECRET is defined
        if (!process.env.CRON_SECRET) {
          console.error('CRON_SECRET is not defined in environment variables');
          throw new Error('CRON_SECRET is not defined');
        }
        
        const cronSecret = process.env.CRON_SECRET.trim(); // Trim any whitespace
        const maskedSecret = cronSecret.substring(0, 3) + '...' + 
                            cronSecret.substring(cronSecret.length - 3);
        
        console.log(`CRON_SECRET is defined (length: ${cronSecret.length}, masked: ${maskedSecret}), proceeding with request`);
        
        // Use the dedicated endpoint for article generation
        const response = await fetch(new URL('/api/art-digest', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cronSecret}`,
            'User-Agent': 'vercel-cron/1.0'
          },
          body: JSON.stringify({ source: 'scheduler' })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to generate article: ${response.status} ${response.statusText} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Successfully generated art digest:', data.article.title);
        return true;
      } catch (error) {
        console.error('Failed to generate art digest:', error);
        // More detailed error logging
        if (error instanceof Error) {
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
        }
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
  
  // When called by Vercel cron job, run the task immediately
  try {
    console.log('GET /api/scheduler: Cron job triggered, running art digest generation...');
    lastRunTime = new Date();
    await tasks.artDigestGeneration.handler();
    console.log('GET /api/scheduler: Art digest generation completed successfully');
  } catch (error) {
    console.error('GET /api/scheduler: Error running art digest generation:', error);
  }
  
  return NextResponse.json({
    status: 'OK',
    message: 'Scheduler API is working',
    lastRun: lastRunTime?.toISOString() || null,
    canRunNow: canRunNow,
    note: "Art digest generation has been triggered by this GET request."
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