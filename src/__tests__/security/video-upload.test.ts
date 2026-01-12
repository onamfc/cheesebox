/**
 * Security Test: Video Upload with Direct S3 Upload
 *
 * Ensures video upload functionality is secure and properly configured
 * Tests presigned URL generation, CORS settings, and file size validation
 */

import { describe, it, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

describe('Video Upload Security', () => {
  describe('Direct S3 Upload Architecture', () => {
    it('should have upload-url endpoint for presigned URL generation', () => {
      const uploadUrlPath = path.join(
        __dirname,
        '../../app/api/videos/upload-url/route.ts'
      );
      expect(fs.existsSync(uploadUrlPath)).toBe(true);

      const content = fs.readFileSync(uploadUrlPath, 'utf-8');

      // Should validate file size
      expect(content).toContain('fileSize');
      expect(content).toMatch(/5.*1024.*1024.*1024/); // 5GB limit

      // Should generate presigned URL
      expect(content).toContain('getSignedUrl');
      expect(content).toContain('PutObjectCommand');

      // Should validate file type
      expect(content).toContain('fileType');
      expect(content).toMatch(/video\/mp4|video\/quicktime/);
    });

    it('should have complete-upload endpoint for transcoding', () => {
      const completeUploadPath = path.join(
        __dirname,
        '../../app/api/videos/complete-upload/route.ts'
      );
      expect(fs.existsSync(completeUploadPath)).toBe(true);

      const content = fs.readFileSync(completeUploadPath, 'utf-8');

      // Should verify file exists in S3
      expect(content).toContain('HeadObjectCommand');

      // Should start transcoding
      expect(content).toContain('createHLSTranscodeJob');
      expect(content).toContain('mediaConvertClient');

      // Should update video status
      expect(content).toContain('transcodingStatus');
      expect(content).toContain('PROCESSING');
    });

    it('should use VideoUpload component with CSRF protection', () => {
      const videoUploadPath = path.join(
        __dirname,
        '../../components/VideoUpload.tsx'
      );
      expect(fs.existsSync(videoUploadPath)).toBe(true);

      const content = fs.readFileSync(videoUploadPath, 'utf-8');

      // Should import fetchWithCsrf
      expect(content).toContain('fetchWithCsrf');
      expect(content).toContain('@/lib/csrf-client');

      // Should use fetchWithCsrf for upload-url
      expect(content).toContain('fetchWithCsrf("/api/videos/upload-url"');

      // Should use fetchWithCsrf for complete-upload
      expect(content).toContain('fetchWithCsrf("/api/videos/complete-upload"');

      // Should use XHR for direct S3 upload
      expect(content).toContain('XMLHttpRequest');
      expect(content).toContain('xhr.open("PUT"');
    });
  });

  describe('File Size Validation', () => {
    it('should validate file size on frontend', () => {
      const videoUploadPath = path.join(
        __dirname,
        '../../components/VideoUpload.tsx'
      );
      const content = fs.readFileSync(videoUploadPath, 'utf-8');

      // Should validate during file selection
      expect(content).toMatch(/5.*1024.*1024.*1024/); // 5GB limit
      expect(content).toContain('maxSize');

      // Should validate before upload
      expect(content).toContain('file.size > maxSize');

      // Should show error message
      expect(content).toMatch(/exceeds.*maximum/i);
    });

    it('should validate file size on backend', () => {
      const uploadUrlPath = path.join(
        __dirname,
        '../../app/api/videos/upload-url/route.ts'
      );
      const content = fs.readFileSync(uploadUrlPath, 'utf-8');

      // Should validate fileSize parameter
      expect(content).toContain('fileSize');
      expect(content).toMatch(/5.*1024.*1024.*1024/); // 5GB limit

      // Should return error for oversized files
      expect(content).toMatch(/fileSize > maxSize/);
      expect(content).toContain('status: 400');
    });

    it('should handle S3 rejection of oversized files', () => {
      const videoUploadPath = path.join(
        __dirname,
        '../../components/VideoUpload.tsx'
      );
      const content = fs.readFileSync(videoUploadPath, 'utf-8');

      // Should check for HTTP 413 (Payload Too Large)
      expect(content).toContain('413');

      // Should check for HTTP 400 from S3
      expect(content).toMatch(/xhr.status === 400.*xhr.status === 413/);

      // Should provide user feedback
      expect(content).toMatch(/Upload rejected/i);
    });
  });

  describe('CORS Configuration', () => {
    it('should include PUT method in CloudFormation CORS', () => {
      const cloudformationPath = path.join(
        __dirname,
        '../../../public/cloudformation/private-video-setup.yaml'
      );
      expect(fs.existsSync(cloudformationPath)).toBe(true);

      const content = fs.readFileSync(cloudformationPath, 'utf-8');

      // Check CORS configuration section exists
      expect(content).toContain('CorsConfiguration');
      expect(content).toContain('CorsRules');

      // Should allow PUT for presigned uploads
      expect(content).toMatch(/AllowedMethods:[\s\S]*- PUT/);

      // Should allow GET and HEAD for streaming
      expect(content).toMatch(/AllowedMethods:[\s\S]*- GET/);
      expect(content).toMatch(/AllowedMethods:[\s\S]*- HEAD/);

      // Should allow all headers (required for presigned URLs)
      expect(content).toMatch(/AllowedHeaders:[\s\S]*- '\*'/);

      // Should expose ETag header
      expect(content).toContain('- ETag');
    });

    it('should document CORS with PUT in help page', () => {
      const helpPagePath = path.join(
        __dirname,
        '../../app/help/aws-setup/page.tsx'
      );
      expect(fs.existsSync(helpPagePath)).toBe(true);

      const content = fs.readFileSync(helpPagePath, 'utf-8');

      // Should show CORS configuration
      expect(content).toContain('AllowedMethods');

      // Should include PUT method
      expect(content).toContain('"PUT"');

      // Should explain it's for uploads and streaming
      expect(content).toMatch(/upload.*stream/i);
    });

    it('should document CORS in markdown guide', () => {
      const markdownPath = path.join(
        __dirname,
        '../../../public/llms/aws-setup.md'
      );
      expect(fs.existsSync(markdownPath)).toBe(true);

      const content = fs.readFileSync(markdownPath, 'utf-8');

      // Should document CORS configuration
      expect(content).toContain('CORS');
      expect(content).toContain('AllowedMethods');

      // Should include PUT method
      expect(content).toContain('"PUT"');
    });
  });

  describe('Error Handling', () => {
    it('should provide clear error messages for common failures', () => {
      const videoUploadPath = path.join(
        __dirname,
        '../../components/VideoUpload.tsx'
      );
      const content = fs.readFileSync(videoUploadPath, 'utf-8');

      // File too large
      expect(content).toMatch(/exceeds.*maximum.*5 GB/i);

      // Upload rejected by S3
      expect(content).toMatch(/Upload rejected/i);

      // Network errors
      expect(content).toMatch(/Network error/i);

      // General upload failures
      expect(content).toMatch(/Failed to upload/i);

      // Transcoding errors
      expect(content).toMatch(/Failed to start transcoding/i);
    });

    it('should validate required fields in upload-url endpoint', () => {
      const uploadUrlPath = path.join(
        __dirname,
        '../../app/api/videos/upload-url/route.ts'
      );
      const content = fs.readFileSync(uploadUrlPath, 'utf-8');

      // Should check for required fields
      expect(content).toContain('fileName');
      expect(content).toContain('fileType');
      expect(content).toContain('fileSize');
      expect(content).toContain('title');

      // Should return 400 for missing fields
      expect(content).toMatch(/Missing required fields/i);
    });

    it('should validate required fields in complete-upload endpoint', () => {
      const completeUploadPath = path.join(
        __dirname,
        '../../app/api/videos/complete-upload/route.ts'
      );
      const content = fs.readFileSync(completeUploadPath, 'utf-8');

      // Should check for required fields
      expect(content).toContain('videoId');
      expect(content).toContain('originalKey');
      expect(content).toContain('outputKeyPrefix');

      // Should return 400 for missing fields
      expect(content).toMatch(/Missing required fields/i);
    });

    it('should verify file exists before transcoding', () => {
      const completeUploadPath = path.join(
        __dirname,
        '../../app/api/videos/complete-upload/route.ts'
      );
      const content = fs.readFileSync(completeUploadPath, 'utf-8');

      // Should use HeadObjectCommand to check file
      expect(content).toContain('HeadObjectCommand');

      // Should handle file not found
      expect(content).toMatch(/File not found/i);
      expect(content).toMatch(/Upload may have failed/i);
    });
  });

  describe('Authentication & Authorization', () => {
    it('should require authentication for upload-url', () => {
      const uploadUrlPath = path.join(
        __dirname,
        '../../app/api/videos/upload-url/route.ts'
      );
      const content = fs.readFileSync(uploadUrlPath, 'utf-8');

      // Should check authentication
      expect(content).toContain('getAuthUser');

      // Should return 401 for unauthenticated
      expect(content).toContain('Unauthorized');
      expect(content).toContain('status: 401');
    });

    it('should require authentication for complete-upload', () => {
      const completeUploadPath = path.join(
        __dirname,
        '../../app/api/videos/complete-upload/route.ts'
      );
      const content = fs.readFileSync(completeUploadPath, 'utf-8');

      // Should check authentication
      expect(content).toContain('getAuthUser');

      // Should return 401 for unauthenticated
      expect(content).toContain('Unauthorized');
      expect(content).toContain('status: 401');
    });

    it('should verify video ownership in complete-upload', () => {
      const completeUploadPath = path.join(
        __dirname,
        '../../app/api/videos/complete-upload/route.ts'
      );
      const content = fs.readFileSync(completeUploadPath, 'utf-8');

      // Should verify ownership
      expect(content).toContain('video.userId');
      expect(content).toContain('user.id');

      // Should return 403 for unauthorized
      expect(content).toContain('status: 403');
    });

    it('should support team-based uploads', () => {
      const uploadUrlPath = path.join(
        __dirname,
        '../../app/api/videos/upload-url/route.ts'
      );
      const content = fs.readFileSync(uploadUrlPath, 'utf-8');

      // Should handle teamId parameter
      expect(content).toContain('teamId');

      // Should verify team membership
      expect(content).toContain('teamMember');
      expect(content).toMatch(/not a member/i);

      // Should use team AWS credentials
      expect(content).toContain('team.awsCredentials');
    });
  });

  describe('Security Best Practices', () => {
    it('should use presigned URLs with expiration', () => {
      const uploadUrlPath = path.join(
        __dirname,
        '../../app/api/videos/upload-url/route.ts'
      );
      const content = fs.readFileSync(uploadUrlPath, 'utf-8');

      // Should set expiration time
      expect(content).toContain('expiresIn');

      // Should be reasonable (e.g., 1 hour = 3600 seconds)
      expect(content).toMatch(/expiresIn:.*3600/);
    });

    it('should validate file type', () => {
      const uploadUrlPath = path.join(
        __dirname,
        '../../app/api/videos/upload-url/route.ts'
      );
      const content = fs.readFileSync(uploadUrlPath, 'utf-8');

      // Should check video MIME types
      expect(content).toContain('video/mp4');
      expect(content).toContain('video/quicktime');
      expect(content).toContain('video/webm');

      // Should reject invalid types
      expect(content).toMatch(/Invalid file type/i);
    });

    it('should encrypt AWS credentials', () => {
      const uploadUrlPath = path.join(
        __dirname,
        '../../app/api/videos/upload-url/route.ts'
      );
      const content = fs.readFileSync(uploadUrlPath, 'utf-8');

      // Should decrypt credentials before use
      expect(content).toContain('decrypt');
      expect(content).toContain('accessKeyId');
      expect(content).toContain('secretAccessKey');
    });

    it('should not expose AWS credentials to client', () => {
      const uploadUrlPath = path.join(
        __dirname,
        '../../app/api/videos/upload-url/route.ts'
      );
      const content = fs.readFileSync(uploadUrlPath, 'utf-8');

      // Should return presigned URL, not credentials
      expect(content).toContain('uploadUrl');

      // Should not return decrypted credentials
      expect(content).not.toMatch(/return.*secretAccessKey/);
    });

    it('should create video record with PENDING status', () => {
      const uploadUrlPath = path.join(
        __dirname,
        '../../app/api/videos/upload-url/route.ts'
      );
      const content = fs.readFileSync(uploadUrlPath, 'utf-8');

      // Should create video before upload
      expect(content).toContain('prisma.video.create');

      // Should set PENDING status
      expect(content).toContain('PENDING');
    });

    it('should update status to PROCESSING after upload', () => {
      const completeUploadPath = path.join(
        __dirname,
        '../../app/api/videos/complete-upload/route.ts'
      );
      const content = fs.readFileSync(completeUploadPath, 'utf-8');

      // Should update video status
      expect(content).toContain('prisma.video.update');

      // Should set PROCESSING status
      expect(content).toContain('PROCESSING');
    });

    it('should set FAILED status on errors', () => {
      const completeUploadPath = path.join(
        __dirname,
        '../../app/api/videos/complete-upload/route.ts'
      );
      const content = fs.readFileSync(completeUploadPath, 'utf-8');

      // Should handle transcoding errors
      expect(content).toContain('transcodeError');

      // Should set FAILED status
      expect(content).toContain('FAILED');
    });
  });

  describe('CloudFormation Template Security', () => {
    it('should create S3 bucket with private access', () => {
      const cloudformationPath = path.join(
        __dirname,
        '../../../public/cloudformation/private-video-setup.yaml'
      );
      const content = fs.readFileSync(cloudformationPath, 'utf-8');

      // Check public access block configuration
      expect(content).toContain('PublicAccessBlockConfiguration');
      expect(content).toMatch(/BlockPublicAcls:\s*true/);
      expect(content).toMatch(/BlockPublicPolicy:\s*true/);
      expect(content).toMatch(/IgnorePublicAcls:\s*true/);
      expect(content).toMatch(/RestrictPublicBuckets:\s*true/);
    });

    it('should use least privilege IAM permissions', () => {
      const cloudformationPath = path.join(
        __dirname,
        '../../../public/cloudformation/private-video-setup.yaml'
      );
      const content = fs.readFileSync(cloudformationPath, 'utf-8');

      // Should have S3 permissions
      expect(content).toContain('CheeseboxUserPolicy');
      expect(content).toContain('s3:PutObject');
      expect(content).toContain('s3:GetObject');
      expect(content).toContain('s3:DeleteObject');
      expect(content).toContain('s3:ListBucket');

      // Should have MediaConvert permissions
      expect(content).toContain('mediaconvert:CreateJob');
      expect(content).toContain('mediaconvert:GetJob');
      expect(content).toContain('mediaconvert:DescribeEndpoints');

      // Should NOT have wildcard permissions
      expect(content).not.toMatch(/Action:[\s\S]*'s3:\*'/);
    });

    it('should configure MediaConvert role properly', () => {
      const cloudformationPath = path.join(
        __dirname,
        '../../../public/cloudformation/private-video-setup.yaml'
      );
      const content = fs.readFileSync(cloudformationPath, 'utf-8');

      // Should exist
      expect(content).toContain('MediaConvertRole');

      // Should allow MediaConvert to assume role
      expect(content).toContain('mediaconvert.amazonaws.com');
      expect(content).toContain('AssumeRolePolicyDocument');

      // Should have S3 access for MediaConvert
      expect(content).toMatch(/MediaConvertRole[\s\S]*s3:GetObject/);
      expect(content).toMatch(/MediaConvertRole[\s\S]*s3:PutObject/);
      expect(content).toMatch(/MediaConvertRole[\s\S]*s3:ListBucket/);
    });
  });

  describe('Progress Tracking', () => {
    it('should track upload progress', () => {
      const videoUploadPath = path.join(
        __dirname,
        '../../components/VideoUpload.tsx'
      );
      const content = fs.readFileSync(videoUploadPath, 'utf-8');

      // Should use progress event listener
      expect(content).toContain('xhr.upload.addEventListener("progress"');

      // Should calculate percentage
      expect(content).toContain('e.loaded');
      expect(content).toContain('e.total');

      // Should update progress state
      expect(content).toContain('setProgress');
    });

    it('should show progress UI', () => {
      const videoUploadPath = path.join(
        __dirname,
        '../../components/VideoUpload.tsx'
      );
      const content = fs.readFileSync(videoUploadPath, 'utf-8');

      // Should display progress percentage
      expect(content).toContain('{progress}%');

      // Should show progress bar
      expect(content).toMatch(/width:.*progress/);
    });
  });
});
