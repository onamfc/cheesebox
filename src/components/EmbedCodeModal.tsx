"use client";

import { useState } from "react";

interface EmbedCodeModalProps {
  videoId: string;
  onClose: () => void;
}

export default function EmbedCodeModal({
  videoId,
  onClose,
}: EmbedCodeModalProps) {
  const [copied, setCopied] = useState(false);
  const [embedSize, setEmbedSize] = useState<"responsive" | "fixed">(
    "responsive"
  );

  // Get the app URL (works for both local dev and production)
  const getAppUrl = () => {
    if (typeof window === "undefined") return "";
    return window.location.origin;
  };

  const embedUrl = `${getAppUrl()}/embed/${videoId}`;

  // Generate embed code
  const getEmbedCode = () => {
    if (embedSize === "responsive") {
      return `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe
    src="${embedUrl}"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    frameborder="0"
    allowfullscreen
    allow="autoplay">
  </iframe>
</div>`;
    } else {
      return `<iframe
  src="${embedUrl}"
  width="640"
  height="360"
  frameborder="0"
  allowfullscreen
  allow="autoplay">
</iframe>`;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getEmbedCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Embed Video
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
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

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Preview */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Preview
            </h3>
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                <iframe
                  src={embedUrl}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay"
                />
              </div>
            </div>
          </div>

          {/* Direct Link */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Direct Link
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={embedUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(embedUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Embed Code */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-900">
                Embed Code
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setEmbedSize("responsive")}
                  className={`px-3 py-1 text-xs rounded-md ${
                    embedSize === "responsive"
                      ? "bg-purple-950 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Responsive
                </button>
                <button
                  onClick={() => setEmbedSize("fixed")}
                  className={`px-3 py-1 text-xs rounded-md ${
                    embedSize === "fixed"
                      ? "bg-purple-950 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Fixed (640x360)
                </button>
              </div>
            </div>
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-xs overflow-x-auto">
                <code>{getEmbedCode()}</code>
              </pre>
              <button
                onClick={handleCopy}
                className={`absolute top-2 right-2 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  copied
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                }`}
              >
                {copied ? "✓ Copied!" : "Copy Code"}
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              How to Use
            </h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Copy the embed code above</li>
              <li>Paste it into your website's HTML</li>
              <li>The video will display in a responsive player</li>
              <li>No authentication required - anyone can view</li>
            </ul>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-yellow-900 mb-2">
              ⚠️ Important
            </h4>
            <p className="text-sm text-yellow-800">
              This video is <strong>PUBLIC</strong>. Anyone with the embed link can
              view it. To restrict access, change the visibility to Private.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
