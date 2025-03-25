'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { DigestArticleCard } from '@/components/ui/art-news/digest/DigestArticleCard';
import { DigestArticleCardSkeleton } from '@/components/ui/art-news/digest/DigestArticleCardSkeleton';
import { Sidebar } from '@/components/ui/Sidebar';
import { type GeneratedArticle } from '@/lib/agents/models/generatedArticle';
import { categories } from '@/lib/types/categories';
import Link from 'next/link';
import { 
  Palette, 
  Camera, 
  Building2, 
  Users, 
  Image as ImageIcon, 
  GalleryVerticalEnd,
  Calendar
} from 'lucide-react';

// Map categories to their icons and colors
const categoryStyles = {
  'Contemporary': { icon: Palette, color: 'from-blue-500/20 to-purple-500/20' },
  'Exhibitions': { icon: Calendar, color: 'from-green-500/20 to-emerald-500/20' },
  'Painting': { icon: ImageIcon, color: 'from-orange-500/20 to-red-500/20' },
  'Artists': { icon: Users, color: 'from-pink-500/20 to-rose-500/20' },
  'Photography': { icon: Camera, color: 'from-cyan-500/20 to-blue-500/20' },
  'Museums': { icon: Building2, color: 'from-yellow-500/20 to-amber-500/20' },
  'Gallery': { icon: GalleryVerticalEnd, color: 'from-violet-500/20 to-purple-500/20' },
};

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;
  const [articles, setArticles] = useState<GeneratedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Find the category based on the slug
  const category = categories.find(cat => cat.slug === categorySlug);

  useEffect(() => {
    async function fetchCategoryArticles() {
      if (!category) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/art-digest?topic=${encodeURIComponent(category.primaryTopic)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }

        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error('Error fetching category articles:', error);
        setError('Failed to load articles. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategoryArticles();
  }, [category]);

  return (
    <main className="min-h-screen py-6">
      <Container>
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {category ? (
              <>
                {/* Category Header */}
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    {category.name} Articles
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
                    {error}
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
                      <h3 className="text-xl font-semibold text-white mb-2">No articles found</h3>
                      <p className="text-gray-400">
                        Check back later for articles in this category
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Categories Header */}
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    Category Not Found
                  </h1>
                  <p className="text-gray-400">
                    The category "{categorySlug}" doesn't exist. Browse our available categories below:
                  </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((cat) => {
                    const Icon = categoryStyles[cat.name as keyof typeof categoryStyles].icon;
                    const gradient = categoryStyles[cat.name as keyof typeof categoryStyles].color;
                    
                    return (
                      <Link
                        key={cat.slug}
                        href={cat.href}
                        className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-[#1A1C2E] to-[#242638] p-6 hover:from-[#242638] hover:to-[#2A2D42] transition-all duration-300 border border-white/5"
                      >
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} shadow-lg`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">
                              {cat.name}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-400">
                            Browse {cat.name.toLowerCase()} articles
                          </p>
                        </div>
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
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