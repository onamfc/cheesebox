"use client";

import { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";
import ShareVideoModal from "./ShareVideoModal";
import EmbedCodeModal from "./EmbedCodeModal";
import VisibilityToggle from "./VisibilityToggle";

interface Video {
  id: string;
  title: string;
  description: string | null;
  transcodingStatus: string;
  visibility: "PRIVATE" | "PUBLIC";
  createdAt: string;
  shares?: Array<{ sharedWithEmail: string; createdAt: string }>;
  sharedBy?: string;
  sharedAt?: string;
}

interface VideoListProps {
  type: "owned" | "shared" | "group";
  teamId?: string | null;
  groupId?: string | null;
  viewMode?: "grid" | "list";
}

export default function VideoList({ type, teamId, groupId, viewMode = "grid" }: VideoListProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [shareVideoId, setShareVideoId] = useState<string | null>(null);
  const [embedVideoId, setEmbedVideoId] = useState<string | null>(null);

  const fetchVideos = async () => {
    try {
      let url = `/api/videos?type=${type}`;
      if (teamId) url += `&teamId=${teamId}`;
      if (groupId) url += `&groupId=${groupId}`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [type, teamId, groupId]);

  const handleDelete = async (videoId: string) => {
    if (!confirm("Are you sure you want to delete this video?")) {
      return;
    }

    try {
      const response = await fetch(`/api/videos/${videoId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setVideos(videos.filter((v) => v.id !== videoId));
      } else {
        alert("Failed to delete video");
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("Failed to delete video");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading videos...</div>;
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {type === "owned" ? "No videos" : "No shared videos"}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {type === "owned"
            ? "Get started by uploading a video."
            : "Videos shared with you will appear here."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={viewMode === "grid" ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
        {videos.map((video) => (
          <div
            key={video.id}
            className={`bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow ${
              viewMode === "list" ? "flex items-center" : ""
            }`}
          >
            <div className={`p-5 ${viewMode === "list" ? "flex-1 flex items-center gap-6" : ""}`}>
              {/* Video Info Section */}
              <div className={viewMode === "list" ? "flex-1" : ""}>
                <div className={`flex items-center ${viewMode === "list" ? "gap-4 mb-2" : "justify-between mb-3"}`}>
                  <h3 className={`font-medium text-gray-900 ${viewMode === "list" ? "text-xl" : "text-lg truncate"}`}>
                    {video.title}
                  </h3>
                  {viewMode === "grid" && (
                    <div className="flex gap-2">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          video.transcodingStatus === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : video.transcodingStatus === "PROCESSING"
                              ? "bg-yellow-100 text-yellow-800"
                              : video.transcodingStatus === "FAILED"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {video.transcodingStatus}
                      </span>
                      {type === "owned" && video.transcodingStatus === "COMPLETED" && (
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            video.visibility === "PUBLIC"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {video.visibility === "PUBLIC" ? "Public" : "Private"}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {viewMode === "list" && (
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        video.transcodingStatus === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : video.transcodingStatus === "PROCESSING"
                            ? "bg-yellow-100 text-yellow-800"
                            : video.transcodingStatus === "FAILED"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {video.transcodingStatus}
                    </span>
                    {type === "owned" && video.transcodingStatus === "COMPLETED" && (
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          video.visibility === "PUBLIC"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {video.visibility === "PUBLIC" ? "Public" : "Private"}
                      </span>
                    )}
                  </div>
                )}

                {video.description && (
                  <p className={`text-sm text-gray-500 mb-3 ${viewMode === "list" ? "line-clamp-1" : "line-clamp-2"}`}>
                    {video.description}
                  </p>
                )}

                {type === "shared" && video.sharedBy && (
                  <p className="text-xs text-gray-500 mb-3">
                    Shared by: {video.sharedBy}
                  </p>
                )}

                <div className={`flex items-center text-xs text-gray-500 ${viewMode === "list" ? "gap-4" : "justify-between mb-4"}`}>
                  <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                  {type === "owned" &&
                    video.shares &&
                    video.shares.length > 0 && (
                      <span>{video.shares.length} shares</span>
                    )}
                </div>

                {/* Visibility Toggle for Grid View */}
                {viewMode === "grid" && type === "owned" && video.transcodingStatus === "COMPLETED" && (
                  <div className="mb-3">
                    <VisibilityToggle
                      videoId={video.id}
                      currentVisibility={video.visibility}
                      onUpdate={fetchVideos}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className={viewMode === "list" ? "flex items-center gap-2" : "flex flex-wrap gap-2"}>
                {viewMode === "list" && type === "owned" && video.transcodingStatus === "COMPLETED" && (
                  <VisibilityToggle
                    videoId={video.id}
                    currentVisibility={video.visibility}
                    onUpdate={fetchVideos}
                  />
                )}
                {video.transcodingStatus === "COMPLETED" && (
                  <button
                    onClick={() => setSelectedVideo(video.id)}
                    className={`px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 ${viewMode === "grid" ? "flex-1" : ""}`}
                  >
                    Watch
                  </button>
                )}
                {type === "owned" && (
                  <>
                    {video.visibility === "PUBLIC" && video.transcodingStatus === "COMPLETED" && (
                      <button
                        onClick={() => setEmbedVideoId(video.id)}
                        className="px-3 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700"
                        title="Get embed code"
                      >
                        Embed
                      </button>
                    )}
                    <button
                      onClick={() => setShareVideoId(video.id)}
                      className="px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300"
                    >
                      Share
                    </button>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedVideo && (
        <VideoPlayer
          videoId={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {shareVideoId && (
        <ShareVideoModal
          videoId={shareVideoId}
          onClose={() => {
            setShareVideoId(null);
            fetchVideos(); // Refresh to show new shares
          }}
        />
      )}

      {embedVideoId && (
        <EmbedCodeModal
          videoId={embedVideoId}
          onClose={() => setEmbedVideoId(null)}
        />
      )}
    </>
  );
}
