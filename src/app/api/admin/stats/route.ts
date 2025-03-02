import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { supabase } from '@/lib/supabase';

// GET handler to fetch admin statistics
export async function GET(request: Request) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    
    // Try both methods of authentication
    let isAdmin = false;
    let userEmail = null;
    
    // Method 1: Use getUser with the token
    try {
      const { data, error } = await supabase.auth.getUser(token);
      
      if (!error && data.user) {
        userEmail = data.user.email;
        isAdmin = data.user.email === 'sanja.malovic2@gmail.com';
      }
    } catch (authError) {
      // Silent error handling
    }
    
    // Method 2: Try to get session directly
    if (!isAdmin) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          userEmail = session.user.email;
          isAdmin = session.user.email === 'sanja.malovic2@gmail.com';
        }
      } catch (sessionError) {
        // Silent error handling
      }
    }
    
    // Check if user is admin
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }
    
    // Fetch statistics in parallel for better performance
    try {
      const [articlesCount, commentsCount, usersCount] = await Promise.all([
        // Count all articles
        prisma.generatedArticle.count(),
        
        // Count all comments
        prisma.comment.count(),
        
        // Count all users
        prisma.user.count(),
      ]);
      
      return NextResponse.json({
        articles: articlesCount,
        comments: commentsCount,
        users: usersCount,
      });
    } catch (dbError) {
      return NextResponse.json(
        { error: 'Database error when fetching statistics' },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
}

// Make this API route dynamic to avoid caching
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 1 minute max execution time (Vercel Hobby plan limit) 