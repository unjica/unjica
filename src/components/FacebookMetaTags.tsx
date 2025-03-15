'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface FacebookMetaTagsProps {
  url: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  type?: string;
}

/**
 * Component to add Facebook meta tags to the page
 * This is a client component that adds the meta tags dynamically
 */
export function FacebookMetaTags({
  url,
  title,
  description,
  imageUrl,
  type = 'website'
}: FacebookMetaTagsProps) {
  useEffect(() => {
    // Add meta tags dynamically
    const metaTags = [
      { property: 'og:url', content: url },
      { property: 'og:type', content: type }
    ];

    if (title) {
      metaTags.push({ property: 'og:title', content: title });
    }

    if (description) {
      metaTags.push({ property: 'og:description', content: description });
    }

    if (imageUrl) {
      metaTags.push({ property: 'og:image', content: imageUrl });
    }

    // Add meta tags to head
    const head = document.head;
    const existingTags: HTMLMetaElement[] = [];

    metaTags.forEach(tag => {
      // Check if tag already exists
      const existingTag = document.querySelector(`meta[property="${tag.property}"]`) as HTMLMetaElement;
      
      if (existingTag) {
        // Update existing tag
        existingTag.content = tag.content;
        existingTags.push(existingTag);
      } else {
        // Create new tag
        const metaTag = document.createElement('meta');
        metaTag.setAttribute('property', tag.property);
        metaTag.setAttribute('content', tag.content);
        head.appendChild(metaTag);
        existingTags.push(metaTag);
      }
    });

    // Cleanup function to remove tags when component unmounts
    return () => {
      existingTags.forEach(tag => {
        if (tag && tag.parentNode) {
          tag.parentNode.removeChild(tag);
        }
      });
    };
  }, [url, title, description, imageUrl, type]);

  return null;
} 