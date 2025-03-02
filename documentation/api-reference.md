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

### Art Digest Generation

**Endpoint:** `GET /api/art-digest`

**Description:** Retrieves all generated art digest articles.

**Response:**
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
        "slug": "modern-art-trends-weekly-digest"
      }
    ]
  }
  ```
- **500 Internal Server Error**: Server error
  ```json
  {
    "error": "Failed to fetch articles"
  }
  ```

**Endpoint:** `POST /api/art-digest`

**Description:** Generates a new art digest article based on recent news.

**Response:**
- **200 OK**: Successfully generated article
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
    "success": true
  }
  ```
- **500 Internal Server Error**: Server error
  ```json
  {
    "error": "Failed to generate article"
  }
  ```

### Scheduler

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

Currently, the API does not implement authentication. Future iterations of the project may include authentication mechanisms.

## Error Handling

API errors follow a consistent format:

```json
{
  "error": "Error message description"
}
```

Common error scenarios:
- Missing required fields
- Invalid input formats
- Server-side processing errors

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