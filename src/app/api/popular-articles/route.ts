import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface Reaction {
  type: 'like' | 'dislike';
}

export async function GET() {
  try {
    // Get articles from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: articles, error } = await supabase
      .from('generated_articles')
      .select(`
        *,
        reactions (
          type
        )
      `)
      .gte('publishedAt', thirtyDaysAgo.toISOString())
      .order('publishedAt', { ascending: false });

    if (error) {
      throw error;
    }

    // Calculate popularity score based on likes and views
    const articlesWithScore = articles.map(article => {
      const likes = article.reactions?.filter((r: Reaction) => r.type === 'like').length || 0;
      const views = article.views || 0;
      const score = likes * 2 + views; // Weight likes more heavily than views
      return { ...article, score };
    });

    // Sort by score and get top 5
    const popularArticles = articlesWithScore
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    return NextResponse.json({ articles: popularArticles });
  } catch (error) {
    console.error('Error fetching popular articles:', error);
    return NextResponse.json({ articles: [] }, { status: 500 });
  }
} 