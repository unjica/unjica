'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { GradientText } from '@/components/ui/GradientText';
import { BlurredBackground } from '@/components/ui/BlurredBackground';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

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
      <Container>
        <GradientText className="text-7xl mb-2">
          Something Went Wrong
        </GradientText>
        
        <p className="mb-8 text-gray-400 text-xl">
          {error.message || 'An unexpected error occurred. Please try again later.'}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset}>
            Try Again
          </Button>
          
          <Button variant="outline" asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </Container>

      <BlurredBackground />
    </main>
  );
} 