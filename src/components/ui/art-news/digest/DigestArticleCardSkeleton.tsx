'use client';

import { motion } from 'framer-motion';

interface DigestArticleCardSkeletonProps {
  className?: string;
}

export const DigestArticleCardSkeleton = ({ className = '' }: DigestArticleCardSkeletonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`group relative bg-[#1A1C2E] rounded-xl overflow-hidden ${className}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Gradient background placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse" />
        
        {/* AI Badge skeleton */}
        <div className="absolute top-3 left-3">
          <div className="w-20 h-5 bg-gray-600 rounded-md animate-pulse" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Tags skeleton */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3 mx-auto">
          <div className="w-16 h-5 bg-gray-700 rounded-full animate-pulse" />
          <div className="w-20 h-5 bg-gray-700 rounded-full animate-pulse" />
        </div>

        {/* Title skeleton */}
        <div className="space-y-2 mb-2">
          <div className="h-5 bg-gray-700 rounded w-3/4 animate-pulse mx-auto" />
          <div className="h-5 bg-gray-700 rounded w-1/2 animate-pulse mx-auto" />
        </div>

        {/* Date skeleton */}
        <div className="h-4 bg-gray-700 rounded w-24 animate-pulse mx-auto" />
      </div>
    </motion.div>
  );
}; 