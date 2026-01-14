import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

// GET /api/user/onboarding - Get user's onboarding status with teams and groups
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        onboardingCompleted: true,
        onboardingPath: true,
        onboardingCompletedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's teams
    const teams = await prisma.team.findMany({
      where: {
        members: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        _count: {
          select: {
            videos: true,
            groups: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Add user's role to each team
    const teamsWithRole = teams.map((team) => {
      const membership = team.members.find((m) => m.user?.email === session.user.email);
      return {
        ...team,
        userRole: membership?.role,
      };
    });

    // Get user's groups (both owned and member of)
    const groups = await prisma.shareGroup.findMany({
      where: {
        OR: [
          { owner: { email: session.user.email } }, // Groups owned by user
          {
            members: {
              some: {
                email: session.user.email, // Groups where user is a member
              },
            },
          },
        ],
      },
      include: {
        members: true,
        team: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            videoShares: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      onboardingCompleted: user.onboardingCompleted,
      onboardingPath: user.onboardingPath,
      onboardingCompletedAt: user.onboardingCompletedAt,
      teams: teamsWithRole,
      groups: groups,
    });
  } catch (error) {
    console.error("Error fetching onboarding status:", error);
    return NextResponse.json(
      { error: "Failed to fetch onboarding status" },
      { status: 500 }
    );
  }
}
