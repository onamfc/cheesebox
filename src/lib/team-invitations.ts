import { prisma } from "@/lib/prisma";
import dev from "@onamfc/developer-log";

/**
 * Accept all pending team invitations for a newly registered user
 * This function is called after user signup to automatically add them to teams they were invited to
 */
export async function acceptPendingInvitations(userId: string, email: string) {
  try {
    const normalizedEmail = email.toLowerCase();

    // Find all pending invitations for this email
    const pendingInvitations = await prisma.teamMember.findMany({
      where: {
        email: normalizedEmail,
        status: "PENDING",
        userId: null,
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (pendingInvitations.length === 0) {
      return { accepted: 0, teams: [] };
    }

    // Update all pending invitations to accepted status with the user's ID
    const updatePromises = pendingInvitations.map((invitation) =>
      prisma.teamMember.update({
        where: { id: invitation.id },
        data: {
          userId,
          status: "ACCEPTED",
        },
      })
    );

    await Promise.all(updatePromises);

    dev.log(
      `Accepted ${pendingInvitations.length} pending team invitation(s) for user ${email}`,
      { tag: "team-invitations" }
    );

    return {
      accepted: pendingInvitations.length,
      teams: pendingInvitations.map((inv) => ({
        id: inv.team.id,
        name: inv.team.name,
        role: inv.role,
      })),
    };
  } catch (error) {
    dev.error("Error accepting pending invitations:", error, {
      tag: "team-invitations",
    });
    // Don't throw - we don't want to fail user registration if this fails
    return { accepted: 0, teams: [] };
  }
}
