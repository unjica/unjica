'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [userActivity, setUserActivity] = useState({
    comments: [],
    likes: [],
    dislikes: [],
  });
  const [userInteractions, setUserInteractions] = useState({
    commentLikes: [],
    commentDislikes: [],
    commentReplies: [],
  });
  const [activeTab, setActiveTab] = useState('comments');
  const [activeInteractionTab, setActiveInteractionTab] = useState('commentLikes');
  const [showEditForm, setShowEditForm] = useState(false);
  const [name, setName] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    async function getSession() {
      const { data, error } = await supabase.auth.getSession();
      
      if (!data.session) {
        // Redirect to login if not authenticated
        router.push('/login');
        return;
      }
      
      setSession(data.session);
      setName(data.session.user.user_metadata?.name || '');
      setLoading(false);
      
      // Fetch user activity
      fetchUserActivity(data.session.user.id);
      
      // Fetch user interactions
      fetchUserInteractions(data.session.user.id);
    }
    
    getSession();
  }, [router]);

  async function fetchUserActivity(userId: string) {
    try {
      setLoading(true);
      
      // Get the session token for authentication
      const { data: sessionData } = await supabase.auth.getSession();
      const headers: HeadersInit = {};
      
      if (sessionData.session) {
        headers['Authorization'] = `Bearer ${sessionData.session.access_token}`;
      }
      
      // Fetch user's comments
      const commentsResponse = await fetch(`/api/profile/comments?userId=${userId}`, {
        headers
      });
      
      // Fetch user's reactions (likes and dislikes)
      const reactionsResponse = await fetch(`/api/profile/reactions?userId=${userId}`, {
        headers
      });
      
      if (commentsResponse.ok && reactionsResponse.ok) {
        const commentsData = await commentsResponse.json();
        const reactionsData = await reactionsResponse.json();
        
        setUserActivity({
          comments: commentsData.comments || [],
          likes: reactionsData.likes || [],
          dislikes: reactionsData.dislikes || [],
        });
      }
    } catch (error) {
      console.error('Failed to fetch user activity:', error);
    } finally {
      setLoading(false);
    }
  }
  
  async function fetchUserInteractions(userId: string) {
    try {
      // Get the session token for authentication
      const { data: sessionData } = await supabase.auth.getSession();
      const headers: HeadersInit = {};
      
      if (sessionData.session) {
        headers['Authorization'] = `Bearer ${sessionData.session.access_token}`;
      }
      
      // Fetch interactions with user's comments
      const interactionsResponse = await fetch(`/api/profile/interactions?userId=${userId}`, {
        headers
      });
      
      if (interactionsResponse.ok) {
        const interactionsData = await interactionsResponse.json();
        
        setUserInteractions({
          commentLikes: interactionsData.commentLikes || [],
          commentDislikes: interactionsData.commentDislikes || [],
          commentReplies: interactionsData.commentReplies || [],
        });
      }
    } catch (error) {
      console.error('Failed to fetch user interactions:', error);
    }
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    
    if (!name.trim()) {
      setUpdateError('Name cannot be empty');
      return;
    }
    
    try {
      setUpdateLoading(true);
      setUpdateError(null);
      
      // Get the session token for authentication
      const { data: sessionData } = await supabase.auth.getSession();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (sessionData.session) {
        headers['Authorization'] = `Bearer ${sessionData.session.access_token}`;
      }
      
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers,
        body: JSON.stringify({ name }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }
      
      // Refresh the session to get updated user data
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setShowEditForm(false);
      
    } catch (error) {
      console.error('Failed to update profile:', error);
      setUpdateError('Failed to update profile. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center z-10 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* User Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {session?.user?.user_metadata?.avatar_url ? (
                <img
                  src={session.user.user_metadata.avatar_url}
                  alt="Profile"
                  className="h-24 w-24 rounded-full object-cover border-4 border-blue-100 dark:border-blue-900"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center text-3xl font-bold border-4 border-blue-100 dark:border-blue-900">
                  {session?.user?.user_metadata?.name?.charAt(0).toUpperCase() || 
                   session?.user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="ml-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {session?.user?.user_metadata?.name || session?.user?.email?.split('@')[0] || 'User'}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">{session?.user?.email}</p>
              <div className="mt-2 flex space-x-2">
                <button 
                  className="inline-flex items-center px-3 py-1.5 text-sm rounded-md border border-purple-500 hover:bg-purple-500/10 transition-colors text-purple-500 dark:text-purple-400"
                  onClick={() => setShowEditForm(true)}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {userActivity.comments.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Comments</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {userActivity.likes.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Likes</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {userActivity.dislikes.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Dislikes</div>
            </div>
          </div>
        </div>
        
        {/* Activity Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('comments')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'comments'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Comments
              </button>
              <button
                onClick={() => setActiveTab('likes')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'likes'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Likes
              </button>
              <button
                onClick={() => setActiveTab('dislikes')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'dislikes'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Dislikes
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {/* Comments Tab */}
            {activeTab === 'comments' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Your Comments</h2>
                {userActivity.comments.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    You haven't made any comments yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {userActivity.comments.map((comment: any) => (
                      <div key={comment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(comment.createdAt).toLocaleDateString()} at {new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                          <a 
                            href={`/art-news/${comment.article.slug || comment.articleId}`}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            View Article
                          </a>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          {comment.content}
                        </p>
                        <div className="mt-2 text-sm">
                          <span className="text-gray-600 dark:text-gray-300">On article: </span>
                          <span className="font-medium">{comment.article.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Likes Tab */}
            {activeTab === 'likes' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Articles You Liked</h2>
                {userActivity.likes.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    You haven't liked any articles yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {userActivity.likes.map((reaction: any) => (
                      <div key={reaction.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {reaction.article.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Liked on {new Date(reaction.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <a 
                            href={`/art-news/${reaction.article.slug || reaction.articleId}`}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            View Article
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Dislikes Tab */}
            {activeTab === 'dislikes' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Articles You Disliked</h2>
                {userActivity.dislikes.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    You haven't disliked any articles yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {userActivity.dislikes.map((reaction: any) => (
                      <div key={reaction.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {reaction.article.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Disliked on {new Date(reaction.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <a 
                            href={`/art-news/${reaction.article.slug || reaction.articleId}`}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            View Article
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Interactions Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Interactions with Your Comments
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              See who has liked, disliked, or replied to your comments
            </p>
          </div>
          
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex">
              <button
                onClick={() => setActiveInteractionTab('commentLikes')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeInteractionTab === 'commentLikes'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Likes
              </button>
              <button
                onClick={() => setActiveInteractionTab('commentDislikes')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeInteractionTab === 'commentDislikes'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Dislikes
              </button>
              <button
                onClick={() => setActiveInteractionTab('commentReplies')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeInteractionTab === 'commentReplies'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Replies
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {/* Comment Likes Tab */}
            {activeInteractionTab === 'commentLikes' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Users Who Liked Your Comments</h3>
                {userInteractions.commentLikes.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No one has liked your comments yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {userInteractions.commentLikes.map((interaction: any) => (
                      <div key={interaction.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {interaction.user?.name || interaction.user?.email?.split('@')[0] || 'Anonymous User'}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Liked on {new Date(interaction.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <a 
                            href={`/art-news/${interaction.comment.article.slug || interaction.comment.articleId}`}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            View Article
                          </a>
                        </div>
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                            Your comment: "{interaction.comment.content}"
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Comment Dislikes Tab */}
            {activeInteractionTab === 'commentDislikes' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Users Who Disliked Your Comments</h3>
                {userInteractions.commentDislikes.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No one has disliked your comments.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {userInteractions.commentDislikes.map((interaction: any) => (
                      <div key={interaction.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {interaction.user?.name || interaction.user?.email?.split('@')[0] || 'Anonymous User'}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Disliked on {new Date(interaction.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <a 
                            href={`/art-news/${interaction.comment.article.slug || interaction.comment.articleId}`}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            View Article
                          </a>
                        </div>
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                            Your comment: "{interaction.comment.content}"
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Comment Replies Tab */}
            {activeInteractionTab === 'commentReplies' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Replies to Your Comments</h3>
                {userInteractions.commentReplies.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No one has replied to your comments yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {userInteractions.commentReplies.map((reply: any) => (
                      <div key={reply.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {reply.user?.name || reply.user?.email?.split('@')[0] || 'Anonymous User'}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Replied on {new Date(reply.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <a 
                            href={`/art-news/${reply.article.slug || reply.articleId}`}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            View Article
                          </a>
                        </div>
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-2">
                            Your comment: "{reply.parent.content}"
                          </p>
                          <p className="text-sm text-gray-800 dark:text-gray-200">
                            <span className="font-medium">Reply:</span> {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Edit Profile</h2>
            
            {updateError && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
                {updateError}
              </div>
            )}
            
            <form onSubmit={handleUpdateProfile}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your display name"
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setShowEditForm(false)}
                  disabled={updateLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={updateLoading}
                >
                  {updateLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 