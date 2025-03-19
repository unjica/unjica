/**
 * Represents a generated article
 */
export interface GeneratedArticle {
  id: string;
  title: string;
  content: string;
  primaryTopic: string;
  summary: string;
  tags: string[];
  publishedAt: string;
  sourceNewsIds: string[];
  lastUpdated: string;
  imageUrl?: string; // Optional URL to AI-generated image
  slug?: string; // URL-friendly version of the title
}

import { prisma } from '@/lib/db';

/**
 * Storage service for generated articles
 */
export class ArticleStorage {
  /**
   * Saves a generated article to storage
   */
  static async saveArticle(article: GeneratedArticle): Promise<void> {
    try {
      await prisma.generatedArticle.create({
        data: {
          id: article.id,
          title: article.title,
          content: article.content,
          primaryTopic: article.primaryTopic,
          summary: article.summary,
          tags: JSON.stringify(article.tags),
          publishedAt: new Date(article.publishedAt),
          sourceNewsIds: JSON.stringify(article.sourceNewsIds),
          lastUpdated: new Date(article.lastUpdated),
          imageUrl: article.imageUrl,
          slug: article.slug
        } as any
      });
    } catch (error) {
      console.error('Failed to save article to database:', error);
      // As a fallback, we'll still save to localStorage when in the browser
      if (typeof window !== 'undefined') {
        const existingArticles = this.getArticlesFromLocalStorage();
        const articles = [article, ...existingArticles];
        const trimmedArticles = articles.slice(0, 50);
        localStorage.setItem('generated_art_articles', JSON.stringify(trimmedArticles));
      }
    }
  }
  
  /**
   * Retrieves all generated articles
   */
  static async getArticles(): Promise<GeneratedArticle[]> {
    try {
      const dbArticles = await prisma.generatedArticle.findMany({
        orderBy: {
          publishedAt: 'desc'
        },
        take: 50
      });
      
      return dbArticles.map(dbArticle => ({
        id: dbArticle.id,
        title: dbArticle.title,
        content: dbArticle.content,
        primaryTopic: dbArticle.primaryTopic,
        summary: dbArticle.summary,
        tags: JSON.parse(dbArticle.tags),
        publishedAt: dbArticle.publishedAt.toISOString(),
        sourceNewsIds: JSON.parse(dbArticle.sourceNewsIds),
        lastUpdated: dbArticle.lastUpdated.toISOString(),
        imageUrl: (dbArticle as any).imageUrl,
        slug: (dbArticle as any).slug || undefined
      }));
    } catch (error) {
      console.error('Failed to fetch articles from database:', error);
      // Fallback to localStorage when in the browser
      if (typeof window !== 'undefined') {
        return this.getArticlesFromLocalStorage();
      }
      return [];
    }
  }
  
  /**
   * Retrieves a specific article by ID
   */
  static async getArticleById(id: string): Promise<GeneratedArticle | null> {
    try {
      const dbArticle = await prisma.generatedArticle.findUnique({
        where: { id }
      });
      
      if (!dbArticle) return null;
      
      return {
        id: dbArticle.id,
        title: dbArticle.title,
        content: dbArticle.content,
        primaryTopic: dbArticle.primaryTopic,
        summary: dbArticle.summary,
        tags: JSON.parse(dbArticle.tags),
        publishedAt: dbArticle.publishedAt.toISOString(),
        sourceNewsIds: JSON.parse(dbArticle.sourceNewsIds),
        lastUpdated: dbArticle.lastUpdated.toISOString(),
        imageUrl: (dbArticle as any).imageUrl,
        slug: (dbArticle as any).slug || undefined
      };
    } catch (error) {
      console.error('Failed to fetch article from database:', error);
      // Fallback to localStorage when in the browser
      if (typeof window !== 'undefined') {
        const localArticles = this.getArticlesFromLocalStorage();
        return localArticles.find(a => a.id === id) || null;
      }
      return null;
    }
  }
  
  /**
   * Gets the most recent article
   */
  static async getMostRecentArticle(): Promise<GeneratedArticle | null> {
    try {
      const dbArticle = await prisma.generatedArticle.findFirst({
        orderBy: {
          publishedAt: 'desc'
        }
      });
      
      if (!dbArticle) return null;
      
      return {
        id: dbArticle.id,
        title: dbArticle.title,
        content: dbArticle.content,
        primaryTopic: dbArticle.primaryTopic,
        summary: dbArticle.summary,
        tags: JSON.parse(dbArticle.tags),
        publishedAt: dbArticle.publishedAt.toISOString(),
        sourceNewsIds: JSON.parse(dbArticle.sourceNewsIds),
        lastUpdated: dbArticle.lastUpdated.toISOString(),
        imageUrl: (dbArticle as any).imageUrl,
        slug: (dbArticle as any).slug || undefined
      };
    } catch (error) {
      console.error('Failed to fetch most recent article from database:', error);
      // Fallback to localStorage when in the browser
      if (typeof window !== 'undefined') {
        const localArticles = this.getArticlesFromLocalStorage();
        return localArticles.length > 0 ? localArticles[0] : null;
      }
      return null;
    }
  }
  
  /**
   * Retrieves an article by its slug
   */
  static async getArticleBySlug(slug: string): Promise<GeneratedArticle | null> {
    try {
      const dbArticle = await prisma.generatedArticle.findUnique({
        where: { slug } as any
      });
      
      if (!dbArticle) return null;
      
      return {
        id: dbArticle.id,
        title: dbArticle.title,
        content: dbArticle.content,
        primaryTopic: dbArticle.primaryTopic,
        summary: dbArticle.summary,
        tags: JSON.parse(dbArticle.tags),
        publishedAt: dbArticle.publishedAt.toISOString(),
        sourceNewsIds: JSON.parse(dbArticle.sourceNewsIds),
        lastUpdated: dbArticle.lastUpdated.toISOString(),
        imageUrl: (dbArticle as any).imageUrl,
        slug: (dbArticle as any).slug || undefined
      };
    } catch (error) {
      console.error('Failed to fetch article by slug from database:', error);
      // Fallback to localStorage when in the browser
      if (typeof window !== 'undefined') {
        const localArticles = this.getArticlesFromLocalStorage();
        return localArticles.find(a => a.slug === slug) || null;
      }
      return null;
    }
  }
  
  /**
   * Helper method to get articles from localStorage (fallback)
   */
  private static getArticlesFromLocalStorage(): GeneratedArticle[] {
    if (typeof window !== 'undefined') {
      const articlesJson = localStorage.getItem('generated_art_articles');
      return articlesJson ? JSON.parse(articlesJson) : [];
    }
    return [];
  }
  
  /**
   * Creates a summary from the full content
   * Removes article title before processing the summary
   */
  static createSummary(content: string): string {
    // Remove any paragraph that starts with "# "
    const contentWithoutTitle = content
      .split('\n\n')
      .filter(paragraph => !paragraph.trim().startsWith('# '))
      .join('\n\n');

    // Extract the first paragraph after "## Summary" if it exists
    const summaryMatch = contentWithoutTitle.match(/## Summary\s+([^\n]+)/);
    if (summaryMatch && summaryMatch[1]) {
      return summaryMatch[1];
    }
    
    // Otherwise return first 150 characters
    return contentWithoutTitle.replace(/[#*_]/g, '').trim().substring(0, 300) + '...';
  }
} 