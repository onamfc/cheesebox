import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-helpers";

// DELETE /api/teams/[id]/leave - Leave team
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: teamId } = await params;

    // Check if user is a member
    const membership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: user.id,
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "You are not a member of this team" },
        { status: 404 }
      );
    }

    // Check if user is the only OWNER
    if (membership.role === "OWNER") {
      const ownerCount = await prisma.teamMember.count({
        where: {
          teamId,
          role: "OWNER",
        },
      });

      if (ownerCount === 1) {
        return NextResponse.json(
          {
            error:
              "You are the only owner. Assign another owner or delete the team instead.",
          },
          { status: 400 }
        );
      }
    }

    // Remove membership
    await prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId,
          userId: user.id,
        },
      },
    });

    return NextResponse.json({ message: "Successfully left the team" });
  } catch (error) {
    console.error("Error leaving team:", error);
    return NextResponse.json(
      { error: "Failed to leave team" },
      { status: 500 }
    );
  }
}
