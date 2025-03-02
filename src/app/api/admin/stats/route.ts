import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { supabase } from '@/lib/supabase';

// GET handler to fetch admin statistics
export async function GET(request: Request) {
  try {
    console.log('GET /api/admin/stats: Request received');
    
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('GET /api/admin/stats: Unauthorized - no valid auth header');
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify the token with Supabase
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      // Check if user is admin
      if (error || !user || user.email !== 'sanja.malovic2@gmail.com') {
        console.log('GET /api/admin/stats: Unauthorized - not an admin user');
        return NextResponse.json(
          { error: 'Unauthorized. Admin access required.' },
          { status: 403 }
        );
      }
      
      console.log('GET /api/admin/stats: User authenticated as admin');
    } catch (authError) {
      console.error('GET /api/admin/stats: Auth error:', authError);
      return NextResponse.json(
        { error: 'Authentication error', details: authError instanceof Error ? authError.message : String(authError) },
        { status: 500 }
      );
    }
    
    try {
      console.log('GET /api/admin/stats: Fetching statistics');
      // Fetch statistics in parallel for better performance
      const [articlesCount, commentsCount, usersCount] = await Promise.all([
        // Count all articles
        (prisma as any).generatedArticle.count(),
        
        // Count all comments
        (prisma as any).comment.count(),
        
        // Count all users
        (prisma as any).user.count(),
      ]);
      
      console.log('GET /api/admin/stats: Statistics fetched successfully');
      return NextResponse.json({
        articles: articlesCount,
        comments: commentsCount,
        users: usersCount,
      });
    } catch (dbError) {
      console.error('GET /api/admin/stats: Database error:', dbError);
      
      // If the error is related to database connection, return fallback stats
      if (dbError instanceof Error && 
          (dbError.message.includes('database') || 
           dbError.message.includes('connection') || 
           dbError.message.includes('DATABASE_URL'))) {
        console.log('GET /api/admin/stats: Using fallback stats due to database error');
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