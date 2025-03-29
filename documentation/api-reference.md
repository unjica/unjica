# API Reference

This document provides information about the API endpoints available in the Unjica project.

## API Structure

The project's API endpoints are organized in the following structure:

```
src/
└── app/
    └── api/
        ├── subscribe/
        │   └── route.ts
        ├── scheduler/
        │   └── route.ts
        ├── art-digest/
        │   └── route.ts
        ├── debug-db/
        │   └── route.ts
        ├── cron/
        │   └── route.ts
        ├── auth/
        │   └── route.ts
        ├── comments/
        │   └── route.ts
        ├── reactions/
        │   └── route.ts
        ├── facebook/
        │   └── route.ts
        └── images/
            └── route.ts
```

## Authentication

All protected endpoints require authentication using one of the following methods:

1. **Supabase Auth Token**:
   ```
   Authorization: Bearer <supabase_token>
   ```

2. **Cron Secret** (for scheduler endpoints):
   ```
   Authorization: Bearer <cron_secret>
   ```

3. **Admin Access**:
   - Requires Supabase auth token
   - User must have admin role
   - Email must match admin email in configuration

## Endpoints

### Email Subscription

**Endpoint:** `POST /api/subscribe`

**Description:** Handles email subscription submissions.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
- **200 OK**: Subscription successful
  ```json
  {
    "message": "Subscription successful"
  }
  ```
- **400 Bad Request**: Invalid email or missing fields
  ```json
  {
    "error": "Invalid email address"
  }
  ```
- **500 Internal Server Error**: Server error
  ```json
  {
    "error": "Failed to subscribe. Please try again later."
  }
  ```

**Implementation:**
The endpoint uses Nodemailer to send email notifications about new subscriptions. Configuration for the email service is set in environment variables.

### Art Digest API

#### Retrieve Art Digest Articles

**Endpoint:** `GET /api/art-digest`

**Description:** Retrieves all generated art digest articles or a specific article by ID or slug.

**Query Parameters:**
- `id` (optional): The ID of a specific article to retrieve
- `slug` (optional): The slug of a specific article to retrieve
- `limit` (optional): Number of articles to return (default: 12)
- `cursor` (optional): Pagination cursor
- `topic` (optional): Filter by primary topic
- `tag` (optional): Filter by tag

**Response for All Articles (no ID or slug):**
- **200 OK**: Successfully retrieved articles
  ```json
  {
    "articles": [
      {
        "id": "abc123",
        "title": "Modern Art Trends: Weekly Digest",
        "content": "...",
        "primaryTopic": "Modern Art",
        "summary": "...",
        "tags": ["modern art", "art digest", "contemporary"],
        "publishedAt": "2023-05-01T12:00:00Z",
        "lastUpdated": "2023-05-01T12:00:00Z",
        "imageUrl": "https://example.com/image.jpg",
        "slug": "modern-art-trends-weekly-digest",
        "sourceNewsIds": ["news1", "news2"],
        "commentCount": 5,
        "reactionCount": 10
      }
    ],
    "nextCursor": "next_page_cursor",
    "hasMore": true,
    "totalCount": 50
  }
  ```

**Response for Single Article (by ID or slug):**
- **200 OK**: Successfully retrieved article
  ```json
  {
    "article": {
      "id": "abc123",
      "title": "Modern Art Trends: Weekly Digest",
      "content": "...",
      "primaryTopic": "Modern Art",
      "summary": "...",
      "tags": ["modern art", "art digest", "contemporary"],
      "publishedAt": "2023-05-01T12:00:00Z",
      "lastUpdated": "2023-05-01T12:00:00Z",
      "imageUrl": "https://example.com/image.jpg", 
      "slug": "modern-art-trends-weekly-digest",
      "sourceNewsIds": ["news1", "news2"],
      "commentCount": 5,
      "reactionCount": 10,
      "comments": [
        {
          "id": "comment1",
          "content": "...",
          "createdAt": "2023-05-01T12:30:00Z",
          "user": {
            "id": "user1",
            "name": "John Doe",
            "image": "https://example.com/avatar.jpg"
          }
        }
      ]
    }
  }
  ```
- **404 Not Found**: Article not found
  ```json
  {
    "error": "Article not found"
  }
  ```
- **500 Internal Server Error**: Database error
  ```json
  {
    "error": "Database error when fetching article",
    "details": "Error details..."
  }
  ```

**Error Handling:**
- The API includes fallback article functionality if the database is unavailable
- Detailed error logging helps diagnose issues with database connections
- Appropriate HTTP status codes are returned based on the type of error
- Rate limiting is implemented to prevent abuse

#### Generate Art Digest Article

**Endpoint:** `POST /api/art-digest`

**Description:** Generates a new art digest article based on recent news. Requires authentication.

**Authentication:**
- **Bearer Token**: The request must include an `Authorization: Bearer <token>` header
- **Vercel Cron Jobs**: Automatically authorized in production when the user-agent identifies as `vercel-cron`

**Authentication Methods:**
1. **CRON_SECRET**: The token can match the `CRON_SECRET` environment variable
2. **Supabase Auth**: The token can be a valid Supabase authentication token for an admin user

**Response:**
- **200 OK**: Successfully generated article (or returned existing article if one was already generated today)
  ```json
  {
    "article": {
      "id": "abc123",
      "title": "Modern Art Trends: Weekly Digest",
      "content": "...",
      "primaryTopic": "Modern Art",
      "summary": "...",
      "tags": ["modern art", "art digest", "contemporary"],
      "publishedAt": "2023-05-01T12:00:00Z",
      "lastUpdated": "2023-05-01T12:00:00Z",
      "imageUrl": "https://example.com/image.jpg",
      "slug": "modern-art-trends-weekly-digest"
    },
    "success": true,
    "note": "Returned existing article instead of generating a new one" // Optional field
  }
  ```
- **401 Unauthorized**: Authentication failed
  ```json
  {
    "error": "Authentication error",
    "details": "Error details..."
  }
  ```
- **403 Forbidden**: User not authorized
  ```json
  {
    "error": "Unauthorized. Admin access required."
  }
  ```
- **500 Internal Server Error**: Server error
  ```json
  {
    "error": "Database error when saving article",
    "details": "Error details..."
  }
  ```

**Implementation Details:**
- Checks if an article was already generated today to prevent duplicates
- Uses the `generateDailyArtDigest()` function from artDigestActions.ts
- Handles slug conflicts by appending a timestamp to ensure uniqueness
- Saves generated articles to the database with appropriate metadata
- Generates and stores article images
- Posts to Facebook page if configured

#### Delete Art Digest Article

**Endpoint:** `DELETE /api/art-digest`

**Description:** Deletes a specific art digest article. Requires authentication.

**Query Parameters:**
- `id`: The ID of the article to delete

**Authentication:**
- Same authentication methods as the POST endpoint

**Response:**
- **200 OK**: Successfully deleted article
  ```json
  {
    "success": true,
    "message": "Article deleted successfully"
  }
  ```
- **400 Bad Request**: Missing ID parameter
  ```json
  {
    "error": "Missing article ID"
  }
  ```
- **401 Unauthorized**: Authentication failed
  ```json
  {
    "error": "Authentication error",
    "details": "Error details..."
  }
  ```
- **403 Forbidden**: User not authorized
  ```json
  {
    "error": "Unauthorized. Admin access required."
  }
  ```
- **404 Not Found**: Article not found
  ```json
  {
    "error": "Article not found"
  }
  ```
- **500 Internal Server Error**: Server error
  ```json
  {
    "error": "Database error when deleting article",
    "details": "Error details..."
  }
  ```

**Implementation Details:**
- Deletes all associated comments and reactions
- Removes article image from storage
- Updates related records (tags, categories)
- Maintains data consistency

### Comments API

#### Get Article Comments

**Endpoint:** `GET /api/comments`

**Description:** Retrieves comments for a specific article.

**Query Parameters:**
- `articleId`: The ID of the article
- `limit` (optional): Number of comments to return (default: 20)
- `cursor` (optional): Pagination cursor

**Response:**
- **200 OK**: Successfully retrieved comments
  ```json
  {
    "comments": [
      {
        "id": "comment1",
        "content": "...",
        "createdAt": "2023-05-01T12:30:00Z",
        "user": {
          "id": "user1",
          "name": "John Doe",
          "image": "https://example.com/avatar.jpg"
        },
        "replies": [
          {
            "id": "reply1",
            "content": "...",
            "createdAt": "2023-05-01T12:35:00Z",
            "user": {
              "id": "user2",
              "name": "Jane Smith",
              "image": "https://example.com/avatar2.jpg"
            }
          }
        ]
      }
    ],
    "nextCursor": "next_page_cursor",
    "hasMore": true
  }
  ```

#### Create Comment

**Endpoint:** `POST /api/comments`

**Description:** Creates a new comment on an article.

**Authentication:**
- Optional authentication for user comments
- Anonymous comments allowed

**Request Body:**
```json
{
  "articleId": "article123",
  "content": "Comment text",
  "parentId": "parent123" // Optional, for replies
}
```

**Response:**
- **200 OK**: Comment created successfully
  ```json
  {
    "comment": {
      "id": "comment1",
      "content": "Comment text",
      "createdAt": "2023-05-01T12:30:00Z",
      "user": {
        "id": "user1",
        "name": "John Doe",
        "image": "https://example.com/avatar.jpg"
      }
    }
  }
  ```

### Reactions API

#### Get Article Reactions

**Endpoint:** `GET /api/reactions`

**Description:** Retrieves reactions for a specific article.

**Query Parameters:**
- `articleId`: The ID of the article
- `type` (optional): Filter by reaction type

**Response:**
- **200 OK**: Successfully retrieved reactions
  ```json
  {
    "reactions": [
      {
        "id": "reaction1",
        "type": "like",
        "createdAt": "2023-05-01T12:30:00Z",
        "user": {
          "id": "user1",
          "name": "John Doe",
          "image": "https://example.com/avatar.jpg"
        }
      }
    ],
    "counts": {
      "like": 10,
      "love": 5,
      "wow": 2
    }
  }
  ```

#### Add Reaction

**Endpoint:** `POST /api/reactions`

**Description:** Adds a reaction to an article.

**Authentication:**
- Optional authentication for user reactions
- Anonymous reactions allowed

**Request Body:**
```json
{
  "articleId": "article123",
  "type": "like"
}
```

**Response:**
- **200 OK**: Reaction added successfully
  ```json
  {
    "reaction": {
      "id": "reaction1",
      "type": "like",
      "createdAt": "2023-05-01T12:30:00Z",
      "user": {
        "id": "user1",
        "name": "John Doe",
        "image": "https://example.com/avatar.jpg"
      }
    }
  }
  ```

### Facebook API

#### Post to Facebook

**Endpoint:** `POST /api/facebook`

**Description:** Posts an article to the Facebook page.

**Authentication:**
- Requires admin authentication

**Request Body:**
```json
{
  "articleId": "article123"
}
```

**Response:**
- **200 OK**: Successfully posted to Facebook
  ```json
  {
    "success": true,
    "message": "Successfully posted to Facebook",
    "postId": "facebook_post_id"
  }
  ```
- **400 Bad Request**: Invalid article ID
  ```json
  {
    "error": "Invalid article ID"
  }
  ```
- **401 Unauthorized**: Authentication failed
  ```json
  {
    "error": "Authentication error"
  }
  ```
- **403 Forbidden**: User not authorized
  ```json
  {
    "error": "Unauthorized. Admin access required."
  }
  ```
- **500 Internal Server Error**: Facebook API error
  ```json
  {
    "error": "Failed to post to Facebook",
    "details": "Error details..."
  }
  ```

### Images API

#### Generate Article Image

**Endpoint:** `POST /api/images/generate`

**Description:** Generates an image for an article using DALL-E.

**Authentication:**
- Requires admin authentication

**Request Body:**
```json
{
  "articleId": "article123",
  "topic": "Modern Art",
  "tags": ["contemporary", "exhibition"]
}
```

**Response:**
- **200 OK**: Successfully generated image
  ```json
  {
    "success": true,
    "imageUrl": "https://example.com/image.jpg"
  }
  ```
- **400 Bad Request**: Invalid request
  ```json
  {
    "error": "Invalid request parameters"
  }
  ```
- **401 Unauthorized**: Authentication failed
  ```json
  {
    "error": "Authentication error"
  }
  ```
- **403 Forbidden**: User not authorized
  ```json
  {
    "error": "Unauthorized. Admin access required."
  }
  ```
- **500 Internal Server Error**: Image generation error
  ```json
  {
    "error": "Failed to generate image",
    "details": "Error details..."
  }
  ```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **General Endpoints**: 100 requests per minute
- **Authentication Endpoints**: 5 requests per minute
- **Image Generation**: 10 requests per hour
- **Facebook API**: 50 requests per hour

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1623456789
```

## Error Handling

All API endpoints follow a consistent error handling pattern:

1. **Validation Errors** (400):
   ```json
   {
     "error": "Invalid input",
     "details": ["Field 'email' is required"]
   }
   ```

2. **Authentication Errors** (401):
   ```json
   {
     "error": "Authentication failed",
     "details": "Invalid token"
   }
   ```

3. **Authorization Errors** (403):
   ```json
   {
     "error": "Unauthorized",
     "details": "Admin access required"
   }
   ```

4. **Not Found Errors** (404):
   ```json
   {
     "error": "Resource not found",
     "details": "Article with ID '123' not found"
   }
   ```

5. **Server Errors** (500):
   ```json
   {
     "error": "Internal server error",
     "details": "Database connection failed"
   }
   ```

## CORS Configuration

The API supports CORS with the following configuration:

- **Allowed Origins**: Configured via environment variables
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers**: Content-Type, Authorization
- **Max Age**: 86400 seconds (24 hours)

## Webhooks

The API supports webhooks for certain events:

1. **Article Generation**:
   - Triggered when a new article is generated
   - Includes article data and metadata
   - Requires webhook secret for verification

2. **Comment Creation**:
   - Triggered when a new comment is created
   - Includes comment data and user information
   - Requires webhook secret for verification

Webhook configuration is managed through environment variables:
```
WEBHOOK_SECRET=your_secret_here
WEBHOOK_URL=https://your-webhook-url.com
```

## API Versioning

The API is versioned through the URL path:
- Current version: `/api/v1/`
- Legacy version: `/api/v0/` (deprecated)

Version headers are included in responses:
```
X-API-Version: 1.0.0
```

## Monitoring and Analytics

The API includes built-in monitoring:

1. **Request Logging**:
   - Endpoint accessed
   - Response time
   - Status code
   - User agent
   - IP address

2. **Error Tracking**:
   - Error type
   - Stack trace
   - Request context
   - User information

3. **Performance Metrics**:
   - Response times
   - Database query times
   - Cache hit rates
   - API usage statistics

## Security Headers

The API includes security headers:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
``` 