import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const defaultMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Modern Art News | Contemporary Art Insights',
  description: 'Stay updated with the latest in contemporary art. Modern Art News brings you curated insights, trends, and stories from the world of modern art. Join our waitlist for exclusive access.',
  keywords: 'modern art, contemporary art, art news, art insights, art trends, art community, art newsletter',
  openGraph: {
    title: 'Modern Art News - Your Source for Contemporary Art Insights',
    description: 'Stay ahead in the world of modern art. Join our community for curated insights and exclusive updates on contemporary art trends and news.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Modern Art News',
    images: [
      {
        url: '/Unjica LOGO.jpeg',
        width: 1200,
        height: 630,
        alt: 'Modern Art News - Contemporary Art Insights',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modern Art News - Contemporary Art Insights',
    description: 'Your curated source for modern art news and insights. Join our community today.',
    images: ['/Unjica LOGO.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default defaultMetadata; 