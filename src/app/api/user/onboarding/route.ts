import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// PATCH /api/user/onboarding - Update user's onboarding status
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { completed, path } = body;

    // Validate inputs
    if (typeof completed !== "boolean") {
      return NextResponse.json(
        { error: "completed must be a boolean" },
        { status: 400 }
      );
    }

    if (path && !["uploader", "recipient", "skipped"].includes(path)) {
      return NextResponse.json(
        { error: "path must be 'uploader', 'recipient', or 'skipped'" },
        { status: 400 }
      );
    }

    // Update user's onboarding status
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        onboardingCompleted: completed,
        onboardingPath: path || undefined,
        onboardingCompletedAt: completed ? new Date() : null,
      },
      select: {
        id: true,
        email: true,
        onboardingCompleted: true,
        onboardingPath: true,
        onboardingCompletedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error updating onboarding status:", error);
    return NextResponse.json(
      { error: "Failed to update onboarding status" },
      { status: 500 }
    );
  }
}

// GET /api/user/onboarding - Get user's onboarding status
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        onboardingCompleted: true,
        onboardingPath: true,
        onboardingCompletedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching onboarding status:", error);
    return NextResponse.json(
      { error: "Failed to fetch onboarding status" },
      { status: 500 }
    );
  }
}
