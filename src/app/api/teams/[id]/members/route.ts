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

// POST /api/teams/[id]/members - Invite member
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: teamId } = await params;
    const body = await request.json();
    const { email, role = "MEMBER" } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate role
    if (!["OWNER", "ADMIN", "MEMBER"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    // Check if user is OWNER or ADMIN
    const { allowed } = await checkTeamRole(teamId, user.id, ["OWNER", "ADMIN"]);
    if (!allowed) {
      return NextResponse.json(
        { error: "Only team owners and admins can invite members" },
        { status: 403 }
      );
    }

    // Only OWNERs can add other OWNERs
    if (role === "OWNER") {
      const { allowed: isOwner } = await checkTeamRole(teamId, user.id, ["OWNER"]);
      if (!isOwner) {
        return NextResponse.json(
          { error: "Only team owners can add other owners" },
          { status: 403 }
        );
      }
    }

    // Find user by email
    const invitedUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!invitedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user is already a member
    const existingMembership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: invitedUser.id,
        },
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { error: "User is already a team member" },
        { status: 409 }
      );
    }

    // Add user to team
    const membership = await prisma.teamMember.create({
      data: {
        teamId,
        userId: invitedUser.id,
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(membership, { status: 201 });
  } catch (error) {
    console.error("Error adding team member:", error);
    return NextResponse.json(
      { error: "Failed to add team member" },
      { status: 500 }
    );
  }
}
