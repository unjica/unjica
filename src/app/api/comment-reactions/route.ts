import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { supabase } from '@/lib/supabase';

// GET handler to fetch reactions for a comment
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const commentId = searchParams.get('commentId');
  
  if (!commentId) {
    return NextResponse.json(
      { error: 'Comment ID is required' },
      { status: 400 }
    );
  }

  try {
    // Get authorization header for Supabase auth
    const authHeader = request.headers.get('authorization');
    let userId = null;
    let supabaseUserId = null;
    let anonymousId = searchParams.get('anonymousId');
    
    // If auth header exists, verify with Supabase
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { data, error } = await supabase.auth.getUser(token);
      if (error) {
        console.error('Supabase auth error:', error);
      } else if (data.user) {
        supabaseUserId = data.user.id;
        
        // Check if this user exists in our database
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: supabaseUserId }
          });
          
          if (dbUser) {
            userId = dbUser.id;
          }
        } catch (userError) {
          console.error('Error checking user in database:', userError);
        }
      }
    }
    
    // Get like and dislike counts for the comment
    const likeCount = await prisma.reaction.count({
      where: {
        commentId,
        type: 'like',
      },
    });
    
    const dislikeCount = await prisma.reaction.count({
      where: {
        commentId,
        type: 'dislike',
      },
    });
    
    // Get user's reaction if authenticated or has anonymousId
    let userReaction = null;
    
    if (userId || anonymousId) {
      const reaction = await prisma.reaction.findFirst({
        where: {
          commentId,
          ...(userId ? { userId } : {}),
          ...(anonymousId && !userId ? { anonymousId } : {}),
        },
      });
      
      if (reaction) {
        userReaction = reaction.type;
      }
    }
    
    return NextResponse.json({
      commentId,
      likes: likeCount,
      dislikes: dislikeCount,
      userReaction,
    });
    
  } catch (error) {
    console.error('Error fetching comment reactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comment reactions' },
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
    let supabaseUserId = null;
    
    // If auth header exists, verify with Supabase
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { data, error } = await supabase.auth.getUser(token);
      if (error) {
        console.error('Supabase auth error:', error);
      } else if (data.user) {
        supabaseUserId = data.user.id;
        
        // Check if this user exists in our database
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: supabaseUserId }
          });
          
          if (dbUser) {
            userId = dbUser.id;
          } else {
            console.log('User not found in database, creating user record');
            
            // Create a user record for this Supabase user
            try {
              const newUser = await prisma.user.create({
                data: {
                  id: supabaseUserId,
                  name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
                  email: data.user.email || `${supabaseUserId}@placeholder.com`,
                  image: data.user.user_metadata?.avatar_url || null,
                  role: data.user.email === 'sanja.malovic2@gmail.com' ? 'ADMIN' : 'USER',
                }
              });
              
              userId = newUser.id;
              console.log('Created new user record:', userId);
            } catch (createError) {
              console.error('Failed to create user record:', createError);
              // Continue with anonymous flow if user creation fails
            }
          }
        } catch (userError) {
          console.error('Error checking user in database:', userError);
        }
      }
    }
    
    const body = await request.json();
    const { commentId, reactionType, anonymousId: requestAnonymousId } = body;
    
    // If we don't have a valid userId but we're authenticated with Supabase,
    // generate a consistent anonymousId based on the Supabase user ID
    let anonymousId = requestAnonymousId;
    if (!userId && supabaseUserId) {
      anonymousId = `supabase-${supabaseUserId}`;
    }
    
    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
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
    
    // Check if the comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });
    
    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }
    
    // Find existing reaction
    const existingReaction = await prisma.reaction.findFirst({
      where: {
        commentId,
        ...(userId ? { userId } : {}),
        ...(anonymousId && !userId ? { anonymousId } : {}),
      },
    });
    
    // If reactionType is null, delete the reaction
    if (reactionType === null) {
      if (existingReaction) {
        await prisma.reaction.delete({
          where: { id: existingReaction.id },
        });
      }
    } 
    // If reaction exists but type is different, update it
    else if (existingReaction && existingReaction.type !== reactionType) {
      await prisma.reaction.update({
        where: { id: existingReaction.id },
        data: { type: reactionType },
      });
    } 
    // If reaction doesn't exist, create it
    else if (!existingReaction && reactionType) {
      await prisma.reaction.create({
        data: {
          commentId,
          type: reactionType,
          userId: userId || null,
          anonymousId: !userId ? anonymousId : null,
        },
      });
    }
    
    // Get updated counts
    const likeCount = await prisma.reaction.count({
      where: {
        commentId,
        type: 'like',
      },
    });
    
    const dislikeCount = await prisma.reaction.count({
      where: {
        commentId,
        type: 'dislike',
      },
    });
    
    return NextResponse.json({
      success: true,
      commentId,
      likes: likeCount,
      dislikes: dislikeCount,
      userReaction: reactionType,
    });
    
  } catch (error) {
    console.error('Error updating comment reaction:', error);
    
    // Add more detailed error information
    let errorMessage = 'Failed to update comment reaction';
    let errorDetails = null;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage, 
        details: errorDetails,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Make this API route dynamic to avoid caching
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 1 minute max execution time (Vercel Hobby plan limit) 