import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/encryption";
import { createEmailProvider } from "@/lib/email/factory";
import { EmailProviderType } from "@/lib/email/interface";
import dev from "@onamfc/developer-log";

// GET - Fetch email credentials
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const credentials = await prisma.emailCredentials.findUnique({
      where: { userId: session.user.id },
    });

    if (!credentials) {
      return NextResponse.json(
        { error: "No email credentials found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      provider: credentials.provider,
      fromEmail: credentials.fromEmail,
      fromName: credentials.fromName,
      // Send placeholder values to indicate credentials exist (don't send actual encrypted values)
      apiKey: credentials.apiKey ? "••••••••••••••••" : "",
      awsAccessKeyId: credentials.awsAccessKeyId ? "••••••••••••••••" : "",
      awsSecretKey: credentials.awsSecretKey ? "••••••••••••••••" : "",
      smtpUsername: credentials.smtpUsername ? "••••••••••••••••" : "",
      smtpPassword: credentials.smtpPassword ? "••••••••••••••••" : "",
      awsRegion: credentials.awsRegion,
      smtpHost: credentials.smtpHost,
      smtpPort: credentials.smtpPort,
      smtpSecure: credentials.smtpSecure,
      isValid: credentials.isValid,
      lastValidated: credentials.lastValidated,
    });
  } catch (error) {
    dev.error("Error fetching email credentials:", error, {tag: "email"});
    return NextResponse.json(
      { error: "Failed to fetch email credentials" },
      { status: 500 },
    );
  }
}

// POST - Save or update email credentials
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      provider,
      fromEmail,
      fromName,
      apiKey,
      awsAccessKeyId,
      awsSecretKey,
      awsRegion,
      smtpHost,
      smtpPort,
      smtpUsername,
      smtpPassword,
      smtpSecure,
    } = body;

    // Helper function to check if value is a placeholder
    const isPlaceholder = (value: string | undefined) =>
      value === "••••••••••••••••";

    // Fetch existing credentials to preserve encrypted values
    const existingCredentials = await prisma.emailCredentials.findUnique({
      where: { userId: session.user.id },
    });

    // Validate based on provider
    if (!provider || !fromEmail) {
      return NextResponse.json(
        { error: "Provider and from email are required" },
        { status: 400 },
      );
    }

    // Validate provider-specific required fields (accounting for placeholders)
    if (provider === "RESEND" && !apiKey && !existingCredentials?.apiKey) {
      return NextResponse.json(
        { error: "API key is required for Resend" },
        { status: 400 },
      );
    }

    if (
      provider === "AWS_SES" &&
      ((!awsAccessKeyId && !existingCredentials?.awsAccessKeyId) ||
        (!awsSecretKey && !existingCredentials?.awsSecretKey) ||
        !awsRegion)
    ) {
      return NextResponse.json(
        { error: "AWS credentials are required for AWS SES" },
        { status: 400 },
      );
    }

    if (
      provider === "SMTP" &&
      (!smtpHost ||
        !smtpPort ||
        (!smtpUsername && !existingCredentials?.smtpUsername) ||
        (!smtpPassword && !existingCredentials?.smtpPassword))
    ) {
      return NextResponse.json(
        { error: "SMTP credentials are required" },
        { status: 400 },
      );
    }

    // Prepare credentials for validation (decrypt existing if placeholders sent)
    const credentialsForValidation = {
      provider: provider as EmailProviderType,
      fromEmail,
      fromName,
      apiKey:
        apiKey && !isPlaceholder(apiKey)
          ? apiKey
          : existingCredentials?.apiKey
            ? decrypt(existingCredentials.apiKey)
            : undefined,
      awsAccessKeyId:
        awsAccessKeyId && !isPlaceholder(awsAccessKeyId)
          ? awsAccessKeyId
          : existingCredentials?.awsAccessKeyId
            ? decrypt(existingCredentials.awsAccessKeyId)
            : undefined,
      awsSecretKey:
        awsSecretKey && !isPlaceholder(awsSecretKey)
          ? awsSecretKey
          : existingCredentials?.awsSecretKey
            ? decrypt(existingCredentials.awsSecretKey)
            : undefined,
      awsRegion,
      smtpHost,
      smtpPort,
      smtpUsername:
        smtpUsername && !isPlaceholder(smtpUsername)
          ? smtpUsername
          : existingCredentials?.smtpUsername
            ? decrypt(existingCredentials.smtpUsername)
            : undefined,
      smtpPassword:
        smtpPassword && !isPlaceholder(smtpPassword)
          ? smtpPassword
          : existingCredentials?.smtpPassword
            ? decrypt(existingCredentials.smtpPassword)
            : undefined,
      smtpSecure,
    };

    // Test credentials before saving
    try {
      const emailProvider = createEmailProvider(
        provider as EmailProviderType,
        credentialsForValidation,
      );

      const isValid = await emailProvider.validateCredentials();
      if (!isValid) {
        return NextResponse.json(
          { error: "Email credentials validation failed" },
          { status: 400 },
        );
      }
    } catch (validationError) {
      dev.error("Email credentials validation error:", validationError, {tag: "email"});
      return NextResponse.json(
        {
          error:
            validationError instanceof Error
              ? validationError.message
              : "Invalid email credentials",
        },
        { status: 400 },
      );
    }

    // Prepare encrypted values (preserve existing if placeholder sent)
    const encryptedApiKey =
      apiKey && !isPlaceholder(apiKey)
        ? encrypt(apiKey)
        : existingCredentials?.apiKey || null;
    const encryptedAwsAccessKeyId =
      awsAccessKeyId && !isPlaceholder(awsAccessKeyId)
        ? encrypt(awsAccessKeyId)
        : existingCredentials?.awsAccessKeyId || null;
    const encryptedAwsSecretKey =
      awsSecretKey && !isPlaceholder(awsSecretKey)
        ? encrypt(awsSecretKey)
        : existingCredentials?.awsSecretKey || null;
    const encryptedSmtpUsername =
      smtpUsername && !isPlaceholder(smtpUsername)
        ? encrypt(smtpUsername)
        : existingCredentials?.smtpUsername || null;
    const encryptedSmtpPassword =
      smtpPassword && !isPlaceholder(smtpPassword)
        ? encrypt(smtpPassword)
        : existingCredentials?.smtpPassword || null;

    // Save to database with encryption
    await prisma.emailCredentials.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        provider,
        fromEmail,
        fromName: fromName || null,
        apiKey: encryptedApiKey,
        awsAccessKeyId: encryptedAwsAccessKeyId,
        awsSecretKey: encryptedAwsSecretKey,
        awsRegion: awsRegion || null,
        smtpHost: smtpHost || null,
        smtpPort: smtpPort || null,
        smtpUsername: encryptedSmtpUsername,
        smtpPassword: encryptedSmtpPassword,
        smtpSecure: smtpSecure || null,
        isValid: true,
        lastValidated: new Date(),
      },
      update: {
        provider,
        fromEmail,
        fromName: fromName || null,
        apiKey: encryptedApiKey,
        awsAccessKeyId: encryptedAwsAccessKeyId,
        awsSecretKey: encryptedAwsSecretKey,
        awsRegion: awsRegion || null,
        smtpHost: smtpHost || null,
        smtpPort: smtpPort || null,
        smtpUsername: encryptedSmtpUsername,
        smtpPassword: encryptedSmtpPassword,
        smtpSecure: smtpSecure || null,
        isValid: true,
        lastValidated: new Date(),
      },
    });

    return NextResponse.json({
      message: "Email credentials saved successfully",
    });
  } catch (error) {
    dev.error("Error saving email credentials:", error, {tag: "email"});
    return NextResponse.json(
      { error: "Failed to save email credentials" },
      { status: 500 },
    );
  }
}
