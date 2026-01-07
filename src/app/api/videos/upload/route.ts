import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-helpers";
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
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const teamId = formData.get("teamId") as string | null;

    // Get AWS credentials based on teamId or user's personal credentials
    let awsCredentials;
    let selectedTeamId: string | null = null;

    if (teamId) {
      // User wants to upload to a specific team
      // First, verify they're a member of that team
      const teamMembership = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId,
            userId: user.id,
          },
        },
        include: {
          team: {
            include: {
              awsCredentials: true,
            },
          },
        },
      });

      if (!teamMembership) {
        return NextResponse.json(
          { error: "You are not a member of the selected team" },
          { status: 403 },
        );
      }

      awsCredentials = teamMembership.team.awsCredentials;
      selectedTeamId = teamId;

      if (!awsCredentials) {
        return NextResponse.json(
          {
            error:
              "Selected team does not have AWS credentials configured. Please configure team credentials first.",
          },
          { status: 400 },
        );
      }
    } else {
      // User wants to upload to personal account
      awsCredentials = await prisma.awsCredentials.findUnique({
        where: { userId: user.id },
      });

      // If no direct credentials, check if user belongs to a team with credentials
      if (!awsCredentials) {
        const teamMembership = await prisma.teamMember.findFirst({
          where: { userId: user.id },
          include: {
            team: {
              include: {
                awsCredentials: true,
              },
            },
          },
        });

        console.log("Team membership check:", {
          hasTeamMembership: !!teamMembership,
          teamId: teamMembership?.teamId,
          teamName: teamMembership?.team?.name,
          hasTeamCredentials: !!teamMembership?.team?.awsCredentials,
        });

        awsCredentials = teamMembership?.team?.awsCredentials ?? null;
        selectedTeamId = teamMembership?.teamId ?? null;
      }

      if (!awsCredentials) {
        return NextResponse.json(
          {
            error:
              "AWS credentials not configured. Please configure AWS credentials in your personal settings, or ask your team admin to add AWS credentials to the team settings.",
          },
          { status: 400 },
        );
      }
    }

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
    const originalKey = `videos/${user.id}/${timestamp}-original.${fileExtension}`;
    const outputKeyPrefix = `videos/${user.id}/${timestamp}-hls/`;

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
        userId: user.id,
        teamId: selectedTeamId,
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
      const hlsManifestKey = `${timestamp}-original.m3u8`;

      // Update video with job ID and status
      await prisma.video.update({
        where: { id: video.id },
        data: {
          transcodingJobId: jobId,
          transcodingStatus: "PROCESSING",
          hlsManifestKey: `${outputKeyPrefix}${hlsManifestKey}`,
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
