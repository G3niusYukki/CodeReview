# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-03-12

### ✨ Added

- **Multi-AI Provider Support**
  - OpenAI (GPT-4, GPT-3.5)
  - Anthropic (Claude 3)
  - Google (Gemini)
  - Custom OpenAI-compatible endpoints
  - Provider management API
  - Per-provider configuration (temperature, tokens, timeout)
  
- **Team Workspaces**
  - Create and manage teams
  - Role-based access control (owner, admin, member)
  - Team-based review limits
  - Member invitation system

- **Webhook Support**
  - Custom webhook endpoints
  - Event filtering (review.completed, review.failed)
  - HMAC signature verification
  - Auto-disable on repeated failures

- **Background Job Queue**
  - Redis-based Bull queue for code review processing
  - Retry logic with exponential backoff
  - Job progress tracking
  - Separate worker process

- **TypeScript Migration**
  - Server-side TypeScript support
  - Type definitions for API responses
  - Improved developer experience

- **Security Enhancements**
  - JWT tokens in httpOnly cookies
  - GitHub token encryption at rest
  - Rate limiting (auth, API, strict)
  - Input validation improvements

### 🔧 Changed

- **AI Response Format**
  - Structured JSON output with scores
  - Multi-dimensional scoring (security, performance, maintainability)
  - Detailed issue categorization
  - Line number identification

- **Dependencies**
  - React 18 → 19
  - Vite 5 → 6
  - Express 4 → 5
  - Tailwind CSS 3 → 4
  - Stripe SDK 14 → 20

### 🛠️ Fixed

- JWT token exposure in URL parameters
- In-memory GitHub token storage
- Race conditions in review processing
- Missing input validation on profile updates
- CI/CD workflow for npm workspaces

## [1.0.0] - 2024-01-15

### ✨ Added

- Initial release
- User authentication (email/password, GitHub OAuth)
- JWT-based session management
- Code review submission and processing
- Review history and status tracking
- Basic plan management (Free, Basic, Pro, Team)
- Stripe billing integration
- GitHub repository integration (scaffolding)
- Monaco Editor integration
- PostgreSQL database support
- Docker Compose setup

### 🚀 Features

- Manual code paste review
- File upload support
- Real-time review status polling
- Usage tracking and limits
- Web-based code editor
- Responsive UI with Tailwind CSS

---

## Versioning Guidelines

- **Major (X.0.0)**: Breaking changes
- **Minor (0.X.0)**: New features, backwards compatible
- **Patch (0.0.X)**: Bug fixes, security patches

## Unreleased

Planned for upcoming releases:

- [ ] Pull Request integration
- [ ] IDE extensions (VS Code, JetBrains)
- [ ] Advanced analytics dashboard
- [ ] Custom review rules/templates
- [ ] API rate limiting per provider
- [ ] Email notifications
- [ ] Slack/Discord integrations
- [ ] Organization-level billing
