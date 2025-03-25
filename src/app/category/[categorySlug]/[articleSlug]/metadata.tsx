import { Metadata, ResolvingMetadata } from 'next';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

// Type with extra fields
type GeneratedArticleWithExtras = Prisma.GeneratedArticleGetPayload<{}> & {
  imageUrl?: string | null;
  slug?: string | null;
};

interface Props {
  params: { 
    slug: string[];
  };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const [categorySlug, articleSlug] = params.slug;
  
  // Fetch the article data
  try {
    const article = await prisma.generatedArticle.findFirst({
      where: { 
        slug: articleSlug
      } as any
    });
    
    if (!article) {
      return {
        title: 'Article Not Found | AI Art Digest',
        description: 'The requested article could not be found.'
      };
    }
    
    // Cast to our extended type to access all fields
    const typedArticle = article as GeneratedArticleWithExtras;
    const tags = JSON.parse(article.tags);
    
    // Get base URL for canonical and OG URLs
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/category/${categorySlug}/${articleSlug}`;
    
    // Get the image URL - either from the article or generate a dynamic OG image URL
    const ogImageUrl = typedArticle.imageUrl || `${baseUrl}/category/${categorySlug}/${articleSlug}/opengraph-image`;
    
    // Get Facebook App ID from environment variables
    const fbAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '';
    
    return {
      title: `${article.title} | AI Art Digest`,
      description: article.summary,
      keywords: tags,
      authors: [{ name: 'AI Art Digest' }],
      publisher: 'AI Art Digest',
      openGraph: {
        title: article.title,
        description: article.summary,
        url,
        siteName: 'AI Art Digest',
        locale: 'en_US',
        type: 'article',
        publishedTime: article.publishedAt.toISOString(),
        modifiedTime: article.lastUpdated.toISOString(),
        section: 'Art News',
        tags,
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `${article.title} | AI Art Digest`,
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.summary,
        creator: '@AIArtDigest',
        images: [ogImageUrl]
      },
      alternates: {
        canonical: url,
      },
      other: {
        'fb:app_id': fbAppId,
        'og:url': url,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    
    // Fallback metadata
    return {
      title: 'AI Art Digest',
      description: 'Discover the latest in art news and trends.',
    };
  }
} 