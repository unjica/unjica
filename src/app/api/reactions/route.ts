import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { supabase } from '@/lib/supabase';

// GET handler to fetch a user's reaction to an article
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get('articleId');
  const anonymousId = searchParams.get('anonymousId');
  
  if (!articleId) {
    return NextResponse.json(
      { error: 'Article ID is required' },
      { status: 400 }
    );
  }

  try {
    // Get authorization header for Supabase auth
    const authHeader = request.headers.get('authorization');
    let userId = null;
    
    // If auth header exists, verify with Supabase
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { data, error } = await supabase.auth.getUser(token);
      if (!error && data.user) {
        userId = data.user.id;
      }
    }
    
    // If user is logged in, get their reaction
    if (userId) {
      // Get user's reaction
      const userReaction = await prisma.reaction.findFirst({
        where: {
          userId: userId,
          articleId: articleId,
          commentId: null,
        },
      });

      // Get count of likes and dislikes
      const likesCount = await prisma.reaction.count({
        where: {
          articleId: articleId,
          type: 'LIKE',
        },
      });

      const dislikesCount = await prisma.reaction.count({
        where: {
          articleId: articleId,
          type: 'DISLIKE',
        },
      });

      return NextResponse.json({
        userReaction: userReaction,
        likesCount,
        dislikesCount,
      });
    } 
    // If anonymous ID is provided, get anonymous reaction
    else if (anonymousId) {
      // Get anonymous user's reaction - use findFirst instead of findUnique to handle null commentId
      // We don't use the composite key for anonymous users
      const anonymousReaction = await prisma.reaction.findFirst({
        where: {
          anonymousId: anonymousId,
          articleId: articleId,
          commentId: null,
        },
      });

      // Get count of likes and dislikes
      const likesCount = await prisma.reaction.count({
        where: {
          articleId: articleId,
          type: 'LIKE',
        },
      });

      const dislikesCount = await prisma.reaction.count({
        where: {
          articleId: articleId,
          type: 'DISLIKE',
        },
      });

      return NextResponse.json({
        userReaction: anonymousReaction,
        likesCount,
        dislikesCount,
      });
    } 
    // No user ID or anonymous ID
    else {
      // Just return counts
      const likesCount = await prisma.reaction.count({
        where: {
          articleId: articleId,
          type: 'LIKE',
        },
      });

      const dislikesCount = await prisma.reaction.count({
        where: {
          articleId: articleId,
          type: 'DISLIKE',
        },
      });

      return NextResponse.json({
        userReaction: null,
        likesCount,
        dislikesCount,
      });
    }
  } catch (error) {
    console.error('Error fetching reaction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reaction' },
      { status: 500 }
    );
  }
}

// POST handler to create or update a reaction
export async function POST(request: Request) {
  try {
    // Get authorization header for Supabase auth
    const authHeader = request.headers.get('authorization');
    let userId = null;
    
    // If auth header exists, verify with Supabase
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { data, error } = await supabase.auth.getUser(token);
      if (!error && data.user) {
        userId = data.user.id;
      }
    }
    
    const { articleId, commentId, type, anonymousId } = await request.json();
    
    if (!articleId && !commentId) {
      return NextResponse.json(
        { error: 'Article ID or Comment ID is required' },
        { status: 400 }
      );
    }
    
    // Check if we have either a user ID or anonymous ID
    if (!userId && !anonymousId) {
      return NextResponse.json(
        { error: 'Authentication or anonymous ID required' },
        { status: 400 }
      );
    }

    // Handle anonymous or authenticated user
    if (userId) {
      // Authenticated user flow
      // Delete existing reaction if removing or changing type
      if (type === null) {
        await prisma.reaction.deleteMany({
          where: {
            userId: userId,
            articleId: articleId || null,
            commentId: commentId || null,
          },
        });
      } else if (commentId) {
        // Upsert reaction for comments (with commentId)
        await prisma.reaction.upsert({
          where: {
            user_reaction_unique: {
              userId: userId,
              articleId: articleId || null,
              commentId: commentId,
            },
          },
          update: {
            type,
          },
          create: {
            userId: userId,
            articleId: articleId || null,
            commentId: commentId,
            type,
          },
        });
      } else {
        // For article reactions (without commentId), use findFirst/delete+create pattern
        const existingReaction = await prisma.reaction.findFirst({
          where: {
            userId: userId,
            articleId: articleId,
            commentId: null,
          },
        });
        
        if (existingReaction) {
          await prisma.reaction.update({
            where: {
              id: existingReaction.id,
            },
            data: {
              type,
            },
          });
        } else {
          await prisma.reaction.create({
            data: {
              userId: userId,
              articleId: articleId,
              commentId: null,
              type,
            },
          });
        }
      }
    } else if (anonymousId) {
      // Anonymous user flow
      // For anonymous users, we need to handle the case differently since we can't use null in unique constraints
      
      // First, check if a reaction already exists
      const existingReaction = await prisma.reaction.findFirst({
        where: {
          anonymousId: anonymousId,
          articleId: articleId || null,
          commentId: commentId || null,
        },
      });
      
      // Delete existing reaction if removing
      if (type === null) {
        if (existingReaction) {
          await prisma.reaction.delete({
            where: {
              id: existingReaction.id,
            },
          });
        }
      } else {
        // Update existing or create new
        if (existingReaction) {
          // Update existing reaction
          await prisma.reaction.update({
            where: {
              id: existingReaction.id,
            },
            data: {
              type,
            },
          });
        } else {
          // Create new reaction
          await prisma.reaction.create({
            data: {
              anonymousId: anonymousId,
              articleId: articleId || null,
              commentId: commentId || null,
              type,
            },
          });
        }
      }
    }

    // Get updated counts
    const likesCount = await prisma.reaction.count({
      where: {
        articleId: articleId || undefined,
        commentId: commentId || undefined,
        type: 'LIKE',
      },
    });

    const dislikesCount = await prisma.reaction.count({
      where: {
        articleId: articleId || undefined,
        commentId: commentId || undefined,
        type: 'DISLIKE',
      },
    });

    return NextResponse.json({
      success: true,
      likesCount,
      dislikesCount,
    });
  } catch (error) {
    console.error('Error updating reaction:', error);
    return NextResponse.json(
      { error: 'Failed to update reaction' },
      { status: 500 }
    );
  }
}

// Make this API route dynamic to avoid caching
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 1 minute max execution time (Vercel Hobby plan limit) 