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
        { status: 403 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    // Check if user is admin
    if (error || !user || user.email !== 'sanja.malovic2@gmail.com') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }
    
    // Fetch statistics in parallel for better performance
    const [articlesCount, commentsCount, usersCount] = await Promise.all([
      // Count all articles
      (prisma as any).generatedArticle.count(),
      
      // Count all comments
      (prisma as any).comment.count(),
      
      // Count all users
      (prisma as any).user.count(),
    ]);
    
    return NextResponse.json({
      articles: articlesCount,
      comments: commentsCount,
      users: usersCount,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
}

// Make this API route dynamic to avoid caching
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 1 minute max execution time (Vercel Hobby plan limit) 