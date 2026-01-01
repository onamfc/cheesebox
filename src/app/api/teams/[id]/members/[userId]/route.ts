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

// PATCH /api/teams/[id]/members/[userId] - Update member role
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: teamId, userId: targetUserId } = await params;
    const body = await request.json();
    const { role } = body;

    if (!role || !["OWNER", "ADMIN", "MEMBER"].includes(role)) {
      return NextResponse.json(
        { error: "Valid role is required" },
        { status: 400 }
      );
    }

    // Check if user is OWNER or ADMIN
    const { allowed, membership: userMembership } = await checkTeamRole(
      teamId,
      user.id,
      ["OWNER", "ADMIN"]
    );
    if (!allowed) {
      return NextResponse.json(
        { error: "Only team owners and admins can update member roles" },
        { status: 403 }
      );
    }

    // Only OWNERs can modify OWNER roles
    if (role === "OWNER" || userMembership?.role !== "OWNER") {
      const targetMembership = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId,
            userId: targetUserId,
          },
        },
      });

      if (targetMembership?.role === "OWNER" || role === "OWNER") {
        const { allowed: isOwner } = await checkTeamRole(teamId, user.id, ["OWNER"]);
        if (!isOwner) {
          return NextResponse.json(
            { error: "Only team owners can modify owner roles" },
            { status: 403 }
          );
        }
      }
    }

    // Prevent removing the last owner
    if (role !== "OWNER") {
      const ownerCount = await prisma.teamMember.count({
        where: {
          teamId,
          role: "OWNER",
        },
      });

      const targetMembership = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId,
            userId: targetUserId,
          },
        },
      });

      if (targetMembership?.role === "OWNER" && ownerCount === 1) {
        return NextResponse.json(
          { error: "Cannot change role of the last team owner" },
          { status: 400 }
        );
      }
    }

    // Update member role
    const membership = await prisma.teamMember.update({
      where: {
        teamId_userId: {
          teamId,
          userId: targetUserId,
        },
      },
      data: {
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

    return NextResponse.json(membership);
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json(
      { error: "Failed to update team member" },
      { status: 500 }
    );
  }
}

// DELETE /api/teams/[id]/members/[userId] - Remove member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: teamId, userId: targetUserId } = await params;

    // Check if user is OWNER or ADMIN (or removing themselves)
    const isSelf = user.id === targetUserId;
    if (!isSelf) {
      const { allowed } = await checkTeamRole(teamId, user.id, ["OWNER", "ADMIN"]);
      if (!allowed) {
        return NextResponse.json(
          { error: "Only team owners and admins can remove members" },
          { status: 403 }
        );
      }
    }

    // Check if target is the last owner
    const targetMembership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: targetUserId,
        },
      },
    });

    if (targetMembership?.role === "OWNER") {
      const ownerCount = await prisma.teamMember.count({
        where: {
          teamId,
          role: "OWNER",
        },
      });

      if (ownerCount === 1) {
        return NextResponse.json(
          { error: "Cannot remove the last team owner" },
          { status: 400 }
        );
      }
    }

    // Remove member
    await prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId,
          userId: targetUserId,
        },
      },
    });

    return NextResponse.json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("Error removing team member:", error);
    return NextResponse.json(
      { error: "Failed to remove team member" },
      { status: 500 }
    );
  }
}
