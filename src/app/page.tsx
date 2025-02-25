'use client';

import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import { GradientText } from '@/components/ui/GradientText';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { BlurredBackground } from '@/components/ui/BlurredBackground';

export default function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const rotateX = useTransform(mouseY, [-100, 100], [5, -5]);
  const rotateY = useTransform(mouseX, [-100, 100], [-5, 5]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const rect = document.getElementById('title')?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.x + rect.width / 2;
        const centerY = rect.y + rect.height / 2;
        const moveX = (event.clientX - centerX) * 0.5;
        const moveY = (event.clientY - centerY) * 0.5;
        x.set(moveX);
        y.set(moveY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Subscription failed');
      }

      setSubmitted(true);
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitted(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen text-white flex flex-col items-center justify-center p-4" role="main">
      <GoogleAnalytics 
        trackPageViews 
        gaMeasurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} 
      />
      
      <Container>
        <motion.div style={{ rotateX, rotateY, perspective: 1000 }}>
          <GradientText 
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
            id="title"
          >
            Modern Art News
          </GradientText>
        </motion.div>
        <motion.p 
          className="text-xl md:text-2xl mb-8 text-gray-300"
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Your curated source for contemporary art insights is coming soon.
        </motion.p>

        <section aria-label="Newsletter Signup" className="mb-12">
          <motion.div
            className="relative w-full max-w-md mx-auto"
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4" aria-label="Email signup form">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none text-white placeholder-gray-400 disabled:opacity-50"
                  required
                  aria-label="Email address"
                  disabled={isLoading}
                />
                <Button>Notify Me</Button>
              </form>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-400 text-lg"
                role="alert"
                aria-live="polite"
              >
                Thank you! We'll keep you updated.
              </motion.p>
            )}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm mt-2"
                role="alert"
                aria-live="polite"
              >
                {error}
              </motion.p>
            )}
          </motion.div>
        </section>

        <footer className="mt-12">
          <motion.div
            className="flex gap-6 justify-center"
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <nav aria-label="Social media links" className="text-gray-400">
              <p className="text-sm">Follow us on social media</p>
              <ul className="flex gap-4 mt-2">
                <li><a href="https://x.com/sanjaUnjica" className="hover:text-purple-400 transition-colors" aria-label="Follow us on Twitter">Twitter</a></li>
                <li><a href="https://www.instagram.com/theunjica/" className="hover:text-purple-400 transition-colors" aria-label="Follow us on Instagram">Instagram</a></li>
                <li><a href="https://www.linkedin.com/company/unjica" className="hover:text-purple-400 transition-colors" aria-label="Follow us on LinkedIn">LinkedIn</a></li>
              </ul>
            </nav>
          </motion.div>
        </footer>
      </Container>

      <BlurredBackground />
    </main>
  );
}
