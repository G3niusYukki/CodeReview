# API Documentation

## Base URL

```
Development: http://localhost:3001
Production:  https://your-domain.com
```

## Authentication

Most endpoints require Bearer token authentication:

```http
Authorization: Bearer <your-jwt-token>
```

## Response Format

All responses follow this structure:

### Success
```json
{
  "data": { ... },
  "message": "Optional success message"
}
```

### Error
```json
{
  "error": "Error type",
  "message": "Human-readable error description"
}
```

---

## 🔐 Authentication

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "username": "johndoe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "plan": "free",
    "reviewsLimit": 5,
    "reviewsUsed": 0
  }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### GitHub OAuth
```http
GET /api/auth/github
```

Redirects to GitHub OAuth flow.

---

## 👤 Users

### Get Profile
```http
GET /api/user/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "avatar": "https://...",
    "plan": "pro",
    "reviewsLimit": 200,
    "reviewsUsed": 15,
    "reviewsRemaining": 185,
    "subscriptionStatus": "active"
  }
}
```

### Update Profile
```http
PUT /api/user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "newname",
  "language": "zh"
}
```

### Get Usage
```http
GET /api/user/usage
Authorization: Bearer <token>
```

**Response:**
```json
{
  "plan": "pro",
  "reviewsLimit": 200,
  "reviewsUsed": 15,
  "reviewsRemaining": 185,
  "usagePercentage": 7.5,
  "resetDate": "2024-04-01T00:00:00.000Z"
}
```

---

## 📝 Code Reviews

### Submit Code for Review
```http
POST /api/review/analyze
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "function add(a, b) { return a + b; }",
  "language": "javascript",
  "fileName": "math.js",
  "repository": "my-project",
  "branch": "main",
  "provider": "openai",
  "model": "gpt-4"
}
```

**Response:**
```json
{
  "message": "Review started",
  "reviewId": 123,
  "status": "processing"
}
```

### Get Review Status
```http
GET /api/review/status/123
Authorization: Bearer <token>
```

**Response (completed):**
```json
{
  "id": 123,
  "status": "completed",
  "result": [
    {
      "id": 1,
      "severity": "low",
      "category": "quality",
      "title": "Missing JSDoc",
      "description": "Function lacks documentation",
      "line": 1,
      "suggestion": "Add JSDoc comments"
    }
  ],
  "summary": "Clean code with minor documentation issues",
  "score": {
    "security": 100,
    "performance": 95,
    "maintainability": 80,
    "overall": 91
  },
  "issuesFound": 1,
  "securityIssues": 0,
  "performanceIssues": 0,
  "bestPracticeIssues": 1,
  "processingTime": 2.5,
  "provider": "openai",
  "createdAt": "2024-03-12T10:00:00.000Z"
}
```

### List Review History
```http
GET /api/review/history?page=1&limit=20&status=completed
Authorization: Bearer <token>
```

**Response:**
```json
{
  "reviews": [
    {
      "id": 123,
      "fileName": "math.js",
      "language": "javascript",
      "status": "completed",
      "issuesFound": 1,
      "createdAt": "2024-03-12T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "pages": 1,
    "limit": 20
  }
}
```

### Get Review Details
```http
GET /api/review/123
Authorization: Bearer <token>
```

### Delete Review
```http
DELETE /api/review/123
Authorization: Bearer <token>
```

---

## 🤖 AI Providers

### List Available Providers
```http
GET /api/providers
Authorization: Bearer <token>
```

**Response:**
```json
{
  "providers": [
    {
      "name": "openai",
      "displayName": "OpenAI GPT",
      "providerType": "openai",
      "defaultModel": "gpt-4",
      "availableModels": ["gpt-4", "gpt-3.5-turbo"]
    }
  ]
}
```

### Create Provider (Team)
```http
POST /api/providers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "custom-ai",
  "displayName": "Custom AI",
  "providerType": "openai-compatible",
  "apiEndpoint": "https://api.custom.com/v1/chat/completions",
  "apiKey": "sk-...",
  "defaultModel": "custom-model",
  "availableModels": ["custom-model"],
  "config": {
    "temperature": 0.3,
    "maxTokens": 4000
  }
}
```

### Test Provider
```http
POST /api/providers/1/test
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "latency": 1500,
  "provider": "openai",
  "result": {
    "summary": "Test successful",
    "score": { "overall": 100 }
  }
}
```

### Get Provider Status
```http
GET /api/providers/status
Authorization: Bearer <token>
```

---

## 👥 Teams

### Create Team
```http
POST /api/team
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Team"
}
```

### List My Teams
```http
GET /api/team
Authorization: Bearer <token>
```

### Get Team Details
```http
GET /api/team/1
Authorization: Bearer <token>
```

### Invite Member
```http
POST /api/team/1/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "member@example.com",
  "role": "member"
}
```

### Remove Member
```http
DELETE /api/team/1/members/2
Authorization: Bearer <token>
```

---

## 🔗 Webhooks

### List Webhooks
```http
GET /api/webhooks
Authorization: Bearer <token>
```

### Create Webhook
```http
POST /api/webhooks
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://my-app.com/webhook",
  "events": ["review.completed", "review.failed"]
}
```

**Response:**
```json
{
  "message": "Webhook created successfully",
  "webhook": {
    "id": 1,
    "url": "https://my-app.com/webhook",
    "secret": "whsec_...",
    "events": ["review.completed", "review.failed"]
  }
}
```

### Test Webhook
```http
POST /api/webhooks/1/test
Authorization: Bearer <token>
```

### Delete Webhook
```http
DELETE /api/webhooks/1
Authorization: Bearer <token>
```

**Webhook Payload:**
```json
{
  "event": "review.completed",
  "timestamp": "2024-03-12T10:00:00.000Z",
  "data": {
    "reviewId": 123,
    "status": "completed",
    "issuesFound": 5,
    "score": {
      "security": 85,
      "performance": 90
    }
  }
}
```

---

## 💳 Billing

### Get Plans
```http
GET /api/payment/plans
Authorization: Bearer <token>
```

### Create Checkout Session
```http
POST /api/payment/create-checkout-session
Authorization: Bearer <token>
Content-Type: application/json

{
  "plan": "pro"
}
```

### Customer Portal
```http
POST /api/payment/create-portal-session
Authorization: Bearer <token>
```

---

## 📊 Health

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-03-12T10:00:00.000Z"
}
```

---

## Error Codes

| Status | Code | Description |
|--------|------|-------------|
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server error |

## Rate Limits

- **Auth endpoints**: 5 requests per 15 minutes
- **API endpoints**: 60-200 requests per minute (based on plan)
- **Review submission**: 10 requests per minute

---

For more details, see the [AI Provider Guide](AI_PROVIDER_GUIDE.md).
