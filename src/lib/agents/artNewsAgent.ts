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
  private MAX_API_RESULTS = 100; // News API free tier limit
  
  /**
   * Fetches modern art news from News API or returns mock data if API key not available
   * @param page Page number to fetch
   * @param pageSize Number of items per page
   * @returns Object containing news items and pagination info
   */
  async getModernArtNews(page: number = 1, pageSize: number = 10): Promise<ArtNewsResponse> {
    // Ensure valid parameters
    page = Math.max(1, page);
    pageSize = Math.max(1, Math.min(100, pageSize)); // Limit page size between 1 and 100
    
    // Get the true page count from mock data for consistency
    const mockTotalPages = this.getMockTotalPages(pageSize);
    
    // Calculate if we're exceeding the News API limit with this request
    const startItem = (page - 1) * pageSize + 1;
    if (startItem > this.MAX_API_RESULTS) {
      console.log(`Request exceeds News API limit (${startItem} > ${this.MAX_API_RESULTS}), using mock data`);
      return this.getMockData(page, pageSize);
    }
    
    const cacheKey = `art-news-${page}-${pageSize}`;
    const cachedData = this.cache.get(cacheKey);
    
    // Return cached data if valid
    if (cachedData && Date.now() - cachedData.timestamp < this.CACHE_DURATION) {
      console.log('Using cached art news data');
      return cachedData.data;
    }
    
    console.log(`Fetching art news, page ${page}, pageSize ${pageSize}`);
    
    // Fetch from API if key is available, otherwise use mock data
    let newsData: ArtNewsResponse;
    try {
      if (this.API_KEY) {
        newsData = await this.fetchFromNewsApi(page, pageSize);
        
        // IMPORTANT: Always limit totalPages to what we can actually provide
        // This ensures clients don't see pagination buttons that can't work
        if (newsData.totalPages > mockTotalPages) {
          console.log(`Limiting reported totalPages from ${newsData.totalPages} to ${mockTotalPages} based on available data`);
          newsData.totalPages = mockTotalPages;
        }
      } else {
        newsData = this.getMockData(page, pageSize);
      }
      
      // Ensure the response has the correct structure
      newsData = {
        news: newsData.news || [],
        totalItems: newsData.totalItems || 0,
        page: page,
        pageSize: pageSize,
        totalPages: newsData.totalPages || 1
      };
      
      // Cache the results
      this.cache.set(cacheKey, {
        data: newsData,
        timestamp: Date.now()
      });
      
      return newsData;
    } catch (error) {
      console.error('Error in getModernArtNews:', error);
      // Return empty data with correct structure on error
      return {
        news: [],
        totalItems: 0,
        page: page,
        pageSize: pageSize,
        totalPages: 1
      };
    }
  }
  
  /**
   * Fetches news from the News API
   */
  private async fetchFromNewsApi(page: number, pageSize: number): Promise<ArtNewsResponse> {
    try {
      // Get the true page count from mock data for consistent pagination
      const mockTotalPages = this.getMockTotalPages(pageSize);
      const mockTotalItems = mockTotalPages * pageSize;
      
      const query = encodeURIComponent('modern art OR contemporary art OR art exhibition');
      const url = `${process.env.NEWS_API_BASE_URL || 'https://newsapi.org/v2'}/everything?q=${query}&language=en&sortBy=publishedAt&page=${page}&pageSize=${pageSize}&apiKey=${this.API_KEY}`;
      
      console.log(`Fetching from News API: page=${page}, pageSize=${pageSize}`);
      
      const response = await fetch(url, { 
        headers: { 'User-Agent': 'Unjica Art News Application' },
        next: { revalidate: 3600 } // Revalidate once per hour
      });
      
      if (!response.ok) {
        const text = await response.text();
        
        // Check if error is related to exceeding the results limit
        if (text.includes('maximumResultsReached') || text.includes('You have requested too many results')) {
          console.log('Hit maximum results limit, using mock data with limited page count');
          // When we hit maximum results, we should return mock data
          // BUT use the actual mock data page count (not what the API might report)
          const mockResponse = this.getMockData(page, pageSize);
          
          // If the requested page is beyond the mock data limit, adjust to the last page
          if (page > mockResponse.totalPages) {
            console.log(`Requested page ${page} exceeds mock data total pages ${mockResponse.totalPages}, adjusting`);
            return this.getMockData(mockResponse.totalPages, pageSize);
          }
          
          return mockResponse;
        }
        
        throw new Error(`News API error: ${response.status} ${text}`);
      }
      
      const data: NewsApiResponse = await response.json();
      
      if (data.status !== 'ok') {
        throw new Error(`News API error: ${data.status}`);
      }
      
      // Transform the API response to our internal format
      const news = data.articles.map(article => this.transformArticle(article));
      
      // IMPORTANT: Always use the mock data's total pages count for consistency
      // This ensures pagination remains consistent even when API data suggests more pages
      const totalItems = Math.min(data.totalResults, mockTotalItems);
      const totalPages = mockTotalPages;
      
      console.log(`API reports ${data.totalResults} results, but we're limiting to ${totalItems} items and ${totalPages} pages for consistency`);
      
      return {
        news,
        totalItems,
        page,
        pageSize,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching from News API:', error);
      
      // Fallback to mock data if API fails
      return this.getMockData(page, pageSize);
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
  
  /**
   * Gets the total number of pages in mock data without creating the full array
   */
  private getMockTotalPages(pageSize: number): number {
    // Set total mock items to exactly 25 (5 hand-crafted + 20 generated)
    const totalMockItems = 25;
    // Force to exactly 3 pages regardless of page size
    return 3;
  }

  /**
   * Provides mock data when API is not available
   */
  private getMockData(page: number, pageSize: number): ArtNewsResponse {
    // Define the exact number of total mock items
    const TOTAL_MOCK_ITEMS = 25;
    
    // Create a fixed-size mock array with 5 hand-crafted items + exactly 20 generated ones
    const mockNews: ArtNewsItem[] = [
      // First 5 hand-crafted items
      {
        id: 'mock-1',
        title: 'New Exhibition Showcases Modern Abstract Art',
        description: 'A groundbreaking exhibition featuring works from emerging artists in the abstract expressionism movement opens this weekend at the Metropolitan Gallery.',
        source: 'Art Daily',
        url: 'https://example.com/article1',
        publishedAt: new Date().toISOString(),
        imageUrl: 'https://example.com/images/abstract-art.jpg',
        tags: ['exhibition', 'abstract expressionism', 'modern art']
      },
      {
        id: 'mock-2',
        title: 'Digital Art Installations Transform City Square',
        description: 'Interactive digital art installations have transformed the main city square, allowing visitors to engage with art through technology.',
        source: 'Tech Art Review',
        url: 'https://example.com/article2',
        publishedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        imageUrl: 'https://example.com/images/digital-installation.jpg',
        tags: ['digital art', 'installation', 'interactive', 'modern art']
      },
      {
        id: 'mock-3',
        title: 'Retrospective Exhibition Celebrates Influential Sculptor',
        description: 'A major retrospective celebrating the work of influential sculptor Maria Rodriguez spans five decades of groundbreaking art.',
        source: 'Sculpture Monthly',
        url: 'https://example.com/article3',
        publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        imageUrl: 'https://example.com/images/sculpture-exhibit.jpg',
        tags: ['sculpture', 'retrospective', 'exhibition', 'modern art']
      },
      {
        id: 'mock-4',
        title: 'New Photography Collection Examines Urban Landscapes',
        description: 'A striking new photography collection focuses on changing urban landscapes and the relationship between architecture and nature.',
        source: 'Photography Today',
        url: 'https://example.com/article4',
        publishedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        imageUrl: 'https://example.com/images/urban-photography.jpg',
        tags: ['photography', 'urban landscape', 'modern art']
      },
      {
        id: 'mock-5',
        title: 'Museum Acquires Important Contemporary Art Collection',
        description: 'The National Gallery has acquired an important collection of contemporary artworks, significantly expanding its modern art holdings.',
        source: 'Museum Gazette',
        url: 'https://example.com/article5',
        publishedAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        imageUrl: 'https://example.com/images/contemporary-collection.jpg',
        tags: ['contemporary art', 'museum', 'acquisition', 'modern art']
      },
      // Add exactly 20 more mock items to complete our 25 total
      ...Array.from({ length: 20 }, (_, index) => ({
        id: `mock-extended-${index + 1}`,
        title: `Art News Article #${index + 6}`,
        description: `This is a generated mock article to test pagination. Article number ${index + 6}.`,
        source: 'Art News Source',
        url: `https://example.com/article-${index + 6}`,
        publishedAt: new Date(Date.now() - (432000000 + index * 86400000)).toISOString(),
        imageUrl: `https://placehold.co/600x400?text=Art+Article+${index + 6}`,
        tags: ['modern art', 'mock data', index % 2 === 0 ? 'exhibition' : 'gallery']
      }))
    ];
    
    // Make sure we have exactly TOTAL_MOCK_ITEMS items
    const finalMockNews = mockNews.slice(0, TOTAL_MOCK_ITEMS);
    
    // Calculate pagination values - force to exactly 3 pages
    const totalItems = finalMockNews.length; // Should be exactly 25
    const totalPages = 3; // Force to 3 pages
    
    // Calculate the items per page for each of our 3 pages
    const itemsPerPage = Math.ceil(totalItems / totalPages);
    
    // Calculate correct slice for pagination
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const paginatedNews = finalMockNews.slice(startIndex, endIndex);
    
    console.log(`Mock data: page=${page}, totalItems=${totalItems}, totalPages=${totalPages}, showing ${paginatedNews.length} items (items per page: ${itemsPerPage})`);
    
    return {
      news: paginatedNews,
      totalItems: totalItems,
      page: page,
      pageSize: itemsPerPage,
      totalPages: totalPages
    };
  }
}

// Singleton factory function to get the agent instance
let instance: ArtNewsAgent | null = null;

export function getArtNewsAgent(): ArtNewsAgent {
  if (!instance) {
    instance = new ArtNewsAgent();
  }
  return instance;
} 