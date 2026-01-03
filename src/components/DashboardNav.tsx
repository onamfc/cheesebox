"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardNav() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    const { signOut } = await import("next-auth/react");
    await signOut({ callbackUrl: "/auth/signin" });
  };

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/dashboard"
              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition"
            >
              Cheesebox
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  pathname === "/dashboard"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Videos
              </Link>
              <Link
                href="/dashboard/teams"
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive("/dashboard/teams")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Teams
              </Link>
              <Link
                href="/dashboard/groups"
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive("/dashboard/groups")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Groups
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/settings"
              className="text-sm text-blue-600 hover:text-blue-500 transition"
            >
              Settings
            </Link>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-700 hover:text-gray-900 transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
