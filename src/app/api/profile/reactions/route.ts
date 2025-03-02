import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { supabase } from '@/lib/supabase';

// GET handler to fetch reactions for a user
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
    
    // Check if the authenticated user is requesting their own reactions
    if (!userId || userId !== authenticatedUserId) {
      return NextResponse.json(
        { error: 'Unauthorized. You can only view your own reactions.' },
        { status: 403 }
      );
    }
    
    // Get all likes for the user with article info
    const likes = await prisma.reaction.findMany({
      where: {
        userId: userId,
        type: 'LIKE',
        articleId: { not: null }, // Only article reactions, not comment reactions
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
    
    // Get all dislikes for the user with article info
    const dislikes = await prisma.reaction.findMany({
      where: {
        userId: userId,
        type: 'DISLIKE',
        articleId: { not: null }, // Only article reactions, not comment reactions
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
    
    return NextResponse.json({ 
      likes,
      dislikes
    });
  } catch (error) {
    console.error('Error fetching user reactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reactions' },
      { status: 500 }
    );
  }
}

// Make this API route dynamic to avoid caching
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 1 minute max execution time (Vercel Hobby plan limit) 