import { NextResponse } from 'next/server';
import { auth } from 'auth';
import { prisma } from '@/lib/db';

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
    const session = await auth();
    const { content, articleId, parentId, anonymousId } = await request.json();
    
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
    const userId = session?.user?.id;
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
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a comment (admin only)
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    
    // Check if user is authenticated and is an admin
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }
    
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
      await (prisma as any).comment.deleteMany({
        where: {
          parentId: commentId,
        },
      });
    }
    
    // Delete the main comment
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
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}

// Make this API route dynamic to avoid caching
export const dynamic = 'force-dynamic'; 