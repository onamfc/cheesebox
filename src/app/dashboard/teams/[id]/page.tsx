"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface TeamMember {
  id: string;
  role: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
  };
}

interface Team {
  id: string;
  name: string;
  slug: string;
  userRole: string;
  createdAt: string;
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
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("MEMBER");
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTeam();
  }, [teamId]);

  const loadTeam = async () => {
    try {
      const res = await fetch(`/api/teams/${teamId}`);
      if (!res.ok) {
        if (res.status === 404) {
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

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/teams/${teamId}/members/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update role");
      }

      await loadTeam();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const canManageMembers = team?.userRole === "OWNER" || team?.userRole === "ADMIN";
  const canManageSettings = team?.userRole === "OWNER" || team?.userRole === "ADMIN";

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
              <p className="mt-1 text-gray-600">/{team.slug}</p>
            </div>
            <span
              className={`px-3 py-1 text-sm font-semibold rounded ${
                team.userRole === "OWNER"
                  ? "bg-purple-100 text-purple-800"
                  : team.userRole === "ADMIN"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {team.userRole}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Members</div>
            <div className="text-3xl font-bold text-gray-900">
              {team.members.length}
            </div>
          </div>
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

        {/* Members Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
              {canManageMembers && (
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
            {team.members.map((member) => (
              <div key={member.id} className="p-6 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">
                    {member.user.email}
                  </div>
                  <div className="text-sm text-gray-500">
                    Joined {new Date(member.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {canManageMembers && team.userRole === "OWNER" ? (
                    <select
                      value={member.role}
                      onChange={(e) =>
                        handleUpdateRole(member.user.id, e.target.value)
                      }
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="MEMBER">Member</option>
                      <option value="ADMIN">Admin</option>
                      <option value="OWNER">Owner</option>
                    </select>
                  ) : (
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded ${
                        member.role === "OWNER"
                          ? "bg-purple-100 text-purple-800"
                          : member.role === "ADMIN"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {member.role}
                    </span>
                  )}
                  {canManageMembers && (
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
            ))}
          </div>
        </div>

        {/* Credentials Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Team Credentials</h2>
            <p className="text-sm text-gray-600 mt-1">
              AWS and Email settings shared by all team members
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">AWS Credentials</h3>
              {team.awsCredentials ? (
                <div className="bg-gray-50 rounded p-4 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-600">Bucket:</div>
                    <div className="font-mono">{team.awsCredentials.bucketName}</div>
                    <div className="text-gray-600">Region:</div>
                    <div className="font-mono">{team.awsCredentials.region}</div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-sm text-yellow-800">
                  No AWS credentials configured
                </div>
              )}
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Email Credentials</h3>
              {team.emailCredentials ? (
                <div className="bg-gray-50 rounded p-4 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-600">Provider:</div>
                    <div className="font-mono">{team.emailCredentials.provider}</div>
                    <div className="text-gray-600">From:</div>
                    <div className="font-mono">
                      {team.emailCredentials.fromName && (
                        <>{team.emailCredentials.fromName} &lt;</>
                      )}
                      {team.emailCredentials.fromEmail}
                      {team.emailCredentials.fromName && <>&gt;</>}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-sm text-yellow-800">
                  No email credentials configured
                </div>
              )}
            </div>

            {canManageSettings && (
              <div className="pt-4">
                <Link
                  href="/dashboard/settings"
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Configure credentials in Settings →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold mb-4">Invite Team Member</h2>
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
                    <p className="text-xs text-gray-500 mt-1">
                      User must have a Cheesebox account
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="MEMBER">Member - Can upload videos</option>
                      <option value="ADMIN">
                        Admin - Can manage members and settings
                      </option>
                      {team.userRole === "OWNER" && (
                        <option value="OWNER">Owner - Full control</option>
                      )}
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
                        setShowInviteModal(false);
                        setInviteEmail("");
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
      </div>
    </div>
  );
}
