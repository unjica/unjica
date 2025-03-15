'use client';

import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { DigestArticleCard } from '@/components/ui/art-news/digest/DigestArticleCard';
import { type GeneratedArticle } from '@/lib/agents/models/generatedArticle';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ArticleClientProps {
  slug: string;
}

export default function ArticleClient({ slug }: ArticleClientProps) {
  const [article, setArticle] = useState<GeneratedArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    async function loadArticle() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/art-digest?slug=${slug}`);
        if (!response.ok) {
          throw new Error('Failed to load article');
        }
        const data = await response.json();
        setArticle(data.article);
      } catch (err) {
        console.error('Error loading article:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadArticle();
  }, [slug]);

  return (
    <Container className="py-8">
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/art-news/digest')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Digest
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Article</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Link href="/art-news/digest">
            <Button>Return to Digest</Button>
          </Link>
        </div>
      ) : article ? (
        <DigestArticleCard 
          article={article} 
          isExpanded={true}
          isFullPage={true}
        />
      ) : null}
    </Container>
  );
} 