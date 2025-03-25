'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GeneratedArticle } from '@/lib/agents/models/generatedArticle';
import Image from 'next/image';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';
import { CommentSection } from '@/components/ui/art-news/CommentSection';

interface DigestArticleViewProps {
  article: GeneratedArticle;
}

interface ReactionsState {
  likes: number;
  dislikes: number;
  userReaction: {
    type: 'LIKE' | 'DISLIKE';
    id: string;
    userId: string;
    articleId: string;
    createdAt: string;
  } | null;
}

export const DigestArticleView = ({ article }: DigestArticleViewProps) => {
  const [reactions, setReactions] = useState<ReactionsState>({ likes: 0, dislikes: 0, userReaction: null });
  const [isReacting, setIsReacting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isAdmin, clearAuthData, user } = useAuth();
  
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Fetch reactions
  const fetchReactions = async () => {
    try {
      const response = await fetch(`/api/reactions?articleId=${article.id}`);
      if (response.ok) {
        const data = await response.json();
        setReactions({
          likes: data.likesCount || 0,
          dislikes: data.dislikesCount || 0,
          userReaction: data.userReaction || null
        });
      }
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchReactions();
  }, [article.id]);

  // Handle reaction
  const handleReaction = async (type: 'LIKE' | 'DISLIKE') => {
    if (!user || isReacting) return;

    try {
      setIsReacting(true);
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      if (!data.session) throw new Error('Not authenticated');

      const response = await fetch('/api/reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.session.access_token}`
        },
        body: JSON.stringify({
          articleId: article.id,
          type
        })
      });

      if (!response.ok) throw new Error('Failed to update reaction');

      // Refetch reactions to get the latest state
      await fetchReactions();
    } catch (error) {
      console.error('Error updating reaction:', error);
      if (error instanceof Error && error.message.includes('Refresh Token')) {
        clearAuthData();
        await supabase.auth.signOut();
        window.location.href = '/login?error=session_expired';
      }
    } finally {
      setIsReacting(false);
    }
  };

  // Handle article deletion (admin only)
  const handleDeleteArticle = async () => {
    if (!isAdmin) return;
    
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this article? This action cannot be undone and will remove all associated comments and reactions.'
    );
    
    if (!confirmDelete) return;
    
    try {
      setIsDeleting(true);
      
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        if (!data.session) throw new Error('You must be logged in to delete an article');
        
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
        
        window.location.href = '/';
      } catch (error) {
        console.error('Error deleting article:', error);
        
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
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto rounded-xl overflow-hidden"
    >
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full">
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#4A6BF6] to-[#6B4AF6]" />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C2E] via-[#1A1C2E]/80 to-transparent" />
        
        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-[#4A6BF6] text-white text-xs px-3 py-1 rounded-full">
              AI Generated
            </span>
            {article.primaryTopic && (
              <span className="bg-[#0A0C1C] text-gray-300 text-xs px-3 py-1 rounded-full">
                {article.primaryTopic}
              </span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {article.title}
          </h1>
          
          <div className="flex items-center gap-4 text-gray-300">
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="px-2 -mt-10">
        <div className="prose prose-invert max-w-none">
          <div 
            className="text-gray-300 leading-relaxed [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mt-12 [&>h2]:mb-6 [&>h3]:text-2xl [&>h3]:font-semibold [&>h3]:text-white [&>h3]:mt-8 [&>h3]:mb-4 [&>p]:mb-6 [&>p]:text-gray-300 [&>p]:leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: article.content 
                ? article.content
                  .replace(/^# .*/gm, '') // Remove the main title
                  .replace(/^## (.*)/gm, '<h2>$1</h2>') // Convert markdown h2 to HTML
                  .replace(/^### (.*)/gm, '<h3>$1</h3>') // Convert markdown h3 to HTML
                  .replace(/\n\n/g, '<br/><br/>') // Convert double linebreaks to HTML breaks
                : 'Content not available' }}
          />
        </div>

        {/* Reactions and Actions */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleReaction('LIKE')}
                disabled={isReacting || !user}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                  reactions.userReaction?.type === 'LIKE'
                    ? 'bg-[#4A6BF6] text-white'
                    : 'bg-[#0A0C1C] text-gray-400 hover:bg-[#2A2C3E]'
                } ${isReacting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isReacting ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ThumbsUp className="w-5 h-5" />
                )}
                <span className="font-medium">{reactions.likes || 0}</span>
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleReaction('DISLIKE')}
                disabled={isReacting || !user}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                  reactions.userReaction?.type === 'DISLIKE'
                    ? 'bg-red-500 text-white'
                    : 'bg-[#0A0C1C] text-gray-400 hover:bg-[#2A2C3E]'
                } ${isReacting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isReacting ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ThumbsDown className="w-5 h-5" />
                )}
                <span className="font-medium">{reactions.dislikes || 0}</span>
              </button>
            </div>
          </div>
          {!user && (
            <p className="mt-4 text-sm text-gray-400">
              Please log in to react to articles
            </p>
          )}
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <CommentSection articleId={article.id} />
        </div>
      </div>

      {/* Admin Actions */}
      {isAdmin && (
        <div className="p-8 border-t border-gray-700">
          <button
            onClick={handleDeleteArticle}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700 font-medium flex items-center px-4 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
    </motion.article>
  );
}; 