# Email Setup Guide

Configure email notifications for video sharing using Resend.

## Why Resend?

Cheesebox uses Resend for transactional emails because:
- Simple API and generous free tier
- Excellent deliverability rates
- Easy domain verification
- Built-in email templates
- Developer-friendly dashboard

## Quick Setup

### Step 1: Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up with email or GitHub
3. Verify your email address
4. Complete onboarding

### Step 2: Get API Key

1. Navigate to API Keys in Resend dashboard
2. Click "Create API Key"
3. Name it "Cheesebox Production"
4. Copy the API key (starts with `re_`)
5. Store securely - you won't see it again

### Step 3: Configure Cheesebox

Add to your `.env` file:

```bash
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=noreply@yourdomain.com
```

For development, use Resend's test mode email:
```bash
FROM_EMAIL=onboarding@resend.dev
```

### Step 4: Verify Domain (Production)

For production, verify your domain for better deliverability:

1. Go to Domains in Resend dashboard
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Add DNS records provided by Resend:
   - **SPF**: TXT record for email authentication
   - **DKIM**: TXT record for email signing
   - **DMARC**: TXT record for email policy

**Example DNS Records:**
```
Type: TXT
Host: @
Value: v=spf1 include:_spf.resend.com ~all

Type: TXT
Host: resend._domainkey
Value: [DKIM value from Resend]

Type: TXT
Host: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com
```

5. Wait for DNS propagation (up to 48 hours, usually <1 hour)
6. Click "Verify Domain" in Resend dashboard

## Email Templates

Cheesebox sends these emails:

### 1. Video Share Notification

**Trigger:** Owner shares video with email address
**Template:** `src/lib/email-templates/video-share.tsx`

**Variables:**
- `videoTitle`: Name of shared video
- `senderName`: Owner's name or email
- `message`: Optional personal message
- `videoUrl`: Link to watch video
- `recipientEmail`: Recipient's email

**Example:**
```
Subject: [Sender] shared a video with you on Cheesebox

[Sender] has shared "[Video Title]" with you.

[Optional personal message]

Watch Video: [Link]

To watch this video, you'll need to create a free Cheesebox account.
```

### 2. Team Invitation

**Trigger:** User invited to team
**Template:** `src/lib/email-templates/team-invite.tsx`

**Variables:**
- `teamName`: Name of team
- `inviterName`: Person who invited
- `acceptUrl`: Link to accept invitation

### 3. Welcome Email (Optional)

**Trigger:** New user registration
**Template:** `src/lib/email-templates/welcome.tsx`

## Testing Emails

### Using Resend Test Mode

In development, Resend provides test emails:

```typescript
// Test email sending
const response = await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'your-email@example.com',
  subject: 'Test Email',
  html: '<p>This is a test</p>'
});

console.log(response);
```

### Check Email Logs

1. Go to Resend dashboard
2. Click "Emails" in sidebar
3. View all sent emails with:
   - Delivery status
   - Open rates
   - Click tracking
   - Bounce information

### Webhook Integration (Optional)

Track email events:

1. Go to Webhooks in Resend
2. Add endpoint: `https://your-domain.com/api/webhooks/resend`
3. Select events:
   - `email.sent`
   - `email.delivered`
   - `email.bounced`
   - `email.opened`
   - `email.clicked`

## Environment Variables

Required variables:

```bash
# Resend API Key
RESEND_API_KEY=re_xxxxxxxxxxxxx

# From email address
FROM_EMAIL=noreply@yourdomain.com

# Optional: App URL for email links
NEXT_PUBLIC_APP_URL=https://cheesebox.yourdomain.com
```

## Custom Email Templates

### Creating New Template

1. Create file in `src/lib/email-templates/`
2. Use React Email components:

```typescript
import { Html, Head, Body, Container, Heading, Text, Button } from '@react-email/components';

export default function CustomEmail({
  videoTitle,
  videoUrl
}: {
  videoTitle: string;
  videoUrl: string;
}) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f6f9fc' }}>
        <Container style={{ padding: '20px' }}>
          <Heading>New Video: {videoTitle}</Heading>
          <Text>A new video has been shared with you.</Text>
          <Button href={videoUrl}>Watch Now</Button>
        </Container>
      </Body>
    </Html>
  );
}
```

### Using Custom Template

```typescript
import { render } from '@react-email/render';
import CustomEmail from '@/lib/email-templates/custom-email';

const html = render(CustomEmail({
  videoTitle: 'My Video',
  videoUrl: 'https://...'
}));

await resend.emails.send({
  from: process.env.FROM_EMAIL,
  to: recipient,
  subject: 'New Video',
  html
});
```

## Troubleshooting

### Emails Not Sending

**Check API key:**
```bash
echo $RESEND_API_KEY
```

**Verify in code:**
```typescript
if (!process.env.RESEND_API_KEY) {
  console.error('RESEND_API_KEY not set');
}
```

**Test API:**
```bash
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer re_your_api_key' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "your-email@example.com",
    "subject": "Test",
    "html": "<p>Test</p>"
  }'
```

### Emails Going to Spam

**Solutions:**
1. Verify your domain (SPF, DKIM, DMARC)
2. Use consistent FROM address
3. Avoid spam trigger words
4. Include unsubscribe link
5. Maintain low bounce rate

**Check spam score:**
Use [Mail Tester](https://www.mail-tester.com/)

### Domain Verification Failing

**Check DNS propagation:**
```bash
dig TXT yourdomain.com
dig TXT resend._domainkey.yourdomain.com
```

**Common issues:**
- DNS not propagated yet (wait 24-48 hours)
- Incorrect record type (use TXT, not CNAME)
- Trailing dots in DNS values
- Existing conflicting SPF records

### Rate Limits

Resend free tier limits:
- 100 emails/day
- 3,000 emails/month

**Upgrade plans:**
- Pro: $20/month (50k emails)
- Scale: $80/month (100k emails)

## Best Practices

### 1. Email Deliverability

- Always verify your sending domain
- Use consistent FROM name and email
- Include plain text version
- Add unsubscribe link
- Monitor bounce rates

### 2. User Preferences

Allow users to control email notifications:

```typescript
// In user settings
{
  emailNotifications: true,
  notificationTypes: {
    videoShared: true,
    teamInvite: true,
    videoProcessed: true
  }
}
```

### 3. Email Content

- Keep subject lines under 50 characters
- Use responsive email templates
- Include clear call-to-action
- Add alt text to images
- Test across email clients

### 4. Security

- Never include credentials in emails
- Use HTTPS for all links
- Implement email verification for sensitive actions
- Add email rate limiting

## Alternative Providers

Cheesebox can be adapted for other providers:

### SendGrid
```typescript
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: recipient,
  from: process.env.FROM_EMAIL,
  subject: 'Video Shared',
  html: emailHtml
});
```

### AWS SES
```typescript
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({ region: 'us-east-1' });
await ses.send(new SendEmailCommand({
  Source: process.env.FROM_EMAIL,
  Destination: { ToAddresses: [recipient] },
  Message: {
    Subject: { Data: 'Video Shared' },
    Body: { Html: { Data: emailHtml } }
  }
}));
```

## Next Steps

- [Configure AWS](/llms/aws-setup.md)
- [Customize Email Templates](/llms/customization.md)
- [Set Up Webhooks](/llms/webhooks.md)
