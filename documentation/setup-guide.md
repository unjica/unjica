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
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code linting

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

### Getting Help

If you encounter issues not covered in this guide, please:

1. Check the project's issue tracker for similar problems
2. Consult the Next.js documentation at [https://nextjs.org/docs](https://nextjs.org/docs)
3. Contact the project maintainers for assistance

## Deployment

For production deployment, follow these steps:

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

Alternatively, deploy to Vercel for the simplest deployment experience:

1. Push your code to a Git repository
2. Connect the repository to Vercel
3. Vercel will automatically detect the Next.js project and deploy it 