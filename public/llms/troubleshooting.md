# Troubleshooting Guide

Common issues and solutions.

## Upload Issues

**Problem: Upload fails immediately**
- Check AWS credentials in settings
- Verify S3 bucket exists and accessible
- Check browser console for CORS errors
- Ensure file size is reasonable (<5GB)

**Problem: Upload stalls at X%**
- Network interruption - retry upload
- Browser memory limit - try smaller file
- Check S3 bucket storage limits

## Transcoding Issues

**Problem: Video stuck in "Processing"**
- Check AWS MediaConvert console for job status
- Verify MediaConvert IAM permissions
- Check source video format (unsupported codec?)
- Review MediaConvert job errors in AWS console

**Problem: Transcoding fails**
- Unsupported video codec - try MP4/H.264
- Corrupted source file - re-upload
- Insufficient MediaConvert permissions
- Check output bucket permissions

## Playback Issues

**Problem: "Access Denied" when playing video**
- Verify you have permission (owner or shared with you)
- Check video visibility (PRIVATE requires permission)
- Presigned URLs expired (refresh page)

**Problem: Video won't load**
- Check S3 CORS configuration
- Verify HLS files exist in output bucket
- Check browser HLS support
- Try different browser

**Problem: Buffering or stuttering**
- Slow internet connection
- Use lower quality setting
- Consider CloudFront CDN
- Check network throttling

## Authentication Issues

**Problem: Can't sign in**
- Verify email and password correct
- Check caps lock
- Password reset if forgotten
- Clear browser cookies

**Problem: Google OAuth fails**
- Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- Verify redirect URI in Google Console
- Check OAuth consent screen approved

## Email Issues

**Problem: Sharing emails not sent**
- Check RESEND_API_KEY set
- Verify FROM_EMAIL configured
- Check Resend dashboard for errors
- Verify domain verified (if using custom domain)

**Problem: Emails go to spam**
- Verify SPF, DKIM, DMARC records
- Use verified sending domain
- Check email content for spam triggers

## AWS Configuration

**Problem: "Invalid AWS credentials"**
- Check access key ID format (starts with AKIA)
- Verify secret key copied correctly
- Test credentials with AWS CLI
- Check IAM user permissions

**Problem: S3 access denied**
- Verify IAM policy allows s3:PutObject, s3:GetObject
- Check bucket policy doesn't block access
- Ensure bucket exists in correct region
- Verify bucket name correct

## Database Issues

**Problem: "Database connection failed"**
- Check DATABASE_URL correct
- Verify PostgreSQL running
- Check network connectivity
- Review connection pool limits

**Problem: Migration errors**
- Run `npx prisma migrate deploy`
- Check schema.prisma syntax
- Verify database permissions
- Review migration history

## Performance Issues

**Problem: Slow page loads**
- Check network tab in browser
- Review Vercel function logs
- Check database query performance
- Consider Redis caching

**Problem: API timeouts**
- Check function execution time
- Review database indexes
- Optimize large queries
- Increase Vercel timeout limits

## Development Issues

**Problem: "Module not found"**
- Run `npm install`
- Clear `.next` folder
- Restart dev server
- Check import paths

**Problem: Environment variables not working**
- Verify `.env.local` exists
- Check variable names correct
- Restart dev server
- Don't use NEXT_PUBLIC_ for secrets

## Get Help

- Check [AWS Errors](/llms/aws-errors.md) for AWS-specific issues
- Review [Email Delivery](/llms/email-delivery.md) for email problems
- Search existing GitHub issues
- Open new issue with error logs
