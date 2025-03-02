'use client';

import { useState, useEffect } from 'react';

export function EnvDebugger() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function fetchEnvVars() {
      try {
        setLoading(true);
        
        // Create an object with all client-side accessible environment variables
        const clientEnvVars: Record<string, string> = {
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'not set',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
            `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 5)}...` : 'not set',
          NODE_ENV: process.env.NODE_ENV || 'not set',
        };
        
        // Fetch server-side environment variables (these will be redacted for security)
        try {
          const response = await fetch('/api/debug/env');
          if (response.ok) {
            const serverEnvVars = await response.json();
            setEnvVars({ ...clientEnvVars, ...serverEnvVars });
          } else {
            setEnvVars(clientEnvVars);
            setError('Failed to fetch server environment variables');
          }
        } catch (fetchError) {
          setEnvVars(clientEnvVars);
          setError('Error fetching server environment variables');
          console.error('Error fetching server environment variables:', fetchError);
        }
      } catch (e) {
        setError('Error loading environment variables');
        console.error('Error loading environment variables:', e);
      } finally {
        setLoading(false);
      }
    }
    
    fetchEnvVars();
  }, []);

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-gray-800 dark:to-gray-900 p-4 rounded-lg shadow mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">Environment Variables Debugger</h2>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-sm bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded"
        >
          {expanded ? 'Hide' : 'Show'}
        </button>
      </div>
      
      {expanded && (
        <div className="mt-3">
          {loading ? (
            <div className="text-center py-4">
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm mt-2">Loading environment variables...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded">
              {error}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 p-3 rounded overflow-auto max-h-96">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="py-2 px-3 font-semibold">Variable</th>
                    <th className="py-2 px-3 font-semibold">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(envVars).map(([key, value]) => (
                    <tr key={key} className="border-b dark:border-gray-700">
                      <td className="py-2 px-3 font-mono text-xs">{key}</td>
                      <td className="py-2 px-3 font-mono text-xs">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 