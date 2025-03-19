/**
 * Utility script to fix any articles with temporary DALL-E image URLs
 * 
 * To run this script:
 * 1. Make sure all environment variables are set
 * 2. Execute with: npx ts-node -r tsconfig-paths/register src/lib/scripts/fixImageUrls.ts
 */

import { prisma } from '@/lib/db';
import { ImageGenerationService } from '../services/imageGenerationService';

async function fixImageUrls() {
  console.log('Starting to fix image URLs for articles with temporary DALL-E URLs...');
  
  // Find all articles with DALL-E URLs
  const articles = await prisma.generatedArticle.findMany({
    where: {
      imageUrl: {
        contains: 'oaidalleapiprodscus.blob.core.windows.net'
      }
    }
  });
  
  console.log(`Found ${articles.length} articles with temporary DALL-E URLs.`);
  
  for (const article of articles) {
    console.log(`Processing article ${article.id}: ${article.title}`);
    
    // Parse tags
    let tags: string[] = [];
    try {
      tags = JSON.parse(article.tags as string);
    } catch (e) {
      console.warn(`Could not parse tags for article ${article.id}, using empty array`);
    }
    
    // Generate a new permanent image URL
    const newImageUrl = await ImageGenerationService.generateImageForArticle(
      article.primaryTopic,
      tags,
      article.id,
      article.title
    );
    
    if (newImageUrl) {
      // Update the article with the new permanent URL
      await prisma.generatedArticle.update({
        where: { id: article.id },
        data: { imageUrl: newImageUrl }
      });
      
      console.log(`✅ Updated article ${article.id} with new permanent image URL.`);
    } else {
      console.error(`❌ Failed to generate new image URL for article ${article.id}.`);
    }
  }
  
  console.log('Image URL fix process completed.');
}

// Execute the function
fixImageUrls()
  .then(() => console.log('Script completed successfully.'))
  .catch(err => console.error('Error running script:', err))
  .finally(() => prisma.$disconnect()); 