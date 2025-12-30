import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/encryption";
import { createEmailProvider } from "@/lib/email/factory";
import { EmailProviderType } from "@/lib/email/interface";

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
      // Don't send encrypted values back
      hasApiKey: !!credentials.apiKey,
      hasAwsCredentials: !!(
        credentials.awsAccessKeyId && credentials.awsSecretKey
      ),
      hasSmtpCredentials: !!(
        credentials.smtpUsername && credentials.smtpPassword
      ),
      awsRegion: credentials.awsRegion,
      smtpHost: credentials.smtpHost,
      smtpPort: credentials.smtpPort,
      smtpSecure: credentials.smtpSecure,
      isValid: credentials.isValid,
      lastValidated: credentials.lastValidated,
    });
  } catch (error) {
    console.error("Error fetching email credentials:", error);
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

    // Validate based on provider
    if (!provider || !fromEmail) {
      return NextResponse.json(
        { error: "Provider and from email are required" },
        { status: 400 },
      );
    }

    // Validate provider-specific required fields
    if (provider === "RESEND" && !apiKey) {
      return NextResponse.json(
        { error: "API key is required for Resend" },
        { status: 400 },
      );
    }

    if (
      provider === "AWS_SES" &&
      (!awsAccessKeyId || !awsSecretKey || !awsRegion)
    ) {
      return NextResponse.json(
        { error: "AWS credentials are required for AWS SES" },
        { status: 400 },
      );
    }

    if (
      provider === "SMTP" &&
      (!smtpHost || !smtpPort || !smtpUsername || !smtpPassword)
    ) {
      return NextResponse.json(
        { error: "SMTP credentials are required" },
        { status: 400 },
      );
    }

    // Test credentials before saving
    try {
      const emailProvider = createEmailProvider(
        provider as EmailProviderType,
        {
          provider: provider as EmailProviderType,
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
        },
      );

      const isValid = await emailProvider.validateCredentials();
      if (!isValid) {
        return NextResponse.json(
          { error: "Email credentials validation failed" },
          { status: 400 },
        );
      }
    } catch (validationError) {
      console.error("Email credentials validation error:", validationError);
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

    // Save to database with encryption
    await prisma.emailCredentials.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        provider,
        fromEmail,
        fromName: fromName || null,
        apiKey: apiKey ? encrypt(apiKey) : null,
        awsAccessKeyId: awsAccessKeyId ? encrypt(awsAccessKeyId) : null,
        awsSecretKey: awsSecretKey ? encrypt(awsSecretKey) : null,
        awsRegion: awsRegion || null,
        smtpHost: smtpHost || null,
        smtpPort: smtpPort || null,
        smtpUsername: smtpUsername ? encrypt(smtpUsername) : null,
        smtpPassword: smtpPassword ? encrypt(smtpPassword) : null,
        smtpSecure: smtpSecure || null,
        isValid: true,
        lastValidated: new Date(),
      },
      update: {
        provider,
        fromEmail,
        fromName: fromName || null,
        apiKey: apiKey ? encrypt(apiKey) : null,
        awsAccessKeyId: awsAccessKeyId ? encrypt(awsAccessKeyId) : null,
        awsSecretKey: awsSecretKey ? encrypt(awsSecretKey) : null,
        awsRegion: awsRegion || null,
        smtpHost: smtpHost || null,
        smtpPort: smtpPort || null,
        smtpUsername: smtpUsername ? encrypt(smtpUsername) : null,
        smtpPassword: smtpPassword ? encrypt(smtpPassword) : null,
        smtpSecure: smtpSecure || null,
        isValid: true,
        lastValidated: new Date(),
      },
    });

    return NextResponse.json({
      message: "Email credentials saved successfully",
    });
  } catch (error) {
    console.error("Error saving email credentials:", error);
    return NextResponse.json(
      { error: "Failed to save email credentials" },
      { status: 500 },
    );
  }
}
