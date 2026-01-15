import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";
import dev from "@onamfc/developer-log";

/**
 * GET - Import AWS credentials from personal account or team
 * This endpoint returns decrypted credentials for the purpose of copying them to another account
 *
 * Query Parameters:
 * - sourceId: "personal" or a team ID to import from
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sourceId = searchParams.get("sourceId");

    if (!sourceId) {
      return NextResponse.json(
        { error: "sourceId parameter is required" },
        { status: 400 }
      );
    }

    let credentials;

    if (sourceId === "personal") {
      // Import from personal account
      credentials = await prisma.awsCredentials.findUnique({
        where: { userId: session.user.id },
      });

      if (!credentials) {
        return NextResponse.json(
          { error: "Personal AWS credentials not found" },
          { status: 404 }
        );
      }
    } else {
      // Import from team - verify user is a member
      const teamMember = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId: sourceId,
            userId: session.user.id,
          },
        },
      });

      if (!teamMember || (teamMember.role !== "OWNER" && teamMember.role !== "ADMIN")) {
        return NextResponse.json(
          { error: "Access denied. Only team owners and admins can import team credentials." },
          { status: 403 }
        );
      }

      credentials = await prisma.awsCredentials.findUnique({
        where: { teamId: sourceId },
      });

      if (!credentials) {
        return NextResponse.json(
          { error: "Team AWS credentials not found" },
          { status: 404 }
        );
      }
    }

    // Decrypt credentials for import
    const decryptedCredentials = {
      accessKeyId: decrypt(credentials.accessKeyId),
      secretAccessKey: decrypt(credentials.secretAccessKey),
      bucketName: credentials.bucketName,
      region: credentials.region,
      mediaConvertRole: credentials.mediaConvertRole || "",
    };

    dev.log(
      `AWS credentials imported from ${sourceId === "personal" ? "personal account" : `team ${sourceId}`} by user ${session.user.id}`,
      { tag: "aws" }
    );

    return NextResponse.json(decryptedCredentials);
  } catch (error) {
    dev.error("Error importing AWS credentials:", error, { tag: "aws" });
    return NextResponse.json(
      { error: "Failed to import AWS credentials" },
      { status: 500 }
    );
  }
}
