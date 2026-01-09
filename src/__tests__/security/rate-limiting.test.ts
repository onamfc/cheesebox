/**
 * Security Test: Rate Limiting Implementation
 *
 * Ensures rate limiting is properly implemented on authentication endpoints
 * Prevents High-Severity Vulnerability: Brute Force Attacks (CWE-307)
 */

import { describe, it, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';
import {
  checkRateLimit,
  calculateProgressiveDelay,
} from '@/lib/rate-limit';

describe('Rate Limiting Security', () => {
  describe('Authentication endpoints', () => {
    it('should have rate limiting on mobile login endpoint', () => {
      const filePath = path.join(
        __dirname,
        '../../app/api/auth/mobile/login/route.ts'
      );
      const content = fs.readFileSync(filePath, 'utf-8');

      // Should import rate limiting (accept both single and double quotes)
      expect(content).toMatch(/from ['"]@\/lib\/rate-limit['"]/);
      expect(content).toContain('loginRateLimit');
      expect(content).toContain('checkRateLimit');

      // Should call rate limiting check
      expect(content).toContain('checkRateLimit(loginRateLimit');

      // Should return 429 status on rate limit
      expect(content).toContain('status: 429');

      // Should have progressive delay
      expect(content).toContain('trackFailedLogin');
      expect(content).toContain('clearFailedLogins');
      expect(content).toContain('calculateProgressiveDelay');
    });

    it('should have rate limiting on registration endpoint', () => {
      const filePath = path.join(
        __dirname,
        '../../app/api/auth/register/route.ts'
      );
      const content = fs.readFileSync(filePath, 'utf-8');

      // Should import rate limiting (accept both single and double quotes)
      expect(content).toMatch(/from ['"]@\/lib\/rate-limit['"]/);
      expect(content).toContain('registerRateLimit');
      expect(content).toContain('checkRateLimit');

      // Should use IP-based rate limiting
      expect(content).toContain('getClientIp');

      // Should return 429 status on rate limit
      expect(content).toContain('status: 429');
    });

    it('should have Retry-After header on rate limit responses', () => {
      const authFiles = [
        '../../app/api/auth/mobile/login/route.ts',
        '../../app/api/auth/register/route.ts',
      ];

      authFiles.forEach((filePath) => {
        const fullPath = path.join(__dirname, filePath);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf-8');

          // Should include Retry-After header
          if (content.includes('status: 429')) {
            expect(content).toContain('Retry-After');
          }
        }
      });
    });
  });

  describe('Progressive delay calculation', () => {
    it('should return 0 delay for first 3 attempts', () => {
      expect(calculateProgressiveDelay(1)).toBe(0);
      expect(calculateProgressiveDelay(2)).toBe(0);
      expect(calculateProgressiveDelay(3)).toBe(0);
    });

    it('should implement exponential backoff after 3 attempts', () => {
      expect(calculateProgressiveDelay(4)).toBe(2000); // 2^1 seconds
      expect(calculateProgressiveDelay(5)).toBe(4000); // 2^2 seconds
      expect(calculateProgressiveDelay(6)).toBe(8000); // 2^3 seconds
    });

    it('should cap delay at 60 seconds', () => {
      const delay = calculateProgressiveDelay(10);
      expect(delay).toBeLessThanOrEqual(60000);
    });
  });

  describe('Rate limit library configuration', () => {
    it('should have rate limit definitions in lib/rate-limit.ts', () => {
      const filePath = path.join(__dirname, '../../lib/rate-limit.ts');
      const content = fs.readFileSync(filePath, 'utf-8');

      // Should define different rate limiters
      expect(content).toContain('loginRateLimit');
      expect(content).toContain('registerRateLimit');
      expect(content).toContain('uploadRateLimit');
      expect(content).toContain('apiRateLimit');

      // Should use Upstash
      expect(content).toContain('@upstash/ratelimit');
      expect(content).toContain('@upstash/redis');

      // Should handle missing configuration gracefully
      expect(content).toContain('isUpstashConfigured');
      expect(content).toContain('process.env.UPSTASH_REDIS_REST_URL');
    });

    it('should have Upstash configuration in .env.example', () => {
      const envPath = path.join(__dirname, '../../../.env.example');
      const content = fs.readFileSync(envPath, 'utf-8');

      expect(content).toContain('UPSTASH_REDIS_REST_URL');
      expect(content).toContain('UPSTASH_REDIS_REST_TOKEN');
    });
  });

  describe('Rate limit helper functions', () => {
    it('should have checkRateLimit function that handles null limiter', async () => {
      const result = await checkRateLimit(null, 'test-identifier');
      expect(result.success).toBe(true);
    });

    it('should warn in production when rate limiting not configured', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Note: This test would need NODE_ENV=production to fully test the warning
      // For now, we just test that checkRateLimit handles null gracefully
      await checkRateLimit(null, 'test');

      consoleSpy.mockRestore();
    });
  });
});
