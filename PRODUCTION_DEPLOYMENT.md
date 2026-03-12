# Production Deployment Guide

Complete guide to deploy CodeReview to production with custom domain and enable users to use their own API keys.

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Cloudflare    │────▶│   Vercel/       │────▶│   Railway/      │
│   (CDN + DNS)   │     │   Netlify       │     │   Render        │
│                 │     │   (Frontend)    │     │   (Backend)     │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                              ┌──────────────────────────┼──────────┐
                              │                          │          │
                    ┌─────────▼────────┐    ┌───────────▼────┐ ┌───▼──────────┐
                    │   Supabase       │    │   Upstash      │ │   AI APIs    │
                    │   (PostgreSQL)   │    │   (Redis)      │ │   (OpenAI,   │
                    │                  │    │                │ │   Anthropic) │
                    └──────────────────┘    └────────────────┘ └──────────────┘
```

## Option 1: Deploy to Vercel + Railway (Recommended)

### Step 1: Prepare Your Repository

```bash
# Push your code to GitHub
git add .
git commit -m "Ready for production"
git push origin main
```

### Step 2: Deploy Backend to Railway

1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your CodeReview repository
4. Add PostgreSQL:
   - Click "New" → "Database" → "Add PostgreSQL"
5. Add Redis:
   - Click "New" → "Database" → "Add Redis"
6. Configure Environment Variables:

```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend-domain.vercel.app

# Database (Railway provides these automatically)
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}

# Redis (Railway provides these automatically)
REDIS_HOST=${{Redis.REDISHOST}}
REDIS_PORT=${{Redis.REDISPORT}}
REDIS_PASSWORD=${{Redis.REDISPASSWORD}}

# Security
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
ENCRYPTION_KEY=your-encryption-key-32-characters

# AI Provider (System default)
OPENAI_API_KEY=sk-your-openai-key
# or
GLM5_API_URL=https://your-api-endpoint
GLM5_API_KEY=your-key

# Optional: GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=https://your-backend-domain.up.railway.app/api/auth/github/callback

# Optional: Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_BASIC_PRICE_ID=price_xxx
STRIPE_PRO_PRICE_ID=price_xxx
STRIPE_TEAM_PRICE_ID=price_xxx
```

7. Add `railway.json` in server folder:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node dist/app.js",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

8. Add `Dockerfile` in server folder:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["node", "dist/app.js"]
```

9. Deploy!

### Step 3: Deploy Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Vite
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. Environment Variables:

```env
VITE_API_BASE_URL=https://your-backend-domain.up.railway.app
```

6. Deploy!

### Step 4: Connect Domain (Optional)

1. Buy domain from Cloudflare/Namecheap
2. In Vercel: Project Settings → Domains → Add Domain
3. In Railway: Settings → Domains → Add Domain
4. Configure DNS in Cloudflare:
   - `app.yourdomain.com` → CNAME → `cname.vercel-dns.com`
   - `api.yourdomain.com` → CNAME → `your-backend-domain.up.railway.app`

## Option 2: Deploy to VPS (DigitalOcean/AWS)

### Using Docker Compose

1. Create a VPS (Ubuntu 22.04)
2. Install Docker and Docker Compose
3. Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: code_review_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql
    ports:
      - "5432:5432"
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis-data:/data
    ports:
      - "6379:6379"
    restart: unless-stopped

  backend:
    build: ./server
    environment:
      NODE_ENV: production
      PORT: 3001
      FRONTEND_URL: ${FRONTEND_URL}
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: code_review_db
      DB_USER: postgres
      DB_PASSWORD: ${DB_PASSWORD}
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: ${REDIS_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      ENCRYPTION_KEY: ${ENCRYPTION_KEY}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    ports:
      - "3001:3001"
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  frontend:
    image: nginx:alpine
    volumes:
      - ./client/dist:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    restart: unless-stopped

  worker:
    build: ./server
    command: npm run worker
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: code_review_db
      DB_USER: postgres
      DB_PASSWORD: ${DB_PASSWORD}
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: ${REDIS_PASSWORD}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

volumes:
  postgres-data:
  redis-data:
```

4. Create `.env` file on server:

```bash
DB_PASSWORD=your-strong-db-password
REDIS_PASSWORD=your-strong-redis-password
FRONTEND_URL=https://yourdomain.com
JWT_SECRET=generate-random-64-char-string
ENCRYPTION_KEY=generate-random-32-char-string
OPENAI_API_KEY=sk-your-openai-key
```

5. Deploy:

```bash
# Clone repository
git clone https://github.com/yourusername/CodeReview.git
cd CodeReview

# Copy .env file
scp .env root@your-server-ip:/root/CodeReview/

# Build and run
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose exec postgres psql -U postgres -d code_review_db -f /docker-entrypoint-initdb.d/01-schema.sql
```

## Option 3: Deploy to Render (Free Tier Available)

### Backend

1. Go to [Render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect GitHub repo
4. Configure:
   - Name: `codereview-api`
   - Root Directory: `server`
   - Build Command: `npm install && npm run build`
   - Start Command: `node dist/app.js`
   - Plan: Free (or Starter $7/month for always-on)

5. Add PostgreSQL:
   - New → PostgreSQL → Name: `codereview-db`
   - Plan: Free (or Starter)

6. Add Redis:
   - New → Redis → Name: `codereview-redis`
   - Plan: Free

7. Copy connection strings to environment variables

### Frontend

1. New → Static Site
2. Connect GitHub repo
3. Configure:
   - Name: `codereview-app`
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Publish Directory: `dist`

## Enabling Users to Use Their Own API Keys

### 1. Add API Key Fields to User Model

```javascript
// server/src/models/User.js
apiKey: {
  type: DataTypes.TEXT,
  allowNull: true,
  set(value) {
    if (value) {
      this.setDataValue('apiKey', encrypt(value));
    }
  },
  get() {
    const value = this.getDataValue('apiKey');
    return value ? decrypt(value) : null;
  }
},
apiProvider: {
  type: DataTypes.ENUM('openai', 'anthropic', 'google', 'custom'),
  allowNull: true
},
apiEndpoint: {
  type: DataTypes.STRING,
  allowNull: true
}
```

### 2. Update Code Review Service

```javascript
// server/src/services/codeReviewService.js
async reviewCode(codeContent, language, options = {}) {
  const userId = options.userId;
  const user = await User.findByPk(userId);
  
  // If user has their own API key, use it
  if (user.apiKey) {
    const customConfig = {
      name: 'user-custom',
      providerType: user.apiProvider || 'openai-compatible',
      apiEndpoint: user.apiEndpoint || getDefaultEndpoint(user.apiProvider),
      apiKey: user.apiKey,
      defaultModel: 'gpt-4', // or user preference
      config: {
        temperature: 0.3,
        maxTokens: 4000,
        timeout: 60000
      }
    };
    
    const provider = ProviderFactory.createProvider(customConfig);
    return provider.reviewCode(codeContent, language, options);
  }
  
  // Otherwise use system default
  return this.defaultProvider.reviewCode(codeContent, language, options);
}
```

### 3. Add Settings API Endpoints

```javascript
// server/src/routes/user.js

// Update API settings
router.put('/settings/api', auth, async (req, res) => {
  const { apiKey, apiProvider, apiEndpoint } = req.body;
  
  // Validate API key by making test request
  if (apiKey) {
    const isValid = await validateApiKey(apiKey, apiProvider, apiEndpoint);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid API key' });
    }
  }
  
  await req.user.update({
    apiKey: apiKey || null,
    apiProvider: apiProvider || null,
    apiEndpoint: apiEndpoint || null
  });
  
  res.json({ message: 'API settings updated' });
});

// Get API settings (without key)
router.get('/settings/api', auth, async (req, res) => {
  res.json({
    hasApiKey: Boolean(req.user.apiKey),
    apiProvider: req.user.apiProvider,
    apiEndpoint: req.user.apiEndpoint ? 'configured' : null
  });
});
```

### 4. Frontend Settings Page

Add to `client/src/pages/Settings.jsx`:

```jsx
const [apiSettings, setApiSettings] = useState({
  apiKey: '',
  apiProvider: 'openai',
  apiEndpoint: ''
});

const handleSaveApi = async () => {
  try {
    await axios.put('/api/user/settings/api', apiSettings);
    toast.success('API settings saved!');
  } catch (error) {
    toast.error(error.response?.data?.error || 'Failed to save');
  }
};

// In render:
<div className="api-settings">
  <h3>Use Your Own API Key</h3>
  <p className="text-sm text-gray-600">
    Free users can use their own OpenAI/Anthropic API key for unlimited reviews
  </p>
  
  <select
    value={apiSettings.apiProvider}
    onChange={(e) => setApiSettings({...apiSettings, apiProvider: e.target.value})}
  >
    <option value="openai">OpenAI</option>
    <option value="anthropic">Anthropic Claude</option>
    <option value="google">Google Gemini</option>
    <option value="custom">Custom Endpoint</option>
  </select>
  
  {apiSettings.apiProvider === 'custom' && (
    <input
      type="text"
      placeholder="API Endpoint URL"
      value={apiSettings.apiEndpoint}
      onChange={(e) => setApiSettings({...apiSettings, apiEndpoint: e.target.value})}
    />
  )}
  
  <input
    type="password"
    placeholder="Your API Key"
    value={apiSettings.apiKey}
    onChange={(e) => setApiSettings({...apiSettings, apiKey: e.target.value})}
  />
  
  <button onClick={handleSaveApi}>Save API Settings</button>
</div>
```

## SSL/HTTPS Setup

### Using Cloudflare (Free)

1. Add your domain to Cloudflare
2. Change nameservers
3. Enable "Always Use HTTPS"
4. Set SSL/TLS mode to "Full (strict)"

### Using Let's Encrypt

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renew
sudo systemctl enable certbot.timer
```

## Monitoring & Logs

### Using Sentry (Free tier available)

```bash
# Install
npm install @sentry/node @sentry/react

# Initialize in server
const Sentry = require('@sentry/node');
Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: process.env.NODE_ENV
});

# Initialize in client
import * as Sentry from '@sentry/react';
Sentry.init({
  dsn: 'your-sentry-dsn',
  integrations: [new Sentry.BrowserTracing()]
});
```

### Health Check Endpoint

```bash
# Add to your monitoring (UptimeRobot, etc.)
GET https://api.yourdomain.com/health
# Should return: {"status":"ok"}
```

## Cost Estimation

### Free Tier Stack
- **Vercel**: $0 (frontend, 100GB bandwidth)
- **Railway/Render**: $0 (backend sleeps after inactivity)
- **Supabase**: $0 (500MB database)
- **Upstash**: $0 (Redis, 10,000 commands/day)
- **Cloudflare**: $0 (CDN + SSL)

**Total: $0/month** (with limitations)

### Production Stack
- **Vercel Pro**: $20/month
- **Railway/Render**: $20-50/month (always-on)
- **Supabase Pro**: $25/month
- **Upstash**: $10/month
- **Domain**: $10/year

**Total: ~$75-105/month**

## Post-Deployment Checklist

- [ ] Test user registration/login
- [ ] Test code review with system API
- [ ] Test code review with user API key
- [ ] Test GitHub OAuth (if configured)
- [ ] Test Stripe payment (if configured)
- [ ] Test webhooks
- [ ] Configure monitoring/alerts
- [ ] Set up automated backups
- [ ] Document API for users
- [ ] Create user guide

## Support

For deployment issues:
1. Check logs: `docker-compose logs -f`
2. Test endpoints: `curl https://api.yourdomain.com/health`
3. Review [DEPLOYMENT.md](DEPLOYMENT.md) for common issues
