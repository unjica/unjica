import { NextResponse } from 'next/server';
import { auth } from 'auth';
import { prisma } from '@/lib/db';

// GET handler to fetch admin statistics
export async function GET() {
  try {
    const session = await auth();
    
    // Check if user is authenticated and is an admin
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
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