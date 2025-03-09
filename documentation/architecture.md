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
- **PostgreSQL**: Database storage (via Supabase)
- **Supabase**: Authentication and database services
- **Vercel Cron**: Scheduled task execution

### Developer Tools

- **ESLint**: Code linting
- **PostCSS**: CSS transformation tool
- **TypeScript**: Static type checking

## Agent Architecture

The project implements several intelligent agent models to process and generate content:

### ArtNewsAgent

The ArtNewsAgent is responsible for fetching modern art news from external sources:

- **Primary Functionality**:
  - Retrieves art news from News API with a focus on modern and contemporary art
  - Implements caching to reduce API calls (15-minute cache duration)
  - Provides fallback to mock data when API limits are reached
  - Handles pagination and result size management

- **Key Methods**:
  - `getModernArtNews(page, pageSize)`: Fetches art news with pagination support
  - `fetchFromNewsApi(page, pageSize)`: Makes the actual API call to News API
  - `transformArticle(article)`: Converts raw API response to internal format
  - `extractTags(content)`: Analyzes article content to generate relevant tags

- **Error Handling**:
  - Graceful degradation to mock data when API fails
  - Detailed error logging for debugging
  - Consistent response format regardless of data source

### ArtContentGeneratorAgent

The ArtContentGeneratorAgent creates structured art digest articles from news items:

- **Content Generation Process**:
  1. **Analysis Phase**:
     - Processes multiple news items using `analyzeNews()` method
     - Counts tag occurrences to identify primary topics
     - Detects key themes across multiple articles
     - Extracts information about recent events and exhibitions
     - Identifies reliable news sources for citation

  2. **Structure Creation**:
     - Selects a title template and fills it with the primary topic
     - Chooses an introduction template that sets context
     - Generates a summary paragraph with key insights
     - Creates detailed sections based on the most substantial news items
     - Adds a conclusion that looks forward to upcoming trends

  3. **Metadata Generation**:
     - Compiles relevant tags for categorization
     - Sets the publication timestamp
     - Identifies the primary topic for the article
     - References source news IDs for attribution

- **Key Methods**:
  - `analyzeNews(newsItems)`: Identifies patterns and topics in the news data
  - `generateSummaryParagraph(newsItems, analysis)`: Creates a concise overview
  - `generateDetailSection(newsItems)`: Produces in-depth content based on news
  - `generateConclusion(analysis)`: Creates a forward-looking closing section
  - `generateArticle(newsItems)`: Main method that orchestrates the entire process

- **Content Templates**:
  - Uses predefined templates for titles and introductions
  - Dynamically fills templates with analyzed content
  - Ensures consistent structure while maintaining uniqueness

### ImageGenerationService

The ImageGenerationService creates visual elements for articles:

- **Functionality**:
  - Generates images based on article topic and tags
  - Uses OpenAI's DALL-E 3 API when available
  - Falls back to Lorem Picsum for placeholder images when needed
  - Creates a unique seed for each article to ensure image consistency

- **Key Methods**:
  - `generateImageForArticle(topic, tags, articleId, title)`: Creates or retrieves an image

### Content Generation Data Flow

The complete flow of article generation works as follows:

1. **Trigger**: The process begins via:
   - Scheduled Vercel cron job
   - API endpoint with proper authentication
   - Manual trigger from an admin user

2. **News Collection**: `generateDailyArtDigest()` in `artDigestActions.ts`:
   - Gets current time and time from 1 hour ago
   - Uses `getArtNewsAgent().getModernArtNews()` to fetch recent news
   - Filters for news from the last hour, falling back to latest items if none found

3. **Content Generation**: Calls `artContentGeneratorAgent.generateArticle()`:
   - Analyzes news to identify primary topic and themes
   - Generates structured content using templates and analyzed data
   - Creates title, introduction, summary, details, and conclusion

4. **Image Creation**: Uses `ImageGenerationService.generateImageForArticle()`:
   - Generates prompt based on article topic and tags
   - Creates image via DALL-E or uses placeholder

5. **Slug Generation**: Creates a URL-friendly identifier:
   - Generates base slug from title using `slugify()`
   - Checks database for existing slugs to avoid conflicts
   - Appends timestamp if needed for uniqueness

6. **Database Storage**: Saves the article using Prisma ORM:
   - Stores all metadata, content, and references
   - Handles potential database conflicts

7. **Revalidation**: Calls `revalidatePath('/')` to update page cache
   - Ensures users see the latest content without a full reload

8. **Error Handling**: Comprehensive fallbacks at each step:
   - Returns fallback article if database errors occur
   - Uses placeholder images if image generation fails
   - Generates unique slugs if conflicts arise

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
   - Runs on a specified schedule (daily)
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
- Vercel cron jobs are automatically authorized in production
- Prevents unauthorized triggering of scheduled tasks

## Data Flow for Art News

1. **News Fetching**: The `ArtNewsAgent` retrieves news from external APIs using the NewsAPI
2. **Transformation**: Raw API data is transformed into a standardized format
3. **Rendering**: The `ArtNewsList` component displays the transformed news
4. **Analysis**: The `ArtContentGeneratorAgent` analyzes the news to identify trends
5. **Generation**: Digest articles are generated using the analyzed data
6. **Storage**: Generated articles are stored in the database (PostgreSQL)
7. **Scheduling**: The external scheduler triggers the generation process daily

## Application Flow

1. The application entry point is in `src/app/layout.tsx` which serves as the root layout
2. Page components in the `src/app` directory define the routes using Next.js App Router conventions
3. UI components in `src/components/ui` are imported and used by page components
4. Utility functions in `src/lib` provide reusable functionality across the application
5. The scheduler API handles periodic tasks like digest generation

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
- **Authentication API**: Manages user authentication via Supabase

## Database Architecture

The application uses Prisma ORM to interact with the database:

- **Database Provider**: PostgreSQL via Supabase
- **Schema**: Defined in `prisma/schema.prisma`
- **Models**: Include User, GeneratedArticle, Comment, Reaction, etc.
- **Relations**: Properly defined relationships between models

## Performance Considerations

1. Use of Next.js for optimized rendering
2. Component-based architecture for code splitting
3. Framer Motion for optimized animations
4. Tailwind CSS for reduced CSS bundle size
5. Database indexes for efficient querying
6. Scheduled tasks executed outside of user requests
7. Caching of external API responses

## Security Considerations

1. Environment variables for sensitive configuration
2. Secret key protection for scheduler endpoints
3. Input validation on all API inputs
4. SQL injection protection via Prisma ORM
5. XSS protection via React's built-in escaping
6. Authentication via Supabase with proper role enforcement

## Error Handling and Fallback Mechanisms

The application implements several fallback mechanisms to ensure graceful degradation when errors occur:

### Fallback Article

- When database connection issues occur, the system serves a fallback article
- The fallback article has ID `fallback-article-1` and informs users of the temporary unavailability
- API endpoints that interact with articles (like `/api/reactions`) include special handling for this fallback article
- This prevents cascading errors in the UI when the database is unavailable

### API Error Handling

- All API endpoints include comprehensive try/catch blocks
- Errors are logged to the console for debugging
- User-friendly error messages are returned to the client
- HTTP status codes are used appropriately to indicate error types

### Database Connection Handling

- The Prisma client implementation includes connection validation and error handling
- Failed database connections are logged with detailed error information
- The application can continue functioning with limited capabilities when the database is unavailable

## Future Architecture Considerations

- State management solutions for more complex state
- Enhanced authentication and authorization
- Advanced testing framework implementation 
- Real-time notification system 