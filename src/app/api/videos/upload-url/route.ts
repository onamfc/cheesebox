import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";
import { createS3Client } from "@/lib/aws-services";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fileName, fileType, fileSize, title, description, teamId } = body;

    // Validate inputs
    if (!fileName || !fileType || !fileSize || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate file size (5GB limit)
    const maxSize = 5 * 1024 * 1024 * 1024; // 5GB
    if (fileSize > maxSize) {
      const fileSizeGB = (fileSize / 1024 / 1024 / 1024).toFixed(2);
      return NextResponse.json(
        {
          error: `File size (${fileSizeGB} GB) exceeds the maximum allowed size of 5 GB. Please compress your video or select a smaller file. For larger files, consider using video compression software.`
        },
        { status: 400 }
      );
    }

    // Validate file type
    const videoMimeTypes = [
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/webm",
      "video/x-matroska",
    ];
    if (!videoMimeTypes.includes(fileType)) {
      return NextResponse.json(
        {
          error: `Invalid file type: ${fileType}. Supported formats: MP4, MOV, AVI, WebM, MKV`,
        },
        { status: 400 }
      );
    }

    // Get AWS credentials based on teamId or user's personal credentials
    let awsCredentials;
    let selectedTeamId: string | null = null;

    if (teamId) {
      // User wants to upload to a specific team
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
          { status: 403 }
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
          { status: 400 }
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

        awsCredentials = teamMembership?.team?.awsCredentials ?? null;
        selectedTeamId = teamMembership?.teamId ?? null;
      }

      if (!awsCredentials) {
        return NextResponse.json(
          {
            error:
              "AWS credentials not configured. Please configure AWS credentials in your personal settings, or ask your team admin to add AWS credentials to the team settings.",
          },
          { status: 400 }
        );
      }
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
    const fileExtension = fileName.split(".").pop();
    const originalKey = `videos/${user.id}/${timestamp}-original.${fileExtension}`;
    const outputKeyPrefix = `videos/${user.id}/${timestamp}-hls/`;

    // Create video record in database with PENDING status
    const video = await prisma.video.create({
      data: {
        userId: user.id,
        teamId: selectedTeamId,
        title,
        description: description || null,
        originalKey,
        transcodingStatus: "PENDING",
      },
    });

    // Generate presigned URL for upload
    const s3Client = createS3Client(credentials);
    const command = new PutObjectCommand({
      Bucket: credentials.bucketName,
      Key: originalKey,
      ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // URL expires in 1 hour
    });

    return NextResponse.json({
      videoId: video.id,
      uploadUrl: presignedUrl,
      originalKey,
      outputKeyPrefix,
      mediaConvertRole: awsCredentials.mediaConvertRole,
    });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
