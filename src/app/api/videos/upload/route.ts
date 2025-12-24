import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";
import {
  createS3Client,
  uploadToS3,
  createMediaConvertClient,
  createHLSTranscodeJob,
} from "@/lib/aws-services";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get AWS credentials
    const awsCredentials = await prisma.awsCredentials.findUnique({
      where: { userId: session.user.id },
    });

    if (!awsCredentials) {
      return NextResponse.json(
        {
          error:
            "AWS credentials not configured. Please add your AWS credentials first.",
        },
        { status: 400 },
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;

    console.log("Upload request received:", {
      hasFile: !!file,
      fileType: file?.type,
      fileName: file?.name,
      fileSize: file?.size,
      title: title,
      hasDescription: !!description,
    });

    if (!file) {
      console.error("Upload failed: No file provided");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!title || !title.trim()) {
      console.error("Upload failed: Title is required");
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Validate file type
    const videoMimeTypes = [
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/webm",
      "video/x-matroska",
    ];
    if (!videoMimeTypes.includes(file.type)) {
      console.error("Upload failed: Invalid file type", {
        fileType: file.type,
        fileName: file.name,
      });
      return NextResponse.json(
        {
          error: `Invalid file type: ${file.type}. Supported formats: MP4, MOV, AVI, WebM, MKV`,
        },
        { status: 400 },
      );
    }

    // Validate file size (5GB limit)
    const maxSize = 5 * 1024 * 1024 * 1024; // 5GB
    if (file.size > maxSize) {
      console.error("Upload failed: File too large", {
        fileSize: file.size,
        maxSize,
      });
      return NextResponse.json(
        { error: "File size exceeds 5GB limit" },
        { status: 400 },
      );
    }

    // Decrypt AWS credentials
    const credentials = {
      accessKeyId: decrypt(awsCredentials.accessKeyId),
      secretAccessKey: decrypt(awsCredentials.secretAccessKey),
      bucketName: awsCredentials.bucketName,
      region: awsCredentials.region,
    };

    // Generate unique key for the video
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const originalKey = `videos/${session.user.id}/${timestamp}-original.${fileExtension}`;
    const outputKeyPrefix = `videos/${session.user.id}/${timestamp}-hls/`;

    // Upload to S3
    const s3Client = createS3Client(credentials);
    const buffer = Buffer.from(await file.arrayBuffer());

    await uploadToS3(
      s3Client,
      credentials.bucketName,
      originalKey,
      buffer,
      file.type,
    );

    // Create video record in database
    const video = await prisma.video.create({
      data: {
        userId: session.user.id,
        title,
        description,
        originalKey,
        transcodingStatus: "PENDING",
      },
    });

    // Start HLS transcoding job (async - don't wait for it)
    try {
      // Check if MediaConvert role is configured
      if (!awsCredentials.mediaConvertRole) {
        throw new Error(
          "MediaConvert IAM role not configured. Please add it in Settings.",
        );
      }

      const mediaConvertClient = await createMediaConvertClient(credentials);
      const jobId = await createHLSTranscodeJob(mediaConvertClient, {
        inputKey: originalKey,
        outputKeyPrefix,
        bucketName: credentials.bucketName,
        role: awsCredentials.mediaConvertRole,
      });

      // MediaConvert names the manifest based on input filename
      // Input: timestamp-original.ext -> Output: timestamp-original.m3u8
      const manifestFilename = `${timestamp}-original.m3u8`;

      // Update video with job ID and status
      await prisma.video.update({
        where: { id: video.id },
        data: {
          transcodingJobId: jobId,
          transcodingStatus: "PROCESSING",
          hlsManifestKey: `${outputKeyPrefix}${manifestFilename}`,
        },
      });

      return NextResponse.json(
        {
          message: "Video uploaded successfully and transcoding started",
          video: {
            id: video.id,
            title: video.title,
            transcodingStatus: "PROCESSING",
          },
        },
        { status: 201 },
      );
    } catch (transcodeError) {
      console.error("Transcoding error:", transcodeError);

      // Update status to failed
      await prisma.video.update({
        where: { id: video.id },
        data: { transcodingStatus: "FAILED" },
      });

      return NextResponse.json(
        {
          message: "Video uploaded but transcoding failed",
          video: {
            id: video.id,
            title: video.title,
            transcodingStatus: "FAILED",
          },
          error: "Transcoding initiation failed",
        },
        { status: 201 },
      );
    }
  } catch (error) {
    console.error("Video upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload video" },
      { status: 500 },
    );
  }
}
