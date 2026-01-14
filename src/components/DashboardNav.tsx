"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { theme as defaultTheme } from "@/themes/asiago/theme";

export default function DashboardNav() {
  const pathname = usePathname();
  const { themeConfig } = useTheme();
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });
  const [showBetaTooltip, setShowBetaTooltip] = useState(false);
  const navRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});

  // Get theme configuration
  const layout = themeConfig?.layout?.navigation || defaultTheme.layout.navigation;
  const spacing = themeConfig?.spacing || defaultTheme.spacing;
  const isMinimal = false; // Theme uses 'sidebar' variant, not 'minimal'

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
      <div className={`${spacing.containerMaxWidth} mx-auto px-4 sm:px-6 lg:px-8`}>
        <div className={`flex justify-between ${isMinimal ? "h-12" : "h-16"}`}>
          <div className={`flex items-center ${isMinimal ? "space-x-4" : "space-x-8"}`}>
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className={`${isMinimal ? "text-lg" : "text-xl"} font-bold text-white transition`}
              >
                Cheesebox
              </Link>
              <div className="relative">
                <span
                  className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-brand-accent text-brand-primary rounded cursor-help"
                  onMouseEnter={() => setShowBetaTooltip(true)}
                  onMouseLeave={() => setShowBetaTooltip(false)}
                >
                  BETA
                </span>
                {showBetaTooltip && (
                  <div className="absolute left-0 top-full mt-2 w-72 bg-gray-900 text-white text-xs rounded-lg shadow-lg p-4 z-50">
                    <div className="absolute -top-2 left-4 w-4 h-4 bg-gray-900 transform rotate-45"></div>
                    <div className="relative">
                      <p className="font-semibold mb-2 text-brand-accent">🚀 Cheesebox is in Beta</p>
                      <p className="mb-2">You can expect:</p>
                      <ul className="space-y-1 ml-4 list-disc text-gray-300">
                        <li>Frequent updates and new features</li>
                        <li>Occasional UI/UX changes</li>
                        <li>Possible bugs (please report them!)</li>
                        <li>Active development and improvements</li>
                      </ul>
                      <p className="mt-3 text-gray-400 text-xs">
                        Your feedback helps us improve! 💛
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={`hidden md:flex ${isMinimal ? "space-x-2" : "space-x-4"} relative`}>
              {/* Animated pill background - hidden in minimal mode */}
              {!isMinimal && (
                <div
                  className="absolute bg-brand-secondary rounded-md transition-all duration-300 ease-in-out top-1/2 -translate-y-1/2"
                  style={{
                    left: `${pillStyle.left}px`,
                    width: `${pillStyle.width}px`,
                    height: '38px',
                  }}
                />
              )}

              <Link
                ref={(el) => { navRefs.current["/dashboard"] = el; }}
                href="/dashboard"
                className={`relative z-10 ${isMinimal ? "px-2 py-1 text-xs" : "px-3 py-2 text-sm"} rounded-md font-medium transition-colors ${
                  isActive("/dashboard")
                    ? "text-nav-active font-bold"
                    : "text-white hover:text-brand-secondary"
                }`}
              >
                Videos
              </Link>
              <Link
                ref={(el) => { navRefs.current["/dashboard/teams"] = el; }}
                href="/dashboard/teams"
                className={`relative z-10 ${isMinimal ? "px-2 py-1 text-xs" : "px-3 py-2 text-sm"} rounded-md font-medium transition-colors ${
                  isActive("/dashboard/teams")
                    ? "text-nav-active font-bold"
                    : "text-white hover:text-brand-secondary"
                }`}
              >
                Teams
              </Link>
              <Link
                ref={(el) => { navRefs.current["/dashboard/groups"] = el; }}
                href="/dashboard/groups"
                className={`relative z-10 ${isMinimal ? "px-2 py-1 text-xs" : "px-3 py-2 text-sm"} rounded-md font-medium transition-colors ${
                  isActive("/dashboard/groups")
                    ? "text-nav-active font-bold"
                    : "text-white hover:text-brand-secondary"
                }`}
              >
                Groups
              </Link>
            </div>
          </div>
          <div className={`flex items-center ${isMinimal ? "space-x-2" : "space-x-4"}`}>
            <Link
              href="/onboarding"
              className={`${isMinimal ? "text-xs" : "text-sm"} text-white hover:text-brand-secondary transition`}
              title="Setup Guide"
            >
              Setup Guide
            </Link>
            <Link
              href="/settings"
              className={`${isMinimal ? "text-xs" : "text-sm"} text-white hover:text-brand-secondary transition`}
            >
              Settings
            </Link>
            <button
              onClick={handleSignOut}
              className={`${isMinimal ? "text-xs" : "text-sm"} text-white hover:text-brand-secondary cursor-pointer transition`}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
