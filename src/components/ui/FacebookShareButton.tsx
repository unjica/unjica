'use client';

import { useEffect, useState } from 'react';

interface FacebookShareButtonProps {
  url: string;
  quote?: string;
  hashtag?: string;
  className?: string;
}

export function FacebookShareButton({
  url,
  quote,
  hashtag,
  className = 'inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
}: FacebookShareButtonProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleShare = () => {
    if (typeof window !== 'undefined' && window.FB) {
      window.FB.ui({
        method: 'share',
        href: url,
        quote: quote,
        hashtag: hashtag ? `#${hashtag.replace(/^#/, '')}` : undefined,
      });
    } else {
      // Fallback if FB SDK is not loaded
      const shareUrl = new URL('https://www.facebook.com/sharer/sharer.php');
      shareUrl.searchParams.append('u', url);
      if (quote) shareUrl.searchParams.append('quote', quote);
      if (hashtag) shareUrl.searchParams.append('hashtag', `#${hashtag.replace(/^#/, '')}`);
      
      window.open(shareUrl.toString(), '_blank', 'width=600,height=400');
    }
  };

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <button 
      onClick={handleShare}
      className={className}
      aria-label="Share on Facebook"
    >
      <svg 
        className="w-5 h-5 mr-2" 
        fill="currentColor" 
        viewBox="0 0 24 24" 
        aria-hidden="true"
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
      Share
    </button>
  );
} 