import { NextConfig } from 'next';

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
    ],
    unoptimized: false,
    domains: ['source.unsplash.com', 'images.unsplash.com', 'picsum.photos'],
  },
  typescript: {
    // Disable TypeScript errors during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disable ESLint errors during build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
