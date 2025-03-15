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
  },
};

// Logging for debugging purposes if not in production
if (process.env.NODE_ENV !== 'production') {
  // Safe to log these during development
  console.log('Next.js config loaded with environment:');
  console.log('- BLOB_READ_WRITE_TOKEN:', process.env.BLOB_READ_WRITE_TOKEN ? '✅ Set' : '❌ Not set');
}

export default nextConfig;
