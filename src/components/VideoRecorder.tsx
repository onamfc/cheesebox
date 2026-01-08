"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import Input from "./ui/Input";
import { theme } from "@/config/theme";

type RecordingMode = "webcam" | "screen" | "screen-webcam";
type RecordingState = "idle" | "recording" | "preview" | "uploading";
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
}

interface Group {
  id: string;
  name: string;
}

export default function VideoRecorder({ onComplete }: VideoRecorderProps) {
  const router = useRouter();
  const [recordingMode, setRecordingMode] = useState<RecordingMode | null>(null);
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
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

  // Cleanup streams on unmount
  useEffect(() => {
    return () => {
      stopAllStreams();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  // Load groups when entering preview state
  useEffect(() => {
    if (recordingState === "preview") {
      loadGroups();
    }
  }, [recordingState]);

  const loadGroups = async () => {
    try {
      const res = await fetch("/api/groups");
      if (res.ok) {
        const data = await res.json();
        setGroups(data);
      }
    } catch (err) {
      console.error("Failed to load groups:", err);
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

      mediaRecorder.start();
      setRecordingState("recording");
      startTimer();
    } catch (err: any) {
      console.error("Error starting webcam recording:", err);

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

  const startScreenRecording = async (includeWebcam: boolean) => {
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

      let combinedStream = screenStream;

      // If including webcam, create a combined stream
      if (includeWebcam) {
        const webcamStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240 },
          audio: false,
        });

        webcamStreamRef.current = webcamStream;
        if (webcamPreviewRef.current) {
          webcamPreviewRef.current.srcObject = webcamStream;
        }

        // For screen+webcam, we'll record both separately and let the user see both
        // In a more advanced version, you could composite them using Canvas
        combinedStream = screenStream;
      }

      const mediaRecorder = new MediaRecorder(combinedStream, {
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

      mediaRecorder.start();
      setRecordingState("recording");
      startTimer();
    } catch (err: any) {
      console.error("Error starting screen recording:", err);

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
  };

  const handleModeSelect = async (mode: RecordingMode) => {
    setRecordingMode(mode);
    if (mode === "webcam") {
      await startWebcamRecording();
    } else if (mode === "screen") {
      await startScreenRecording(false);
    } else if (mode === "screen-webcam") {
      await startScreenRecording(true);
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
      const formData = new FormData();

      const filename = `recording-${Date.now()}.webm`;
      const file = new File([videoBlob], filename, { type: "video/webm" });
      formData.append("file", file);

      // Use recording timestamp as title if no title provided
      const videoTitle = title || `Recording ${new Date().toLocaleString()}`;
      formData.append("title", videoTitle);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener("load", async () => {
        if (xhr.status === 200 || xhr.status === 201) {
          try {
            const response = JSON.parse(xhr.responseText);
            const videoId = response.video?.id;

            // Share with selected groups if any
            if (videoId && selectedGroups.length > 0) {
              for (const groupId of selectedGroups) {
                try {
                  await fetch(`/api/videos/${videoId}/share`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ groupId }),
                  });
                } catch (err) {
                  console.error(`Failed to share with group ${groupId}:`, err);
                }
              }
            }

            if (onComplete) {
              onComplete();
            } else {
              router.push("/dashboard");
            }
          } catch (err) {
            // If we can't parse response or share fails, still redirect
            if (onComplete) {
              onComplete();
            } else {
              router.push("/dashboard");
            }
          }
        } else {
          setError("Upload failed. Please try again.");
          setRecordingState("preview");
        }
      });

      xhr.addEventListener("error", () => {
        setError("Upload failed. Please check your connection.");
        setRecordingState("preview");
      });

      xhr.open("POST", "/api/videos/upload");
      xhr.send(formData);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Upload failed. Please try again.");
      setRecordingState("preview");
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
    <div className="fixed inset-0 bg-black z-50">
      {/* Mode Selection Screen */}
      {recordingState === "idle" && !recordingMode && (
        <div className="h-full flex flex-col items-center justify-center p-8">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="absolute top-4 left-4 !border-0 !text-white hover:!text-gray-300 !bg-transparent hover:!bg-transparent"
          >
            ✕ Close
          </Button>

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
              className={`p-8 bg-gradient-to-br ${theme.gradients.primary} rounded-xl text-white transition-all transform hover:scale-105 shadow-lg`}
            >
              <div className="text-4xl mb-4">📹</div>
              <h2 className="text-2xl font-bold mb-2">Webcam</h2>
              <p className={theme.gradients.primaryText}>Record using your camera and microphone</p>
            </button>

            <button
              onClick={() => handleModeSelect("screen")}
              className={`p-8 bg-gradient-to-br ${theme.gradients.primary} rounded-xl text-white transition-all transform hover:scale-105 shadow-lg`}
            >
              <div className="text-4xl mb-4">🖥️</div>
              <h2 className="text-2xl font-bold mb-2">Screen Recording</h2>
              <p className={theme.gradients.primaryText}>Record your screen with audio</p>
            </button>

            <button
              onClick={() => handleModeSelect("screen-webcam")}
              className={`p-8 bg-gradient-to-br ${theme.gradients.primary} rounded-xl text-white transition-all transform hover:scale-105 shadow-lg`}
            >
              <div className="text-4xl mb-4">🎥</div>
              <h2 className="text-2xl font-bold mb-2">Screen + Webcam</h2>
              <p className={theme.gradients.primaryText}>Record screen with webcam overlay</p>
            </button>
          </div>
        </div>
      )}

      {/* Recording Screen */}
      {recordingState === "recording" && (
        <div className="h-full flex flex-col">
          <div className="flex-1 relative bg-black">
            {recordingMode === "webcam" && (
              <video
                ref={webcamPreviewRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-contain"
              />
            )}

            {(recordingMode === "screen" || recordingMode === "screen-webcam") && (
              <>
                <video
                  ref={screenPreviewRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-contain"
                />
                {recordingMode === "screen-webcam" && (
                  <div className="absolute bottom-4 right-4 w-64 h-48 border-2 border-white rounded-lg overflow-hidden shadow-2xl">
                    <video
                      ref={webcamPreviewRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </>
            )}

            {/* Recording Indicator */}
            <div className="absolute top-4 left-4 flex items-center gap-3 bg-black/70 px-4 py-2 rounded-full">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white font-mono text-lg">{formatTime(recordingDuration)}</span>
            </div>
          </div>

          {/* Recording Controls */}
          <div className="bg-gray-900 p-6 flex justify-center">
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
                          className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-900"
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
                  className="flex-1"
                >
                  🔄 Retake
                </Button>
                <Button
                  onClick={handleUpload}
                  variant="primary"
                  className="flex-1"
                >
                  ⬆️ Upload
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
