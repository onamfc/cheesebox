import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";
import { createEmailProvider } from "@/lib/email/factory";
import { EmailProviderType } from "@/lib/email/interface";

// POST - Send test email
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get email credentials
    const emailCredentials = await prisma.emailCredentials.findUnique({
      where: { userId: session.user.id },
    });

    if (!emailCredentials) {
      return NextResponse.json(
        { error: "No email credentials configured. Please save your email settings first." },
        { status: 400 },
      );
    }

    // Decrypt credentials
    const decryptedCredentials = {
      provider: emailCredentials.provider as EmailProviderType,
      fromEmail: emailCredentials.fromEmail,
      fromName: emailCredentials.fromName || undefined,
      apiKey: emailCredentials.apiKey
        ? decrypt(emailCredentials.apiKey)
        : undefined,
      awsAccessKeyId: emailCredentials.awsAccessKeyId
        ? decrypt(emailCredentials.awsAccessKeyId)
        : undefined,
      awsSecretKey: emailCredentials.awsSecretKey
        ? decrypt(emailCredentials.awsSecretKey)
        : undefined,
      awsRegion: emailCredentials.awsRegion || undefined,
      smtpHost: emailCredentials.smtpHost || undefined,
      smtpPort: emailCredentials.smtpPort || undefined,
      smtpUsername: emailCredentials.smtpUsername
        ? decrypt(emailCredentials.smtpUsername)
        : undefined,
      smtpPassword: emailCredentials.smtpPassword
        ? decrypt(emailCredentials.smtpPassword)
        : undefined,
      smtpSecure: emailCredentials.smtpSecure || undefined,
    };

    // Create email provider instance
    const emailProvider = createEmailProvider(
      emailCredentials.provider as EmailProviderType,
      decryptedCredentials,
    );

    // Send test email to the logged-in user
    await emailProvider.sendEmail({
      to: session.user.email,
      subject: "Test Email from Private Video",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Email Configuration Test Successful!</h2>

          <p>Congratulations! Your email provider is configured correctly.</p>

          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Configuration Details:</h3>
            <ul style="color: #6b7280;">
              <li><strong>Provider:</strong> ${emailCredentials.provider}</li>
              <li><strong>From Email:</strong> ${emailCredentials.fromEmail}</li>
              ${emailCredentials.fromName ? `<li><strong>From Name:</strong> ${emailCredentials.fromName}</li>` : ""}
              <li><strong>Test sent to:</strong> ${session.user.email}</li>
            </ul>
          </div>

          <p>You're all set! Video sharing notifications will now be sent using this email provider.</p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

          <p style="color: #6b7280; font-size: 14px;">
            This is a test email from <strong>Private Video</strong>.<br>
            If you didn't request this test, you can safely ignore it.
          </p>
        </div>
      `,
      text: `
Email Configuration Test Successful!

Congratulations! Your email provider is configured correctly.

Configuration Details:
- Provider: ${emailCredentials.provider}
- From Email: ${emailCredentials.fromEmail}
${emailCredentials.fromName ? `- From Name: ${emailCredentials.fromName}\n` : ""}
- Test sent to: ${session.user.email}

You're all set! Video sharing notifications will now be sent using this email provider.

---
This is a test email from Private Video.
If you didn't request this test, you can safely ignore it.
      `,
    });

    return NextResponse.json({
      message: `Test email sent successfully to ${session.user.email}`,
      provider: emailCredentials.provider,
    });
  } catch (error) {
    console.error("Test email error:", error);

    // Provide helpful error messages
    let errorMessage = "Failed to send test email";

    if (error instanceof Error) {
      // Check for common error patterns
      if (error.message.includes("authentication") || error.message.includes("credentials")) {
        errorMessage = "Authentication failed. Please check your credentials.";
      } else if (error.message.includes("not verified") || error.message.includes("verification")) {
        errorMessage = "Email address or domain not verified with your provider.";
      } else if (error.message.includes("timeout") || error.message.includes("connection")) {
        errorMessage = "Connection failed. Please check your SMTP host and port.";
      } else if (error.message.includes("TLS") || error.message.includes("SSL")) {
        errorMessage = "TLS/SSL error. Try toggling the 'Use TLS/SSL' setting.";
      } else {
        errorMessage = `Error: ${error.message}`;
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 },
    );
  }
}
