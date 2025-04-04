'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, Star, Info } from 'lucide-react';
import { type GeneratedArticle } from '@/lib/agents/models/generatedArticle';
import { getTopicSlug } from '@/lib/utils/topicMapper';

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className = '' }: SidebarProps) => {
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
  const [popularArticles, setPopularArticles] = useState<GeneratedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch trending topics and popular articles
    const fetchSidebarData = async () => {
      try {
        setIsLoading(true);
        // Fetch trending topics
        const topicsResponse = await fetch('/api/trending-topics');
        if (topicsResponse.ok) {
          const topicsData = await topicsResponse.json();
          setTrendingTopics(topicsData.topics || []);
        }

        // Fetch popular articles
        const articlesResponse = await fetch('/api/popular-articles');
        if (articlesResponse.ok) {
          const articlesData = await articlesResponse.json();
          setPopularArticles(articlesData.articles || []);
        }
      } catch (error) {
        console.error('Error fetching sidebar data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSidebarData();
  }, []);

  return (
    <aside className={`w-80 flex-shrink-0 ${className}`}>
      <div className="sticky top-24 space-y-6">
        {/* Trending Topics */}
        <div className="bg-[#1A1C2E] rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-[#4A6BF6]" />
            Trending Topics
          </h3>
          <div className="space-y-3">
            {isLoading ? (
              <div className="animate-pulse space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-700 rounded w-3/4" />
                ))}
              </div>
            ) : trendingTopics.length > 0 ? (
              trendingTopics.map((topic) => (
                <Link
                  key={topic}
                  href={`/topic/${topic.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {topic}
                </Link>
              ))
            ) : (
              <div className="flex items-center text-gray-400 text-sm">
                <Info className="h-4 w-4 mr-2" />
                <span>No trending topics yet</span>
              </div>
            )}
          </div>
        </div>

        {/* Popular Articles */}
        <div className="bg-[#1A1C2E] rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
            <Star className="h-5 w-5 mr-2 text-[#FFD700]" />
            Popular Articles
          </h3>
          <div className="space-y-4">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex space-x-3">
                    <div className="w-16 h-16 bg-gray-700 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-700 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : popularArticles.length > 0 ? (
              popularArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/category/${getTopicSlug(article.primaryTopic).toLowerCase()}/${article.slug || article.id}`}
                  className="block group"
                >
                  <div className="flex items-start space-x-3">
                    {article.imageUrl && (
                      <div className="flex-shrink-0 w-16 h-16 relative rounded-lg overflow-hidden">
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-300 group-hover:text-[#4A6BF6] transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex items-center text-gray-400 text-sm">
                <Info className="h-4 w-4 mr-2" />
                <span>No popular articles yet</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}; 