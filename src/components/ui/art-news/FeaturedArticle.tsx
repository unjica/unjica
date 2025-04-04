'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { type GeneratedArticle } from '@/lib/agents/models/generatedArticle';
import { getTopicSlug } from '@/lib/utils/topicMapper';

interface FeaturedArticleProps {
  article: GeneratedArticle;
}

export const FeaturedArticle = ({ article }: FeaturedArticleProps) => {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-[#1A1C2E] rounded-xl overflow-hidden"
    >
      <Link href={`/category/${getTopicSlug(article.primaryTopic).toLowerCase()}/${article.slug || article.id}`}>
        <div className="relative h-[400px] md:h-[500px]">
          {article.imageUrl ? (
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              unoptimized={true}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#4A6BF6] to-[#6B4AF6]" />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-3xl mx-auto">
              <span className="inline-block px-3 py-1 text-sm font-medium text-white bg-[#4A6BF6] rounded-full mb-4">
                Featured Article
              </span>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {article.title}
              </h2>
              
              <p className="text-gray-300 text-lg mb-4 line-clamp-2">
                {article.summary}
              </p>
              
              <div className="flex items-center justify-center text-gray-400 text-sm">
                <span>{formattedDate}</span>
                {article.sourceNewsIds && article.sourceNewsIds.length > 0 && (
                  <>
                    <span className="mx-2">•</span>
                    <span>Based on {article.sourceNewsIds.length} news sources</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}; 