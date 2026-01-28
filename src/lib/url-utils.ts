/**
 * URL utilities for consistent URL construction across the application
 */

/**
 * Get the application base URL
 * - Client-side: Uses window.location.origin
 * - Server-side: Uses NEXT_PUBLIC_APP_URL environment variable
 */
export function getAppBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || "";
}

/**
 * Get the embed URL for a video
 * @param videoId - The video ID
 * @param baseUrl - Optional base URL override (useful for server-side with custom domains)
 */
export function getEmbedUrl(videoId: string, baseUrl?: string): string {
  const origin = baseUrl ?? getAppBaseUrl();
  return `${origin}/embed/${videoId}`;
}
