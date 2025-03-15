'use client';

import React from 'react';
import { Container } from '@/components/ui/Container';
import { GradientText } from '@/components/ui/GradientText';

export default function AboutPage() {
  // Calculate time until next automatic generation
  const getTimeUntilNextGen = () => {
    const now = new Date();
    let nextGen = new Date();
    
    // Set to today at 4 PM (16:00)
    nextGen.setHours(16, 0, 0, 0);
    
    // If it's already past 4 PM today, set to tomorrow at 4 PM
    if (now.getHours() >= 16) {
      nextGen.setDate(nextGen.getDate() + 1);
    }
    
    const diffMs = nextGen.getTime() - now.getTime();
    if (diffMs <= 0) return 'Due now';
    
    const diffHours = Math.floor(diffMs / (3600000));
    if (diffHours > 23) {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} and ${diffHours % 24} hour${(diffHours % 24) !== 1 ? 's' : ''}`;
    }
    
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  };

  return (
    <main className="py-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            About Us
          </h1>
          
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-center">
              <GradientText>AI Generated Art Digest</GradientText>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
              Our AI agent analyzes the latest art news daily and generates insightful 
              digests highlighting trends and developments in the contemporary art world.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
              Last generated: {new Date().toLocaleTimeString()}
              {' | '}
              Next scheduled: {getTimeUntilNextGen()}
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We aim to make the contemporary art world more accessible by leveraging 
              artificial intelligence to curate and analyze the latest trends, exhibitions,
              and developments in the art community.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Through our AI-powered platform, we provide valuable insights that help art enthusiasts,
              collectors, and professionals stay informed about the evolving landscape of modern art.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our sophisticated AI system continuously scans and analyzes news sources, gallery announcements,
              artist statements, and exhibition reviews from around the world.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Once daily at 4 PM (16:00), our system processes this information using OpenAI technology 
              to generate a comprehensive digest that highlights key trends, notable exhibitions, 
              and significant developments in the art world.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Each digest is crafted with human-like perspective and insights, making it easier for 
              you to stay connected with the contemporary art scene without having to sift through 
              countless sources on your own.
            </p>
          </section>
        </div>
      </Container>
    </main>
  );
} 