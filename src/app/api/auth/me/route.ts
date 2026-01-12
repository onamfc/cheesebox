import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dev from "@onamfc/developer-log";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return user info from session
    return NextResponse.json({
      id: session.user.id,
      email: session.user.email,
    });
  } catch (error) {
    dev.error("Error fetching current user:", error, {tag: "auth"});
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
