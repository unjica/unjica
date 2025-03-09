# Project Overview

## Introduction

Unjica is a modern web application built using Next.js 15, React 19, and TypeScript. The project follows the App Router architecture introduced in Next.js 13+ and leverages the latest features of the React ecosystem to provide a robust and performant user experience. It features AI-generated art news digests that keep users updated on the latest trends in the art world.

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

## AI Content Generation Process

The application features a sophisticated content generation system that works as follows:

### 1. Data Collection
- Fetches recent art news from external APIs (primarily News API)
- Filters news from the last hour or falls back to the latest news items
- Transforms raw API data into a standardized internal format
- Includes fallback mechanisms with mock data when API access is limited

### 2. Content Analysis
- Analyzes collected news items to identify:
  - Primary topics and trends in the art world
  - Key themes across multiple news sources
  - Recent significant events and exhibitions
  - Notable artists and institutions mentioned

### 3. Article Generation
- Creates structured content using a template-based system with dynamic elements:
  - Engaging titles that feature the identified primary topic
  - Introductory paragraphs that provide context
  - Summary sections that highlight key trends
  - Detailed analysis of the most substantial news items
  - Concluding paragraphs with forward-looking insights
  - Properly tagged content for categorization

### 4. Image Generation
- Creates visual elements for each article using:
  - OpenAI's DALL-E API when available (primary method)
  - Fallback to placeholder images when API is unavailable
  - Images that visually represent the article's primary topic and tags

### 5. Storage and Distribution
- Each generated article is stored in a PostgreSQL database
- Articles include metadata like publishing date, topics, and tags
- The database storage enables historical browsing and search functionality
- Articles are served through a responsive web interface

## Scheduling System

- **Automated Generation**: New digests are created daily through scheduled triggers
- **External Cron Triggering**: Uses Vercel Cron or other external services
- **Manual Generation**: Admin users can trigger generation on demand
- **Security**: Protected endpoints with secret key authentication

## Project Goals

The Unjica project aims to provide a modern platform for art enthusiasts to stay updated with the latest trends and developments in the contemporary art world. It showcases how AI can be used to analyze and synthesize information from multiple sources into cohesive, readable content.

Specific goals include:

- Demonstrating AI-powered content generation capabilities
- Providing a reliable system for automatic content updates
- Creating an engaging user experience for art news consumption
- Implementing modern web development patterns and practices
- Showcasing integration of AI with database and frontend systems

## Target Audience

This project is intended for:

- Art enthusiasts interested in staying updated on art trends
- Frontend developers working with React and Next.js
- Developers interested in AI content generation
- Students and learners exploring modern web development patterns

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel with Cron Jobs
- **Scheduling**: External cron services, Vercel Cron
- **AI Services**: OpenAI API for image generation, custom algorithms for content generation
- **Email**: Nodemailer for email services

## Error Handling and Resilience

The system includes comprehensive error handling and fallback mechanisms:
- Fallback articles when database is unavailable
- Mock data when external APIs fail
- Graceful degradation of features
- Detailed error logging
- User-friendly error messages

## Project Status

The project is currently in active development with ongoing improvements to the content generation system and user interface.

## License and Usage

The project is marked as private and is intended for internal use. Contact the project maintainers for usage permissions. 