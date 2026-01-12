import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/encryption";
import dev from "@onamfc/developer-log";

const awsCredentialsSchema = z.object({
  accessKeyId: z.string().min(16, "Access Key ID is required"),
  secretAccessKey: z.string().min(16, "Secret Access Key is required"),
  bucketName: z.string().min(1, "Bucket name is required"),
  region: z.string().min(1, "Region is required"),
  mediaConvertRole: z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
});

// GET - Retrieve AWS credentials (decrypted)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check for teamId query parameter
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get("teamId");

    let credentials;

    if (teamId) {
      // Verify user is a member of the team (owner or admin)
      const teamMember = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId,
            userId: session.user.id,
          },
        },
      });

      if (!teamMember || (teamMember.role !== "OWNER" && teamMember.role !== "ADMIN")) {
        return NextResponse.json(
          { error: "Access denied. Only team owners and admins can manage team credentials." },
          { status: 403 },
        );
      }

      // Get team credentials
      credentials = await prisma.awsCredentials.findUnique({
        where: { teamId },
      });
    } else {
      // Get user credentials
      credentials = await prisma.awsCredentials.findUnique({
        where: { userId: session.user.id },
      });
    }

    if (!credentials) {
      return NextResponse.json(
        {
          configured: false,
          message: "AWS credentials not configured"
        },
        { status: 200 },
      );
    }

    // SECURITY: Never return decrypted credentials in API responses
    // Return configuration status only with masked values
    const accessKeyId = decrypt(credentials.accessKeyId);
    const configurationStatus = {
      configured: true,
      // Only show last 4 characters of access key for verification
      accessKeyId: `***${accessKeyId.slice(-4)}`,
      bucketName: credentials.bucketName,
      region: credentials.region,
      hasMediaConvertRole: !!credentials.mediaConvertRole,
      lastUpdated: credentials.updatedAt,
      // NEVER include secretAccessKey in any form
    };

    return NextResponse.json(configurationStatus);
  } catch (error) {
    dev.error("Error retrieving AWS credentials:", error, {tag:"aws"});
    return NextResponse.json(
      { error: "Failed to retrieve AWS credentials" },
      { status: 500 },
    );
  }
}

// POST - Create or update AWS credentials
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const teamId = body.teamId as string | undefined;

    // If teamId is provided, verify user is team owner or admin
    if (teamId) {
      const teamMember = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId,
            userId: session.user.id,
          },
        },
      });

      if (!teamMember || (teamMember.role !== "OWNER" && teamMember.role !== "ADMIN")) {
        return NextResponse.json(
          { error: "Access denied. Only team owners and admins can manage team credentials." },
          { status: 403 },
        );
      }
    }

    // Validate input
    const validationResult = awsCredentialsSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 },
      );
    }

    const {
      accessKeyId,
      secretAccessKey,
      bucketName,
      region,
      mediaConvertRole,
    } = validationResult.data;

    // Encrypt sensitive data
    const encryptedAccessKeyId = encrypt(accessKeyId);
    const encryptedSecretAccessKey = encrypt(secretAccessKey);

    // Upsert credentials
    let credentials;
    if (teamId) {
      // Team credentials
      credentials = await prisma.awsCredentials.upsert({
        where: { teamId },
        create: {
          teamId,
          accessKeyId: encryptedAccessKeyId,
          secretAccessKey: encryptedSecretAccessKey,
          bucketName,
          region,
          mediaConvertRole: mediaConvertRole ?? null,
        },
        update: {
          accessKeyId: encryptedAccessKeyId,
          secretAccessKey: encryptedSecretAccessKey,
          bucketName,
          region,
          mediaConvertRole: mediaConvertRole ?? null,
        },
      });
    } else {
      // User credentials
      credentials = await prisma.awsCredentials.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          accessKeyId: encryptedAccessKeyId,
          secretAccessKey: encryptedSecretAccessKey,
          bucketName,
          region,
          mediaConvertRole: mediaConvertRole ?? null,
        },
        update: {
          accessKeyId: encryptedAccessKeyId,
          secretAccessKey: encryptedSecretAccessKey,
          bucketName,
          region,
          mediaConvertRole: mediaConvertRole ?? null,
        },
      });
    }

    return NextResponse.json(
      { message: "AWS credentials saved successfully" },
      { status: 200 },
    );
  } catch (error) {
    dev.error("Error saving AWS credentials:", error, {tag:"aws"});
    return NextResponse.json(
      { error: "Failed to save AWS credentials" },
      { status: 500 },
    );
  }
}
