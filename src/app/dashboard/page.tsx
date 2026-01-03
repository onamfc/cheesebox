"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import VideoUpload from "@/components/VideoUpload";
import VideoList from "@/components/VideoList";
import DashboardNav from "@/components/DashboardNav";

type Tab = "my-videos" | "shared";
type ViewMode = "grid" | "list";

interface Team {
  id: string;
  name: string;
  userRole: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("my-videos");
  const [showUpload, setShowUpload] = useState(false);
  const [hasCredentials, setHasCredentials] = useState<boolean | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

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

    // Fetch user's teams for filtering
    const fetchTeams = async () => {
      try {
        const response = await fetch("/api/teams");
        if (response.ok) {
          const data = await response.json();
          setTeams(data);
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    if (status === "authenticated") {
      checkCredentials();
      fetchTeams();
    }
  }, [status]);

  if (status === "loading" || hasCredentials === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />

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
            <div className="flex items-center gap-6">
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

              {activeTab === "my-videos" && teams.length > 0 && (
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="team-filter"
                    className="text-sm text-gray-700 font-medium"
                  >
                    Filter:
                  </label>
                  <select
                    id="team-filter"
                    value={selectedTeamFilter}
                    onChange={(e) => setSelectedTeamFilter(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Videos</option>
                    <option value="personal">Personal Account</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
                  title="Grid view"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
                  title="List view"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {activeTab === "my-videos" && hasCredentials && (
                <>
                <Link
                  href="/dashboard/record"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                >
                  Record Video
                </Link>
                <button
                  onClick={() => setShowUpload(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Upload Video
                </button>
                </>
              )}
            </div>
          </div>

          <VideoList
            type={activeTab === "my-videos" ? "owned" : "shared"}
            teamId={
              activeTab === "my-videos" && selectedTeamFilter !== "all"
                ? selectedTeamFilter
                : null
            }
            viewMode={viewMode}
          />
        </div>
      </div>

      {showUpload && <VideoUpload onClose={() => setShowUpload(false)} />}
    </div>
  );
}
