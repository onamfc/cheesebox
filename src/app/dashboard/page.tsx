"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import VideoUpload from "@/components/VideoUpload";
import VideoList from "@/components/VideoList";
import FloatingActionMenu from "@/components/FloatingActionMenu";
import VideoRecorder from "@/components/VideoRecorder";
import { LinkButton, Button } from "@/components/ui/Button";
import { useTheme } from "@/contexts/ThemeContext";
import { theme as defaultTheme } from "@/themes/asiago/theme";
import dev from "@onamfc/developer-log";
import { SortOption } from "@/types/video";

type Tab = "my-videos" | "shared";
type ViewMode = "grid" | "list";
type RecordingMode = "webcam" | "screen";

interface Team {
  id: string;
  name: string;
  userRole: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { themeConfig } = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("my-videos");
  const [showUpload, setShowUpload] = useState(false);
  const [showRecorder, setShowRecorder] = useState(false);
  const [recordingMode, setRecordingMode] = useState<RecordingMode | null>(null);
  const [hasCredentials, setHasCredentials] = useState<boolean | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("videoViewMode");
      return (saved as ViewMode) || "grid";
    }
    return "grid";
  });
  const [sortOption, setSortOption] = useState<SortOption>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("videoSortOption");
      return (saved as SortOption) || SortOption.NEWEST;
    }
    return SortOption.NEWEST;
  });

  // Get theme configuration
  const spacing = themeConfig?.spacing || defaultTheme.spacing;
  const components = themeConfig?.components || defaultTheme.components;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("videoViewMode", viewMode);
    }
  }, [viewMode]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("videoSortOption", sortOption);
    }
  }, [sortOption]);

  useEffect(() => {
    // Check if user has AWS credentials or is part of a team
    const checkCredentials = async () => {
      try {
        const response = await fetch("/api/aws-credentials");
        const hasPersonalCredentials = response.ok;

        // Also check if user is part of any teams
        const teamsResponse = await fetch("/api/teams");
        const userTeams = teamsResponse.ok ? await teamsResponse.json() : [];

        // User can upload if they have personal credentials OR are part of a team
        setHasCredentials(hasPersonalCredentials || userTeams.length > 0);
        setTeams(userTeams);
      } catch (error) {
        dev.error("Error checking credentials:", error, {tag: "auth"});
        setHasCredentials(false);
      }
    };

    if (status === "authenticated") {
      checkCredentials();
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
    <div className={`${spacing.containerMaxWidth} mx-auto py-6 sm:px-6 lg:px-8`}>
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
                    To upload videos, you need to either configure your own AWS
                    credentials or join a team.{" "}
                    <Link href="/settings" className="font-medium underline">
                      Configure Settings
                    </Link>
                    {" or "}
                    <Link href="/dashboard/teams" className="font-medium underline">
                      Browse Teams
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
                        ? "border-brand-secondary text-black-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer`}
                  >
                    My Videos
                  </button>
                  <button
                    onClick={() => setActiveTab("shared")}
                    className={`${
                      activeTab === "shared"
                        ? "border-brand-secondary text-black-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer`}
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
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
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
              <label
                    htmlFor="video-sort"
                    className="text-sm text-gray-700 font-medium"
                  >
                  Sort:
                </label>
              <select
                id="video-sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                title="Sort videos"
              >
                <option value={SortOption.NEWEST}>Newest First</option>
                <option value={SortOption.OLDEST}>Oldest First</option>
                <option value={SortOption.A_TO_Z}>A → Z</option>
                <option value={SortOption.Z_TO_A}>Z → A</option>
              </select>

              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-blue-100 text-black-200" : "text-gray-600 hover:bg-gray-100"}`}
                  title="Grid view"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-blue-100 text-black-200" : "text-gray-600 hover:bg-gray-100"}`}
                  title="List view"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {activeTab === "my-videos" && hasCredentials && (
                <>
                <LinkButton href="/dashboard/record" variant="ghost" className="p-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </LinkButton>
                <Button onClick={() => setShowUpload(true)} variant="primary" className="p-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </Button>
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
            sortBy={sortOption}
          />
        </div>

        {showUpload && <VideoUpload onClose={() => setShowUpload(false)} />}

        {/* Video Recorder */}
        {showRecorder && recordingMode && (
          <VideoRecorder
            key={recordingMode}
            initialMode={recordingMode}
            onComplete={() => {
              setShowRecorder(false);
              setRecordingMode(null);
              window.location.reload();
            }}
          />
        )}

        {/* Floating Action Menu */}
        {components.showFloatingActionMenu && activeTab === "my-videos" && hasCredentials && !showRecorder && (
          <FloatingActionMenu
            onUpload={() => setShowUpload(true)}
            onRecord={(mode) => {
              setRecordingMode(mode);
              setShowRecorder(true);
            }}
          />
        )}
      </div>
  );
}
