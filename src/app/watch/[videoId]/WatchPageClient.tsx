"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Hls from "hls.js";

interface WatchPageClientProps {
  videoId: string;
  title: string;
  description: string | null;
}

export default function WatchPageClient({
  videoId,
  title,
  description,
}: WatchPageClientProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVideo = async () => {
      try {
        // Get video metadata to construct streaming URL
        const response = await fetch(`/api/videos/${videoId}/presigned-url`);

        if (!response.ok) {
          const data = await response.json();
          setError(data.error || "Failed to load video");
          setLoading(false);
          return;
        }

        const { hlsManifestKey } = await response.json();

        if (!hlsManifestKey) {
          setError("Video manifest not found");
          setLoading(false);
          return;
        }

        // Use our streaming proxy endpoint
        const streamUrl = `/api/videos/${videoId}/stream/${hlsManifestKey}`;

        if (!videoRef.current) return;

        // Initialize HLS
        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
          });

          hlsRef.current = hls;
          hls.loadSource(streamUrl);
          hls.attachMedia(videoRef.current);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setLoading(false);
            videoRef.current?.play();
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  setError("Network error occurred while loading video");
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  setError("Media error occurred");
                  hls.recoverMediaError();
                  break;
                default:
                  setError("Fatal error occurred");
                  hls.destroy();
                  break;
              }
            }
          });
        } else if (
          videoRef.current.canPlayType("application/vnd.apple.mpegurl")
        ) {
          // Native HLS support (Safari)
          videoRef.current.src = streamUrl;
          videoRef.current.addEventListener("loadedmetadata", () => {
            setLoading(false);
            videoRef.current?.play();
          });
        } else {
          setError("Your browser doesn't support HLS video playback");
          setLoading(false);
        }
      } catch (err) {
        setError("Failed to load video");
        setLoading(false);
      }
    };

    loadVideo();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [videoId]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-white truncate">{title}</h1>
          {description && (
            <p className="text-sm text-gray-400 truncate">{description}</p>
          )}
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="ml-4 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Video Player */}
      <div className="flex-1 flex items-center justify-center p-4">
        {loading && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
            <p className="text-white">Loading video...</p>
          </div>
        )}

        {error && (
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="w-full max-w-6xl">
            <video
              ref={videoRef}
              controls
              className="w-full rounded-lg shadow-2xl"
              style={{ maxHeight: "calc(100vh - 120px)" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
