/**
 * CSRF Protection for Next.js API Routes
 *
 * Prevents Cross-Site Request Forgery attacks (CWE-352)
 *
 * Implementation:
 * - Double Submit Cookie pattern
 * - Tokens stored in httpOnly cookies
 * - Validated on state-changing requests (POST, PUT, PATCH, DELETE)
 * - Uses Web Crypto API for Edge Runtime compatibility
 */

import { NextRequest, NextResponse } from 'next/server';

const CSRF_TOKEN_LENGTH = 32;
// Use __Host- prefix in production (requires HTTPS), regular cookie in development
const CSRF_COOKIE_NAME = process.env.NODE_ENV === 'production' ? '__Host-csrf-token' : 'csrf-token';
const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_SECRET_ENV = process.env.CSRF_SECRET || 'change-this-in-production-use-openssl-rand-base64-32';

/**
 * Generate a cryptographically secure CSRF token using Web Crypto API
 * Compatible with Edge Runtime
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(CSRF_TOKEN_LENGTH);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash a token for comparison (prevents timing attacks)
 * Uses Web Crypto API for Edge Runtime compatibility
 */
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token + CSRF_SECRET_ENV);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate CSRF token from request
 * Uses double-submit cookie pattern
 */
export async function validateCsrfToken(request: NextRequest): Promise<boolean> {
  // Get token from cookie
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;

  // Get token from header or body
  const headerToken = request.headers.get(CSRF_HEADER_NAME);

  // Both must be present
  if (!cookieToken || !headerToken) {
    return false;
  }

  // Tokens must match (using timing-safe comparison via hashing)
  const cookieHash = await hashToken(cookieToken);
  const headerHash = await hashToken(headerToken);

  return cookieHash === headerHash;
}

/**
 * Get CSRF token from request, or generate new one
 */
export function getCsrfToken(request: NextRequest): string {
  const existingToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;

  if (existingToken) {
    return existingToken;
  }

  return generateCsrfToken();
}

/**
 * Set CSRF token cookie in response
 */
export function setCsrfTokenCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: CSRF_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

/**
 * Check if request requires CSRF validation
 */
export function requiresCsrfValidation(request: NextRequest): boolean {
  const method = request.method;
  const path = request.nextUrl.pathname;

  // Only validate state-changing methods
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    return false;
  }

  // Skip CSRF for requests using JWT Bearer token authentication
  // Mobile apps use JWT tokens instead of session cookies
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return false;
  }

  // Skip CSRF for API routes that use other authentication
  // - NextAuth routes (NextAuth handles its own CSRF)
  // - Mobile JWT routes (protected by JWT tokens)
  const exemptPaths = [
    '/api/auth/', // NextAuth endpoints
    '/api/auth/mobile/login',
    '/api/auth/mobile/signup',
    '/api/auth/mobile/me',
  ];

  if (exemptPaths.some(exempt => path.startsWith(exempt))) {
    return false;
  }

  // Validate all other API routes
  if (path.startsWith('/api/')) {
    return true;
  }

  return false;
}

/**
 * Create a CSRF error response
 */
export function createCsrfErrorResponse(): NextResponse {
  return NextResponse.json(
    {
      error: 'CSRF token validation failed',
      message: 'Invalid or missing CSRF token. Please refresh the page and try again.'
    },
    { status: 403 }
  );
}

/**
 * CSRF validation middleware for API routes
 *
 * Usage in API route:
 * ```typescript
 * export async function POST(request: NextRequest) {
 *   const csrfError = await validateCsrfForRoute(request);
 *   if (csrfError) return csrfError;
 *
 *   // ... your route logic
 * }
 * ```
 */
export async function validateCsrfForRoute(request: NextRequest): Promise<NextResponse | null> {
  if (!requiresCsrfValidation(request)) {
    return null;
  }

  const isValid = await validateCsrfToken(request);
  if (!isValid) {
    console.warn('CSRF validation failed:', {
      path: request.nextUrl.pathname,
      method: request.method,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    });

    return createCsrfErrorResponse();
  }

  return null;
}

/**
 * Get CSRF token for client-side use
 * This should be called from a GET API route
 */
export async function getCsrfTokenForClient(request: NextRequest): Promise<NextResponse> {
  const token = getCsrfToken(request);

  const response = NextResponse.json({ csrfToken: token });
  setCsrfTokenCookie(response, token);

  return response;
}
