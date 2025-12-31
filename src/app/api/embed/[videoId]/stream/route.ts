import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    videoId: string;
  }>;
}

/**
 * GET /api/embed/[videoId]/stream
 *
 * Public endpoint for getting stream metadata for embeddable videos.
 * Returns the manifest filename to construct the streaming proxy URL.
 * No authentication required - only works for PUBLIC videos.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { videoId } = await params;

    // Fetch video - must be PUBLIC and COMPLETED
    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
        visibility: "PUBLIC",
        transcodingStatus: "COMPLETED",
      },
      select: {
        id: true,
        title: true,
        hlsManifestKey: true,
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

    // Extract manifest filename
    const manifestFilename = video.hlsManifestKey.split("/").pop();

    if (!manifestFilename) {
      return NextResponse.json(
        { error: "Invalid manifest path" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      manifestFilename,
      videoId: video.id,
      title: video.title,
    });
  } catch (error) {
    console.error("Error getting embed stream metadata:", error);
    return NextResponse.json(
      { error: "Failed to get video stream" },
      { status: 500 }
    );
  }
}
