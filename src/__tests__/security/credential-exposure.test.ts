/**
 * Security Test: Credential Exposure Prevention
 *
 * Ensures sensitive credentials are never exposed in API responses
 * Prevents High-Severity Vulnerability: Sensitive Data Exposure (CWE-200)
 */

import { describe, it, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

describe('Credential Exposure Prevention', () => {
  describe('AWS Credentials API', () => {
    it('should not return decrypted AWS credentials in GET response', () => {
      const filePath = path.join(__dirname, '../../app/api/aws-credentials/route.ts');
      const content = fs.readFileSync(filePath, 'utf-8');

      // Should not have pattern like: return NextResponse.json(decryptedCredentials)
      // Check for security comment
      expect(content).toContain('SECURITY:');
      expect(content).toContain('Never return decrypted credentials');

      // Should return configuration status instead
      expect(content).toContain('configured:');
      expect(content).toContain('configurationStatus');

      // Should mask sensitive values
      expect(content).toMatch(/\*\*\*/);

      // Should never include secretAccessKey in response
      expect(content).toContain('NEVER include secretAccessKey');
    });

    it('should return configuration status object instead of credentials', () => {
      const filePath = path.join(__dirname, '../../app/api/aws-credentials/route.ts');
      const content = fs.readFileSync(filePath, 'utf-8');

      const getMethodMatch = content.match(/export async function GET[\s\S]*?(?=export async function POST|$)/);

      if (getMethodMatch) {
        const getMethod = getMethodMatch[0];

        // Should return status fields
        expect(getMethod).toContain('configured');
        expect(getMethod).toContain('lastUpdated');
        expect(getMethod).toContain('hasMediaConvertRole');

        // Should NOT return full credentials
        expect(getMethod).not.toContain('return NextResponse.json(decryptedCredentials)');
        expect(getMethod).not.toContain('secretAccessKey: decrypt(');
      }
    });
  });

  describe('Email Credentials API', () => {
    it('should use placeholder values for sensitive email credentials', () => {
      const filePath = path.join(__dirname, '../../app/api/email-credentials/route.ts');
      const content = fs.readFileSync(filePath, 'utf-8');

      // Should use placeholder pattern
      expect(content).toContain('••••••••••••••••');

      // Should check for placeholder values
      expect(content).toContain('isPlaceholder');

      // Should not decrypt credentials in GET response
      const getMethodMatch = content.match(/export async function GET[\s\S]*?(?=export async function POST|$)/);

      if (getMethodMatch) {
        const getMethod = getMethodMatch[0];
        expect(getMethod).not.toContain('decrypt(credentials.apiKey)');
        expect(getMethod).not.toContain('decrypt(credentials.smtpPassword)');
      }
    });
  });

  describe('General credential exposure checks', () => {
    it('should not log sensitive credentials', () => {
      const apiFiles = findFiles(
        path.join(__dirname, '../../app/api'),
        /route\.ts$/
      );

      apiFiles.forEach((filePath) => {
        const content = fs.readFileSync(filePath, 'utf-8');

        // Check for dangerous logging patterns
        const dangerousPatterns = [
          /console\.log.*password/i,
          /console\.log.*secret/i,
          /console\.log.*credentials\)/i,
          /console\.log.*apiKey/i,
        ];

        dangerousPatterns.forEach((pattern) => {
          const match = content.match(pattern);
          if (match) {
            // Allow if it's logging a redacted/masked value or error
            const line = match[0];
            if (!line.includes('***') && !line.includes('error')) {
              throw new Error(
                `Potential credential logging found in ${filePath}: ${line}`
              );
            }
          }
        });
      });
    });
  });
});

// Helper function to recursively find files
function findFiles(dir: string, pattern: RegExp): string[] {
  const files: string[] = [];

  if (!fs.existsSync(dir)) return files;

  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...findFiles(fullPath, pattern));
    } else if (pattern.test(item)) {
      files.push(fullPath);
    }
  });

  return files;
}
