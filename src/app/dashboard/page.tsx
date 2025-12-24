"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import VideoUpload from "@/components/VideoUpload";
import VideoList from "@/components/VideoList";

type Tab = "my-videos" | "shared";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("my-videos");
  const [showUpload, setShowUpload] = useState(false);
  const [hasCredentials, setHasCredentials] = useState<boolean | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    // Check if user has AWS credentials
    const checkCredentials = async () => {
      try {
        const response = await fetch("/api/aws-credentials");
        setHasCredentials(response.ok);
      } catch {
        setHasCredentials(false);
      }
    };

    if (status === "authenticated") {
      checkCredentials();
    }
  }, [status]);

  const handleSignOut = async () => {
    const { signOut } = await import("next-auth/react");
    await signOut({ callbackUrl: "/auth/signin" });
  };

  if (status === "loading" || hasCredentials === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Private Video</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {session?.user?.email}
              </span>
              <Link
                href="/settings"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {!hasCredentials && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  AWS Credentials Required
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    You need to configure your AWS credentials before uploading
                    videos.{" "}
                    <Link href="/settings" className="font-medium underline">
                      Go to Settings
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("my-videos")}
                  className={`${
                    activeTab === "my-videos"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  My Videos
                </button>
                <button
                  onClick={() => setActiveTab("shared")}
                  className={`${
                    activeTab === "shared"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Shared with Me
                </button>
              </nav>
            </div>

            {activeTab === "my-videos" && hasCredentials && (
              <button
                onClick={() => setShowUpload(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Upload Video
              </button>
            )}
          </div>

          <VideoList type={activeTab === "my-videos" ? "owned" : "shared"} />
        </div>
      </div>

      {showUpload && <VideoUpload onClose={() => setShowUpload(false)} />}
    </div>
  );
}
