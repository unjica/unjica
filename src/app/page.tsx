'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Container } from '@/components/ui/Container';
import { DigestArticleCard } from '@/components/ui/art-news/digest/DigestArticleCard';
import { DigestArticleCardSkeleton } from '@/components/ui/art-news/digest/DigestArticleCardSkeleton';
import { FeaturedArticle } from '@/components/ui/art-news/FeaturedArticle';
import { FeaturedArticleSkeleton } from '@/components/ui/art-news/FeaturedArticleSkeleton';
import { Sidebar } from '@/components/ui/Sidebar';
import { type GeneratedArticle } from '@/lib/agents/models/generatedArticle';
import { supabase } from '@/lib/supabase';
import { AdminControls } from '@/components/ui/AdminControls';
import { FacebookService } from '@/lib/services/facebookService';

const ARTICLES_PER_PAGE = 6;

export default function Home() {
  const [articles, setArticles] = useState<GeneratedArticle[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<GeneratedArticle | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  // Get session and check if user is admin
  useEffect(() => {
    async function getSession() {
      const { data } = await supabase.auth.getSession();
      
      // Check if user is admin (email is sanja.malovic2@gmail.com)
      if (data.session?.user?.email === 'sanja.malovic2@gmail.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      
      // Set up auth state listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session?.user?.email === 'sanja.malovic2@gmail.com') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        }
      );
      
      return () => {
        authListener?.subscription.unsubscribe();
      };
    }
    
    getSession();
  }, []);
  
  // Load more articles when scrolling to bottom
  const loadMoreArticles = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const params = new URLSearchParams({
        limit: ARTICLES_PER_PAGE.toString(),
        ...(nextCursor && { cursor: nextCursor }),
        ...(selectedTopic && { topic: selectedTopic })
      });

      const response = await fetch(`/api/art-digest?${params}`);
      if (!response.ok) throw new Error('Failed to load more articles');
      
      const data = await response.json();
      const newArticles = data.articles || [];
      
      setArticles(prev => [...prev, ...newArticles]);
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Error loading more articles:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [nextCursor, selectedTopic, isLoadingMore, hasMore]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isLoadingMore) {
          loadMoreArticles();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadMoreArticles, hasMore, isLoadingMore]);
  
  // Load initial articles
  useEffect(() => {
    async function loadArticles() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          limit: ARTICLES_PER_PAGE.toString(),
          ...(selectedTopic && { topic: selectedTopic })
        });

        const response = await fetch(`/api/art-digest?${params}`);
        if (!response.ok) throw new Error('Failed to load articles');
        
        const data = await response.json();
        const fetchedArticles = data.articles || [];
        
        setArticles(fetchedArticles);
        setNextCursor(data.nextCursor);
        setHasMore(data.hasMore);
        
        // Set featured article (most recent)
        if (fetchedArticles.length > 0) {
          setFeaturedArticle(fetchedArticles[0]);
        }
      } catch (error) {
        console.error('Error loading articles:', error);
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadArticles();
    
    // Set up polling for new articles
    const interval = setInterval(async () => {
      try {
        const params = new URLSearchParams({
          limit: ARTICLES_PER_PAGE.toString(),
          ...(selectedTopic && { topic: selectedTopic })
        });

        const response = await fetch(`/api/art-digest?${params}`);
        if (!response.ok) return;
        
        const data = await response.json();
        const fetchedArticles = data.articles || [];
        
        // Only update if we have new articles
        if (fetchedArticles.length > 0 && (!articles.length || fetchedArticles[0].id !== articles[0].id)) {
          setArticles(fetchedArticles);
          setNextCursor(data.nextCursor);
          setHasMore(data.hasMore);
          setFeaturedArticle(fetchedArticles[0]);
        }
      } catch (error) {
        console.error('Error polling for new articles:', error);
      }
    }, 60000); // Poll every minute
    
    return () => clearInterval(interval);
  }, [selectedTopic]);
  
  // Function to manually generate a new digest
  const handleGenerateDigest = async () => {
    setIsGenerating(true);
    
    try {
      // Get the session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to generate a digest');
      }
      
      // Use the POST endpoint to generate a new article
      const response = await fetch('/api/art-digest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate digest');
      }
      
      // Refresh articles from the API
      const articlesResponse = await fetch('/api/art-digest');
      if (!articlesResponse.ok) {
        throw new Error('Failed to refresh articles');
      }
      
      const articlesData = await articlesResponse.json();
      const fetchedArticles = articlesData.articles || [];
      
      setFeaturedArticle(fetchedArticles[0]);
      
      // Filter articles based on selected topic
      const filteredArticles = selectedTopic 
        ? fetchedArticles.filter((article: GeneratedArticle) => article.primaryTopic === selectedTopic)
        : fetchedArticles;
      
      setArticles(filteredArticles.slice(0, ARTICLES_PER_PAGE));
      setNextCursor(articlesData.nextCursor);
      setHasMore(articlesData.hasMore);

      try {
        // Post to facebook
        await FacebookService.postToFacebookPage(fetchedArticles[0]);
      } catch (error) {
        console.error('Error posting to Facebook:', error);
      }
    } catch (error) {
      // Silent error handling
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <>
      <main className="min-h-screen py-6">
        <Container>
          {/* Admin Controls - only visible to admins */}
          {isAdmin && (
            <div className="mb-6">
              <AdminControls generateDigest={handleGenerateDigest} isGenerating={isGenerating} />
            </div>
          )}
          
          {/* Featured Article */}
          {isLoading ? (
            <div className="mb-8">
              <FeaturedArticleSkeleton />
            </div>
          ) : featuredArticle && (
            <div className="mb-8">
              <FeaturedArticle article={featuredArticle} />
            </div>
          )}
          
          {/* Main Content Grid */}
          <div className="flex gap-8">
            {/* Articles Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                  // Show skeleton loaders while loading
                  Array.from({ length: ARTICLES_PER_PAGE }).map((_, index) => (
                    <DigestArticleCardSkeleton key={index} className="h-full" />
                  ))
                ) : (
                  articles.map((article) => (
                    <DigestArticleCard
                      key={article.id}
                      article={article}
                      className="h-full"
                    />
                  ))
                )}
              </div>
              
              {/* Infinite Scroll Trigger */}
              <div ref={loadMoreRef} className="mt-8">
                {isLoadingMore && (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4A6BF6]"></div>
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
    </>
  );
}
