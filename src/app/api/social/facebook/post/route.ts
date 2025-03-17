import { NextResponse } from 'next/server';
import { FacebookService } from '@/lib/services/facebookService';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { articleId } = body;

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    // Fetch the article from the database
    const article = await prisma.generatedArticle.findUnique({
      where: { id: articleId }
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Format the article data for Facebook posting
    const formattedArticle = {
      id: article.id,
      title: article.title,
      content: article.content,
      summary: article.summary,
      imageUrl: article.imageUrl || undefined,
      slug: article.slug || undefined,
      publishedAt: article.publishedAt.toISOString(),
      lastUpdated: article.lastUpdated.toISOString(),
      primaryTopic: article.primaryTopic,
      tags: JSON.parse(article.tags),
      sourceNewsIds: JSON.parse(article.sourceNewsIds)
    };

    // Post to Facebook
    const facebookPostResult = await FacebookService.postToFacebookPage(formattedArticle);

    return NextResponse.json({
      status: 'OK',
      message: 'Successfully posted to Facebook',
      result: facebookPostResult
    });

  } catch (error) {
    console.error('Error posting to Facebook:', error);
    return NextResponse.json(
      {
        error: 'Failed to post to Facebook',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; 