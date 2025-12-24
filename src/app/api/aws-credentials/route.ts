import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/encryption";

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

    const credentials = await prisma.awsCredentials.findUnique({
      where: { userId: session.user.id },
    });

    if (!credentials) {
      return NextResponse.json(
        { error: "AWS credentials not found" },
        { status: 404 },
      );
    }

    // Decrypt credentials before sending
    const decryptedCredentials = {
      accessKeyId: decrypt(credentials.accessKeyId),
      secretAccessKey: decrypt(credentials.secretAccessKey),
      bucketName: credentials.bucketName,
      region: credentials.region,
      mediaConvertRole: credentials.mediaConvertRole || "",
    };

    return NextResponse.json(decryptedCredentials);
  } catch (error) {
    console.error("Error retrieving AWS credentials:", error);
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

    // Validate input
    const validationResult = awsCredentialsSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
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
    const credentials = await prisma.awsCredentials.upsert({
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

    return NextResponse.json(
      { message: "AWS credentials saved successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error saving AWS credentials:", error);
    return NextResponse.json(
      { error: "Failed to save AWS credentials" },
      { status: 500 },
    );
  }
}
