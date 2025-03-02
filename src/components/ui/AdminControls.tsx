'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface AdminControlsProps {
  onGenerateDigest?: () => void;
}

export function AdminControls({ onGenerateDigest }: AdminControlsProps) {
  const [session, setSession] = useState<any>(null);
  const [stats, setStats] = useState<{
    articles: number;
    comments: number;
    users: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Check if user is an admin
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get session
    async function getSession() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      
      // Check if user is admin (email is sanja.malovic2@gmail.com)
      if (data.session?.user?.email === 'sanja.malovic2@gmail.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      
      // Set up auth state listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          if (session?.user?.email === 'sanja.malovic2@gmail.com') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        }
      );
      
      return () => {
        authListener?.subscription.unsubscribe();
      };
    }
    
    getSession();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    
    // Fetch admin stats
    async function fetchStats() {
      try {
        setLoading(true);
        
        // Get the session token for authorization
        const { data: { session } } = await supabase.auth.getSession();
        
        const response = await fetch('/api/admin/stats', {
          headers: {
            Authorization: `Bearer ${session?.access_token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, [isAdmin]);

  async function handleGenerateDigest() {
    if (!isAdmin) return;
    
    try {
      setGenerating(true);
      
      const response = await fetch('/api/art-digest', {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate digest');
      }
      
      const data = await response.json();
      
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
      <h2 className="text-lg font-bold mb-3">Admin Controls</h2>
      
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