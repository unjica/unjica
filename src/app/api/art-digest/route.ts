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
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '6');
    const topic = searchParams.get('topic');
    const slug = searchParams.get('slug');

    // If slug is provided, fetch a single article
    if (slug) {
      const article = await prisma.generatedArticle.findFirst({
        where: { slug }
      });

      if (!article) {
        return NextResponse.json(
          { error: 'Article not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ article });
    }

    // Build the query for fetching multiple articles
    const query: any = {
      take: limit,
      orderBy: {
        publishedAt: 'desc'
      }
    };

    // Add cursor if provided
    if (cursor) {
      query.cursor = {
        id: cursor
      };
    }

    // Add topic filter if provided
    if (topic) {
      query.where = {
        primaryTopic: topic
      };
    }

    // Fetch articles with pagination
    const articles = await prisma.generatedArticle.findMany(query);

    // Get the next cursor
    const nextCursor = articles.length === limit ? articles[articles.length - 1].id : null;

    // Get total count for the current filter
    const totalCount = await prisma.generatedArticle.count({
      where: topic ? { primaryTopic: topic } : undefined
    });

    return NextResponse.json({
      articles,
      nextCursor,
      hasMore: nextCursor !== null,
      totalCount
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

// POST handler to generate a new article
export async function POST(request: Request) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (user.email !== 'sanja.malovic2@gmail.com') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    // Generate new article
    const article = await generateDailyArtDigest();
    
    return NextResponse.json({ article });
  } catch (error) {
    console.error('Error generating article:', error);
    return NextResponse.json(
      { error: 'Failed to generate article' },
      { status: 500 }
    );
  }
}

// DELETE handler to delete an article (admin only)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }
    
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user is admin
    if (user.email !== 'sanja.malovic2@gmail.com') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }
    
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