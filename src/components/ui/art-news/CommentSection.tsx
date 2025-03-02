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

  // Check if user is an admin
  const isAdmin = session?.user?.role === 'ADMIN';

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
      setLoading(true);
      
      const response = await fetch(`/api/comments?articleId=${articleId}`);
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
      
      setComments(commentsWithReplies);
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
      
      // Prepare comment data with either user ID or anonymous ID
      const commentData = {
        content: commentText,
        articleId,
        parentId: replyingTo,
      };
      
      // Add anonymousId if user is not logged in
      if (!session?.user?.id && anonymousId) {
        Object.assign(commentData, { anonymousId });
      }
      
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
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
    if (!isAdmin) return;
    
    // Add confirmation dialog
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this comment? This action cannot be undone and will also remove any replies.'
    );
    
    if (!confirmDelete) return;
    
    try {
      setDeleting(commentId);
      
      const response = await fetch(`/api/comments?id=${commentId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
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
              src={session?.user?.image || undefined}
              fallback={session?.user?.name?.[0] || 'A'}
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
              placeholder={session?.user ? "Add a comment..." : "Add a comment as Anonymous..."}
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
            <div key={comment.id} className="border-b border-gray-100 dark:border-gray-800 pb-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Avatar
                    src={comment.user.image || undefined}
                    fallback={comment.isAnonymous ? 'A' : (comment.user.name?.[0] || 'U')}
                    size="sm"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <span className="font-medium">
                        {comment.isAnonymous ? 'Anonymous User' : (comment.user.name || 'Unknown User')}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {/* Admin delete button */}
                    {isAdmin && (
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
                  <p className="text-gray-800 dark:text-gray-200">{comment.content}</p>
                  <button
                    onClick={() => handleReplyClick(comment.id)}
                    className="text-sm text-blue-600 dark:text-blue-400 mt-2"
                  >
                    Reply
                  </button>
                  
                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 ml-6 space-y-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <div className="flex-shrink-0">
                            <Avatar
                              src={reply.user.image || undefined}
                              fallback={reply.isAnonymous ? 'A' : (reply.user.name?.[0] || 'U')}
                              size="xs"
                            />
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center">
                                <span className="font-medium">
                                  {reply.isAnonymous ? 'Anonymous User' : (reply.user.name || 'Unknown User')}
                                </span>
                                <span className="text-xs text-gray-500 ml-2">
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              
                              {/* Admin delete button for replies */}
                              {isAdmin && (
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
                            <p className="text-gray-800 dark:text-gray-200">{reply.content}</p>
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