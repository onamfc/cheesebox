import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{
    videoId: string;
  }>;
}

/**
 * PATCH /api/videos/[videoId]/visibility
 *
 * Update video visibility (PRIVATE or PUBLIC)
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { videoId } = await params;
    const body = await request.json();
    const { visibility } = body;

    if (!visibility || !["PRIVATE", "PUBLIC"].includes(visibility)) {
      return NextResponse.json(
        { error: "Invalid visibility value" },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if video exists and belongs to user
    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
        userId: user.id,
      },
    });

    if (!video) {
      return NextResponse.json(
        { error: "Video not found or access denied" },
        { status: 404 }
      );
    }

    // Only allow changing visibility for completed videos
    if (video.transcodingStatus !== "COMPLETED") {
      return NextResponse.json(
        { error: "Cannot change visibility of incomplete video" },
        { status: 400 }
      );
    }

    // Update visibility
    await prisma.video.update({
      where: { id: videoId },
      data: { visibility },
    });

    return NextResponse.json({ success: true, visibility });
  } catch (error) {
    console.error("Error updating video visibility:", error);
    return NextResponse.json(
      { error: "Failed to update visibility" },
      { status: 500 }
    );
  }
}
