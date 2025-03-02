# Project Overview

## Introduction

Unjica is a modern web application built using Next.js 15, React 19, and TypeScript. The project follows the App Router architecture introduced in Next.js 13+ and leverages the latest features of the React ecosystem to provide a robust and performant user experience. It features AI-generated art news digests that keep users updated on the latest trends in the art world.

## Key Features

- **Modern Frontend Stack**: Built with Next.js 15 and React 19
- **TypeScript Integration**: Full TypeScript support for enhanced developer experience and code quality
- **AI-Generated Art Digests**: Daily generated articles analyzing current art news and trends
- **Database Integration**: Prisma ORM with SQLite/PostgreSQL for storing generated content
- **Scheduling System**: Reliable cron-based scheduling for automatic content generation
- **Responsive Design**: Mobile-friendly layout with Tailwind CSS
- **Interactive UI**: Animation and interaction effects powered by Framer Motion
- **Analytics**: Google Analytics integration
- **Component Library**: Custom UI components with modern design

## AI Content Generation

The application features an intelligent content generation system:

### Art News Digests

- **Automated Generation**: New digests are created daily
- **Art News Analysis**: Identifies trends and patterns in recent art news
- **Rich Content**: Includes titles, summaries, detailed content, and tags
- **Database Storage**: All generated articles are stored for future access

### Scheduling System

- **External Cron Triggering**: Uses Vercel Cron or other external services
- **Configurable Schedule**: Default daily generation with customizable timing
- **Manual Generation**: Admin users can trigger generation on demand
- **Stateless Architecture**: Compatible with serverless deployment models

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

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (development), PostgreSQL (production)
- **Deployment**: Vercel with Cron Jobs
- **Scheduling**: External cron services, Vercel Cron

## Project Status

The project is currently in active development with ongoing improvements to the content generation system and user interface.

## License and Usage

The project is marked as private and is intended for internal use. Contact the project maintainers for usage permissions. 