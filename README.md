# Unjica

A modern web application built with Next.js 15, React 19, and TypeScript featuring AI-generated art news digests.

## Overview

Unjica is a clean, modern web application that serves as a platform for modern art news and AI-generated art digests. It features responsive design, interactive UI components with smooth animations, a database for storing generated content, and an automated scheduler that generates new art digests hourly.

## Key Technologies

- **Next.js 15** - React framework with server-side rendering
- **React 19** - UI library for building component-based interfaces
- **TypeScript** - Type-safe JavaScript superset
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for React
- **Prisma** - Type-safe ORM for database access
- **SQLite/PostgreSQL** - Database for storing generated articles
- **News API** - External API for fetching art news
- **Vercel Cron** - For scheduled tasks that run daily even when no users are active

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Create a `.env.local` file based on the `.env.local.example`:

```bash
cp .env.local.example .env.local
```

Add your News API key to the `.env.local` file:

```
NEWS_API_KEY=your_api_key_here
```

Initialize the database:

```bash
npx prisma migrate dev
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Features

- **Modern Art News** - View the latest news from the art world
- **AI-Generated Digests** - Read AI-generated analysis of art trends and news
- **Daily Updates** - New digest articles are automatically generated daily
- **Central Database** - All generated articles are stored in a database for all users to access

## Documentation

For comprehensive documentation about the project, please refer to the [documentation](./documentation) folder, which includes:

- [Project Overview](./documentation/project-overview.md)
- [Architecture](./documentation/architecture.md)
- [Setup Guide](./documentation/setup-guide.md)
- [Component Documentation](./documentation/components.md)
- [API Reference](./documentation/api-reference.md)

## Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code linting
- `npx prisma studio` - Open Prisma Studio to view and edit database data

## Deployment

The easiest way to deploy the application is to use the [Vercel Platform](https://vercel.com) from the creators of Next.js.

For deployment with the scheduler functionality, make sure to:

1. Set up these environment variables on Vercel:
   - `DATABASE_URL` - URL to your PostgreSQL database
   - `NEWS_API_KEY` - Your News API key
   - `CRON_SECRET` - A secret key for securing cron job endpoints

2. **IMPORTANT: Setting up the Scheduler**

   The application relies on daily article generation, which requires a proper cron job setup. Due to the serverless nature of Next.js API routes, the built-in scheduler won't run continuously.

   **Option 1: Vercel Cron (Recommended)**
   
   Add this to your `vercel.json` file:
   ```json
   {
     "crons": [
       {
         "path": "/api/scheduler",
         "schedule": "0 16 * * *"
       }
     ]
   }
   ```

   **Option 2: External cron service**
   
   Use a service like cron-job.org, Upstash, or GitHub Actions to call your `/api/scheduler` endpoint daily.

   **Option 3: Local development**
   
   For local testing, you can run the included script:
   ```bash
   # Make it executable first
   chmod +x scripts/generate-digest-cron.js
   
   # Then run it
   ./scripts/generate-digest-cron.js
   ```

   You can add this to your local crontab to run daily at 3-6 PM:
   ```
   0 16 * * * /path/to/your/project/scripts/generate-digest-cron.js
   ```

For more information on deployment options, see the [Setup Guide](./documentation/setup-guide.md#deployment).

## Database Options

- **Development**: Uses SQLite for local development (file-based)
- **Production**: For production, it's recommended to use PostgreSQL
  - Update the `provider` in `prisma/schema.prisma` to `postgresql`
  - Update your `DATABASE_URL` environment variable

## Facebook Integration

The application can automatically post new art digests to a Facebook page. To set up Facebook integration:

1. Create a Facebook App in the [Facebook Developer Portal](https://developers.facebook.com/)
2. Generate a Page Access Token with the `pages_manage_posts` and `pages_read_engagement` permissions
3. Add the following environment variables to your `.env.local` file:
   ```
   FACEBOOK_ACCESS_TOKEN=your_facebook_page_access_token
   FACEBOOK_PAGE_ID=your_facebook_page_id
   ```

### Manual Facebook Posting

You can manually post an existing article to Facebook using the provided script:

```bash
# Build the project first
npm run build

# Post an article to Facebook
node scripts/post-to-facebook.js <article-id>
```

## License

This project is private and intended for internal use only.
