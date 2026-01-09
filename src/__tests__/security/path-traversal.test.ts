/**
 * Security Test: Path Traversal Prevention
 *
 * Ensures streaming endpoints properly validate paths
 * Prevents High-Severity Vulnerability: Path Traversal (CWE-22)
 */

import { describe, it, expect } from '@jest/globals';
import { validateStreamingPath, validateS3Key } from '@/lib/path-validation';

describe('Path Traversal Prevention', () => {
  describe('validateStreamingPath', () => {
    it('should reject path traversal attempts with ..', () => {
      const result = validateStreamingPath(['..', 'other-video', 'manifest.m3u8']);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('traversal');
    });

    it('should reject paths with null bytes', () => {
      const result = validateStreamingPath(['video\0.m3u8']);
      expect(result.isValid).toBe(false);
    });

    it('should reject absolute paths', () => {
      const result = validateStreamingPath(['/etc/passwd']);
      expect(result.isValid).toBe(false);
    });

    it('should reject paths with backslashes', () => {
      const result = validateStreamingPath(['..\\..\\other-video\\manifest.m3u8']);
      expect(result.isValid).toBe(false);
    });

    it('should reject paths without valid file extensions', () => {
      const result = validateStreamingPath(['malicious-file.exe']);
      expect(result.isValid).toBe(false);
    });

    it('should reject empty or undefined paths', () => {
      expect(validateStreamingPath([]).isValid).toBe(false);
      expect(validateStreamingPath(['undefined']).isValid).toBe(false);
      expect(validateStreamingPath(['']).isValid).toBe(false);
    });

    it('should accept valid HLS manifest paths', () => {
      const result = validateStreamingPath(['manifest.m3u8']);
      expect(result.isValid).toBe(true);
    });

    it('should accept valid HLS segment paths', () => {
      const result = validateStreamingPath(['segment_001.ts']);
      expect(result.isValid).toBe(true);
    });

    it('should accept valid multi-segment paths', () => {
      const result = validateStreamingPath(['720p', 'segment_001.ts']);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateS3Key', () => {
    const manifestDir = 'videos/user123/video456-hls/';

    it('should reject paths that escape the manifest directory', () => {
      const result = validateS3Key(manifestDir, '../../../etc/passwd');
      expect(result).toBeNull();
    });

    it('should reject paths with traversal sequences', () => {
      const result = validateS3Key(manifestDir, '../../other-user/video.m3u8');
      expect(result).toBeNull();
    });

    it('should accept valid paths within manifest directory', () => {
      const result = validateS3Key(manifestDir, 'manifest.m3u8');
      expect(result).not.toBeNull();
      expect(result).toContain(manifestDir);
    });

    it('should normalize paths and validate correctly', () => {
      const result = validateS3Key(manifestDir, './segment_001.ts');
      expect(result).not.toBeNull();
    });
  });

  describe('Streaming endpoint integration', () => {
    it('should use path validation in streaming endpoints', () => {
      const fs = require('fs');
      const path = require('path');

      const streamingFiles = [
        path.join(__dirname, '../../app/api/videos/[id]/stream/[...path]/route.ts'),
        path.join(__dirname, '../../app/api/embed/[videoId]/stream/[...path]/route.ts'),
      ];

      streamingFiles.forEach((filePath) => {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8');

          // Should import validation functions
          expect(content).toContain('validateStreamingPath');
          expect(content).toContain('validateS3Key');

          // Should call validation before processing
          expect(content).toContain('validateStreamingPath(path)');
          expect(content).toContain('validateS3Key(');
        }
      });
    });
  });
});
