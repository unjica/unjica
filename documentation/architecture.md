# Architecture

## Overall Structure

The Unjica project follows a modern React/Next.js architecture based on the Next.js App Router pattern. The project is organized as follows:

```
unjica/
├── src/                  # Main source code
│   ├── app/              # App Router pages and layouts
│   │   └── api/          # API routes including scheduler
│   ├── components/       # React components
│   │   └── ui/           # UI component library
│   ├── lib/              # Utility functions and helpers
│   │   ├── agents/       # AI agent models
│   │   ├── actions/      # Server actions
│   │   └── services/     # Service utilities
├── public/               # Static assets
├── scripts/              # Build and utility scripts
├── documentation/        # Project documentation
├── prisma/               # Database schema and migrations
└── ...                   # Configuration files
```

## Key Technologies

### Frontend

- **Next.js 15**: React framework with server-side rendering and static site generation
- **React 19**: UI library for building component-based interfaces
- **TypeScript**: Type-safe JavaScript superset
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for React
- **Radix UI**: Accessible UI primitives

### Backend

- **Next.js API Routes**: Serverless API endpoints
- **Prisma ORM**: Database access and management
- **SQLite/PostgreSQL**: Database storage
- **Vercel Cron**: Scheduled task execution

### Developer Tools

- **ESLint**: Code linting
- **PostCSS**: CSS transformation tool
- **TypeScript**: Static type checking

## Agent Architecture

The project implements several intelligent agent models to process and generate content:

### ArtNewsAgent

- Fetches modern art news from external APIs or provides mock data
- Transforms raw API responses into a consistent internal format
- Handles pagination and caching
- Used by the Art News page to display current art news

### ArtContentGeneratorAgent

- Analyzes collections of art news to identify trends and patterns
- Generates synthetic digest articles based on recent news
- Uses natural language templates to create coherent and informative content
- Provides metadata like topics, tags, and summaries

## Scheduler Architecture

Due to the serverless nature of Next.js API routes, the scheduler uses a different approach than traditional interval-based scheduling:

### Scheduler API

- Located at `/api/scheduler`
- Provides endpoints to check status and trigger scheduled tasks
- Maintains minimal state about last execution time
- Can be triggered externally via HTTP requests

### External Triggering Mechanisms

The application uses one of several methods to trigger scheduled tasks:

1. **Vercel Cron Jobs (Production)**
   - Configured via `vercel.json`
   - Runs on a specified schedule (hourly)
   - Calls the scheduler API endpoint automatically

2. **Node.js Script (Development)**
   - Located in `scripts/generate-digest-cron.js`
   - Can be run manually or via local cron
   - Makes HTTP requests to the scheduler API

3. **External Cron Services (Alternative)**
   - Services like cron-job.org, Upstash, or GitHub Actions
   - Make HTTP requests to the scheduler API endpoint
   - Can be set to any desired schedule

### Scheduler Security

- Protected via `CRON_SECRET` environment variable
- Secret key must be provided in requests to the scheduler API
- Prevents unauthorized triggering of scheduled tasks

## Data Flow for Art News

1. **News Fetching**: The `ArtNewsAgent` retrieves news from external APIs using the NewsAPI
2. **Transformation**: Raw API data is transformed into a standardized format
3. **Rendering**: The `ArtNewsList` component displays the transformed news
4. **Analysis**: The `ArtContentGeneratorAgent` analyzes the news to identify trends
5. **Generation**: Digest articles are generated using the analyzed data
6. **Storage**: Generated articles are stored in the database (SQLite/PostgreSQL)
7. **Scheduling**: The external scheduler triggers the generation process hourly

## Application Flow

1. The application entry point is in `src/app/layout.tsx` which serves as the root layout
2. Page components in the `src/app` directory define the routes using Next.js App Router conventions
3. UI components in `src/components/ui` are imported and used by page components
4. Utility functions in `src/lib` provide reusable functionality across the application
5. The scheduler API handles periodic tasks like hourly digest generation

## Component Architecture

The UI components follow a hierarchical structure:

- **Layout Components**: Define the overall page structure (Container, etc.)
- **UI Elements**: Basic interface elements (Button, GradientText, etc.)
- **Feature Components**: Implement specific features or functionality
- **Page Components**: Compose other components to create complete pages

## Data Flow

The application uses React's state management patterns:

1. Local state with `useState` for component-specific state
2. Props for passing data between components
3. Form submissions handled by asynchronous functions 
4. API calls to backend endpoints under `src/app/api`
5. Database operations via Prisma ORM

## API Integration

The application implements API routes using Next.js API routes in the `src/app/api` directory:

- **Email Service**: Handles email subscriptions and sends messages using Nodemailer
- **Art Digest API**: Retrieves and generates art digest articles
- **Scheduler API**: Manages periodic tasks and provides triggering endpoints

## Database Architecture

The application uses Prisma ORM to interact with the database:

- **Development**: SQLite for local development
- **Production**: PostgreSQL for production deployments
- **Schema**: Defined in `prisma/schema.prisma`
- **Models**: Include User, GeneratedArticle, Comment, Reaction, etc.

## Performance Considerations

1. Use of Next.js for optimized rendering
2. Component-based architecture for code splitting
3. Framer Motion for optimized animations
4. Tailwind CSS for reduced CSS bundle size
5. Database indexes for efficient querying
6. Scheduled tasks executed outside of user requests

## Security Considerations

1. Environment variables for sensitive configuration
2. Secret key protection for scheduler endpoints
3. Input validation on all API inputs
4. SQL injection protection via Prisma ORM
5. XSS protection via React's built-in escaping

## Future Architecture Considerations

- State management solutions for more complex state
- Authentication and authorization
- Advanced testing framework implementation 
- Real-time notification system 