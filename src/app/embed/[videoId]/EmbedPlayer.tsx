"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface EmbedPlayerProps {
  videoId: string;
  manifestKey: string;
  autoplay: boolean;
  muted: boolean;
}

export default function EmbedPlayer({
  videoId,
  autoplay,
  muted,
}: EmbedPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVideo = async () => {
      try {
        // Get the public video metadata
        const response = await fetch(`/api/embed/${videoId}/stream`);

        if (!response.ok) {
          const data = await response.json();
          setError(data.error || "Failed to load video");
          setLoading(false);
          return;
        }

        const { hlsManifestKey } = await response.json();

        if (!hlsManifestKey) {
          setError("Video stream not available");
          setLoading(false);
          return;
        }

        // Use streaming proxy endpoint to load all HLS segments
        const streamUrl = `/api/embed/${videoId}/stream/${hlsManifestKey}`;

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
            if (autoplay && videoRef.current) {
              videoRef.current.play().catch((err) => {
                console.warn("Autoplay failed:", err);
              });
            }
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  console.warn("Network error, attempting recovery...");
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  console.warn("Media error, attempting recovery...");
                  hls.recoverMediaError();
                  break;
                default:
                  setError("Failed to load video");
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
            if (autoplay && videoRef.current) {
              videoRef.current.play().catch((err) => {
                console.warn("Autoplay failed:", err);
              });
            }
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
  }, [videoId, autoplay]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.9)",
            color: "white",
            fontSize: "1.125rem",
          }}
        >
          Loading video...
        </div>
      )}

      {error && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#1f2937",
            color: "#ef4444",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      {!error && (
        <video
          ref={videoRef}
          controls
          muted={muted}
          style={{
            width: "100%",
            height: "100%",
            display: loading ? "none" : "block",
          }}
        >
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}
