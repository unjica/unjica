import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

// Type with extra fields
type GeneratedArticleWithExtras = Prisma.GeneratedArticleGetPayload<{}> & {
  imageUrl?: string | null;
  slug?: string | null;
};

// Define the type for sitemap routes
interface SitemapRoute {
  url: string;
  lastModified: string;
  changeFrequency: string;
  priority: number;
}

export async function GET() {
  try {
    // Get base URL from environment or default to localhost
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    // Define static routes
    const staticRoutes: SitemapRoute[] = [
      {
        url: `${baseUrl}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1.0
      },
      {
        url: `${baseUrl}/`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'hourly',
        priority: 0.9
      }
    ];
    
    // Get all articles for dynamic routes
    const articles = await prisma.generatedArticle.findMany({
      orderBy: {
        publishedAt: 'desc'
      }
    });
    
    // Create article routes
    const articleRoutes: SitemapRoute[] = articles.map(article => {
      // Cast to our extended type to access all fields
      const typedArticle = article as GeneratedArticleWithExtras;
      
      return {
        url: `${baseUrl}/art-news/digest/${typedArticle.slug || typedArticle.id}`,
        lastModified: article.lastUpdated.toISOString(),
        changeFrequency: 'weekly',
        priority: 0.8
      };
    });
    
    // Combine all routes
    const allRoutes = [...staticRoutes, ...articleRoutes];
    
    // Generate XML content
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allRoutes.map(route => `
  <url>
    <loc>${route.url}</loc>
    <lastmod>${route.lastModified}</lastmod>
    <changefreq>${route.changeFrequency}</changefreq>
    <priority>${route.priority}</priority>
  </url>
  `).join('')}
</urlset>`;
    
    // Return XML response
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}

// Make this API route dynamic to avoid caching
export const dynamic = 'force-dynamic'; 