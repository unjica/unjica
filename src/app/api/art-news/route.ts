import { NextResponse } from 'next/server';
import { getArtNewsAgent } from '@/lib/agents/artNewsAgent';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '12');
    
    const agent = getArtNewsAgent();
    const newsData = await agent.getModernArtNews(page, pageSize);
    
    return NextResponse.json(newsData);
  } catch (error) {
    console.error('Error fetching art news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch art news' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; // Don't cache this route 