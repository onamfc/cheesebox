import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";
import { createS3Client, generatePresignedUrl } from "@/lib/aws-services";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; path: string[] }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, path } = await params;
    const filePath = path.join("/");

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
      },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Check if user has access (either owner or shared with)
    const isOwner = video.userId === session.user.id;
    const isSharedWith = video.shares.some(
      (share) => share.sharedWithEmail === session.user.email,
    );

    if (!isOwner && !isSharedWith) {
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

    // Get owner's AWS credentials
    const awsCredentials = video.owner.awsCredentials;

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
    const s3Key = manifestDir + filePath;

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
    const buffer = Buffer.concat(chunks);

    // Determine content type
    let contentType = response.ContentType || "application/octet-stream";
    if (filePath.endsWith(".m3u8")) {
      contentType = "application/vnd.apple.mpegurl";
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
