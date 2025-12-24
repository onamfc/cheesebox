# Troubleshooting Guide

Common issues and how to fix them.

## Video Upload Issues

### 400 Bad Request Error

**Symptoms**: Receiving "400 Bad Request" when uploading videos.

**Possible Causes**:

1. **Missing or empty title**
   - Solution: Ensure you enter a title before uploading

2. **No file selected**
   - Solution: Make sure you've selected a video file

3. **Invalid file type**
   - Supported formats: MP4, MOV, AVI, WebM, MKV
   - Check your file extension and MIME type
   - Solution: Convert your video to a supported format

4. **File too large**
   - Maximum size: 5GB
   - Solution: Compress or split your video

5. **AWS credentials not configured**
   - Go to Settings and add your AWS credentials
   - Make sure all fields are filled

**How to debug**:

```bash
# Check the browser console (F12 → Console tab)
# Check the server logs in your terminal
# Look for detailed error messages
```

### Upload Progress Stuck

**Symptoms**: Upload progress bar stops moving.

**Solutions**:

- Check your internet connection
- Verify the file isn't corrupted
- Check AWS S3 bucket permissions
- Review browser console for errors

### "Failed to upload video"

**Possible Causes**:

1. **AWS S3 Permission Issues**

   ```
   Error: AccessDenied: User is not authorized to perform: s3:PutObject
   ```

   - Solution: Update your IAM user policy to include S3 permissions (see README)

2. **Invalid AWS Credentials**
   - Solution: Double-check your Access Key ID and Secret Access Key

3. **Wrong S3 Bucket Region**
   - Solution: Ensure the region matches your bucket's region

## Video Transcoding Issues

### Status Stuck on "PROCESSING"

**Symptoms**: Video shows "Processing" status indefinitely.

**Solutions**:

1. Check AWS MediaConvert console for job status
2. Verify MediaConvert IAM role is configured correctly
3. Check that the role has S3 permissions
4. Refresh the dashboard (status updates automatically on load)

### Transcoding Status "FAILED"

**Possible Causes**:

1. **MediaConvert Role Not Configured**

   ```
   Error: MediaConvert IAM role not configured
   ```

   - Solution: Add the MediaConvert IAM Role ARN in Settings

2. **PassRole Permission Missing**

   ```
   Error: User is not authorized to perform: iam:PassRole
   ```

   - Solution: Update IAM user policy to include PassRole permission (see README AWS Setup Guide Step 2)

3. **Invalid Video Format**
   - Some codecs might not be supported
   - Solution: Try converting to standard H.264 MP4

4. **nameModifier Error**
   ```
   Error: nameModifier is a required property
   ```

   - This should be fixed in the latest version
   - Solution: Pull latest code changes

## Video Playback Issues

### 404 Error When Playing Video

**Symptoms**: "404 Not Found" when clicking Watch.

**Possible Causes**:

1. **Incorrect HLS manifest path**
   - Solution: Re-upload the video with the latest code
   - Or: Update `hlsManifestKey` in database using Prisma Studio

2. **Transcoding not complete**
   - Wait for transcoding to finish (status shows "COMPLETED")

### CORS Errors During Playback

**Symptoms**: Console shows CORS policy errors.

**Solution**: Configure S3 bucket CORS settings:

1. Go to AWS S3 Console → Your Bucket → Permissions
2. Scroll to "Cross-origin resource sharing (CORS)"
3. Add the CORS configuration from README

### 403 Forbidden Errors for Video Segments

**Symptoms**: Video player shows 403 errors in console.

**Solutions**:

- Ensure you're using the latest code (streaming proxy endpoint)
- Check that you're logged in
- Verify video is shared with you (if not your video)
- Check browser console for detailed errors

## Database Issues

### "Can't reach database server"

**Symptoms**: Connection errors when starting the app.

**Solutions**:

1. **Check DATABASE_URL**
   - Verify connection string is correct
   - For Railway: Use the public connection URL (not internal)

2. **Database not running**
   - For local PostgreSQL: `brew services start postgresql`
   - For Railway: Check database status in dashboard

3. **Firewall blocking connection**
   - Check if your firewall allows database connections

### Prisma Client Errors

**Symptoms**: "Unknown argument" or field not found errors.

**Solution**:

```bash
# Regenerate Prisma Client
npx prisma generate

# Restart dev server
npm run dev
```

## Authentication Issues

### 500 Error on Login/Signup

**Possible Causes**:

1. **NextAuth.js version mismatch**
   - Ensure you're using next-auth v4 (not v5 beta)
   - Solution: `npm install next-auth@^4.24.5`

2. **Missing NEXTAUTH_SECRET**
   - Solution: Add to .env file: `openssl rand -base64 32`

3. **Database connection issues**
   - Check DATABASE_URL is correct

### Session Expires Immediately

**Solutions**:

- Check NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your domain
- Clear browser cookies and try again

## AWS Configuration Issues

### Invalid AWS Credentials

**Symptoms**: "The security token included in the request is invalid"

**Solutions**:

1. Verify Access Key ID and Secret Access Key are correct
2. Check if credentials have been rotated/disabled in AWS
3. Ensure IAM user has programmatic access enabled

### S3 Bucket Access Denied

**Error**: "AccessDenied" when uploading

**Solutions**:

1. Check bucket name is correct
2. Verify IAM user has S3 permissions for your specific bucket
3. Ensure bucket exists in the region you specified

### MediaConvert Endpoint Not Found

**Error**: "No MediaConvert endpoints found"

**Solutions**:

1. Verify region is correct
2. Check that MediaConvert is available in your region
3. Ensure IAM credentials have MediaConvert permissions

## Development Issues

### Port Already in Use

**Error**: "Port 3000 is in use"

**Solutions**:

```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### TypeScript Errors

**Solution**:

```bash
# Check for type errors
npm run type-check

# Regenerate types
npx prisma generate
```

### Next.js Lock File Error

**Error**: "Unable to acquire lock"

**Solution**:

```bash
# Kill other Next.js instances
pkill -f "next dev"

# Remove lock file
rm -rf .next/dev/lock

# Restart dev server
npm run dev
```

## Email Notification Issues

### Emails Not Sending

**Solutions**:

1. Verify RESEND_API_KEY is correct
2. Check FROM_EMAIL is from a verified domain
3. Review Resend dashboard for errors
4. Check email isn't in spam folder

## Getting More Help

If none of these solutions work:

1. **Check the logs**:
   - Browser console (F12 → Console)
   - Server terminal output
   - AWS CloudWatch logs

2. **Enable debug mode**:

   ```env
   # Add to .env
   NODE_ENV=development
   ```

3. **Open an issue**:
   - Use the bug report template
   - Include error messages
   - Describe steps to reproduce
   - Share relevant logs (remove sensitive data!)

4. **Search existing issues**:
   - Check if someone else had the same problem
   - Review closed issues for solutions

## Common Debugging Commands

```bash
# Check environment variables are loaded
node -e "console.log(process.env.DATABASE_URL)"

# Test database connection
npx prisma db pull

# View database in browser
npx prisma studio

# Check Prisma migrations status
npx prisma migrate status

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Check for dependency issues
npm audit

# Clean install
rm -rf node_modules package-lock.json && npm install
```

## Still Stuck?

Open a [GitHub issue](https://github.com/onamfc/private-video-sharing/issues) with:

- Detailed description of the problem
- Steps to reproduce
- Error messages (full text)
- Environment details (OS, Node version, etc.)
- What you've already tried
