import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    // Search in the generatedArticle table
    const articles = await prisma.generatedArticle.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { summary: { contains: query, mode: 'insensitive' } },
          { primaryTopic: { contains: query, mode: 'insensitive' } }
        ]
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: 20
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error in search route:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 