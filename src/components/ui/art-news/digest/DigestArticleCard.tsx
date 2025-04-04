'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GeneratedArticle } from '@/lib/agents/models/generatedArticle';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';
import { getTopicSlug } from '@/lib/utils/topicMapper';

interface DigestArticleCardProps {
  article: GeneratedArticle;
  className?: string;
}

export const DigestArticleCard = ({ 
  article, 
  className = ''
}: DigestArticleCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { isAdmin, clearAuthData } = useAuth();
  
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  
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
        
        // If we've successfully deleted the article, redirect to digest homepage
        window.location.href = '/';
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`group relative bg-[#1A1C2E] rounded-xl overflow-hidden ${className}`}
    >
      <Link href={`/category/${getTopicSlug(article.primaryTopic).toLowerCase()}/${article.slug || article.id}`}>
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {article.imageUrl ? (
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#4A6BF6] to-[#6B4AF6]" />
          )}
          
          {/* AI Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-[#4A6BF6] text-white text-xs px-2 py-1 rounded-md">
              AI Generated
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
            {article.primaryTopic && (
              <span className="text-xs text-gray-400 px-2 py-1 bg-[#0A0C1C] rounded-full">
                {article.primaryTopic}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-white text-lg font-semibold mb-2 line-clamp-2 group-hover:text-[#4A6BF6] transition-colors">
            {article.title}
          </h3>

          {/* Date */}
          <div className="text-gray-400 text-sm">
            <span>{formattedDate}</span>
          </div>
        </div>
      </Link>
      
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