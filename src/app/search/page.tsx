'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { DigestArticleCard } from '@/components/ui/art-news/digest/DigestArticleCard';
import { DigestArticleCardSkeleton } from '@/components/ui/art-news/digest/DigestArticleCardSkeleton';
import { Sidebar } from '@/components/ui/Sidebar';
import { type GeneratedArticle } from '@/lib/agents/models/generatedArticle';
import { Search } from 'lucide-react';

interface SearchError {
  error: string;
  details?: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [articles, setArticles] = useState<GeneratedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<SearchError | null>(null);

  useEffect(() => {
    async function searchArticles() {
      if (!query) {
        setError({ error: 'Please enter a search query' });
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.details || data.error || 'Failed to search articles');
        }

        setArticles(data.articles || []);
      } catch (error) {
        console.error('Error searching articles:', error);
        setError({ 
          error: 'Failed to search articles',
          details: error instanceof Error ? error.message : 'Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    }

    searchArticles();
  }, [query]);

  return (
    <main className="min-h-screen py-6">
      <Container>
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Search Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">
                Search Results for "{query}"
              </h1>
              {!isLoading && (
                <p className="text-gray-400">
                  {articles.length > 0 
                    ? `Found ${articles.length} articles` 
                    : 'No articles found'}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-8">
                <p className="font-medium">{error.error}</p>
                {error.details && (
                  <p className="text-sm mt-1 opacity-80">{error.details}</p>
                )}
              </div>
            )}

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                // Show skeleton loaders while loading
                Array.from({ length: 6 }).map((_, index) => (
                  <DigestArticleCardSkeleton key={index} className="h-full" />
                ))
              ) : articles.length > 0 ? (
                articles.map((article) => (
                  <DigestArticleCard
                    key={article.id}
                    article={article}
                    className="h-full"
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
                  <p className="text-gray-400">
                    Try adjusting your search terms or browse our latest articles
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-80">
            <Sidebar />
          </div>
        </div>
      </Container>
    </main>
  );
} 