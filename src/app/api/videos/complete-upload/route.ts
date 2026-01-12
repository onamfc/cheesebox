import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";
import { createS3Client, createMediaConvertClient, createHLSTranscodeJob } from "@/lib/aws-services";
import { HeadObjectCommand } from "@aws-sdk/client-s3";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { videoId, originalKey, outputKeyPrefix } = body;

    if (!videoId || !originalKey || !outputKeyPrefix) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get video from database
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        team: {
          include: {
            awsCredentials: true,
          },
        },
      },
    });

    if (!video) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (video.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Get AWS credentials
    let awsCredentials;
    if (video.teamId && video.team?.awsCredentials) {
      awsCredentials = video.team.awsCredentials;
    } else {
      awsCredentials = await prisma.awsCredentials.findUnique({
        where: { userId: user.id },
      });
    }

    if (!awsCredentials) {
      return NextResponse.json(
        { error: "AWS credentials not found" },
        { status: 400 }
      );
    }

    // Decrypt AWS credentials
    const credentials = {
      accessKeyId: decrypt(awsCredentials.accessKeyId),
      secretAccessKey: decrypt(awsCredentials.secretAccessKey),
      bucketName: awsCredentials.bucketName,
      region: awsCredentials.region,
    };

    // Verify file exists in S3
    const s3Client = createS3Client(credentials);
    try {
      await s3Client.send(new HeadObjectCommand({
        Bucket: credentials.bucketName,
        Key: originalKey,
      }));
    } catch (error) {
      console.error("File not found in S3:", error);
      return NextResponse.json(
        { error: "File not found in S3. Upload may have failed." },
        { status: 400 }
      );
    }

    // Start HLS transcoding job
    try {
      // Check if MediaConvert role is configured
      if (!awsCredentials.mediaConvertRole) {
        throw new Error(
          "MediaConvert IAM role not configured. Please add it in Settings."
        );
      }

      const mediaConvertClient = await createMediaConvertClient(credentials);
      const jobId = await createHLSTranscodeJob(mediaConvertClient, {
        inputKey: originalKey,
        outputKeyPrefix,
        bucketName: credentials.bucketName,
        role: awsCredentials.mediaConvertRole,
      });

      // Extract timestamp and determine manifest key
      const timestamp = originalKey.match(/\/(\d+)-original\./)?.[1];
      const hlsManifestKey = timestamp ? `${timestamp}-original.m3u8` : "output.m3u8";

      // Update video with job ID and status
      await prisma.video.update({
        where: { id: video.id },
        data: {
          transcodingJobId: jobId,
          transcodingStatus: "PROCESSING",
          hlsManifestKey: `${outputKeyPrefix}${hlsManifestKey}`,
        },
      });

      return NextResponse.json({
        message: "Transcoding started successfully",
        video: {
          id: video.id,
          title: video.title,
          transcodingStatus: "PROCESSING",
          jobId,
        },
      });
    } catch (transcodeError) {
      console.error("Transcoding error:", transcodeError);

      // Update status to failed
      await prisma.video.update({
        where: { id: video.id },
        data: { transcodingStatus: "FAILED" },
      });

      return NextResponse.json(
        {
          error: "Transcoding initiation failed",
          details: transcodeError instanceof Error ? transcodeError.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Complete upload error:", error);
    return NextResponse.json(
      { error: "Failed to complete upload" },
      { status: 500 }
    );
  }
}
