import { ImageResponse } from 'next/og';
import React from 'react';
import { getArticleData } from './utils';

export const runtime = 'edge';
export const alt = 'AI Art Digest';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const article = await getArticleData(params.slug);
  
  // If no article, return generic fallback
  if (!article) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 32,
            textAlign: 'center',
            color: 'white',
          }}
        >
          <div style={{ fontSize: 48, fontWeight: 'bold', marginBottom: 24 }}>
            AI Art Digest
          </div>
          <div style={{ fontSize: 32 }}>Article not found</div>
        </div>
      ),
      { ...size }
    );
  }
  
  // Try to get tags
  let tags = [];
  try {
    tags = article.tags || [];
  } catch (e) {
    console.error('Error parsing tags:', e);
  }
  
  // If article has an image URL, create a generic card with the title that references the image URL
  const title = article.title || 'AI Art Digest Article';
  
  // If the article has no image, generate a card with the title and tags
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 32,
          textAlign: 'center',
          color: 'white',
        }}
      >
        <div style={{ fontSize: 24, marginBottom: 16 }}>
          AI ART DIGEST
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 'bold',
            marginBottom: 24,
            maxWidth: '80%',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 24,
            marginTop: 24,
            display: 'flex',
            gap: 8,
          }}
        >
          {tags.slice(0, 3).map((tag: string) => (
            <div
              key={tag}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '4px 12px',
                borderRadius: 16,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
} 