# Security Model

Enterprise-grade security for Cheesebox.

## Security Layers

### 1. Encryption

**AWS Credentials (AES-256-GCM)**
```typescript
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const algorithm = 'aes-256-gcm';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // 64 hex chars

function encrypt(text: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv(algorithm, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

function decrypt(encrypted: string): string {
  const parts = encrypted.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encryptedText = parts[2];
  
  const decipher = createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

**Password Hashing (bcryptjs)**
```typescript
import { hash, compare } from 'bcryptjs';

// Registration
const hashedPassword = await hash(password, 10);

// Login
const isValid = await compare(password, user.password);
```

### 2. CSRF Protection

**Token Generation**
```typescript
import { randomBytes } from 'crypto';

export function generateCsrfToken(): string {
  return randomBytes(32).toString('hex');
}
```

**Validation**
```typescript
export function validateCsrfToken(
  headerToken: string,
  cookieToken: string
): boolean {
  return headerToken === cookieToken && headerToken.length === 64;
}
```

**Middleware**
```typescript
export async function csrfProtection(req: NextRequest) {
  if (['POST', 'PATCH', 'DELETE', 'PUT'].includes(req.method)) {
    const headerToken = req.headers.get('X-CSRF-Token');
    const cookieToken = req.cookies.get('csrf-token')?.value;
    
    if (!validateCsrfToken(headerToken, cookieToken)) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
    }
  }
}
```

### 3. Rate Limiting

**Upstash Redis Implementation**
```typescript
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

export async function checkRateLimit(
  identifier: string,
  max: number,
  window: number
): Promise<{ success: boolean; remaining: number }> {
  const key = `ratelimit:${identifier}`;
  const count = await redis.incr(key);
  
  if (count === 1) {
    await redis.expire(key, window);
  }
  
  const remaining = Math.max(0, max - count);
  
  return {
    success: count <= max,
    remaining
  };
}
```

**Rate Limits**
- Login: 5 attempts/hour per IP
- Registration: 3 attempts/hour per IP
- Video upload: 20/hour per user
- API requests: 100/minute per user

### 4. Input Validation

**Zod Schemas**
```typescript
import { z } from 'zod';

const videoSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  visibility: z.enum(['PRIVATE', 'PUBLIC'])
});

const emailSchema = z.string().email();

const awsConfigSchema = z.object({
  awsAccessKeyId: z.string().regex(/^AKIA[A-Z0-9]{16}$/),
  awsSecretAccessKey: z.string().min(40),
  awsRegion: z.string(),
  s3InputBucket: z.string(),
  s3OutputBucket: z.string()
});
```

### 5. SQL Injection Prevention

**Prisma ORM**
All database queries use Prisma's parameterized queries:

```typescript
// Safe - Prisma handles escaping
await prisma.video.findMany({
  where: { userId: userId }
});

// Safe - Prepared statements
await prisma.$queryRaw`
  SELECT * FROM "Video" WHERE "userId" = ${userId}
`;
```

### 6. XSS Prevention

**Content Security Policy**
```typescript
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://*.s3.amazonaws.com;
  media-src 'self' https://*.s3.amazonaws.com;
  frame-ancestors 'none';
`;

response.headers.set('Content-Security-Policy', cspHeader);
```

**Output Escaping**
React automatically escapes all content:

```typescript
// Safe - React escapes by default
<h1>{userInput}</h1>

// Dangerous - Only use for trusted HTML
<div dangerouslySetInnerHTML={{ __html: trustedHTML }} />
```

### 7. Authentication Security

**NextAuth.js Configuration**
```typescript
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        
        if (!user || !user.password) return null;
        
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;
        
        return { id: user.id, email: user.email };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  }
};
```

### 8. S3 Security

**Presigned URL Expiration**
```typescript
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const command = new GetObjectCommand({
  Bucket: bucket,
  Key: key
});

const url = await getSignedUrl(s3Client, command, {
  expiresIn: 3 * 60 * 60 // 3 hours
});
```

**Bucket Policies**
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Deny",
    "Principal": "*",
    "Action": "s3:*",
    "Resource": "arn:aws:s3:::bucket/*",
    "Condition": {
      "Bool": { "aws:SecureTransport": "false" }
    }
  }]
}
```

## Security Testing

**70+ Automated Tests**

```typescript
describe('Security Tests', () => {
  test('prevents SQL injection', async () => {
    const malicious = "'; DROP TABLE users; --";
    await expect(
      prisma.user.findFirst({ where: { email: malicious } })
    ).resolves.toBeNull();
  });

  test('requires CSRF token', async () => {
    const response = await fetch('/api/videos', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test' })
    });
    expect(response.status).toBe(403);
  });

  test('enforces rate limits', async () => {
    for (let i = 0; i < 6; i++) {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', password: 'wrong' })
      });
      if (i === 5) {
        expect(response.status).toBe(429);
      }
    }
  });

  test('validates AWS credentials format', async () => {
    const invalid = { awsAccessKeyId: 'invalid' };
    await expect(
      awsConfigSchema.parse(invalid)
    ).rejects.toThrow();
  });

  test('encrypts sensitive data', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        awsAccessKeyId: 'AKIAIOSFODNN7EXAMPLE'
      }
    });
    
    // Stored value should be encrypted
    expect(user.awsAccessKeyId).not.toBe('AKIAIOSFODNN7EXAMPLE');
    expect(user.awsAccessKeyId).toContain(':'); // IV:authTag:encrypted
  });
});
```

## Vulnerability Disclosure

Report security issues to: security@cheesebox.com

**Response time:**
- Critical: 24 hours
- High: 72 hours
- Medium: 1 week
- Low: 2 weeks

## Compliance

- **GDPR**: User data deletion on request
- **CCPA**: Data export and deletion
- **SOC 2**: Annual audit (planned)

## Next Steps

- [Rate Limiting Configuration](/llms/rate-limiting.md)
- [Testing Guide](/llms/testing.md)
- [AWS Permissions](/llms/aws-permissions.md)
