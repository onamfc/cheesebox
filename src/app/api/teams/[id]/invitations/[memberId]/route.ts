import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-helpers";

// DELETE /api/teams/[id]/invitations/[memberId] - Cancel a pending invitation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: teamId, memberId } = await params;

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
        { error: "Only team owners and admins can cancel invitations" },
        { status: 403 }
      );
    }

    // Get the invitation
    const invitation = await prisma.teamMember.findUnique({
      where: { id: memberId },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    // Verify it belongs to this team
    if (invitation.teamId !== teamId) {
      return NextResponse.json(
        { error: "Invitation does not belong to this team" },
        { status: 403 }
      );
    }

    // Verify it's a pending invitation
    if (invitation.status !== "PENDING") {
      return NextResponse.json(
        { error: "This invitation has already been accepted" },
        { status: 400 }
      );
    }

    // Delete the pending invitation
    await prisma.teamMember.delete({
      where: { id: memberId },
    });

    return NextResponse.json(
      { message: "Invitation cancelled successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error cancelling invitation:", error);
    return NextResponse.json(
      { error: "Failed to cancel invitation" },
      { status: 500 }
    );
  }
}
