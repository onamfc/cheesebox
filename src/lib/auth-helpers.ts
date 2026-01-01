import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { verifyToken } from './jwt';
import { prisma } from './prisma';

export interface AuthUser {
  id: string;
  email: string;
}

/**
 * Get authenticated user from either NextAuth session or JWT token
 * Supports both web (NextAuth) and mobile (JWT) authentication
 */
export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  // Try NextAuth session first (for web)
  const session = await getServerSession(authOptions);
  if (session?.user?.id && session?.user?.email) {
    return {
      id: session.user.id,
      email: session.user.email,
    };
  }

  // Try JWT token (for mobile)
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);

    try {
      const payload = verifyToken(token);

      // Verify user still exists
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true },
      });

      if (user) {
        return user;
      }
    } catch (error) {
      // Invalid token
      return null;
    }
  }

  return null;
}
