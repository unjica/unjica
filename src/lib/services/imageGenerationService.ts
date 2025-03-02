/**
 * Service for generating or retrieving images for articles
 */
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
      // Create a unique seed based on multiple article attributes to ensure uniqueness
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
      
      // Use Lorem Picsum with a seed and randomize the image category
      // By changing the seed for each article, we get different images
      const imageUrl = `https://picsum.photos/seed/${seed}/1200/630`;
      
      console.log('Generated image URL:', imageUrl);
      console.log('Image seed generated from:', uniqueIdentifier);
      
      // For a proper implementation, here you would call an API like DALL-E or Stable Diffusion
      // const response = await fetch('https://api.openai.com/v1/images/generations', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      //   },
      //   body: JSON.stringify({
      //     prompt: `A modern art piece about ${topic} and ${tags.join(', ')}. ${title}`,
      //     n: 1,
      //     size: '1024x1024'
      //   })
      // });
      // const data = await response.json();
      // return data.data[0].url;
      
      return imageUrl;
    } catch (error) {
      console.error('Failed to generate image:', error);
      return undefined;
    }
  }
} 