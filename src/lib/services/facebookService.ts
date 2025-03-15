import { GeneratedArticle } from '@/lib/agents/models/generatedArticle';
import { BusinessDataAPI } from 'facebook-nodejs-business-sdk';

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
      
      // Create the URL to the article
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const articleUrl = `${baseUrl}/digest/${article.slug}`;
      
      // Initialize the Facebook API
      const api = new BusinessDataAPI(this.accessToken);
      
      // Post to Facebook page
      const response = await api.call('POST', `/${this.pageId}/feed`, {
        message: postMessage,
        link: articleUrl,
      });
      
      console.log('Successfully posted to Facebook:', response);
      
      return {
        success: true,
        message: `Successfully posted to Facebook. Post ID: ${response.id}`
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
    // Create a message with the article title, summary, and hashtags
    const hashtags = article.tags.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ');
    
    return `🎨 New Art Digest: ${article.title}\n\n${article.summary}\n\n${hashtags}\n\nRead more on our website!`;
  }
} 