/**
 * Team Invitation Email Templates
 * =================================
 *
 * Email templates for team invitation notifications.
 * Styled to match Cheesebox auth pages with brand colors.
 */

export interface TeamInvitationEmailData {
  inviterEmail: string;
  inviterName?: string;
  teamName: string;
  teamId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  recipientEmail: string;
  hasAccount: boolean;
  appUrl: string;
}

/**
 * Get role description for email
 */
function getRoleDescription(role: string): string {
  switch (role) {
    case 'OWNER':
      return 'Team Owner - Full control of the team including managing members and settings';
    case 'ADMIN':
      return 'Team Admin - Can invite members and manage team content';
    case 'MEMBER':
      return 'Team Member - Can access team videos and resources';
    default:
      return 'Team Member';
  }
}

/**
 * Generate HTML email for team invitation
 */
export function generateTeamInvitationEmailHTML(data: TeamInvitationEmailData): string {
  const {
    inviterEmail,
    inviterName,
    teamName,
    teamId,
    role,
    hasAccount,
    appUrl,
  } = data;

  const inviterDisplay = inviterName || inviterEmail;
  const roleDescription = getRoleDescription(role);
  const actionUrl = hasAccount
    ? `${appUrl}/dashboard/teams/${teamId}`
    : `${appUrl}/auth/signup?email=${encodeURIComponent(data.recipientEmail)}&redirect=/dashboard/teams/${teamId}`;
  const actionText = hasAccount ? 'Go to Team' : 'Create Account & Join Team';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Team Invitation - Cheesebox</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">

    <!-- Header -->
    <div style="background-color: #181717; padding: 32px 24px; text-align: center;">
      <h1 style="margin: 0; color: #FAEACB; font-size: 32px; font-weight: bold;">
        Cheesebox
      </h1>
      <p style="margin: 8px 0 0 0; color: #F5BE4B; font-size: 14px; font-weight: 500;">
        SECURE VIDEO SHARING
      </p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 24px;">

      <!-- Main Message -->
      <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 24px; font-weight: 700;">
        You've been invited to join a team!
      </h2>

      <p style="margin: 0 0 24px 0; color: #374151; font-size: 16px; line-height: 24px;">
        <strong>${inviterDisplay}</strong> has invited you to join <strong>${teamName}</strong> on Cheesebox.
      </p>

      <!-- Role Info Box -->
      <div style="background-color: #FAEACB; border-left: 4px solid #F5BE4B; padding: 16px; border-radius: 8px; margin: 24px 0;">
        <p style="margin: 0 0 8px 0; color: #181717; font-size: 14px; font-weight: 600;">
          Your Role: ${role}
        </p>
        <p style="margin: 0; color: #374151; font-size: 14px; line-height: 20px;">
          ${roleDescription}
        </p>
      </div>

      ${!hasAccount ? `
        <!-- New User Message -->
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 0 0 12px 0; color: #111827; font-size: 16px; font-weight: 600;">
            Welcome to Cheesebox!
          </p>
          <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 20px;">
            Cheesebox is a secure video sharing platform. Create your account to join your team and start collaborating.
          </p>
        </div>
      ` : `
        <!-- Existing User Message -->
        <p style="margin: 24px 0; color: #374151; font-size: 16px; line-height: 24px;">
          Log in to Cheesebox to access your new team and start collaborating.
        </p>
      `}

      <!-- Call to Action Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${actionUrl}" style="display: inline-block; background-color: #181717; color: #FAEACB; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; transition: background-color 0.2s;">
          ${actionText}
        </a>
      </div>

      <!-- Alternative Link -->
      <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px; line-height: 20px; text-align: center;">
        Or copy and paste this link into your browser:<br>
        <a href="${actionUrl}" style="color: #F5BE4B; word-break: break-all;">${actionUrl}</a>
      </p>

    </div>

    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 24px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; line-height: 20px; text-align: center;">
        This invitation was sent by <strong>${inviterDisplay}</strong>
      </p>
      <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 18px; text-align: center;">
        If you didn't expect this invitation, you can safely ignore this email.
      </p>
      <p style="margin: 16px 0 0 0; color: #9ca3af; font-size: 12px; text-align: center;">
        © ${new Date().getFullYear()} Cheesebox. All rights reserved.
      </p>
    </div>

  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate plain text email for team invitation
 */
export function generateTeamInvitationEmailText(data: TeamInvitationEmailData): string {
  const {
    inviterEmail,
    inviterName,
    teamName,
    role,
    hasAccount,
    appUrl,
    teamId,
  } = data;

  const inviterDisplay = inviterName || inviterEmail;
  const roleDescription = getRoleDescription(role);
  const actionUrl = hasAccount
    ? `${appUrl}/dashboard/teams/${teamId}`
    : `${appUrl}/auth/signup?email=${encodeURIComponent(data.recipientEmail)}&redirect=/dashboard/teams/${teamId}`;

  return `
CHEESEBOX - TEAM INVITATION

You've been invited to join a team!

${inviterDisplay} has invited you to join ${teamName} on Cheesebox.

YOUR ROLE: ${role}
${roleDescription}

${hasAccount
  ? 'Log in to Cheesebox to access your new team and start collaborating.'
  : 'Welcome to Cheesebox! Cheesebox is a secure video sharing platform. Create your account to join your team and start collaborating.'
}

${hasAccount ? 'GO TO TEAM:' : 'CREATE ACCOUNT & JOIN TEAM:'}
${actionUrl}

---
This invitation was sent by ${inviterDisplay}
If you didn't expect this invitation, you can safely ignore this email.

© ${new Date().getFullYear()} Cheesebox. All rights reserved.
  `.trim();
}
