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
    let videoElement: HTMLVideoElement | null = null;
    let isCancelled = false;
    const handlePlaying = () => {
      setLoading(false);
    };

    const loadVideo = async () => {
      try {
        // Get video metadata to construct streaming URL
        const response = await fetch(`/api/videos/${videoId}/presigned-url`);

        // Check if component was unmounted
        if (isCancelled) return;

        if (!response.ok) {
          const data = await response.json();
          if (isCancelled) return;
          setError(data.error || "Failed to load video");
          setLoading(false);
          return;
        }

        const { hlsManifestKey } = await response.json();

        // Check if component was unmounted
        if (isCancelled) return;

        if (!hlsManifestKey) {
          setError("Video manifest not found");
          setLoading(false);
          return;
        }

        // Use our streaming proxy endpoint instead of pre-signed URLs
        // This allows HLS.js to load all segments through our authenticated proxy
        const streamUrl = `/api/videos/${videoId}/stream/${hlsManifestKey}`;

        if (!videoRef.current) return;
        videoElement = videoRef.current;

        // Add event listener to hide loading screen when video actually starts playing
        videoElement.addEventListener('playing', handlePlaying);

        // Initialize HLS
        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
          });

          hlsRef.current = hls;
          hls.loadSource(streamUrl);
          hls.attachMedia(videoElement);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoElement?.play();
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  setError("Network error occurred while loading video");
                  setLoading(false);
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  setError("Media error occurred");
                  setLoading(false);
                  hls.recoverMediaError();
                  break;
                default:
                  setError("Fatal error occurred");
                  setLoading(false);
                  hls.destroy();
                  break;
              }
            }
          });
        } else if (
          videoElement.canPlayType("application/vnd.apple.mpegurl")
        ) {
          // Native HLS support (Safari)
          videoElement.src = streamUrl;
          videoElement.addEventListener("loadedmetadata", () => {
            videoElement?.play();
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
      // Mark as cancelled to prevent state updates after unmount
      isCancelled = true;
      // Clean up event listener
      if (videoElement) {
        videoElement.removeEventListener('playing', handlePlaying);
      }
      // Clean up HLS
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 overflow-y-auto h-full w-full z-[9999]">
      <div className="relative top-10 mx-auto p-5 w-full max-w-5xl">
        <div className="bg-black rounded-lg overflow-hidden">
          <div className="flex justify-end p-2">
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 relative z-10"
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
            <div className="flex flex-col items-center justify-center h-96 space-y-6">
              {/* Loading Spinner */}
              <div className="w-24 h-24 border-4 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin"></div>

              {/* Loading text */}
              <div className="text-center">
                <p className="text-white text-xl font-semibold mb-2">Loading your video...</p>
                <p className="text-gray-400 text-sm">Preparing the cheesiest experience</p>
              </div>
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
