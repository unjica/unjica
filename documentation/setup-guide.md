# Setup Guide

This guide will walk you through the process of setting up the Unjica project on your local development environment.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20.x or later recommended)
- **npm** (v10.x or later recommended) or **yarn** (v1.22.x or later)
- **Git** for version control

## Installation Steps

### 1. Clone the Repository

```bash
git clone [repository-url]
cd unjica
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory based on the provided `.env.local.example`:

```bash
cp .env.local.example .env.local
```

Edit the `.env.local` file to include your specific configuration values:

```
# Email Configuration
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_TO=recipient@example.com
EMAIL_FROM=sender@example.com

# Google Analytics
GA_MEASUREMENT_ID=G-XXXXXXXXXX

# News API
NEWS_API_KEY=your_news_api_key

# Database URL
DATABASE_URL=file:./dev.db

# Scheduler Security
CRON_SECRET=your_secret_key_here
```

### 4. Initialize the Database

```bash
npx prisma migrate dev
```

This will create the SQLite database and apply all migrations.

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Setting Up the Scheduler

The application includes an hourly art digest generation feature that requires proper scheduling configuration. Since Next.js API routes are serverless functions that don't maintain state between requests, we need to set up external scheduling.

### Option 1: Development Testing

For testing during development, you can use the included script:

```bash
# Make the script executable
chmod +x scripts/generate-digest-cron.js

# Run it manually
./scripts/generate-digest-cron.js
```

### Option 2: Local Cron Job

To set up a local cron job for hourly generation:

1. Open your crontab file:
   ```bash
   crontab -e
   ```

2. Add the following line to run the script every hour:
   ```
   0 * * * * /absolute/path/to/your/project/scripts/generate-digest-cron.js
   ```

3. Save and exit.

### Option 3: Vercel Deployment with Cron (Production)

For production deployment on Vercel:

1. Ensure your `vercel.json` file includes the cron job configuration:
   ```json
   {
     "crons": [
       {
         "path": "/api/scheduler",
         "schedule": "0 * * * *"
       }
     ]
   }
   ```

2. Set the required environment variables in your Vercel project:
   - `DATABASE_URL` - URL to your PostgreSQL database (for production)
   - `NEWS_API_KEY` - Your News API key
   - `CRON_SECRET` - A secure random string for protecting your scheduler endpoint

### Option 4: External Cron Service

You can also use external cron services like cron-job.org, Upstash Qstash, or GitHub Actions to call your scheduler endpoint:

```
https://your-domain.com/api/scheduler?secret=your_cron_secret
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code linting
- `scripts/generate-digest-cron.js` - Manually trigger art digest generation

## Troubleshooting

### Common Issues

1. **Node.js Version Conflicts**
   
   If you encounter issues with Node.js versions, consider using a version manager like nvm:
   
   ```bash
   nvm install 20
   nvm use 20
   ```

2. **Missing Environment Variables**
   
   Ensure all required environment variables are correctly set in your `.env.local` file.

3. **Port Conflicts**
   
   If port 3000 is already in use, you can start the server on a different port:
   
   ```bash
   npm run dev -- -p 3001
   # or
   yarn dev -p 3001
   ```

4. **Scheduler Not Working**

   If your art digests aren't being generated automatically:
   
   - Check that your cron job is properly configured
   - Verify that the scheduler endpoint is accessible
   - Ensure your `CRON_SECRET` matches in both the environment and your cron job request
   - Look for errors in your logs

### Getting Help

If you encounter issues not covered in this guide, please:

1. Check the project's issue tracker for similar problems
2. Consult the Next.js documentation at [https://nextjs.org/docs](https://nextjs.org/docs)
3. Contact the project maintainers for assistance

## Deployment

### Vercel Deployment (Recommended)

For the simplest deployment experience with automatic cron jobs:

1. Push your code to a Git repository
2. Connect the repository to Vercel
3. Set up the required environment variables
4. Deploy your project

Vercel will automatically detect the Next.js project and deploy it. The cron jobs defined in `vercel.json` will be automatically set up and executed according to the schedule.

### Alternative Deployments

For other hosting providers:

1. Build the application:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Start the production server:
   ```bash
   npm run start
   # or
   yarn start
   ```

3. Set up an external cron service to call your scheduler endpoint hourly. 