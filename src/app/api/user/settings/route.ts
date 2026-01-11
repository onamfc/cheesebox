/**
 * User Settings API
 * =================
 *
 * Manage user settings including theme preferences
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isValidTheme } from '@/lib/themes/theme-loader';

/**
 * GET - Get user settings
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { settings: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create default settings if they don't exist
    if (!user.settings) {
      const settings = await prisma.userSettings.create({
        data: {
          userId: user.id,
          theme: 'asiago',
        },
      });

      return NextResponse.json(settings);
    }

    return NextResponse.json(user.settings);
  } catch (error) {
    console.error('Failed to get user settings:', error);
    return NextResponse.json(
      { error: 'Failed to get user settings' },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Update user settings
 */
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { theme } = body;

    if (theme && typeof theme !== 'string') {
      return NextResponse.json(
        { error: 'Invalid theme value' },
        { status: 400 }
      );
    }

    // Validate theme exists
    if (theme && !(await isValidTheme(theme))) {
      return NextResponse.json(
        { error: 'Invalid theme ID' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { settings: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update or create settings
    const settings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: { theme },
      create: {
        userId: user.id,
        theme: theme || 'asiago',
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to update user settings:', error);
    return NextResponse.json(
      { error: 'Failed to update user settings' },
      { status: 500 }
    );
  }
}
