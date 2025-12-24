import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";
import {
  MediaConvertClient,
  GetJobCommand,
} from "@aws-sdk/client-mediaconvert";

// GET - Retrieve user's videos and videos shared with them
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "owned"; // 'owned' or 'shared'

    if (type === "owned") {
      // Get user's own videos
      const videos = await prisma.video.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: {
          shares: {
            select: {
              sharedWithEmail: true,
              createdAt: true,
            },
          },
        },
      });

      // Check MediaConvert status for processing videos
      await updateProcessingVideos(videos, session.user.id);

      // Refetch videos to get updated status
      const updatedVideos = await prisma.video.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: {
          shares: {
            select: {
              sharedWithEmail: true,
              createdAt: true,
            },
          },
        },
      });

      return NextResponse.json(updatedVideos);
    } else if (type === "shared") {
      // Get videos shared with the user
      const shares = await prisma.videoShare.findMany({
        where: { sharedWithEmail: session.user.email },
        include: {
          video: {
            include: {
              owner: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      const videos = shares.map((share) => ({
        ...share.video,
        sharedBy: share.video.owner.email,
        sharedAt: share.createdAt,
      }));

      return NextResponse.json(videos);
    } else {
      return NextResponse.json(
        { error: "Invalid type parameter" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error retrieving videos:", error);
    return NextResponse.json(
      { error: "Failed to retrieve videos" },
      { status: 500 },
    );
  }
}

// Helper function to check and update MediaConvert job status
async function updateProcessingVideos(videos: any[], userId: string) {
  const processingVideos = videos.filter(
    (v) => v.transcodingStatus === "PROCESSING" && v.transcodingJobId,
  );

  if (processingVideos.length === 0) return;

  try {
    // Get user's AWS credentials
    const awsCredentials = await prisma.awsCredentials.findUnique({
      where: { userId },
    });

    if (!awsCredentials) return;

    const credentials = {
      accessKeyId: decrypt(awsCredentials.accessKeyId),
      secretAccessKey: decrypt(awsCredentials.secretAccessKey),
      region: awsCredentials.region,
    };

    // Create MediaConvert client (we need the endpoint first)
    const { createMediaConvertClient } = await import("@/lib/aws-services");
    const mediaConvertClient = await createMediaConvertClient({
      ...credentials,
      bucketName: awsCredentials.bucketName,
    });

    // Check each processing video
    for (const video of processingVideos) {
      try {
        const command = new GetJobCommand({ Id: video.transcodingJobId });
        const response = await mediaConvertClient.send(command);

        const jobStatus = response.Job?.Status;

        if (jobStatus === "COMPLETE") {
          await prisma.video.update({
            where: { id: video.id },
            data: { transcodingStatus: "COMPLETED" },
          });
        } else if (jobStatus === "ERROR" || jobStatus === "CANCELED") {
          await prisma.video.update({
            where: { id: video.id },
            data: { transcodingStatus: "FAILED" },
          });
        }
      } catch (error) {
        console.error(`Error checking job ${video.transcodingJobId}:`, error);
      }
    }
  } catch (error) {
    console.error("Error updating processing videos:", error);
  }
}
