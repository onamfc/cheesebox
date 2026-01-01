import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-helpers";

// DELETE /api/videos/[id]/group-shares/[groupId] - Unshare from group
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; groupId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: videoId, groupId } = await params;

    // Get the video
    const video = await prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Check if user is the owner
    if (video.userId !== user.id) {
      return NextResponse.json(
        { error: "Only the video owner can unshare it" },
        { status: 403 }
      );
    }

    // Delete group share
    await prisma.videoGroupShare.delete({
      where: {
        videoId_groupId: {
          videoId,
          groupId,
        },
      },
    });

    return NextResponse.json({ message: "Video unshared from group successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Video not shared with this group" },
        { status: 404 }
      );
    }
    console.error("Error unsharing video from group:", error);
    return NextResponse.json(
      { error: "Failed to unshare video from group" },
      { status: 500 }
    );
  }
}
