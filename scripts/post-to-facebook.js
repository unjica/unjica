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
const path = require('path');
const fs = require('fs');

// Import the Facebook service
const facebookServicePath = path.join(__dirname, '../dist/lib/services/facebookService.js');

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
    
    // Check if the Facebook service file exists
    if (!fs.existsSync(facebookServicePath)) {
      console.error(`Error: Facebook service file not found at ${facebookServicePath}`);
      console.log('Make sure to build the project first with: npm run build');
      process.exit(1);
    }
    
    // Import the Facebook service
    const { FacebookService } = require(facebookServicePath);
    
    // Post to Facebook
    console.log('Posting to Facebook...');
    const result = await FacebookService.postToFacebookPage(formattedArticle);
    
    if (result.success) {
      console.log('Successfully posted to Facebook:', result.message);
    } else {
      console.error('Failed to post to Facebook:', result.message);
      if (result.error) {
        console.error('Error details:', result.error);
      }
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