'use server';

import { ArtNewsItem } from '@/lib/agents/artNewsAgent';
import { getArtNewsAgent } from '@/lib/agents/artNewsAgent';
import { artContentGeneratorAgent } from '@/lib/agents/artContentGeneratorAgent';
import { ArticleStorage, type GeneratedArticle } from '@/lib/agents/models/generatedArticle';
import { ImageGenerationService } from '@/lib/services/imageGenerationService';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { slugify, ensureUniqueSlug } from '@/lib/utils/slugify';
import { prisma } from '@/lib/db';

/**
 * Fetches fresh news from the last hour and generates a new article
 */
export async function generateDailyArtDigest(): Promise<GeneratedArticle> {
  // Get current time and time from 1 hour ago
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 3600 * 1000);
  
  try {
    // Fetch recent news
    const agent = getArtNewsAgent();
    const recentNewsData = await agent.getModernArtNews(1, 15);
    
    // Filter for news from the last hour (or fallback to all news if none recent)
    let recentNews = recentNewsData.news.filter((item: ArtNewsItem) => {
      const pubDate = new Date(item.publishedAt);
      return pubDate >= oneHourAgo;
    });
    
    // If no recent news, use the latest 5 items
    if (recentNews.length === 0) {
      recentNews = recentNewsData.news.slice(0, 5);
    }
    
    // Generate article from the news items
    const generatedContent = artContentGeneratorAgent.generateArticle(recentNews);
    
    // Create a unique ID
    const id = crypto.randomBytes(8).toString('hex');
    
    // Generate a URL-friendly slug from the title
    let baseSlug = slugify(generatedContent.title);
    
    // Check for existing slugs in the database
    try {
      // Get all existing slugs that start with the base slug
      const existingSlugs = await prisma.generatedArticle.findMany({
        where: {
          slug: {
            startsWith: baseSlug
          }
        },
        select: {
          slug: true
        }
      });
      
      // Ensure the slug is unique
      const slug = ensureUniqueSlug(baseSlug, existingSlugs.map(item => item.slug || '').filter(Boolean));
      console.log(`Generated unique slug: ${slug} (from base: ${baseSlug})`);
      
      // Generate an image for the article
      const imageUrl = await ImageGenerationService.generateImageForArticle(
        generatedContent.primaryTopic,
        generatedContent.tags,
        id,
        generatedContent.title
      );
      
      // Create the article object
      const article: GeneratedArticle = {
        id,
        title: generatedContent.title,
        content: generatedContent.content,
        primaryTopic: generatedContent.primaryTopic,
        summary: ArticleStorage.createSummary(generatedContent.content),
        tags: generatedContent.tags,
        publishedAt: now.toISOString(),
        sourceNewsIds: recentNews.map((item: ArtNewsItem) => item.id),
        lastUpdated: now.toISOString(),
        imageUrl,
        slug
      };
      
      // Revalidate the digest page to show the new content
      revalidatePath('/');
      
      return article;
    } catch (dbError) {
      console.error('Error checking for existing slugs:', dbError);
      
      // If we can't check the database, add a timestamp to ensure uniqueness
      const timestamp = Date.now().toString().slice(-6);
      const fallbackSlug = `${baseSlug}-${timestamp}`;
      console.log(`Using fallback slug with timestamp: ${fallbackSlug}`);
      
      // Generate an image for the article
      const imageUrl = await ImageGenerationService.generateImageForArticle(
        generatedContent.primaryTopic,
        generatedContent.tags,
        id,
        generatedContent.title
      );
      
      // Create the article object with fallback slug
      const article: GeneratedArticle = {
        id,
        title: generatedContent.title,
        content: generatedContent.content,
        primaryTopic: generatedContent.primaryTopic,
        summary: ArticleStorage.createSummary(generatedContent.content),
        tags: generatedContent.tags,
        publishedAt: now.toISOString(),
        sourceNewsIds: recentNews.map((item: ArtNewsItem) => item.id),
        lastUpdated: now.toISOString(),
        imageUrl,
        slug: fallbackSlug
      };
      
      // Revalidate the digest page to show the new content
      revalidatePath('/');
      
      return article;
    }
  } catch (error) {
    console.error('Error generating art digest:', error);
    
    // Return a fallback article in case of error
    const fallbackId = crypto.randomBytes(8).toString('hex');
    const timestamp = Date.now().toString().slice(-6);
    
    return {
      id: fallbackId,
      title: 'Art Digest Generation Error',
      content: '## Error\n\nThere was an error generating the latest art digest. Please try again later.',
      primaryTopic: 'Error',
      summary: 'There was an error generating the latest art digest. Please try again later.',
      tags: ['error'],
      publishedAt: now.toISOString(),
      sourceNewsIds: [],
      lastUpdated: now.toISOString(),
      slug: `error-digest-${timestamp}`
    };
  }
}

/**
 * Gets recently generated art digest articles
 */
export async function getGeneratedArtDigests(): Promise<{ articles: GeneratedArticle[] }> {
  // This would normally fetch from a database
  // For now, we'll return client-side in the component
  return { articles: [] };
}

/**
 * Gets a specific generated article by ID
 */
export async function getGeneratedArtDigestById(id: string): Promise<{ article: GeneratedArticle | null }> {
  // This would normally fetch from a database
  // For now, we'll return client-side in the component
  return { article: null };
} 