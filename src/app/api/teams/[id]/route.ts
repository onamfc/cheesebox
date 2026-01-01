import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-helpers";

// Helper to check if user is team member with specific role
async function checkTeamRole(teamId: string, userId: string, requiredRoles: string[]) {
  const membership = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId,
        userId,
      },
    },
  });

  if (!membership) {
    return { allowed: false, membership: null };
  }

  return {
    allowed: requiredRoles.includes(membership.role),
    membership,
  };
}

// GET /api/teams/[id] - Get team details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const team = await prisma.team.findUnique({
      where: { id },
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
            createdAt: "asc",
          },
        },
        awsCredentials: {
          select: {
            id: true,
            bucketName: true,
            region: true,
            createdAt: true,
          },
        },
        emailCredentials: {
          select: {
            id: true,
            provider: true,
            fromEmail: true,
            fromName: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            videos: true,
            groups: true,
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Check if user is a member
    const membership = team.members.find((m) => m.userId === user.id);
    if (!membership) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      ...team,
      userRole: membership.role,
    });
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 }
    );
  }
}

// PATCH /api/teams/[id] - Update team
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, slug } = body;

    // Check if user is OWNER or ADMIN
    const { allowed } = await checkTeamRole(id, user.id, ["OWNER", "ADMIN"]);
    if (!allowed) {
      return NextResponse.json(
        { error: "Only team owners and admins can update team settings" },
        { status: 403 }
      );
    }

    // If updating slug, check if it's available
    if (slug) {
      if (!/^[a-z0-9-]+$/.test(slug)) {
        return NextResponse.json(
          { error: "Slug must contain only lowercase letters, numbers, and hyphens" },
          { status: 400 }
        );
      }

      const existingTeam = await prisma.team.findUnique({
        where: { slug },
      });

      if (existingTeam && existingTeam.id !== id) {
        return NextResponse.json(
          { error: "Slug is already taken" },
          { status: 409 }
        );
      }
    }

    // Update team
    const team = await prisma.team.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
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
        },
      },
    });

    return NextResponse.json(team);
  } catch (error) {
    console.error("Error updating team:", error);
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 }
    );
  }
}

// DELETE /api/teams/[id] - Delete team
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if user is OWNER
    const { allowed } = await checkTeamRole(id, user.id, ["OWNER"]);
    if (!allowed) {
      return NextResponse.json(
        { error: "Only team owner can delete the team" },
        { status: 403 }
      );
    }

    // Delete team (cascade will handle members, credentials, etc.)
    await prisma.team.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json(
      { error: "Failed to delete team" },
      { status: 500 }
    );
  }
}
