"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import DashboardNav from "@/components/DashboardNav";

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
  awsCredentials: {
    id: string;
    bucketName: string;
    region: string;
  } | null;
  emailCredentials: {
    id: string;
    provider: string;
    fromEmail: string;
    fromName: string | null;
  } | null;
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
        return "bg-purple-100 text-purple-800";
      case "ADMIN":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      <DashboardNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/teams"
            className="text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center"
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

        {/* AWS Credentials Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">AWS Credentials</h2>
          </div>
          <div className="p-6">
            {team.awsCredentials ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600 mb-1">Bucket Name</div>
                    <div className="font-mono text-gray-900">
                      {team.awsCredentials.bucketName}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">Region</div>
                    <div className="font-mono text-gray-900">
                      {team.awsCredentials.region}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-3">No AWS credentials configured</p>
                {(team.userRole === "OWNER" || team.userRole === "ADMIN") && (
                  <Link
                    href="/dashboard/settings"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Configure in Settings →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Email Credentials Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Email Credentials
            </h2>
          </div>
          <div className="p-6">
            {team.emailCredentials ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600 mb-1">Provider</div>
                    <div className="font-mono text-gray-900">
                      {team.emailCredentials.provider}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">From Email</div>
                    <div className="font-mono text-gray-900">
                      {team.emailCredentials.fromName && (
                        <span>{team.emailCredentials.fromName} &lt;</span>
                      )}
                      {team.emailCredentials.fromEmail}
                      {team.emailCredentials.fromName && <span>&gt;</span>}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-3">No email credentials configured</p>
                {(team.userRole === "OWNER" || team.userRole === "ADMIN") && (
                  <Link
                    href="/dashboard/settings"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Configure in Settings →
                  </Link>
                )}
              </div>
            )}
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
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
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
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <svg
                          className="w-4 h-4 text-blue-600"
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
                          className="text-red-600 hover:text-red-700 text-sm"
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
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="MEMBER">Member</option>
                        <option value="ADMIN">Admin</option>
                        <option value="OWNER">Owner</option>
                      </select>
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
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="MEMBER">Member</option>
                      <option value="ADMIN">Admin</option>
                      <option value="OWNER">Owner</option>
                    </select>
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
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
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
