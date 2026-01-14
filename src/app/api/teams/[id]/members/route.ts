import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-helpers";

// POST /api/teams/[id]/members - Invite team member (OWNER/ADMIN only)
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
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Check if user is OWNER or ADMIN
    const membership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: user.id,
        },
      },
    });

    if (!membership || (membership.role !== "OWNER" && membership.role !== "ADMIN")) {
      return NextResponse.json(
        { error: "Only team owners and admins can invite members" },
        { status: 403 }
      );
    }

    // Only OWNER can add other OWNERs or ADMINs
    if ((role === "OWNER" || role === "ADMIN") && membership.role !== "OWNER") {
      return NextResponse.json(
        { error: "Only team owners can add admins or other owners" },
        { status: 403 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    // Find user by email
    const invitedUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Check if there's already a pending invitation or existing member for this email
    const existingInvitation = await prisma.teamMember.findUnique({
      where: {
        teamId_email: {
          teamId,
          email: normalizedEmail,
        },
      },
    });

    if (existingInvitation) {
      if (existingInvitation.status === "PENDING") {
        return NextResponse.json(
          { error: "An invitation has already been sent to this email" },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { error: "User is already a team member" },
          { status: 400 }
        );
      }
    }

    // If user exists, check if they're already a member by userId
    if (invitedUser) {
      const existingMemberByUserId = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId,
            userId: invitedUser.id,
          },
        },
      });

      if (existingMemberByUserId) {
        return NextResponse.json(
          { error: "User is already a team member" },
          { status: 400 }
        );
      }
    }

    // Create invitation (pending if user doesn't exist, accepted if they do)
    const newMember = await prisma.teamMember.create({
      data: {
        teamId,
        userId: invitedUser?.id,
        email: normalizedEmail,
        role,
        status: invitedUser ? "ACCEPTED" : "PENDING",
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

    // TODO: Send invitation email to the user
    // This will be implemented in a later step

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error("Error adding team member:", error);
    return NextResponse.json(
      { error: "Failed to add team member" },
      { status: 500 }
    );
  }
}
