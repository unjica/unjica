'use client';

import { useEffect, useState } from 'react';
import { GeneratedArticle } from '@/lib/agents/models/generatedArticle';
import { DigestArticleView } from '@/components/ui/art-news/digest/DigestArticleView';
import { Share2, Twitter, Facebook, Linkedin, Link } from 'lucide-react';

interface ArticleClientProps {
  category: string;
  slug: string;
}

export default function ArticleClient({ slug, category }: ArticleClientProps) {
  const [article, setArticle] = useState<GeneratedArticle | null>(null);
  const [similarArticles, setSimilarArticles] = useState<GeneratedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const articleUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/category/${category}/${slug}`
    : '';

  const handleShare = async (platform: string) => {
    if (!article) return;

    const shareUrl = encodeURIComponent(articleUrl);
    const title = encodeURIComponent(article.title);

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${title}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${title}`, '_blank');
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(articleUrl);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
        break;
    }
    setShowShareMenu(false);
  };

  useEffect(() => {
    async function fetchArticle() {
      try {
        const response = await fetch(`/api/art-digest?slug=${slug}&category=${category}`);
        if (!response.ok) {
          throw new Error('Failed to fetch article');
        }
        const data = await response.json();
        setArticle(data.article);
        
        // Fetch similar articles based on primary topic
        if (data.article?.primaryTopic) {
          const similarResponse = await fetch(`/api/art-digest?topic=${encodeURIComponent(data.article.primaryTopic)}&limit=3`);
          if (similarResponse.ok) {
            const similarData = await similarResponse.json();
            // Filter out the current article from similar articles
            const filteredSimilar = similarData.articles.filter(
              (a: GeneratedArticle) => a.slug !== slug
            );
            setSimilarArticles(filteredSimilar);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article');
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [slug, category]);

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
      <div className="max-w-4xl mx-auto">
        {/* Share Button */}
        <div className="relative mb-8">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors"
          >
            <Share2 className="w-5 h-5" />
            Share
          </button>

          {/* Share Menu */}
          {showShareMenu && (
            <div className="absolute top-full left-0 mt-2 bg-gray-800 rounded-lg shadow-lg z-50">
              <div className="p-2">
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex items-center gap-2 w-full px-4 py-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                  Twitter
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex items-center gap-2 w-full px-4 py-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                  Facebook
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="flex items-center gap-2 w-full px-4 py-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                  LinkedIn
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="flex items-center gap-2 w-full px-4 py-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Link className="w-5 h-5" />
                  {copySuccess ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          )}
        </div>

        <DigestArticleView article={article} />
      </div>
      
      {/* Similar Articles Section */}
      {similarArticles.length > 0 && (
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-white mb-8">Similar Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarArticles.map((similarArticle) => (
              <div key={similarArticle.id} className="bg-gray-800 rounded-lg overflow-hidden">
                {similarArticle.imageUrl && (
                  <img
                    src={similarArticle.imageUrl}
                    alt={similarArticle.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    <a href={`/category/${category}/${similarArticle.slug}`} className="hover:text-blue-400">
                      {similarArticle.title}
                    </a>
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{similarArticle.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 