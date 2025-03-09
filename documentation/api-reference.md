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
        └── ...
```

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
        "sourceNewsIds": ["news1", "news2"]
      }
    ]
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
      "sourceNewsIds": ["news1", "news2"]
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

### Scheduler API

**Endpoint:** `GET /api/scheduler`

**Description:** Retrieves the current status of the scheduler.

**Response:**
- **200 OK**:
  ```json
  {
    "status": "OK",
    "message": "Scheduler API is working",
    "lastRun": "2023-05-01T12:00:00Z",
    "canRunNow": true,
    "note": "This API doesn't provide actual scheduling. Set up an external cron job to call this API with POST to generate articles."
  }
  ```

**Endpoint:** `POST /api/scheduler`

**Description:** Manually triggers the art digest generation task.

**Response:**
- **200 OK**: Task successfully triggered
  ```json
  {
    "status": "OK",
    "message": "Article digest generation triggered successfully",
    "lastRun": "2023-05-01T12:00:00Z"
  }
  ```
- **500 Internal Server Error**: Server error
  ```json
  {
    "error": "Failed to run scheduled task"
  }
  ```

**Security Notes:**
The scheduler endpoint can be secured with a secret key provided in the `CRON_SECRET` environment variable. When calling the endpoint from external cron services, include this secret in the query parameter:

```
/api/scheduler?secret=your_secret_key
```

## Authentication

The project uses two primary authentication methods:

1. **API Key Authentication**: Used for scheduler and admin endpoints
   - Uses the `CRON_SECRET` environment variable as a bearer token
   - Format: `Authorization: Bearer <CRON_SECRET>`

2. **Supabase Authentication**: Used for user accounts and admin access
   - Uses Supabase's JWT tokens for authentication
   - Admin access is restricted to specific email addresses
   - Format: `Authorization: Bearer <supabase_jwt_token>`

3. **Vercel Cron Detection**: Auto-authorizes requests in production mode
   - Checks the User-Agent header for "vercel-cron"
   - Only works in production environment

## Error Handling

The API incorporates comprehensive error handling mechanisms:

1. **Database Connection Errors**
   - Fallback content is provided when the database is unavailable
   - Fallback article with ID `fallback-article-1` is returned for article requests
   - Detailed error logging helps with troubleshooting

2. **Error Response Format**
   - All error responses follow a consistent format:
     ```json
     {
       "error": "Error message description",
       "details": "Optional detailed error information"
     }
     ```
   - Appropriate HTTP status codes are returned based on the error type

3. **Validation Errors**
   - Input validation is performed on all request parameters and bodies
   - Clear error messages indicate validation issues

## API Usage Examples

### Subscribing to the Newsletter

**Example Request:**
```javascript
async function subscribeToNewsletter(email) {
  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Subscription failed');
    }
    
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### Manually Generating an Art Digest

**Example Request:**
```javascript
async function generateArtDigest() {
  try {
    const response = await fetch('/api/art-digest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Generation failed');
    }
    
    return data.article;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

## Rate Limiting

Currently, the API does not implement rate limiting. Future updates may include rate limiting to protect against abuse.

## Future API Plans

Planned API enhancements include:

1. User authentication endpoints
2. Contact form submission handling
3. Rate limiting implementation
4. API versioning

### Reactions API

**Endpoint:** `GET /api/reactions`

**Description:** Retrieves reaction counts (likes/dislikes) for an article and the user's reaction if authenticated.

**Query Parameters:**
- `articleId` (required): The ID of the article to get reactions for
- `anonymousId` (optional): Anonymous user identifier for tracking reactions from non-authenticated users

**Response:**
- **200 OK**: Successfully retrieved reactions
  ```json
  {
    "userReaction": {
      "id": "abc123",
      "type": "LIKE",
      "userId": "user123",
      "articleId": "article123",
      "createdAt": "2023-05-01T12:00:00Z"
    },
    "likesCount": 10,
    "dislikesCount": 2
  }
  ```
- **400 Bad Request**: Missing article ID
  ```json
  {
    "error": "Article ID is required"
  }
  ```
- **500 Internal Server Error**: Server error
  ```json
  {
    "error": "Failed to fetch reaction"
  }
  ```

**Special Cases:**
- For the fallback article (`articleId=fallback-article-1`), the API returns empty reaction data without querying the database:
  ```json
  {
    "userReaction": null,
    "likesCount": 0,
    "dislikesCount": 0
  }
  ```

**Endpoint:** `POST /api/reactions`

**Description:** Creates or updates a reaction (like/dislike) for an article.

**Request Body:**
```json
{
  "articleId": "article123",
  "type": "LIKE",
  "anonymousId": "anon123"
}
```

**Response:**
- **200 OK**: Successfully updated reaction
  ```json
  {
    "success": true,
    "likesCount": 11,
    "dislikesCount": 2
  }
  ```
- **400 Bad Request**: Missing required fields
  ```json
  {
    "error": "Article ID or Comment ID is required"
  }
  ```
- **500 Internal Server Error**: Server error
  ```json
  {
    "error": "Failed to update reaction"
  }
  ```

**Special Cases:**
- For the fallback article (`articleId=fallback-article-1`), the API acknowledges the reaction but doesn't store it:
  ```json
  {
    "success": true,
    "message": "Reaction acknowledged but not stored for system article",
    "likesCount": 0,
    "dislikesCount": 0
  }
  ```

**Authentication:**
- The endpoint supports both authenticated and anonymous users
- For authenticated users, include a Bearer token in the Authorization header
- For anonymous users, include an anonymousId in the request body

## Environment Configuration

The API relies on environment variables for configuration. These are defined in the `.env.local` file. Required variables include:

```
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_TO=recipient@example.com
EMAIL_FROM=sender@example.com
```

## Security Considerations

1. Email credentials are stored as environment variables and not exposed to the client
2. Input validation is performed on all API inputs
3. The API follows Next.js best practices for API route implementation 