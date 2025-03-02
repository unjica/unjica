import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { supabase } from '@/lib/supabase';

// GET handler to fetch users who have interacted with the logged-in user's comments
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
    
    // Check if the authenticated user is requesting their own interactions
    if (!userId || userId !== authenticatedUserId) {
      return NextResponse.json(
        { error: 'Unauthorized. You can only view your own interactions.' },
        { status: 403 }
      );
    }
    
    // Get users who liked the logged-in user's comments
    const commentLikes = await prisma.reaction.findMany({
      where: {
        type: 'LIKE',
        comment: {
          userId: userId
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        comment: {
          select: {
            id: true,
            content: true,
            article: {
              select: {
                id: true,
                title: true,
                slug: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20, // Limit to 20 most recent interactions
    });
    
    // Get users who disliked the logged-in user's comments
    const commentDislikes = await prisma.reaction.findMany({
      where: {
        type: 'DISLIKE',
        comment: {
          userId: userId
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        comment: {
          select: {
            id: true,
            content: true,
            article: {
              select: {
                id: true,
                title: true,
                slug: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20, // Limit to 20 most recent interactions
    });
    
    // Get replies to the logged-in user's comments
    const commentReplies = await prisma.comment.findMany({
      where: {
        parent: {
          userId: userId
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        parent: {
          select: {
            id: true,
            content: true,
          }
        },
        article: {
          select: {
            id: true,
            title: true,
            slug: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20, // Limit to 20 most recent interactions
    });
    
    return NextResponse.json({
      commentLikes,
      commentDislikes,
      commentReplies
    });
  } catch (error) {
    console.error('Error fetching user interactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interactions' },
      { status: 500 }
    );
  }
}

// Make this API route dynamic to avoid caching
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 1 minute max execution time (Vercel Hobby plan limit) 