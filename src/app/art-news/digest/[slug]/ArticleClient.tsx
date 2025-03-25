'use client';

import { useEffect, useState } from 'react';
import { GeneratedArticle } from '@/lib/agents/models/generatedArticle';
import { DigestArticleView } from '@/components/ui/art-news/digest/DigestArticleView';

interface ArticleClientProps {
  slug: string;
}

export default function ArticleClient({ slug }: ArticleClientProps) {
  const [article, setArticle] = useState<GeneratedArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const response = await fetch(`/api/art-digest?slug=${slug}`);
        if (!response.ok) {
          throw new Error('Failed to fetch article');
        }
        const data = await response.json();
        setArticle(data.article);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article');
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-[60vh] min-h-[400px] bg-gray-700 rounded-xl mb-8" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-700 rounded w-1/2" />
              <div className="h-4 bg-gray-700 rounded w-2/3" />
              <div className="h-4 bg-gray-700 rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Article Not Found</h1>
          <p className="text-gray-400">The article you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <DigestArticleView article={article} />
    </div>
  );
} 