import { Metadata } from 'next';
import ArticleClient from './ArticleClient';
import { getArticleData } from './utils';

interface ArticlePageProps {
  params: { slug: string };
}

// Server component that generates metadata
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = params;
  const article = await getArticleData(slug);
  
  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.'
    };
  }
  
  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://unjica.com'}/art-news/digest/${article.slug || slug}`,
      siteName: 'AI Art Digest',
      images: article.imageUrl ? [
        {
          url: article.imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        }
      ] : [],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: article.imageUrl ? [article.imageUrl] : [],
    }
  };
}

// Server component that pre-fetches data and renders the client component
export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = params;
  const article = await getArticleData(slug);
  
  return (
    <>
      {/* Server-side rendered hidden image for crawlers */}
      {article && article.imageUrl && (
        <div style={{ display: 'none' }} data-testid="og-image-container">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            width="1200" 
            height="630" 
            property="og:image" 
          />
          <meta property="og:image" content={article.imageUrl} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:title" content={article.title} />
          <meta property="og:description" content={article.summary} />
          <meta name="twitter:image" content={article.imageUrl} />
        </div>
      )}
      
      {/* Pass pre-fetched article to client component */}
      <ArticleClient slug={slug} initialArticle={article} />
    </>
  );
} 