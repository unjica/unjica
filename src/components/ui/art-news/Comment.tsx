'use client';

import { Avatar } from '@/components/ui/art-news/Avatar';

interface User {
  id: string;
  name: string | null;
  image: string | null;
}

interface CommentProps {
  comment: {
    id: string;
    content: string;
    createdAt: string;
    user: User;
    isAnonymous?: boolean;
    replies?: CommentProps['comment'][];
    likes?: number;
    dislikes?: number;
    userReaction?: 'like' | 'dislike' | null;
  };
  onReply: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  onReaction: (commentId: string, reactionType: 'like' | 'dislike') => void;
  isAdmin: boolean;
  deleting: string | null;
  reactingToComment: string | null;
}

export function Comment({
  comment,
  onReply,
  onDelete,
  onReaction,
  isAdmin,
  deleting,
  reactingToComment,
}: CommentProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4 bg-white dark:bg-gray-800 shadow-sm">
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
            {isAdmin && (
              <button
                onClick={() => onDelete(comment.id)}
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
              onClick={() => onReply(comment.id)}
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
                onClick={() => onReaction(comment.id, 'like')}
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
                onClick={() => onReaction(comment.id, 'dislike')}
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
                <div key={reply.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
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
                        {isAdmin && (
                          <button
                            onClick={() => onDelete(reply.id)}
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
                          onClick={() => onReaction(reply.id, 'like')}
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
                          onClick={() => onReaction(reply.id, 'dislike')}
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
  );
} 