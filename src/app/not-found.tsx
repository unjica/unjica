'use client';

import Link from 'next/link';
import { GradientText } from '@/components/ui/GradientText';
import { BlurredBackground } from '@/components/ui/BlurredBackground';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export default function NotFound() {
  return (
    <main className="min-h-screen text-white flex flex-col items-center justify-center p-4" role="main">
      <Container>
        <GradientText className="text-9xl mb-2">
          404
        </GradientText>
        
        <GradientText as="h2" className="text-3xl mb-4" animate={false}>
          Page Not Found
        </GradientText>
        
        <p className="mb-8 text-gray-400 text-xl">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Button variant="outline" asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </Container>

      <BlurredBackground />
    </main>
  );
} 