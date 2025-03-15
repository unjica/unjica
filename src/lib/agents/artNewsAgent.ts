/**
 * Represents an art news item
 */
export interface ArtNewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt: string;
  imageUrl?: string;
  tags: string[];
}

/**
 * Interface for news API response
 */
interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}

/**
 * Interface for raw article from News API
 */
interface NewsApiArticle {
  title?: string;
  description?: string;
  content?: string;
  url?: string;
  urlToImage?: string;
  publishedAt?: string;
  source?: {
    name?: string;
  };
}

/**
 * Interface for the response from getModernArtNews
 */
export interface ArtNewsResponse {
  news: ArtNewsItem[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Modern Art News Agent - Fetches and processes art news
 */
export class ArtNewsAgent {
  private API_KEY: string | null = process.env.NEWS_API_KEY || null;
  private cache: Map<string, { data: ArtNewsResponse; timestamp: number }> = new Map();
  private CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
  
  /**
   * Fetches modern art news from News API
   * @param page Page number to fetch
   * @param pageSize Number of items per page
   * @returns Object containing news items and pagination info
   */
  async getModernArtNews(page: number = 1, pageSize: number = 10): Promise<ArtNewsResponse> {
    // Ensure valid parameters
    page = Math.max(1, page);
    pageSize = Math.max(1, Math.min(100, pageSize)); // Limit page size between 1 and 100
    
    if (!this.API_KEY) {
      console.error('No News API key available. Please provide a valid API key.');
      throw new Error('API key not configured for News API');
    }
    
    const cacheKey = `art-news-${page}-${pageSize}`;
    const cachedData = this.cache.get(cacheKey);
    
    // Return cached data if valid
    if (cachedData && Date.now() - cachedData.timestamp < this.CACHE_DURATION) {
      console.log('Using cached art news data');
      return cachedData.data;
    }
    
    console.log(`Fetching art news, page ${page}, pageSize ${pageSize}`);
    
    try {
      // Fetch news from API
      const newsData = await this.fetchFromNewsApi(page, pageSize);
      
      // Cache the results
      this.cache.set(cacheKey, {
        data: newsData,
        timestamp: Date.now()
      });
      
      return newsData;
    } catch (error) {
      console.error('Error in getModernArtNews:', error);
      throw error; // Propagate the error instead of returning mock data
    }
  }
  
  /**
   * Fetches news from the News API
   */
  private async fetchFromNewsApi(page: number, pageSize: number): Promise<ArtNewsResponse> {
    try {
      const query = encodeURIComponent('modern art OR contemporary art OR art exhibition');
      const url = `${process.env.NEWS_API_BASE_URL || 'https://newsapi.org/v2'}/everything?q=${query}&language=en&sortBy=publishedAt&page=${page}&pageSize=${pageSize}&apiKey=${this.API_KEY}`;
      
      console.log(`Fetching from News API: page=${page}, pageSize=${pageSize}`);
      
      const response = await fetch(url, { 
        headers: { 'User-Agent': 'Unjica Art News Application' },
        next: { revalidate: 3600 } // Revalidate once per hour
      });
      
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`News API error: ${response.status} ${text}`);
      }
      
      const data: NewsApiResponse = await response.json();
      
      if (data.status !== 'ok') {
        throw new Error(`News API error: ${data.status}`);
      }
      
      // Transform the API response to our internal format
      const news = data.articles.map(article => this.transformArticle(article));
      
      const totalItems = data.totalResults;
      const totalPages = Math.ceil(totalItems / pageSize);
      
      return {
        news,
        totalItems,
        page,
        pageSize,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching from News API:', error);
      throw error; // Propagate the error instead of falling back to mock data
    }
  }
  
  /**
   * Transforms a raw article from the API to our internal format
   */
  private transformArticle(article: NewsApiArticle): ArtNewsItem {
    // Extract potential tags from the content or description
    const content = article.content || article.description || '';
    const potentialTags = this.extractTags(content);
    
    // Always include some art-related tags
    const baseTags = ['modern art'];
    
    // Add specific tags if they appear in the title or content
    if (article.title?.toLowerCase().includes('exhibition')) baseTags.push('exhibition');
    if (content.toLowerCase().includes('gallery')) baseTags.push('gallery');
    if (content.toLowerCase().includes('museum')) baseTags.push('museum');
    
    // Combine all tags and remove duplicates
    const tags = [...new Set([...baseTags, ...potentialTags])];
    
    return {
      id: article.url || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: article.title || 'Untitled Art News',
      description: article.description || 'No description available',
      source: article.source?.name || 'Art News Source',
      url: article.url || '#',
      publishedAt: article.publishedAt || new Date().toISOString(),
      imageUrl: article.urlToImage || undefined,
      tags
    };
  }
  
  /**
   * Extracts potential tags from content text
   */
  private extractTags(content: string): string[] {
    const artTerms = [
      'painting', 'sculpture', 'installation', 'performance', 'digital art',
      'photography', 'contemporary', 'abstract', 'expressionism', 'modernism',
      'impressionism', 'conceptual', 'mixed media', 'gallery', 'exhibition',
      'artist', 'curator', 'museum'
    ];
    
    return artTerms.filter(term => 
      content.toLowerCase().includes(term.toLowerCase())
    );
  }
}

/**
 * Singleton instance for the art news agent
 */
export function getArtNewsAgent(): ArtNewsAgent {
  return new ArtNewsAgent();
} 