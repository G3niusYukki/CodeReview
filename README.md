<p align="center">
  <h1 align="center">🤖 CodeReview</h1>
  <p align="center">AI-Powered Code Review Platform</p>
  <p align="center">
    <a href="https://github.com/G3niusYukki/CodeReview/actions"><img src="https://github.com/G3niusYukki/CodeReview/workflows/CI/badge.svg" alt="CI Status"></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
    <img src="https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg" alt="Node.js">
    <img src="https://img.shields.io/badge/react-19-blue.svg" alt="React">
    <img src="https://img.shields.io/badge/express-5-lightgrey.svg" alt="Express">
  </p>
</p>

---

## 📖 Overview

CodeReview is a comprehensive, AI-powered code review platform that helps development teams analyze source code for security vulnerabilities, performance issues, code quality problems, and best practice violations. 

Built with modern web technologies, it supports multiple AI providers, team collaboration, and extensive customization.

### ✨ Key Features

- 🤖 **Multi-AI Provider Support** — OpenAI, Anthropic Claude, Google Gemini, and custom OpenAI-compatible endpoints
- 🔑 **Bring Your Own API Key** — Free users can use their own API keys for unlimited reviews
- 🔐 **Secure Authentication** — JWT-based auth with GitHub OAuth integration
- 👥 **Team Collaboration** — Team workspaces with role-based access control
- 📝 **Structured Analysis** — JSON-formatted review results with scores and metrics
- 🎯 **Custom Prompts** — Configurable review criteria and output formats
- 📊 **Review History** — Track and manage all code reviews
- 💳 **Subscription Management** — Stripe integration for billing (Free, Basic, Pro, Team plans)
- 🔗 **GitHub Integration** — Connect repositories and review pull requests
- ⚡ **Background Processing** — Redis-based job queue for reliable async processing
- 🔔 **Webhooks** — Real-time notifications for review completion

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+
- **npm** 9+
- **PostgreSQL** 14+
- **Redis** 7+ (for background job processing)

### Installation

```bash
# Clone the repository
git clone https://github.com/G3niusYukki/CodeReview.git
cd CodeReview

# Install all dependencies
npm run install:all

# Setup environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env

# Setup database
psql -U postgres -c "CREATE DATABASE code_review_db;"
psql -d code_review_db -f database/schema.sql
psql -d code_review_db -f database/migrations/003_add_ai_providers.sql

# Seed default AI providers
cd server && node scripts/seed-providers.js

# Start development servers
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

---

## 🚀 Deploy to Production

### Option 1: Vercel + Railway (Recommended)

**One-click deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/G3niusYukki/CodeReview)

See [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md) for detailed instructions.

### Option 2: Docker Compose

```bash
# Clone repository
git clone https://github.com/G3niusYukki/CodeReview.git
cd CodeReview

# Deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

### Quick Deploy Checklist

- [ ] Set up PostgreSQL database
- [ ] Set up Redis
- [ ] Configure environment variables
- [ ] Deploy backend (Railway/Render/AWS)
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Configure custom domain (optional)
- [ ] Set up SSL/HTTPS
- [ ] Test registration & login
- [ ] Configure AI provider

---

## 🏗️ Architecture

```
CodeReview/
├── 📁 client/              # React 19 + Vite frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── services/       # API service layer
│   └── ...
├── 📁 server/              # Express 5 + TypeScript backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── models/         # Sequelize models
│   │   ├── providers/      # AI provider implementations
│   │   ├── services/       # Business logic
│   │   ├── queues/         # Background job processing
│   │   └── middleware/     # Express middleware
│   └── ...
├── 📁 database/            # Database migrations & schema
├── 📁 docs/                # Documentation
├── 📄 docker-compose.yml   # Local development stack
└── 📄 package.json         # Workspace configuration
```

---

## 💻 Technology Stack

### Frontend
- **React 19** — Modern React with latest features
- **Vite 6** — Fast build tooling
- **React Router 7** — Client-side routing
- **Tailwind CSS 4** — Utility-first styling
- **Monaco Editor** — VS Code-powered code editor
- **Axios** — HTTP client

### Backend
- **Node.js 20** — Runtime environment
- **Express 5** — Web framework
- **TypeScript** — Type-safe development
- **Sequelize 6** — ORM for PostgreSQL
- **Bull** — Redis-based job queues
- **JWT** — Authentication
- **Stripe** — Payment processing

### AI Integration
- **OpenAI GPT** — GPT-4, GPT-3.5 Turbo
- **Anthropic Claude** — Claude 3 Opus, Sonnet, Haiku
- **Google Gemini** — Gemini Pro
- **OpenAI-Compatible** — Any OpenAI API-compatible service

### Infrastructure
- **PostgreSQL 16** — Primary database
- **Redis 7** — Job queue & caching
- **Docker** — Containerization
- **GitHub Actions** — CI/CD

---

## 📚 Documentation

- [AI Provider Configuration Guide](docs/AI_PROVIDER_GUIDE.md) — Configure custom AI providers
- [User API Key Guide](docs/USER_API_KEY_GUIDE.md) — Use your own API key for unlimited reviews
- [Production Deployment Guide](PRODUCTION_DEPLOYMENT.md) — Deploy to production
- [Deployment Guide](DEPLOYMENT.md) — Local development and troubleshooting
- [API Documentation](#api-documentation) — REST API reference
- [Contributing Guide](#contributing) — How to contribute
- [Changelog](#changelog) — Version history

---

## 🔌 API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/github` | GitHub OAuth |
| GET | `/api/auth/verify` | Verify OAuth token |

### Code Review
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/review/analyze` | Submit code for review |
| GET | `/api/review/status/:id` | Get review status |
| GET | `/api/review/history` | List review history |
| GET | `/api/review/:id` | Get review details |
| DELETE | `/api/review/:id` | Delete review |

### AI Providers (Team Plan)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/providers` | List available providers |
| POST | `/api/providers` | Create custom provider |
| PUT | `/api/providers/:id` | Update provider |
| DELETE | `/api/providers/:id` | Delete provider |
| POST | `/api/providers/:id/test` | Test provider connection |

### Team Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/team` | Create team |
| GET | `/api/team` | List my teams |
| POST | `/api/team/:id/members` | Invite member |
| DELETE | `/api/team/:id/members/:userId` | Remove member |

### Webhooks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/webhooks` | List webhooks |
| POST | `/api/webhooks` | Create webhook |
| POST | `/api/webhooks/:id/test` | Test webhook |

---

## ⚙️ Configuration

### Environment Variables

#### Server (`server/.env`)

```env
# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=code_review_db
DB_USER=postgres
DB_PASSWORD=your_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Security
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key

# AI Provider (Fallback)
GLM5_API_URL=https://your-api.com/v1/chat/completions
GLM5_API_KEY=your_api_key

# OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Billing
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🧪 Development

### Running Tests

```bash
# Server tests
npm run test --workspace server

# Type checking
npm run type-check --workspace server
```

### Database Migrations

```bash
# Run schema
psql -d code_review_db -f database/schema.sql

# Run migrations
psql -d code_review_db -f database/migrations/003_add_ai_providers.sql
```

### Background Worker

```bash
# Start worker process for background jobs
cd server && npm run worker
```

---

## 🚢 Deployment

### Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### Production Build

```bash
# Build frontend
npm run build

# Start production server
npm run start
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Commit Conventions

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation
- `style:` — Code style (formatting)
- `refactor:` — Code refactoring
- `test:` — Tests
- `chore:` — Maintenance

---

## 📋 Roadmap

- [x] Multi-AI provider support
- [x] Team workspaces
- [x] Background job processing
- [x] Webhook notifications
- [x] TypeScript migration
- [ ] Pull Request integration
- [ ] IDE extensions (VS Code, JetBrains)
- [ ] Advanced analytics dashboard
- [ ] Custom review rules
- [ ] API rate limiting per provider

---

## 🛡️ Security

Security is a top priority. The platform implements:

- ✅ **JWT Authentication** with httpOnly cookies
- ✅ **Encrypted Storage** for API keys and tokens
- ✅ **Rate Limiting** on all endpoints
- ✅ **Input Validation** with express-validator
- ✅ **CORS** configuration
- ✅ **Helmet** security headers
- ✅ **Background Jobs** via Redis queue
- ✅ **Signature Verification** for webhooks

See [Security Policy](SECURITY.md) for details.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React Team** — For the amazing frontend library
- **Express Team** — For the robust backend framework
- **OpenAI, Anthropic, Google** — For AI capabilities
- **Open Source Community** — For countless valuable tools

---

## 📞 Support

- 📧 **Issues**: [GitHub Issues](https://github.com/G3niusYukki/CodeReview/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/G3niusYukki/CodeReview/discussions)

---

<p align="center">
  Made with ❤️ by the CodeReview Team
</p>
