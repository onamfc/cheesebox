import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";
import { createS3Client, generatePresignedUrl } from "@/lib/aws-services";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { verify } from "jsonwebtoken";
import { JWT_SECRET } from "@/lib/jwt";
import { validateStreamingPath, validateS3Key } from "@/lib/path-validation";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; path: string[] }> },
) {
  try {
    const { id, path } = await params;

    // Validate path for security (prevent path traversal attacks)
    const pathValidation = validateStreamingPath(path);
    if (!pathValidation.isValid) {
      return NextResponse.json(
        { error: "Invalid file path" },
        { status: 400 }
      );
    }

    const filePath = path.join("/");

    // Try to get user from auth header first (for web)
    let user = await getAuthUser(request);
    let videoIdFromToken: string | null = null;

    // If no user from auth header, try streaming token from query param (for mobile)
    if (!user) {
      const { searchParams } = new URL(request.url);
      const streamingToken = searchParams.get("token");

      if (streamingToken) {
        try {
          const payload = verify(streamingToken, JWT_SECRET) as {
            userId: string;
            videoId: string;
            type: string;
          };

          if (payload.type === "streaming" && payload.videoId === id) {
            // Get user from token
            const tokenUser = await prisma.user.findUnique({
              where: { id: payload.userId },
              select: { id: true, email: true },
            });

            if (tokenUser) {
              user = tokenUser;
              videoIdFromToken = payload.videoId;
            }
          }
        } catch (error) {
          console.error("Invalid streaming token:", error);
        }
      }
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // Check if HLS manifest exists
    if (!video.hlsManifestKey) {
      return NextResponse.json(
        { error: "Video stream not available" },
        { status: 404 },
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

    // Construct the full S3 key
    // hlsManifestKey is like: videos/{userId}/{timestamp}-hls/{timestamp}-original.m3u8
    // We need to get the base directory: videos/{userId}/{timestamp}-hls/
    const manifestDir = video.hlsManifestKey!.substring(
      0,
      video.hlsManifestKey!.lastIndexOf("/") + 1,
    );

    // Validate S3 key to prevent path traversal
    const s3Key = validateS3Key(manifestDir, filePath);
    if (!s3Key) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Get the file from S3
    const s3Client = createS3Client(credentials);
    const command = new GetObjectCommand({
      Bucket: credentials.bucketName,
      Key: s3Key,
    });

    const response = await s3Client.send(command);

    if (!response.Body) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of response.Body as any) {
      chunks.push(chunk);
    }
    let buffer = Buffer.concat(chunks);

    // Determine content type
    let contentType = response.ContentType || "application/octet-stream";
    if (filePath.endsWith(".m3u8")) {
      contentType = "application/vnd.apple.mpegurl";

      // Rewrite manifest to add token to relative URLs
      const { searchParams } = new URL(request.url);
      const token = searchParams.get("token");

      if (token) {
        let manifestContent = buffer.toString("utf-8");

        // Add token to all relative URLs (lines that don't start with # or http)
        manifestContent = manifestContent.split("\n").map(line => {
          const trimmed = line.trim();
          // If line is not empty, not a comment, not an absolute URL, and ends with .m3u8 or .ts
          if (trimmed &&
              !trimmed.startsWith("#") &&
              !trimmed.startsWith("http") &&
              (trimmed.endsWith(".m3u8") || trimmed.endsWith(".ts"))) {
            // Add token to the URL
            return `${trimmed}?token=${token}`;
          }
          return line;
        }).join("\n");

        buffer = Buffer.from(manifestContent, "utf-8");
      }
    } else if (filePath.endsWith(".ts")) {
      contentType = "video/mp2t";
    }

    // Return the file with appropriate headers
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD",
        "Access-Control-Allow-Headers": "*",
      },
    });
  } catch (error) {
    console.error("Error streaming file:", error);
    return NextResponse.json(
      { error: "Failed to stream file" },
      { status: 500 },
    );
  }
}
