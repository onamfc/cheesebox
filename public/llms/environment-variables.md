# Environment Variables

Complete reference for configuring Cheesebox.

## Required Variables

### Database
```bash
# PostgreSQL connection string
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

### Authentication
```bash
# NextAuth.js secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-secret-here"

# Application URL
NEXTAUTH_URL="http://localhost:3000"  # Development
NEXTAUTH_URL="https://cheesebox.yourdomain.com"  # Production
```

### Encryption
```bash
# AES-256 encryption key (generate with: openssl rand -hex 32)
ENCRYPTION_KEY="64-character-hex-string"
```

### Email
```bash
# Resend API key
RESEND_API_KEY="re_xxxxxxxxxxxxx"

# From email address
FROM_EMAIL="noreply@yourdomain.com"
```

## Optional Variables

### OAuth
```bash
# Google OAuth (optional)
GOOGLE_CLIENT_ID="xxxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxx"
```

### Rate Limiting
```bash
# Upstash Redis (optional - required for rate limiting)
UPSTASH_REDIS_REST_URL="https://xxxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="xxxxx"
```

### Frontend
```bash
# Public app URL for emails and sharing
NEXT_PUBLIC_APP_URL="https://cheesebox.yourdomain.com"
```

## Local Development

Create `.env.local`:

```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/cheesebox"

# Auth
NEXTAUTH_SECRET="development-secret-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Encryption
ENCRYPTION_KEY="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"

# Email (use Resend test mode)
RESEND_API_KEY="re_xxxxx"
FROM_EMAIL="onboarding@resend.dev"

# Public URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Production

Never commit `.env` files. Use platform environment variables.

### Vercel
1. Project Settings > Environment Variables
2. Add each variable
3. Select environments (Production, Preview, Development)

### Docker
```dockerfile
ENV DATABASE_URL=postgresql://...
ENV NEXTAUTH_SECRET=...
```

Or use `.env` file with docker-compose:
```yaml
env_file:
  - .env.production
```

## Generating Secrets

```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# ENCRYPTION_KEY (must be 64 hex characters)
openssl rand -hex 32

# CSRF tokens
openssl rand -hex 32
```

## Validation

Check all required variables are set:

```typescript
const required = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'ENCRYPTION_KEY',
  'RESEND_API_KEY',
  'FROM_EMAIL'
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}
```

## Security

- Never commit `.env` files to version control
- Add `.env*` to `.gitignore`
- Use different secrets for each environment
- Rotate secrets regularly
- Use platform secret management for production
