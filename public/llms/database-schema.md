# Database Schema

Cheesebox uses PostgreSQL with Prisma ORM for type-safe database access.

## Complete Prisma Schema

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Core Models

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String?
  name          String?
  image         String?
  provider      Provider  @default(CREDENTIALS)
  providerId    String?

  // AWS Configuration (encrypted)
  awsAccessKeyId     String?
  awsSecretAccessKey String?
  awsRegion          String?
  s3InputBucket      String?
  s3OutputBucket     String?

  // Preferences
  emailNotifications Boolean @default(true)
  theme              String? @default("explorateur")

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  videos        Video[]
  sharesReceived VideoShare[] @relation("SharedWith")
  teamsOwned    Team[]
  teamMemberships TeamMember[]
  shareGroups   ShareGroup[]

  @@index([email])
  @@index([provider, providerId])
}

model Video {
  id                String   @id @default(cuid())
  title             String
  description       String?

  // AWS Storage
  inputKey          String
  outputKey         String?
  inputBucket       String
  outputBucket      String

  // Status
  transcodingStatus TranscodingStatus @default(PENDING)
  transcodingJobId  String?
  visibility        Visibility @default(PRIVATE)

  // Ownership
  userId            String
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  teamId            String?
  team              Team?    @relation(fields: [teamId], references: [id], onDelete: SetNull)

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  shares            VideoShare[]

  @@index([userId])
  @@index([teamId])
  @@index([transcodingStatus])
  @@index([visibility])
  @@index([createdAt(sort: Desc)])
}

model VideoShare {
  id               String   @id @default(cuid())
  videoId          String
  video            Video    @relation(fields: [videoId], references: [id], onDelete: Cascade)
  sharedWithEmail  String
  sharedBy         User?    @relation("SharedWith", fields: [sharedWithEmail], references: [email], onDelete: Cascade)

  createdAt        DateTime @default(now())

  @@unique([videoId, sharedWithEmail])
  @@index([sharedWithEmail])
  @@index([videoId])
}

model Team {
  id                  String   @id @default(cuid())
  name                String

  // Shared AWS Credentials (encrypted)
  awsAccessKeyId      String
  awsSecretAccessKey  String
  awsRegion           String
  s3InputBucket       String
  s3OutputBucket      String

  // Ownership
  ownerId             String
  owner               User     @relation(fields: [ownerId], references: [id], onDelete: Cascade)

  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  // Relations
  members             TeamMember[]
  videos              Video[]

  @@index([ownerId])
}

model TeamMember {
  id        String     @id @default(cuid())
  teamId    String
  team      Team       @relation(fields: [teamId], references: [id], onDelete: Cascade)
  userId    String
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  role      TeamRole   @default(MEMBER)

  createdAt DateTime   @default(now())

  @@unique([teamId, userId])
  @@index([userId])
  @@index([teamId])
}

model ShareGroup {
  id        String   @id @default(cuid())
  name      String
  emails    String[]

  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}

// Enums

enum Provider {
  CREDENTIALS
  GOOGLE
}

enum TranscodingStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

enum Visibility {
  PRIVATE
  PUBLIC
}

enum TeamRole {
  OWNER
  ADMIN
  MEMBER
}
```

## Model Descriptions

### User

Stores user authentication and AWS configuration.

**Key Fields:**
- `provider`: Authentication method (CREDENTIALS or GOOGLE)
- `providerId`: OAuth provider ID (e.g., Google sub)
- `awsAccessKeyId`/`awsSecretAccessKey`: Encrypted AWS credentials
- `emailNotifications`: Preference for email alerts
- `theme`: Selected theme ID

**Encryption:**
AWS credentials are encrypted using AES-256-GCM before storage. Encryption key stored in `ENCRYPTION_KEY` environment variable.

**Indexes:**
- `email`: Unique lookup for authentication
- `(provider, providerId)`: Fast OAuth user lookup

### Video

Represents uploaded videos with metadata and status.

**Key Fields:**
- `inputKey`/`outputKey`: S3 object keys
- `transcodingStatus`: Current MediaConvert job status
- `visibility`: PUBLIC or PRIVATE access control
- `teamId`: Optional team ownership

**Lifecycle:**
1. Created with status `PENDING`
2. Upload to S3 using `inputKey`
3. MediaConvert job triggered → `PROCESSING`
4. HLS output written to `outputKey` → `COMPLETED`
5. If error → `FAILED`

**Indexes:**
- `userId`: Owner lookup
- `teamId`: Team videos
- `transcodingStatus`: Filter by status
- `visibility`: Public video queries
- `createdAt DESC`: Recent videos first

### VideoShare

Email-based permissions for private videos.

**Key Fields:**
- `videoId`: Video being shared
- `sharedWithEmail`: Recipient email address
- `sharedBy`: Optional user reference if recipient has account

**Unique Constraint:**
`(videoId, sharedWithEmail)` prevents duplicate shares.

**Permission Check:**
```typescript
const hasAccess = await prisma.videoShare.findFirst({
  where: {
    videoId: videoId,
    sharedWithEmail: user.email
  }
});
```

**Indexes:**
- `sharedWithEmail`: Find all videos shared with user
- `videoId`: List all shares for video

### Team

Shared AWS credentials for collaborative video management.

**Key Fields:**
- `awsAccessKeyId`/`awsSecretAccessKey`: Encrypted shared credentials
- `ownerId`: Team creator (can delete team)

**Use Case:**
Multiple users upload videos using same AWS account. Videos belong to team, not individual user.

**Security:**
- Only team owner can modify credentials
- Members can only upload/manage videos
- Credentials encrypted separately from user credentials

### TeamMember

Junction table for team membership.

**Roles:**
- `OWNER`: Full control (set on team owner automatically)
- `ADMIN`: Can invite members, manage videos
- `MEMBER`: Can upload and manage own videos

**Cascade Delete:**
Deleting team removes all memberships.

### ShareGroup

Reusable email lists for batch sharing.

**Key Fields:**
- `emails`: Array of email addresses
- `userId`: Group creator/owner

**Use Case:**
Save "Marketing Team" with 10 emails. Share video with entire group in one click.

**Array Field:**
PostgreSQL array type allows efficient storage and querying.

## Relationships

### One-to-Many

```
User ──┬─→ Video
       ├─→ Team
       ├─→ ShareGroup
       └─→ TeamMember

Team ──┬─→ Video
       └─→ TeamMember

Video ─→ VideoShare
```

### Many-to-Many

```
User ←→ Team (via TeamMember)
Video ←→ User (via VideoShare - email-based)
```

## Migrations

Prisma automatically generates migrations:

```bash
npx prisma migrate dev --name description
npx prisma migrate deploy  # Production
npx prisma generate       # Generate client
```

## Common Queries

### Get user's videos with share count

```typescript
const videos = await prisma.video.findMany({
  where: { userId: user.id },
  include: {
    shares: {
      select: { sharedWithEmail: true }
    }
  },
  orderBy: { createdAt: 'desc' }
});
```

### Get videos shared with user

```typescript
const sharedVideos = await prisma.video.findMany({
  where: {
    shares: {
      some: { sharedWithEmail: user.email }
    }
  },
  include: {
    user: {
      select: { email: true, name: true }
    }
  }
});
```

### Get team videos

```typescript
const teamVideos = await prisma.video.findMany({
  where: { teamId: teamId },
  include: {
    user: true,
    shares: true
  }
});
```

### Check video permission

```typescript
const hasAccess = await prisma.video.findFirst({
  where: {
    id: videoId,
    OR: [
      { userId: user.id },
      { visibility: 'PUBLIC' },
      { shares: { some: { sharedWithEmail: user.email } } },
      { team: { members: { some: { userId: user.id } } } }
    ]
  }
});
```

## Seed Data

For development:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await hash('password123', 10);

  const user = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      password,
      name: 'Demo User',
      awsRegion: 'us-east-1',
      s3InputBucket: 'demo-input',
      s3OutputBucket: 'demo-output'
    }
  });

  console.log({ user });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
```

Run with:
```bash
npx prisma db seed
```
