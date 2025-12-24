"use client";

import { useState, useEffect } from "react";

interface ShareVideoModalProps {
  videoId: string;
  onClose: () => void;
}

interface Share {
  sharedWithEmail: string;
  createdAt: string;
}

export default function ShareVideoModal({
  videoId,
  onClose,
}: ShareVideoModalProps) {
  const [email, setEmail] = useState("");
  const [shares, setShares] = useState<Share[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchShares();
  }, [videoId]);

  const fetchShares = async () => {
    try {
      const response = await fetch(`/api/videos?type=owned`);
      if (response.ok) {
        const videos = await response.json();
        const video = videos.find((v: any) => v.id === videoId);
        if (video && video.shares) {
          setShares(video.shares);
        }
      }
    } catch (error) {
      console.error("Error fetching shares:", error);
    }
  };

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/videos/${videoId}/share`, {
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

  const handleUnshare = async (sharedWithEmail: string) => {
    if (!confirm(`Remove access for ${sharedWithEmail}?`)) {
      return;
    }

    try {
      const response = await fetch(
        `/api/videos/${videoId}/share?email=${encodeURIComponent(sharedWithEmail)}`,
        { method: "DELETE" },
      );

      if (response.ok) {
        setShares(shares.filter((s) => s.sharedWithEmail !== sharedWithEmail));
      } else {
        alert("Failed to remove share");
      }
    } catch (error) {
      console.error("Error removing share:", error);
      alert("Failed to remove share");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
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

        <form onSubmit={handleShare} className="mb-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
              placeholder="Enter email to share with"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
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
      </div>
    </div>
  );
}
