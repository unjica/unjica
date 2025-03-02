import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { supabase } from '@/lib/supabase';

// GET handler to fetch comments for a user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // Get authorization header for Supabase auth
    const authHeader = request.headers.get('authorization');
    let authenticatedUserId = null;
    
    // If auth header exists, verify with Supabase
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { data, error } = await supabase.auth.getUser(token);
      
      if (error) {
        console.error('Supabase auth error:', error);
        return NextResponse.json(
          { error: 'Authentication error', details: error.message },
          { status: 401 }
        );
      }
      
      if (data.user) {
        authenticatedUserId = data.user.id;
      }
    }
    
    // Check if the authenticated user is requesting their own comments
    if (!userId || userId !== authenticatedUserId) {
      return NextResponse.json(
        { error: 'Unauthorized. You can only view your own comments.' },
        { status: 403 }
      );
    }
    
    // Get all comments for the user with article info
    const comments = await prisma.comment.findMany({
      where: {
        userId: userId,
      },
      include: {
        article: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching user comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// Make this API route dynamic to avoid caching
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 1 minute max execution time (Vercel Hobby plan limit) 