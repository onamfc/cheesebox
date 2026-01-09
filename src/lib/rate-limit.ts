/**
 * Rate limiting utilities using Upstash Redis
 * Protects against brute force, credential stuffing, and DoS attacks
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Check if Upstash is configured
const isUpstashConfigured = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

// Create Redis client only if configured
const redis = isUpstashConfigured
  ? Redis.fromEnv()
  : null;

/**
 * Rate limiter for login attempts
 * Limits: 5 attempts per 15 minutes per email
 */
export const loginRateLimit = isUpstashConfigured && redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "15 m"),
      analytics: true,
      prefix: "ratelimit:login",
    })
  : null;

/**
 * Rate limiter for registration attempts
 * Limits: 3 registrations per hour per IP
 */
export const registerRateLimit = isUpstashConfigured && redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      analytics: true,
      prefix: "ratelimit:register",
    })
  : null;

/**
 * Rate limiter for video uploads
 * Limits: 10 uploads per hour per user
 */
export const uploadRateLimit = isUpstashConfigured && redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 h"),
      analytics: true,
      prefix: "ratelimit:upload",
    })
  : null;

/**
 * Rate limiter for general API calls
 * Limits: 100 requests per minute per IP
 */
export const apiRateLimit = isUpstashConfigured && redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "1 m"),
      analytics: true,
      prefix: "ratelimit:api",
    })
  : null;

/**
 * Rate limiter for embed endpoint access
 * Limits: 60 requests per minute per IP (to prevent enumeration)
 */
export const embedRateLimit = isUpstashConfigured && redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, "1 m"),
      analytics: true,
      prefix: "ratelimit:embed",
    })
  : null;

/**
 * Helper function to apply rate limiting
 * Returns true if request should be allowed, false if rate limited
 */
export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<{ success: boolean; limit?: number; remaining?: number; reset?: number }> {
  // If rate limiting not configured, allow the request but log warning
  if (!limiter) {
    if (process.env.NODE_ENV === "production") {
      console.warn("Rate limiting not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN for production.");
    }
    return { success: true };
  }

  const result = await limiter.limit(identifier);

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}

/**
 * Track failed login attempts for progressive delays
 * This adds an additional layer of protection beyond rate limiting
 */
export async function trackFailedLogin(email: string): Promise<number> {
  if (!redis) return 0;

  const key = `login_failures:${email.toLowerCase()}`;
  const attempts = await redis.incr(key);

  // Set expiry on first failure (15 minutes)
  if (attempts === 1) {
    await redis.expire(key, 900);
  }

  return attempts;
}

/**
 * Clear failed login attempts on successful login
 */
export async function clearFailedLogins(email: string): Promise<void> {
  if (!redis) return;

  const key = `login_failures:${email.toLowerCase()}`;
  await redis.del(key);
}

/**
 * Calculate progressive delay based on failed attempts
 * Returns delay in milliseconds
 */
export function calculateProgressiveDelay(attempts: number): number {
  if (attempts <= 3) return 0;

  // Exponential backoff: 2^(attempts - 3) seconds, max 60 seconds
  const delaySeconds = Math.min(Math.pow(2, attempts - 3), 60);
  return delaySeconds * 1000;
}

/**
 * Get client IP address from request
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0] ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
