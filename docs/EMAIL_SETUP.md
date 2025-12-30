# Email Provider Setup Guide

This guide will help you configure your email provider to send video sharing notifications from Private Video.

## Overview

Private Video supports multiple email providers, allowing you to use your own email service. This gives you:

- **Cost Control**: Use your existing email service or free tiers
- **Branding**: Emails come from your own domain
- **Deliverability**: Leverage your established sender reputation
- **Compliance**: Use email providers that meet your industry requirements

## Supported Providers

- [Resend](#resend-setup) - Recommended for simplicity
- [AWS SES](#aws-ses-setup) - Best for low cost at scale
- [SMTP](#smtp-setup) - Universal option (Gmail, Outlook, etc.)

---

## Resend Setup

**Best for**: Simplicity and modern API
**Free Tier**: 100 emails/day
**Paid**: $20/month for 50,000 emails

### Step 1: Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### Step 2: Add and Verify Your Domain

1. In Resend dashboard, click **Domains** → **Add Domain**
2. Enter your domain (e.g., `yourdomain.com`)
3. Add the DNS records to your domain provider:
   - SPF record
   - DKIM records
   - Return-Path record
4. Wait for verification (usually a few minutes)

**Note**: For testing, you can use Resend's sandbox domain (emails only go to your verified email)

### Step 3: Generate API Key

1. Click **API Keys** in sidebar
2. Click **Create API Key**
3. Give it a name (e.g., "Private Video")
4. Select permissions: **Sending access**
5. Copy the API key (starts with `re_`)

### Step 4: Configure in Private Video

1. Go to **Settings** in Private Video
2. Scroll to **Email Settings**
3. Select **Resend**
4. Enter:
   - **From Email**: `noreply@yourdomain.com` (must match verified domain)
   - **From Name**: `Private Video` (optional)
   - **API Key**: Paste the key from Step 3
5. Click **Save Email Settings**
6. Click **Send Test Email** to verify

### Troubleshooting

**Error: "Domain not verified"**
- Make sure you've added all DNS records
- Wait a few minutes for DNS propagation
- Check DNS records with `dig TXT yourdomain.com`

**Emails not arriving**
- Check spam folder
- Verify the "From Email" matches your verified domain
- Check Resend dashboard for delivery logs

---

## AWS SES Setup

**Best for**: Low cost at scale
**Free Tier**: 62,000 emails/month (first 12 months)
**Paid**: $0.10 per 1,000 emails

### Step 1: Create AWS Account

1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Create an account (requires credit card)
3. Sign in to AWS Console

### Step 2: Verify Your Email or Domain

#### Option A: Verify Single Email (Quick)

1. Go to **Amazon SES** service
2. Click **Verified identities** → **Create identity**
3. Select **Email address**
4. Enter your email (e.g., `noreply@yourdomain.com`)
5. Click **Create identity**
6. Check your inbox and click the verification link

#### Option B: Verify Domain (Recommended for Production)

1. Go to **Amazon SES** service
2. Click **Verified identities** → **Create identity**
3. Select **Domain**
4. Enter your domain (e.g., `yourdomain.com`)
5. Check **Use a custom MAIL FROM domain** (optional)
6. Add the CNAME records to your DNS provider
7. Wait for verification (can take up to 72 hours)

### Step 3: Request Production Access

**Important**: By default, SES is in "sandbox mode" - you can only send to verified emails.

1. In SES console, click **Account dashboard**
2. Click **Request production access**
3. Fill out the form:
   - **Mail type**: Transactional
   - **Use case**: Video sharing notifications
   - **Compliance**: Explain how users opt-in (sharing videos)
4. Submit request
5. Wait for approval (usually 24-48 hours)

### Step 4: Create IAM User for SES

1. Go to **IAM** service
2. Click **Users** → **Create user**
3. Name: `private-video-ses`
4. Click **Next**
5. Attach policy: **AmazonSESFullAccess** (or create custom restrictive policy)
6. Click **Create user**
7. Click on the user → **Security credentials** tab
8. Click **Create access key**
9. Select **Application running outside AWS**
10. Copy the **Access Key ID** and **Secret Access Key**

### Step 5: Configure in Private Video

1. Go to **Settings** in Private Video
2. Scroll to **Email Settings**
3. Select **AWS SES**
4. Enter:
   - **From Email**: Your verified email (e.g., `noreply@yourdomain.com`)
   - **From Name**: `Private Video` (optional)
   - **AWS Access Key ID**: From Step 4
   - **AWS Secret Access Key**: From Step 4
   - **AWS Region**: Same region where you verified the email/domain (e.g., `us-east-1`)
5. Click **Save Email Settings**
6. Click **Send Test Email** to verify

### Recommended IAM Policy (Least Privilege)

Instead of `AmazonSESFullAccess`, use this custom policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail",
        "ses:GetSendQuota"
      ],
      "Resource": "*"
    }
  ]
}
```

### Monitoring SES

- Go to **SES Console** → **Account dashboard**
- View sending statistics, bounce/complaint rates
- Set up SNS notifications for bounces/complaints

### Troubleshooting

**Error: "Email address not verified"**
- Ensure you verified the exact email address you're using
- Check verification status in SES console

**Error: "Daily sending quota exceeded"**
- In sandbox mode, limit is 200 emails/day
- Request production access to increase limits

**Emails going to spam**
- Verify your domain (not just email)
- Set up SPF, DKIM, and DMARC records
- Monitor bounce and complaint rates

---

## SMTP Setup

**Best for**: Using existing email services (Gmail, Outlook, etc.)
**Free Tier**: Varies by provider
**Paid**: Varies by provider

### Option 1: Gmail SMTP

**Free Tier**: 100 emails/day for personal accounts
**Paid**: Google Workspace for custom domains

#### Step 1: Enable 2-Factor Authentication

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click **Security**
3. Enable **2-Step Verification**

#### Step 2: Create App Password

1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select **Mail** and **Other (Custom name)**
3. Enter name: "Private Video"
4. Click **Generate**
5. Copy the 16-character password (remove spaces)

#### Step 3: Configure in Private Video

1. Go to **Settings** in Private Video
2. Scroll to **Email Settings**
3. Select **SMTP**
4. Enter:
   - **From Email**: Your Gmail address (e.g., `you@gmail.com`)
   - **From Name**: `Private Video` (optional)
   - **SMTP Host**: `smtp.gmail.com`
   - **SMTP Port**: `587`
   - **Username**: Your full Gmail address
   - **Password**: App password from Step 2
   - **Use TLS/SSL**: Unchecked (port 587 uses STARTTLS)
5. Click **Save Email Settings**
6. Click **Send Test Email** to verify

### Option 2: Outlook/Office 365 SMTP

#### Step 1: Get SMTP Credentials

- **Email**: Your Outlook email
- **Password**: Your Outlook password (or app password if 2FA enabled)

#### Step 2: Configure in Private Video

1. Go to **Settings** in Private Video
2. Select **SMTP**
3. Enter:
   - **From Email**: Your Outlook email
   - **SMTP Host**: `smtp-mail.outlook.com` or `smtp.office365.com`
   - **SMTP Port**: `587`
   - **Username**: Your full email address
   - **Password**: Your password or app password
   - **Use TLS/SSL**: Unchecked
4. Click **Save Email Settings**

### Option 3: Custom SMTP Server

For other providers, you'll need:

1. **SMTP Host**: e.g., `smtp.mailgun.org`, `smtp.sendgrid.net`
2. **SMTP Port**: Usually `587` (STARTTLS) or `465` (SSL)
3. **Username**: Usually your email or API username
4. **Password**: Your password or API key

Common ports:
- `587`: STARTTLS (recommended)
- `465`: SSL/TLS (check "Use TLS/SSL")
- `25`: Plain text (not recommended)

### Troubleshooting SMTP

**Error: "Authentication failed"**
- Double-check username and password
- For Gmail, ensure you created an app password
- For 2FA accounts, use app-specific passwords

**Error: "Connection timeout"**
- Check SMTP host and port
- Ensure your network allows outbound SMTP connections
- Try different port (587 vs 465)

**Error: "TLS/SSL error"**
- For port 587: Uncheck "Use TLS/SSL"
- For port 465: Check "Use TLS/SSL"

---

## Testing Your Configuration

After configuring any provider:

1. Click **Send Test Email** button
2. Check your inbox (the email you used to register)
3. If successful, you'll see a confirmation message
4. If failed, check the error message and troubleshooting section

## Best Practices

### Security

- **Never share API keys or credentials**
- Use environment variables for local development
- Rotate credentials regularly
- Use least-privilege IAM policies (AWS)

### Deliverability

- **Verify your domain** (not just email)
- Set up **SPF, DKIM, and DMARC** records
- Monitor bounce and complaint rates
- Use a dedicated sending domain (e.g., `mail.yourdomain.com`)
- Don't send from `noreply@` if you want replies
- Include unsubscribe mechanism for bulk emails

### Cost Optimization

| Provider | Best For | Free Tier | Cost After |
|----------|----------|-----------|------------|
| Gmail SMTP | Personal/testing | 100/day | Free |
| Resend | Startups | 100/day | $20/mo (50k) |
| AWS SES | Scale | 62k/mo (12mo) | $0.10/1k |
| SendGrid | Marketing | 100/day | $15/mo (40k) |

**Recommendation**:
- **Development/Testing**: Gmail SMTP
- **Small Projects**: Resend free tier
- **Growing Projects**: Resend paid or AWS SES
- **Enterprise**: AWS SES

## Frequently Asked Questions

### Can I use multiple email providers?

Currently, you can configure one provider per account. You can switch providers anytime in Settings.

### What emails does Private Video send?

Currently, only **video sharing notifications**. Future features may include:
- Welcome emails
- Video transcoding complete notifications
- Password reset emails

### Are my credentials stored securely?

Yes! All credentials are:
- Encrypted using AES-256 before storage
- Never sent back from the API in plain text
- Only decrypted when sending emails

### Can I use a custom domain?

Yes! For each provider:
- **Resend**: Verify your domain in Resend dashboard
- **AWS SES**: Verify your domain in SES console
- **SMTP**: Use your email provider's custom domain support

### Why are my emails going to spam?

1. Verify your domain (not just email)
2. Set up SPF, DKIM, and DMARC DNS records
3. Use a reputable email provider
4. Avoid spam trigger words in email content
5. Monitor bounce and complaint rates

### How do I monitor email delivery?

Each provider has dashboards:
- **Resend**: [resend.com/emails](https://resend.com/emails)
- **AWS SES**: SES Console → Account dashboard
- **SMTP**: Check your email provider's logs

### Can I customize the email templates?

Currently, email templates are fixed. Custom templates may be added in a future update.

## Support

For issues with:
- **Private Video configuration**: Check our [GitHub Issues](https://github.com/onamfc/private-video-sharing/issues)
- **Resend**: [resend.com/docs](https://resend.com/docs)
- **AWS SES**: [AWS SES Documentation](https://docs.aws.amazon.com/ses/)
- **Gmail SMTP**: [Google Support](https://support.google.com/mail)

---

**Last Updated**: December 30, 2024
**Version**: 1.0
