'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
// Create a simple Avatar component since we don't have access to the actual one
interface AvatarProps {
  src?: string;
  fallback: string;
  size: 'xs' | 'sm' | 'md' | 'lg';
}

function Avatar({ src, fallback, size }: AvatarProps) {
  const sizeClass = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  }[size];

  return src ? (
    <img src={src} alt="User avatar" className={`${sizeClass} rounded-full object-cover`} />
  ) : (
    <div className={`${sizeClass} rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300`}>
      {fallback}
    </div>
  );
}

import { Button } from '../Button';
import { getAnonymousId } from '@/lib/anonymousUser';
import { Comment } from './Comment';
import { Loader2 } from 'lucide-react';

interface User {
  id: string;
  name: string | null;
  image: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  parentId?: string | null;
  user: User;
  isAnonymous?: boolean;
  replies?: Comment[];
  likes?: number;
  dislikes?: number;
  userReaction?: 'like' | 'dislike' | null;
}

interface CommentSectionProps {
  articleId: string;
}

export function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [anonymousId, setAnonymousId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [reactingToComment, setReactingToComment] = useState<string | null>(null);

  // Check if user is an admin
  // The role is stored in session.user.user_metadata.role for Supabase auth
  const isAdmin = session?.user?.user_metadata?.role === 'ADMIN' || 
                  session?.user?.email === 'sanja.malovic2@gmail.com';
  
  // For debugging - force admin status
  const [forceAdmin, setForceAdmin] = useState(false);
  const effectiveIsAdmin = isAdmin || forceAdmin;

  useEffect(() => {
    // Get the session
    async function getSession() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      
      // Set up auth state listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
        }
      );
      
      return () => {
        authListener?.subscription.unsubscribe();
      };
    }
    
    getSession();
    
    // Get or create anonymous ID for non-logged in users
    const storedAnonymousId = getAnonymousId();
    setAnonymousId(storedAnonymousId);
    
    // Fetch comments
    fetchComments();
  }, [articleId]);

  async function fetchComments() {
    try {
      setIsLoadingComments(true);
      
      // Get the session token if available
      const { data: sessionData } = await supabase.auth.getSession();
      const headers: HeadersInit = {};
      
      if (sessionData.session) {
        headers['Authorization'] = `Bearer ${sessionData.session.access_token}`;
      }
      
      const response = await fetch(`/api/comments?articleId=${articleId}`, {
        headers
      });
      if (!response.ok) throw new Error('Failed to fetch comments');
      
      const data = await response.json();
      
      // Organize comments and replies
      const rootComments = data.comments.filter(
        (comment: Comment) => !comment.parentId
      );
      
      const replies = data.comments.filter(
        (comment: Comment) => comment.parentId
      );
      
      // Group replies with their parent comments
      const commentsWithReplies = rootComments.map((comment: Comment) => ({
        ...comment,
        replies: replies.filter(
          (reply: Comment) => reply.parentId === comment.id
        ),
      }));
      
      // Fetch reaction counts for all comments
      const allComments = [...rootComments, ...replies];
      const commentsWithReactions = await Promise.all(
        allComments.map(async (comment) => {
          try {
            const reactionUrl = `/api/comment-reactions?commentId=${comment.id}${
              anonymousId ? `&anonymousId=${anonymousId}` : ''
            }`;
            const reactionResponse = await fetch(reactionUrl, { headers });
            
            if (reactionResponse.ok) {
              const reactionData = await reactionResponse.json();
              return {
                ...comment,
                likes: reactionData.likes || 0,
                dislikes: reactionData.dislikes || 0,
                userReaction: reactionData.userReaction || null,
              };
            }
            
            return comment;
          } catch (error) {
            console.error(`Failed to fetch reactions for comment ${comment.id}:`, error);
            return comment;
          }
        })
      );
      
      // Create a map of comments with their reactions
      const commentMap = commentsWithReactions.reduce((map, comment) => {
        map[comment.id] = comment;
        return map;
      }, {} as Record<string, Comment>);
      
      // Update the comments with replies to include reaction data
      const finalComments = commentsWithReplies.map((comment: Comment) => ({
        ...commentMap[comment.id],
        replies: comment.replies?.map((reply: Comment) => commentMap[reply.id]) || [],
      }));
      
      setComments(finalComments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setIsLoadingComments(false);
    }
  }

  async function handleSubmitComment() {
    if (!commentText.trim()) return;
    
    try {
      setIsPostingComment(true);
      
      // Get the session token if available
      const { data } = await supabase.auth.getSession();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (data.session) {
        headers['Authorization'] = `Bearer ${data.session.access_token}`;
      }
      
      // Prepare comment data with either user ID or anonymous ID
      const commentData = {
        content: commentText,
        articleId,
        parentId: replyingTo,
        // Always include anonymousId as fallback in case user doesn't exist in database
        anonymousId: anonymousId || getAnonymousId(),
      };
      
      console.log('Submitting comment:', {
        ...commentData,
        content: commentData.content.substring(0, 50) + (commentData.content.length > 50 ? '...' : ''),
        isAuthenticated: !!session?.user
      });
      
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers,
        body: JSON.stringify(commentData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error submitting comment:', response.status, errorData);
        throw new Error(errorData.error || 'Failed to submit comment');
      }
      
      // Reset form
      setCommentText('');
      setReplyingTo(null);
      
      // Refresh comments
      fetchComments();
    } catch (error) {
      console.error('Failed to submit comment:', error);
      alert('Failed to submit your comment. Please try again.');
    } finally {
      setIsPostingComment(false);
    }
  }

  function handleReplyClick(commentId: string) {
    setReplyingTo(commentId);
    // Focus on comment input
    document.getElementById('comment-input')?.focus();
  }

  function cancelReply() {
    setReplyingTo(null);
  }

  async function handleDeleteComment(commentId: string) {
    if (!effectiveIsAdmin) return;
    
    // Add confirmation dialog
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this comment? This action cannot be undone and will also remove any replies.'
    );
    
    if (!confirmDelete) return;
    
    try {
      setDeleting(commentId);
      
      // Get the session token
      const { data } = await supabase.auth.getSession();
      const headers: HeadersInit = {};
      
      if (data.session) {
        headers['Authorization'] = `Bearer ${data.session.access_token}`;
      } else {
        throw new Error('Authentication required for deleting comments');
      }
      
      const response = await fetch(`/api/comments?id=${commentId}`, {
        method: 'DELETE',
        headers,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error deleting comment:', response.status, errorData);
        throw new Error(errorData.error || 'Failed to delete comment');
      }
      
      // Refresh comments after deletion
      fetchComments();
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment. Please try again.');
    } finally {
      setDeleting(null);
    }
  }

  async function handleReaction(commentId: string, reactionType: 'like' | 'dislike') {
    try {
      setReactingToComment(commentId);
      
      // Get the session token if available
      const { data } = await supabase.auth.getSession();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (data.session) {
        headers['Authorization'] = `Bearer ${data.session.access_token}`;
      }
      
      // Find the comment in our state
      const allComments = [...comments];
      const flatComments = allComments.reduce((acc, comment) => {
        acc.push(comment);
        if (comment.replies) {
          acc.push(...comment.replies);
        }
        return acc;
      }, [] as Comment[]);
      
      const commentToUpdate = flatComments.find(c => c.id === commentId);
      if (!commentToUpdate) return;
      
      // Determine the new reaction state
      let newReaction: 'like' | 'dislike' | null = reactionType;
      
      // If user already reacted with the same type, remove the reaction
      if (commentToUpdate.userReaction === reactionType) {
        newReaction = null;
      }
      
      // Prepare reaction data
      const reactionData = {
        commentId,
        reactionType: newReaction,
        anonymousId: anonymousId || getAnonymousId(),
      };
      
      const response = await fetch('/api/comment-reactions', {
        method: 'POST',
        headers,
        body: JSON.stringify(reactionData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error submitting reaction:', response.status, errorData);
        throw new Error(errorData.error || 'Failed to submit reaction');
      }
      
      // Refresh comments to get updated reaction counts
      fetchComments();
      
    } catch (error) {
      console.error('Failed to submit reaction:', error);
    } finally {
      setReactingToComment(null);
    }
  }

  // Find the parent comment being replied to
  const replyingToComment = replyingTo
    ? comments.find((comment) => comment.id === replyingTo)
    : null;

  return (
    <div className="mt-8 border-t pt-8 border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold">Comments ({comments.length})</h3>
      
      {/* Comment form */}
      <div className="mt-6 mb-8">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <Avatar
              src={session?.user?.user_metadata?.avatar_url || undefined}
              fallback={session?.user ? (session.user.user_metadata?.name?.[0] || session.user.email?.[0] || 'U') : 'A'}
              size="sm"
            />
          </div>
          <div className="flex-grow">
            {replyingToComment && (
              <div className="mb-2 text-sm text-blue-600 dark:text-blue-400 flex items-center">
                <span>Replying to {replyingToComment.user.name || 'Anonymous'}</span>
                <button
                  onClick={cancelReply}
                  className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
            )}
            <textarea
              id="comment-input"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={session?.user 
                ? `Add a comment as ${session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User'}...` 
                : "Add a comment as Anonymous..."}
              className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              disabled={isPostingComment}
            />
            <div className="flex justify-end mt-2">
              <Button
                onClick={handleSubmitComment}
                disabled={!commentText.trim() || isPostingComment}
                className="px-4"
              >
                {isPostingComment ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Comments List */}
      <div className="space-y-6">
        {isLoadingComments ? (
          <div className="flex justify-center items-center h-full mb-10">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onReply={handleReplyClick}
              onDelete={handleDeleteComment}
              onReaction={handleReaction}
              isAdmin={effectiveIsAdmin}
              deleting={deleting}
              reactingToComment={reactingToComment}
            />
          ))
        )}
      </div>
    </div>
  );
} 