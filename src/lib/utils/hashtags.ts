/**
 * Generates hashtags for an article
 * @param article The article to generate hashtags for
 * @returns A string of hashtags
 */
export const generateHashtags = (article: any) => {
    const hashtags = ['#art', '#artwork', '#modernart', '#contemporaryart', '#abstractart', '#popart'];
    
    // Add artist name as hashtag if available
    if (article.artist) {
      hashtags.push(`#${article.artist.replace(/\s+/g, '')}`);
    }
    
    // Add period/movement as hashtag if available
    if (article.period) {
      hashtags.push(`#${article.period.replace(/\s+/g, '')}`);
    }
    
    // Add style as hashtag if available
    if (article.style) {
      hashtags.push(`#${article.style.replace(/\s+/g, '')}`);
    }

    hashtags.push(`#${article.primaryTopic.replace(/\s+/g, '').toLowerCase()}`);

    return hashtags.join(' ');
  };