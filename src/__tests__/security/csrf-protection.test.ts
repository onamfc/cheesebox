/**
 * Security Test: CSRF Protection
 *
 * Ensures CSRF protection is properly implemented
 * Prevents High-Severity Vulnerability: Cross-Site Request Forgery (CWE-352)
 */

import { describe, it, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';
import {
  generateCsrfToken,
  validateCsrfToken,
  requiresCsrfValidation,
} from '@/lib/csrf';
import { NextRequest } from 'next/server';

describe('CSRF Protection Security', () => {
  describe('CSRF proxy implementation', () => {
    it('should have proxy.ts file (Next.js 16 middleware)', () => {
      const proxyPath = path.join(__dirname, '../../proxy.ts');
      expect(fs.existsSync(proxyPath)).toBe(true);
    });

    it('should implement CSRF validation in proxy', () => {
      const proxyPath = path.join(__dirname, '../../proxy.ts');
      const content = fs.readFileSync(proxyPath, 'utf-8');

      // Should import CSRF functions
      expect(content).toContain('csrf');
      expect(content).toContain('requiresCsrfValidation');
      expect(content).toContain('validateCsrfToken');

      // Should validate CSRF for API routes
      expect(content).toContain('/api/');
    });

    it('should have CSRF library implementation', () => {
      const csrfPath = path.join(__dirname, '../../lib/csrf.ts');
      expect(fs.existsSync(csrfPath)).toBe(true);

      const content = fs.readFileSync(csrfPath, 'utf-8');

      // Should have key functions
      expect(content).toContain('generateCsrfToken');
      expect(content).toContain('validateCsrfToken');
      expect(content).toContain('requiresCsrfValidation');
      expect(content).toContain('setCsrfTokenCookie');
    });

    it('should have CSRF token endpoint', () => {
      const tokenPath = path.join(__dirname, '../../app/api/csrf-token/route.ts');
      expect(fs.existsSync(tokenPath)).toBe(true);
    });

    it('should have client-side CSRF utilities', () => {
      const clientPath = path.join(__dirname, '../../lib/csrf-client.ts');
      expect(fs.existsSync(clientPath)).toBe(true);

      const content = fs.readFileSync(clientPath, 'utf-8');

      // Should have client utilities
      expect(content).toContain('fetchCsrfToken');
      expect(content).toContain('fetchWithCsrf');
      expect(content).toContain('getCsrfHeaders');
    });
  });

  describe('CSRF token generation', () => {
    it('should generate unique tokens', () => {
      const token1 = generateCsrfToken();
      const token2 = generateCsrfToken();

      expect(token1).not.toBe(token2);
      expect(token1.length).toBeGreaterThan(0);
      expect(token2.length).toBeGreaterThan(0);
    });

    it('should generate cryptographically secure tokens', () => {
      const token = generateCsrfToken();

      // Should be hex string
      expect(/^[a-f0-9]+$/.test(token)).toBe(true);

      // Should be at least 32 bytes (64 hex chars)
      expect(token.length).toBeGreaterThanOrEqual(64);
    });
  });

  describe('CSRF validation requirements', () => {
    it('should require validation for POST requests to API', () => {
      const request = new NextRequest('http://localhost:3000/api/videos', {
        method: 'POST',
      });

      expect(requiresCsrfValidation(request)).toBe(true);
    });

    it('should require validation for PUT requests to API', () => {
      const request = new NextRequest('http://localhost:3000/api/videos/123', {
        method: 'PUT',
      });

      expect(requiresCsrfValidation(request)).toBe(true);
    });

    it('should require validation for PATCH requests to API', () => {
      const request = new NextRequest('http://localhost:3000/api/videos/123', {
        method: 'PATCH',
      });

      expect(requiresCsrfValidation(request)).toBe(true);
    });

    it('should require validation for DELETE requests to API', () => {
      const request = new NextRequest('http://localhost:3000/api/videos/123', {
        method: 'DELETE',
      });

      expect(requiresCsrfValidation(request)).toBe(true);
    });

    it('should NOT require validation for GET requests', () => {
      const request = new NextRequest('http://localhost:3000/api/videos', {
        method: 'GET',
      });

      expect(requiresCsrfValidation(request)).toBe(false);
    });

    it('should NOT require validation for HEAD requests', () => {
      const request = new NextRequest('http://localhost:3000/api/videos', {
        method: 'HEAD',
      });

      expect(requiresCsrfValidation(request)).toBe(false);
    });

    it('should NOT require validation for OPTIONS requests', () => {
      const request = new NextRequest('http://localhost:3000/api/videos', {
        method: 'OPTIONS',
      });

      expect(requiresCsrfValidation(request)).toBe(false);
    });

    it('should exempt mobile authentication endpoints', () => {
      const mobileLoginRequest = new NextRequest(
        'http://localhost:3000/api/auth/mobile/login',
        { method: 'POST' }
      );

      expect(requiresCsrfValidation(mobileLoginRequest)).toBe(false);
    });
  });

  describe('Configuration', () => {
    it('should have CSRF_SECRET in .env.example', () => {
      const envPath = path.join(__dirname, '../../../.env.example');
      const content = fs.readFileSync(envPath, 'utf-8');

      expect(content).toContain('CSRF_SECRET');
      expect(content).toMatch(/openssl rand -base64 32/i);
    });

    it('should use CSRF_SECRET from environment', () => {
      const csrfPath = path.join(__dirname, '../../lib/csrf.ts');
      const content = fs.readFileSync(csrfPath, 'utf-8');

      expect(content).toContain('process.env.CSRF_SECRET');
    });
  });

  describe('Security properties', () => {
    it('should use httpOnly cookies', () => {
      const csrfPath = path.join(__dirname, '../../lib/csrf.ts');
      const content = fs.readFileSync(csrfPath, 'utf-8');

      expect(content).toContain('httpOnly: true');
    });

    it('should use secure cookies in production', () => {
      const csrfPath = path.join(__dirname, '../../lib/csrf.ts');
      const content = fs.readFileSync(csrfPath, 'utf-8');

      expect(content).toContain("process.env.NODE_ENV === 'production'");
    });

    it('should use SameSite cookie attribute', () => {
      const csrfPath = path.join(__dirname, '../../lib/csrf.ts');
      const content = fs.readFileSync(csrfPath, 'utf-8');

      expect(content).toContain('sameSite');
    });

    it('should use __Host- prefix for cookie name', () => {
      const csrfPath = path.join(__dirname, '../../lib/csrf.ts');
      const content = fs.readFileSync(csrfPath, 'utf-8');

      // __Host- prefix requires secure, path=/, no domain
      expect(content).toContain('__Host-');
    });

    it('should validate token from custom header', () => {
      const csrfPath = path.join(__dirname, '../../lib/csrf.ts');
      const content = fs.readFileSync(csrfPath, 'utf-8');

      expect(content).toContain('x-csrf-token');
    });

    it('should log CSRF validation failures', () => {
      const csrfPath = path.join(__dirname, '../../lib/csrf.ts');
      const content = fs.readFileSync(csrfPath, 'utf-8');

      expect(content).toContain('console.warn');
      expect(content).toMatch(/CSRF.*fail/i);
    });
  });

  describe('Client-side integration', () => {
    it('should provide fetchWithCsrf utility', () => {
      const clientPath = path.join(__dirname, '../../lib/csrf-client.ts');
      const content = fs.readFileSync(clientPath, 'utf-8');

      // Should be a drop-in fetch replacement
      expect(content).toContain('export async function fetchWithCsrf');
      expect(content).toContain('x-csrf-token');
    });

    it('should handle CSRF errors by clearing cache', () => {
      const clientPath = path.join(__dirname, '../../lib/csrf-client.ts');
      const content = fs.readFileSync(clientPath, 'utf-8');

      expect(content).toContain('clearCsrfToken');
      expect(content).toContain('403');
    });

    it('should cache tokens to reduce server requests', () => {
      const clientPath = path.join(__dirname, '../../lib/csrf-client.ts');
      const content = fs.readFileSync(clientPath, 'utf-8');

      expect(content).toContain('cachedToken');
    });
  });

  describe('Double-submit cookie pattern', () => {
    it('should implement double-submit pattern', () => {
      const csrfPath = path.join(__dirname, '../../lib/csrf.ts');
      const content = fs.readFileSync(csrfPath, 'utf-8');

      // Should check both cookie and header
      expect(content).toContain('cookieToken');
      expect(content).toContain('headerToken');

      // Should compare them
      expect(content).toMatch(/cookieToken.*headerToken|headerToken.*cookieToken/);
    });

    it('should use timing-safe comparison', () => {
      const csrfPath = path.join(__dirname, '../../lib/csrf.ts');
      const content = fs.readFileSync(csrfPath, 'utf-8');

      // Should hash tokens before comparison (prevents timing attacks)
      expect(content).toContain('hashToken');
      // Should use Web Crypto API (Edge Runtime compatible)
      expect(content).toContain('crypto.subtle.digest');
    });
  });
});
