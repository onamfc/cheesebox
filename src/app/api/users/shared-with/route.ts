import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all videos owned by the user
    const userVideos = await prisma.video.findMany({
      where: { userId: user.id },
      select: { id: true },
    });

    const videoIds = userVideos.map((v) => v.id);

    // Get all unique emails this user has shared videos with
    const shares = await prisma.videoShare.findMany({
      where: {
        videoId: { in: videoIds },
      },
      select: {
        sharedWithEmail: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get unique emails with most recent share date
    const emailMap = new Map<string, Date>();
    for (const share of shares) {
      if (!emailMap.has(share.sharedWithEmail)) {
        emailMap.set(share.sharedWithEmail, share.createdAt);
      }
    }

    // Convert to array and sort by most recent
    const uniqueEmails = Array.from(emailMap.entries())
      .map(([email, lastSharedAt]) => ({
        email,
        lastSharedAt: lastSharedAt.toISOString(),
      }))
      .sort((a, b) => new Date(b.lastSharedAt).getTime() - new Date(a.lastSharedAt).getTime());

    return NextResponse.json(uniqueEmails);
  } catch (error) {
    console.error("Error fetching shared-with users:", error);
    return NextResponse.json(
      { error: "Failed to fetch shared-with users" },
      { status: 500 }
    );
  }
}
