# Permissions Model

Email-based access control for video sharing.

## Permission Types

### 1. Owner Permission
- Full control over video
- Can update title, description
- Can change visibility
- Can share with others
- Can delete video

### 2. Share Permission
- View-only access
- Granted via email address
- Persists even if user changes account email
- Cannot modify or reshare

### 3. Team Permission
- Team members can view team videos
- Upload permission via shared AWS credentials
- Role-based access (OWNER, ADMIN, MEMBER)

### 4. Public Permission
- Any authenticated user can view
- No explicit share required
- Video appears in public listings

## Permission Checks

```typescript
async function canAccessVideo(videoId: string, userEmail: string) {
  const video = await prisma.video.findUnique({
    where: { id: videoId },
    include: {
      user: true,
      shares: true,
      team: { include: { members: { include: { user: true } } } }
    }
  });

  // Owner check
  if (video.user.email === userEmail) return true;

  // Public video
  if (video.visibility === 'PUBLIC') return true;

  // Explicit share
  const hasShare = video.shares.some(s => s.sharedWithEmail === userEmail);
  if (hasShare) return true;

  // Team member
  if (video.team) {
    const isMember = video.team.members.some(m => m.user.email === userEmail);
    if (isMember) return true;
  }

  return false;
}
```

## Database Schema

```prisma
model VideoShare {
  id              String   @id @default(cuid())
  videoId         String
  video           Video    @relation(fields: [videoId], references: [id], onDelete: Cascade)
  sharedWithEmail String
  createdAt       DateTime @default(now())

  @@unique([videoId, sharedWithEmail])
}
```

## Share Groups

Reusable email lists for batch sharing:

```typescript
const group = await prisma.shareGroup.create({
  data: {
    name: "Marketing Team",
    emails: [
      "alice@company.com",
      "bob@company.com",
      "carol@company.com"
    ],
    userId: currentUser.id
  }
});

// Share with entire group
for (const email of group.emails) {
  await prisma.videoShare.create({
    data: {
      videoId: videoId,
      sharedWithEmail: email
    }
  });
}
```

## Security Considerations

1. **Email-based, not user-based**: Shares persist even if user changes email in account
2. **No transitive permissions**: Shared users cannot reshare
3. **Cascade delete**: Deleting video removes all shares
4. **Rate limiting**: Sharing limited to prevent spam
5. **Email validation**: Only valid email formats accepted

## Next Steps

- [Security Model](/llms/security.md)
- [API Routes](/llms/api-routes.md)
- [Teams Guide](/llms/teams.md)
