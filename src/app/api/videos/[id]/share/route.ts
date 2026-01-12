import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-helpers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";
import { createEmailProvider } from "@/lib/email/factory";
import { EmailProviderType } from "@/lib/email/interface";
import { sendPushNotification, sendBulkPushNotifications } from "@/lib/push-notifications";
import { deepLinkService } from "@/lib/deep-link";
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

const shareSchema = z.union([
  z.object({
    email: z.string().email("Invalid email address"),
  }),
  z.object({
    groupId: z.string().min(1, "Group ID is required"),
  }),
]);

// POST - Share video with a user
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validationResult = shareSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 },
      );
    }

    const data = validationResult.data;

    // Get the video
    const video = await prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Check if user is the owner
    if (video.userId !== user.id) {
      return NextResponse.json(
        { error: "Only the video owner can share it" },
        { status: 403 },
      );
    }

    // Handle group sharing
    if ("groupId" in data) {
      const { groupId } = data;

      // Verify group exists and user has access
      const group = await prisma.shareGroup.findUnique({
        where: { id: groupId },
        include: {
          members: true,
          team: {
            include: {
              members: {
                where: { userId: user.id },
              },
            },
          },
        },
      });

      if (!group) {
        return NextResponse.json({ error: "Group not found" }, { status: 404 });
      }

      // Check if user owns the group, is a member of the group, or is a team member
      const isOwner = group.userId === user.id;
      const isGroupMember = group.members.some((m) => m.email === user.email);
      const isTeamMember = (group.team?.members?.length ?? 0) > 0;

      if (!isOwner && !isGroupMember && !isTeamMember) {
        return NextResponse.json(
          { error: "Access denied to this group" },
          { status: 403 },
        );
      }

      // Check if already shared with group
      const existingGroupShare = await prisma.videoGroupShare.findUnique({
        where: {
          videoId_groupId: {
            videoId: id,
            groupId,
          },
        },
      });

      if (existingGroupShare) {
        return NextResponse.json(
          { error: "Video already shared with this group" },
          { status: 400 },
        );
      }

      // Create group share
      const groupShare = await prisma.videoGroupShare.create({
        data: {
          videoId: id,
          groupId,
          sharedByUserId: user.id,
        },
        include: {
          group: {
            include: {
              members: true,
            },
          },
        },
      });

      // Send email to all group members
      try {
        const emailCredentials = await getEmailCredentials(user.id);

        if (emailCredentials) {
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
            decryptedCredentials,
          );

          // Send email to all group members with deep links
          for (const member of groupShare.group.members) {
            try {
              // Generate deep link for this specific member
              const videoLink = deepLinkService.generateVideoShareLink({
                videoId: id,
                recipientEmail: member.email,
                visibility: video.visibility,
              });

              await emailProvider.sendEmail({
                to: member.email,
                subject: `${user.email} shared a video with ${group.name}`,
                html: `
                  <h2>A video has been shared with your group!</h2>
                  <p><strong>${user.email}</strong> has shared a video titled "<strong>${video.title}</strong>" with the group <strong>${group.name}</strong>.</p>
                  ${video.description ? `<p>Description: ${video.description}</p>` : ""}
                  <p><a href="${videoLink}" style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 6px; font-weight: 500;">Watch Video</a></p>
                  <p style="color: #6B7280; font-size: 14px;">${video.visibility === 'PUBLIC' ? 'Click the link above to watch this public video.' : 'Click the link above to watch this private video. You may need to log in to your Cheesebox account.'}</p>
                `,
                text: `${user.email} has shared a video titled "${video.title}" with the group ${group.name}. Click this link to watch: ${videoLink}${video.visibility === 'PRIVATE' ? ' (login required)' : ''}`,
              });
            } catch (emailError) {
              dev.error(
                `Failed to send email to ${member.email}:`,
                emailError, {tag: "email"}
              );
            }
          }
        }
      } catch (emailError) {
        dev.error("Email sending error:", emailError, {tag: "email"});
        // Continue even if email fails
      }

      // Send push notifications to group members who have push tokens
      try {
        const groupMemberEmails = groupShare.group.members.map((m) => m.email);
        const usersWithPushTokens = await prisma.user.findMany({
          where: {
            email: { in: groupMemberEmails },
            pushToken: { not: null },
          },
          select: {
            pushToken: true,
          },
        });

        if (usersWithPushTokens.length > 0) {
          const notifications = usersWithPushTokens.map((u) => ({
            pushToken: u.pushToken!,
            title: "Video Shared with Your Group",
            body: `${user.email} shared "${video.title}" with ${group.name}`,
            data: {
              videoId: video.id,
              sharedBy: user.email,
            },
          }));

          await sendBulkPushNotifications(notifications);
        }
      } catch (pushError) {
        dev.error("Push notification error:", pushError, {tag: "email"});
        // Continue even if push notification fails
      }

      return NextResponse.json(
        {
          message: `Video shared successfully with ${group.members.length} members`,
          groupShare: {
            id: groupShare.id,
            groupId: groupShare.groupId,
            groupName: group.name,
            memberCount: group.members.length,
            createdAt: groupShare.createdAt,
          },
        },
        { status: 201 },
      );
    }

    // Handle individual email sharing
    const { email } = data as { email: string };

    // Don't allow sharing with self
    if (email === user.email) {
      return NextResponse.json(
        { error: "Cannot share video with yourself" },
        { status: 400 },
      );
    }

    // Check if already shared
    const existingShare = await prisma.videoShare.findUnique({
      where: {
        videoId_sharedWithEmail: {
          videoId: id,
          sharedWithEmail: email,
        },
      },
    });

    if (existingShare) {
      return NextResponse.json(
        { error: "Video already shared with this user" },
        { status: 400 },
      );
    }

    // Create share
    const share = await prisma.videoShare.create({
      data: {
        videoId: id,
        sharedWithEmail: email,
        sharedByUserId: user.id,
      },
    });

    // Send email notification using user's email provider
    try {
      const emailCredentials = await getEmailCredentials(user.id);

      if (!emailCredentials) {
        dev.warn("No email credentials configured for user", {tag: "email"});
        // Still return success - email is optional
        return NextResponse.json(
          {
            message:
              "Video shared successfully (no email sent - credentials not configured)",
            share: {
              id: share.id,
              sharedWithEmail: share.sharedWithEmail,
              createdAt: share.createdAt,
            },
          },
          { status: 201 },
        );
      }

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
        decryptedCredentials,
      );

      // Generate deep link for the video
      const videoLink = deepLinkService.generateVideoShareLink({
        videoId: id,
        recipientEmail: email,
        visibility: video.visibility,
      });

      // Send email with universal deep link
      await emailProvider.sendEmail({
        to: email,
        subject: `${user.email} shared a video with you`,
        html: `
          <h2>A video has been shared with you!</h2>
          <p><strong>${user.email}</strong> has shared a video titled "<strong>${video.title}</strong>" with you.</p>
          ${video.description ? `<p>Description: ${video.description}</p>` : ""}
          <p><a href="${videoLink}" style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 6px; font-weight: 500;">Watch Video</a></p>
          <p style="color: #6B7280; font-size: 14px;">${video.visibility === 'PUBLIC' ? 'Click the link above to watch this public video.' : 'Click the link above to watch this private video. You may need to log in to your Cheesebox account.'}</p>
        `,
        text: `${user.email} has shared a video titled "${video.title}" with you. Click this link to watch: ${videoLink}${video.visibility === 'PRIVATE' ? ' (login required)' : ''}`,
      });
    } catch (emailError) {
      dev.error("Email sending error:", emailError, {tag: "email"});
      // Continue even if email fails
    }

    // Send push notification if the recipient has a push token
    try {
      const recipient = await prisma.user.findUnique({
        where: { email },
        select: { pushToken: true },
      });

      if (recipient?.pushToken) {
        await sendPushNotification(
          recipient.pushToken,
          "Video Shared with You",
          `${user.email} shared "${video.title}" with you`,
          {
            videoId: video.id,
            sharedBy: user.email,
          }
        );
      }
    } catch (pushError) {
      dev.error("Push notification error:", pushError, {tag: "email"});
      // Continue even if the push notification fails
    }

    return NextResponse.json(
      {
        message: "Video shared successfully",
        share: {
          id: share.id,
          sharedWithEmail: share.sharedWithEmail,
          createdAt: share.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    dev.error("Error sharing video:", error, {tag: "email"});
    return NextResponse.json(
      { error: "Failed to share video" },
      { status: 500 },
    );
  }
}

// DELETE - Unshare video from a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 },
      );
    }

    // Get the video
    const video = await prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Check if user is the owner
    if (video.userId !== user.id) {
      return NextResponse.json(
        { error: "Only the video owner can unshare it" },
        { status: 403 },
      );
    }

    // Delete share
    await prisma.videoShare.delete({
      where: {
        videoId_sharedWithEmail: {
          videoId: id,
          sharedWithEmail: email,
        },
      },
    });

    return NextResponse.json(
      { message: "Video unshared successfully" },
      { status: 200 },
    );
  } catch (error) {
    dev.error("Error unsharing video:", error, {tag: "email"});
    return NextResponse.json(
      { error: "Failed to unshare video" },
      { status: 500 },
    );
  }
}
