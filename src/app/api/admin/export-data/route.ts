import { NextResponse } from 'next/server';
import { auth } from 'auth';
import { prisma } from '@/lib/db';

// Type definitions for the data we're exporting
interface ArticleData {
  id: string;
  title: string;
  content: string;
  primaryTopic: string;
  summary: string;
  tags: string; // JSON string that will be parsed
  publishedAt: Date;
  sourceNewsIds: string; // JSON string that will be parsed
  lastUpdated: Date;
  createdAt: Date;
  imageUrl?: string;
  slug?: string;
  [key: string]: any; // For any additional properties
}

interface CommentData {
  id: string;
  content: string;
  articleId: string;
  userId: string | null;
  anonymousId: string | null;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  } | null;
  [key: string]: any; // For any additional properties
}

interface UserData {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any; // For any additional properties
}

// GET handler to export data
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
    
    // Fetch data in parallel for better performance
    const [articles, comments, users] = await Promise.all([
      // Get all articles
      (prisma as any).generatedArticle.findMany({
        orderBy: {
          publishedAt: 'desc',
        },
      }),
      
      // Get all comments with user info
      (prisma as any).comment.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      
      // Get all users (excluding sensitive information)
      (prisma as any).user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);
    
    // Process articles to parse JSON fields
    const processedArticles = articles.map((article: ArticleData) => ({
      ...article,
      tags: JSON.parse(article.tags),
      sourceNewsIds: JSON.parse(article.sourceNewsIds),
      publishedAt: article.publishedAt.toISOString(),
      lastUpdated: article.lastUpdated.toISOString(),
      createdAt: article.createdAt.toISOString(),
    }));
    
    // Process comments for dates
    const processedComments = comments.map((comment: CommentData) => ({
      ...comment,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
    }));
    
    // Process users for dates
    const processedUsers = users.map((user: UserData) => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }));
    
    // Create the export data
    const exportData = {
      exportDate: new Date().toISOString(),
      articles: processedArticles,
      comments: processedComments,
      users: processedUsers,
    };
    
    // Set headers to download as a file
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Content-Disposition', 'attachment; filename="art-news-export.json"');
    
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}

// Make this API route dynamic to avoid caching
export const dynamic = 'force-dynamic'; 