"use client";

import { useState } from "react";
import { fetchWithCsrf } from "@/lib/csrf-client";

interface VisibilityToggleProps {
  videoId: string;
  currentVisibility: "PRIVATE" | "PUBLIC";
  onUpdate: () => void;
}

export default function VisibilityToggle({
  videoId,
  currentVisibility,
  onUpdate,
}: VisibilityToggleProps) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    const newVisibility = currentVisibility === "PRIVATE" ? "PUBLIC" : "PRIVATE";

    // Confirm when making public
    if (newVisibility === "PUBLIC") {
      const confirmed = confirm(
        "Make this video public? Anyone with the embed link will be able to view it."
      );
      if (!confirmed) return;
    }

    setLoading(true);

    try {
      const response = await fetchWithCsrf(`/api/videos/${videoId}/visibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility: newVisibility }),
      });

      if (response.ok) {
        onUpdate();
      } else {
        alert("Failed to update visibility");
      }
    } catch (error) {
      console.error("Error updating visibility:", error);
      alert("Failed to update visibility");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600 mr-2">Visibility:</span>
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 ${
          currentVisibility === "PUBLIC"
            ? "bg-green-600"
            : "bg-gray-200"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span className="sr-only">Toggle visibility</span>
        <span
          className={`pointer-events-none flex items-center justify-center h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            currentVisibility === "PUBLIC"
              ? "translate-x-5"
              : "translate-x-0"
          }`}
        >
          {currentVisibility === "PUBLIC" ? (
            <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          )}
        </span>
      </button>
    </div>
  );
}
