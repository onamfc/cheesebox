# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
## [1.7.1] - 2026-01-11
### Added
- add llms.txt for ai index
- add GitHub button to header
- add favicon
- update footer and add the necessary pages
### Fixed
- update input color for input fields on the homepage

## [1.7.0] - 2026-01-11
- add homepage
- add google sso
- add interchangeable themes

## [1.6.3] - 2026-01-09
### Fixed
- **CI Build**: Fixed GitHub Actions workflow missing required environment variables
  - Added `JWT_SECRET` to CI build environment
  - Added `CSRF_SECRET` to CI build environment
  - Added `LINKFORTY_BASE_URL` to CI build environment
  - Resolves "CRITICAL SECURITY ERROR: JWT_SECRET environment variable must be set" in CI
- **Comprehensive CSRF Protection**: Fixed missing CSRF tokens across all state-changing operations
  - **Video Operations**:
    - Video deletion in VideoList component (`src/components/VideoList.tsx`)
    - Video upload from webcam in VideoRecorder component (`src/components/VideoRecorder.tsx`)
    - Video visibility toggle in VisibilityToggle component (`src/components/VisibilityToggle.tsx`)
    - Video sharing (individual and group) in ShareVideoModal component (`src/components/ShareVideoModal.tsx`)
  - **Team Management** (`src/app/dashboard/teams/`):
    - Team creation (page.tsx)
    - Member invitation (line 97)
    - Member role updates (line 134)
    - Member removal (line 162)
    - Leave team (line 186)
    - Delete team (line 210)
  - **Group Management** (`src/app/dashboard/groups/`):
    - Group creation (page.tsx)
    - Add members to group ([id]/page.tsx line 86)
    - Remove member from group ([id]/page.tsx line 112)
    - Rename group ([id]/page.tsx line 137)
    - Delete group ([id]/page.tsx line 162)
  - **Settings** (`src/app/settings/SettingsContent.tsx`):
    - AWS credentials configuration (line 189)
    - Email credentials configuration (line 283)
    - Test email sending (line 232)
  - All components now import and use `fetchWithCsrf` from `@/lib/csrf-client`
  - Resolves all "CSRF token validation failed" errors throughout the application

## [1.6.2] - 2026-01-09
### Fixed
- **Video Upload CSRF Protection**: Fixed missing CSRF token in webcam video uploads
    - Added CSRF token to XMLHttpRequest headers in VideoRecorder component
    - Import `fetchCsrfToken` from `@/lib/csrf-client`
    - Fetch token before upload and include in `x-csrf-token` header
    - Resolves "CSRF token validation failed" error on video upload
    - Maintains progress tracking functionality while properly authenticating requests

## [1.6.1] - 2026-01-09
### Changed
- **BREAKING**: Migrated from `middleware.ts` to `proxy.ts` per Next.js 16 convention
  - Renamed file: `src/middleware.ts` → `src/proxy.ts`
  - Renamed export: `middleware()` → `proxy()`
  - Updated all documentation references
  - Eliminates deprecation warning in Next.js 16
- **CSRF Cookie Name**: Conditional cookie naming for development vs production
  - Production: `__Host-csrf-token` (requires HTTPS, most secure)
  - Development: `csrf-token` (works with HTTP localhost)
  - Ensures CSRF protection works in both environments

### Fixed
- **CSRF Edge Runtime Compatibility**: Converted to Web Crypto API
  - Replaced Node.js `crypto` module with Web Crypto API
  - `generateCsrfToken()`: Now uses `crypto.getRandomValues()`
  - `hashToken()`: Now uses `crypto.subtle.digest()` (async)
  - Made `validateCsrfToken()` async to support Web Crypto
  - Updated middleware and all callers to handle async validation
  - Fixes "edge runtime does not support Node.js 'crypto' module" error
  - Fully compatible with Next.js Edge Runtime

### Documentation
- **README.md**: Comprehensive security documentation update
  - Updated Next.js badge from 14 to 16
  - Added "Security-Hardened" badge
  - Added prominent security notice for v1.6.0
  - Reorganized features into "Core" and "Security" sections
  - Expanded tech stack with security tools
  - Added comprehensive security section with subsections:
    - Authentication & Authorization
    - Attack Prevention
    - Data Protection
    - Security Testing (70+ tests)
  - Added security-related troubleshooting
  - Updated installation guide with all required secrets
  - Reorganized documentation links by category
  - Updated roadmap with completed security items
- **CSRF Documentation**: Updated all proxy/middleware references
  - Updated `docs/CSRF_PROTECTION.md`
  - Updated `TESTING_CSRF.md`
  - Updated `SECURITY_COMPLETE.md`
  - Updated test file `src/__tests__/security/csrf-protection.test.ts`

### Testing
- **CSRF Tests**: Updated to verify Web Crypto API usage
  - Changed test to check for `crypto.subtle.digest` instead of `createHash`
  - Updated test paths from `middleware.ts` to `proxy.ts`
  - All 70 security tests passing


## [1.6.0] - 2026-01-08
### Security
- **CRITICAL FIX**: Eliminated hardcoded JWT secret fallback values (CWE-798)
  - Application now fails fast if `JWT_SECRET` environment variable not set
  - Prevents complete authentication bypass vulnerability
  - Centralized JWT secret management in `src/lib/jwt.ts`
  - Added strong secret generation to `.env.example`
- **CRITICAL FIX**: Fixed incomplete access control on streaming token endpoint
  - Added team membership verification
  - Added group sharing verification
  - Ensures consistent authorization across all video access methods
- **HIGH FIX**: Eliminated path traversal vulnerability in streaming endpoints (CWE-22)
  - Created comprehensive path validation library (`src/lib/path-validation.ts`)
  - Blocks directory traversal attempts (`..`, null bytes, backslashes)
  - Validates file extensions (only `.m3u8` and `.ts` allowed)
  - Normalizes and bounds-checks all S3 key construction
  - Applied to both authenticated and public streaming endpoints
- **HIGH FIX**: Implemented rate limiting on authentication endpoints (CWE-307)
  - Login: 5 attempts per 15 minutes per email
  - Registration: 3 attempts per hour per IP address
  - Progressive exponential backoff delays (2^n seconds, max 60s)
  - Uses Upstash Redis for distributed rate limiting
  - Includes `Retry-After` headers on 429 responses
  - Graceful degradation when Redis not configured (with warnings)
  - Failed login tracking with automatic cleanup on success
- **HIGH FIX**: Eliminated AWS credentials exposure in API responses (CWE-200)
  - GET endpoint now returns configuration status instead of credentials
  - Shows last 4 characters of access key only (e.g., `***ABCD`)
  - Never includes `secretAccessKey` in any form
  - Prevents credential theft via XSS or session hijacking
- **MEDIUM FIX**: Prevented user enumeration via error messages
  - Registration endpoint uses generic "Unable to complete registration" message
  - Login endpoint uses consistent "Invalid email or password" message
  - Prevents attackers from discovering valid email addresses
- **HIGH FIX**: Implemented CSRF protection proxy (CWE-352)
  - Double Submit Cookie pattern with server-side validation
  - Protects all state-changing API requests (POST, PUT, PATCH, DELETE)
  - Automatic token generation and validation via Edge proxy
  - Web Crypto API for Edge Runtime compatibility
  - Timing-safe token comparison to prevent timing attacks
  - HttpOnly, Secure, SameSite cookies with __Host- prefix (production) or regular prefix (development)
  - Mobile JWT endpoints automatically exempted
  - Client-side utilities for easy integration (`fetchWithCsrf`, `getCsrfHeaders`)
  - Comprehensive documentation in `docs/CSRF_PROTECTION.md`

### Added
- **Security Testing Infrastructure**: Created comprehensive test suites to prevent regressions
  - `src/__tests__/security/jwt-secret.test.ts` - Verifies no hardcoded secrets (7 tests)
  - `src/__tests__/security/path-traversal.test.ts` - Validates path security (13 tests)
  - `src/__tests__/security/credential-exposure.test.ts` - Ensures no credential leaks (5 tests)
  - `src/__tests__/security/rate-limiting.test.ts` - Verifies brute force protection (8 tests)
  - `src/__tests__/security/authentication.test.ts` - Comprehensive auth security (10 tests)
  - 43+ total security tests covering critical vulnerabilities
  - Jest testing framework with TypeScript support
  - Security test documentation in `src/__tests__/security/README.md`
- **Security Documentation**: Comprehensive security fix documentation
  - `SECURITY_FIXES.md` - Detailed report of all vulnerabilities and fixes
  - Before/after code examples for each fix
  - Proof of concept examples for blocked attacks
  - Configuration and deployment checklists
  - Ongoing maintenance recommendations
- **Rate Limiting Library**: `src/lib/rate-limit.ts`
  - Multiple rate limiters for different use cases (login, register, upload, API, embed)
  - Helper functions for checking limits and tracking failures
  - Progressive delay calculation
  - Client IP extraction utility
- **Path Validation Library**: `src/lib/path-validation.ts`
  - Comprehensive path segment validation
  - S3 key bounds checking
  - File extension whitelisting
  - Character set validation
- **CSRF Protection System**: Complete CSRF protection implementation
  - `src/proxy.ts` - Edge proxy for automatic CSRF validation
  - `src/lib/csrf.ts` - Server-side CSRF token generation and validation
  - `src/lib/csrf-client.ts` - Client-side utilities (`fetchWithCsrf`, `getCsrfHeaders`)
  - `src/app/api/csrf-token/route.ts` - Token endpoint for client requests
  - `docs/CSRF_PROTECTION.md` - Complete usage guide and migration instructions
  - `src/__tests__/security/csrf-protection.test.ts` - 20+ security tests

### Changed
- Updated `src/app/api/auth/mobile/login/route.ts` with rate limiting and progressive delays
- Updated `src/app/api/auth/register/route.ts` with rate limiting and generic error messages
- Updated `src/app/api/videos/[id]/stream/[...path]/route.ts` with path validation
- Updated `src/app/api/embed/[videoId]/stream/[...path]/route.ts` with path validation
- Updated `src/app/api/videos/[id]/streaming-token/route.ts` with complete access control
- Updated `src/app/api/aws-credentials/route.ts` to return status only, never credentials

### Dependencies
- Added `@upstash/ratelimit@^2.0.7` - Distributed rate limiting
- Added `@upstash/redis@^1.36.1` - Redis client for rate limiting
- Added `csrf@^3.1.0` - CSRF token generation and validation
- Added `jest@latest` - Testing framework
- Added `@jest/globals@latest` - Jest globals
- Added `@types/jest@latest` - Jest type definitions
- Added `ts-jest@latest` - TypeScript support for Jest
- Added `ts-node@latest` - TypeScript execution for tests

### Configuration
- Added `JWT_SECRET` to `.env` (generated strong secret)
- Added `JWT_SECRET` to `.env.example` with generation instructions
- Added `CSRF_SECRET` to `.env` (generated strong secret)
- Added `CSRF_SECRET` to `.env.example` with generation instructions
- Added `UPSTASH_REDIS_REST_URL` to `.env.example` (optional)
- Added `UPSTASH_REDIS_REST_TOKEN` to `.env.example` (optional)
- Created `jest.config.js` for test configuration
- Created `src/proxy.ts` for Edge proxy
- Added test scripts to `package.json`:
  - `npm test` - Run all tests
  - `npm run test:security` - Run security tests only
  - `npm run test:watch` - Watch mode for development
  - `npm run test:coverage` - Generate coverage report
  - `npm run security-check` - Security tests + type check


## [1.5.4] - 2026-01-08
### Added
- loading screen while video loads
- floating action buttons for video actions
- create components for common elements
### Fixed
- viewing a team video was not granting access


## [1.5.3] - 2026-01-07
- change sharing link for public and private videos
- allow invited users to submit videos to the group
- add settings import feature
- llms for ai index

## [1.5.0] - 2026-01-02
### Added - Teams Feature (Family Accounts)
- **Teams System**: Share AWS and email credentials with family or team members
  - Create teams with unique names (e.g., "Smith Family")
  - Invite members by email address
  - Role-based access control (OWNER, ADMIN, MEMBER)
  - Team credentials shared across all members
  - Members choose which team to upload to on each video
- **Teams UI**: Complete web interface for team management
  - `/dashboard/teams` - List all teams you're part of
  - `/dashboard/teams/[id]` - Team details, members, and credentials
  - Create team button with helpful info modal
  - Role badges (OWNER: purple, ADMIN: blue, MEMBER: gray)
  - Display AWS credentials (bucket name, region) if configured
  - Display Email credentials (provider, from email) if configured
  - Member list with email and role
- **Member Management**: Full control over team membership
  - Invite members by email with role selection (OWNER only can assign ADMIN/OWNER)
  - Change member roles (OWNER only)
  - Remove members with permission checks
  - Leave team (all roles, OWNER must assign another owner first)
  - Delete team (OWNER only, cascade deletes all related data)
- **Video Upload Team Selection**: Choose account on each upload
  - Dropdown shows "My Personal Account" and all teams
  - Display role badge next to each team name
  - Backend validates team membership
  - Videos tagged with teamId and use team's AWS/Email credentials
- **Teams API Endpoints**:
  - POST `/api/teams` - Create team
  - GET `/api/teams` - List user's teams
  - GET `/api/teams/[id]` - Get team details
  - PATCH `/api/teams/[id]` - Update team (OWNER/ADMIN only)
  - DELETE `/api/teams/[id]` - Delete team (OWNER only)
  - POST `/api/teams/[id]/members` - Invite member
  - PATCH `/api/teams/[id]/members/[userId]` - Update member role (OWNER only)
  - DELETE `/api/teams/[id]/members/[userId]` - Remove member
  - DELETE `/api/teams/[id]/leave` - Leave team
  - Grid and list views on the dashboard
  - Group/Team selector on the dashboard

### Changed
- Updated video upload to support teamId parameter
- Video upload now validates team membership before using team credentials
- Added "Teams" and "Groups" navigation links to dashboard header
- Removed email address display from dashboard header

### Technical - Teams
- Teams can have AWS credentials (shared bucket and region)
- Teams can have Email credentials (shared provider and settings)
- Videos have optional teamId field linking to team
- Groups can be team-owned or personal
- Cascade deletes maintain data integrity
- Role hierarchy: OWNER > ADMIN > MEMBER

### Use Cases
- Family sharing one AWS account (parents + kids)
- Small teams collaborating on video content
- Anyone wanting to give others access without sharing credentials
- Multiple users sharing storage costs

## [1.4.0] - 2026-01-02
### Added - Universal Deep Linking with LinkForty
- **Deep Link Service**: Backend service for generating LinkForty universal links
  - Created `DeepLinkService` class in `/src/lib/deep-link.ts`
  - Generates video-specific deep links with fallback URLs
  - Supports custom parameters (video ID, recipient email)
  - Environment-based configuration (dev/production URLs)
  - Configurable via `LINKFORTY_BASE_URL` environment variable
- **Enhanced Email Templates**: Video sharing emails now use universal links
  - Updated `/api/videos/[id]/share` endpoint to use LinkForty links
  - Generated links work for both individual and group sharing
  - Links open directly in mobile app if installed
  - Automatic web fallback if app not installed (`/watch/{videoId}`)
  - Styled "Watch Video" button with improved visual design
  - Helper text explaining app-first behavior
- **Universal Link Flow**:
  - LinkForty detects platform and routes appropriately
  - Mobile app opens directly to video player
  - Web users redirected to web video viewer
  - Supports deferred deep linking for new app installs

### Changed - Video Sharing
- Updated email HTML templates with styled button and user guidance
- Enhanced both individual and group share emails with deep links
- Improved email messaging to explain universal link behavior

### Technical - Deep Linking
- LinkForty handles platform detection automatically
- Deep links include recipient tracking for analytics
- Privacy-focused operation (no persistent device IDs)
- Works seamlessly across iOS, Android, and web platforms

### Configuration Required
- Set up custom domain at LinkForty cloud service
- Configure `LINKFORTY_BASE_URL` in environment
- Coordinate with mobile app configuration for scheme handling

## [1.3.3] - 2026-01-02
### Added
- display ••••••• when Resend API key exists

## [1.3.1] - 2026-01-02
### Added
- add web page for email setup instructions
### Fixed
- fix rotation issue with mobile video recorder


## [1.3.0] - 2026-01-01
### Added - Mobile Share Management Parity
- **Mobile App Enhancement**: Mobile app now has full feature parity with web for share management
  - Mobile users can view all existing shares (individual and group) in ShareVideoScreen
  - Mobile users can remove shares directly from the app with confirmation dialogs
  - New "Manage" tab in mobile ShareVideoScreen displays all shares with dates
  - Removed mobile limitation that required web dashboard for managing shares

### Added - Email Autocomplete for Video Sharing
- **Smart Email Suggestions**: Previously shared users appear as autocomplete suggestions
  - Dropdown shows matching emails as you type
  - Displays last shared date for each user
  - Click to instantly fill in the email
  - Works across all video share modals
  - No need to retype frequent recipients
  - Sorted by most recently shared
- **Backend API**:
  - GET `/api/users/shared-with` - Returns list of previously shared users
  - Sorted by most recent share date
  - Includes last shared timestamp

### Added - Web Video Recording
- **In-Browser Video Recording**: Record videos directly in the web browser
  - Three recording modes:
    - **Webcam**: Record using camera and microphone
    - **Screen Recording**: Capture screen with audio
    - **Screen + Webcam**: Record screen with webcam overlay (picture-in-picture)
  - Modern, full-screen recording interface
  - Real-time recording timer
  - Live preview during recording
  - Review and retake before uploading
  - Optional title field for recordings
  - Upload progress indicator
  - `/dashboard/record` - Recording interface page
- **Recording Controls**:
  - Start/stop recording
  - Real-time duration display
  - Graceful handling of browser stop-share actions
  - Automatic stream cleanup
- **Technical Implementation**:
  - Uses MediaRecorder API with VP9 codec
  - getUserMedia() for webcam access
  - getDisplayMedia() for screen capture
  - 1080p video quality (1920x1080)
  - WebM video format
  - Browser-native video preview
- **Dashboard Integration**:
  - "Record Video" button alongside "Upload Video"
  - Purple-themed UI to distinguish from upload
  - Seamless integration with existing upload workflow
- **Enhanced Error Handling**:
  - Detailed, context-aware error messages
  - Step-by-step permission setup instructions for macOS
  - Specific guidance for screen recording, webcam, and browser permissions
  - Graceful handling of user cancellations
  - "Try Again" button to easily retry after fixing permissions

### Added - Teams and Groups
- **Teams Feature**: Multiple users can share the same AWS and Email credentials
  - Team model with owner, admin, and member roles
  - Team member management with role-based permissions
  - Team credentials (AWS and Email) shared across all members
  - Team videos and groups organization
  - `/dashboard/teams` - Teams list and creation page
  - `/dashboard/teams/[id]` - Team details, members, and credentials management
- **Groups Feature**: Collections of email addresses for batch video sharing
  - ShareGroup model for creating email distribution lists
  - Personal groups (owned by user) and team groups
  - Batch sharing sends video to all group members at once
  - `/dashboard/groups` - Groups list and creation page
  - `/dashboard/groups/[id]` - Group details and member management
- **Enhanced Video Sharing**: Updated share modal with tabbed interface
  - "Share with User" tab for individual email sharing
  - "Share with Group" tab for batch sharing with groups
  - Display both individual and group shares
  - Unshare from individuals or entire groups

### Added - Teams and Groups API
- `POST /api/teams` - Create team
- `GET /api/teams` - List user's teams
- `GET /api/teams/[id]` - Get team details
- `PATCH /api/teams/[id]` - Update team (OWNER/ADMIN only)
- `DELETE /api/teams/[id]` - Delete team (OWNER only)
- `POST /api/teams/[id]/members` - Invite team members
- `PATCH /api/teams/[id]/members/[userId]` - Update member role
- `DELETE /api/teams/[id]/members/[userId]` - Remove team member
- `POST /api/groups` - Create share group
- `GET /api/groups` - List user's groups (with optional team filter)
- `GET /api/groups/[id]` - Get group details
- `PATCH /api/groups/[id]` - Update group (owner only)
- `DELETE /api/groups/[id]` - Delete group (owner only)
- `POST /api/groups/[id]/members` - Add members to group
- `DELETE /api/groups/[id]/members/[email]` - Remove member from group
- `DELETE /api/videos/[id]/group-shares/[groupId]` - Unshare video from group

### Added - Mobile Support
- Created JWT-based authentication system for mobile apps
- Added `/api/auth/mobile/signup` endpoint for mobile user registration
- Added `/api/auth/mobile/login` endpoint for mobile authentication
- Added `/api/auth/mobile/me` endpoint for token verification
- Created `auth-helpers.ts` utility for dual authentication support (NextAuth + JWT)
- Added streaming token endpoint `/api/videos/[id]/streaming-token` for mobile video playback
- Implemented manifest URL rewriting to append authentication tokens to HLS file URLs
- Updated streaming proxy to accept authentication via query parameter (`?token=...`)

### Changed
- Updated `/api/videos/[id]/share` to accept either `{ email }` or `{ groupId }` for flexible sharing
- Updated `/api/videos` GET endpoint to include group shares in owned videos and shared videos
- Modified video sharing to send emails to all group members when sharing with a group
- Updated all video API endpoints to support both web (NextAuth session) and mobile (JWT token) authentication
- Modified `/api/videos/route.ts` to use unified `getAuthUser()` helper
- Modified `/api/videos/upload/route.ts` to support mobile authentication
- Modified `/api/videos/[id]/route.ts` (DELETE) to support mobile authentication
- Modified `/api/videos/[id]/share/route.ts` to support mobile authentication and group sharing
- Modified `/api/videos/[id]/visibility/route.ts` to support mobile authentication
- Modified `/api/videos/[id]/presigned-url/route.ts` to support mobile authentication
- Modified `/api/videos/[id]/stream/[...path]/route.ts` to support token-based authentication
- Enhanced streaming proxy to dynamically inject tokens into HLS manifest files

### Database
- Added `Team` table with name, slug, and timestamps
- Added `TeamMember` table with role enum (OWNER, ADMIN, MEMBER)
- Added `ShareGroup` table with optional team association
- Added `ShareGroupMember` table for email addresses
- Added `VideoGroupShare` table to track group-based video shares
- Updated `AwsCredentials` and `EmailCredentials` to support team ownership (nullable userId, added teamId)
- Updated `Video` table with optional teamId for team videos
- Updated `User` table with relations to teams and groups
- Migration maintains backward compatibility (Phase 1: non-breaking changes)

### Technical
- JWT tokens expire after 30 days for regular auth, 1 hour for streaming tokens
- Streaming tokens include userId, videoId, and type fields for security
- All API endpoints maintain backward compatibility with web authentication
- Token-based streaming ensures all HLS segments (master playlist, variants, .ts files) are authenticated
- Role-based access control for team management
- Cascade deletes for teams and groups maintain data integrity
- Group sharing automatically sends batch emails to all members

### Fixed
- AWS credentials lookup now falls back to team credentials when user has no direct credentials
- Email credentials lookup now falls back to team credentials when user has no direct credentials
- Video upload and retrieval now work correctly for team members using shared credentials
- Video streaming and transcoding status checks now support team credentials

### Added - Mobile In-App Video Recording
- **Video Recording Interface**: Record videos directly within the mobile app
  - Full-screen camera view with front/back camera toggle
  - Flash control for back camera recordings
  - Microphone mute toggle for video-only recordings
  - Real-time recording timer with no duration limit
  - Warning notification at 5-minute mark
  - Pulsing red recording indicator
  - Haptic feedback on record start/stop
- **Preview and Edit**: Review recordings before sending
  - Video preview with playback controls
  - Add title to recording before upload
  - Optional "Save to gallery" toggle
  - Unlimited retakes capability
  - Discard confirmation to prevent accidental loss
- **Upload Integration**: Seamless upload from recording
  - Upload progress indicator
  - Auto-share for video replies
  - Adaptive video quality based on network (1080p preferred)
  - Automatic cleanup of temporary files
  - Integration with existing upload workflow
- **Entry Points**: Multiple ways to access recording
  - "Add Video" button now offers "Record New Video" or "Choose from Gallery"
  - Ready for future "Reply with Video" feature on shared videos
  - Full-screen modal presentation for immersive experience

### Added - Mobile Dependencies
- Installed `expo-camera` for camera access and recording
- Installed `expo-video` for video preview playback (replaces deprecated `expo-av`)
- Installed `expo-file-system` for temporary file management
- Installed `expo-media-library` for optional gallery saves
- Installed `expo-haptics` for tactile feedback

### Added - Mobile Permissions
- iOS: Camera usage permission (`NSCameraUsageDescription`)
- iOS: Microphone usage permission (`NSMicrophoneUsageDescription`)
- Android: `CAMERA` permission
- Android: `RECORD_AUDIO` permission
- Graceful permission request flow with user-friendly messaging

### Changed - Mobile Navigation
- Updated `RootStackParamList` to include `VideoRecorder` route with optional reply context
- Added `VideoRecorderScreen` to navigation stack with full-screen modal presentation
- Modified My Videos screen FAB to show recording/gallery choice dialog

### Technical - Video Recording
- Camera defaults to front-facing for conversational feel
- No recording duration limit (user-controlled)
- Automatic recording state management (idle → recording → preview → uploading)
- Memory-efficient video handling with immediate cleanup
- Support for reply context (replyToVideoId, shareWithEmail parameters)
- Recording interruption handling (backgrounding, phone calls)

### Design Decisions
- Always front camera by default (can toggle to back)
- Always show preview before sending (prevent accidental sends)
- Unlimited retakes allowed (no bandwidth cost, files are local)
- No effects or filters in MVP (keep simple)
- Single continuous recording only (no multi-clip stitching)
- Adaptive video quality based on network conditions

### Fixed - Mobile Crash Prevention
- **SafeVideoPreview Component**: Added error handling for video preview crashes in Expo Go
  - Graceful fallback UI when video player fails
  - Prevents app-wide crashes during video preview
  - Still allows upload even if preview unavailable
  - Addresses known `expo-video` native module instability in Expo Go
- Created crash analysis document at `.internal/CRASH_ANALYSIS.md`
- Note: For production stability, EAS development build is recommended over Expo Go
- **Fixed Missing Dependency**: Installed `@expo/vector-icons` package (v15.0.3) to resolve module not found errors in SafeVideoPreview component


## [1.2.0] - 2025-12-31
### Added
- renamed package from private-video-sharing to cheesebox
- created a cloud formation template and instruction page for one-click AWS setup
- include vercel analytics package
- Add visibility field to Video model (PRIVATE/PUBLIC)
- Create /embed/[videoId] route for public video embeds
- Add VisibilityToggle component for easy public/private switching
- Add EmbedCodeModal showing responsive and fixed embed codes
- Create API endpoint for public video streaming (no auth required)
- Update dashboard with visibility badges and Embed button
- Display embed button only for public videos

### Database:
- Migration adds visibility enum and field to videos table
- Default visibility is PRIVATE for existing videos
- Added index on visibility field for performance

### UI Updates:
- Visibility toggle switch in video cards
- Public/Private badge display
- Purple 'Embed' button for public videos
- Modal with embed code preview and copy functionality
- Support for both responsive (16:9) and fixed (640x360) embeds

### API Endpoints:
- GET /api/embed/[videoId]/stream - Public stream URL (no auth)
- PATCH /api/videos/[videoId]/visibility - Update visibility

### Security:
- Only COMPLETED videos can be made public
- Only video owners can change visibility
- Confirmation dialog when making videos public
- Public embeds only work for videos explicitly marked PUBLIC
- 
## [1.1.0] - 2025-12-30
### Added
- Bring your own email provider. Support for Resend, AWS SES, and SMTP

## [1.0.0] - 2025-12-24
### Added
- Initial release of Cheesebox platform
- User authentication with NextAuth.js
- AWS credentials management with AES-256-GCM encryption
- Video upload to user-owned S3 buckets
- Automatic HLS transcoding with AWS MediaConvert
- Video streaming via authenticated proxy endpoint
- Email-based video sharing (Google Docs-style)
- Email notifications via Resend
- Video deletion with automatic S3 cleanup
- Dashboard with "My Videos" and "Shared with Me" sections
- Video upload progress indicator
- File size validation (5GB limit)
- CORS configuration for S3 buckets
- Comprehensive AWS setup documentation

### Security
- Encrypted AWS credentials storage
- JWT-based authentication
- Pre-signed URL generation for video playback
- Permission-based access control
- bcrypt password hashing

### Fixed
- CORS errors during video playback
- 403 Forbidden errors for HLS segments
- Video status not auto-updating from AWS MediaConvert
- 404 errors when playing videos (manifest filename pattern)
- Input text visibility in forms

---

## How to Update
When making changes, please update this file following this format:

### Added
- New features

### Changed
- Changes in existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Removed features

### Fixed
- Bug fixes

### Security
- Security improvements
