# Project Overview

## Introduction

Unjica is a modern web application built using Next.js 15, React 19, and TypeScript. The project follows the App Router architecture introduced in Next.js 13+ and leverages the latest features of the React ecosystem to provide a robust and performant user experience. It features AI-generated art news digests that keep users updated on the latest trends in the art world, with a focus on modern and contemporary art.

## Key Features

- **Modern Frontend Stack**: Built with Next.js 15 and React 19
- **TypeScript Integration**: Full TypeScript support for enhanced developer experience and code quality
- **AI-Generated Art Digests**: Daily generated articles analyzing current art news and trends
- **Database Integration**: Prisma ORM with PostgreSQL for storing generated content
- **Scheduling System**: Reliable cron-based scheduling for automatic content generation
- **Responsive Design**: Mobile-friendly layout with Tailwind CSS
- **Interactive UI**: Animation and interaction effects powered by Framer Motion
- **Authentication**: User authentication powered by Supabase Auth
- **Analytics**: Google Analytics integration
- **Component Library**: Custom UI components with modern design
- **Social Integration**: Facebook page integration for automatic article sharing
- **Image Management**: Cloudflare R2 storage for article images
- **Comment System**: Nested comments with reactions
- **Real-time Updates**: 60-second polling for new content
- **Admin Controls**: Special interface for content management

## AI Content Generation Process

The application features a sophisticated content generation system that works as follows:

### 1. Data Collection
- Fetches recent art news from external APIs (primarily News API)
- Filters news from the last hour or falls back to the latest news items
- Transforms raw API data into a standardized internal format
- Includes fallback mechanisms with mock data when API access is limited
- Implements a 15-minute cache to optimize API usage

### 2. Content Analysis
- Analyzes collected news items to identify:
  - Primary topics and trends in the art world
  - Key themes across multiple news sources
  - Recent significant events and exhibitions
  - Notable artists and institutions mentioned
  - Reliable news sources for attribution

### 3. Article Generation
- Creates engaging content using OpenAI:
  - Sends analyzed news data to OpenAI with a carefully crafted prompt
  - Generates human-like articles with personal opinions and perspectives
  - Creates natural, conversational content that reads like a human art journalist wrote it
  - Maintains professional insights while being approachable and engaging
  - Properly attributes sources and provides context to news items
  - Adds appropriate tagging for categorization
  - Generates unique slugs for SEO-friendly URLs

### 4. Image Generation
- Creates visual elements for each article using:
  - OpenAI's DALL-E 3 API when available (primary method)
  - Fallback to Lorem Picsum for placeholder images when API is unavailable
  - Images that visually represent the article's primary topic and tags
  - Permanent storage in Cloudflare R2 for reliable access

### 5. Storage and Distribution
- Each generated article is stored in a PostgreSQL database
- Articles include metadata like publishing date, topics, and tags
- The database storage enables historical browsing and search functionality
- Articles are served through a responsive web interface
- Real-time updates via 60-second polling
- Automatic Facebook page sharing for new articles

## User Engagement Features

- **Comment System**: 
  - Nested comments with replies
  - Anonymous commenting support
  - Reaction system for both articles and comments
  - Real-time updates

- **Social Sharing**:
  - Automatic Facebook page posting
  - Share buttons for articles
  - Hashtag generation for social media
  - SEO-optimized URLs and metadata

- **Content Discovery**:
  - Category-based navigation
  - Tag-based filtering
  - Infinite scroll pagination
  - Featured article highlighting

## Scheduling System

- **Automated Generation**: New digests are created daily through scheduled triggers
- **External Cron Triggering**: Uses Vercel Cron running between 3 PM and 6 PM daily
- **Manual Generation**: Admin users can trigger generation on demand
- **Security**: Protected endpoints with secret key authentication
- **Real-time Updates**: 60-second polling for new content
- **Fallback Mechanisms**: Multiple scheduling options for reliability

## Project Goals

The Unjica project aims to provide a modern platform for art enthusiasts to stay updated with the latest trends and developments in the contemporary art world. It showcases how AI can be used to analyze and synthesize information from multiple sources into cohesive, readable content.

Specific goals include:

- Demonstrating AI-powered content generation capabilities
- Providing a reliable system for automatic content updates
- Creating an engaging user experience for art news consumption
- Implementing modern web development patterns and practices
- Showcasing integration of AI with database and frontend systems
- Building a community-driven platform for art discussion
- Maintaining high-quality, human-like content generation

## Target Audience

This project is intended for:

- Art enthusiasts interested in staying updated on art trends
- Frontend developers working with React and Next.js
- Developers interested in AI content generation
- Students and learners exploring modern web development patterns
- Art professionals looking for curated art news
- Content creators interested in AI-assisted content generation

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, Radix UI
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel with Cron Jobs
- **Scheduling**: External cron services, Vercel Cron
- **AI Services**: OpenAI API for content and image generation
- **Email**: Nodemailer for email services
- **Storage**: Cloudflare R2 for image storage
- **Social**: Facebook Graph API for page integration
- **Analytics**: Google Analytics for user tracking

## Error Handling and Resilience

The system includes comprehensive error handling and fallback mechanisms:
- Fallback articles when database is unavailable
- Mock data when external APIs fail
- Graceful degradation of features
- Detailed error logging
- User-friendly error messages
- Multiple scheduling options
- Image fallback system
- Content generation fallbacks

## Project Status

The project is currently in active development with ongoing improvements to:
- Content generation quality
- User interface and experience
- Performance optimization
- Social media integration
- Community features
- Error handling and resilience

## License and Usage

The project is marked as private and is intended for internal use. Contact the project maintainers for usage permissions. 