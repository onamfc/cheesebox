"use client";

import { useState } from "react";

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
      const response = await fetch(`/api/videos/${videoId}/visibility`, {
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
      <span className="text-gray-600">Visibility:</span>
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          currentVisibility === "PUBLIC"
            ? "bg-blue-600"
            : "bg-gray-200"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span className="sr-only">Toggle visibility</span>
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            currentVisibility === "PUBLIC"
              ? "translate-x-5"
              : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
