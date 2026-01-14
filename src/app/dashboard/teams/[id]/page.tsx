"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import VideoList from "@/components/VideoList";
import { fetchWithCsrf } from "@/lib/csrf-client";

interface TeamMember {
  id: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  status: "PENDING" | "ACCEPTED";
  email: string | null;
  user: {
    id: string;
    email: string;
  } | null;
}

interface Team {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  userRole: "OWNER" | "ADMIN" | "MEMBER";
  members: TeamMember[];
  _count: {
    videos: number;
    groups: number;
  };
}

export default function TeamDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const teamId = params.id as string;

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Invite modal state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"OWNER" | "ADMIN" | "MEMBER">("MEMBER");
  const [inviting, setInviting] = useState(false);

  // Edit role modal state
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [newRole, setNewRole] = useState<"OWNER" | "ADMIN" | "MEMBER">("MEMBER");
  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    loadTeam();
    loadCurrentUser();
  }, [teamId]);

  const loadCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setCurrentUserId(data.id);
      }
    } catch (error) {
      console.error("Error loading current user:", error);
    }
  };

  const loadTeam = async () => {
    try {
      const res = await fetch(`/api/teams/${teamId}`);
      if (!res.ok) {
        if (res.status === 404 || res.status === 403) {
          router.push("/dashboard/teams");
          return;
        }
        throw new Error("Failed to load team");
      }
      const data = await res.json();
      setTeam(data);
    } catch (error) {
      console.error("Error loading team:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInviting(true);

    try {
      const res = await fetchWithCsrf(`/api/teams/${teamId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to invite member");
      }

      await loadTeam();
      setShowInviteModal(false);
      setInviteEmail("");
      setInviteRole("MEMBER");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setInviting(false);
    }
  };

  const handleOpenEditRole = (member: TeamMember) => {
    setEditingMember(member);
    setNewRole(member.role);
    setShowEditRoleModal(true);
    setError("");
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editingMember.user) return;

    setError("");
    setUpdating(true);

    try {
      const res = await fetchWithCsrf(
        `/api/teams/${teamId}/members/${editingMember.user.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update role");
      }

      await loadTeam();
      setShowEditRoleModal(false);
      setEditingMember(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveMember = async (userId: string, email: string) => {
    if (!confirm(`Remove ${email} from the team?`)) return;

    try {
      const res = await fetchWithCsrf(`/api/teams/${teamId}/members/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to remove member");
      }

      await loadTeam();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCancelInvitation = async (memberId: string) => {
    const member = team?.members.find(m => m.id === memberId);
    if (!confirm(`Cancel invitation for ${member?.email}?`)) return;

    try {
      const res = await fetchWithCsrf(`/api/teams/${teamId}/invitations/${memberId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to cancel invitation");
      }

      await loadTeam();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLeaveTeam = async () => {
    if (
      !confirm(
        "Are you sure you want to leave this team? You will lose access to all team resources."
      )
    )
      return;

    try {
      const res = await fetchWithCsrf(`/api/teams/${teamId}/leave`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to leave team");
      }

      router.push("/dashboard/teams");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteTeam = async () => {
    if (
      !confirm(
        `Delete "${team?.name}"? This will delete all team data, videos, and groups. This cannot be undone.`
      )
    )
      return;

    try {
      const res = await fetchWithCsrf(`/api/teams/${teamId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete team");
      }

      router.push("/dashboard/teams");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const canInviteMembers = team?.userRole === "OWNER" || team?.userRole === "ADMIN";
  const canChangeRoles = team?.userRole === "OWNER";
  const canRemoveMember = (memberRole: string) => {
    if (team?.userRole === "OWNER") return true;
    if (team?.userRole === "ADMIN" && memberRole === "MEMBER") return true;
    return false;
  };

  const getRoleBadgeClasses = (role: string) => {
    switch (role) {
      case "OWNER":
        return "bg-brand-secondary text-brand-dark";
      case "ADMIN":
        return "bg-brand-accent text-brand-dark";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "OWNER":
        return "Full control: invite members, change roles, remove members, and delete the team.";
      case "ADMIN":
        return "Can invite and remove basic members. Cannot change roles or delete the team.";
      case "MEMBER":
        return "Basic access: can view and upload videos, but cannot manage members.";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading team...</div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Team not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard/teams"
            className="text-brand-primary hover:text-brand-primary-hover mb-4 inline-flex items-center text-sm font-medium"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Teams
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded ${getRoleBadgeClasses(
                    team.userRole
                  )}`}
                >
                  {team.userRole}
                </span>
              </div>
              <p className="mt-2 text-gray-600">
                {team.members.length} {team.members.length === 1 ? "member" : "members"} · {team._count.videos} {team._count.videos === 1 ? "video" : "videos"} · {team._count.groups} {team._count.groups === 1 ? "group" : "groups"}
              </p>
            </div>
          </div>
        </div>


        {/* Team Videos Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Team Videos</h2>
              <p className="text-sm text-gray-600 mt-1">
                All videos uploaded by team members using this team's AWS account
              </p>
            </div>

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
          </div>

          <VideoList type="team" teamId={teamId} viewMode={viewMode} />
        </div>

        {/* Members Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Members</h2>
            {canInviteMembers && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-primary-hover transition text-sm font-medium"
              >
                Invite Member
              </button>
            )}
          </div>

          {/* Active Members */}
          <div className="bg-white rounded-lg shadow divide-y divide-gray-200 mb-6">
            {team.members.filter(m => m.status === "ACCEPTED").length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No members yet.
              </div>
            ) : (
              team.members.filter(m => m.status === "ACCEPTED").map((member) => {
                const isCurrentUser = member.user?.id === currentUserId;
                const canRemove = canRemoveMember(member.role) && !isCurrentUser;
                const displayEmail = member.user?.email || member.email || "Unknown";

                return (
                  <div
                    key={member.id}
                    className="p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-brand-secondary rounded-full flex items-center justify-center mr-3">
                        <svg
                          className="w-4 h-4 text-brand-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-gray-900">
                            {displayEmail}
                          </div>
                          {isCurrentUser && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
                              You
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {canChangeRoles && !isCurrentUser ? (
                        <button
                          onClick={() => handleOpenEditRole(member)}
                          className={`px-3 py-1 text-xs font-semibold rounded ${getRoleBadgeClasses(
                            member.role
                          )} hover:opacity-80 transition cursor-pointer`}
                        >
                          {member.role}
                        </button>
                      ) : (
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded ${getRoleBadgeClasses(
                            member.role
                          )}`}
                        >
                          {member.role}
                        </span>
                      )}
                      {canRemove && member.user && (
                        <button
                          onClick={() =>
                            handleRemoveMember(member.user!.id, displayEmail)
                          }
                          className="text-red-700 text-sm hover:underline transition cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pending Invitations */}
          {team.members.filter(m => m.status === "PENDING").length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-700">
                  Pending Invitations ({team.members.filter(m => m.status === "PENDING").length})
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  These users have been invited but haven't created an account yet
                </p>
              </div>
              <div className="divide-y divide-gray-200">
                {team.members.filter(m => m.status === "PENDING").map((member) => (
                  <div
                    key={member.id}
                    className="p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                        <svg
                          className="w-4 h-4 text-yellow-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-gray-900">
                            {member.email}
                          </div>
                          <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                            Pending
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Invitation sent • Will join as {member.role}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {canInviteMembers && (
                        <button
                          onClick={() => handleCancelInvitation(member.id)}
                          className="text-red-600 text-sm hover:underline transition cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Team Settings (Owner/Admin only) */}
        {(team.userRole === "OWNER" || team.userRole === "ADMIN") && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Settings</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900 mb-1">AWS Credentials</h3>
                <p className="text-sm text-gray-600">
                  Configure team AWS credentials so all team members can upload videos
                </p>
              </div>
              <Link
                href={`/settings?teamId=${teamId}`}
                className="inline-flex items-center px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover transition text-sm font-medium"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Configure Team AWS Credentials
              </Link>
              <p className="text-xs text-gray-500 mt-3">
                Team members without personal AWS credentials will automatically use the team's credentials when uploading videos.
              </p>
            </div>
          </div>
        )}

        {/* Danger Zone */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-red-900 mb-4">Danger Zone</h2>
          <div className="bg-white rounded-lg shadow border-2 border-red-200 p-6 space-y-4">
            {team.userRole !== "OWNER" && (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Leave Team</h3>
                  <p className="text-sm text-gray-600">
                    Remove yourself from this team
                  </p>
                </div>
                <button
                  onClick={handleLeaveTeam}
                  className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition text-sm font-medium"
                >
                  Leave Team
                </button>
              </div>
            )}
            {team.userRole === "OWNER" && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Leave Team</h3>
                    <p className="text-sm text-gray-600">
                      You must assign another owner before leaving
                    </p>
                  </div>
                  <button
                    disabled
                    className="px-4 py-2 border border-gray-300 text-gray-400 rounded-lg cursor-not-allowed text-sm font-medium"
                  >
                    Leave Team
                  </button>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <h3 className="font-medium text-red-900">Delete Team</h3>
                    <p className="text-sm text-gray-600">
                      Permanently delete this team and all its data
                    </p>
                  </div>
                  <button
                    onClick={handleDeleteTeam}
                    className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium cursor-pointer"
                  >
                    Delete Team
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Invite Member Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full p-6">
              <h2 className="text-2xl font-bold mb-4">Invite Member</h2>
              <form onSubmit={handleInviteMember}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary"
                      placeholder="colleague@example.com"
                    />
                  </div>

                  {team.userRole === "OWNER" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <select
                        value={inviteRole}
                        onChange={(e) =>
                          setInviteRole(e.target.value as "OWNER" | "ADMIN" | "MEMBER")
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary"
                      >
                        <option value="MEMBER">Member</option>
                        <option value="ADMIN">Admin</option>
                        <option value="OWNER">Owner</option>
                      </select>
                      <p className="mt-2 text-sm text-gray-600">
                        {getRoleDescription(inviteRole)}
                      </p>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                      {error}
                    </div>
                  )}

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowInviteModal(false);
                        setInviteEmail("");
                        setInviteRole("MEMBER");
                        setError("");
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={inviting}
                      className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover transition disabled:opacity-50"
                    >
                      {inviting ? "Inviting..." : "Invite"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Role Modal */}
        {showEditRoleModal && editingMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full p-6">
              <h2 className="text-2xl font-bold mb-4">Edit Role</h2>
              <form onSubmit={handleUpdateRole}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Member
                    </label>
                    <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {editingMember.user?.email || editingMember.email}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      value={newRole}
                      onChange={(e) =>
                        setNewRole(e.target.value as "OWNER" | "ADMIN" | "MEMBER")
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary"
                    >
                      <option value="MEMBER">Member</option>
                      <option value="ADMIN">Admin</option>
                      <option value="OWNER">Owner</option>
                    </select>
                    <p className="mt-2 text-sm text-gray-600">
                      {getRoleDescription(newRole)}
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                      {error}
                    </div>
                  )}

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditRoleModal(false);
                        setEditingMember(null);
                        setError("");
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updating}
                      className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover transition disabled:opacity-50"
                    >
                      {updating ? "Updating..." : "Update Role"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
