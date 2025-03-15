import { ArtNewsItem } from './artNewsAgent';
import OpenAI from 'openai';

/**
 * OpenAI client for generating content
 */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Art Content Generator Agent - Analyzes art news and generates new content using OpenAI
 */
export class ArtContentGeneratorAgent {
  /**
   * Analyzes a collection of news items to identify primary topics and trends
   */
  private analyzeNews(newsItems: ArtNewsItem[]): { 
    primaryTopic: string; 
    keyThemes: string[];
    topSources: string[];
    recentEvents: string[];
  } {
    // Extract all tags and count occurrences to find primary topic
    const tagCount: Record<string, number> = {};
    const sources = new Set<string>();
    const themes = new Set<string>();
    const events: string[] = [];
    
    newsItems.forEach(item => {
      // Count tags
      item.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
        
        // Add to themes if not a location or medium
        if (!tag.match(/new york|london|paris|exhibition|digital|painting/i)) {
          themes.add(tag);
        }
      });
      
      // Add sources
      sources.add(item.source);
      
      // Check for exhibition or event mentions in title
      if (item.title.match(/exhibition|show|display|unveil|launch|open/i)) {
        events.push(item.title);
      }
    });
    
    // Find most common tag as primary topic
    let primaryTopic = 'contemporary art';
    let maxCount = 0;
    
    Object.entries(tagCount).forEach(([tag, count]) => {
      if (count > maxCount && tag !== 'modern art') {
        primaryTopic = tag;
        maxCount = count;
      }
    });
    
    // Capitalize primary topic
    primaryTopic = primaryTopic
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return {
      primaryTopic,
      keyThemes: Array.from(themes).slice(0, 5),
      topSources: Array.from(sources).slice(0, 3),
      recentEvents: events.slice(0, 3)
    };
  }
  
  /**
   * Extracts the most relevant information from news items to prepare for OpenAI prompt
   */
  private prepareNewsContext(newsItems: ArtNewsItem[]): string {
    let context = "";
    
    // Sort by recency
    const sortedItems = [...newsItems].sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    // Take the most recent 5 items
    const recentItems = sortedItems.slice(0, 5);
    
    // Format the news items as context for OpenAI
    recentItems.forEach((item, index) => {
      context += `ARTICLE ${index + 1}:\n`;
      context += `Title: ${item.title}\n`;
      context += `Source: ${item.source}\n`;
      context += `Description: ${item.description}\n`;
      context += `Tags: ${item.tags.join(', ')}\n\n`;
    });
    
    return context;
  }

  /**
   * Generates an article using OpenAI based on the collected news items
   */
  private async generateArticleWithOpenAI(newsItems: ArtNewsItem[], analysis: ReturnType<typeof this.analyzeNews>): Promise<{
    title: string;
    content: string;
  }> {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    const newsContext = this.prepareNewsContext(newsItems);
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an insightful art journalist writing articles about contemporary and modern art. 
            Create a well-structured, engaging article based on recent art news with a human touch - include your own opinions, 
            insights, and critique. The article should feel like it was written by a knowledgeable art enthusiast, not an AI.
            
            The primary topic is: ${analysis.primaryTopic}
            Key themes include: ${analysis.keyThemes.join(', ')}
            
            Use markdown formatting for the article structure. Include:
            - A catchy title (# Title)
            - Introduction section
            - Main content divided into meaningful sections with subheadings (## Subheading)
            - Your personal perspective and critical analysis
            - A conclusion section
            
            Tone: Conversational, insightful, with occasional wit and genuine enthusiasm for art
            Length: Approximately 800-1000 words`
          },
          {
            role: "user",
            content: `Here are some recent art news articles to base your article on:\n\n${newsContext}\n\nPlease create a human-like art article with your own perspective that discusses these recent developments in the art world, focusing especially on ${analysis.primaryTopic}.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const generatedContent = response.choices[0]?.message?.content || "";
      
      // Extract title from content (should be the first line with # prefix)
      const titleMatch = generatedContent.match(/^# (.+)$/m);
      const title = titleMatch ? titleMatch[1] : `${analysis.primaryTopic}: A Contemporary Art Perspective`;
      
      // Remove the title from the content as we'll use it separately
      const contentWithoutTitle = generatedContent.replace(/^# .+$/m, '').trim();
      
      return {
        title,
        content: contentWithoutTitle
      };
    } catch (error) {
      console.error('Error generating article with OpenAI:', error);
      throw error;
    }
  }
  
  /**
   * Generates a new article based on a collection of news items
   * @param newsItems Array of art news items to analyze and synthesize
   * @returns A generated article with title, content and metadata
   */
  async generateArticle(newsItems: ArtNewsItem[]): Promise<{
    title: string;
    content: string;
    primaryTopic: string;
    tags: string[];
    publishedAt: string;
  }> {
    if (newsItems.length === 0) {
      return {
        title: "Modern Art Weekly Digest",
        content: "No recent art news available for analysis. Check back soon for updates on the contemporary art scene.",
        primaryTopic: "Modern Art",
        tags: ["modern art", "art digest"],
        publishedAt: new Date().toISOString()
      };
    }
    
    // Analyze the news items
    const analysis = this.analyzeNews(newsItems);
    
    try {
      // Generate article using OpenAI
      const generated = await this.generateArticleWithOpenAI(newsItems, analysis);
      
      // Assemble the full content with title
      const content = `
# ${generated.title}

${generated.content}

---

*This article was generated based on recent art news from ${analysis.topSources.join(', ')} and other sources.*
      `.trim();
      
      // Generate tags by combining analysis themes with standard ones
      const tags = [
        'modern art',
        'art digest',
        analysis.primaryTopic.toLowerCase(),
        ...analysis.keyThemes.slice(0, 3)
      ];
      
      return {
        title: generated.title,
        content,
        primaryTopic: analysis.primaryTopic,
        tags: [...new Set(tags)], // Remove duplicates
        publishedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to generate article with OpenAI:', error);
      
      // Fall back to a basic article if OpenAI fails
      return {
        title: `${analysis.primaryTopic}: Recent Developments`,
        content: `
# ${analysis.primaryTopic}: Recent Developments

Due to technical limitations, we couldn't generate our usual in-depth analysis. 
Here's a brief overview of recent developments in ${analysis.primaryTopic}.

## Recent News

${newsItems.slice(0, 3).map(item => `- **${item.title}**: ${item.description}`).join('\n\n')}

---

*This article provides a summary of recent art news from ${analysis.topSources.join(', ')} and other sources.*
        `.trim(),
        primaryTopic: analysis.primaryTopic,
        tags: [...new Set(['modern art', 'art digest', analysis.primaryTopic.toLowerCase()])],
        publishedAt: new Date().toISOString()
      };
    }
  }
}

// Singleton instance
export const artContentGeneratorAgent = new ArtContentGeneratorAgent();