import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import { Analytics } from "@vercel/analytics/react";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import dev from "@onamfc/developer-log";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cheesebox - Secure Video Sharing",
  description:
    "Share business-sensitive videos securely with AWS S3 and HLS streaming",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get user's theme preference
  let userTheme = "asiago"; // default theme

  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { settings: true },
      });

      if (user?.settings?.theme) {
        userTheme = user.settings.theme;
      }
    }
  } catch (error) {
    dev.error("Failed to load user theme:", error, {tag: "root"});
    // Fall back to the default theme
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProviderWrapper initialTheme={userTheme}>
          <SessionProvider>{children}</SessionProvider>
        </ThemeProviderWrapper>
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
