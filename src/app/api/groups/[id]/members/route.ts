import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-helpers";

// POST /api/groups/[id]/members - Add members
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: groupId } = await params;
    const body = await request.json();
    const { emails } = body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: "Emails array is required" },
        { status: 400 }
      );
    }

    // Check if user owns the group
    const group = await prisma.shareGroup.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    if (group.userId !== user.id) {
      return NextResponse.json(
        { error: "Only group owner can add members" },
        { status: 403 }
      );
    }

    // Validate email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const email of emails) {
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: `Invalid email address: ${email}` },
          { status: 400 }
        );
      }
    }

    // Get existing members to avoid duplicates
    const existingMembers = await prisma.shareGroupMember.findMany({
      where: {
        groupId,
        email: {
          in: emails.map((e: string) => e.toLowerCase()),
        },
      },
    });

    const existingEmails = new Set(existingMembers.map((m) => m.email));
    const newEmails = emails
      .map((e: string) => e.toLowerCase())
      .filter((e) => !existingEmails.has(e));

    if (newEmails.length === 0) {
      return NextResponse.json(
        { error: "All emails are already in the group" },
        { status: 409 }
      );
    }

    // Add new members
    const members = await prisma.shareGroupMember.createMany({
      data: newEmails.map((email) => ({
        groupId,
        email,
      })),
    });

    // Return updated group with all members
    const updatedGroup = await prisma.shareGroup.findUnique({
      where: { id: groupId },
      include: {
        members: {
          orderBy: {
            email: "asc",
          },
        },
      },
    });

    return NextResponse.json(updatedGroup);
  } catch (error) {
    console.error("Error adding group members:", error);
    return NextResponse.json(
      { error: "Failed to add group members" },
      { status: 500 }
    );
  }
}
