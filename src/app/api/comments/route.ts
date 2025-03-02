import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { supabase } from '@/lib/supabase';

// Comment type definition for TypeScript
interface CommentWithUser {
  id: string;
  content: string;
  articleId: string;
  userId: string | null;
  anonymousId: string | null;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

// GET handler to fetch comments for an article
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get('articleId');
  
  if (!articleId) {
    return NextResponse.json(
      { error: 'Article ID is required' },
      { status: 400 }
    );
  }

  try {
    // Get all comments for the article with user info
    const comments = await (prisma as any).comment.findMany({
      where: {
        articleId: articleId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform comments to handle anonymous users 
    const transformedComments = comments.map((comment: CommentWithUser) => {
      // If comment has a user, return as is, otherwise mark as anonymous
      if (comment.userId) {
        return comment;
      } else {
        return {
          ...comment,
          user: {
            id: comment.anonymousId,
            name: "Anonymous User",
            image: null,
          },
          isAnonymous: true
        };
      }
    });

    return NextResponse.json({ comments: transformedComments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST handler to create a new comment
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
          // Continue with anonymous flow
        }
      }
    }
    
    const body = await request.json();
    const { content, articleId, parentId, anonymousId: requestAnonymousId } = body;
    
    // If we don't have a valid userId but we're authenticated with Supabase,
    // generate a consistent anonymousId based on the Supabase user ID
    let anonymousId = requestAnonymousId;
    if (!userId && supabaseUserId) {
      anonymousId = `supabase-${supabaseUserId}`;
      console.log('Generated anonymousId from Supabase user:', anonymousId);
    }
    
    console.log('Comment request body:', { 
      content: content.substring(0, 50) + (content.length > 50 ? '...' : ''), 
      articleId, 
      parentId, 
      userId,
      anonymousId,
      supabaseAuth: !!supabaseUserId 
    });
    
    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    if (!content.trim()) {
      return NextResponse.json(
        { error: 'Comment content cannot be empty' },
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

    // Create the comment with either user ID or anonymous ID
    const commentData = {
      content,
      articleId,
      userId: userId || null,
      anonymousId: !userId ? anonymousId : null,
      parentId: parentId || null,
    };

    console.log('Creating comment with data:', {
      ...commentData,
      content: commentData.content.substring(0, 50) + (commentData.content.length > 50 ? '...' : '')
    });

    const comment = await (prisma as any).comment.create({
      data: commentData,
      include: {
        user: userId ? {
          select: {
            id: true,
            name: true,
            image: true,
          },
        } : undefined,
      },
    });

    // If comment was created by anonymous user, add a user property for UI consistency
    let transformedComment = comment;
    if (!userId) {
      transformedComment = {
        ...comment,
        user: {
          id: anonymousId,
          name: "Anonymous User",
          image: null,
        },
        isAnonymous: true
      };
    }

    return NextResponse.json({
      success: true,
      comment: transformedComment,
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    
    // Add more detailed error information
    let errorMessage = 'Failed to create comment';
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

// DELETE handler to delete a comment (admin only)
export async function DELETE(request: Request) {
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
    
    if (error) {
      console.error('Supabase auth error:', error);
      return NextResponse.json(
        { error: 'Authentication error', details: error.message },
        { status: 401 }
      );
    }
    
    // Check if user is admin
    if (!user || user.email !== 'sanja.malovic2@gmail.com') {
      console.log(`User ${user?.email || 'unknown'} is not an admin`);
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }
    
    console.log(`Admin access confirmed for user: ${user.email}`);
    
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('id');
    
    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      );
    }
    
    // Delete the comment and its replies
    // First find all replies to this comment
    const replies = await (prisma as any).comment.findMany({
      where: {
        parentId: commentId,
      },
    });
    
    // Delete all replies first
    if (replies.length > 0) {
      console.log(`Deleting ${replies.length} replies to comment ${commentId}`);
      await (prisma as any).comment.deleteMany({
        where: {
          parentId: commentId,
        },
      });
    }
    
    // Delete the main comment
    console.log(`Deleting comment ${commentId}`);
    await (prisma as any).comment.delete({
      where: {
        id: commentId,
      },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Comment and all replies deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    
    // Add more detailed error information
    let errorMessage = 'Failed to delete comment';
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