/**
 * Client-side CSRF Token Utilities
 *
 * Use these functions to include CSRF tokens in your API requests
 */

'use client';

let cachedToken: string | null = null;

/**
 * Fetch CSRF token from the server
 */
export async function fetchCsrfToken(): Promise<string> {
  if (cachedToken) {
    return cachedToken;
  }

  try {
    const response = await fetch('/api/csrf-token');
    const data = await response.json();

    if (data.csrfToken && typeof data.csrfToken === 'string') {
      cachedToken = data.csrfToken;
      return data.csrfToken;
    }

    throw new Error('No CSRF token in response');
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    throw error;
  }
}

/**
 * Clear cached CSRF token (call if you get 403 CSRF error)
 */
export function clearCsrfToken(): void {
  cachedToken = null;
}

/**
 * Fetch with CSRF protection
 *
 * Drop-in replacement for fetch() that automatically includes CSRF token
 *
 * @example
 * ```typescript
 * const response = await fetchWithCsrf('/api/videos', {
 *   method: 'POST',
 *   body: JSON.stringify({ title: 'My Video' }),
 * });
 * ```
 */
export async function fetchWithCsrf(
  url: string | URL,
  options?: RequestInit
): Promise<Response> {
  const method = options?.method?.toUpperCase() || 'GET';

  // Only add CSRF token for state-changing methods
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const token = await fetchCsrfToken();

    const headers = new Headers(options?.headers);
    headers.set('x-csrf-token', token);
    headers.set('Content-Type', headers.get('Content-Type') || 'application/json');

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If we get CSRF error, clear cache and let caller retry
    if (response.status === 403) {
      const data = await response.json().catch(() => ({}));
      if (data.error?.includes('CSRF')) {
        clearCsrfToken();
      }
    }

    return response;
  }

  // For GET requests, just pass through
  return fetch(url, options);
}

/**
 * Get CSRF token as header object
 *
 * Useful for custom fetch implementations or libraries
 *
 * @example
 * ```typescript
 * const headers = await getCsrfHeaders();
 * const response = await fetch('/api/videos', {
 *   method: 'POST',
 *   headers: {
 *     ...headers,
 *     'Content-Type': 'application/json',
 *   },
 *   body: JSON.stringify(data),
 * });
 * ```
 */
export async function getCsrfHeaders(): Promise<Record<string, string>> {
  const token = await fetchCsrfToken();
  return {
    'x-csrf-token': token,
  };
}

/**
 * React hook for using CSRF token
 *
 * NOTE: This hook requires React to be installed and imported in your component.
 * For Next.js, use fetchWithCsrf() or getCsrfHeaders() directly instead.
 *
 * @example
 * ```typescript
 * import { useState, useEffect } from 'react';
 * import { fetchCsrfToken } from '@/lib/csrf-client';
 *
 * function MyComponent() {
 *   const [csrfToken, setCsrfToken] = useState<string | null>(null);
 *
 *   useEffect(() => {
 *     fetchCsrfToken().then(setCsrfToken).catch(console.error);
 *   }, []);
 *
 *   const handleSubmit = async () => {
 *     const response = await fetch('/api/videos', {
 *       method: 'POST',
 *       headers: {
 *         'x-csrf-token': csrfToken!,
 *         'Content-Type': 'application/json',
 *       },
 *       body: JSON.stringify(data),
 *     });
 *   };
 * }
 * ```
 */
