'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GradientText } from '../../GradientText';
import { Button } from '../../Button';
import { GeneratedArticle } from '@/lib/agents/models/generatedArticle';
import Image from 'next/image';
import Link from 'next/link';
import { LikeDislikeButton } from '../LikeDislikeButton';
import { CommentSection } from '../CommentSection';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

interface DigestArticleCardProps {
  article: GeneratedArticle;
  className?: string;
  isExpanded?: boolean;
  isFullPage?: boolean;
}

export const DigestArticleCard = ({ 
  article, 
  className = '',
  isExpanded = false,
  isFullPage = false
}: DigestArticleCardProps) => {
  const [expanded, setExpanded] = useState(isExpanded);
  const [imageError, setImageError] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const { session, isAdmin, clearAuthData } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Fetch reaction counts when component mounts
    fetchReactionCounts();
  }, [article.id]);
  
  // Fetch reaction counts
  async function fetchReactionCounts() {
    try {
      const response = await fetch(`/api/reactions?articleId=${article.id}`);
      if (response.ok) {
        const data = await response.json();
        setLikesCount(data.likesCount || 0);
        setDislikesCount(data.dislikesCount || 0);
      }
    } catch (error) {
      console.error('Failed to fetch reaction counts:', error);
    }
  }
  
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Use slug for the article URL if available, otherwise fall back to ID
  const articleUrl = article.slug 
    ? `/art-news/digest/${article.slug}` 
    : `/art-news/digest/${article.id}`;
  
  // Handle article deletion (admin only)
  const handleDeleteArticle = async () => {
    if (!isAdmin) return;
    
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this article? This action cannot be undone and will remove all associated comments and reactions.'
    );
    
    if (!confirmDelete) return;
    
    try {
      setIsDeleting(true);
      
      // Get the session token for authorization
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (!data.session) {
          throw new Error('You must be logged in to delete an article');
        }
        
        const response = await fetch(`/api/art-digest?id=${article.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${data.session.access_token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete article');
        }
        
        // If we've successfully deleted the article, redirect to digest homepage if on article page
        if (isFullPage) {
          router.push('/art-news/digest');
        } else {
          // For articles on the main digest page, we could trigger a refresh but the parent will handle that
          if (window.location.pathname === '/art-news/digest') {
            window.location.reload();
          }
        }
      } catch (error) {
        // Handle token errors
        console.error('Error deleting article:', error);
        
        // If there's an error with the token, sign out and clear data
        if (error instanceof Error && error.message.includes('Refresh Token')) {
          clearAuthData();
          await supabase.auth.signOut();
          window.location.href = '/login?error=session_expired';
        } else {
          alert('Failed to delete article. Please try again.');
          setIsDeleting(false);
        }
      }
    } catch (error) {
      alert('Failed to delete article. Please try again.');
      setIsDeleting(false);
    }
  };
  
  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {article.imageUrl && !imageError && (
        <div className="relative w-full h-64 md:h-80">
          <Image 
            src={article.imageUrl}
            alt={article.title}
            width={1200}
            height={630}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            priority
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <span className="text-xs font-semibold bg-blue-600 text-white px-2 py-1 rounded-full">
              AI Generated Digest
            </span>
            <h3 className="text-2xl md:text-3xl font-bold mt-2 text-white">
              {article.title}
            </h3>
            <div className="flex flex-wrap gap-1 mt-2">
              {Array.isArray(article.tags) 
                ? article.tags.slice(0, 3).map((tag) => (
                    <span 
                      key={tag} 
                      className="text-xs px-2 py-1 bg-white/20 rounded-full backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))
                : null
              }
            </div>
          </div>
        </div>
      )}
      
      <div className="p-6">
        {(!article.imageUrl || imageError) && (
          <>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                AI Generated Digest
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formattedDate}
              </span>
            </div>
            
            <h3 className="text-2xl font-bold mb-3">
              <GradientText>{article.title}</GradientText>
            </h3>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {Array.isArray(article.tags) 
                ? article.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))
                : null
              }
            </div>
          </>
        )}
        
        {article.imageUrl && !imageError && (
          <span className="text-xs text-gray-500 dark:text-gray-400 block mb-4">
            {formattedDate}
          </span>
        )}
        
        {!expanded ? (
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-300">
              {article.summary}
            </p>
          </div>
        ) : (
          <div className="mb-4 prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ 
              __html: article.content
                .replace(/^# .*/gm, '') // Remove the main title
                .replace(/^## (.*)/gm, '<h2>$1</h2>') // Convert markdown h2 to HTML
                .replace(/^### (.*)/gm, '<h3>$1</h3>') // Convert markdown h3 to HTML
                .replace(/\n\n/g, '<br/><br/>') // Convert double linebreaks to HTML breaks
            }} />
          </div>
        )}
        
        <div className="flex justify-between items-center py-3 border-t border-gray-100 dark:border-gray-700">
          <LikeDislikeButton 
            articleId={article.id}
            initialLikes={likesCount}
            initialDislikes={dislikesCount}
          />
          
          {article.sourceNewsIds.length > 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Based on {article.sourceNewsIds.length} news sources
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center pt-2">
          {isFullPage ? (
            <div />
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? 'Show Less' : 'Read Full Article'}
              </Button>
              
              <Link 
                href={articleUrl}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                View Full Article
              </Link>
            </>
          )}
        </div>
      </div>
      
      {/* Only show comments on the full page view */}
      {isFullPage && (
        <div className="px-6 pb-6">
          <CommentSection articleId={article.id} />
        </div>
      )}
      
      {/* Admin delete button */}
      {isAdmin && (
        <div className="mt-4 p-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={handleDeleteArticle}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700 font-medium flex items-center px-3 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            aria-label="Delete article"
            title="Delete article"
          >
            {isDeleting ? (
              <span>Deleting...</span>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Article
              </>
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
}; 