import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateHourlyArtDigest } from '@/lib/actions/artDigestActions';
import { Prisma } from '@prisma/client';
import { auth } from 'auth';

// This helps TypeScript recognize the additional fields
type GeneratedArticleWithExtras = Prisma.GeneratedArticleGetPayload<{}> & {
  imageUrl?: string | null;
  slug?: string | null;
};

// GET handler to fetch all articles
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    
    // If ID or slug is provided, fetch a specific article
    if (id || slug) {
      let article;
      
      if (id) {
        article = await prisma.generatedArticle.findUnique({
          where: { id }
        });
      } else if (slug) {
        // Use findFirst with a more TypeScript-friendly approach
        article = await prisma.generatedArticle.findFirst({
          where: {
            // Using a type assertion to help TypeScript understand our schema
            slug: slug
          } as any
        });
      }
      
      if (!article) {
        return NextResponse.json(
          { error: 'Article not found' },
          { status: 404 }
        );
      }
      
      // Cast to our extended type to access all fields
      const typedArticle = article as GeneratedArticleWithExtras;
      
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
    const dbArticles = await prisma.generatedArticle.findMany({
      orderBy: {
        publishedAt: 'desc'
      },
      take: 50
    });
    
    const articles = dbArticles.map(dbArticle => {
      // Cast to our extended type to access all fields
      const typedArticle = dbArticle as GeneratedArticleWithExtras;
      
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
    });
    
    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

// POST handler to generate a new article
export async function POST() {
  try {
    const article = await generateHourlyArtDigest();
    
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
    const session = await auth();
    
    // Check if user is authenticated and is an admin
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
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