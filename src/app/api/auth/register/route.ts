import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, registerRateLimit, getClientIp } from "@/lib/rate-limit";
import { acceptPendingInvitations } from "@/lib/team-invitations";
import dev from "@onamfc/developer-log";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting by IP address
    const clientIp = getClientIp(request.headers);
    const rateLimitResult = await checkRateLimit(registerRateLimit, clientIp);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Registration limit exceeded. Please try again later.",
          retryAfter: rateLimitResult.reset ? Math.ceil((rateLimitResult.reset - Date.now()) / 1000) : 3600,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitResult.reset ? Math.ceil((rateLimitResult.reset - Date.now()) / 1000) : 3600),
          },
        }
      );
    }

    const body = await request.json();

    // Validate input
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 },
      );
    }

    const { email, password } = validationResult.data;

    // Check if user already exists
    // SECURITY: Use constant-time-like response to prevent user enumeration
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Use generic message that doesn't confirm email exists
      return NextResponse.json(
        { error: "Unable to complete registration" },
        { status: 400 },
      );
    }

    // Hash password
    const passwordHash = await hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    // Accept any pending team invitations
    const invitationResult = await acceptPendingInvitations(user.id, user.email);

    return NextResponse.json(
      {
        message: "User created successfully",
        user,
        teamInvitations: invitationResult,
      },
      { status: 201 },
    );
  } catch (error) {
    dev.error("Registration error:", error, {tag: "auth"});
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 },
    );
  }
}
