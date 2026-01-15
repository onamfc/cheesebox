"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import Input from "./ui/Input";
import { useTheme } from "@/contexts/ThemeContext";
import { theme as defaultTheme } from "@/themes/asiago/theme";
import { fetchCsrfToken } from "@/lib/csrf-client";
import dev from "@onamfc/developer-log";

type RecordingMode = "webcam" | "screen";
type RecordingState = "idle" | "countdown" | "recording" | "preview" | "uploading";
type ErrorType =
  | "screen-permission-denied"
  | "webcam-permission-denied"
  | "screen-not-found"
  | "webcam-not-found"
  | "screen-unknown"
  | "webcam-unknown"
  | string
  | null;

interface VideoRecorderProps {
  onComplete?: () => void;
  initialMode?: RecordingMode;
}

interface Group {
  id: string;
  name: string;
}

export default function VideoRecorder({ onComplete, initialMode }: VideoRecorderProps) {
  const router = useRouter();
  const { themeConfig } = useTheme();
  // Use themeConfig if available, otherwise fallback to default theme
  const gradients = themeConfig?.gradients || defaultTheme.gradients;
  const components = themeConfig?.components || defaultTheme.components;
  const [recordingMode, setRecordingMode] = useState<RecordingMode | null>(null);
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [countdown, setCountdown] = useState<number>(3);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<ErrorType>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const webcamPreviewRef = useRef<HTMLVideoElement>(null);
  const screenPreviewRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedRecordingRef = useRef<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Cleanup streams on unmount
  useEffect(() => {
    return () => {
      stopAllStreams();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  // Load groups when entering preview state
  useEffect(() => {
    if (recordingState === "preview") {
      loadGroups();
    }
  }, [recordingState]);

  // Auto-start recording if initialMode is provided
  useEffect(() => {
    if (initialMode && recordingState === "idle" && !hasStartedRecordingRef.current) {
      hasStartedRecordingRef.current = true;
      handleModeSelect(initialMode);
    }
  }, [initialMode, recordingState]);

  // Attach streams to video elements when they mount
  useEffect(() => {
    if (streamRef.current && webcamPreviewRef.current && recordingMode === "webcam") {
      webcamPreviewRef.current.srcObject = streamRef.current;
    }
    if (streamRef.current && screenPreviewRef.current && recordingMode === "screen") {
      screenPreviewRef.current.srcObject = streamRef.current;
    }
  }, [recordingState, recordingMode]);

  const loadGroups = async () => {
    try {
      const res = await fetch("/api/groups");
      if (res.ok) {
        const data = await res.json();
        setGroups(data);
      }
    } catch (err) {
      dev.error("Failed to load groups:", err, { tag: "video" });
    }
  };

  const toggleGroup = (groupId: string) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const stopAllStreams = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach((track) => track.stop());
      webcamStreamRef.current = null;
    }
  };

  const startCountdown = (onComplete: () => void) => {
    setCountdown(3);
    setRecordingState("countdown");

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
          }
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const compositeStreamsToCanvas = (
    screenVideo: HTMLVideoElement,
    webcamVideo: HTMLVideoElement
  ): MediaStream | null => {
    // Create canvas if it doesn't exist
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Set canvas size to match screen video
    canvas.width = 1920;
    canvas.height = 1080;

    // Define webcam overlay size and position (bottom-right corner)
    const webcamWidth = 320;
    const webcamHeight = 240;
    const webcamX = canvas.width - webcamWidth - 20;
    const webcamY = canvas.height - webcamHeight - 20;

    const drawFrame = () => {
      // Draw screen video (full canvas)
      ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);

      // Draw webcam video (overlay in bottom-right)
      ctx.save();
      // Add a border
      ctx.strokeStyle = "white";
      ctx.lineWidth = 4;
      ctx.strokeRect(webcamX - 2, webcamY - 2, webcamWidth + 4, webcamHeight + 4);
      // Draw webcam
      ctx.drawImage(webcamVideo, webcamX, webcamY, webcamWidth, webcamHeight);
      ctx.restore();

      // Continue animation
      animationFrameRef.current = requestAnimationFrame(drawFrame);
    };

    // Start drawing
    drawFrame();

    // Return canvas stream
    return canvas.captureStream(30); // 30 FPS
  };

  const startWebcamRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1920, height: 1080 },
        audio: true,
      });

      streamRef.current = stream;
      if (webcamPreviewRef.current) {
        webcamPreviewRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setVideoBlob(blob);
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setRecordingState("preview");
        stopAllStreams();
      };

      // Start countdown before recording
      startCountdown(() => {
        if (mediaRecorder.state !== "recording") {
          mediaRecorder.start();
          setRecordingState("recording");
          startTimer();
        }
      });
    } catch (err: any) {
      dev.error("Error starting webcam recording:", err, { tag: "video" });

      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("webcam-permission-denied");
      } else if (err.name === "NotFoundError") {
        setError("webcam-not-found");
      } else {
        setError("webcam-unknown");
      }
      setRecordingMode(null);
    }
  };

  const startScreenRecording = async () => {
    try {
      setError(null);
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { width: 1920, height: 1080 },
        audio: true,
      });

      streamRef.current = screenStream;
      if (screenPreviewRef.current) {
        screenPreviewRef.current.srcObject = screenStream;
      }

      const mediaRecorder = new MediaRecorder(screenStream, {
        mimeType: "video/webm;codecs=vp9",
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setVideoBlob(blob);
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setRecordingState("preview");
        stopAllStreams();
      };

      // Handle user stopping screen share via browser UI
      screenStream.getVideoTracks()[0].addEventListener("ended", () => {
        if (mediaRecorderRef.current?.state === "recording") {
          stopRecording();
        }
      });

      // Start countdown before recording
      startCountdown(() => {
        if (mediaRecorder.state !== "recording") {
          mediaRecorder.start();
          setRecordingState("recording");
          startTimer();
        }
      });
    } catch (err: any) {
      dev.error("Error starting screen recording:", err, { tag: "video" });

      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("screen-permission-denied");
      } else if (err.name === "NotFoundError") {
        setError("screen-not-found");
      } else if (err.message?.includes("cancelled")) {
        // User cancelled the screen share dialog - not an error
        setRecordingMode(null);
        return;
      } else {
        setError("screen-unknown");
      }
      setRecordingMode(null);
    }
  };

  const startTimer = () => {
    const startTime = Date.now();
    timerIntervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setRecordingDuration(elapsed);
    }, 100);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    // Stop canvas animation if running
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const handleModeSelect = async (mode: RecordingMode) => {
    setRecordingMode(mode);
    if (mode === "webcam") {
      await startWebcamRecording();
    } else if (mode === "screen") {
      await startScreenRecording();
    }
  };

  const handleRetake = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoBlob(null);
    setVideoUrl(null);
    setRecordingDuration(0);
    setRecordingMode(null);
    setRecordingState("idle");
    setTitle("");
    setSelectedGroups([]);
  };

  const handleUpload = async () => {
    if (!videoBlob) return;

    try {
      setRecordingState("uploading");
      setUploadProgress(0);

      const filename = `recording-${Date.now()}.webm`;
      const videoTitle = title || `Recording ${new Date().toLocaleString()}`;

      // Step 1: Request presigned URL from backend
      dev.log("Step 1: Requesting presigned URL...", { tag: "video-upload" });
      const uploadUrlResponse = await fetch("/api/videos/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: filename,
          fileType: "video/webm",
          fileSize: videoBlob.size,
          title: videoTitle,
          description: null,
        }),
      });

      if (!uploadUrlResponse.ok) {
        const errorData = await uploadUrlResponse.json();
        throw new Error(errorData.error || "Failed to get upload URL");
      }

      const { videoId, uploadUrl, originalKey, outputKeyPrefix } = await uploadUrlResponse.json();
      dev.log("Step 1 complete: Presigned URL received", { videoId }, { tag: "video-upload" });

      // Step 2: Upload directly to S3 using presigned URL
      dev.log("Step 2: Uploading to S3...", { size: videoBlob.size }, { tag: "video-upload" });
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
          dev.log(`Upload progress: ${progress}%`, { tag: "video-upload" });
        }
      });

      // Handle upload completion
      const uploadPromise = new Promise<void>((resolve, reject) => {
        xhr.addEventListener("load", () => {
          if (xhr.status === 200) {
            dev.log("Step 2 complete: S3 upload successful", { tag: "video-upload" });
            resolve();
          } else {
            const errorMsg = `S3 upload failed with status ${xhr.status}`;
            dev.error(errorMsg, { status: xhr.status, response: xhr.responseText }, { tag: "video-upload" });
            reject(new Error(errorMsg));
          }
        });

        xhr.addEventListener("error", () => {
          dev.error("Network error during S3 upload", { tag: "video-upload" });
          reject(new Error("Network error. Please check your connection and try again."));
        });

        xhr.addEventListener("abort", () => {
          dev.error("Upload aborted", { tag: "video-upload" });
          reject(new Error("Upload cancelled"));
        });
      });

      xhr.open("PUT", uploadUrl);
      xhr.send(videoBlob);

      await uploadPromise;

      // Step 3: Notify backend to start transcoding
      dev.log("Step 3: Starting transcoding...", { videoId }, { tag: "video-upload" });
      const completeResponse = await fetch("/api/videos/complete-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId,
          originalKey,
          outputKeyPrefix,
        }),
      });

      if (!completeResponse.ok) {
        const errorData = await completeResponse.json();
        throw new Error(errorData.error || "Failed to start transcoding");
      }

      dev.log("Step 3 complete: Transcoding started", { videoId }, { tag: "video-upload" });

      // Share with selected groups if any
      if (selectedGroups.length > 0) {
        dev.log(`Sharing with ${selectedGroups.length} groups`, { videoId, groups: selectedGroups }, { tag: "video-upload" });
        for (const groupId of selectedGroups) {
          try {
            await fetch(`/api/videos/${videoId}/share`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ groupId }),
            });
          } catch (err) {
            dev.error(`Failed to share with group ${groupId}:`, err, { tag: "video" });
          }
        }
      }

      // Success! Navigate to dashboard
      dev.log("Upload complete!", { videoId }, { tag: "video-upload" });
      if (onComplete) {
        onComplete();
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      dev.error("Upload error:", err, { tag: "video-upload" });
      const errorMessage = err instanceof Error ? err.message : "Upload failed. Please try again.";
      setError(errorMessage);
      setRecordingState("preview");
      setUploadProgress(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getErrorMessage = () => {
    switch (error) {
      case "screen-permission-denied":
        return {
          title: "Screen Recording Permission Required",
          message: (
            <div className="space-y-3">
              <p>Your browser needs permission to record your screen.</p>
              <div className="bg-gray-800 p-4 rounded-lg text-sm space-y-2">
                <p className="font-semibold text-white">macOS Setup Instructions:</p>
                <ol className="list-decimal list-inside space-y-1 text-gray-300">
                  <li>Open <strong>System Settings</strong></li>
                  <li>Go to <strong>Privacy & Security → Screen Recording</strong></li>
                  <li>Enable the toggle for <strong>Google Chrome</strong> (or your browser)</li>
                  <li><strong>Quit and reopen</strong> your browser completely</li>
                  <li>Try recording again</li>
                </ol>
              </div>
              <p className="text-sm">This is a one-time setup. After granting permission, screen recording will work smoothly.</p>
            </div>
          ),
        };

      case "webcam-permission-denied":
        return {
          title: "Camera Permission Required",
          message: (
            <div className="space-y-3">
              <p>Your browser needs permission to access your camera and microphone.</p>
              <div className="bg-gray-800 p-4 rounded-lg text-sm space-y-2">
                <p className="font-semibold text-white">How to fix:</p>
                <ol className="list-decimal list-inside space-y-1 text-gray-300">
                  <li>Look for the camera icon in your browser's address bar</li>
                  <li>Click it and select <strong>"Allow"</strong></li>
                  <li>Reload the page and try again</li>
                </ol>
              </div>
              <p className="text-sm">If you blocked access before, you may need to change it in your browser settings.</p>
            </div>
          ),
        };

      case "webcam-not-found":
        return {
          title: "No Camera Found",
          message: "No camera was detected on your device. Please connect a webcam and try again.",
        };

      case "screen-not-found":
        return {
          title: "Screen Recording Not Available",
          message: "Screen recording is not supported in your browser. Try using Chrome, Edge, or Firefox.",
        };

      case "webcam-unknown":
        return {
          title: "Camera Error",
          message: "An unexpected error occurred while accessing your camera. Please try again or use a different browser.",
        };

      case "screen-unknown":
        return {
          title: "Screen Recording Error",
          message: "An unexpected error occurred while starting screen recording. Please try again.",
        };

      default:
        // Handle generic string errors (like upload errors)
        return {
          title: "Error",
          message: typeof error === "string" ? error : "An unknown error occurred. Please try again.",
        };
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[100]">
      {/* Mode Selection Screen or Loading */}
      {recordingState === "idle" && (
        <div className="h-full flex flex-col items-center justify-center p-8">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size={components.buttonSize}
            className="absolute top-4 left-4 !border-0 !text-white hover:!text-gray-300 !bg-transparent hover:!bg-transparent"
          >
            ✕ Close
          </Button>

          {/* Hidden video elements for stream loading */}
          {recordingMode && (
            <div className="hidden">
              <video ref={screenPreviewRef} autoPlay muted playsInline />
              <video ref={webcamPreviewRef} autoPlay muted playsInline />
            </div>
          )}

          {recordingMode ? (
            // Loading state while waiting for recording to start
            <>
              <h1 className="text-3xl font-bold text-white mb-8">Starting Recording...</h1>
              <div className="text-white text-lg">Please allow camera/screen access when prompted</div>
            </>
          ) : (
            // Mode selection
            <>
              <h1 className="text-3xl font-bold text-white mb-8">Record Video</h1>

              {error && (
                <div className="mb-6 p-6 bg-red-500/10 border-2 border-red-500 rounded-xl text-white max-w-2xl">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">⚠️</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3">{getErrorMessage().title}</h3>
                      <div className="text-gray-200">{getErrorMessage().message}</div>
                      <Button
                        onClick={() => setError(null)}
                        variant="danger"
                        size={components.buttonSize}
                        className="mt-4"
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid gap-6 max-w-2xl w-full">
            <button
              onClick={() => handleModeSelect("webcam")}
              className={`p-8 bg-gradient-to-br ${gradients.primary} rounded-xl text-white transition-all transform hover:scale-105 shadow-lg`}
            >
              <div className="text-4xl mb-4">📹</div>
              <h2 className="text-2xl font-bold mb-2">Webcam</h2>
              <p className={gradients.primaryText}>Record using your camera and microphone</p>
            </button>

            <button
              onClick={() => handleModeSelect("screen")}
              className={`p-8 bg-gradient-to-br ${gradients.primary} rounded-xl text-white transition-all transform hover:scale-105 shadow-lg`}
            >
              <div className="text-4xl mb-4">🖥️</div>
              <h2 className="text-2xl font-bold mb-2">Screen Recording</h2>
              <p className={gradients.primaryText}>Record your screen with audio</p>
            </button>

          </div>
            </>
          )}
        </div>
      )}

      {/* Countdown Screen */}
      {recordingState === "countdown" && (
        <div className="h-full flex flex-col relative">
          <div className="flex-1 relative bg-black">
            {/* Show preview behind countdown */}
            {recordingMode === "webcam" && (
              <video
                ref={webcamPreviewRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-contain opacity-50 scale-x-[-1]"
              />
            )}

            {recordingMode === "screen" && (
              <video
                ref={screenPreviewRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-contain opacity-50"
              />
            )}

            {/* Large countdown number */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white font-bold text-[250px] animate-pulse">
                {countdown}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recording Screen */}
      {recordingState === "recording" && (
        <div className="h-full flex flex-col">
          <div className="flex-1 relative bg-black max-h-[calc(100vh-100px)]">
            {recordingMode === "webcam" && (
              <video
                ref={webcamPreviewRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-contain scale-x-[-1]"
              />
            )}

            {recordingMode === "screen" && (
              <video
                ref={screenPreviewRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-contain"
              />
            )}

            {/* Recording Indicator */}
            <div className="absolute top-4 left-4 flex items-center gap-3 bg-black/70 px-4 py-2 rounded-full">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white font-mono text-lg">{formatTime(recordingDuration)}</span>
            </div>
          </div>

          {/* Recording Controls */}
          <div className="bg-gray-900 p-6 flex justify-center relative z-50">
            <Button
              onClick={stopRecording}
              variant="danger"
              size="lg"
              className="!rounded-full px-8"
            >
              ⏹ Stop Recording
            </Button>
          </div>
        </div>
      )}

      {/* Preview Screen */}
      {recordingState === "preview" && videoUrl && (
        <div className="h-full overflow-y-auto bg-gray-900">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="bg-red-500/10 border-2 border-red-500 rounded-xl p-6 text-white">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">⚠️</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Upload Failed</h3>
                    <p className="text-gray-200 mb-4">{error}</p>
                    <Button
                      onClick={() => setError(null)}
                      variant="danger"
                      size={components.buttonSize}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-black rounded-lg overflow-hidden">
              <video
                ref={videoPreviewRef}
                src={videoUrl}
                controls
                className="w-full"
                style={{ maxHeight: "60vh" }}
              />
            </div>

            <div className="space-y-4">
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a title (optional)"
                className="bg-gray-800 text-white border-gray-700 focus:border-purple-500 placeholder-gray-400"
              />

              {/* Group Selection */}
              {groups.length > 0 && (
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="text-white font-semibold mb-3">Share with Groups (optional)</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {groups.map((group) => (
                      <label
                        key={group.id}
                        className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedGroups.includes(group.id)}
                          onChange={() => toggleGroup(group.id)}
                          className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-brand-accent focus:ring-brand-accent focus:ring-offset-gray-900"
                        />
                        <span>{group.name}</span>
                      </label>
                    ))}
                  </div>
                  {selectedGroups.length > 0 && (
                    <p className="text-sm text-gray-400 mt-2">
                      Will be shared with {selectedGroups.length} group{selectedGroups.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  onClick={handleRetake}
                  variant="secondary"
                  size={components.buttonSize}
                  className="flex-1"
                >
                  Retake
                </Button>
                <Button
                  onClick={handleUpload}
                  variant="secondary"
                  size={components.buttonSize}
                  className="flex-1"
                >
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Uploading Screen */}
      {recordingState === "uploading" && (
        <div className="h-full flex flex-col items-center justify-center bg-gray-900">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="secondary"
            size={components.buttonSize}
            className="absolute top-4 right-4"
          >
            ← Back to Dashboard
          </Button>
          <div className="text-center">
            <div className="mb-4 text-6xl">⬆️</div>
            <h2 className="text-2xl font-bold text-white mb-4">Uploading...</h2>
            <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-gray-400 mt-2">{uploadProgress}%</p>
            <p className="text-sm text-gray-500 mt-4">
              You can navigate back to the dashboard. The upload will continue in the background.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
