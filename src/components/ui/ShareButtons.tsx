'use client';

import { FacebookShareButton } from './FacebookShareButton';

interface ShareButtonsProps {
  url: string;
  title: string;
  summary?: string;
  tags?: string[];
}

export function ShareButtons({ url, title, summary, tags }: ShareButtonsProps) {
  // Create a quote for Facebook sharing
  const quote = summary 
    ? `${title} - ${summary}` 
    : title;
  
  // Create a hashtag for Facebook sharing (using the first tag if available)
  const hashtag = tags && tags.length > 0 ? tags[0] : 'ModernArt';
  
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <FacebookShareButton 
        url={url} 
        quote={quote} 
        hashtag={hashtag} 
      />
      {/* You can add more share buttons here (Twitter, LinkedIn, etc.) */}
    </div>
  );
} 