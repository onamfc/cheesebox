# AWS Setup Guide

Complete guide for setting up AWS infrastructure for Cheesebox.

## Prerequisites

- Active AWS account with billing enabled
- IAM permissions to create CloudFormation stacks
- Basic understanding of S3 and IAM

## Option 1: CloudFormation (Recommended)

### Step 1: Access CloudFormation Template

1. Log in to Cheesebox
2. Navigate to Settings > AWS Configuration
3. Click "Deploy with CloudFormation" button
4. You'll be redirected to AWS Console with pre-filled template

### Step 2: Review Stack Parameters

The CloudFormation template creates:

**Resources:**
- 2 S3 Buckets (input and output)
- 1 IAM User with programmatic access
- 1 IAM Policy with minimal permissions
- Access keys for the IAM user

**Parameters:**
- `EnvironmentName`: Prefix for resource names (default: cheesebox-prod)
- `InputBucketName`: Name for source video bucket (must be globally unique)
- `OutputBucketName`: Name for transcoded video bucket (must be globally unique)

### Step 3: Create Stack

1. Review parameters
2. Check "I acknowledge that AWS CloudFormation might create IAM resources"
3. Click "Create stack"
4. Wait 2-3 minutes for completion

### Step 4: Get Credentials

1. Go to CloudFormation > Stacks > Your Stack
2. Click "Outputs" tab
3. Copy these values:
   - `AccessKeyId`
   - `SecretAccessKey`
   - `Region`
   - `InputBucketName`
   - `OutputBucketName`

### Step 5: Configure Cheesebox

1. Return to Cheesebox Settings
2. Paste the copied values
3. Click "Save AWS Configuration"
4. Credentials are encrypted and stored securely

## Option 2: Manual Setup

### Step 1: Create S3 Buckets

**Input Bucket:**
```bash
aws s3api create-bucket \
  --bucket your-cheesebox-input-bucket \
  --region us-east-1
```

For regions outside us-east-1:
```bash
aws s3api create-bucket \
  --bucket your-cheesebox-input-bucket \
  --region us-west-2 \
  --create-bucket-configuration LocationConstraint=us-west-2
```

**Output Bucket:**
```bash
aws s3api create-bucket \
  --bucket your-cheesebox-output-bucket \
  --region us-east-1
```

### Step 2: Configure CORS

**Input Bucket CORS:**
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://your-cheesebox-domain.com"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

Apply:
```bash
aws s3api put-bucket-cors \
  --bucket your-cheesebox-input-bucket \
  --cors-configuration file://input-cors.json
```

**Output Bucket CORS:**
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET"],
    "AllowedOrigins": ["*"],
    "MaxAgeSeconds": 3000
  }
]
```

### Step 3: Create IAM User

```bash
aws iam create-user --user-name cheesebox-user
```

### Step 4: Create IAM Policy

**Policy Document (cheesebox-policy.json):**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::your-cheesebox-input-bucket/*",
        "arn:aws:s3:::your-cheesebox-input-bucket",
        "arn:aws:s3:::your-cheesebox-output-bucket/*",
        "arn:aws:s3:::your-cheesebox-output-bucket"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "mediaconvert:CreateJob",
        "mediaconvert:GetJob",
        "mediaconvert:ListJobs",
        "mediaconvert:DescribeEndpoints"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": "iam:PassRole",
      "Resource": "arn:aws:iam::*:role/MediaConvert_Default_Role",
      "Condition": {
        "StringEquals": {
          "iam:PassedToService": "mediaconvert.amazonaws.com"
        }
      }
    }
  ]
}
```

Create policy:
```bash
aws iam create-policy \
  --policy-name CheesboxPolicy \
  --policy-document file://cheesebox-policy.json
```

### Step 5: Attach Policy to User

```bash
aws iam attach-user-policy \
  --user-name cheesebox-user \
  --policy-arn arn:aws:iam::YOUR_ACCOUNT_ID:policy/CheesboxPolicy
```

### Step 6: Create Access Keys

```bash
aws iam create-access-key --user-name cheesebox-user
```

Save the output:
```json
{
  "AccessKey": {
    "AccessKeyId": "AKIA...",
    "SecretAccessKey": "...",
    "Status": "Active"
  }
}
```

### Step 7: Create MediaConvert Role (if needed)

```bash
aws iam create-role \
  --role-name MediaConvert_Default_Role \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "mediaconvert.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }'

aws iam attach-role-policy \
  --role-name MediaConvert_Default_Role \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess
```

## Security Best Practices

### 1. Use Least Privilege

Only grant permissions required for Cheesebox operation. The provided policy is minimal.

### 2. Rotate Access Keys

Regularly rotate AWS access keys:

```bash
# Create new key
aws iam create-access-key --user-name cheesebox-user

# Update Cheesebox with new keys

# Delete old key
aws iam delete-access-key \
  --user-name cheesebox-user \
  --access-key-id OLD_ACCESS_KEY_ID
```

### 3. Enable MFA for AWS Account

Protect your AWS root account with Multi-Factor Authentication.

### 4. Monitor S3 Costs

Set up billing alerts:
```bash
aws budgets create-budget \
  --account-id YOUR_ACCOUNT_ID \
  --budget file://budget.json \
  --notifications-with-subscribers file://notifications.json
```

### 5. Enable S3 Server Access Logging

Track all S3 requests:
```bash
aws s3api put-bucket-logging \
  --bucket your-cheesebox-input-bucket \
  --bucket-logging-status file://logging.json
```

## Cost Optimization

### S3 Lifecycle Policies

Automatically delete or archive old videos:

```json
{
  "Rules": [{
    "Id": "DeleteOldVideos",
    "Status": "Enabled",
    "Prefix": "videos/",
    "Expiration": {
      "Days": 90
    }
  }]
}
```

Apply:
```bash
aws s3api put-bucket-lifecycle-configuration \
  --bucket your-cheesebox-input-bucket \
  --lifecycle-configuration file://lifecycle.json
```

### Use S3 Intelligent-Tiering

For infrequently accessed videos:
```bash
aws s3api put-bucket-intelligent-tiering-configuration \
  --bucket your-cheesebox-output-bucket \
  --id IntelligentTiering \
  --intelligent-tiering-configuration file://tiering.json
```

### CloudFront CDN (Optional)

Reduce data transfer costs:
1. Create CloudFront distribution
2. Point to output S3 bucket
3. Update Cheesebox to use CloudFront URLs

## Troubleshooting

### Access Denied Errors

**Check IAM permissions:**
```bash
aws iam get-user-policy \
  --user-name cheesebox-user \
  --policy-name CheesboxPolicy
```

**Verify bucket policy:**
```bash
aws s3api get-bucket-policy --bucket your-cheesebox-input-bucket
```

### CORS Errors

**Check CORS configuration:**
```bash
aws s3api get-bucket-cors --bucket your-cheesebox-input-bucket
```

**Update CORS:**
```bash
aws s3api put-bucket-cors \
  --bucket your-cheesebox-input-bucket \
  --cors-configuration file://cors.json
```

### MediaConvert Errors

**Check MediaConvert endpoint:**
```bash
aws mediaconvert describe-endpoints --region us-east-1
```

**Verify role permissions:**
```bash
aws iam get-role --role-name MediaConvert_Default_Role
```

## Multi-Region Setup

For users in different regions:

1. Create buckets in target region
2. Create separate IAM user per region (optional)
3. Configure Cheesebox with region-specific credentials
4. Use CloudFront for global distribution

## Cleanup

To remove all AWS resources:

**CloudFormation:**
```bash
aws cloudformation delete-stack --stack-name cheesebox-stack
```

**Manual:**
```bash
# Empty buckets first
aws s3 rm s3://your-cheesebox-input-bucket --recursive
aws s3 rm s3://your-cheesebox-output-bucket --recursive

# Delete buckets
aws s3api delete-bucket --bucket your-cheesebox-input-bucket
aws s3api delete-bucket --bucket your-cheesebox-output-bucket

# Delete IAM resources
aws iam detach-user-policy \
  --user-name cheesebox-user \
  --policy-arn arn:aws:iam::YOUR_ACCOUNT_ID:policy/CheesboxPolicy

aws iam delete-access-key \
  --user-name cheesebox-user \
  --access-key-id YOUR_ACCESS_KEY

aws iam delete-user --user-name cheesebox-user
aws iam delete-policy \
  --policy-arn arn:aws:iam::YOUR_ACCOUNT_ID:policy/CheesboxPolicy
```

## Next Steps

- [Configure Email Notifications](/llms/email-setup.md)
- [Upload Your First Video](/llms/quick-start.md)
- [Understanding Permissions](/llms/permissions.md)
