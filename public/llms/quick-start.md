# Quick Start Guide

Get started with Cheesebox in under 10 minutes.

## Prerequisites

- AWS account with billing enabled
- Email address for account creation
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Step 1: Create Your Account

1. Visit the Cheesebox homepage
2. Click "Get Started Free" or navigate to the sign-up page
3. Enter your email and create a password (minimum 8 characters)
4. Alternatively, sign up with Google OAuth for faster onboarding

**Note:** Recipients of your videos only need a free Cheesebox account - no AWS account required.

## Step 2: Set Up AWS Infrastructure

### Option A: One-Click CloudFormation (Recommended)

1. Navigate to Settings > AWS Configuration
2. Click "Deploy CloudFormation Template"
3. This opens AWS Console with pre-configured stack:
   - Creates S3 bucket for video storage
   - Creates S3 bucket for transcoded outputs
   - Sets up IAM role with minimal permissions
   - Configures MediaConvert access
4. Click "Create Stack" in AWS Console
5. Wait 2-3 minutes for stack completion
6. Copy the output values:
   - `AccessKeyId`
   - `SecretAccessKey`
   - `Region`
   - `InputBucketName`
   - `OutputBucketName`

### Option B: Manual Setup

See [AWS Setup Guide](/llms/aws-setup.md) for detailed manual configuration.

## Step 3: Configure Cheesebox with AWS Credentials

1. Return to Cheesebox Settings
2. Enter your AWS credentials:
   - **AWS Access Key ID**: From CloudFormation output
   - **AWS Secret Access Key**: From CloudFormation output
   - **AWS Region**: Your selected region (e.g., us-east-1)
   - **S3 Input Bucket**: Input bucket name
   - **S3 Output Bucket**: Output bucket name
3. Click "Save AWS Configuration"
4. Credentials are encrypted with AES-256-GCM before storage

**Security Note:** Cheesebox encrypts your AWS credentials and never transmits them to our servers. All AWS operations happen directly from your browser or our serverless functions using your encrypted credentials.

## Step 4: Upload Your First Video

### Upload from File

1. Navigate to Dashboard
2. Click "Upload Video" button
3. Select video file from your computer
4. Enter:
   - **Title**: Descriptive name for your video
   - **Description** (optional): Additional context
5. Click "Upload"
6. Video uploads directly to your S3 bucket
7. Transcoding begins automatically (takes ~1-2 minutes per minute of video)

### Record from Webcam

1. Click "Record Video" button
2. Grant browser permission to access camera/microphone
3. Click red record button to start
4. Click stop when finished
5. Preview your recording
6. Enter title and description
7. Click "Upload Recording"

## Step 5: Share Your Video

### Private Sharing (Email Permissions)

1. Click "Share" button on any video
2. Enter email addresses (one per line or comma-separated)
3. Optional: Add personal message
4. Click "Send Invitations"
5. Recipients receive email notification
6. They create free Cheesebox account and watch immediately

### Public Sharing (Embeddable)

1. Toggle video visibility to "Public"
2. Click "Get Embed Code"
3. Copy the `<iframe>` code
4. Paste into your website, blog, or documentation

## Step 6: Create a Share Group (Optional)

For teams or recurring recipients:

1. Navigate to Groups
2. Click "Create Group"
3. Enter group name (e.g., "Marketing Team", "Client XYZ")
4. Add email addresses
5. Click "Create"
6. When sharing videos, select the group instead of typing emails

## Next Steps

- **Set up a team**: Share AWS credentials with collaborators [Teams Guide](/llms/teams.md)
- **Configure email**: Set up Resend for custom email notifications [Email Setup](/llms/email-setup.md)
- **Customize themes**: Choose or create themes [Theme System](/llms/themes.md)
- **Understand security**: Learn about our security model [Security](/llms/security.md)

## Common Issues

**Video stuck in "Processing" status:**
- Check AWS MediaConvert console for errors
- Verify IAM permissions include MediaConvert access
- Ensure output bucket has correct CORS configuration

**Upload fails:**
- Check S3 bucket permissions
- Verify AWS credentials are correct
- Check browser console for specific error messages

**Recipients can't watch:**
- Confirm they've created a Cheesebox account
- Verify their email is listed in video permissions
- Check email wasn't caught in spam filter

For more troubleshooting, see [Common Issues](/llms/troubleshooting.md).
