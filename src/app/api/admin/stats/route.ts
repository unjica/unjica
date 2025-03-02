import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { supabase } from '@/lib/supabase';

// GET handler to fetch admin statistics
export async function GET(request: Request) {
  try {
    console.log('GET /api/admin/stats: Request received');
    
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    console.log('Authorization header present:', !!authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('GET /api/admin/stats: Unauthorized - no valid auth header');
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    console.log('Token extracted from header, length:', token.length);
    
    // Try both methods of authentication
    let isAdmin = false;
    let userEmail = null;
    
    // Method 1: Use getUser with the token
    try {
      const { data, error } = await supabase.auth.getUser(token);
      
      if (error) {
        console.error('Supabase auth error with getUser:', error);
      } else if (data.user) {
        userEmail = data.user.email;
        isAdmin = data.user.email === 'sanja.malovic2@gmail.com';
        console.log('User authenticated with getUser:', userEmail, 'isAdmin:', isAdmin);
      }
    } catch (authError) {
      console.error('Error with getUser auth:', authError);
    }
    
    // Method 2: Try to get session directly
    if (!isAdmin) {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Supabase auth error with getSession:', error);
        } else if (session?.user) {
          userEmail = session.user.email;
          isAdmin = session.user.email === 'sanja.malovic2@gmail.com';
          console.log('User authenticated with getSession:', userEmail, 'isAdmin:', isAdmin);
        }
      } catch (sessionError) {
        console.error('Error with getSession auth:', sessionError);
      }
    }
    
    // Check if user is admin
    if (!isAdmin) {
      console.log('User is not an admin:', userEmail);
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }
    
    console.log('User is admin, fetching statistics');
    
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
      
      console.log('Statistics fetched successfully');
      return NextResponse.json({
        articles: articlesCount,
        comments: commentsCount,
        users: usersCount,
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      
      // If the error is related to database connection, return fallback stats
      if (dbError instanceof Error && 
          (dbError.message.includes('database') || 
           dbError.message.includes('connection') || 
           dbError.message.includes('DATABASE_URL'))) {
        console.log('Using fallback stats due to database error');
        return NextResponse.json({
          articles: 0,
          comments: 0,
          users: 0,
          _notice: 'Database connection is currently unavailable. Showing fallback statistics.'
        });
      }
      
      return NextResponse.json(
        { error: 'Database error when fetching statistics', details: dbError instanceof Error ? dbError.message : String(dbError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch admin statistics',
        details: error instanceof Error ? error.message : String(error),
        articles: 0,
        comments: 0,
        users: 0
      },
      { status: 500 }
    );
  }
}

// Make this API route dynamic to avoid caching
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 1 minute max execution time (Vercel Hobby plan limit) 