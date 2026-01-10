/**
 * Theme API - Get specific theme
 * ===============================
 */

import { NextResponse } from 'next/server';
import { getThemeById, loadThemeConfig } from '@/lib/themes/theme-loader';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const themeMetadata = await getThemeById(id);

    if (!themeMetadata) {
      return NextResponse.json(
        { error: 'Theme not found' },
        { status: 404 }
      );
    }

    const themeConfig = await loadThemeConfig(id);

    return NextResponse.json({
      metadata: themeMetadata,
      config: themeConfig,
    });
  } catch (error) {
    console.error('Failed to get theme:', error);
    return NextResponse.json(
      { error: 'Failed to load theme' },
      { status: 500 }
    );
  }
}
