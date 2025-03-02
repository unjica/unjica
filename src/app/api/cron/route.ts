import { NextResponse } from 'next/server';

/**
 * API route for external cron jobs to trigger the scheduler
 * 
 * For production, you would use:
 * - Vercel Cron Jobs (https://vercel.com/docs/cron-jobs)
 * - GitHub Actions with scheduled workflows
 * - A dedicated cron job service like Upstash, Pipedream, or EasyCron
 * 
 * This endpoint should be called every 15 minutes to ensure the scheduler is running
 */
export async function GET(request: Request) {
  // Check for a secret key in production to prevent unauthorized triggers
  if (process.env.CRON_SECRET) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }
  
  try {
    // Call the scheduler API to ensure it's initialized
    const schedulerResponse = await fetch(new URL('/api/scheduler', request.url), {
      method: 'GET',
    });
    
    if (!schedulerResponse.ok) {
      throw new Error(`Failed to trigger scheduler: ${schedulerResponse.status}`);
    }
    
    const data = await schedulerResponse.json();
    
    // Force run the hourly art digest task if it's been more than 70 minutes
    const tasks = data.tasks || {};
    const digestTask = tasks['hourly-art-digest'];
    
    if (digestTask && digestTask.lastRun) {
      const lastRun = new Date(digestTask.lastRun);
      const now = new Date();
      const minutesSinceLastRun = (now.getTime() - lastRun.getTime()) / 60000;
      
      // If it's been more than 70 minutes, force a run
      if (minutesSinceLastRun > 70) {
        await fetch(new URL('/api/scheduler', request.url), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ taskId: 'hourly-art-digest' }),
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Cron job executed successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json(
      { 
        error: 'Failed to execute cron job',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// For Vercel Cron Jobs integration, add this export
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max execution time 