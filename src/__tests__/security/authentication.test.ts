/**
 * Security Test: Authentication Security
 *
 * Ensures authentication mechanisms are secure
 * Prevents various authentication-related vulnerabilities
 */

import { describe, it, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

describe('Authentication Security', () => {
  describe('User enumeration prevention', () => {
    it('should use generic error messages in registration', () => {
      const filePath = path.join(__dirname, '../../app/api/auth/register/route.ts');
      const content = fs.readFileSync(filePath, 'utf-8');

      // Should not reveal if email exists
      if (content.includes('existingUser')) {
        expect(content).toContain('Unable to complete registration');
        expect(content).not.toContain('email already exists');
      }
    });

    it('should use consistent error messages in login', () => {
      const filePath = path.join(
        __dirname,
        '../../app/api/auth/mobile/login/route.ts'
      );
      const content = fs.readFileSync(filePath, 'utf-8');

      // Should use same error for invalid email and invalid password
      const errorMessages = content.match(/'Invalid email or password'/g);
      expect(errorMessages).not.toBeNull();
      expect(errorMessages!.length).toBeGreaterThan(1);
    });
  });

  describe('Password security', () => {
    it('should use bcrypt for password hashing', () => {
      const registerPath = path.join(__dirname, '../../app/api/auth/register/route.ts');
      const registerContent = fs.readFileSync(registerPath, 'utf-8');

      expect(registerContent).toContain('import { hash } from "bcryptjs"');
      expect(registerContent).toContain('await hash(password, 12)');
    });

    it('should have minimum password length requirement', () => {
      const registerPath = path.join(__dirname, '../../app/api/auth/register/route.ts');
      const registerContent = fs.readFileSync(registerPath, 'utf-8');

      expect(registerContent).toContain('.min(8');
      expect(registerContent).toContain('Password must be at least 8 characters');
    });

    it('should use constant-time comparison for password verification', () => {
      const loginPath = path.join(
        __dirname,
        '../../app/api/auth/mobile/login/route.ts'
      );
      const loginContent = fs.readFileSync(loginPath, 'utf-8');

      // Should use bcrypt.compare which is constant-time
      expect(loginContent).toContain('compare(password, user.passwordHash)');
    });
  });

  describe('JWT token security', () => {
    it('should have appropriate JWT expiry', () => {
      const jwtPath = path.join(__dirname, '../../lib/jwt.ts');
      const content = fs.readFileSync(jwtPath, 'utf-8');

      // Should have expiry defined
      expect(content).toContain('JWT_EXPIRES_IN');
      expect(content).toContain('expiresIn');

      // Should not be excessive (more than 90 days)
      expect(content).not.toContain("'180d'");
      expect(content).not.toContain("'365d'");
    });

    it('should include user identifier in JWT payload', () => {
      const jwtPath = path.join(__dirname, '../../lib/jwt.ts');
      const content = fs.readFileSync(jwtPath, 'utf-8');

      // Should have userId and email in payload interface
      expect(content).toContain('userId');
      expect(content).toContain('email');
    });
  });

  describe('Session security', () => {
    it('should have secure NextAuth configuration', () => {
      const authPath = path.join(__dirname, '../../lib/auth.ts');
      if (fs.existsSync(authPath)) {
        const content = fs.readFileSync(authPath, 'utf-8');

        // Should use JWT strategy
        expect(content).toMatch(/strategy.*jwt|jwt.*strategy/i);

        // Should have secret configured
        expect(content).toContain('NEXTAUTH_SECRET');
      }
    });

    it('should require NEXTAUTH_SECRET in environment', () => {
      const envPath = path.join(__dirname, '../../../.env.example');
      const content = fs.readFileSync(envPath, 'utf-8');

      expect(content).toContain('NEXTAUTH_SECRET');
      expect(content).toMatch(/openssl rand/);
    });
  });

  describe('Authorization checks', () => {
    it('should verify user authentication in protected endpoints', () => {
      const protectedEndpoints = [
        '../../app/api/videos/upload/route.ts',
        '../../app/api/aws-credentials/route.ts',
        '../../app/api/videos/[id]/streaming-token/route.ts',
      ];

      protectedEndpoints.forEach((endpoint) => {
        const fullPath = path.join(__dirname, endpoint);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf-8');

          // Should check for user/session
          const hasAuthCheck =
            content.includes('getAuthUser') ||
            content.includes('getServerSession') ||
            content.includes('session?.user');

          expect(hasAuthCheck).toBe(true);

          // Should return 401 Unauthorized
          if (hasAuthCheck) {
            expect(content).toContain('401');
            expect(content).toMatch(/Unauthorized|Unauthenticated/i);
          }
        }
      });
    });

    it('should check resource ownership before allowing access', () => {
      const tokenPath = path.join(
        __dirname,
        '../../app/api/videos/[id]/streaming-token/route.ts'
      );
      const content = fs.readFileSync(tokenPath, 'utf-8');

      // Should check multiple access methods
      expect(content).toContain('isOwner');
      expect(content).toContain('isSharedWith');
      expect(content).toContain('isTeamMember');
      expect(content).toContain('isGroupMember');

      // Should return 403 Forbidden on access denial
      expect(content).toContain('403');
      expect(content).toContain('Access denied');
    });
  });
});
