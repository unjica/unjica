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
              <GradientText>AI-Curated, Human-Reviewed Art Digest</GradientText>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
              Our AI agent analyzes the latest art news daily and generates insightful 
              digests highlighting trends and developments in the contemporary art world.
              Every article is reviewed by our team of art experts to ensure accuracy and relevance.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div className="px-4 py-2 bg-[#4A6BF6]/10 rounded-full">
                <span className="text-[#4A6BF6] font-medium">AI-Powered Analysis</span>
              </div>
              <div className="px-4 py-2 bg-[#4A6BF6]/10 rounded-full">
                <span className="text-[#4A6BF6] font-medium">Expert Review</span>
              </div>
              <div className="px-4 py-2 bg-[#4A6BF6]/10 rounded-full">
                <span className="text-[#4A6BF6] font-medium">Daily Updates</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
              Last generated: {new Date().toLocaleTimeString()}
              {' | '}
              Next scheduled: {getTimeUntilNextGen()}
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We aim to make the contemporary art world more accessible by combining 
              artificial intelligence with human expertise to curate and analyze the latest trends, 
              exhibitions, and developments in the art community.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Through our AI-powered platform and expert review process, we provide valuable insights 
              that help art enthusiasts, collectors, and professionals stay informed about the evolving 
              landscape of modern art.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-[#1A1C2E] rounded-lg">
                <h3 className="text-xl font-bold mb-2">AI Technology</h3>
                <p className="text-gray-300">
                  Our advanced AI system continuously scans and analyzes news sources, gallery announcements,
                  artist statements, and exhibition reviews from around the world.
                </p>
              </div>
              <div className="p-6 bg-[#1A1C2E] rounded-lg">
                <h3 className="text-xl font-bold mb-2">Art Experts</h3>
                <p className="text-gray-300">
                  A dedicated team of art professionals reviews and validates each article, ensuring 
                  accuracy, relevance, and proper context for our readers.
                </p>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <div className="space-y-4">
              <div className="p-4 bg-[#1A1C2E] rounded-lg">
                <h3 className="text-lg font-bold mb-2">1. AI Analysis</h3>
                <p className="text-gray-300">
                  Our sophisticated AI system continuously scans and analyzes news sources, gallery announcements,
                  artist statements, and exhibition reviews from around the world.
                </p>
              </div>
              <div className="p-4 bg-[#1A1C2E] rounded-lg">
                <h3 className="text-lg font-bold mb-2">2. Content Generation</h3>
                <p className="text-gray-300">
                  Once daily at 4 PM (16:00), our system processes this information using OpenAI technology 
                  to generate a comprehensive digest that highlights key trends, notable exhibitions, 
                  and significant developments in the art world.
                </p>
              </div>
              <div className="p-4 bg-[#1A1C2E] rounded-lg">
                <h3 className="text-lg font-bold mb-2">3. Expert Review</h3>
                <p className="text-gray-300">
                  Each article undergoes a thorough review by our team of art experts, who ensure accuracy,
                  add context where needed, and verify the relevance of the content.
                </p>
              </div>
              <div className="p-4 bg-[#1A1C2E] rounded-lg">
                <h3 className="text-lg font-bold mb-2">4. Publication</h3>
                <p className="text-gray-300">
                  After expert review and approval, the content is published to provide you with 
                  reliable, well-contextualized insights into the contemporary art scene.
                </p>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
} 