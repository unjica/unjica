/**
 * Service for generating or retrieving images for articles
 */
import { put } from '@vercel/blob';

export class ImageGenerationService {
  /**
   * Gets an image URL for an article based on its topics and tags
   * This implementation uses Lorem Picsum which works reliably with Next.js Image
   */
  static async generateImageForArticle(
    topic: string, 
    tags: string[], 
    articleId?: string, 
    title?: string
  ): Promise<string | undefined> {
    try {
      // Combine article ID, title, topic, and multiple tags to create a more unique seed
      const uniqueIdentifier = [
        articleId || '',
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
          prompt: `A high-quality, professional image representing: ${title || topic}. Include visual elements related to: ${tags.join(', ')}. Style: modern, clean, suitable for article header.`,
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
      
      // Store the image permanently in Vercel Blob
      try {
        // Download the image from DALL-E (which expires)
        const imageResponse = await fetch(dalleImageUrl);
        const imageBlob = await imageResponse.blob();
        
        // Generate unique filename
        const fileName = `article-images/${articleId || Date.now()}-${topic.replace(/\s+/g, '-').toLowerCase()}.jpg`;
        
        // Upload to Vercel Blob
        const blob = await put(fileName, imageBlob, {
          access: 'public',
          contentType: 'image/jpeg'
        });
        
        return blob.url;
      } catch (storageError) {
        console.error('Failed to store image:', storageError);
        // Fallback to the temporary DALL-E URL
        return dalleImageUrl;
      }
    } catch (error) {
      console.error('Failed to generate image:', error);
      return undefined;
    }
  }
} 