import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";
import { createEmailProvider } from "@/lib/email/factory";
import { EmailProviderType } from "@/lib/email/interface";

const shareSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// POST - Share video with a user
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
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

    const { email } = validationResult.data;

    // Get the video
    const video = await prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Check if user is the owner
    if (video.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Only the video owner can share it" },
        { status: 403 },
      );
    }

    // Don't allow sharing with self
    if (email === session.user.email) {
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
        sharedByUserId: session.user.id,
      },
    });

    // Send email notification using user's email provider
    try {
      const emailCredentials = await prisma.emailCredentials.findUnique({
        where: { userId: session.user.id },
      });

      if (!emailCredentials) {
        console.warn("No email credentials configured for user");
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

      // Send email
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      await emailProvider.sendEmail({
        to: email,
        subject: `${session.user.email} shared a video with you`,
        html: `
          <h2>A video has been shared with you!</h2>
          <p><strong>${session.user.email}</strong> has shared a video titled "<strong>${video.title}</strong>" with you.</p>
          ${video.description ? `<p>Description: ${video.description}</p>` : ""}
          <p><a href="${appUrl}/dashboard">Click here to view it</a></p>
          <p>You'll need to log in or create an account to watch the video.</p>
        `,
        text: `${session.user.email} has shared a video titled "${video.title}" with you. Visit ${appUrl}/dashboard to view it.`,
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Continue even if email fails
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
    console.error("Error sharing video:", error);
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
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
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
    if (video.userId !== session.user.id) {
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
    console.error("Error unsharing video:", error);
    return NextResponse.json(
      { error: "Failed to unshare video" },
      { status: 500 },
    );
  }
}
