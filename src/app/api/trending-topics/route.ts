import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get articles from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: articles, error } = await supabase
      .from('generated_articles')
      .select('primaryTopic')
      .gte('publishedAt', sevenDaysAgo.toISOString())
      .order('publishedAt', { ascending: false });

    if (error) {
      throw error;
    }

    // Count topic occurrences
    const topicCounts = articles.reduce((acc: { [key: string]: number }, article) => {
      if (article.primaryTopic) {
        acc[article.primaryTopic] = (acc[article.primaryTopic] || 0) + 1;
      }
      return acc;
    }, {});

    // Sort topics by count and get top 5
    const trendingTopics = Object.entries(topicCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([topic]) => topic);

    return NextResponse.json({ topics: trendingTopics });
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    return NextResponse.json({ topics: [] }, { status: 500 });
  }
} 