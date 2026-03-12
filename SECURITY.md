# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | ✅ Active |
| < 1.0   | ❌ Unsupported |

## Reporting a Vulnerability

Please do **not** report security vulnerabilities through public GitHub issues.

Instead, report them privately by using GitHub's private vulnerability reporting for this repository or by contacting the maintainer directly.

When submitting a report, include:

- A clear description of the issue
- The affected component (`client`, `server`, auth flow, billing, GitHub integration, etc.)
- Steps to reproduce
- Expected vs actual behavior
- Potential impact
- Any suggested mitigation or fix, if available

We aim to acknowledge reports within 72 hours and will coordinate remediation privately before public disclosure.

## Scope

This policy applies to the CodeReview application, including:

- `server/` backend APIs
- `client/` frontend application
- Authentication and authorization flows
- GitHub integration endpoints
- Billing and subscription flows
- Database access and stored review data

## Security Expectations

When reviewing or contributing code, pay particular attention to:

- Authentication and session handling
- Authorization checks on all user-scoped resources
- Secure password storage
- Protection of API keys and secrets
- Input validation and output encoding
- Safe handling of uploaded code and repository content
- Webhook verification for payment events
- Third-party OAuth flows and token handling
- Rate limiting and abuse prevention
- Prevention of data leakage across users

## Current Security Practices

CodeReview is expected to follow these practices:

- Passwords are hashed before storage
- JWT secrets and third-party credentials are loaded from environment variables
- Sensitive configuration is not committed to the repository
- Database access should be scoped and validated per user
- External webhooks must be verified before processing
- User input should be validated on the server before persistence or downstream processing

## Sensitive Data Handling

The following data must be treated as sensitive:

- JWT secrets
- OAuth client secrets
- Stripe secrets and webhook secrets
- GitHub access tokens
- User passwords
- Private repository contents
- Submitted source code that may contain proprietary logic or credentials

Do not log, expose, or persist sensitive values in plaintext unless strictly required and properly protected.

## Disclosure Policy

After a vulnerability is confirmed:

1. The issue will be reproduced and triaged
2. A fix or mitigation plan will be prepared
3. A release timeline will be coordinated
4. Public disclosure will happen only after users have had a reasonable chance to update

## Security Tips for Self-Hosting

If you deploy CodeReview yourself, you should:

- Use strong, unique values for `JWT_SECRET`
- Keep `.env` files out of version control
- Run behind HTTPS in production
- Restrict database access to trusted hosts only
- Rotate third-party credentials if exposure is suspected
- Verify Stripe webhook configuration before enabling billing
- Review OAuth callback URLs carefully
- Monitor logs for suspicious auth or API activity