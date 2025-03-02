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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      
      // Debug log to see session structure
      console.log('Session data:', data.session ? {
        id: data.session.user.id,
        email: data.session.user.email,
        metadata: data.session.user.user_metadata,
      } : 'No session');
      
      // Set up auth state listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          // Debug log for auth state changes
          console.log('Auth state changed:', session ? {
            id: session.user.id,
            email: session.user.email,
            metadata: session.user.user_metadata,
          } : 'No session');
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
      setLoading(true);
      
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
      setLoading(false);
    }
  }

  async function handleSubmitComment() {
    if (!commentText.trim()) return;
    
    try {
      setLoading(true);
      
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
      setLoading(false);
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
      
      console.log(`Deleting comment: ${commentId}`);
      
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
      
      const data2 = await response.json();
      
      // Update the comment in our state with the new reaction counts
      updateCommentReaction(commentId, data2.likes, data2.dislikes, newReaction);
      
    } catch (error) {
      console.error('Failed to submit reaction:', error);
    } finally {
      setReactingToComment(null);
    }
  }
  
  // Helper function to update a comment's reaction counts in state
  function updateCommentReaction(
    commentId: string, 
    likes: number, 
    dislikes: number, 
    userReaction: 'like' | 'dislike' | null
  ) {
    setComments(prevComments => {
      return prevComments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, likes, dislikes, userReaction };
        }
        
        if (comment.replies) {
          const updatedReplies = comment.replies.map(reply => {
            if (reply.id === commentId) {
              return { ...reply, likes, dislikes, userReaction };
            }
            return reply;
          });
          
          return { ...comment, replies: updatedReplies };
        }
        
        return comment;
      });
    });
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
            />
            <div className="flex justify-end mt-2">
              <Button
                onClick={handleSubmitComment}
                disabled={!commentText.trim() || loading}
                className="px-4"
              >
                {loading ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <p>Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4 bg-white dark:bg-gray-800 shadow-sm">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Avatar
                    src={comment.user.image || undefined}
                    fallback={comment.isAnonymous ? 'A' : (comment.user.name?.[0] || 'U')}
                    size="sm"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {comment.isAnonymous ? 'Anonymous User' : (comment.user.name || 'Unknown User')}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {new Date(comment.createdAt).toLocaleDateString()} at {new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    
                    {/* Admin delete button */}
                    {effectiveIsAdmin && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={deleting === comment.id}
                        className="text-red-500 hover:text-red-700 text-xs flex items-center"
                        aria-label="Delete comment"
                        title="Delete comment"
                      >
                        {deleting === comment.id ? (
                          <span>Deleting...</span>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-2">
                    <p className="text-gray-800 dark:text-gray-200">{comment.content}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleReplyClick(comment.id)}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      Reply
                    </button>
                    
                    {/* Like/Dislike buttons */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleReaction(comment.id, 'like')}
                        disabled={reactingToComment === comment.id}
                        className={`text-sm flex items-center ${
                          comment.userReaction === 'like' 
                            ? 'text-green-600 dark:text-green-400 font-medium' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400'
                        }`}
                        aria-label="Like comment"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-4 w-4 mr-1" 
                          fill={comment.userReaction === 'like' ? 'currentColor' : 'none'} 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        {comment.likes || 0}
                      </button>
                      
                      <button
                        onClick={() => handleReaction(comment.id, 'dislike')}
                        disabled={reactingToComment === comment.id}
                        className={`text-sm flex items-center ${
                          comment.userReaction === 'dislike' 
                            ? 'text-red-600 dark:text-red-400 font-medium' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                        }`}
                        aria-label="Dislike comment"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-4 w-4 mr-1" 
                          fill={comment.userReaction === 'dislike' ? 'currentColor' : 'none'} 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                        </svg>
                        {comment.dislikes || 0}
                      </button>
                    </div>
                  </div>
                  
                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 ml-6 space-y-3 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        {comment.replies.length} {comment.replies.length === 1 ? 'Reply' : 'Replies'}
                      </h4>
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <div className="flex gap-3 mb-2">
                            <div className="flex-shrink-0">
                              <Avatar
                                src={reply.user.image || undefined}
                                fallback={reply.isAnonymous ? 'A' : (reply.user.name?.[0] || 'U')}
                                size="xs"
                              />
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <span className="font-medium text-blue-600 dark:text-blue-400">
                                    {reply.isAnonymous ? 'Anonymous User' : (reply.user.name || 'Unknown User')}
                                  </span>
                                  <span className="text-xs text-gray-500 ml-2">
                                    {new Date(reply.createdAt).toLocaleDateString()} at {new Date(reply.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </span>
                                </div>
                                
                                {/* Admin delete button for replies */}
                                {effectiveIsAdmin && (
                                  <button
                                    onClick={() => handleDeleteComment(reply.id)}
                                    disabled={deleting === reply.id}
                                    className="text-red-500 hover:text-red-700 text-xs flex items-center"
                                    aria-label="Delete reply"
                                    title="Delete reply"
                                  >
                                    {deleting === reply.id ? (
                                      <span>Deleting...</span>
                                    ) : (
                                      <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                      </>
                                    )}
                                  </button>
                                )}
                              </div>
                              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-2">
                                <p className="text-gray-800 dark:text-gray-200">{reply.content}</p>
                              </div>
                              <div className="flex items-center gap-3 mt-2 ml-9">
                                <button
                                  onClick={() => handleReaction(reply.id, 'like')}
                                  disabled={reactingToComment === reply.id}
                                  className={`text-sm flex items-center ${
                                    reply.userReaction === 'like' 
                                      ? 'text-green-600 dark:text-green-400 font-medium' 
                                      : 'text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400'
                                  }`}
                                  aria-label="Like reply"
                                >
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-4 w-4 mr-1" 
                                    fill={reply.userReaction === 'like' ? 'currentColor' : 'none'} 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                  </svg>
                                  {reply.likes || 0}
                                </button>
                                
                                <button
                                  onClick={() => handleReaction(reply.id, 'dislike')}
                                  disabled={reactingToComment === reply.id}
                                  className={`text-sm flex items-center ${
                                    reply.userReaction === 'dislike' 
                                      ? 'text-red-600 dark:text-red-400 font-medium' 
                                      : 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                                  }`}
                                  aria-label="Dislike reply"
                                >
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-4 w-4 mr-1" 
                                    fill={reply.userReaction === 'dislike' ? 'currentColor' : 'none'} 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                                  </svg>
                                  {reply.dislikes || 0}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 