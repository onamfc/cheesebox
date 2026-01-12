# Architecture Overview

Cheesebox is built on a modern, serverless architecture that prioritizes security, scalability, and user data ownership.

## Core Principles

1. **Data Ownership**: Videos stored in user's AWS account, never on Cheesebox servers
2. **Zero Trust**: Credentials encrypted at rest, never transmitted to backend
3. **Serverless First**: Minimal infrastructure costs, automatic scaling
4. **Security by Design**: 70+ automated security tests, CSRF protection, rate limiting

## System Architecture

```
┌─────────────────┐
│   User Browser  │
│  (Next.js SPA)  │
└────────┬────────┘
         │
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌──────────────────┐
│  Vercel Edge    │  │   User's AWS     │
│   Functions     │  │    Account       │
│                 │  │                  │
│ • API Routes    │  │ • S3 Buckets     │
│ • Auth          │  │ • MediaConvert   │
│ • Encryption    │  │ • CloudFront     │
└────────┬────────┘  └──────────────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │
│   (Vercel)      │
│                 │
│ • User Data     │
│ • Permissions   │
│ • Metadata      │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  Upstash Redis  │
│                 │
│ • Rate Limits   │
│ • CSRF Tokens   │
└─────────────────┘
```

## Technology Stack

### Frontend
- **Next.js 14**: App Router, React Server Components, Server Actions
- **TypeScript**: Type safety across the entire application
- **Tailwind CSS**: Utility-first styling with theme system
- **React Context**: Global state management (auth, theme)

### Backend
- **Next.js API Routes**: Serverless edge functions on Vercel
- **NextAuth.js**: Authentication with credentials and Google OAuth
- **Prisma ORM**: Type-safe database access
- **PostgreSQL**: Relational database for metadata and permissions

### AWS Services
- **S3**: Object storage for source and transcoded videos
- **MediaConvert**: HLS transcoding with adaptive bitrate
- **CloudFormation**: Infrastructure as Code deployment
- **IAM**: Granular permission control

### Infrastructure
- **Vercel**: Hosting, edge functions, and PostgreSQL
- **Upstash Redis**: Serverless Redis for rate limiting
- **Resend**: Transactional email delivery

## Data Flow

### Video Upload Flow

```
1. User selects video file
   ↓
2. Browser encrypts AWS credentials (AES-256-GCM)
   ↓
3. POST /api/videos/init
   - Creates database record
   - Generates unique video ID
   - Returns presigned S3 upload URL
   ↓
4. Browser uploads directly to S3
   - Uses presigned URL
   - Never touches Cheesebox servers
   ↓
5. POST /api/videos/transcode
   - Triggers MediaConvert job
   - Creates HLS manifest and segments
   ↓
6. MediaConvert processes
   - Generates m3u8 playlist
   - Creates TS video segments
   - Writes to output bucket
   ↓
7. Video status updated to COMPLETED
```

### Video Playback Flow

```
1. User clicks video to watch
   ↓
2. Check permissions in database
   - Owner: Always allowed
   - Shared: Verify email in permissions
   - Public: Allow all authenticated users
   ↓
3. POST /api/videos/[id]/play
   - Generates presigned URLs for HLS files
   - URLs valid for 3 hours
   - Returns manifest URL
   ↓
4. Browser loads HLS player
   - Fetches m3u8 manifest via presigned URL
   - Fetches TS segments via presigned URLs
   - Plays video with adaptive bitrate
   ↓
5. URLs expire after 3 hours
   - Must request new URLs to continue
```

### Sharing Flow

```
1. Owner clicks "Share" on video
   ↓
2. POST /api/videos/[id]/share
   - Validates owner permission
   - Creates VideoShare records
   - Triggers email notifications
   ↓
3. Resend sends emails
   - Custom template with video details
   - Link to video page
   ↓
4. Recipient clicks link
   - Redirects to sign-in if not authenticated
   - After auth, checks permissions
   - Allows playback if permitted
```

## Security Architecture

### Encryption Layers

1. **Credentials at Rest**
   - AES-256-GCM encryption
   - Unique encryption key per environment
   - Keys stored in environment variables (never committed)

2. **HTTPS Everywhere**
   - All communication over TLS 1.3
   - Strict Transport Security headers
   - Secure cookie flags

3. **Presigned URLs**
   - Time-limited access (3 hours)
   - No permanent public links
   - AWS signature verification

### Authentication & Authorization

```
┌──────────────────────────────────────────┐
│         Authentication Layer             │
│                                          │
│  NextAuth.js                             │
│  ├─ Credentials (email/password)         │
│  ├─ Google OAuth 2.0                     │
│  └─ JWT tokens (httpOnly cookies)        │
└──────────────────┬───────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│         Authorization Layer              │
│                                          │
│  Permission Checks                       │
│  ├─ Video ownership (userId)             │
│  ├─ Share permissions (VideoShare)       │
│  ├─ Team membership (TeamMember)         │
│  └─ Public visibility flag               │
└──────────────────────────────────────────┘
```

### Rate Limiting

Implemented using Upstash Redis with token bucket algorithm:

- **Login attempts**: 5 per hour per IP
- **Registration**: 3 per hour per IP
- **Video uploads**: 20 per hour per user
- **API requests**: 100 per minute per user

## Database Schema

### Core Models

**User**
- Stores authentication data
- Links to owned videos and team memberships
- Provider field for OAuth identification

**Video**
- Metadata (title, description, status)
- AWS location (bucket, keys)
- Ownership and visibility
- Transcoding status

**VideoShare**
- Email-based permissions
- One record per shared email
- Links video to recipient email

**Team**
- Shared AWS credentials (encrypted)
- Team name and owner
- Member management

**ShareGroup**
- Reusable email lists
- One-click batch sharing
- Owner-specific

See [Database Schema](/llms/database-schema.md) for complete Prisma schema.

## Scalability Considerations

### Horizontal Scaling
- Serverless functions auto-scale with traffic
- Edge deployment for low latency worldwide
- CDN caching for static assets

### Database Optimization
- Indexed foreign keys for fast joins
- Composite indexes for common queries
- Connection pooling via Prisma

### AWS Cost Optimization
- MediaConvert only charges per minute transcoded
- S3 lifecycle policies for old videos (user-configured)
- CloudFront optional for reduced data transfer costs

## Monitoring & Observability

### Logging
- Vercel function logs for API requests
- Error tracking with stack traces
- Audit trail for security events

### Metrics
- Video upload success rate
- Transcoding completion time
- API response times
- Rate limit hits

## Mobile Architecture

See [Mobile App](/llms/mobile-app.md) for React Native implementation details.

## Deployment Architecture

See [Deployment Guide](/llms/deployment.md) for production configuration.
