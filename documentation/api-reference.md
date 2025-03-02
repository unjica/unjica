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