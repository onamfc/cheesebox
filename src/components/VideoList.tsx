"use client";

import { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";
import ShareVideoModal from "./ShareVideoModal";
import EmbedCodeModal from "./EmbedCodeModal";
import VisibilityToggle from "./VisibilityToggle";
import { Button } from "./ui/Button";

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
    setLoading(true);
    setVideos([]);
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
            className={`bg-white shadow rounded-lg hover:shadow-lg transition-shadow ${
              viewMode === "list" ? "flex items-center" : ""
            }`}
          >
            <div className={`p-5 ${viewMode === "list" ? "flex gap-6 w-full" : ""}`}>
              {/* Video Info Section */}
              <div className={viewMode === "list" ? "flex-1 min-w-0 flex flex-col justify-center" : ""}>
                <div className={`${viewMode === "list" ? "mb-1" : "mb-3"}`}>
                  <div className={`flex items-center ${viewMode === "list" ? "gap-4 mb-2" : "justify-between mb-3"}`}>
                    <h3 className={`font-medium text-gray-900 ${viewMode === "list" ? "text-xl" : "text-lg truncate"}`}>
                      {video.title}
                    </h3>
                    {viewMode === "grid" && video.transcodingStatus !== "COMPLETED" && (
                      <div className="flex gap-2">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            video.transcodingStatus === "PROCESSING"
                              ? "bg-yellow-100 text-yellow-800"
                              : video.transcodingStatus === "FAILED"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {video.transcodingStatus}
                        </span>
                      </div>
                    )}
                  </div>

                  {viewMode === "list" && video.transcodingStatus !== "COMPLETED" && (
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          video.transcodingStatus === "PROCESSING"
                            ? "bg-yellow-100 text-yellow-800"
                            : video.transcodingStatus === "FAILED"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {video.transcodingStatus}
                      </span>
                    </div>
                  )}

                  {/* Visibility Toggle - List View */}
                  {viewMode === "list" && type === "owned" && video.transcodingStatus === "COMPLETED" && (
                    <div className="mb-2 flex justify-start">
                      <VisibilityToggle
                        videoId={video.id}
                        currentVisibility={video.visibility}
                        onUpdate={fetchVideos}
                      />
                    </div>
                  )}
                </div>


                  <p className={`text-sm text-gray-500 mb-3 ${viewMode === "list" ? "line-clamp-1" : "line-clamp-2"}`}>
                    {video.description || "No description provided."}
                  </p>


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

                {/* Visibility Toggle - Grid View */}
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

              {/* Action Buttons - Grid View */}
              {viewMode === "grid" && (
                <div className="flex justify-between w-full">
                  <div className="flex items-center gap-2">
                    {video.transcodingStatus === "COMPLETED" && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedVideo(video.id)}
                        className="p-2.5"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </Button>
                    )}
                    {type === "owned" && (
                      <>
                        {video.visibility === "PUBLIC" && video.transcodingStatus === "COMPLETED" && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setEmbedVideoId(video.id)}
                            className="p-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                          </Button>
                        )}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setShareVideoId(video.id)}
                          className="p-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </Button>
                      </>
                    )}
                  </div>
                  {type === "owned" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDelete(video.id)}
                      className="p-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons - List View */}
            {viewMode === "list" && (
              <div className="flex flex-col gap-2 flex-shrink-0">
                {video.transcodingStatus === "COMPLETED" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedVideo(video.id)}
                    className="p-2.5"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </Button>
                )}
                {type === "owned" && (
                  <>
                    {video.visibility === "PUBLIC" && video.transcodingStatus === "COMPLETED" && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEmbedVideoId(video.id)}
                        className="p-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setShareVideoId(video.id)}
                      className="p-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDelete(video.id)}
                      className="p-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </>
                )}
              </div>
            )}
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
