/**
 * Security utilities for validating file paths in streaming endpoints
 * Prevents path traversal attacks (CWE-22)
 */

const VALID_FILE_EXTENSIONS = ['.m3u8', '.ts'];
const MAX_PATH_LENGTH = 200;
const SAFE_FILENAME_PATTERN = /^[a-zA-Z0-9_-]+\.(m3u8|ts)$/;

export interface PathValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates streaming path segments to prevent path traversal attacks
 *
 * @param pathSegments - Array of path segments from URL
 * @returns PathValidationResult with validation status and optional error message
 */
export function validateStreamingPath(pathSegments: string[]): PathValidationResult {
  // Check if path exists
  if (!pathSegments || pathSegments.length === 0) {
    return { isValid: false, error: 'Path is empty' };
  }

  // Check for undefined or empty segments
  if (pathSegments.some(segment => !segment || segment === 'undefined' || segment === '')) {
    return { isValid: false, error: 'Invalid path segment' };
  }

  const fullPath = pathSegments.join('/');

  // Check total path length
  if (fullPath.length > MAX_PATH_LENGTH) {
    return { isValid: false, error: 'Path too long' };
  }

  // Validate each segment
  for (const segment of pathSegments) {
    // Check for path traversal attempts
    if (segment.includes('..')) {
      return { isValid: false, error: 'Path traversal not allowed' };
    }

    // Check for absolute paths
    if (segment.startsWith('/') || segment.startsWith('\\')) {
      return { isValid: false, error: 'Absolute paths not allowed' };
    }

    // Check for null bytes
    if (segment.includes('\0')) {
      return { isValid: false, error: 'Null bytes not allowed' };
    }

    // Check for backslashes (Windows path separators)
    if (segment.includes('\\')) {
      return { isValid: false, error: 'Backslashes not allowed' };
    }

    // Validate character set (alphanumeric, dash, underscore, dot only)
    if (!/^[a-zA-Z0-9._-]+$/.test(segment)) {
      return { isValid: false, error: 'Invalid characters in path' };
    }
  }

  // Ensure path ends with valid file extension
  const hasValidExtension = VALID_FILE_EXTENSIONS.some(ext => fullPath.endsWith(ext));
  if (!hasValidExtension) {
    return { isValid: false, error: 'Invalid file extension' };
  }

  return { isValid: true };
}

/**
 * Normalizes and validates that the constructed S3 key stays within the manifest directory
 *
 * @param manifestDir - Base directory containing the HLS manifest
 * @param requestedPath - User-provided path to validate
 * @returns Validated S3 key or null if invalid
 */
export function validateS3Key(manifestDir: string, requestedPath: string): string | null {
  const path = require('path');

  // Normalize paths to prevent traversal
  const normalizedManifestDir = path.normalize(manifestDir);
  const normalizedPath = path.normalize(path.join('/', requestedPath));
  const fullPath = path.normalize(path.join(manifestDir, requestedPath));

  // Ensure the final path starts with the manifest directory
  if (!fullPath.startsWith(normalizedManifestDir)) {
    return null;
  }

  // Ensure path doesn't escape the manifest directory
  const relativePath = path.relative(normalizedManifestDir, fullPath);
  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    return null;
  }

  return fullPath;
}
