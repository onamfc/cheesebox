# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please report it privately to the maintainers. **Do not open a public issue.**

You can report security issues by:

1. Opening a [GitHub Security Advisory](https://github.com/onamfc/cheesebox/security/advisories/new)
2. Emailing the maintainers directly

We will acknowledge your report within 48 hours and provide a detailed response within 7 days.

## Security Features

### Current Security Measures

1. **Encrypted Credentials Storage**
   - AWS credentials are encrypted using AES-256-GCM before database storage
   - Uses PBKDF2 key derivation with 100,000 iterations
   - Each encryption uses a unique IV and salt

2. **JWT Authentication**
   - Stateless session management with NextAuth.js
   - Secure HTTP-only cookies
   - Session tokens expire after configured time

3. **Password Security**
   - bcrypt hashing with 12 salt rounds
   - No plaintext password storage

4. **Access Control**
   - User-based video ownership
   - Email-based sharing permissions
   - Owner-only deletion rights

5. **S3 Security**
   - All videos private by default
   - Pre-signed URLs with 3-hour expiry
   - Streaming proxy for authenticated access
   - CORS configuration limits origins

6. **Input Validation**
   - Zod schema validation on all API endpoints
   - File type validation for video uploads
   - Email format validation

## Security Best Practices for Deployment

### Environment Variables

- Never commit `.env` files to version control
- Use strong, randomly generated secrets:
  ```bash
  openssl rand -base64 32  # For NEXTAUTH_SECRET
  openssl rand -hex 32     # For ENCRYPTION_KEY
  ```
- Rotate secrets regularly in production

### Database

- Use SSL/TLS for database connections
- Keep database credentials secure
- Regular backups
- Use connection pooling limits

### AWS Security

- Use IAM roles with minimal required permissions
- Enable CloudTrail for audit logging
- Use separate AWS accounts for dev/staging/production
- Enable MFA on AWS accounts
- Regularly rotate AWS access keys

### Application Security

- Keep dependencies updated (`npm audit`)
- Use environment-specific CORS origins
- Enable HTTPS in production (Vercel does this automatically)
- Set secure HTTP headers
- Implement rate limiting for API endpoints
- Monitor for suspicious activity

### S3 Bucket Security

- Keep "Block Public Access" enabled
- Use bucket policies to restrict access
- Enable S3 bucket versioning
- Enable S3 access logging
- Use S3 Object Lock for compliance

### Video Content

- Scan uploaded videos for malware (consider integrating scanning)
- Implement file size limits
- Validate video formats thoroughly
- Consider watermarking for sensitive content

## Known Limitations

1. **No Rate Limiting**: Currently no rate limiting on API endpoints (should be added for production)
2. **No Video Scanning**: Uploaded videos are not scanned for malware
3. **Client-Side Secrets**: NEXT*PUBLIC*\* variables are exposed to clients
4. **Session Duration**: Default session expiry should be reviewed for your use case
5. **Logging**: Sensitive data may appear in logs - review logging configuration

## Recommended Production Additions

1. **Rate Limiting**
   - Implement rate limiting on auth endpoints
   - Limit video upload frequency per user
   - Protect against DDoS attacks

2. **Enhanced Monitoring**
   - Set up error tracking (Sentry, etc.)
   - Monitor AWS costs and usage
   - Track failed login attempts
   - Alert on suspicious patterns

3. **Backup Strategy**
   - Regular database backups
   - S3 bucket versioning and lifecycle rules
   - Disaster recovery plan

4. **Compliance**
   - Review GDPR/privacy law requirements
   - Implement data retention policies
   - Add user data export functionality
   - Provide data deletion guarantees

## Security Checklist for Self-Hosting

- [ ] Generated strong random secrets for all environment variables
- [ ] Enabled HTTPS/SSL
- [ ] Configured CORS for specific domains only
- [ ] Set up database backups
- [ ] Enabled S3 bucket versioning
- [ ] Configured AWS CloudTrail
- [ ] Set up monitoring and alerting
- [ ] Reviewed and minimized IAM permissions
- [ ] Enabled MFA on AWS account
- [ ] Set up rate limiting
- [ ] Configured CSP headers
- [ ] Regular dependency updates scheduled
- [ ] Error logging configured (without sensitive data)
- [ ] Reviewed all NEXT*PUBLIC*\* variables

## Vulnerability Disclosure Timeline

- **Day 0**: Vulnerability reported
- **Day 2**: Acknowledgment sent to reporter
- **Day 7**: Initial assessment and response
- **Day 30**: Target fix deployment
- **Day 90**: Public disclosure (if fix deployed)

## Update Policy

Security updates will be released as soon as possible. We recommend:

- Subscribing to GitHub release notifications
- Regularly checking for updates
- Testing updates in staging before production
- Maintaining a rollback plan

Thank you for helping keep Cheesebox secure!
