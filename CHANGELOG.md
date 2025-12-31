# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-12-24

### Added

- Initial release of Cheesebox platform
- User authentication with NextAuth.js
- AWS credentials management with AES-256-GCM encryption
- Video upload to user-owned S3 buckets
- Automatic HLS transcoding with AWS MediaConvert
- Video streaming via authenticated proxy endpoint
- Email-based video sharing (Google Docs-style)
- Email notifications via Resend
- Video deletion with automatic S3 cleanup
- Dashboard with "My Videos" and "Shared with Me" sections
- Video upload progress indicator
- File size validation (5GB limit)
- CORS configuration for S3 buckets
- Comprehensive AWS setup documentation

### Security

- Encrypted AWS credentials storage
- JWT-based authentication
- Pre-signed URL generation for video playback
- Permission-based access control
- bcrypt password hashing

### Fixed

- CORS errors during video playback
- 403 Forbidden errors for HLS segments
- Video status not auto-updating from AWS MediaConvert
- 404 errors when playing videos (manifest filename pattern)
- Input text visibility in forms

---

## How to Update

When making changes, please update this file following this format:

### Added

- New features

### Changed

- Changes in existing functionality

### Deprecated

- Soon-to-be removed features

### Removed

- Removed features

### Fixed

- Bug fixes

### Security

- Security improvements
