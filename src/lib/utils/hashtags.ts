import { GeneratedArticle } from "../agents/models/generatedArticle";

/**
 * Generates hashtags for an article
 * @param article The article to generate hashtags for
 * @returns A string of hashtags
 */
export const generateHashtags = (article: GeneratedArticle) => {
    const hashtags = ['#art', '#artwork', '#modernart', '#contemporaryarts', '#abstractart', '#popart', '#artists'];
    
    // Add tags as hashtags if available
    if (article.tags) {
      hashtags.push(...article.tags.map(tag => `#${tag.replace(/\s+/g, '').toLowerCase()}`));
    }

    // Add topic as hashtag if available
    if (article.primaryTopic) {
      hashtags.unshift(`#${article.primaryTopic.replace(/\s+/g, '').toLowerCase()}`);
    }

    return hashtags.join(' ');
  };