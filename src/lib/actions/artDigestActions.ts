'use server';

import { ArtNewsItem } from '@/lib/agents/artNewsAgent';
import { getArtNewsAgent } from '@/lib/agents/artNewsAgent';
import { artContentGeneratorAgent } from '@/lib/agents/artContentGeneratorAgent';
import { ArticleStorage, type GeneratedArticle } from '@/lib/agents/models/generatedArticle';
import { ImageGenerationService } from '@/lib/services/imageGenerationService';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { slugify } from '@/lib/utils/slugify';

/**
 * Fetches fresh news from the last hour and generates a new article
 */
export async function generateHourlyArtDigest(): Promise<GeneratedArticle> {
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
    const slug = slugify(generatedContent.title);
    
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
    
    // In a production environment, you would save this to a database
    // For this example, we'll use client-side storage when accessing the articles
    
    // Revalidate the digest page to show the new content
    revalidatePath('/art-news/digest');
    
    return article;
  } catch (error) {
    console.error('Error generating art digest:', error);
    
    // Return a fallback article in case of error
    return {
      id: crypto.randomBytes(8).toString('hex'),
      title: 'Art Digest Generation Error',
      content: '## Error\n\nThere was an error generating the latest art digest. Please try again later.',
      primaryTopic: 'Error',
      summary: 'There was an error generating the latest art digest. Please try again later.',
      tags: ['error'],
      publishedAt: now.toISOString(),
      sourceNewsIds: [],
      lastUpdated: now.toISOString()
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