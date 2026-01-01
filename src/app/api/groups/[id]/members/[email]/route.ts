import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-helpers";

// DELETE /api/groups/[id]/members/[email] - Remove member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; email: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: groupId, email } = await params;
    const decodedEmail = decodeURIComponent(email);

    // Check if user owns the group
    const group = await prisma.shareGroup.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    if (group.userId !== user.id) {
      return NextResponse.json(
        { error: "Only group owner can remove members" },
        { status: 403 }
      );
    }

    // Remove member
    await prisma.shareGroupMember.delete({
      where: {
        groupId_email: {
          groupId,
          email: decodedEmail.toLowerCase(),
        },
      },
    });

    return NextResponse.json({ message: "Member removed successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Member not found in group" },
        { status: 404 }
      );
    }
    console.error("Error removing group member:", error);
    return NextResponse.json(
      { error: "Failed to remove group member" },
      { status: 500 }
    );
  }
}
