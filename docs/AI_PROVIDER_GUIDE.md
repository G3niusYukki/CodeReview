# AI Provider Configuration Guide

## Overview

CodeReview now supports multiple AI providers with custom endpoints. You can configure and switch between different AI providers including OpenAI, Anthropic, Google Gemini, and custom OpenAI-compatible endpoints.

## Supported Providers

### Built-in Providers

1. **OpenAI** (GPT-4, GPT-4 Turbo, GPT-3.5 Turbo)
2. **Anthropic** (Claude 3 Opus, Sonnet, Haiku)
3. **Google** (Gemini Pro)
4. **OpenAI-Compatible** (Any OpenAI API-compatible service)

## Quick Start

### 1. Configure Default Provider

Providers are stored in the database and can be managed via API:

```bash
# Get available providers
curl /api/providers

# Create a custom provider (Team plan required)
curl -X POST /api/providers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "my-custom-ai",
    "displayName": "My Custom AI",
    "providerType": "openai-compatible",
    "apiEndpoint": "https://api.custom-ai.com/v1/chat/completions",
    "apiKey": "your-api-key",
    "defaultModel": "custom-model-v1",
    "availableModels": ["custom-model-v1", "custom-model-v2"],
    "config": {
      "temperature": 0.3,
      "maxTokens": 4000,
      "timeout": 60000,
      "supportsJsonMode": true,
      "authType": "bearer"
    }
  }'
```

### 2. Use Provider in Code Review

```bash
# Request review with specific provider
curl -X POST /api/review/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "code": "const x = 1;",
    "language": "javascript",
    "provider": "my-custom-ai",
    "model": "custom-model-v1"
  }'
```

## Provider Types

### OpenAI
```json
{
  "providerType": "openai",
  "apiEndpoint": "https://api.openai.com/v1/chat/completions",
  "defaultModel": "gpt-4",
  "config": {
    "temperature": 0.3,
    "maxTokens": 4000,
    "timeout": 60000
  }
}
```

### Anthropic
```json
{
  "providerType": "anthropic",
  "apiEndpoint": "https://api.anthropic.com/v1/messages",
  "defaultModel": "claude-3-opus-20240229",
  "config": {
    "temperature": 0.3,
    "maxTokens": 4000,
    "timeout": 60000
  }
}
```

### Google
```json
{
  "providerType": "google",
  "apiEndpoint": "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
  "defaultModel": "gemini-pro",
  "config": {
    "temperature": 0.3,
    "maxTokens": 4000,
    "timeout": 60000
  }
}
```

### OpenAI-Compatible (Custom)
```json
{
  "providerType": "openai-compatible",
  "apiEndpoint": "https://your-custom-api.com/v1/chat/completions",
  "defaultModel": "your-model",
  "config": {
    "temperature": 0.3,
    "maxTokens": 4000,
    "timeout": 60000,
    "supportsJsonMode": true,
    "authType": "bearer"
  }
}
```

## Configuration Options

### Common Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Unique identifier |
| displayName | string | Yes | Human-readable name |
| providerType | enum | Yes | Provider type |
| apiEndpoint | string | Yes | API endpoint URL |
| apiKey | string | No | API key (encrypted) |
| defaultModel | string | Yes | Default model |
| availableModels | array | No | Available models |
| headers | object | No | Custom headers |
| config | object | No | Provider-specific config |
| isActive | boolean | No | Active status |
| isDefault | boolean | No | Default provider |
| priority | number | No | Priority (higher = preferred) |
| rateLimitRPM | number | No | Rate limit (requests/min) |
| description | string | No | Description |

### Config Options

```json
{
  "temperature": 0.3,
  "maxTokens": 4000,
  "timeout": 60000,
  "supportsJsonMode": true,
  "authType": "bearer"
}
```

- `temperature`: Response creativity (0-1)
- `maxTokens`: Maximum response tokens
- `timeout`: Request timeout (ms)
- `supportsJsonMode`: Whether API supports JSON mode
- `authType`: Authentication type (`bearer`, `x-api-key`)

## API Endpoints

### List Providers
```
GET /api/providers
```

### List All Providers (Admin)
```
GET /api/providers/admin
```

### Create Provider
```
POST /api/providers
```

### Update Provider
```
PUT /api/providers/:id
```

### Delete Provider
```
DELETE /api/providers/:id
```

### Test Provider
```
POST /api/providers/:id/test
```

### Get Provider Status
```
GET /api/providers/status
```

### Set Default Provider
```
POST /api/providers/:id/set-default
```

## Database Migration

Run the migration to create AIProviders table:

```bash
psql -d your_database -f database/migrations/003_add_ai_providers.sql
```

## Seed Default Providers

```bash
cd server
node scripts/seed-providers.js
```

## Environment Variables

For backward compatibility, you can still use environment variables:

```env
GLM5_API_URL=https://your-api.com/v1/chat/completions
GLM5_API_KEY=your-api-key
```

These will be used as a fallback provider if no providers are configured in the database.

## Frontend Usage

```typescript
import { providerService, reviewService } from '@/services';

// Get available providers
const { providers } = await providerService.getAll();

// Create review with specific provider
await reviewService.create({
  code: 'const x = 1;',
  language: 'javascript',
  provider: 'openai',
  model: 'gpt-4'
});
```

## Permissions

- **Free/Basic/Pro**: View available providers
- **Team**: Create, update, delete custom providers

## Response Format

All providers return structured JSON:

```json
{
  "summary": "Brief overview...",
  "score": {
    "security": 85,
    "performance": 90,
    "maintainability": 75,
    "overall": 83
  },
  "issues": [...],
  "metrics": {...},
  "processingTime": 2.5,
  "provider": "openai"
}
```
