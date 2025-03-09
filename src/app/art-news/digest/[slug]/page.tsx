'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { DigestArticleCard } from '@/components/ui/art-news/digest/DigestArticleCard';
import { type GeneratedArticle } from '@/lib/agents/models/generatedArticle';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ArticlePageProps {
  params: { slug: string } | Promise<{ slug: string }>;
}

export default function ArticleDetailPage({ params }: ArticlePageProps) {
  const [article, setArticle] = useState<GeneratedArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  // Determine how to access the slug based on params type
  const slug = params instanceof Promise ? React.use(params).slug : params.slug;
  
  useEffect(() => {
    async function loadArticle() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/art-digest?slug=${slug}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Article not found');
          } else {
            setError('Failed to load article');
          }
          return;
        }
        
        const data = await response.json();
        if (data.article) {
          setArticle(data.article);
          // Update document title when article loads
          document.title = `${data.article.title} | AI Art Digest`;
        } else {
          setError('Article not found');
        }
      } catch (error) {
        console.error('Failed to load article:', error);
        setError('Failed to load article');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadArticle();
  }, [slug]); // Updated to use the unwrapped slug
  
  return (
    <main className="py-16">
      <Container>
        <div className="mb-8">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to all articles
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {error}
            </p>
            <Button onClick={() => router.push('/art-news/digest')}>
              Return to Digest
            </Button>
          </div>
        ) : article ? (
          <DigestArticleCard 
            article={article} 
            isExpanded={true}
            isFullPage={true}
          />
        ) : null}
      </Container>
    </main>
  );
} 