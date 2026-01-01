"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
  videoId: string;
  onClose: () => void;
}

export default function VideoPlayer({ videoId, onClose }: VideoPlayerProps) {
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

        // Use our streaming proxy endpoint instead of pre-signed URLs
        // This allows HLS.js to load all segments through our authenticated proxy
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
          setError("HLS is not supported in this browser");
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
    <div className="fixed inset-0 bg-black bg-opacity-75 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 w-full max-w-5xl">
        <div className="bg-black rounded-lg overflow-hidden">
          <div className="flex justify-end p-2">
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300"
            >
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {loading && (
            <div className="flex items-center justify-center h-96">
              <div className="text-white text-lg">Loading video...</div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-96">
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {!error && (
            <video
              ref={videoRef}
              controls
              className="w-full"
              style={{ display: loading ? "none" : "block" }}
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>
    </div>
  );
}
