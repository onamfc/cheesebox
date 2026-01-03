import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import WatchPageClient from "./WatchPageClient";

interface WatchPageProps {
  params: Promise<{
    videoId: string;
  }>;
}

export default async function WatchPage({ params }: WatchPageProps) {
  const session = await getServerSession(authOptions);

  // Require authentication
  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const { videoId } = await params;

  // Fetch video and check access
  const video = await prisma.video.findFirst({
    where: {
      id: videoId,
      transcodingStatus: "COMPLETED", // Only show completed videos
    },
  });

  if (!video) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Video Not Found</h1>
          <p className="text-gray-400 mb-6">
            This video doesn't exist or is still being processed.
          </p>
          <a
            href="/dashboard"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  // Check if user is the owner
  const owner = await prisma.user.findUnique({
    where: { id: video.userId },
    select: { email: true },
  });

  const isOwner = owner?.email === session.user.email;

  // Check if video is directly shared with user
  const directShare = await prisma.videoShare.findFirst({
    where: {
      videoId: video.id,
      sharedWithEmail: session.user.email,
    },
  });

  // Check if video is shared via a group
  const groupShare = await prisma.videoGroupShare.findFirst({
    where: {
      videoId: video.id,
      group: {
        members: {
          some: {
            email: session.user.email,
          },
        },
      },
    },
  });

  // Check if user has access
  const hasAccess = isOwner || !!directShare || !!groupShare;

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">
            You don't have permission to view this video.
          </p>
          <a
            href="/dashboard"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  // User has access - render the video player
  return (
    <WatchPageClient
      videoId={video.id}
      title={video.title}
      description={video.description}
    />
  );
}

// Disable static optimization
export const dynamic = "force-dynamic";
