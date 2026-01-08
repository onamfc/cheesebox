"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import VideoList from "@/components/VideoList";

interface TeamMember {
  id: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  user: {
    id: string;
    email: string;
  };
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
      const res = await fetch(`/api/teams/${teamId}/members`, {
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
    if (!editingMember) return;

    setError("");
    setUpdating(true);

    try {
      const res = await fetch(
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
      const res = await fetch(`/api/teams/${teamId}/members/${userId}`, {
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

  const handleLeaveTeam = async () => {
    if (
      !confirm(
        "Are you sure you want to leave this team? You will lose access to all team resources."
      )
    )
      return;

    try {
      const res = await fetch(`/api/teams/${teamId}/leave`, {
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
      const res = await fetch(`/api/teams/${teamId}`, {
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/teams"
            className="text-black-600 mb-4 inline-flex items-center"
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
              <p className="mt-1 text-gray-600">
                {team.members.length} {team.members.length === 1 ? "member" : "members"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Videos</div>
            <div className="text-3xl font-bold text-gray-900">
              {team._count.videos}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Groups</div>
            <div className="text-3xl font-bold text-gray-900">
              {team._count.groups}
            </div>
          </div>
        </div>

        {/* Team Videos Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Team Videos</h2>
            <p className="text-sm text-gray-600 mt-1">
              Videos uploaded using this team's AWS account
            </p>
          </div>
          <div className="p-6">
            <VideoList type="owned" teamId={teamId} />
          </div>
        </div>

        {/* Members Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Members</h2>
              {canInviteMembers && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-primary-hover transition text-sm"
                >
                  Invite Member
                </button>
              )}
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {team.members.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No members yet.
              </div>
            ) : (
              team.members.map((member) => {
                const isCurrentUser = member.user.id === currentUserId;
                const canRemove = canRemoveMember(member.role) && !isCurrentUser;

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
                            {member.user.email}
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
                      {canRemove && (
                        <button
                          onClick={() =>
                            handleRemoveMember(member.user.id, member.user.email)
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
        </div>

        {/* Team Settings (Owner/Admin only) */}
        {(team.userRole === "OWNER" || team.userRole === "ADMIN") && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Team Settings</h2>
              <p className="text-sm text-gray-600 mt-1">
                Configure team AWS credentials so all team members can upload videos
              </p>
            </div>
            <div className="p-6">
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
              <p className="text-sm text-gray-500 mt-3">
                Team members without personal AWS credentials will automatically use the team's credentials when uploading videos.
              </p>
            </div>
          </div>
        )}

        {/* Danger Zone */}
        <div className="bg-white rounded-lg shadow border border-red-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-red-900">Danger Zone</h2>
          </div>
          <div className="p-6 space-y-4">
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
                      {editingMember.user.email}
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
