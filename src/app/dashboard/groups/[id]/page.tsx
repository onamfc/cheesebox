"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import DashboardNav from "@/components/DashboardNav";
import VideoList from "@/components/VideoList";

interface GroupMember {
  id: string;
  email: string;
}

interface Group {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  team: {
    id: string;
    name: string;
    slug: string;
  } | null;
  members: GroupMember[];
  _count: {
    videoShares: number;
  };
}

export default function GroupDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.id as string;

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmails, setNewEmails] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [renameError, setRenameError] = useState("");

  useEffect(() => {
    loadGroup();
  }, [groupId]);

  const loadGroup = async () => {
    try {
      const res = await fetch(`/api/groups/${groupId}`);
      if (!res.ok) {
        if (res.status === 404 || res.status === 403) {
          router.push("/dashboard/groups");
          return;
        }
        throw new Error("Failed to load group");
      }
      const data = await res.json();
      setGroup(data);
    } catch (error) {
      console.error("Error loading group:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMembers = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAdding(true);

    try {
      // Parse email list (comma or newline separated)
      const emailList = newEmails
        .split(/[,\n]/)
        .map((e) => e.trim())
        .filter((e) => e.length > 0);

      if (emailList.length === 0) {
        throw new Error("Please enter at least one email address");
      }

      const res = await fetch(`/api/groups/${groupId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: emailList }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add members");
      }

      await loadGroup();
      setShowAddModal(false);
      setNewEmails("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveMember = async (email: string) => {
    if (!confirm(`Remove ${email} from the group?`)) return;

    try {
      const res = await fetch(
        `/api/groups/${groupId}/members/${encodeURIComponent(email)}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to remove member");
      }

      await loadGroup();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRenameGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setRenameError("");
    setRenaming(true);

    try {
      if (!newName.trim()) {
        throw new Error("Group name cannot be empty");
      }

      const res = await fetch(`/api/groups/${groupId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to rename group");
      }

      await loadGroup();
      setShowRenameModal(false);
      setNewName("");
    } catch (err: any) {
      setRenameError(err.message);
    } finally {
      setRenaming(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!confirm(`Delete "${group?.name}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/groups/${groupId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete group");
      }

      router.push("/dashboard/groups");
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading group...</div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Group not found</div>
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
            href="/dashboard/groups"
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
            Back to Groups
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
                <button
                  onClick={() => {
                    setNewName(group.name);
                    setShowRenameModal(true);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Rename group"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              </div>
              {group.description && (
                <p className="mt-1 text-gray-600">{group.description}</p>
              )}
              {group.team && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                    Team: {group.team.name}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={handleDeleteGroup}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Delete Group
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Members</div>
            <div className="text-3xl font-bold text-gray-900">
              {group.members.length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Shared Videos</div>
            <div className="text-3xl font-bold text-gray-900">
              {group._count.videoShares}
            </div>
          </div>
        </div>

        {/* Members Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Members</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
              >
                Add Members
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {group.members.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No members yet. Add some to get started.
              </div>
            ) : (
              group.members.map((member) => (
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
                    <div className="font-medium text-gray-900">{member.email}</div>
                  </div>
                  <button
                    onClick={() => handleRemoveMember(member.email)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* How to Use */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            How to share videos with this group
          </h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>Go to your video in the dashboard</li>
            <li>Click the share button</li>
            <li>Select "Share with Group" tab</li>
            <li>Choose "{group.name}" from the dropdown</li>
            <li>All {group.members.length} members will receive the video!</li>
          </ol>
        </div>

        {/* Shared Videos Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Videos Shared with This Group
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              All videos that have been shared with "{group.name}"
            </p>
          </div>
          <div className="p-6">
            <VideoList type="group" groupId={groupId} />
          </div>
        </div>

        {/* Add Members Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full p-6">
              <h2 className="text-2xl font-bold mb-4">Add Members</h2>
              <form onSubmit={handleAddMembers}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Addresses
                    </label>
                    <textarea
                      required
                      value={newEmails}
                      onChange={(e) => setNewEmails(e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      placeholder="user1@example.com&#10;user2@example.com&#10;user3@example.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter one email per line, or separate with commas
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
                        setShowAddModal(false);
                        setNewEmails("");
                        setError("");
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={adding}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {adding ? "Adding..." : "Add Members"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Rename Group Modal */}
        {showRenameModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full p-6">
              <h2 className="text-2xl font-bold mb-4">Rename Group</h2>
              <form onSubmit={handleRenameGroup}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Group Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter new group name"
                      autoFocus
                    />
                  </div>

                  {renameError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                      {renameError}
                    </div>
                  )}

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowRenameModal(false);
                        setNewName("");
                        setRenameError("");
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={renaming}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {renaming ? "Renaming..." : "Rename Group"}
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
