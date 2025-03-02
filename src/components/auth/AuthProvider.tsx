'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any, data: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  refreshSession: () => Promise<void>;
  clearAuthData: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Function to clear all auth data
  const clearAuthData = () => {
    setSession(null);
    setUser(null);
    setIsAdmin(false);
  };

  // Function to safely get the session and handle errors
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session refresh error:', error.message);
        clearAuthData();
        return;
      }
      
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setIsAdmin(data.session?.user?.email === 'sanja.malovic2@gmail.com');
    } catch (error) {
      // Handle any unexpected errors
      console.error('Error refreshing session:', error);
      clearAuthData();
      
      // If it's a refresh token error, sign out completely
      if (error instanceof Error && error.message.includes('Refresh Token')) {
        await supabase.auth.signOut();
      }
    }
  };

  useEffect(() => {
    // Get initial session
    (async () => {
      setIsLoading(true);
      await refreshSession();
      setIsLoading(false);
    })();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsAdmin(session?.user?.email === 'sanja.malovic2@gmail.com');
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      await refreshSession();
    }
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          role: email === 'sanja.malovic2@gmail.com' ? 'ADMIN' : 'USER'
        }
      }
    });
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    clearAuthData();
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    refreshSession,
    clearAuthData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 