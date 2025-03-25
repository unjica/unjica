import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';
import React from 'react';

// Type with extra fields
type GeneratedArticleWithExtras = Prisma.GeneratedArticleGetPayload<{}> & {
  imageUrl?: string | null;
  slug?: string | null;
};

export const runtime = 'edge';
export const alt = 'AI Art Digest';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string[] } | Promise<{ slug: string[] }> }) {
  try {
    // Unwrap params if it's a Promise
    const resolvedParams = params instanceof Promise ? await params : params;
    const [_, articleSlug] = resolvedParams.slug;
    
    // Fetch the article data
    const article = await prisma.generatedArticle.findFirst({
      where: { 
        slug: articleSlug
      } as any
    });
    
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
    
    // Cast to our extended type to access all fields
    const typedArticle = article as GeneratedArticleWithExtras;
    
    // Parse the tags
    const tags = JSON.parse(article.tags);
    
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
            {article.title}
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
  } catch (error) {
    console.error('Error generating OpenGraph image:', error);
    
    // Fallback image if there's an error
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
        </div>
      ),
      { ...size }
    );
  }
} 