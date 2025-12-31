# Cheesebox - CloudFormation Template

This CloudFormation template automatically sets up all AWS resources needed for Cheesebox.

## What Gets Created

When you launch this stack, it creates:

1. **S3 Bucket** - For storing your videos
   - Configured with CORS for video streaming
   - Private access only (Block Public Access enabled)
   - Lifecycle rules for cleaning up incomplete uploads

2. **IAM User** - For application access
   - Named: `cheesebox-user-{StackName}`
   - Has permissions for S3 and MediaConvert

3. **Access Keys** - For authentication
   - Generated automatically
   - Secret key shown only once (save it!)

4. **MediaConvert Role** - For video transcoding
   - Named: `Cheesebox-MediaConvertRole-{StackName}`
   - Has permission to read/write to your S3 bucket

## How to Use

### Option 1: Click the Launch Button

Visit the setup page in the app and click "Launch Stack in AWS"

### Option 2: Manual Launch

1. Download this template
2. Go to [AWS CloudFormation Console](https://console.aws.amazon.com/cloudformation/)
3. Click "Create Stack" → "With new resources"
4. Upload the template file
5. Follow the prompts

## Parameters

### BucketName (Required)
- Unique name for your S3 bucket
- Must be lowercase, numbers, and hyphens only
- Example: `my-private-videos-123`

### AppDomain (Optional)
- Your application domain for CORS
- Default: `http://localhost:3000`
- Update later if deploying to production

## Outputs

After the stack is created, go to the "Outputs" tab to get:

1. **BucketName** - Your S3 bucket name
2. **Region** - AWS region (e.g., us-east-1)
3. **AccessKeyId** - IAM access key ID
4. **SecretAccessKey** - IAM secret access key (SAVE THIS!)
5. **MediaConvertRoleArn** - MediaConvert role ARN

Copy all 5 values and paste them into your Cheesebox Settings page.

## Cost Estimate

AWS charges for:
- **S3 Storage**: ~$0.023 per GB/month
- **S3 Requests**: Minimal (cents per month)
- **MediaConvert**: ~$0.015 per minute of video transcoded
- **Data Transfer**: Out to internet charges apply

**Typical monthly cost for light usage**: $1-5

## Deleting Resources

To remove all resources created by this stack:

1. Go to [CloudFormation Console](https://console.aws.amazon.com/cloudformation/)
2. Select your stack (PrivateVideoSetup)
3. Click "Delete"
4. Wait for deletion to complete

**Note**: Make sure to delete all objects in the S3 bucket first, or the deletion will fail.

## Security

- All credentials are created with least-privilege permissions
- S3 bucket has Block Public Access enabled
- IAM policies follow AWS best practices
- MediaConvert role can only access your specific S3 bucket

## Troubleshooting

### Stack creation fails

**Error**: "Bucket name already exists"
- Solution: Choose a different, globally unique bucket name

**Error**: "User already exists"
- Solution: Delete the existing CloudFormation stack first

### Can't see outputs

- Wait for stack status to show "CREATE_COMPLETE"
- Click on the stack name, then the "Outputs" tab

### Secret key not showing

- Secret keys are only shown once during creation
- If you lost it, you must:
  1. Delete the stack
  2. Create a new stack
  3. Save the secret key this time!

## Template Version

**Version**: 1.0
**Last Updated**: December 30, 2024
**Maintained By**: Cheesebox Team

## Support

For issues with the template:
- [GitHub Issues](https://github.com/onamfc/cheesebox/issues)
- [Documentation](https://github.com/onamfc/cheesebox#readme)
