'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '../Button';
import { 
  getAnonymousId, 
  trackAnonymousReaction, 
  getAnonymousReaction 
} from '@/lib/anonymousUser';

type ReactionType = 'LIKE' | 'DISLIKE';

interface LikeDislikeButtonProps {
  articleId: string;
  initialLikes?: number;
  initialDislikes?: number;
  initialUserReaction?: ReactionType | null;
  onReactionChange?: (type: ReactionType | null) => void;
}

export function LikeDislikeButton({ 
  articleId, 
  initialLikes = 0, 
  initialDislikes = 0,
  initialUserReaction = null,
  onReactionChange
}: LikeDislikeButtonProps) {
  const { data: session } = useSession();
  const [userReaction, setUserReaction] = useState<ReactionType | null>(initialUserReaction);
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [isLoading, setIsLoading] = useState(false);
  const [anonymousId, setAnonymousId] = useState<string>('');
  const [apiError, setApiError] = useState<string | null>(null);

  // Initialize state on component mount
  useEffect(() => {
    // Get counts regardless of user state
    fetchReactionCounts();
    
    // Initialize anonymous ID if needed
    if (!session?.user?.id) {
      const anonId = getAnonymousId();
      setAnonymousId(anonId);
      
      // Check if this anonymous user already has a reaction from local storage
      const existingReaction = getAnonymousReaction(articleId, null) as ReactionType | null;
      if (existingReaction) {
        setUserReaction(existingReaction);
      }
    }
  }, [session?.user?.id, articleId]);

  // Fetch user-specific reaction if logged in
  useEffect(() => {
    if (session?.user?.id && !initialUserReaction) {
      fetchUserReaction();
    }
  }, [session?.user?.id, articleId, initialUserReaction]);

  // Fetch reaction counts without user-specific data
  async function fetchReactionCounts() {
    try {
      setApiError(null);
      const response = await fetch(`/api/reactions?articleId=${articleId}`);
      if (response.ok) {
        const data = await response.json();
        setLikes(data.likesCount || 0);
        setDislikes(data.dislikesCount || 0);
      } else {
        // Handle non-OK responses
        const errorData = await response.json();
        console.error('Error fetching reaction counts:', errorData);
        setApiError('Failed to load reactions. Please try again later.');
      }
    } catch (error) {
      console.error('Failed to fetch reaction counts:', error);
      setApiError('Network error. Please try again later.');
    }
  }

  async function fetchUserReaction() {
    try {
      setApiError(null);
      const response = await fetch(`/api/reactions?articleId=${articleId}`);
      if (response.ok) {
        const data = await response.json();
        setUserReaction(data.userReaction?.type || null);
        // Also update counts while we're at it
        setLikes(data.likesCount || 0);
        setDislikes(data.dislikesCount || 0);
      } else {
        // Handle non-OK responses
        const errorData = await response.json();
        console.error('Error fetching user reaction:', errorData);
      }
    } catch (error) {
      console.error('Failed to fetch user reaction:', error);
    }
  }

  async function handleReaction(type: ReactionType) {
    setIsLoading(true);
    setApiError(null);
    
    try {
      // If user clicks the same reaction again, remove it
      const newReactionType = userReaction === type ? null : type;
      
      if (session?.user?.id) {
        // Authenticated user flow
        const response = await fetch('/api/reactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            articleId,
            type: newReactionType,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          
          // Update local state with new counts
          setLikes(data.likesCount);
          setDislikes(data.dislikesCount);
          setUserReaction(newReactionType);
          
          // Callback for parent components
          if (onReactionChange) {
            onReactionChange(newReactionType);
          }
        } else {
          // Handle error response
          const errorData = await response.json();
          setApiError(errorData.error || 'Failed to update reaction');
        }
      } else if (anonymousId) {
        // Anonymous user flow
        
        // First, update local storage to track this reaction
        trackAnonymousReaction(articleId, null, newReactionType);
        
        // Optimistically update the UI
        setUserReaction(newReactionType);
        
        // The increment/decrement logic
        setLikes(prev => {
          let count = prev;
          
          // First undo previous reaction if any
          if (userReaction === 'LIKE') count--;
          
          // Then apply new reaction if any
          if (newReactionType === 'LIKE') count++;
          
          return count;
        });
        
        setDislikes(prev => {
          let count = prev;
          
          // First undo previous reaction if any  
          if (userReaction === 'DISLIKE') count--;
          
          // Then apply new reaction if any
          if (newReactionType === 'DISLIKE') count++;
          
          return count;
        });
        
        // Then perform API call to persist the change
        try {
          const response = await fetch('/api/reactions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              articleId,
              type: newReactionType,
              anonymousId,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            
            // Update local state with accurate counts from server
            setLikes(data.likesCount);
            setDislikes(data.dislikesCount);
            
            // Callback for parent components
            if (onReactionChange) {
              onReactionChange(newReactionType);
            }
          } else {
            // Handle error response
            const errorData = await response.json();
            console.error('Error updating reaction:', errorData);
            setApiError(errorData.error || 'Failed to update reaction');
            
            // Since API call failed, revert to local storage state
            const existingReaction = getAnonymousReaction(articleId, null) as ReactionType | null;
            setUserReaction(existingReaction);
            
            // Refresh counts to ensure accuracy
            fetchReactionCounts();
          }
        } catch (error) {
          console.error('Failed to update reaction:', error);
          setApiError('Network error. Please try again.');
          
          // Re-fetch counts to ensure accuracy
          fetchReactionCounts();
        }
      }
    } catch (error) {
      console.error('Failed to handle reaction:', error);
      setApiError('An unexpected error occurred');
      // Refresh counts to ensure accuracy
      fetchReactionCounts();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleReaction('LIKE')}
          disabled={isLoading}
          className={`flex items-center space-x-1 ${userReaction === 'LIKE' ? 'bg-blue-600 text-white' : ''}`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M7 10v12" />
            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
          </svg>
          <span>{likes}</span>
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleReaction('DISLIKE')}
          disabled={isLoading}
          className={`flex items-center space-x-1 ${userReaction === 'DISLIKE' ? 'bg-blue-600 text-white' : ''}`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M17 14V2" />
            <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
          </svg>
          <span>{dislikes}</span>
        </Button>
      </div>
      
      {apiError && (
        <div className="text-xs text-red-500 mt-1">{apiError}</div>
      )}
    </div>
  );
} 