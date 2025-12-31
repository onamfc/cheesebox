import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EmbedPlayer from "./EmbedPlayer";

interface EmbedPageProps {
  params: Promise<{
    videoId: string;
  }>;
  searchParams: Promise<{
    autoplay?: string;
    muted?: string;
  }>;
}

export default async function EmbedPage({
  params,
  searchParams,
}: EmbedPageProps) {
  const { videoId } = await params;
  const search = await searchParams;

  // Fetch video - must be public
  const video = await prisma.video.findUnique({
    where: {
      id: videoId,
      visibility: "PUBLIC", // Only public videos can be embedded
      transcodingStatus: "COMPLETED", // Only show completed videos
    },
    select: {
      id: true,
      title: true,
      description: true,
      hlsManifestKey: true,
    },
  });

  if (!video || !video.hlsManifestKey) {
    notFound();
  }

  // Parse query parameters
  const autoplay = search.autoplay === "true";
  const muted = search.muted === "true" || autoplay; // Auto-mute if autoplay

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{video.title} - Cheesebox</title>
        <meta
          name="description"
          content={video.description || `Watch ${video.title}`}
        />
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: #000;
          }

          #embed-root {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </head>
      <body>
        <div id="embed-root">
          <EmbedPlayer
            videoId={video.id}
            manifestKey={video.hlsManifestKey}
            autoplay={autoplay}
            muted={muted}
          />
        </div>
      </body>
    </html>
  );
}

// Disable static optimization for this page
export const dynamic = "force-dynamic";
