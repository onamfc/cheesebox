"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function DashboardNav() {
  const pathname = usePathname();
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });
  const navRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});

  const handleSignOut = async () => {
    const { signOut } = await import("next-auth/react");
    await signOut({ callbackUrl: "/auth/signin" });
  };

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(path);
  };

  const getActiveRoute = () => {
    if (pathname === "/dashboard") return "/dashboard";
    if (pathname.startsWith("/dashboard/teams")) return "/dashboard/teams";
    if (pathname.startsWith("/dashboard/groups")) return "/dashboard/groups";
    return "/dashboard";
  };

  useEffect(() => {
    const activeRoute = getActiveRoute();
    const activeElement = navRefs.current[activeRoute];

    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement;
      setPillStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [pathname]);

  return (
    <nav className="bg-brand-primary shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/dashboard"
              className="text-xl font-bold text-white transition"
            >
              Cheesebox
            </Link>
            <div className="hidden md:flex space-x-4 relative">
              {/* Animated pill background */}
              <div
                className="absolute bg-brand-secondary rounded-md transition-all duration-300 ease-in-out"
                style={{
                  left: `${pillStyle.left}px`,
                  width: `${pillStyle.width}px`,
                  height: '38px',
                  top: '1px',
                }}
              />

              <Link
                ref={(el) => { navRefs.current["/dashboard"] = el; }}
                href="/dashboard"
                className={`relative z-10 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/dashboard")
                    ? "text-brand-dark"
                    : "text-white hover:text-brand-secondary"
                }`}
              >
                Videos
              </Link>
              <Link
                ref={(el) => { navRefs.current["/dashboard/teams"] = el; }}
                href="/dashboard/teams"
                className={`relative z-10 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/dashboard/teams")
                    ? "text-brand-dark"
                    : "text-white hover:text-brand-secondary"
                }`}
              >
                Teams
              </Link>
              <Link
                ref={(el) => { navRefs.current["/dashboard/groups"] = el; }}
                href="/dashboard/groups"
                className={`relative z-10 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/dashboard/groups")
                    ? "text-brand-dark"
                    : "text-white hover:text-brand-secondary"
                }`}
              >
                Groups
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/settings"
              className="text-sm text-white hover:text-brand-secondary transition"
            >
              Settings
            </Link>
            <button
              onClick={handleSignOut}
              className="text-sm text-white hover:text-brand-secondary cursor-pointer transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
