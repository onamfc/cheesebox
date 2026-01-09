import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { generateToken } from '@/lib/jwt';
import {
  checkRateLimit,
  loginRateLimit,
  trackFailedLogin,
  clearFailedLogins,
  calculateProgressiveDelay,
} from '@/lib/rate-limit';

/**
 * POST /api/auth/mobile/login
 *
 * Authenticate user and return JWT token for mobile app
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Apply rate limiting by email
    const rateLimitResult = await checkRateLimit(loginRateLimit, email.toLowerCase());
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many login attempts. Please try again later.',
          retryAfter: rateLimitResult.reset ? Math.ceil((rateLimitResult.reset - Date.now()) / 1000) : 900,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitResult.reset ? Math.ceil((rateLimitResult.reset - Date.now()) / 1000) : 900),
          },
        }
      );
    }

    // Check for progressive delay based on failed attempts
    const failedAttempts = await trackFailedLogin(email.toLowerCase());
    const delay = calculateProgressiveDelay(failedAttempts);

    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await compare(password, user.passwordHash);

    if (!isValid) {
      // Track failed login attempt (already tracked above, so increment is automatic)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Clear failed login attempts on successful login
    await clearFailedLogins(email.toLowerCase());

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}
