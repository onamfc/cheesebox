import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";
import { createS3Client, generatePresignedUrl } from "@/lib/aws-services";
import dev from "@onamfc/developer-log";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get the video
    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        owner: {
          include: {
            awsCredentials: true,
          },
        },
        shares: true,
        team: {
          include: {
            members: true,
          },
        },
        groupShares: {
          include: {
            group: {
              include: {
                members: true,
              },
            },
          },
        },
      },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Check if user has access
    const isOwner = video.userId === user.id;
    const isSharedWith = video.shares.some(
      (share) => share.sharedWithEmail === user.email,
    );
    const isTeamMember = video.team?.members.some(
      (member) => member.userId === user.id,
    ) || false;
    const isGroupMember = video.groupShares.some((groupShare) =>
      groupShare.group.members.some((member) => member.email === user.email),
    );

    if (!isOwner && !isSharedWith && !isTeamMember && !isGroupMember) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Check if transcoding is complete
    if (video.transcodingStatus !== "COMPLETED") {
      return NextResponse.json(
        {
          error: "Video is still being processed",
          status: video.transcodingStatus,
        },
        { status: 400 },
      );
    }

    if (!video.hlsManifestKey) {
      return NextResponse.json(
        { error: "HLS manifest not available" },
        { status: 400 },
      );
    }

    // Get AWS credentials (from team if video belongs to team, otherwise from owner)
    let awsCredentials = null;

    if (video.teamId && video.team) {
      // Get team's AWS credentials
      const teamWithCredentials = await prisma.team.findUnique({
        where: { id: video.teamId },
        include: { awsCredentials: true },
      });
      awsCredentials = teamWithCredentials?.awsCredentials;
    } else {
      // Get owner's personal AWS credentials
      awsCredentials = video.owner.awsCredentials;
    }

    if (!awsCredentials) {
      return NextResponse.json(
        { error: "AWS credentials not found" },
        { status: 500 },
      );
    }

    // Decrypt credentials
    const credentials = {
      accessKeyId: decrypt(awsCredentials.accessKeyId),
      secretAccessKey: decrypt(awsCredentials.secretAccessKey),
      bucketName: awsCredentials.bucketName,
      region: awsCredentials.region,
    };

    // Generate pre-signed URL
    const s3Client = createS3Client(credentials);
    const expiresIn = parseInt(process.env.PRESIGNED_URL_EXPIRY || "10800");
    const presignedUrl = await generatePresignedUrl(
      s3Client,
      credentials.bucketName,
      video.hlsManifestKey,
      expiresIn,
    );

    // Extract manifest filename for streaming proxy
    const hlsManifestKey = video.hlsManifestKey.split("/").pop();

    return NextResponse.json({
      url: presignedUrl,
      expiresIn,
      hlsManifestKey,
      useStreamingProxy: true, // Flag to use streaming proxy instead of pre-signed URL
    });
  } catch (error) {
    dev.error("Error generating pre-signed URL:", error, {tag: "video"});
    return NextResponse.json(
      { error: "Failed to generate pre-signed URL" },
      { status: 500 },
    );
  }
}
