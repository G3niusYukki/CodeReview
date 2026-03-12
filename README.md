# CodeReview

AI-powered code review platform with a React frontend and Node.js/Express backend.

CodeReview helps you analyze source code for:

- security issues
- performance problems
- code quality and maintainability risks
- architecture and best-practice improvements

It supports manual code paste, local file upload, user authentication, review history, GitHub integration scaffolding, and subscription billing hooks.

---

## Stack

### Frontend
- React
- Vite
- React Router
- Tailwind CSS
- Monaco Editor
- Axios

### Backend
- Node.js
- Express
- Sequelize
- PostgreSQL
- JWT authentication
- Stripe billing integration

### AI integration
- GLM-compatible chat completion API via configurable endpoint

---

## Project structure

```text
.
├── client/                  # React + Vite frontend
├── server/                  # Express API server
├── database/                # SQL schema
├── .github/                 # GitHub templates and CI
├── docker-compose.yml       # Local development services
├── package.json             # Root workspace scripts
└── README.md
```

---

## Features

- User registration and login
- JWT-based authentication
- GitHub OAuth login flow
- Code review submission
- Review status polling
- Review history
- Basic usage limits by plan
- Stripe checkout and customer portal integration
- GitHub repository connection endpoints
- Web-based code editor using Monaco

---

## Requirements

- Node.js 18+
- npm 9+
- PostgreSQL 14+

Optional:
- Stripe account for billing flows
- GitHub OAuth app for GitHub login
- GLM-compatible model API credentials

---

## Environment variables

Create environment files for the backend and frontend before starting the app.

### Backend example

Create `server/.env`:

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=5432
DB_NAME=code_review_db
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=change_me
JWT_EXPIRE=7d

GLM5_API_URL=https://your-model-endpoint.example.com/v1/chat/completions
GLM5_API_KEY=your_api_key

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3001/api/auth/github/callback

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_BASIC_PRICE_ID=price_basic
STRIPE_PRO_PRICE_ID=price_pro
STRIPE_TEAM_PRICE_ID=price_team
```

### Frontend example

Create `client/.env` if needed for frontend-only settings.

In local development, the frontend proxies `/api` requests to `http://localhost:3001` through Vite.

---

## Installation

### 1. Install dependencies

From the project root:

```bash
npm run install:all
```

This installs dependencies for:

- `server`
- `client`

---

## Database setup

### Option A: create the database manually

Create a PostgreSQL database:

```sql
CREATE DATABASE code_review_db;
```

Then initialize schema using the SQL file in `database/schema.sql`, or let Sequelize create tables during development.

### Option B: use your own existing database

Update the backend environment variables in `server/.env` to point to your PostgreSQL instance.

---

## Running locally

### Start frontend and backend together

```bash
npm run dev
```

This starts:

- backend on `http://localhost:3001`
- frontend on `http://localhost:5173`

### Start services individually

Backend:

```bash
npm run dev:server
```

Frontend:

```bash
npm run dev:client
```

---

## Production build

Build the frontend:

```bash
npm run build
```

Start the backend:

```bash
npm run start
```

---

## API overview

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/github`
- `GET /api/auth/github/callback`

### User
- `GET /api/user/profile`
- `PUT /api/user/profile`
- `GET /api/user/usage`

### Reviews
- `POST /api/review/analyze`
- `GET /api/review/status/:id`
- `GET /api/review/history`
- `GET /api/review/:id`
- `DELETE /api/review/:id`

### GitHub
- `POST /api/github/connect`
- `GET /api/github/repos`
- `GET /api/github/repos/:owner/:repo/contents`
- `GET /api/github/repos/:owner/:repo/file`
- `GET /api/github/repos/:owner/:repo/branches`

### Billing
- `GET /api/payment/plans`
- `POST /api/payment/create-checkout-session`
- `POST /api/payment/create-portal-session`
- `POST /api/payment/webhook`

### Health
- `GET /health`

---

## How code review works

1. User submits code from the web UI
2. Backend creates a review record with `processing` status
3. Backend sends the code to the configured AI model endpoint
4. Response is parsed into:
   - summary
   - issues
   - security issue count
   - performance issue count
   - best-practice issue count
5. Review result is stored and shown in the dashboard/history

---

## Notes and current limitations

- Review analysis currently runs in-process, not through a dedicated background queue
- JWT is returned to the frontend and stored client-side
- GitHub token persistence is currently in-memory
- Stripe billing requires full environment configuration before use
- Sequelize schema sync is used in development

If you plan to deploy this in production, you should harden authentication, OAuth state handling, token storage, and job processing.

---

## Scripts

### Root
- `npm run install:all` — install frontend and backend dependencies
- `npm run dev` — run frontend and backend together
- `npm run dev:server` — run backend in dev mode
- `npm run dev:client` — run frontend in dev mode
- `npm run build` — build frontend
- `npm run start` — start backend

### Server
- `npm run dev` — start backend with nodemon
- `npm run start` — start backend with node
- `npm run db:migrate` — run database bootstrap script
- `npm run test` — run Jest tests

### Client
- `npm run dev` — start Vite dev server
- `npm run build` — build frontend
- `npm run preview` — preview production build

---

## CI

The repository includes a GitHub Actions workflow under `.github/workflows/ci.yml`.

You should update it to match the current Node-based product if you continue evolving this repository as CodeReview.

---

## Security

Before public deployment, review these areas carefully:

- JWT secret management
- GitHub OAuth callback validation
- persistent encrypted storage for GitHub access tokens
- Stripe webhook verification in production
- request rate limiting
- structured audit logging
- background job retries and failure handling
- CORS policy tightening

---

## License

MIT

---

## Contributing

1. Create a feature branch
2. Make focused changes
3. Verify frontend and backend both run locally
4. Open a pull request with a clear summary

Suggested commit prefixes:

- `feat:`
- `fix:`
- `docs:`
- `refactor:`
- `test:`
- `chore:`

---

## Roadmap ideas

- structured JSON output from the AI review pipeline
- review detail page UI
- background job queue for analysis
- secure OAuth token storage
- organization/team workspaces
- pull request review integration
- usage analytics dashboard
- webhooks and API keys for automation

---

## Branding

Preferred product name:

**CodeReview**

Suggested repository name:

**CodeReview** or `code-review`

Suggested frontend title:

**CodeReview — AI-Powered Code Analysis**