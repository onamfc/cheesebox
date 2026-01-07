import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Get available AWS credential sources for import
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sources: any[] = [];

    // Check if user has personal credentials
    const personalCredentials = await prisma.awsCredentials.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        bucketName: true,
        region: true,
      },
    });

    if (personalCredentials) {
      sources.push({
        id: "personal",
        type: "personal",
        name: "Personal Account",
        bucketName: personalCredentials.bucketName,
        region: personalCredentials.region,
      });
    }

    // Find teams where user is owner or admin and that have credentials
    const teams = await prisma.team.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id,
            role: {
              in: ["OWNER", "ADMIN"],
            },
          },
        },
        awsCredentials: {
          isNot: null,
        },
      },
      include: {
        awsCredentials: {
          select: {
            id: true,
            bucketName: true,
            region: true,
          },
        },
      },
    });

    for (const team of teams) {
      if (team.awsCredentials) {
        sources.push({
          id: team.id,
          type: "team",
          name: team.name,
          bucketName: team.awsCredentials.bucketName,
          region: team.awsCredentials.region,
        });
      }
    }

    return NextResponse.json({ sources });
  } catch (error) {
    console.error("Error fetching AWS credential sources:", error);
    return NextResponse.json(
      { error: "Failed to fetch credential sources" },
      { status: 500 }
    );
  }
}
