import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";
import {
  createS3Client,
  deleteFromS3,
  deleteS3Directory,
} from "@/lib/aws-services";

// DELETE - Delete a video
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

    // Get the video
    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        owner: {
          include: {
            awsCredentials: true,
          },
        },
      },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Check if user is the owner
    if (video.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Only the video owner can delete it" },
        { status: 403 },
      );
    }

    // Get AWS credentials
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

    // Delete from S3
    const s3Client = createS3Client(credentials);

    try {
      // Delete original video
      await deleteFromS3(s3Client, credentials.bucketName, video.originalKey);

      // Delete entire HLS directory (if it exists)
      if (video.hlsManifestKey) {
        // Extract the HLS directory path from the manifest key
        // hlsManifestKey is like: videos/{userId}/{timestamp}-hls/{timestamp}-original.m3u8
        // We want: videos/{userId}/{timestamp}-hls/
        const hlsDirectory = video.hlsManifestKey.substring(
          0,
          video.hlsManifestKey.lastIndexOf("/") + 1,
        );

        // Delete all files in the HLS directory (manifest, variant playlists, segments)
        await deleteS3Directory(s3Client, credentials.bucketName, hlsDirectory);
      }
    } catch (s3Error) {
      console.error("S3 deletion error:", s3Error);
      // Continue with database deletion even if S3 deletion fails
    }

    // Delete from database (this will cascade delete shares)
    await prisma.video.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Video deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 },
    );
  }
}
