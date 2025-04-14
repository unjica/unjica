/**
 * Service for generating or retrieving images for articles
 */
import { R2Service } from '@/lib/services/r2Service';

export class ImageGenerationService {
  /**
   * Gets an image URL for an article based on its topics and tags
   * This implementation uses Lorem Picsum which works reliably with Next.js Image
   */
  static async generateImageForArticle(
    topic: string, 
    tags: string[], 
    articleSlug?: string,
    title?: string,
  ): Promise<string | undefined> {
    try {
      // Combine article ID, title, topic, and multiple tags to create a more unique seed
      const uniqueIdentifier = [
        articleSlug || '',
        title || '',
        topic,
        ...tags.slice(0, 3) // Use up to 3 tags for more variety
      ].join('-');
      
      // Create a hash-like number from the combined string
      const seed = Math.abs(
        Array.from(uniqueIdentifier).reduce(
          (acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0
        )
      );
      
      // Fallback to Lorem Picsum if OpenAI API key is not available
      if (!process.env.OPENAI_API_KEY) {
        console.warn('OPENAI_API_KEY not found, using fallback image service');
        return `https://picsum.photos/seed/${seed}/1200/630`;
      }
      
      // Use OpenAI's DALL-E 3 API to generate an image based on the article content
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: `Act as a contemporary editorial artist. Create a high-quality, realistic image that visually interprets the theme: ‘${title || topic}’. Draw inspiration from: ${tags.join(', ')}. Use natural lighting, clean composition, and modern visual storytelling. The result should feel like a magazine header image — minimal, intentional, and emotionally resonant.`,
          n: 1,
          size: '1024x1024',
          quality: "standard",
          response_format: "url"
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API error:', errorData);
        // Fall back to Lorem Picsum if OpenAI API fails
        return `https://picsum.photos/seed/${seed}/1200/630`;
      }
      
      const data = await response.json();
      const dalleImageUrl = data.data[0].url;
      
      // Store the image permanently in R2 instead of Vercel Blob
      try {
        // Download the image from DALL-E (which expires)
        const imageResponse = await fetch(dalleImageUrl);
        if (!imageResponse.ok) {
          console.error('Failed to download DALL-E image:', await imageResponse.text());
          return `https://picsum.photos/seed/${seed}/1200/630`;
        }
        
        // Convert response to ArrayBuffer and then to Buffer
        const arrayBuffer = await imageResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Generate unique filename
        const fileName = `article-images/${articleSlug || Date.now()}-${topic.replace(/\s+/g, '-').toLowerCase()}.jpg`;
        console.log(`[ImageGeneration] Uploading to R2 as: ${fileName}`);
        
        // Upload to R2 using Buffer
        const imageUrl = await R2Service.uploadImage(fileName, buffer, 'image/jpeg');
        if (!imageUrl) {
          console.error('Failed to upload image to R2');
          return `https://picsum.photos/seed/${seed}/1200/630`;
        }
        
        return imageUrl;
      } catch (storageError) {
        console.error('Failed to store image:', storageError);
        return `https://picsum.photos/seed/${seed}/1200/630`;
      }
    } catch (error) {
      console.error('Failed to generate image:', error);
      return undefined;
    }
  }
} 