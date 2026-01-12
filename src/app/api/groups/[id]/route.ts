import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-helpers";
import dev from "@onamfc/developer-log";

// Helper to check if user has access to group
async function checkGroupAccess(groupId: string, userId: string, userEmail: string) {
  const group = await prisma.shareGroup.findUnique({
    where: { id: groupId },
    include: {
      members: true,
      team: {
        include: {
          members: {
            where: {
              userId,
            },
          },
        },
      },
    },
  });

  if (!group) {
    return { allowed: false, group: null, isOwner: false };
  }

  const isOwner = group.userId === userId;
  const isGroupMember = group.members.some((m) => m.email === userEmail);
  const isTeamMember = (group.team?.members?.length ?? 0) > 0;

  return {
    allowed: isOwner || isGroupMember || isTeamMember,
    group,
    isOwner,
  };
}

// GET /api/groups/[id] - Get group details
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

    const { allowed, group } = await checkGroupAccess(id, user.id, user.email);

    if (!allowed || !group) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Get full group details
    const fullGroup = await prisma.shareGroup.findUnique({
      where: { id },
      include: {
        members: {
          orderBy: {
            email: "asc",
          },
        },
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
    });

    return NextResponse.json(fullGroup);
  } catch (error) {
    console.error("Error fetching group:", error);
    return NextResponse.json(
      { error: "Failed to fetch group" },
      { status: 500 }
    );
  }
}

// PATCH /api/groups/[id] - Update group
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
    const { name, description } = body;

    // Only group owner can edit
    const { isOwner } = await checkGroupAccess(id, user.id, user.email);
    if (!isOwner) {
      return NextResponse.json(
        { error: "Only group owner can edit the group" },
        { status: 403 }
      );
    }

    // Update group
    const group = await prisma.shareGroup.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
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
      },
    });

    return NextResponse.json(group);
  } catch (error) {
    dev.error("Error updating group:", error, {tag: "group"});
    return NextResponse.json(
      { error: "Failed to update group" },
      { status: 500 }
    );
  }
}

// DELETE /api/groups/[id] - Delete group
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

    // Only group owner can delete
    const { isOwner } = await checkGroupAccess(id, user.id, user.email);
    if (!isOwner) {
      return NextResponse.json(
        { error: "Only group owner can delete the group" },
        { status: 403 }
      );
    }

    // Delete group (cascade will handle members and video shares)
    await prisma.shareGroup.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Group deleted successfully" });
  } catch (error) {
    dev.error("Error deleting group:", error, {tag: "group"});
    return NextResponse.json(
      { error: "Failed to delete group" },
      { status: 500 }
    );
  }
}
