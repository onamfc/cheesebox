import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "@/lib/jwt";

/**
 * GET /api/videos/[id]/streaming-token
 *
 * Generate a short-lived token for streaming video files
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get the video and check access - include team and group relationships
    const video = await prisma.video.findUnique({
      where: { id },
      include: {
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

    // Check if transcoding is complete
    if (video.transcodingStatus !== "COMPLETED") {
      return NextResponse.json(
        {
          error: "Video is still being processed",
          status: video.transcodingStatus,
        },
        { status: 400 }
      );
    }

    // Check if user has access (owner, shared with, team member, or group member)
    const isOwner = video.userId === user.id;
    const isSharedWith = video.shares.some(
      (share) => share.sharedWithEmail === user.email
    );
    const isTeamMember = video.team?.members.some(
      (member) => member.userId === user.id
    ) || false;
    const isGroupMember = video.groupShares.some((groupShare) =>
      groupShare.group.members.some((member) => member.email === user.email)
    );

    if (!isOwner && !isSharedWith && !isTeamMember && !isGroupMember) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Generate short-lived streaming token (1 hour)
    const streamingToken = sign(
      {
        userId: user.id,
        videoId: id,
        type: "streaming",
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Check if manifest exists
    if (!video.hlsManifestKey) {
      return NextResponse.json(
        { error: "Video manifest not available" },
        { status: 400 }
      );
    }

    // Extract manifest filename
    const manifestFilename = video.hlsManifestKey.split("/").pop();

    return NextResponse.json({
      streamingToken,
      manifestFilename,
      videoId: id,
    });
  } catch (error) {
    console.error("Error generating streaming token:", error);
    return NextResponse.json(
      { error: "Failed to generate streaming token" },
      { status: 500 }
    );
  }
}
