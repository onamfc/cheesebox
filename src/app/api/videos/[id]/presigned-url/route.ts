import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";
import { createS3Client, generatePresignedUrl } from "@/lib/aws-services";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
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

    if (!video.hlsManifestKey) {
      return NextResponse.json(
        { error: "HLS manifest not available" },
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
    const manifestFilename = video.hlsManifestKey.split("/").pop();

    return NextResponse.json({
      url: presignedUrl,
      expiresIn,
      manifestFilename,
      useStreamingProxy: true, // Flag to use streaming proxy instead of pre-signed URL
    });
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    return NextResponse.json(
      { error: "Failed to generate pre-signed URL" },
      { status: 500 },
    );
  }
}
