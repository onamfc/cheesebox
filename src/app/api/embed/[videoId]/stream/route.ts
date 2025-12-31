import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createS3Client } from "@/lib/aws-services";
import { decrypt } from "@/lib/encryption";

interface RouteParams {
  params: Promise<{
    videoId: string;
  }>;
}

/**
 * GET /api/embed/[videoId]/stream
 *
 * Public endpoint for getting stream URL for embeddable videos.
 * No authentication required - only works for PUBLIC videos.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { videoId } = await params;

    // Fetch video - must be PUBLIC and COMPLETED
    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
        visibility: "PUBLIC",
        transcodingStatus: "COMPLETED",
      },
      include: {
        owner: {
          include: {
            awsCredentials: true,
          },
        },
      },
    });

    if (!video) {
      return NextResponse.json(
        { error: "Video not found or not available for embedding" },
        { status: 404 }
      );
    }

    if (!video.hlsManifestKey) {
      return NextResponse.json(
        { error: "Video stream not available" },
        { status: 404 }
      );
    }

    if (!video.owner.awsCredentials) {
      return NextResponse.json(
        { error: "Video storage not configured" },
        { status: 500 }
      );
    }

    // Get AWS credentials
    const credentials = video.owner.awsCredentials;

    // Create S3 client with decrypted credentials
    const s3Client = createS3Client({
      accessKeyId: decrypt(credentials.accessKeyId),
      secretAccessKey: decrypt(credentials.secretAccessKey),
      region: credentials.region,
      bucketName: credentials.bucketName,
    });

    // Generate pre-signed URL for the manifest (valid for 3 hours)
    const command = new GetObjectCommand({
      Bucket: credentials.bucketName,
      Key: video.hlsManifestKey,
    });

    const streamUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600 * 3, // 3 hours
    });

    return NextResponse.json({
      streamUrl,
      videoId: video.id,
      title: video.title,
    });
  } catch (error) {
    console.error("Error getting embed stream URL:", error);
    return NextResponse.json(
      { error: "Failed to get video stream" },
      { status: 500 }
    );
  }
}
