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
- **React Query**: Data fetching and caching

### Backend

- **Next.js API Routes**: Serverless API endpoints
- **Prisma ORM**: Database access and management
- **PostgreSQL**: Database storage (via Supabase)
- **Supabase**: Authentication and database services
- **Vercel Cron**: Scheduled task execution
- **Cloudflare R2**: Image storage service

### Developer Tools

- **ESLint**: Code linting
- **PostCSS**: CSS transformation tool
- **TypeScript**: Static type checking
- **Prisma Studio**: Database management UI

## Agent Architecture

The project implements several intelligent agent models to process and generate content:

### ArtNewsAgent

The ArtNewsAgent is responsible for fetching modern art news from external sources:

- **Primary Functionality**:
  - Retrieves art news from News API with a focus on modern and contemporary art
  - Implements caching to reduce API calls (15-minute cache duration)
  - Provides fallback to mock data when API limits are reached
  - Handles pagination and result size management
  - Filters news by relevance and recency

- **Key Methods**:
  - `getModernArtNews(page, pageSize)`: Fetches art news with pagination support
  - `fetchFromNewsApi(page, pageSize)`: Makes the actual API call to News API
  - `transformArticle(article)`: Converts raw API response to internal format
  - `extractTags(content)`: Analyzes article content to generate relevant tags
  - `filterRecentNews(news)`: Filters news from the last hour

- **Error Handling**:
  - Graceful degradation to mock data when API fails
  - Detailed error logging for debugging
  - Consistent response format regardless of data source
  - Cache invalidation on errors

### ArtContentGeneratorAgent

The ArtContentGeneratorAgent creates human-like art digest articles from news items using OpenAI:

- **Content Generation Process**:
  1. **Analysis Phase**:
     - Processes multiple news items using `analyzeNews()` method
     - Counts tag occurrences to identify primary topics
     - Detects key themes across multiple articles
     - Extracts information about recent events and exhibitions
     - Identifies reliable news sources for citation
     - Analyzes content for sentiment and trends

  2. **OpenAI-Powered Generation**:
     - Prepares news context data for the OpenAI prompt
     - Sends a carefully crafted prompt to OpenAI that includes:
       - Primary topic and key themes identified in the analysis phase
       - Recent news article data as context
       - Instructions to create a human-like article with personal opinions
       - Style guidelines for consistent tone and voice
     - Processes the AI-generated response to extract title and content
     - Adds attribution footer citing news sources
     - Generates SEO-friendly slugs

  3. **Metadata Generation**:
     - Compiles relevant tags for categorization
     - Sets the publication timestamp
     - Identifies the primary topic for the article
     - References source news IDs for attribution
     - Generates article summary
     - Creates social media metadata

- **Key Methods**:
  - `analyzeNews(newsItems)`: Identifies patterns and topics in the news data
  - `prepareNewsContext(newsItems)`: Creates formatted context for OpenAI
  - `generateArticleWithOpenAI(newsItems, analysis)`: Produces human-like content using OpenAI
  - `generateArticle(newsItems)`: Main method that orchestrates the entire process
  - `createSlug(title)`: Generates URL-friendly slugs
  - `generateSummary(content)`: Creates article summaries

- **Error Handling**:
  - Provides fallback content generation if OpenAI API fails
  - Creates simple structured articles from news items as backup
  - Ensures content is always generated, even in error conditions
  - Maintains consistent quality in fallback content

### ImageGenerationService

The ImageGenerationService creates visual elements for articles:

- **Functionality**:
  - Generates images based on article topic and tags
  - Uses OpenAI's DALL-E 3 API when available
  - Falls back to Lorem Picsum for placeholder images when needed
  - Creates a unique seed for each article to ensure image consistency
  - Stores images permanently in Cloudflare R2
  - Optimizes images for web delivery

- **Key Methods**:
  - `generateImageForArticle(topic, tags, articleId, title)`: Creates or retrieves an image
  - `generateImagePrompt(topic, tags)`: Creates optimized prompts for DALL-E
  - `storeImage(imageUrl, fileName)`: Stores image in Cloudflare R2
  - `getFallbackImage(seed)`: Generates fallback image using Lorem Picsum

### FacebookService

The FacebookService handles social media integration:

- **Functionality**:
  - Posts new articles to Facebook page
  - Generates optimized post content
  - Handles image attachments
  - Manages API rate limits
  - Provides error recovery

- **Key Methods**:
  - `postToFacebookPage(article)`: Posts article to Facebook
  - `createPostMessage(article)`: Generates post content
  - `handleApiError(error)`: Manages API errors
  - `validateCredentials()`: Checks Facebook credentials

## Content Generation Data Flow

The complete flow of article generation works as follows:

1. **Trigger**: The process begins via:
   - Scheduled Vercel cron job
   - API endpoint with proper authentication
   - Manual trigger from an admin user

2. **News Collection**: `generateDailyArtDigest()` in `artDigestActions.ts`:
   - Gets current time and time from 1 hour ago
   - Uses `getArtNewsAgent().getModernArtNews()` to fetch recent news
   - Filters for news from the last hour, falling back to latest items if none found
   - Implements caching to optimize API usage

3. **Content Generation**: Calls `artContentGeneratorAgent.generateArticle()`:
   - Analyzes news to identify primary topic and themes
   - Generates structured content using templates and analyzed data
   - Creates title, introduction, summary, details, and conclusion
   - Generates SEO-friendly slugs and metadata

4. **Image Creation**: Uses `ImageGenerationService.generateImageForArticle()`:
   - Generates prompt based on article topic and tags
   - Creates image via DALL-E or uses placeholder
   - Stores image in Cloudflare R2
   - Optimizes image for web delivery

5. **Slug Generation**: Creates a URL-friendly identifier:
   - Generates base slug from title using `slugify()`
   - Checks database for existing slugs to avoid conflicts
   - Appends timestamp if needed for uniqueness
   - Ensures SEO-friendly URLs

6. **Database Storage**: Saves the article using Prisma ORM:
   - Stores all metadata, content, and references
   - Handles potential database conflicts
   - Updates related records (tags, categories)
   - Maintains data consistency

7. **Social Media Integration**: Posts to Facebook:
   - Generates optimized post content
   - Attaches article image
   - Handles API rate limits
   - Provides error recovery

8. **Revalidation**: Calls `revalidatePath('/')` to update page cache:
   - Ensures users see the latest content without a full reload
   - Updates static pages
   - Maintains cache consistency

9. **Error Handling**: Comprehensive fallbacks at each step:
   - Returns fallback article if database errors occur
   - Uses placeholder images if image generation fails
   - Generates unique slugs if conflicts arise
   - Provides graceful degradation

## Scheduler Architecture

Due to the serverless nature of Next.js API routes, the scheduler uses a different approach than traditional interval-based scheduling:

### Scheduler API

- Located at `/api/scheduler`
- Provides endpoints to check status and trigger scheduled tasks
- Maintains minimal state about last execution time
- Can be triggered externally via HTTP requests
- Implements rate limiting and security measures

### External Triggering Mechanisms

The application uses one of several methods to trigger scheduled tasks:

1. **Vercel Cron Jobs (Production)**
   - Configured via `vercel.json`
   - Runs daily between 3 PM and 6 PM (15:00-18:00)
   - Calls the scheduler API endpoint automatically
   - Provides automatic retry on failure

2. **Node.js Script (Development)**
   - Located in `scripts/generate-digest-cron.js`
   - Can be run manually or via local cron
   - Makes HTTP requests to the scheduler API
   - Includes error handling and logging

3. **External Cron Services (Alternative)**
   - Services like cron-job.org, Upstash, or GitHub Actions
   - Make HTTP requests to the scheduler API endpoint
   - Can be set to any desired schedule
   - Provide monitoring and alerting

### Scheduler Security

- Protected via `CRON_SECRET` environment variable
- Secret key must be provided in requests to the scheduler API
- Vercel cron jobs are automatically authorized in production
- Prevents unauthorized triggering of scheduled tasks
- Implements rate limiting to prevent abuse
- Logs all scheduler activities for monitoring

## Data Flow for Art News

1. **News Fetching**: The `ArtNewsAgent` retrieves news from external APIs using the NewsAPI
2. **Transformation**: Raw API data is transformed into a standardized format
3. **Rendering**: The `ArtNewsList` component displays the transformed news
4. **Analysis**: The `ArtContentGeneratorAgent` analyzes the news to identify trends
5. **Generation**: Digest articles are generated using the analyzed data
6. **Storage**: Generated articles are stored in the database (PostgreSQL)
7. **Scheduling**: The external scheduler triggers the generation process daily
8. **Distribution**: Content is distributed via web interface and social media
9. **Engagement**: Users interact with content through comments and reactions

## Application Flow

1. The application entry point is in `src/app/layout.tsx` which serves as the root layout
2. Page components in the `src/app` directory define the routes using Next.js App Router conventions
3. UI components in `src/components/ui` are imported and used by page components
4. Utility functions in `src/lib` provide reusable functionality across the application
5. The scheduler API handles periodic tasks like digest generation
6. Real-time updates are handled through 60-second polling
7. Social media integration manages content distribution
8. Error handling and fallbacks ensure system reliability

## Component Architecture

The UI components follow a hierarchical structure:

- **Layout Components**: Define the overall page structure (Container, etc.)
- **UI Elements**: Basic interface elements (Button, GradientText, etc.)
- **Feature Components**: Implement specific features or functionality
- **Page Components**: Compose other components to create complete pages
- **Admin Components**: Special components for content management
- **Social Components**: Components for social media integration

## Data Flow

The application uses React's state management patterns:

1. Local state with `useState` for component-specific state
2. Props for passing data between components
3. Form submissions handled by asynchronous functions 
4. API calls to backend endpoints under `src/app/api`
5. Database operations via Prisma ORM
6. Real-time updates through polling
7. Social media integration for content distribution
8. Caching for optimized performance

## API Integration

The application implements API routes using Next.js API routes in the `src/app/api` directory:

- **Email Service**: Handles email subscriptions and sends messages using Nodemailer
- **Art Digest API**: Retrieves and generates art digest articles
- **Scheduler API**: Manages periodic tasks and provides triggering endpoints
- **Authentication API**: Manages user authentication via Supabase
- **Social Media API**: Handles Facebook integration
- **Image API**: Manages image generation and storage
- **Comment API**: Handles user comments and reactions

## Database Architecture

The database schema is defined using Prisma and includes:

- **User Management**:
  - User profiles and authentication
  - Role-based access control
  - Session management

- **Content Management**:
  - Article storage and metadata
  - Category and tag management
  - Image references and storage

- **Engagement Features**:
  - Comment system with nested replies
  - Reaction tracking
  - User preferences

- **Social Integration**:
  - Social media connections
  - Sharing preferences
  - Activity tracking

## Security Architecture

The application implements multiple layers of security:

1. **Authentication**:
   - Supabase Auth for user management
   - JWT token validation
   - Session management
   - Role-based access control

2. **API Security**:
   - Rate limiting
   - Input validation
   - CORS configuration
   - Request sanitization

3. **Data Security**:
   - Environment variable protection
   - API key management
   - Database access control
   - File upload security

4. **Infrastructure Security**:
   - HTTPS enforcement
   - Security headers
   - Error handling
   - Logging and monitoring

## Performance Optimization

The application implements various performance optimizations:

1. **Frontend**:
   - Image optimization
   - Code splitting
   - Lazy loading
   - Static generation
   - Client-side caching

2. **Backend**:
   - API response caching
   - Database query optimization
   - Rate limiting
   - Load balancing

3. **Infrastructure**:
   - CDN integration
   - Edge functions
   - Serverless architecture
   - Automatic scaling

## Monitoring and Logging

The application includes comprehensive monitoring:

1. **Application Monitoring**:
   - Error tracking
   - Performance metrics
   - User analytics
   - API usage tracking

2. **Infrastructure Monitoring**:
   - Server health
   - Database performance
   - Cache hit rates
   - Resource usage

3. **Security Monitoring**:
   - Authentication attempts
   - API abuse detection
   - File upload monitoring
   - Access logging

## Deployment Architecture

The application is designed for deployment on Vercel:

1. **Build Process**:
   - TypeScript compilation
   - Asset optimization
   - Environment configuration
   - Database migrations

2. **Runtime Environment**:
   - Serverless functions
   - Edge functions
   - Static file serving
   - Database connections

3. **Infrastructure**:
   - CDN distribution
   - Database hosting
   - File storage
   - Monitoring services

4. **CI/CD Pipeline**:
   - Automated testing
   - Build verification
   - Deployment automation
   - Environment management 