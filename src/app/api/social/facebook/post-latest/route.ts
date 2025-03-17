import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Find the most recent article
    const latestArticle = await prisma.generatedArticle.findFirst({
      orderBy: {
        publishedAt: 'desc'
      }
    });

    if (!latestArticle) {
      return NextResponse.json({ error: 'No articles found' }, { status: 404 });
    }

    // Post to Facebook
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/social/facebook/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ articleId: latestArticle.id })
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error posting latest article to Facebook:', error);
    return NextResponse.json(
      { error: 'Failed to post to Facebook' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; 