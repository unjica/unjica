import { ArtNewsItem } from './artNewsAgent';

/**
 * Content patterns for generating article titles
 */
const TITLE_TEMPLATES = [
  "Modern Art Roundup: {primaryTopic} Trends This Week",
  "The Pulse of Art: {primaryTopic} Highlights",
  "Art Scene Update: {primaryTopic} in Focus",
  "Contemporary Movements: The Rise of {primaryTopic}",
  "This Week in Modern Art: {primaryTopic} Takes Center Stage",
  "Art World Insights: {primaryTopic} and Beyond",
  "Creative Frontiers: Exploring {primaryTopic} in Modern Art"
];

/**
 * Content patterns for generating article introductions
 */
const INTRO_TEMPLATES = [
  "The modern art world continues to evolve with {primaryTopic} gaining significant attention across major galleries and exhibitions. Our latest analysis reveals several important developments worth noting.",
  "Recent developments in the realm of {primaryTopic} have sparked conversations among critics and enthusiasts alike. This week's art news brings several noteworthy insights.",
  "The intersection of {primaryTopic} and traditional art practices has created a fascinating dialogue in recent exhibitions. Our team has analyzed the latest trends to bring you this comprehensive update.",
  "As {primaryTopic} continues to shape contemporary art discourse, several key developments have emerged this week that signal important shifts in the creative landscape."
];

/**
 * Art Content Generator Agent - Analyzes art news and generates new content
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
   * Generates a summary paragraph based on key information from news items
   */
  private generateSummaryParagraph(newsItems: ArtNewsItem[], analysis: ReturnType<typeof this.analyzeNews>): string {
    // Extract important information from the first few articles
    const recentArticles = newsItems.slice(0, 5);
    
    let summary = '';
    
    // Add information about events if we have them
    if (analysis.recentEvents.length > 0) {
      summary += `Recent highlights include ${analysis.recentEvents[0].replace(/^[^:]*:\s*/, '')}. `;
      
      if (analysis.recentEvents.length > 1) {
        summary += `Additionally, art enthusiasts are taking notice of ${analysis.recentEvents[1].replace(/^[^:]*:\s*/, '')}. `;
      }
    }
    
    // Add information about themes
    if (analysis.keyThemes.length > 0) {
      summary += `Key themes emerging in the current art landscape include ${analysis.keyThemes.slice(0, 3).join(', ')}. `;
    }
    
    // Add a synthesized insight
    summary += `Critics from ${analysis.topSources.join(' and ')} note that the intersection of technology and traditional art practices continues to reshape how we experience and value creative expression. `;
    
    return summary;
  }
  
  /**
   * Generates a detailed section based on the news items
   */
  private generateDetailSection(newsItems: ArtNewsItem[]): string {
    if (newsItems.length === 0) return '';
    
    let detail = "## Recent Developments\n\n";
    
    // Get the top 3 most substantial news items (based on description length)
    const substantialNews = [...newsItems]
      .sort((a, b) => (b.description?.length || 0) - (a.description?.length || 0))
      .slice(0, 3);
    
    substantialNews.forEach((item, index) => {
      detail += `### ${item.title}\n\n`;
      detail += `${item.description}\n\n`;
      
      if (index < substantialNews.length - 1) {
        detail += "The implications of this development extend beyond the immediate art scene, influencing how institutions approach curation and public engagement.\n\n";
      }
    });
    
    return detail;
  }
  
  /**
   * Generates a conclusion paragraph
   */
  private generateConclusion(analysis: ReturnType<typeof this.analyzeNews>): string {
    return `As ${analysis.primaryTopic} continues to evolve, artists and institutions alike are finding new ways to engage with audiences and push creative boundaries. The coming weeks will likely reveal further developments in these emerging trends, particularly as major exhibitions prepare for seasonal transitions and new voices enter the conversation.`;
  }
  
  /**
   * Generates a new article based on a collection of news items
   * @param newsItems Array of art news items to analyze and synthesize
   * @returns A generated article with title, content and metadata
   */
  generateArticle(newsItems: ArtNewsItem[]): {
    title: string;
    content: string;
    primaryTopic: string;
    tags: string[];
    publishedAt: string;
  } {
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
    
    // Generate title using a template
    const titleTemplate = TITLE_TEMPLATES[Math.floor(Math.random() * TITLE_TEMPLATES.length)];
    const title = titleTemplate.replace('{primaryTopic}', analysis.primaryTopic);
    
    // Generate introduction
    const introTemplate = INTRO_TEMPLATES[Math.floor(Math.random() * INTRO_TEMPLATES.length)];
    const introduction = introTemplate.replace('{primaryTopic}', analysis.primaryTopic.toLowerCase());
    
    // Generate the main content sections
    const summary = this.generateSummaryParagraph(newsItems, analysis);
    const detailSection = this.generateDetailSection(newsItems);
    const conclusion = this.generateConclusion(analysis);
    
    // Assemble the full content
    const content = `
# ${title}

${introduction}

## Summary

${summary}

${detailSection}

## Looking Ahead

${conclusion}

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
      title,
      content,
      primaryTopic: analysis.primaryTopic,
      tags: [...new Set(tags)], // Remove duplicates
      publishedAt: new Date().toISOString()
    };
  }
}

// Singleton instance
export const artContentGeneratorAgent = new ArtContentGeneratorAgent(); 