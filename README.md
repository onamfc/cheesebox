# Cheesebox - Secure Video Sharing Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![Security](https://img.shields.io/badge/Security-Hardened-green.svg)](SECURITY_FIXES.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

A secure, business-focused video sharing platform built with Next.js, AWS S3, and HLS streaming. Share sensitive videos with specific users via email-based permissions, with automatic HLS transcoding and pre-signed URL protection.

> **🔒 Security First**: Version 1.6.0 includes comprehensive security hardening with CSRF protection, rate limiting, path traversal prevention, and 70+ automated security tests.

## Features

### Core Features
- **Secure Authentication**: JWT-based authentication with NextAuth.js and hardened security
- **User-Owned Storage**: Each user brings their own AWS S3 bucket (credentials encrypted at rest)
- **HLS Video Streaming**: Automatic transcoding to HLS format using AWS MediaConvert
- **Email-Based Sharing**: Share videos with specific users (Google Docs-style permissions)
- **Pre-Signed URLs**: Short-lived, secure video URLs that expire after 3 hours
- **Email Notifications**: Bring your own email provider (Resend, AWS SES, or SMTP)
- **Dashboard**: Clean UI with "My Videos" and "Shared with Me" sections
- **TypeScript**: Fully typed for better development experience

### Security Features
- **CSRF Protection**: Automatic protection against Cross-Site Request Forgery attacks
- **Path Traversal Prevention**: Comprehensive validation blocking directory traversal attempts
- **Rate Limiting**: Brute force protection on authentication endpoints (5 attempts / 15 min)
- **No Credential Exposure**: AWS and email credentials never returned in API responses
- **User Enumeration Prevention**: Generic error messages prevent account discovery
- **Edge Runtime Compatible**: Web Crypto API implementation for Next.js Edge
- **70+ Security Tests**: Comprehensive test coverage preventing regressions

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes with Edge Runtime support
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT
- **Security**: CSRF protection, rate limiting (Upstash Redis), path validation
- **Video Storage**: AWS S3 (user-provided)
- **Video Transcoding**: AWS MediaConvert (HLS)
- **Email**: User-configured (Resend, AWS SES, or SMTP)
- **Testing**: Jest with 70+ security tests
- **Hosting**: Vercel (app) + Railway (database)

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Railway recommended)
- AWS Account with:
  - S3 bucket
  - IAM credentials with specific permissions (see below)
- Email provider account (Resend, AWS SES, or SMTP - configured in Settings)

## AWS Setup Guide

Each user needs their own AWS account with:

1. An S3 bucket for video storage
2. IAM user credentials with permissions
3. A MediaConvert IAM role for video transcoding

### 🚀 Quick Setup (Recommended)

**One-Click CloudFormation Template** - Automatically creates all AWS resources in ~2 minutes:

1. **After deploying** your app, visit `/help/aws-setup` in your browser
2. Click the **"Launch Stack in AWS"** button
3. Enter a unique bucket name (e.g., `my-cheesebox-videos-123`)
4. Check the IAM acknowledgment box
5. Click **"Create Stack"** and wait ~2 minutes
6. Copy all 5 credentials from the **Outputs** tab
7. Paste them into your **Settings** page

**What gets created automatically:**
- ✅ S3 bucket (with CORS configured)
- ✅ IAM user with proper permissions
- ✅ Access keys
- ✅ MediaConvert role

**Benefits:**
- ⚡ 90% faster than manual setup
- ✅ Zero configuration errors
- 🔒 Security best practices built-in

**Template Location:** `/public/cloudformation/private-video-setup.yaml`

**Note:** The CloudFormation template is hosted on GitHub. After pushing your code, the launch button will work automatically.

---

### 📖 Manual Setup (Alternative)

If you prefer to configure AWS manually or want to learn how each component works, follow these detailed steps:

#### Step 1: Create an S3 Bucket

1. Go to **AWS Console** → **S3**
2. Click **"Create bucket"**
3. **Bucket name**: Choose a unique name (e.g., `my-cheesebox-videos`)
4. **Region**: Choose your preferred region (e.g., `us-east-1`)
5. **Block Public Access**: Keep all boxes CHECKED (videos should be private)
6. Click **"Create bucket"**
7. **Save the bucket name** - you'll need this later

#### Configure CORS for Video Streaming

After creating the bucket, you need to configure CORS to allow your browser to stream videos:

1. Click on your newly created bucket
2. Go to the **"Permissions"** tab
3. Scroll down to **"Cross-origin resource sharing (CORS)"**
4. Click **"Edit"**
5. Paste this JSON configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://your-production-domain.com"
    ],
    "ExposeHeaders": ["Content-Length", "Content-Range", "ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

6. **Important**: Replace `https://your-production-domain.com` with your actual production URL when you deploy
7. Click **"Save changes"**

### Step 2: Create an IAM User with Permissions

1. Go to **AWS Console** → **IAM** → **Users**
2. Click **"Create user"**
3. **User name**: e.g., `cheesebox-user`
4. Click **"Next"**
5. Select **"Attach policies directly"**
6. Click **"Create policy"** (opens in new tab)
7. Click the **JSON** tab
8. Paste this policy (replace `YOUR-BUCKET-NAME` with your bucket):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR-BUCKET-NAME",
        "arn:aws:s3:::YOUR-BUCKET-NAME/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "mediaconvert:CreateJob",
        "mediaconvert:GetJob",
        "mediaconvert:DescribeEndpoints"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": "iam:PassRole",
      "Resource": "arn:aws:iam::YOUR-ACCOUNT-ID:role/MediaConvertRole",
      "Condition": {
        "StringEquals": {
          "iam:PassedToService": "mediaconvert.amazonaws.com"
        }
      }
    }
  ]
}
```

**Note**: Replace `YOUR-ACCOUNT-ID` with your AWS account ID (the 12-digit number, e.g., `123456789012`). You can find this in the top-right of the AWS Console.

9. Click **"Next"**
10. **Policy name**: `CheeseboxUserPolicy`
11. Click **"Create policy"**
12. **Go back to the user creation tab**, refresh the policies list
13. Search for `CheeseboxUserPolicy` and check the box
14. Click **"Next"** → **"Create user"**
15. Click on your newly created user
16. Go to **"Security credentials"** tab
17. Scroll to **"Access keys"** → Click **"Create access key"**
18. Select **"Other"** → Click **"Next"**
19. Click **"Create access key"**
20. **IMPORTANT**: Copy and save:
    - **Access key ID** (looks like: `AKIAIOSFODNN7EXAMPLE`)
    - **Secret access key** (looks like: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`)
    - You won't be able to see the secret key again!

### Step 3: Create MediaConvert IAM Role

This role allows MediaConvert to access your S3 bucket for transcoding.

1. Go to **AWS Console** → **IAM** → **Roles**
2. Click **"Create role"**
3. **Trusted entity type**: Select **"AWS service"**
4. **Use case**: Scroll down and select **"MediaConvert"** from the dropdown
5. Click **"Next"**
6. Click **"Next"** (skip permissions for now - we'll add them in a moment)
7. **Role name**: `MediaConvertRole`
8. Click **"Create role"**
9. **Click on the role you just created**
10. Go to the **"Permissions"** tab
11. Click **"Add permissions"** → **"Create inline policy"**
12. Click the **"JSON"** tab
13. Paste this JSON (replace `YOUR-BUCKET-NAME` with your actual bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::YOUR-BUCKET-NAME",
        "arn:aws:s3:::YOUR-BUCKET-NAME/*"
      ]
    }
  ]
}
```

14. Click **"Next"**
15. **Policy name**: `S3BucketAccess`
16. Click **"Create policy"**
17. **Go back to the role summary page**
18. **COPY THE ROLE ARN** from the top of the page
    - It looks like: `arn:aws:iam::123456789012:role/MediaConvertRole`
    - **IMPORTANT**: Make sure it says `role/` not `policy/`
    - This is what you'll paste in the app settings!

### Summary - What You Need

You should now have:

- ✅ S3 bucket name (e.g., `my-cheesebox-videos`)
- ✅ IAM Access Key ID (e.g., `AKIAIOSFODNN7EXAMPLE`)
- ✅ IAM Secret Access Key (e.g., `wJalrXUtnFEMI/K7MDENG...`)
- ✅ AWS Region (e.g., `us-east-1`)
- ✅ MediaConvert Role ARN (e.g., `arn:aws:iam::123456789012:role/MediaConvertRole`)

Keep these handy - you'll enter them in the app's Settings page!

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/onamfc/cheesebox.git
cd cheesebox
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and configure the following:

#### Database

- Create a PostgreSQL database on Railway or locally
- Copy the connection string to `DATABASE_URL`

#### Authentication & Security

Generate required secrets:

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate JWT_SECRET (REQUIRED - app will fail without this)
openssl rand -base64 64

# Generate CSRF_SECRET (for CSRF protection)
openssl rand -base64 32

# Generate ENCRYPTION_KEY (for AWS credentials)
openssl rand -hex 32
```

**Important**: The application will not start without `JWT_SECRET` configured. This prevents authentication bypass vulnerabilities.

#### Rate Limiting (Optional but Strongly Recommended)

⚠️ **Without Upstash**: Rate limiting is **disabled**. Your app will be vulnerable to brute force attacks.

✅ **With Upstash**: Full protection against brute force, credential stuffing, and abuse.

Configure Upstash Redis for distributed rate limiting:

```bash
# Get FREE tier at https://console.upstash.com/
# Free tier: 10,000 requests/day - sufficient for most apps
UPSTASH_REDIS_REST_URL="your-url"
UPSTASH_REDIS_REST_TOKEN="your-token"
```

**What you get with Upstash:**
- ✅ Login: 5 attempts per 15 minutes per email
- ✅ Registration: 3 attempts per hour per IP address
- ✅ Protection against brute force attacks
- ✅ Distributed rate limiting across all instances

**Without Upstash:**
- ⚠️ No rate limiting at all
- ⚠️ Unlimited login/registration attempts
- ⚠️ Vulnerable to credential stuffing and brute force
- ⚠️ Warning logged in production mode

**Cost**: FREE for typical usage (10k requests/day), ~$0.20 per 100k beyond that.

#### Email Configuration

Cheesebox supports multiple email providers. Configure your preferred provider in **Settings** after deployment.

**Supported Providers:**
- **Resend** - Simple API (recommended for getting started)
- **AWS SES** - Low cost, high volume
- **SMTP** - Universal (Gmail, Outlook, custom servers)

**Setup:**
1. Deploy the application
2. Log in and go to **Settings**
3. Scroll to **Email Settings**
4. Choose your provider and enter credentials
5. Click **Send Test Email** to verify

For detailed setup instructions for each provider, see:
**[Email Provider Setup Guide](docs/EMAIL_SETUP.md)**

> **Note**: For local development, you can use Gmail SMTP or Resend's free tier. Email credentials are encrypted before being stored in the database.

### 4. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations (creates tables)
npx prisma migrate dev --name init
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### First-Time Setup

1. **Create an account**: Navigate to `/auth/signup` and create your account
2. **Configure AWS credentials**:
   - Go to **Settings**
   - Enter all the information you gathered from AWS Setup:
     - **AWS Access Key ID**
     - **AWS Secret Access Key**
     - **S3 Bucket Name**
     - **AWS Region**
     - **MediaConvert IAM Role ARN** (the `arn:aws:iam::...` you copied)
   - Click **"Save Credentials"**
   - Your credentials are encrypted before being stored
3. **Upload a video**:
   - Return to the Dashboard
   - Click "Upload Video"
   - Select a video file and add a title
   - The video will be uploaded to your S3 bucket and automatically transcoded to HLS
   - Transcoding takes a few minutes depending on video size

### Sharing Videos

1. Click "Share" on any of your videos
2. Enter the recipient's email address
3. They'll receive an email notification
4. The recipient can log in and view the video in "Shared with Me"

### Watching Videos

- Click "Watch" on any completed video
- A pre-signed URL is generated on-demand
- URLs expire after 3 hours for security
- If expired, clicking "Watch" again generates a new URL

## Deployment

### Deploy to Vercel

1. **Database Setup**:
   - Create a PostgreSQL database on [Railway](https://railway.app)
   - Copy the connection string

2. **Deploy to Vercel**:

   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   vercel
   ```

3. **Configure Environment Variables**:
   - Go to your Vercel project settings
   - Add all environment variables from `.env`
   - Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your production URL

4. **Run Database Migrations**:
   ```bash
   # Set DATABASE_URL to your Railway connection string
   npx prisma migrate deploy
   ```

## Security Features

### Authentication & Authorization
- **Strong JWT Secrets**: Application fails fast if JWT_SECRET not configured (prevents authentication bypass)
- **Secure Password Hashing**: bcrypt with salt rounds of 12
- **Session Security**: NextAuth.js with httpOnly cookies
- **Team & Group Access Control**: Complete authorization checks for video access
- **User Enumeration Prevention**: Generic error messages prevent account discovery

### Attack Prevention
- **CSRF Protection**: Double-submit cookie pattern with Edge Runtime compatibility
  - Automatic protection for all API routes
  - Timing-safe token comparison
  - Client utilities for easy integration
  - See [CSRF Protection Guide](docs/CSRF_PROTECTION.md)
- **Path Traversal Prevention**: Comprehensive validation blocking `..`, null bytes, absolute paths
- **Rate Limiting**: Progressive delays on failed authentication attempts
  - Login: 5 attempts per 15 minutes
  - Registration: 3 attempts per hour
  - Graceful degradation when Redis not configured
- **XSS Protection**: Content Security Policy headers and sanitized inputs

### Data Protection
- **Encrypted AWS Credentials**: AES-256-GCM encryption at rest
- **No Credential Exposure**: Masked values in API responses (e.g., `***ABCD`)
- **Pre-Signed URLs**: Videos only accessible via short-lived URLs (3 hours)
- **Email-Based Permissions**: Only authorized users can view shared videos
- **Secure Cookies**: httpOnly, Secure, SameSite attributes

### Security Testing
- **70+ Automated Security Tests**: Comprehensive test coverage
  - JWT secret validation tests
  - Path traversal prevention tests
  - Credential exposure tests
  - Rate limiting tests
  - Authentication tests
  - CSRF protection tests
- **Continuous Verification**: Tests run on every commit

For detailed security information, see:
- **[CSRF Protection Guide](docs/CSRF_PROTECTION.md)** - Implementation details
- **[Security Policy](SECURITY.md)** - Best practices and reporting
## Architecture

### Data Flow

1. **Video Upload**:
   - User uploads video → Next.js API → S3 (original)
   - MediaConvert job created → Transcodes to HLS
   - HLS files saved to S3 → Database updated with manifest path

2. **Video Playback**:
   - User clicks "Watch" → API checks permissions
   - If authorized → Generate pre-signed URL for HLS manifest
   - HLS.js player streams video from S3

3. **Video Sharing**:
   - Owner shares video → Database record created
   - Email sent to recipient → Recipient logs in
   - Video appears in "Shared with Me"

### Database Schema

- **users**: User accounts (email, password hash)
- **aws_credentials**: Encrypted AWS credentials per user
- **videos**: Video metadata (title, transcoding status, S3 keys)
- **video_shares**: Sharing permissions (video ID + email)

## Documentation

### User Guides
- **[Troubleshooting Guide](TROUBLESHOOTING.md)** - Common issues and solutions
- **[Email Provider Setup](docs/EMAIL_SETUP.md)** - Configure Resend, AWS SES, or SMTP
- **[Deployment Guide](.internal/DEPLOYMENT.md)** - How to deploy to production

### Security Documentation
- **[CSRF Protection Guide](docs/CSRF_PROTECTION.md)** - Implementation and usage
- **[CSRF Testing Guide](TESTING_CSRF.md)** - Automated and manual testing
- **[Security Policy](SECURITY.md)** - Best practices and vulnerability reporting

### Developer Resources
- **[Contributing Guidelines](CONTRIBUTING.md)** - How to contribute
- **[Code of Conduct](CODE_OF_CONDUCT.md)** - Community guidelines
- **[Changelog](CHANGELOG.md)** - Version history and updates
- **[Security Test README](src/__tests__/security/README.md)** - Running security tests

## Quick Troubleshooting

Having issues? Check these first:

### Common Issues
- **400 Error on Upload**: Check browser console and server logs for details
  - Verify file type (MP4, MOV, AVI, WebM, MKV)
  - Check file size (max 5GB)
  - Ensure title is entered
- **Transcoding Fails**: Verify AWS MediaConvert role is configured
- **CORS Errors**: Configure S3 bucket CORS (see README AWS Setup)
- **403 Forbidden**: Update to latest code (uses streaming proxy)

### Security-Related Issues
- **CSRF token validation failed**: Refresh the page to get a new token
  - See [CSRF Troubleshooting](docs/CSRF_PROTECTION.md#error-handling)
- **Too many login attempts**: Wait 15 minutes or check rate limit configuration
- **App won't start**: Verify `JWT_SECRET` is set in `.env`
  - Generate with: `openssl rand -base64 64`

### Testing
```bash
# Run all security tests
npm run test:security

# Test CSRF protection
bash test-csrf.sh

# Run security checks (tests + type check)
npm run security-check
```

For detailed solutions, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## Roadmap

We're actively working on improving Cheesebox. Here are some features we'd love to add:

### Features
- [ ] Video upload progress indicator
- [ ] Video thumbnails and previews
- [ ] Batch video operations
- [ ] Search and filtering
- [ ] Video analytics (view counts, watch time)
- [ ] Mobile app (React Native)
- [ ] Dark mode
- [ ] Internationalization (i18n)
- [ ] Video comments and annotations
- [ ] Webhook support for MediaConvert completion
- [ ] Admin dashboard

See something you'd like to work on? Check out our [Contributing Guide](CONTRIBUTING.md)!

## Contributing

We welcome contributions from the community! Here's how you can help:

1. **Report bugs**: Open an issue with detailed information
2. **Suggest features**: Share your ideas in the discussions
3. **Submit PRs**: Fix bugs or add features (see [CONTRIBUTING.md](CONTRIBUTING.md))
4. **Improve docs**: Help make the documentation better
5. **Share**: Star the repo and share with others

Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a PR.

## Security

Security is a top priority for Cheesebox. **Version 1.6.0** includes comprehensive security hardening:

### Security Status: Production Ready

- ✅ **8 out of 8** high-priority vulnerabilities fixed
- ✅ **70 automated security tests** passing
- ✅ **Complete CSRF protection** with Edge Runtime support
- ✅ **Path traversal prevention** blocking all attack vectors
- ✅ **Rate limiting** protecting authentication endpoints
- ✅ **No credential exposure** in API responses
- ✅ **User enumeration** prevention

### Resources
- **[Security Policy](SECURITY.md)** - Vulnerability reporting and best practices
- **[CSRF Protection Guide](docs/CSRF_PROTECTION.md)** - Implementation details
### Reporting Security Issues

Found a security vulnerability? Please see our [Security Policy](SECURITY.md) for responsible disclosure guidelines.

## Support

- **Documentation**: Check the README and [SECURITY.md](SECURITY.md)
- **Issues**: Open a [GitHub issue](https://github.com/onamfc/cheesebox/issues)
- **Discussions**: Join [GitHub discussions](https://github.com/onamfc/cheesebox/discussions)
- **Bugs**: Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md)
- **Features**: Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md)

## License

MIT License - see [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Cheesebox Contributors

## Acknowledgments

Built with:

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [AWS SDK](https://aws.amazon.com/sdk-for-javascript/) - Cloud services
- [HLS.js](https://github.com/video-dev/hls.js/) - Video streaming
- [Tailwind CSS](https://tailwindcss.com/) - Styling

Special thanks to all contributors who help make this project better!

---

**⭐ If you find this project useful, please consider giving it a star!**
