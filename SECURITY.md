# Security Checklist

This document outlines the security measures implemented in the CMS and best practices for maintaining a secure deployment.

## ✅ Implemented Security Features

### Authentication & Authorization

- [x] **OTP-Based Authentication**
  - 6-digit numeric OTP
  - 10-minute expiration window
  - Single-use tokens (invalidated after verification)
  - Rate limiting: 3 OTP requests per hour per email
  - No OTP values logged or exposed in error messages

- [x] **Session Management**
  - JWT tokens with 7-day expiration
  - HTTP-only cookies (not accessible via JavaScript)
  - Secure flag enabled in production (HTTPS only)
  - SameSite=Strict for CSRF protection
  - Token signature verification on every request
  - Session expiration warnings (1 hour before expiry)

- [x] **Route Protection**
  - Middleware protects all `/dashboard/*` routes
  - Automatic redirect to login on missing/expired/invalid tokens
  - User email extracted from JWT and added to request headers

### Data Security

- [x] **Input Validation**
  - Zod schema validation on all content updates
  - Email format validation
  - URL format validation
  - String length limits
  - Type checking for all fields

- [x] **File System Security**
  - Content files stored outside public directory
  - Atomic file writes (write to temp, then rename)
  - Automatic backup before every update
  - Restore from backup on failure
  - UTF-8 encoding enforcement

- [x] **Sensitive Data Protection**
  - Environment variables for all secrets
  - No secrets in logs or error responses
  - Automatic redaction of sensitive patterns (tokens, passwords, OTPs)
  - JWT secret minimum 32 characters
  - Secure cookie flags (HttpOnly, Secure, SameSite)

### API Security

- [x] **Error Handling**
  - Generic error messages for authentication failures
  - No revelation of whether email is authorized
  - No internal paths or stack traces exposed
  - Structured error logging server-side only
  - Appropriate HTTP status codes (400, 401, 500)

- [x] **Rate Limiting**
  - OTP requests: 3 per hour per email
  - 429 status code with Retry-After header

### GitHub Integration

- [x] **Token Security**
  - Personal access token with minimal permissions (repo scope only)
  - Token stored in environment variable
  - Never exposed in logs or responses
  - Repository access verification on startup
  - Error messages don't reveal token or repo details

## 🔒 Required Environment Variables

### Critical Security Variables

```env
# Admin email - only this email can access the CMS
ADMIN_EMAIL=admin@example.com

# JWT secret - MUST be at least 32 characters
# Generate with: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Gmail SMTP - use app password, NOT regular password
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password

# GitHub token - repo scope only
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
GITHUB_REPO=username/repository
GITHUB_BRANCH=main

# Node environment
NODE_ENV=production
```

## 🛡️ Security Best Practices

### Environment Configuration

- [ ] **Never commit `.env` files** to version control
- [ ] **Use different secrets** for development and production
- [ ] **Rotate secrets periodically** (every 90 days recommended)
- [ ] **Use platform-specific secret management** (Vercel Environment Variables, AWS Secrets Manager, etc.)
- [ ] **Validate all environment variables** on application startup
- [ ] **Use strong, randomly generated secrets** (minimum 32 characters for JWT_SECRET)

### JWT Secret Generation

```bash
# Generate a secure JWT secret
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Gmail App Password Setup

1. Enable 2-Step Verification on your Google Account
2. Go to: [Google Account](https://myaccount.google.com/) → Security → 2-Step Verification
3. Scroll to "App passwords" and click
4. Select "Mail" and generate password
5. Copy the 16-character password (no spaces)
6. Use this in `GMAIL_APP_PASSWORD`, NOT your regular Gmail password

### GitHub Token Setup

1. Go to: [GitHub Settings](https://github.com/settings/tokens) → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select **only** the `repo` scope (full control of private repositories)
4. Set expiration (90 days recommended)
5. Copy token immediately (you won't see it again)
6. Store in `GITHUB_TOKEN` environment variable

### Cookie Security

The session cookie is configured with:
- `httpOnly: true` - Not accessible via JavaScript (XSS protection)
- `secure: true` - Only sent over HTTPS in production
- `sameSite: 'strict'` - CSRF protection
- `maxAge: 7 days` - Automatic expiration

### Rate Limiting

Current implementation:
- **OTP requests**: 3 per hour per email address
- **Future enhancement**: API rate limiting (100 requests per minute per IP)

### Content Validation

All content updates are validated against Zod schemas:
- Type checking
- Required field validation
- Format validation (emails, URLs)
- Length constraints
- Custom validation rules

### Error Logging

Structured logging with:
- Timestamp
- Context (endpoint, operation)
- Error message and stack trace
- Additional metadata (sanitized)
- **No sensitive data** (tokens, OTPs, passwords)

## 🚨 Security Incident Response

### If JWT Secret is Compromised

1. Generate a new JWT secret immediately
2. Update environment variable in production
3. Restart application
4. All existing sessions will be invalidated
5. Users must log in again

### If GitHub Token is Compromised

1. Revoke the compromised token on GitHub
2. Generate a new token with minimal permissions
3. Update environment variable in production
4. Restart application
5. Review recent commits for unauthorized changes

### If Gmail Credentials are Compromised

1. Revoke the app password on Google Account
2. Generate a new app password
3. Update environment variable in production
4. Restart application
5. Review recent email activity

### If Admin Email is Compromised

1. Change the admin email in environment variables
2. Update `ADMIN_EMAIL` in production
3. Restart application
4. Old email will no longer have access
5. Review recent content changes

## 🔍 Security Monitoring

### What to Monitor

- [ ] Failed login attempts (check logs for repeated failures)
- [ ] Rate limit violations (429 responses)
- [ ] Validation errors (potential injection attempts)
- [ ] GitHub sync failures (potential token issues)
- [ ] Unusual content changes (check GitHub commit history)
- [ ] Session expiration patterns (potential token theft)

### Log Analysis

Check logs for:
```
[Auth Event] - Authentication attempts
[Error] - Error occurrences
[Session Manager] - Token verification failures
[GitHub Sync] - Sync failures
```

## 📋 Pre-Deployment Checklist

Before deploying to production:

- [ ] All environment variables configured
- [ ] JWT_SECRET is at least 32 characters
- [ ] Gmail app password (not regular password) is used
- [ ] GitHub token has minimal permissions (repo scope only)
- [ ] NODE_ENV set to "production"
- [ ] HTTPS enabled (Secure cookie flag)
- [ ] Content.json file exists and is valid
- [ ] Environment validation passes
- [ ] All tests pass
- [ ] No secrets in code or logs
- [ ] .env file not committed to repository
- [ ] Platform-specific secrets configured (Vercel, etc.)

## 🔐 Additional Security Recommendations

### Network Security

- [ ] Use HTTPS in production (required for secure cookies)
- [ ] Configure CORS if needed
- [ ] Use a CDN with DDoS protection
- [ ] Enable firewall rules on hosting platform

### Application Security

- [ ] Keep dependencies updated (run `npm audit` regularly)
- [ ] Use Dependabot or similar for automated updates
- [ ] Review security advisories for dependencies
- [ ] Implement Content Security Policy (CSP) headers
- [ ] Add security headers (X-Frame-Options, X-Content-Type-Options)

### Backup & Recovery

- [ ] Regular backups of content.json
- [ ] GitHub serves as version control backup
- [ ] Test restore procedures
- [ ] Document recovery steps

### Access Control

- [ ] Limit admin access to trusted individuals
- [ ] Use strong, unique passwords for all accounts
- [ ] Enable 2FA on GitHub account
- [ ] Enable 2FA on Gmail account
- [ ] Review access logs periodically

## 📞 Reporting Security Issues

If you discover a security vulnerability:

1. **Do NOT** open a public issue
2. Email security concerns to the repository owner
3. Include detailed description and reproduction steps
4. Allow time for fix before public disclosure

## 🔄 Security Update Schedule

- **Environment variables**: Review every 90 days
- **Dependencies**: Update monthly
- **Security patches**: Apply immediately
- **JWT secret rotation**: Every 90 days (recommended)
- **GitHub token rotation**: Every 90 days (recommended)

---

**Last Updated**: 2024
**Security Version**: 1.0
