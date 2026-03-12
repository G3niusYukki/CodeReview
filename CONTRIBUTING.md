# Contributing to CodeReview

Thanks for your interest in contributing to `CodeReview`.

This repository contains a full-stack JavaScript application for AI-powered code review:

- `client/` — React + Vite frontend
- `server/` — Express + Sequelize API
- `database/` — SQL schema and bootstrap assets
- `.github/` — issue templates, CI, and pull request workflow

## Development Setup

### Prerequisites

Before you begin, make sure you have:

- Node.js 18+
- npm 9+
- PostgreSQL 14+
- A GitHub account
- A GLM/OpenAI-compatible API key for code review analysis
- Optional: Stripe and GitHub OAuth credentials for billing and social login flows

### Clone and install

```bash
git clone https://github.com/G3niusYukki/code-review.git
cd code-review
npm install
cd server && npm install
cd ../client && npm install
```

Or from the repository root:

```bash
npm run install:all
```

## Running the Project Locally

### 1. Configure environment variables

Create local environment files from the examples:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Then update the values for your local environment.

Typical backend variables include:

- `PORT`
- `FRONTEND_URL`
- `JWT_SECRET`
- `JWT_EXPIRE`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `GLM5_API_URL`
- `GLM5_API_KEY`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GITHUB_CALLBACK_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

### 2. Start PostgreSQL

Create the database referenced by your backend config, for example:

```bash
createdb code_review_db
```

### 3. Initialize the schema

Apply the SQL schema:

```bash
psql -d code_review_db -f database/schema.sql
```

### 4. Start the app

From the repository root:

```bash
npm run dev
```

This starts:

- frontend on `http://localhost:5173`
- backend on `http://localhost:3001`

You can also run each service separately:

```bash
npm run dev:server
npm run dev:client
```

## Project Structure

```text
.
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Shared UI components
│   │   ├── hooks/           # Reusable hooks
│   │   └── pages/           # Route-level pages
├── server/                  # Express backend
│   └── src/
│       ├── config/          # DB and runtime config
│       ├── middleware/      # Auth and request guards
│       ├── models/          # Sequelize models
│       ├── routes/          # API route handlers
│       └── services/        # Core business logic
├── database/                # SQL schema and setup files
└── .github/                 # GitHub workflow and templates
```

## How to Contribute

### Reporting bugs

Open an issue with:

- a clear summary
- expected behavior
- actual behavior
- reproduction steps
- screenshots or logs when relevant
- environment details:
  - OS
  - Node version
  - npm version
  - PostgreSQL version

### Suggesting features

Open a feature request with:

- the problem you want to solve
- why it matters
- your proposed solution
- alternatives considered
- any UI or API examples

### Working on code changes

1. Fork the repository
2. Create a branch from `main`

```bash
git checkout -b feat/short-description
```

3. Make your changes
4. Test locally
5. Commit with a clear message
6. Push your branch
7. Open a pull request

## Pull Request Guidelines

Please keep pull requests:

- focused on one concern
- small enough to review easily
- clearly described
- linked to an issue when applicable

Include in your PR description:

- what changed
- why it changed
- how you tested it
- screenshots for UI changes
- any migration or environment changes reviewers should know about

## Code Style

### General

- Prefer small, focused modules
- Avoid mixing UI, API, and persistence concerns
- Use descriptive names for variables, functions, and components
- Keep route handlers thin and business logic in services
- Reuse helpers instead of duplicating logic

### Frontend

- Use functional React components
- Keep pages route-oriented and move reusable UI into `components/`
- Keep state localized when possible
- Prefer clear loading, success, and error states
- Avoid deeply nested JSX when it can be decomposed

### Backend

- Validate request input
- Return consistent JSON responses
- Avoid putting heavy logic directly in route files
- Handle async errors explicitly
- Keep secrets in environment variables only

## Testing Expectations

At minimum, before opening a PR, make sure:

- the frontend builds successfully
- the backend starts successfully
- the main user flow you touched works locally
- database-related changes are verified against PostgreSQL

Recommended checks:

### Frontend build

```bash
cd client
npm run build
```

### Backend smoke test

```bash
cd server
npm run dev
```

### Root scripts

```bash
npm run build
npm run start
```

If you add tests, place them close to the relevant module or in a dedicated test structure that matches the current codebase.

## Commit Convention

We recommend using Conventional Commits:

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation only
- `refactor:` internal restructuring
- `test:` tests added or updated
- `chore:` tooling, deps, CI, maintenance

Examples:

```text
feat: add review detail page
fix: correct review history pagination
docs: update local setup instructions
```

## Database Changes

If your change affects the schema:

- update `database/schema.sql`
- document any manual migration steps in the PR
- call out breaking changes clearly
- avoid silent schema drift between models and SQL

## Security

Please follow these rules:

- never commit real secrets
- never commit populated `.env` files
- do not log tokens, passwords, or API keys
- sanitize and validate any user-controlled input
- be careful with OAuth, billing, and webhook code paths

If you discover a security issue, please do not open a public issue. Use the repository security reporting flow instead.

## Areas Especially Helpful for Contributions

Contributions are especially welcome in:

- review result quality and parsing
- GitHub integration UX
- auth and session hardening
- review history and detail pages
- dashboard metrics
- billing flow polish
- test coverage
- CI improvements
- developer experience and docs

## Questions

If anything is unclear, open an issue or draft PR and explain what you're trying to build. Clear context makes review much faster.

Thanks for helping improve `CodeReview`.