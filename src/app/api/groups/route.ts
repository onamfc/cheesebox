import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth-helpers";

// GET /api/groups - List user's groups
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get("teamId");

    // Build where clause
    const where: any = {
      OR: [
        { userId: user.id }, // Groups owned by user
        {
          members: {
            some: {
              email: user.email, // Groups where user is a member
            },
          },
        },
      ],
    };

    // If teamId provided, also include team groups where user is a member
    if (teamId) {
      // Verify user is a member of the team
      const membership = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId,
            userId: user.id,
          },
        },
      });

      if (membership) {
        where.OR.push({ teamId });
      }
    }

    // Get all groups
    const groups = await prisma.shareGroup.findMany({
      where,
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
        createdAt: "desc",
      },
    });

    return NextResponse.json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}

// POST /api/groups - Create group
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, teamId, members = [] } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // If teamId provided, verify user is a member
    if (teamId) {
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
          { error: "You must be a team member to create team groups" },
          { status: 403 }
        );
      }
    }

    // Validate email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const email of members) {
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: `Invalid email address: ${email}` },
          { status: 400 }
        );
      }
    }

    // Create group with members
    const group = await prisma.shareGroup.create({
      data: {
        name,
        description,
        userId: user.id,
        teamId: teamId || null,
        members: {
          create: members.map((email: string) => ({
            email: email.toLowerCase(),
          })),
        },
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

    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    console.error("Error creating group:", error);
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
}
