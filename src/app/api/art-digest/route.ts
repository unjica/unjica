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
          tags: JSON.parse(typedArticle.tags),
          publishedAt: typedArticle.publishedAt.toISOString(),
          sourceNewsIds: JSON.parse(typedArticle.sourceNewsIds),
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
            tags: JSON.parse(typedArticle.tags),
            publishedAt: typedArticle.publishedAt.toISOString(),
            sourceNewsIds: JSON.parse(typedArticle.sourceNewsIds),
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
      return NextResponse.json(
        { error: 'Database error when fetching all articles', details: dbError instanceof Error ? dbError.message : String(dbError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
    console.error('Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: 'Failed to fetch articles', details: error instanceof Error ? error.message : String(error) },
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
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user || user.email !== 'sanja.malovic2@gmail.com') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }
    
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
      } as Prisma.GeneratedArticleCreateInput
    });
    
    return NextResponse.json({ article, success: true });
  } catch (error) {
    console.error('Failed to generate article:', error);
    return NextResponse.json(
      { error: 'Failed to generate article' },
      { status: 500 }
    );
  }
}

// DELETE handler to delete an article (admin only)
export async function DELETE(request: Request) {
  try {
    // Get the session from Supabase
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
    
    if (error || !user || user.email !== 'sanja.malovic2@gmail.com') {
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
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}

// Make this API route dynamic to avoid caching
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 1 minute max execution time (Vercel Hobby plan limit) 