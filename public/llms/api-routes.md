# API Routes

Complete REST API documentation for Cheesebox.

## Authentication

All API routes (except `/api/auth/*`) require authentication via NextAuth.js session cookies.

### Headers

```
Cookie: next-auth.session-token=<jwt-token>
X-CSRF-Token: <csrf-token>
```

### Error Responses

```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Rate Limit Exceeded
- `500`: Internal Server Error

## Auth Routes

### POST /api/auth/register

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "createdAt": "2025-01-11T..."
  }
}
```

**Rate Limit:** 3 requests per hour per IP

### POST /api/auth/signin

Handled by NextAuth.js - use credentials provider.

### GET /api/auth/signout

Handled by NextAuth.js - clears session.

### POST /api/auth/mobile/google

Mobile OAuth endpoint for Google sign-in.

**Request Body:**
```json
{
  "idToken": "google-id-token"
}
```

**Response:**
```json
{
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "name": "John Doe",
    "image": "https://..."
  },
  "token": "jwt-token-for-mobile"
}
```

## Video Routes

### POST /api/videos/init

Initialize video upload and get presigned S3 URL.

**Request Body:**
```json
{
  "title": "My Video",
  "description": "Optional description",
  "teamId": "optional-team-id"
}
```

**Response:**
```json
{
  "videoId": "clx...",
  "uploadUrl": "https://bucket.s3.amazonaws.com/...",
  "key": "videos/user-id/video-id/source.mp4"
}
```

### POST /api/videos/transcode

Trigger MediaConvert transcoding job.

**Request Body:**
```json
{
  "videoId": "clx...",
  "inputKey": "videos/user-id/video-id/source.mp4"
}
```

**Response:**
```json
{
  "jobId": "1234567890-abc",
  "status": "PROCESSING"
}
```

### GET /api/videos

List videos for current user.

**Query Parameters:**
- `type`: `owned | shared | team | group` (required)
- `teamId`: Team ID (required if type=team)
- `groupId`: Group ID (required if type=group)

**Response:**
```json
[
  {
    "id": "clx...",
    "title": "My Video",
    "description": "...",
    "transcodingStatus": "COMPLETED",
    "visibility": "PRIVATE",
    "createdAt": "2025-01-11T...",
    "shares": [...],
    "isOwner": true
  }
]
```

### GET /api/videos/[id]

Get video details.

**Response:**
```json
{
  "id": "clx...",
  "title": "My Video",
  "description": "...",
  "transcodingStatus": "COMPLETED",
  "visibility": "PRIVATE",
  "createdAt": "2025-01-11T...",
  "userId": "clx...",
  "teamId": null,
  "outputKey": "transcoded/...",
  "inputBucket": "bucket-name",
  "outputBucket": "output-bucket"
}
```

### PATCH /api/videos/[id]

Update video metadata or visibility.

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "visibility": "PUBLIC"
}
```

**Response:**
```json
{
  "video": {
    "id": "clx...",
    "title": "Updated Title",
    ...
  }
}
```

### DELETE /api/videos/[id]

Delete video and remove from S3.

**Response:**
```json
{
  "success": true
}
```

### POST /api/videos/[id]/play

Get presigned URLs for video playback.

**Response:**
```json
{
  "manifestUrl": "https://bucket.s3.amazonaws.com/...m3u8?X-Amz-...",
  "segmentUrls": {
    "segment0.ts": "https://...",
    "segment1.ts": "https://..."
  },
  "expiresIn": 10800
}
```

### POST /api/videos/[id]/share

Share video with email addresses.

**Request Body:**
```json
{
  "emails": ["user1@example.com", "user2@example.com"],
  "message": "Check out this video!"
}
```

**Response:**
```json
{
  "shares": [
    {
      "id": "clx...",
      "sharedWithEmail": "user1@example.com",
      "createdAt": "2025-01-11T..."
    }
  ]
}
```

### DELETE /api/videos/[id]/share/[shareId]

Remove share permission.

**Response:**
```json
{
  "success": true
}
```

### GET /api/videos/[id]/embed

Get embed code for public videos.

**Response:**
```json
{
  "embedCode": "<iframe src=\"...\" ...></iframe>",
  "shareUrl": "https://cheesebox.com/watch/clx..."
}
```

## Team Routes

### GET /api/teams

List user's teams.

**Response:**
```json
[
  {
    "id": "clx...",
    "name": "Marketing Team",
    "createdAt": "2025-01-11T...",
    "ownerId": "clx...",
    "isOwner": true,
    "memberCount": 5
  }
]
```

### POST /api/teams

Create a new team.

**Request Body:**
```json
{
  "name": "Engineering Team",
  "awsAccessKeyId": "AKIA...",
  "awsSecretAccessKey": "secret...",
  "awsRegion": "us-east-1",
  "s3InputBucket": "input-bucket",
  "s3OutputBucket": "output-bucket"
}
```

**Response:**
```json
{
  "team": {
    "id": "clx...",
    "name": "Engineering Team",
    ...
  }
}
```

### GET /api/teams/[id]

Get team details.

**Response:**
```json
{
  "id": "clx...",
  "name": "Engineering Team",
  "ownerId": "clx...",
  "members": [
    {
      "id": "clx...",
      "userId": "clx...",
      "role": "MEMBER",
      "user": {
        "email": "member@example.com",
        "name": "..."
      }
    }
  ]
}
```

### PATCH /api/teams/[id]

Update team details.

**Request Body:**
```json
{
  "name": "Updated Team Name",
  "awsAccessKeyId": "new-key"
}
```

### DELETE /api/teams/[id]

Delete team (owner only).

### POST /api/teams/[id]/members

Add team member.

**Request Body:**
```json
{
  "email": "newmember@example.com",
  "role": "MEMBER"
}
```

### DELETE /api/teams/[id]/members/[memberId]

Remove team member.

## Share Group Routes

### GET /api/groups

List user's share groups.

**Response:**
```json
[
  {
    "id": "clx...",
    "name": "Client Team",
    "emails": ["client1@example.com", "client2@example.com"],
    "createdAt": "2025-01-11T..."
  }
]
```

### POST /api/groups

Create share group.

**Request Body:**
```json
{
  "name": "Product Team",
  "emails": ["pm@example.com", "designer@example.com"]
}
```

### GET /api/groups/[id]

Get group details.

### PATCH /api/groups/[id]

Update group.

**Request Body:**
```json
{
  "name": "Updated Name",
  "emails": ["updated@example.com"]
}
```

### DELETE /api/groups/[id]

Delete group.

## AWS Configuration Routes

### POST /api/aws/config

Save encrypted AWS credentials.

**Request Body:**
```json
{
  "awsAccessKeyId": "AKIA...",
  "awsSecretAccessKey": "secret...",
  "awsRegion": "us-east-1",
  "s3InputBucket": "input-bucket",
  "s3OutputBucket": "output-bucket"
}
```

### GET /api/aws/config

Get current AWS configuration (credentials redacted).

**Response:**
```json
{
  "awsRegion": "us-east-1",
  "s3InputBucket": "input-bucket",
  "s3OutputBucket": "output-bucket",
  "hasCredentials": true
}
```

### DELETE /api/aws/config

Remove AWS credentials.

## Settings Routes

### GET /api/settings

Get user settings.

### PATCH /api/settings

Update user settings.

**Request Body:**
```json
{
  "name": "John Doe",
  "emailNotifications": true,
  "theme": "explorateur"
}
```

## Rate Limits

All routes are protected by rate limiting:

| Route Pattern | Limit | Window |
|--------------|-------|--------|
| /api/auth/register | 3 | 1 hour |
| /api/auth/signin | 5 | 1 hour |
| /api/videos/init | 20 | 1 hour |
| /api/videos/transcode | 20 | 1 hour |
| /api/* (general) | 100 | 1 minute |

## CSRF Protection

All state-changing requests (POST, PATCH, DELETE) require valid CSRF token in header:

```
X-CSRF-Token: <token-from-cookie>
```

Token automatically included by `fetchWithCsrf` client utility.
