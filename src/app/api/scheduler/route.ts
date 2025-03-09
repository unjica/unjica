import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateDailyArtDigest } from '@/lib/actions/artDigestActions';

// Track last run time in memory (note: this will reset when the app is redeployed)
let lastRunTime: Date | null = null;

// Track deployment time to prevent generating digests during deployment
const deploymentTime = Date.now();
const DEPLOYMENT_COOLDOWN = 5 * 60 * 1000; // 5 minutes cooldown after deployment

// Handle GET requests from Vercel cron job
export async function GET(request: Request) {
  console.log('GET /api/scheduler: Cron job triggered');
  
  // Check if this is a deployment-related request
  const currentTime = Date.now();
  const timeSinceDeployment = currentTime - deploymentTime;
  
  // If this request is within the deployment cooldown period, don't generate a digest
  if (timeSinceDeployment < DEPLOYMENT_COOLDOWN) {
    console.log(`GET /api/scheduler: Request received during deployment cooldown period (${Math.round(timeSinceDeployment / 1000)} seconds since deployment). Skipping digest generation.`);
    
    return NextResponse.json({
      status: 'SKIPPED',
      message: 'Skipping digest generation during deployment cooldown period',
      deploymentTime: new Date(deploymentTime).toISOString(),
      currentTime: new Date(currentTime).toISOString(),
      cooldownPeriod: `${DEPLOYMENT_COOLDOWN / 1000} seconds`,
      timeRemaining: `${Math.round((DEPLOYMENT_COOLDOWN - timeSinceDeployment) / 1000)} seconds`
    });
  }
  
  // Check if this is a Vercel cron job or a manual test
  const userAgent = request.headers.get('user-agent') || '';
  const isVercelCron = userAgent.includes('vercel-cron');
  const isManualTest = new URL(request.url).searchParams.has('test');
  
  console.log(`GET /api/scheduler: Request type - Vercel cron: ${isVercelCron}, Manual test: ${isManualTest}`);
  
  // Only proceed if this is a Vercel cron job or an explicit test request
  if (!isVercelCron && !isManualTest) {
    console.log('GET /api/scheduler: Request is not from Vercel cron job or manual test. Skipping digest generation.');
    
    return NextResponse.json({
      status: 'SKIPPED',
      message: 'Skipping digest generation for non-cron requests',
      userAgent
    });
  }
  
  try {
    // Check if an art digest has already been generated today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check if there's already an article published today
    const existingArticles = await prisma.generatedArticle.findMany({
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
    
    if (existingArticles.length > 0) {
      console.log(`GET /api/scheduler: Art digest already generated today. Found ${existingArticles.length} articles.`);
      console.log(`GET /api/scheduler: Latest article: (${existingArticles[0].id}): ${existingArticles[0].title}`);
      
      return NextResponse.json({
        status: 'OK',
        message: 'Art digest already generated today',
        lastRun: lastRunTime?.toISOString() || null,
        existingArticle: {
          id: existingArticles[0].id,
          title: existingArticles[0].title
        }
      });
    }
    
    // No article for today, generate one
    console.log('GET /api/scheduler: No article for today, generating one');
    lastRunTime = new Date();
    
    // Generate the article directly instead of calling the API
    const article = await generateDailyArtDigest();
    
    // Save the article to the database
    await prisma.generatedArticle.create({
      data: {
        id: article.id,
        title: article.title,
        content: article.content,
        primaryTopic: article.primaryTopic,
        summary: article.summary,
        tags: JSON.stringify(article.tags),
        publishedAt: new Date(article.publishedAt),
        sourceNewsIds: JSON.stringify(article.sourceNewsIds),
        lastUpdated: new Date(article.lastUpdated),
        // Type assertions to handle optional fields
        ...(article.imageUrl ? { imageUrl: article.imageUrl } : {}),
        ...(article.slug ? { slug: article.slug } : {})
      }
    });
    
    console.log('GET /api/scheduler: Art digest generated and saved successfully:', article.title);
    
    return NextResponse.json({
      status: 'OK',
      message: 'Art digest generated successfully',
      lastRun: lastRunTime.toISOString(),
      article: {
        id: article.id,
        title: article.title
      }
    });
  } catch (error) {
    console.error('GET /api/scheduler: Error generating art digest:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate art digest',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Make this route dynamic to avoid caching
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 1 minute max execution time (Vercel Hobby plan limit) 