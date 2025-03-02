'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';

interface AdminControlsProps {
  onGenerateDigest?: () => void;
}

export function AdminControls({ onGenerateDigest }: AdminControlsProps) {
  const { session, isAdmin } = useAuth();
  const [stats, setStats] = useState<{
    articles: number;
    comments: number;
    users: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);

  // Fetch debug info
  useEffect(() => {
    async function fetchDebugInfo() {
      try {
        const { data } = await supabase.auth.getSession();
        const sessionInfo = data.session ? {
          access_token: data.session.access_token ? `${data.session.access_token.substring(0, 10)}...` : null,
          refresh_token: data.session.refresh_token ? `${data.session.refresh_token.substring(0, 10)}...` : null,
          user: data.session.user ? {
            id: data.session.user.id,
            email: data.session.user.email,
            role: data.session.user.user_metadata?.role || 'not set',
          } : null,
          expires_at: data.session.expires_at,
        } : null;
        
        setDebugInfo({
          sessionFromAuth: session ? {
            access_token: session.access_token ? `${session.access_token.substring(0, 10)}...` : null,
            user: session.user ? {
              id: session.user.id,
              email: session.user.email,
            } : null,
          } : null,
          sessionFromSupabase: sessionInfo,
          isAdmin,
        });
      } catch (error) {
        console.error('Failed to fetch debug info:', error);
      }
    }
    
    fetchDebugInfo();
  }, [session, isAdmin]);

  useEffect(() => {
    if (!isAdmin || !session) return;
    
    // Fetch admin stats
    async function fetchStats() {
      try {
        setLoading(true);
        
        console.log('Session data:', JSON.stringify({
          hasSession: !!session,
          hasAccessToken: !!session?.access_token,
          userEmail: session?.user?.email,
        }));
        
        // Get a fresh token directly from Supabase
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        
        if (!token) {
          console.error('No access token available');
          setLoading(false);
          return;
        }
        
        console.log('Making request to /api/admin/stats with token');
        
        const response = await fetch('/api/admin/stats', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const responseData = await response.json();
          console.log('Response data:', responseData);
          setStats(responseData);
        } else {
          const errorText = await response.text();
          console.error('Failed to fetch admin stats:', response.status, response.statusText, errorText);
        }
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, [isAdmin, session]);

  async function handleGenerateDigest() {
    if (!isAdmin || !session) return;
    
    try {
      setGenerating(true);
      
      // Get a fresh token directly from Supabase
      const { data } = await supabase.auth.getSession();
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
      
      const responseData = await response.json();
      
      // Call the callback function if provided
      if (onGenerateDigest) {
        onGenerateDigest();
      }
      
      // Reload the page to show the new digest
      window.location.reload();
    } catch (error) {
      console.error('Failed to generate digest:', error);
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
        <button 
          onClick={() => setShowDebug(!showDebug)}
          className="text-xs bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-2 py-1 rounded"
        >
          {showDebug ? 'Hide Debug' : 'Show Debug'}
        </button>
      </div>
      
      {showDebug && debugInfo && (
        <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono overflow-auto max-h-60">
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      )}
      
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