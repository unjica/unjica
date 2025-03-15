import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateDailyArtDigest } from '@/lib/actions/artDigestActions';
import { Prisma } from '@prisma/client';
import { supabase } from '@/lib/supabase';

// This helps TypeScript recognize the additional fields
type GeneratedArticleWithExtras = Prisma.GeneratedArticleGetPayload<{}> & {
  imageUrl?: string | null;
  slug?: string | null;
};

// Sample fallback article for when the database is unavailable
const FALLBACK_ARTICLE = {
  id: 'fallback-article-1',
  title: 'Connection to Art Database Temporarily Unavailable',
  content: '<p>We\'re currently experiencing technical difficulties with our database connection. Our team is working to resolve this issue as quickly as possible.</p><p>In the meantime, please check back later to view our latest art news and articles.</p><p>We apologize for any inconvenience this may cause.</p>',
  primaryTopic: 'System',
  summary: 'Database connection is temporarily unavailable. Please check back later.',
  tags: JSON.stringify(['system', 'maintenance']),
  publishedAt: new Date().toISOString(),
  sourceNewsIds: JSON.stringify([]),
  lastUpdated: new Date().toISOString(),
  imageUrl: null,
  slug: 'system-maintenance'
};

// GET handler to fetch all articles
export async function GET(request: Request) {
  try {
    console.log('GET /api/art-digest: Request received');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    
    console.log(`GET /api/art-digest: Params - id: ${id}, slug: ${slug}`);
    
    // If ID or slug is provided, fetch a specific article
    if (id || slug) {
      let article;
      
      try {
        console.log('GET /api/art-digest: Attempting to fetch specific article');
        if (id) {
          article = await prisma.generatedArticle.findUnique({
            where: { id }
          });
          console.log(`GET /api/art-digest: Article lookup by id ${id} complete`);
        } else if (slug) {
          // Use findFirst with a more TypeScript-friendly approach
          article = await prisma.generatedArticle.findFirst({
            where: {
              // Using a type assertion to help TypeScript understand our schema
              slug: slug
            } as any
          });
          console.log(`GET /api/art-digest: Article lookup by slug ${slug} complete`);
        }
      } catch (error) {
        console.error('Database error when fetching article:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        
        // If the error is related to database connection, return the fallback article
        if (error instanceof Error && 
            (error.message.includes('database') || 
             error.message.includes('connection') || 
             error.message.includes('DATABASE_URL'))) {
          console.log('GET /api/art-digest: Using fallback article due to database error');
          
          // If the requested ID or slug matches our fallback, return it
          if (id === FALLBACK_ARTICLE.id || slug === FALLBACK_ARTICLE.slug) {
            return NextResponse.json({ article: FALLBACK_ARTICLE });
          }
          
          // Otherwise return a 404 with a message
          return NextResponse.json(
            { error: 'Article not found. Database connection is currently unavailable.' },
            { status: 404 }
          );
        }
        
        return NextResponse.json(
          { error: 'Database error when fetching article', details: error instanceof Error ? error.message : String(error) },
          { status: 500 }
        );
      }
      
      if (!article) {
        console.log('GET /api/art-digest: Article not found');
        return NextResponse.json(
          { error: 'Article not found' },
          { status: 404 }
        );
      }
      
      // Cast to our extended type to access all fields
      const typedArticle = article as GeneratedArticleWithExtras;
      console.log('GET /api/art-digest: Article found, preparing response');
      
      return NextResponse.json({
        article: {
          id: typedArticle.id,
          title: typedArticle.title,
          content: typedArticle.content,
          primaryTopic: typedArticle.primaryTopic,
          summary: typedArticle.summary,
          tags: typedArticle.tags ? (
            typeof typedArticle.tags === 'string' 
              ? JSON.parse(typedArticle.tags) 
              : typedArticle.tags
          ) : [],
          publishedAt: typedArticle.publishedAt.toISOString(),
          sourceNewsIds: typedArticle.sourceNewsIds ? (
            typeof typedArticle.sourceNewsIds === 'string'
              ? (() => {
                  try {
                    return JSON.parse(typedArticle.sourceNewsIds);
                  } catch (e) {
                    console.error(`Error parsing sourceNewsIds for article ${typedArticle.id}:`, e);
                    return [];
                  }
                })()
              : typedArticle.sourceNewsIds
          ) : [],
          lastUpdated: typedArticle.lastUpdated.toISOString(),
          imageUrl: typedArticle.imageUrl,
          slug: typedArticle.slug
        }
      });
    }
    
    // Otherwise fetch all articles
    try {
      console.log('GET /api/art-digest: Attempting to fetch all articles');
      const dbArticles = await prisma.generatedArticle.findMany({
        orderBy: {
          publishedAt: 'desc'
        },
        take: 50
      });
      
      console.log(`GET /api/art-digest: Found ${dbArticles.length} articles`);
      
      const articles = dbArticles.map(dbArticle => {
        // Cast to our extended type to access all fields
        const typedArticle = dbArticle as GeneratedArticleWithExtras;
        
        try {
          return {
            id: typedArticle.id,
            title: typedArticle.title,
            content: typedArticle.content,
            primaryTopic: typedArticle.primaryTopic,
            summary: typedArticle.summary,
            tags: typedArticle.tags ? (
              typeof typedArticle.tags === 'string' 
                ? JSON.parse(typedArticle.tags) 
                : typedArticle.tags
            ) : [],
            publishedAt: typedArticle.publishedAt.toISOString(),
            sourceNewsIds: typedArticle.sourceNewsIds ? (
              typeof typedArticle.sourceNewsIds === 'string'
                ? (() => {
                    try {
                      return JSON.parse(typedArticle.sourceNewsIds);
                    } catch (e) {
                      console.error(`Error parsing sourceNewsIds for article ${typedArticle.id}:`, e);
                      return [];
                    }
                  })()
                : typedArticle.sourceNewsIds
            ) : [],
            lastUpdated: typedArticle.lastUpdated.toISOString(),
            imageUrl: typedArticle.imageUrl,
            slug: typedArticle.slug
          };
        } catch (parseError) {
          console.error(`Error parsing article data for article ${typedArticle.id}:`, parseError);
          // Return a simplified version of the article if parsing fails
          return {
            id: typedArticle.id,
            title: typedArticle.title,
            content: typedArticle.content,
            primaryTopic: typedArticle.primaryTopic,
            summary: typedArticle.summary,
            tags: [],
            publishedAt: typedArticle.publishedAt.toISOString(),
            sourceNewsIds: [],
            lastUpdated: typedArticle.lastUpdated.toISOString(),
            imageUrl: typedArticle.imageUrl,
            slug: typedArticle.slug
          };
        }
      });
      
      console.log('GET /api/art-digest: Successfully processed all articles, returning response');
      return NextResponse.json({ articles });
    } catch (dbError) {
      console.error('Database error when fetching all articles:', dbError);
      console.error('Error details:', JSON.stringify(dbError, null, 2));
      
      // If the error is related to database connection, return a fallback article
      if (dbError instanceof Error && 
          (dbError.message.includes('database') || 
           dbError.message.includes('connection') || 
           dbError.message.includes('DATABASE_URL'))) {
        console.log('GET /api/art-digest: Using fallback article due to database error');
        return NextResponse.json({ 
          articles: [FALLBACK_ARTICLE],
          _notice: 'Database connection is currently unavailable. Showing fallback content.'
        });
      }
      
      return NextResponse.json(
        { error: 'Database error when fetching all articles', details: dbError instanceof Error ? dbError.message : String(dbError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    // Return fallback content for any unhandled error
    return NextResponse.json({ 
      articles: [FALLBACK_ARTICLE],
      _error: error instanceof Error ? error.message : String(error)
    });
  }
}

// POST handler to generate a new article
export async function POST(request: Request) {
  try {
    console.log('POST /api/art-digest: Request received');
    
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    console.log(`POST /api/art-digest: Authorization header present: ${!!authHeader}`);
    
    // Check if this is a Vercel cron job request
    const userAgent = request.headers.get('user-agent') || '';
    const isVercelCron = userAgent.includes('vercel-cron');
    console.log(`POST /api/art-digest: Is Vercel cron job: ${isVercelCron}`);
    
    // In production, automatically authorize Vercel cron jobs
    if (process.env.NODE_ENV === 'production' && isVercelCron) {
      console.log('POST /api/art-digest: Automatically authorizing Vercel cron job in production');
      // Continue with article generation
    }
    // Otherwise check authorization
    else if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('POST /api/art-digest: Missing or invalid authorization header');
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }
    else {
      const token = authHeader.split(' ')[1];
      console.log('POST /api/art-digest: Token extracted');
      
      // Check if CRON_SECRET is defined
      console.log(`POST /api/art-digest: CRON_SECRET defined: ${!!process.env.CRON_SECRET}`);
      
      let isAuthorized = false;
      
      // Try CRON_SECRET authentication first
      if (process.env.CRON_SECRET) {
        const cronSecret = process.env.CRON_SECRET.trim(); // Trim any whitespace
        const maskedSecret = cronSecret.substring(0, 3) + '...' + 
                            cronSecret.substring(cronSecret.length - 3);
        const maskedToken = token.substring(0, 3) + '...' + 
                            token.substring(token.length - 3);
        console.log(`POST /api/art-digest: Comparing tokens - Secret: ${maskedSecret}, Token: ${maskedToken}`);
        console.log(`POST /api/art-digest: Secret length: ${cronSecret.length}, Token length: ${token.length}`);
        console.log(`POST /api/art-digest: Tokens match: ${token === cronSecret}`);
        
        if (token === cronSecret) {
          console.log('POST /api/art-digest: Cron job authenticated with CRON_SECRET');
          isAuthorized = true;
        } else {
          console.log('POST /api/art-digest: CRON_SECRET authentication failed, trying Supabase');
        }
      } else {
        console.log('POST /api/art-digest: No CRON_SECRET defined, trying Supabase');
      }
      
      // If not authorized by CRON_SECRET, try Supabase
      if (!isAuthorized) {
        console.log('POST /api/art-digest: Verifying with Supabase');
        
        try {
          // Verify the token with Supabase
          const { data: { user }, error } = await supabase.auth.getUser(token);
          
          if (error) {
            console.error('POST /api/art-digest: Supabase auth error:', error);
            return NextResponse.json(
              { error: 'Authentication error', details: error.message },
              { status: 401 }
            );
          }
          
          if (!user) {
            console.log('POST /api/art-digest: No user found for token');
            return NextResponse.json(
              { error: 'Unauthorized. User not found.' },
              { status: 403 }
            );
          }
          
          console.log(`POST /api/art-digest: User authenticated: ${user.email}`);
          
          // Check if user is admin
          if (user.email !== 'sanja.malovic2@gmail.com') {
            console.log(`POST /api/art-digest: User ${user.email} is not an admin`);
            return NextResponse.json(
              { error: 'Unauthorized. Admin access required.' },
              { status: 403 }
            );
          }
          
          isAuthorized = true;
        } catch (authError) {
          console.error('POST /api/art-digest: Authentication error:', authError);
          return NextResponse.json(
            { error: 'Authentication failed', details: authError instanceof Error ? authError.message : String(authError) },
            { status: 401 }
          );
        }
      }
      
      // If we get here and still not authorized, return 403
      if (!isAuthorized) {
        console.log('POST /api/art-digest: All authentication methods failed');
        return NextResponse.json(
          { error: 'Unauthorized. Admin access required.' },
          { status: 403 }
        );
      }
    }
    
    // Generate the article
    console.log('POST /api/art-digest: Access confirmed, generating article');

    // Check if an article has already been generated today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if there's already an article published today
    // const existingArticles = await prisma.generatedArticle.findMany({
    //   where: {
    //     publishedAt: {
    //       gte: today,
    //       lt: tomorrow
    //     }
    //   },
    //   orderBy: {
    //     publishedAt: 'desc'
    //   },
    //   take: 5 // Get the latest 5 just to see if there are multiple
    // });

    // if (existingArticles.length > 0) {
    //   console.log(`POST /api/art-digest: Art digest already generated today. Found ${existingArticles.length} articles.`);
    //   console.log(`POST /api/art-digest: Latest article: (${existingArticles[0].id}): ${existingArticles[0].title}`);
      
    //   // Return the existing article instead of generating a new one
    //   return NextResponse.json({ 
    //     article: existingArticles[0],
    //     success: true,
    //     note: 'Returned existing article instead of generating a new one'
    //   });
    // }

    const article = await generateDailyArtDigest();
    
    // Save the article to the database
    console.log('POST /api/art-digest: Article generated, saving to database');
    try {
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
        } as Prisma.GeneratedArticleCreateInput
      });
      
      console.log('POST /api/art-digest: Article saved successfully');
      return NextResponse.json({ article, success: true });
    } catch (dbError) {
      // Check if it's a unique constraint error on the slug field
      if (dbError instanceof Prisma.PrismaClientKnownRequestError && 
          dbError.code === 'P2002' && 
          dbError.meta?.target && 
          (dbError.meta.target as string[]).includes('slug')) {
        
        console.log('POST /api/art-digest: Slug conflict detected, generating a unique slug');
        
        // Get a unique slug by adding a timestamp
        const timestamp = Date.now().toString().slice(-6);
        const uniqueSlug = article.slug ? `${article.slug}-${timestamp}` : `article-${timestamp}`;
        
        // Try again with the unique slug
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
            slug: uniqueSlug
          } as Prisma.GeneratedArticleCreateInput
        });
        
        console.log(`POST /api/art-digest: Article saved successfully with unique slug: ${uniqueSlug}`);
        return NextResponse.json({ 
          article: { ...article, slug: uniqueSlug }, 
          success: true,
          note: 'A unique slug was generated due to a conflict'
        });
      }
      
      // If it's another type of error, log and return it
      console.error('POST /api/art-digest: Database error when saving article:', dbError);
      return NextResponse.json(
        { error: 'Database error when saving article', details: dbError instanceof Error ? dbError.message : String(dbError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('POST /api/art-digest: Unhandled error:', error);
    return NextResponse.json(
      { error: 'Failed to generate article', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// DELETE handler to delete an article (admin only)
export async function DELETE(request: Request) {
  try {
    console.log('DELETE /api/art-digest: Request received');
    
    // Get the session from Supabase
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      console.log('DELETE /api/art-digest: Missing article ID');
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }
    
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('DELETE /api/art-digest: Missing or invalid authorization header');
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    console.log('DELETE /api/art-digest: Token extracted, verifying with Supabase');
    
    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) {
      console.error('DELETE /api/art-digest: Supabase auth error:', error);
      return NextResponse.json(
        { error: 'Authentication error', details: error.message },
        { status: 401 }
      );
    }
    
    if (!user) {
      console.log('DELETE /api/art-digest: No user found for token');
      return NextResponse.json(
        { error: 'Unauthorized. User not found.' },
        { status: 403 }
      );
    }
    
    console.log(`DELETE /api/art-digest: User authenticated: ${user.email}`);
    
    // Check if user is admin
    if (user.email !== 'sanja.malovic2@gmail.com') {
      console.log(`DELETE /api/art-digest: User ${user.email} is not an admin`);
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }
    
    console.log(`DELETE /api/art-digest: Admin access confirmed, deleting article ${id}`);
    
    // First, delete all comments associated with this article
    await (prisma as any).comment.deleteMany({
      where: {
        articleId: id,
      },
    });
    
    // Next, delete all reactions for this article
    await (prisma as any).reaction.deleteMany({
      where: {
        articleId: id,
      },
    });
    
    // Finally, delete the article itself
    await prisma.generatedArticle.delete({
      where: {
        id: id,
      },
    });
    
    console.log(`DELETE /api/art-digest: Article ${id} deleted successfully`);
    return NextResponse.json({
      success: true,
      message: 'Article and associated data deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Failed to delete article', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Make this API route dynamic to avoid caching
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 1 minute max execution time (Vercel Hobby plan limit) 