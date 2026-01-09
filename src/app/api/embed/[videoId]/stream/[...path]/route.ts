import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { createS3Client } from "@/lib/aws-services";
import { decrypt } from "@/lib/encryption";
import { validateStreamingPath, validateS3Key } from "@/lib/path-validation";

interface RouteParams {
  params: Promise<{
    videoId: string;
    path: string[];
  }>;
}

/**
 * GET /api/embed/[videoId]/stream/[...path]
 *
 * Streaming proxy for public embeddable videos.
 * Proxies all HLS segments and manifests through the server.
 * No authentication required - only works for PUBLIC videos.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { videoId, path } = await params;

    // Validate path for security (prevent path traversal attacks)
    const pathValidation = validateStreamingPath(path);
    if (!pathValidation.isValid) {
      return NextResponse.json(
        { error: "Invalid file path" },
        { status: 400 }
      );
    }

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

    // Construct the S3 key
    // The manifest key looks like: "videos/userId/videoId/output/manifest.m3u8"
    // We need to construct paths like: "videos/userId/videoId/output/segment_001.ts"
    const manifestDir = video.hlsManifestKey.substring(
      0,
      video.hlsManifestKey.lastIndexOf("/") + 1
    );
    const requestedPath = path.join("/");

    // Validate S3 key to prevent path traversal
    const s3Key = validateS3Key(manifestDir, requestedPath);
    if (!s3Key) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Create S3 client
    const s3Client = createS3Client({
      accessKeyId: decrypt(credentials.accessKeyId),
      secretAccessKey: decrypt(credentials.secretAccessKey),
      region: credentials.region,
      bucketName: credentials.bucketName,
    });

    // Fetch the file from S3
    const command = new GetObjectCommand({
      Bucket: credentials.bucketName,
      Key: s3Key,
    });

    const s3Response = await s3Client.send(command);

    if (!s3Response.Body) {
      return NextResponse.json(
        { error: "File not found in storage" },
        { status: 404 }
      );
    }

    // Stream the response
    const contentType =
      s3Response.ContentType ||
      (requestedPath.endsWith(".m3u8")
        ? "application/vnd.apple.mpegurl"
        : requestedPath.endsWith(".ts")
          ? "video/mp2t"
          : "application/octet-stream");

    // Convert the stream to a web stream
    const body = s3Response.Body as any;

    return new NextResponse(body.transformToWebStream(), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "Range",
      },
    });
  } catch (error) {
    console.error("Error streaming public video:", error);
    return NextResponse.json(
      { error: "Failed to stream video" },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Range",
    },
  });
}
