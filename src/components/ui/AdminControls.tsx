'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

interface AdminControlsProps {
  onGenerateDigest?: () => void;
}

export function AdminControls({ onGenerateDigest }: AdminControlsProps) {
  const { session, isAdmin, clearAuthData } = useAuth();
  const [stats, setStats] = useState<{
    articles: number;
    comments: number;
    users: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!isAdmin || !session) return;
    
    // Fetch admin stats
    async function fetchStats() {
      try {
        setLoading(true);
        
        // Get a fresh token directly from Supabase
        try {
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            throw error;
          }
          
          const token = data.session?.access_token;
          
          if (!token) {
            setLoading(false);
            return;
          }
          
          const response = await fetch('/api/admin/stats', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const responseData = await response.json();
            setStats(responseData);
          } else if (response.status === 401 || response.status === 403) {
            // Handle unauthorized access
            throw new Error('Unauthorized access to admin stats');
          }
        } catch (error) {
          // Handle token errors
          console.error('Error fetching admin stats:', error);
          
          // If there's an error with the token, sign out and clear data
          if (error instanceof Error && 
              (error.message.includes('Refresh Token') || 
               error.message.includes('Unauthorized'))) {
            clearAuthData();
            await supabase.auth.signOut();
            window.location.href = '/login?error=session_expired';
          }
        }
      } catch (error) {
        // Error handling is silent
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, [isAdmin, session, clearAuthData]);

  async function handleGenerateDigest() {
    if (!isAdmin || !session) return;
    
    try {
      setGenerating(true);
      
      // Get a fresh token directly from Supabase
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        const token = data.session?.access_token;
        
        if (!token) {
          throw new Error('You must be logged in to generate a digest');
        }
        
        const response = await fetch('/api/art-digest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to generate digest');
        }
        
        // Call the callback function if provided
        if (onGenerateDigest) {
          onGenerateDigest();
        }
        
        // Reload the page to show the new digest
        window.location.reload();
      } catch (error) {
        // Handle token errors
        console.error('Error generating digest:', error);
        
        // If there's an error with the token, sign out and clear data
        if (error instanceof Error && error.message.includes('Refresh Token')) {
          clearAuthData();
          await supabase.auth.signOut();
          window.location.href = '/login?error=session_expired';
        } else {
          alert('Failed to generate digest. Please try again.');
        }
      }
    } catch (error) {
      alert('Failed to generate digest. Please try again.');
    } finally {
      setGenerating(false);
    }
  }

  // If not admin, don't render anything
  if (!isAdmin) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-4 rounded-lg shadow mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">Admin Controls</h2>
      </div>
      
      {loading ? (
        <div className="text-center py-4">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm mt-2">Loading stats...</p>
        </div>
      ) : stats ? (
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white dark:bg-gray-800 p-3 rounded shadow-sm text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.articles}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Articles</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded shadow-sm text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.comments}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Comments</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded shadow-sm text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.users}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Users</p>
          </div>
        </div>
      ) : null}
      
      <div className="flex justify-between">
        <button
          onClick={handleGenerateDigest}
          disabled={generating}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? 'Generating...' : 'Generate New Digest'}
        </button>
        
        <a
          href="/api/admin/export-data"
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md"
          download
        >
          Export Data
        </a>
      </div>
    </div>
  );
} 