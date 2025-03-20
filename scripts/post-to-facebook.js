#!/usr/bin/env node

/**
 * Script to manually post an existing article to Facebook
 * 
 * Usage:
 * node scripts/post-to-facebook.js <article-id>
 * 
 * Example:
 * node scripts/post-to-facebook.js abc123
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fetch = require('node-fetch');
const { generateHashtags } = require('../src/lib/utils/hashtags');

// Check if the article ID was provided
const articleId = process.argv[2];
if (!articleId) {
  console.error('Error: Article ID is required');
  console.log('Usage: node scripts/post-to-facebook.js <article-id>');
  process.exit(1);
}

async function main() {
  try {
    console.log(`Fetching article with ID: ${articleId}`);
    
    // Fetch the article from the database
    const article = await prisma.generatedArticle.findUnique({
      where: { id: articleId }
    });
    
    if (!article) {
      console.error(`Error: Article with ID ${articleId} not found`);
      process.exit(1);
    }
    
    console.log(`Found article: ${article.title}`);
    
    // Convert the article to the expected format
    const formattedArticle = {
      id: article.id,
      title: article.title,
      content: article.content,
      primaryTopic: article.primaryTopic,
      summary: article.summary,
      tags: JSON.parse(article.tags || '[]'),
      publishedAt: article.publishedAt.toISOString(),
      sourceNewsIds: JSON.parse(article.sourceNewsIds || '[]'),
      lastUpdated: article.lastUpdated.toISOString(),
      imageUrl: article.imageUrl || undefined,
      slug: article.slug || undefined
    };
    
    // Check if Facebook credentials are configured
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    const pageId = process.env.FACEBOOK_PAGE_ID;
    
    if (!accessToken || !pageId) {
      console.error('Error: Facebook credentials not configured');
      console.log('Please set FACEBOOK_ACCESS_TOKEN and FACEBOOK_PAGE_ID in your .env.local file');
      process.exit(1);
    }
    
    // Create the post message
    const hashtags = generateHashtags(formattedArticle);
    const postMessage = `🎨 ${formattedArticle.title}\n\n${formattedArticle.summary}\n\nRead more on our website!\n\n${hashtags}`;
    
    // Create the URL to the article
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const articleUrl = `${baseUrl}/art-news/digest/${formattedArticle.slug}`;
    
    // Post to Facebook
    console.log('Posting to Facebook...');
    
    const url = `https://graph.facebook.com/v18.0/${pageId}/feed`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: postMessage,
        link: articleUrl,
        access_token: accessToken,
      }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('Successfully posted to Facebook:', data);
      console.log(`Post ID: ${data.id}`);
    } else {
      console.error('Failed to post to Facebook:', data);
      process.exit(1);
    }
    
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 