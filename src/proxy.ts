/**
 * Next.js Proxy (Edge Middleware)
 *
 * Runs on Edge Runtime for all requests
 * Handles CSRF protection for API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  requiresCsrfValidation,
  validateCsrfToken,
  getCsrfToken,
  setCsrfTokenCookie,
  createCsrfErrorResponse,
} from './lib/csrf';

export async function proxy(request: NextRequest) {
  // Handle CSRF for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Check if this request requires CSRF validation
    if (requiresCsrfValidation(request)) {
      // Validate CSRF token
      const isValid = await validateCsrfToken(request);
      if (!isValid) {
        return createCsrfErrorResponse();
      }
    }

    // For GET requests to API routes, ensure CSRF token cookie is set
    if (request.method === 'GET') {
      const token = getCsrfToken(request);
      const response = NextResponse.next();
      setCsrfTokenCookie(response, token);
      return response;
    }
  }

  // For all other requests, ensure CSRF token is available
  const token = getCsrfToken(request);
  const response = NextResponse.next();
  setCsrfTokenCookie(response, token);

  return response;
}
