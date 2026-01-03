# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
