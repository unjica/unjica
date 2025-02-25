'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to your error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen text-white flex flex-col items-center justify-center p-4" role="main">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto text-center z-10"
      >
        <motion.h1 
          className="text-7xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent"
          animate={{ 
            y: [0, -8, 0],
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          Something Went Wrong
        </motion.h1>
        <motion.p 
          className="mb-8 text-gray-400 text-xl"
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {error.message || 'An unexpected error occurred. Please try again later.'}
        </motion.p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white border border-purple-500 rounded-lg hover:bg-purple-500/10 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </motion.div>

      {/* Background with blurred logo */}
      <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={'/Unjica LOGO.jpeg'}
            alt="Background Logo"
            fill
            priority
            sizes="100vw"
            style={{ 
              objectFit: 'cover',
              position: 'absolute',
            }}
            className="blur-[4px] brightness-[0.3] scale-110"
            quality={100}
          />
        </div>
        <div className="absolute inset-0 bg-black/30" />
      </div>
    </main>
  );
} 