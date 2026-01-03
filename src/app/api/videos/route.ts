import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";
import {
  MediaConvertClient,
  GetJobCommand,
} from "@aws-sdk/client-mediaconvert";
import { getAuthUser } from "@/lib/auth-helpers";

// GET - Retrieve user's videos and videos shared with them
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "owned"; // 'owned' or 'shared'
    const teamId = searchParams.get("teamId"); // Optional filter by team
    const groupId = searchParams.get("groupId"); // Optional filter by group

    if (type === "owned") {
      // Build where clause with optional team filter
      const whereClause: any = { userId: user.id };

      if (teamId === "personal") {
        // Filter for personal videos only (no team)
        whereClause.teamId = null;
      } else if (teamId) {
        // Filter for specific team
        whereClause.teamId = teamId;
      }
      // If no teamId specified, show all videos (personal + all teams)

      // Get user's own videos
      const videos = await prisma.video.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        include: {
          shares: {
            select: {
              sharedWithEmail: true,
              createdAt: true,
            },
          },
          groupShares: {
            select: {
              id: true,
              createdAt: true,
              group: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      // Check MediaConvert status for processing videos
      await updateProcessingVideos(videos, user.id);

      // Refetch videos to get updated status
      const updatedVideos = await prisma.video.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        include: {
          shares: {
            select: {
              sharedWithEmail: true,
              createdAt: true,
            },
          },
          groupShares: {
            select: {
              id: true,
              createdAt: true,
              group: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      return NextResponse.json(updatedVideos);
    } else if (type === "group" && groupId) {
      // Get videos shared with a specific group
      // First, verify user is a member of the group
      const groupMember = await prisma.shareGroupMember.findFirst({
        where: {
          groupId,
          email: user.email,
        },
      });

      const group = await prisma.shareGroup.findUnique({
        where: { id: groupId },
      });

      // Check if user owns the group OR is a member
      if (!group || (group.userId !== user.id && !groupMember)) {
        return NextResponse.json(
          { error: "You don't have access to this group" },
          { status: 403 }
        );
      }

      // Get all videos shared with this group
      const groupShares = await prisma.videoGroupShare.findMany({
        where: { groupId },
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

      const videos = groupShares.map((share) => ({
        ...share.video,
        sharedBy: share.video.owner.email,
        sharedAt: share.createdAt.toISOString(),
      }));

      return NextResponse.json(videos);
    } else if (type === "shared") {
      // Get videos shared with the user directly
      const directShares = await prisma.videoShare.findMany({
        where: { sharedWithEmail: user.email },
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

      // Get videos shared via groups where user's email is a member
      const groupShares = await prisma.videoGroupShare.findMany({
        where: {
          group: {
            members: {
              some: {
                email: user.email,
              },
            },
          },
        },
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
          group: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      // Combine and deduplicate videos
      const videoMap = new Map();

      directShares.forEach((share) => {
        if (!videoMap.has(share.video.id)) {
          videoMap.set(share.video.id, {
            ...share.video,
            sharedBy: share.video.owner.email,
            sharedAt: share.createdAt,
            sharedVia: "direct",
          });
        }
      });

      groupShares.forEach((share) => {
        if (!videoMap.has(share.video.id)) {
          videoMap.set(share.video.id, {
            ...share.video,
            sharedBy: share.video.owner.email,
            sharedAt: share.createdAt,
            sharedVia: "group",
            groupName: share.group.name,
          });
        }
      });

      const videos = Array.from(videoMap.values()).sort(
        (a, b) =>
          new Date(b.sharedAt).getTime() - new Date(a.sharedAt).getTime()
      );

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
    // Get user's AWS credentials (either directly owned or through a team)
    let awsCredentials = await prisma.awsCredentials.findUnique({
      where: { userId },
    });

    // If no direct credentials, check if user belongs to a team with credentials
    if (!awsCredentials) {
      const teamMembership = await prisma.teamMember.findFirst({
        where: { userId },
        include: {
          team: {
            include: {
              awsCredentials: true,
            },
          },
        },
      });

      awsCredentials = teamMembership?.team?.awsCredentials ?? null;
    }

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
