'use client';

import { motion } from 'framer-motion';

export const FeaturedArticleSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-[#1A1C2E] rounded-xl overflow-hidden"
    >
      <div className="relative h-[400px] md:h-[500px]">
        {/* Gradient background placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse" />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-3xl mx-auto">
            {/* Featured Article badge skeleton */}
            <div className="inline-block w-32 h-6 bg-gray-700 rounded-full animate-pulse mb-4" />
            
            {/* Title skeleton */}
            <div className="space-y-3 mb-4">
              <div className="h-8 bg-gray-700 rounded-lg w-3/4 animate-pulse" />
              <div className="h-8 bg-gray-700 rounded-lg w-1/2 animate-pulse" />
            </div>
            
            {/* Summary skeleton */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-700 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse" />
            </div>
            
            {/* Metadata skeleton */}
            <div className="flex items-center space-x-2">
              <div className="h-3 bg-gray-700 rounded w-24 animate-pulse" />
              <div className="h-3 bg-gray-700 rounded w-3 animate-pulse" />
              <div className="h-3 bg-gray-700 rounded w-40 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 