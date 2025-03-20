import { GeneratedArticle } from '@/lib/agents/models/generatedArticle';
import { generateHashtags } from '../utils/hashtags';

/**
 * Service for interacting with Facebook API
 */
export class FacebookService {
  private static accessToken: string | undefined = process.env.FACEBOOK_ACCESS_TOKEN;
  private static pageId: string | undefined = process.env.FACEBOOK_PAGE_ID;
  
  /**
   * Posts a new article to the Facebook page
   * @param article The generated article to post
   * @returns Object containing success status and message or error
   */
  public static async postToFacebookPage(article: GeneratedArticle): Promise<{ success: boolean; message: string; error?: any }> {
    try {
      // Check if Facebook credentials are configured
      if (!this.accessToken || !this.pageId) {
        console.warn('Facebook credentials not configured. Skipping Facebook post.');
        return {
          success: false,
          message: 'Facebook credentials not configured. Skipping Facebook post.'
        };
      }
      
      // Create the post message
      const postMessage = this.createPostMessage(article);
      
      // Create the URL to the article - using the correct path structure
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const articleUrl = `${baseUrl}/art-news/digest/${article.slug}`;
      
      // Use the Facebook Graph API directly with fetch
      const url = `https://graph.facebook.com/v18.0/${this.pageId}/feed`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: postMessage,
          link: articleUrl,
          access_token: this.accessToken,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Facebook API error: ${JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      console.log('Successfully posted to Facebook:', data);
      
      return {
        success: true,
        message: `Successfully posted to Facebook. Post ID: ${data.id}`
      };
    } catch (error) {
      console.error('Error posting to Facebook:', error);
      return {
        success: false,
        message: 'Failed to post to Facebook',
        error
      };
    }
  }
  
  /**
   * Creates a formatted message for the Facebook post
   * @param article The article to create a message for
   * @returns Formatted message string
   */
  private static createPostMessage(article: GeneratedArticle): string {
    const hashtags = generateHashtags(article);
    return `🎨 ${article.title}\n\n${article.summary}\n\nRead more: ${process.env.NEXT_PUBLIC_BASE_URL}/art/${article.slug}\n\n${hashtags}`;
  }
} 