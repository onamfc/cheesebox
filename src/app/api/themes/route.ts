/**
 * Themes API - List all available themes
 * =======================================
 */

import { NextResponse } from 'next/server';
import { autoDiscoverThemes } from '@/lib/themes/theme-loader';

export async function GET() {
  try {
    const themes = await autoDiscoverThemes();
    console.log('API returning themes:', themes); // Debug log

    return NextResponse.json(themes);
  } catch (error) {
    console.error('Failed to get themes:', error);
    return NextResponse.json(
      { error: 'Failed to load themes' },
      { status: 500 }
    );
  }
}
