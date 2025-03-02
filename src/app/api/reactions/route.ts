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

  // Special handling for fallback article
  if (articleId === 'fallback-article-1') {
    return NextResponse.json({
      userReaction: null,
      likesCount: 0,
      dislikesCount: 0
    });
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
    let supabaseUserId = null;
    
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
        supabaseUserId = data.user.id;
        console.log('Authenticated with Supabase user ID:', supabaseUserId);
        
        // Check if this user exists in our database
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: supabaseUserId }
          });
          
          if (dbUser) {
            userId = dbUser.id;
            console.log('User found in database:', userId);
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
    const { articleId, commentId, type, anonymousId: requestAnonymousId } = body;
    
    // Special handling for fallback article
    if (articleId === 'fallback-article-1') {
      return NextResponse.json({
        success: true,
        message: 'Reaction acknowledged but not stored for system article',
        likesCount: 0,
        dislikesCount: 0
      });
    }
    
    // If we don't have a valid userId but we're authenticated with Supabase,
    // generate a consistent anonymousId based on the Supabase user ID
    let anonymousId = requestAnonymousId;
    if (!userId && supabaseUserId) {
      anonymousId = `supabase-${supabaseUserId}`;
      console.log('Generated anonymousId from Supabase user:', anonymousId);
    }
    
    console.log('Reaction request body:', { 
      articleId, 
      commentId, 
      type, 
      userId,
      anonymousId,
      supabaseAuth: !!supabaseUserId 
    });
    
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

    // Handle authenticated user with valid database user
    if (userId) {
      // Authenticated user flow
      // Delete existing reaction if removing or changing type
      if (type === null) {
        console.log('Deleting reaction for user:', userId);
        await prisma.reaction.deleteMany({
          where: {
            userId: userId,
            articleId: articleId || null,
            commentId: commentId || null,
          },
        });
      } else if (commentId) {
        console.log('Upserting comment reaction for user:', userId);
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
        console.log('Processing article reaction for user:', userId);
        // For article reactions (without commentId), use findFirst/delete+create pattern
        try {
          const existingReaction = await prisma.reaction.findFirst({
            where: {
              userId: userId,
              articleId: articleId,
              commentId: null,
            },
          });
          
          console.log('Existing reaction found:', existingReaction);
          
          if (existingReaction) {
            console.log('Updating existing reaction');
            await prisma.reaction.update({
              where: {
                id: existingReaction.id,
              },
              data: {
                type,
              },
            });
          } else {
            console.log('Creating new reaction');
            await prisma.reaction.create({
              data: {
                userId: userId,
                articleId: articleId,
                commentId: null,
                type,
              },
            });
          }
        } catch (err) {
          console.error('Error processing article reaction:', err);
          throw err;
        }
      }
    } else if (anonymousId) {
      // Anonymous user flow (including authenticated users without database records)
      console.log('Using anonymous flow with ID:', anonymousId);
      
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
          console.log('Deleting anonymous reaction');
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
          console.log('Updating anonymous reaction');
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
          console.log('Creating new anonymous reaction');
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
    
    // Add more detailed error information
    let errorMessage = 'Failed to update reaction';
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