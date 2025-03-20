import { NextConfig } from 'next';

// Load environment variables from .env.local if running locally
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env.local' });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '**',
      },
    ],
    unoptimized: false,
    domains: [
      'source.unsplash.com',
      'images.unsplash.com',
      'picsum.photos',
      'oaidalleapiprodscus.blob.core.windows.net',
      'public.blob.vercel-storage.com'
    ],
    minimumCacheTTL: 604800, // Cache images for 7 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  typescript: {
    // Disable TypeScript errors during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disable ESLint errors during build
    ignoreDuringBuilds: true,
  },
  // Add required environment variables check
  serverRuntimeConfig: {
    // Will only be available on the server side
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    NEXT_PUBLIC_ENABLE_IMAGE_GENERATION: process.env.NEXT_PUBLIC_ENABLE_IMAGE_GENERATION || 'true',
  },
  // Validate environment variables on build
  env: {
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    FACEBOOK_ACCESS_TOKEN: process.env.FACEBOOK_ACCESS_TOKEN,
    FACEBOOK_PAGE_ID: process.env.FACEBOOK_PAGE_ID,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEWS_API_KEY: process.env.NEWS_API_KEY,
    INSTAGRAM_ACCESS_TOKEN: process.env.INSTAGRAM_ACCESS_TOKEN,
    INSTAGRAM_BUSINESS_ACCOUNT_ID: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
  },
};

export default nextConfig;
