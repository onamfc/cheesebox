import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-helpers";
import { decrypt } from "@/lib/encryption";
import { createEmailProvider } from "@/lib/email/factory";
import { EmailProviderType } from "@/lib/email/interface";
import {
  generateTeamInvitationEmailHTML,
  generateTeamInvitationEmailText,
} from "@/lib/email/templates/team-invitation";
import dev from "@onamfc/developer-log";

// Helper to get email credentials (user's own or team's)
async function getEmailCredentials(userId: string) {
  // Try to get user's own credentials first
  let emailCredentials = await prisma.emailCredentials.findUnique({
    where: { userId },
  });

  // If no direct credentials, check if user belongs to a team with credentials
  if (!emailCredentials) {
    const teamMembership = await prisma.teamMember.findFirst({
      where: { userId },
      include: {
        team: {
          include: {
            emailCredentials: true,
          },
        },
      },
    });

    emailCredentials = teamMembership?.team?.emailCredentials ?? null;
  }

  return emailCredentials;
}

// POST /api/teams/[id]/members - Invite team member (OWNER/ADMIN only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: teamId } = await params;
    const body = await request.json();
    const { email, role = "MEMBER" } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate role
    if (!["OWNER", "ADMIN", "MEMBER"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Check if user is OWNER or ADMIN
    const membership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: user.id,
        },
      },
    });

    if (!membership || (membership.role !== "OWNER" && membership.role !== "ADMIN")) {
      return NextResponse.json(
        { error: "Only team owners and admins can invite members" },
        { status: 403 }
      );
    }

    // Only OWNER can add other OWNERs or ADMINs
    if ((role === "OWNER" || role === "ADMIN") && membership.role !== "OWNER") {
      return NextResponse.json(
        { error: "Only team owners can add admins or other owners" },
        { status: 403 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    // Find user by email
    const invitedUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Check if there's already a pending invitation or existing member for this email
    const existingInvitation = await prisma.teamMember.findUnique({
      where: {
        teamId_email: {
          teamId,
          email: normalizedEmail,
        },
      },
    });

    if (existingInvitation) {
      if (existingInvitation.status === "PENDING") {
        return NextResponse.json(
          { error: "An invitation has already been sent to this email" },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { error: "User is already a team member" },
          { status: 400 }
        );
      }
    }

    // If user exists, check if they're already a member by userId
    if (invitedUser) {
      const existingMemberByUserId = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId,
            userId: invitedUser.id,
          },
        },
      });

      if (existingMemberByUserId) {
        return NextResponse.json(
          { error: "User is already a team member" },
          { status: 400 }
        );
      }
    }

    // Get team details for email
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: {
        id: true,
        name: true,
      },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    // Create invitation (pending if user doesn't exist, accepted if they do)
    const newMember = await prisma.teamMember.create({
      data: {
        teamId,
        userId: invitedUser?.id,
        email: normalizedEmail,
        role,
        status: invitedUser ? "ACCEPTED" : "PENDING",
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    // Send invitation email
    try {
      const emailCredentials = await getEmailCredentials(user.id);

      if (emailCredentials) {
        // Get full user details for name
        const inviter = await prisma.user.findUnique({
          where: { id: user.id },
          select: { name: true },
        });

        // Decrypt credentials
        const decryptedCredentials = {
          provider: emailCredentials.provider as EmailProviderType,
          fromEmail: emailCredentials.fromEmail,
          fromName: emailCredentials.fromName || undefined,
          apiKey: emailCredentials.apiKey
            ? decrypt(emailCredentials.apiKey)
            : undefined,
          awsAccessKeyId: emailCredentials.awsAccessKeyId
            ? decrypt(emailCredentials.awsAccessKeyId)
            : undefined,
          awsSecretKey: emailCredentials.awsSecretKey
            ? decrypt(emailCredentials.awsSecretKey)
            : undefined,
          awsRegion: emailCredentials.awsRegion || undefined,
          smtpHost: emailCredentials.smtpHost || undefined,
          smtpPort: emailCredentials.smtpPort || undefined,
          smtpUsername: emailCredentials.smtpUsername
            ? decrypt(emailCredentials.smtpUsername)
            : undefined,
          smtpPassword: emailCredentials.smtpPassword
            ? decrypt(emailCredentials.smtpPassword)
            : undefined,
          smtpSecure: emailCredentials.smtpSecure || undefined,
        };

        // Create email provider instance
        const emailProvider = createEmailProvider(
          emailCredentials.provider as EmailProviderType,
          decryptedCredentials
        );

        // Get app URL for email links
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        // Generate email content
        const emailData = {
          inviterEmail: user.email,
          inviterName: inviter?.name || undefined,
          teamName: team.name,
          teamId: team.id,
          role,
          recipientEmail: normalizedEmail,
          hasAccount: !!invitedUser,
          appUrl,
        };

        const htmlContent = generateTeamInvitationEmailHTML(emailData);
        const textContent = generateTeamInvitationEmailText(emailData);

        // Send the email
        await emailProvider.sendEmail({
          to: normalizedEmail,
          subject: `You've been invited to join ${team.name} on Cheesebox`,
          html: htmlContent,
          text: textContent,
        });

        dev.log(`Team invitation email sent to ${normalizedEmail}`, { tag: "team" });
      } else {
        dev.warn(
          `No email credentials found for user ${user.id}, invitation email not sent`,
          { tag: "team" }
        );
      }
    } catch (emailError) {
      // Log error but don't fail the invitation
      dev.error("Failed to send invitation email:", emailError, { tag: "team" });
    }

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error("Error adding team member:", error);
    return NextResponse.json(
      { error: "Failed to add team member" },
      { status: 500 }
    );
  }
}
