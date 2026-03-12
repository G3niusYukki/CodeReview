# Deployment Guide

## Prerequisites

- Node.js 20+
- npm 9+
- PostgreSQL 14+
- Redis 7+
- Docker (optional)

## Quick Start

### 1. Clone and Setup

```bash
git clone https://github.com/G3niusYukki/CodeReview.git
cd CodeReview

# Install dependencies
npm install
npm run install:all
```

### 2. Database Setup

#### Using Docker (Recommended)

```bash
# Start PostgreSQL and Redis
docker run -d --name codereview-postgres \
  -e POSTGRES_DB=code_review_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16-alpine

docker run -d --name codereview-redis \
  -p 6379:6379 \
  redis:7-alpine
```

#### Manual Setup

Create PostgreSQL database:
```sql
CREATE DATABASE code_review_db;
```

Run migrations:
```bash
psql -d code_review_db -f database/schema.sql
psql -d code_review_db -f database/migrations/003_add_ai_providers.sql
```

### 3. Environment Variables

Create `.env` files:

**Server** (`server/.env`):
```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=5432
DB_NAME=code_review_db
DB_USER=postgres
DB_PASSWORD=postgres

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your-jwt-secret-min-32-characters
ENCRYPTION_KEY=your-encryption-key-min-32-characters

# AI Provider (choose one)
GLM5_API_URL=https://open.bigmodel.cn/api/paas/v4/chat/completions
GLM5_API_KEY=your_glm_api_key

# Optional: GitHub OAuth
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=http://localhost:3001/api/auth/github/callback

# Optional: Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

**Client** (`client/.env`):
```env
VITE_API_BASE_URL=http://localhost:3001
```

### 4. Build and Start

#### Production Mode

```bash
# Build frontend
cd client && npm run build

# Start backend
cd ../server
export STRIPE_SECRET_KEY=dummy_key
node dist/app.js

# Serve frontend (in another terminal)
cd client/dist
python3 -m http.server 8080
```

#### Development Mode

```bash
# Terminal 1: Start backend
npm run dev:server

# Terminal 2: Start frontend
npm run dev:client

# Terminal 3: Start worker (optional)
cd server && npm run worker
```

### 5. Seed Default Data

```bash
cd server
node scripts/seed-providers.js
```

## Common Issues

### Issue 1: Tailwind CSS Build Error

**Error**: `Cannot read properties of undefined (reading 'S')`

**Cause**: Tailwind CSS v4 uses different import syntax

**Fix**: Update `client/src/index.css`:
```css
/* Before (v3) */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* After (v4) */
@import "tailwindcss";
```

### Issue 2: React Version Mismatch

**Error**: `Cannot read properties of undefined (reading 'S')`

**Cause**: React 18 and React-DOM 19 mismatch

**Fix**: Ensure matching versions in `client/package.json`:
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.20.0"
}
```

Note: React Router v7 requires React 19. Use v6 for React 18.

### Issue 3: TypeScript Compilation Errors

**Error**: `Could not find a declaration file for module`

**Fix**: Update `server/tsconfig.json`:
```json
{
  "compilerOptions": {
    "noImplicitAny": false,
    "strictNullChecks": false,
    "allowJs": true
  }
}
```

### Issue 4: Module Not Found

**Error**: `Cannot find module './providers'`

**Fix**: Update import path in `server/src/services/codeReviewService.js`:
```javascript
// Before
const { ProviderFactory } = require('./providers');

// After
const { ProviderFactory } = require('../providers');
```

### Issue 5: Database Sync Errors

**Error**: `default for column "plan" cannot be cast automatically`

**Fix**: In `server/src/app.ts`, set `alter: false`:
```javascript
await sequelize.sync({ alter: false });
```

Or use migrations instead of sync.

### Issue 6: Stripe Key Required

**Error**: `Neither apiKey nor config.authenticator provided`

**Fix**: Set a dummy key for development:
```bash
export STRIPE_SECRET_KEY=sk_test_dummy_key
```

## Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Production Deployment

### Build for Production

```bash
# Build frontend
cd client
npm run build

# The dist/ folder contains static files
# Serve with nginx, Apache, or any static server
```

### Environment Variables for Production

```env
NODE_ENV=production
FRONTEND_URL=https://your-domain.com

# Use strong secrets
JWT_SECRET=generate-random-64-char-string
ENCRYPTION_KEY=generate-random-32-char-string

# Database
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=code_review_db
DB_USER=postgres
DB_PASSWORD=strong-password

# Redis
REDIS_HOST=your-redis-host
REDIS_PORT=6379
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/client/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Verification

After deployment, verify:

```bash
# Test health endpoint
curl http://localhost:3001/health

# Test frontend
curl http://localhost:8080

# Test API
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","username":"test"}'
```

## Troubleshooting

### Check Service Status

```bash
# Check ports
lsof -i :3001  # Backend
lsof -i :8080  # Frontend
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis

# Check processes
ps aux | grep node
ps aux | grep python
```

### View Logs

```bash
# Backend logs
tail -f /tmp/server.log

# Frontend build logs
cat client/dist/build.log

# Docker logs
docker logs codereview-postgres
docker logs codereview-redis
```

### Reset Everything

```bash
# Kill processes
pkill -f node
pkill -f python

# Clear npm cache
npm cache clean --force
rm -rf node_modules client/node_modules server/node_modules
rm package-lock.json client/package-lock.json

# Reinstall
npm install
npm run install:all
```

## Support

If you encounter issues not covered here:
1. Check the [GitHub Issues](https://github.com/G3niusYukki/CodeReview/issues)
2. Review the [API Documentation](docs/API.md)
3. Check [AI Provider Guide](docs/AI_PROVIDER_GUIDE.md)
