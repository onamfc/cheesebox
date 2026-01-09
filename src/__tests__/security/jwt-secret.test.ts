/**
 * Security Test: JWT Secret Configuration
 *
 * Ensures that JWT secrets are properly configured and not hardcoded
 * Prevents Critical Vulnerability: Authentication Bypass (CWE-798)
 */

import { describe, it, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

describe('JWT Secret Security', () => {
  it('should not contain hardcoded JWT secret fallback values in jwt.ts', () => {
    const jwtFilePath = path.join(__dirname, '../../lib/jwt.ts');
    const content = fs.readFileSync(jwtFilePath, 'utf-8');

    // Check for dangerous patterns
    const dangerousPatterns = [
      /JWT_SECRET.*\|\|.*['"`]/,
      /JWT_SECRET.*=.*['"`]your-/,
      /JWT_SECRET.*=.*['"`]secret/,
      /JWT_SECRET.*=.*['"`]change-/,
    ];

    dangerousPatterns.forEach((pattern) => {
      expect(content).not.toMatch(pattern);
    });

    // Should have validation check
    expect(content).toContain('if (!process.env.JWT_SECRET)');
    expect(content).toContain('throw new Error');
  });

  it('should not contain hardcoded JWT secrets in streaming endpoints', () => {
    const streamingPaths = [
      '../../app/api/videos/[id]/stream/[...path]/route.ts',
      '../../app/api/videos/[id]/streaming-token/route.ts',
    ];

    streamingPaths.forEach((filePath) => {
      const fullPath = path.join(__dirname, filePath);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf-8');

        // Should not define JWT_SECRET locally with fallback
        expect(content).not.toMatch(/const JWT_SECRET.*\|\|/);
        expect(content).not.toMatch(/JWT_SECRET.*=.*['"`]your-/);

        // Should import from centralized location
        if (content.includes('JWT_SECRET')) {
          expect(content).toContain('import');
          expect(content).toContain('@/lib/jwt');
        }
      }
    });
  });

  it('should have JWT_SECRET in .env.example with clear instructions', () => {
    const envExamplePath = path.join(__dirname, '../../../.env.example');
    const content = fs.readFileSync(envExamplePath, 'utf-8');

    expect(content).toContain('JWT_SECRET');
    expect(content).toMatch(/openssl rand -base64 64/i);
    expect(content).toMatch(/REQUIRED|CRITICAL/i);
  });
});
