import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

/**
 * GET /api/auth/mobile/onboarding
 * Get user's onboarding status with teams and groups info (mobile JWT auth)
 */
export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    let payload;
    try {
      payload = verifyToken(token);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get user's onboarding status
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        onboardingCompleted: true,
        onboardingPath: true,
        onboardingCompletedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's teams
    const teams = await prisma.team.findMany({
      where: {
        members: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        _count: {
          select: {
            videos: true,
            groups: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Add user's role to each team
    const teamsWithRole = teams.map((team) => {
      const membership = team.members.find((m) => m.userId === user.id);
      return {
        ...team,
        userRole: membership?.role,
      };
    });

    // Get user's groups (both owned and member of)
    const groups = await prisma.shareGroup.findMany({
      where: {
        OR: [
          { userId: user.id }, // Groups owned by user
          {
            members: {
              some: {
                email: user.email, // Groups where user is a member
              },
            },
          },
        ],
      },
      include: {
        members: true,
        team: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            videoShares: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      onboardingCompleted: user.onboardingCompleted,
      onboardingPath: user.onboardingPath,
      onboardingCompletedAt: user.onboardingCompletedAt,
      teams: teamsWithRole,
      groups: groups,
    });
  } catch (error) {
    console.error('Get onboarding status error:', error);
    return NextResponse.json(
      { error: 'Failed to get onboarding status' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/auth/mobile/onboarding
 * Update user's onboarding status (mobile JWT auth)
 */
export async function PATCH(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    let payload;
    try {
      payload = verifyToken(token);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { completed, path } = body;

    // Validate inputs
    if (typeof completed !== 'boolean') {
      return NextResponse.json(
        { error: 'completed must be a boolean' },
        { status: 400 }
      );
    }

    if (path && !['uploader', 'recipient', 'skipped'].includes(path)) {
      return NextResponse.json(
        { error: 'path must be "uploader", "recipient", or "skipped"' },
        { status: 400 }
      );
    }

    // Update user's onboarding status
    const user = await prisma.user.update({
      where: { id: payload.userId },
      data: {
        onboardingCompleted: completed,
        onboardingPath: path || undefined,
        onboardingCompletedAt: completed ? new Date() : null,
      },
      select: {
        id: true,
        email: true,
        onboardingCompleted: true,
        onboardingPath: true,
        onboardingCompletedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Update onboarding status error:', error);
    return NextResponse.json(
      { error: 'Failed to update onboarding status' },
      { status: 500 }
    );
  }
}
