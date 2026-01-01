import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const pushTokenSchema = z.object({
  pushToken: z.string().min(1, "Push token is required"),
});

/**
 * POST /api/auth/mobile/push-token
 *
 * Register or update user's push notification token
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = pushTokenSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { pushToken } = validationResult.data;

    // Update user's push token
    await prisma.user.update({
      where: { id: user.id },
      data: { pushToken },
    });

    return NextResponse.json({ message: "Push token registered successfully" });
  } catch (error) {
    console.error("Error registering push token:", error);
    return NextResponse.json(
      { error: "Failed to register push token" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/auth/mobile/push-token
 *
 * Remove user's push notification token (when user logs out)
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Remove user's push token
    await prisma.user.update({
      where: { id: user.id },
      data: { pushToken: null },
    });

    return NextResponse.json({ message: "Push token removed successfully" });
  } catch (error) {
    console.error("Error removing push token:", error);
    return NextResponse.json(
      { error: "Failed to remove push token" },
      { status: 500 }
    );
  }
}
