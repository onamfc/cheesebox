"use client";

import { useState, useEffect, useRef } from "react";
import { fetchWithCsrf } from "@/lib/csrf-client";
import dev from "@onamfc/developer-log";
import type { VideoVisibility } from "@/types/video";

interface ShareVideoModalProps {
  videoId: string;
  onClose: () => void;
}

interface Share {
  sharedWithEmail: string;
  createdAt: string;
}

interface GroupShare {
  id: string;
  groupId: string;
  createdAt: string;
  group: {
    id: string;
    name: string;
  };
}

interface Group {
  id: string;
  name: string;
  description: string | null;
  members: Array<{ email: string }>;
}

interface PreviouslySharedUser {
  email: string;
  lastSharedAt: string;
}

export default function ShareVideoModal({
  videoId,
  onClose,
}: ShareVideoModalProps) {
  const [activeTab, setActiveTab] = useState<"user" | "group">("user");
  const [email, setEmail] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [shares, setShares] = useState<Share[]>([]);
  const [groupShares, setGroupShares] = useState<GroupShare[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previouslySharedUsers, setPreviouslySharedUsers] = useState<PreviouslySharedUser[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<PreviouslySharedUser[]>([]);
  const [linkCopied, setLinkCopied] = useState(false);
  const [videoVisibility, setVideoVisibility] = useState<VideoVisibility | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchShares();
    fetchGroups();
    fetchPreviouslySharedUsers();
  }, [videoId]);

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchShares = async () => {
    try {
      const response = await fetch(`/api/videos?type=owned`);
      if (response.ok) {
        const videos = await response.json();
        const video = videos.find((v: any) => v.id === videoId);
        if (video) {
          if (video.shares) {
            setShares(video.shares);
          }
          if (video.groupShares) {
            setGroupShares(video.groupShares);
          }
          if (video.visibility) {
            setVideoVisibility(video.visibility);
          }
        }
      }
    } catch (error) {
      dev.error("Error fetching shares:", error, {tag: "share-video"});
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await fetch("/api/groups");
      if (response.ok) {
        const data = await response.json();
        setGroups(data);
      }
    } catch (error) {
      dev.error("Error fetching groups:", error, {tag: "share-video"});
    }
  };

  const fetchPreviouslySharedUsers = async () => {
    try {
      const response = await fetch("/api/users/shared-with");
      if (response.ok) {
        const data = await response.json();
        setPreviouslySharedUsers(data);
      }
    } catch (error) {
      dev.error("Error fetching previously shared users:", error, {tag: "share-video"});
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (value.trim()) {
      const filtered = previouslySharedUsers.filter((user) =>
        user.email.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (selectedEmail: string) => {
    setEmail(selectedEmail);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetchWithCsrf(`/api/videos/${videoId}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to share video");
        setLoading(false);
        return;
      }

      setEmail("");
      fetchShares();
      setLoading(false);
    } catch (err) {
      setError("Failed to share video");
      setLoading(false);
    }
  };

  const handleGroupShare = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetchWithCsrf(`/api/videos/${videoId}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ groupId: selectedGroupId }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to share video with group");
        setLoading(false);
        return;
      }

      setSelectedGroupId("");
      fetchShares();
      setLoading(false);
    } catch (err) {
      setError("Failed to share video with group");
      setLoading(false);
    }
  };

  const handleUnshare = async (sharedWithEmail: string) => {
    if (!confirm(`Remove access for ${sharedWithEmail}?`)) {
      return;
    }

    try {
      const response = await fetchWithCsrf(
        `/api/videos/${videoId}/share?email=${encodeURIComponent(sharedWithEmail)}`,
        { method: "DELETE" },
      );

      if (response.ok) {
        setShares(shares.filter((s) => s.sharedWithEmail !== sharedWithEmail));
      } else {
        alert("Failed to remove share");
      }
    } catch (error) {
      dev.error("Error removing share:", error, {tag: "share-video"});
      alert("Failed to remove share");
    }
  };

  const handleUnshareGroup = async (groupId: string, groupName: string) => {
    if (!confirm(`Remove access for group "${groupName}"?`)) {
      return;
    }

    try {
      const response = await fetchWithCsrf(
        `/api/videos/${videoId}/group-shares/${groupId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setGroupShares(groupShares.filter((g) => g.groupId !== groupId));
      } else {
        alert("Failed to remove group share");
      }
    } catch (error) {
      dev.error("Error removing group share:", error, {tag: "share-video"});
      alert("Failed to remove group share");
    }
  };

  const handleCopyLink = async () => {
    const videoUrl = `${window.location.origin}/embed/${videoId}`;
    try {
      await navigator.clipboard.writeText(videoUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      dev.error("Failed to copy link:", error, { tag: "share-video" });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Share Video</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
              className="h-6 w-6"
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

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => {
                setActiveTab("user");
                setError("");
              }}
              className={`${
                activeTab === "user"
                  ? "border-blue-500 text-purple-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Share with User
            </button>
            <button
              onClick={() => {
                setActiveTab("group");
                setError("");
              }}
              className={`${
                activeTab === "group"
                  ? "border-blue-500 text-purple-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Share with Group
            </button>
          </nav>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* User Share Tab */}
        {activeTab === "user" && (
          <>
            <form onSubmit={handleShare} className="mb-6">
              <div className="mb-4 relative">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email address
                </label>
                <input
                  ref={inputRef}
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onFocus={() => {
                    if (email.trim() && filteredSuggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary text-black"
                  placeholder="Enter email to share with"
                  required
                  autoComplete="off"
                />

                {/* Autocomplete Suggestions */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                  >
                    {filteredSuggestions.map((user) => (
                      <button
                        key={user.email}
                        type="button"
                        onClick={() => handleSelectSuggestion(user.email)}
                        className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none flex justify-between items-center"
                      >
                        <span className="text-sm text-gray-900">{user.email}</span>
                        <span className="text-xs text-gray-500">
                          Last shared {new Date(user.lastSharedAt).toLocaleDateString()}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-purple-950 text-white rounded-md hover:bg-purple-900 disabled:bg-gray-400"
              >
                {loading ? "Sharing..." : "Share"}
              </button>
            </form>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Shared with ({shares.length})
              </h4>

              {shares.length === 0 ? (
                <p className="text-sm text-gray-500">Not shared with anyone yet.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {shares.map((share) => (
                    <li
                      key={share.sharedWithEmail}
                      className="py-3 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {share.sharedWithEmail}
                        </p>
                        <p className="text-xs text-gray-500">
                          Shared on {new Date(share.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleUnshare(share.sharedWithEmail)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {/* Group Share Tab */}
        {activeTab === "group" && (
          <>
            {groups.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-4">
                  You don't have any groups yet.
                </p>
                <a
                  href="/dashboard/groups"
                  className="text-sm text-purple-700 hover:text-blue-700 font-medium"
                >
                  Create your first group →
                </a>
              </div>
            ) : (
              <>
                <form onSubmit={handleGroupShare} className="mb-6">
                  <div className="mb-4">
                    <label
                      htmlFor="group"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Select Group
                    </label>
                    <select
                      id="group"
                      value={selectedGroupId}
                      onChange={(e) => setSelectedGroupId(e.target.value)}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary text-black"
                      required
                    >
                      <option value="">Choose a group...</option>
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name} ({group.members.length} members)
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-purple-950 text-white rounded-md hover:bg-purple-900 disabled:bg-gray-400"
                  >
                    {loading ? "Sharing..." : "Share with Group"}
                  </button>
                </form>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Shared with Groups ({groupShares.length})
                  </h4>

                  {groupShares.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Not shared with any groups yet.
                    </p>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {groupShares.map((share) => (
                        <li
                          key={share.id}
                          className="py-3 flex justify-between items-center"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {share.group.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Shared on {new Date(share.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              handleUnshareGroup(share.groupId, share.group.name)
                            }
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {/* Copy Link Button */}
        <div className="mt-4 mb-2">
          <button
            onClick={handleCopyLink}
            disabled={videoVisibility !== "PUBLIC"}
            className={`w-full px-4 py-2 text-sm border rounded-md flex items-center justify-center gap-2 transition-colors ${
              videoVisibility === "PUBLIC"
                ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                : "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
            }`}
          >
            {linkCopied ? (
              <>
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-green-600">Link Copied!</span>
              </>
            ) : (
              <>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                <span>Copy Link</span>
              </>
            )}
          </button>
          {videoVisibility === "PUBLIC" ? (
            <p className="mt-2 text-xs text-gray-500 text-center">
              Use the direct video link to share the video.
            </p>
          ) : (
            <p className="mt-2 text-xs text-gray-500 text-center">
              To get the direct video link, set video visibility to public.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
