/**
 * GET /api/csrf-token
 *
 * Returns CSRF token for client-side use
 * Also sets the token in a httpOnly cookie
 */

import { NextRequest } from 'next/server';
import { getCsrfTokenForClient } from '@/lib/csrf';

export async function GET(request: NextRequest) {
  return getCsrfTokenForClient(request);
}
