/**
 * Theme Loader Utilities
 * ======================
 *
 * Utilities for loading and managing themes in the Cheesebox application.
 * Supports both production (registry-based) and development (auto-scan) modes.
 */

import { promises as fs } from 'fs';
import path from 'path';
import type { Theme } from '@/themes/asiago/theme';

export interface ThemeMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: 'light' | 'dark' | 'high-contrast' | 'custom';
  tags: string[];
  path: string;
  preview?: string;
  main: string;
  styles: string;
  default?: boolean;
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    danger: string;
  };
}

export interface ThemeRegistry {
  version: string;
  themes: ThemeMetadata[];
}

/**
 * Get the themes directory path
 */
function getThemesDir(): string {
  return path.join(process.cwd(), 'themes');
}

/**
 * Load the theme registry
 */
export async function loadThemeRegistry(): Promise<ThemeRegistry> {
  const registryPath = path.join(getThemesDir(), 'registry.json');

  try {
    const data = await fs.readFile(registryPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load theme registry:', error);

    // Return default registry if file doesn't exist
    return {
      version: '1.0.0',
      themes: [{
        id: 'asiago',
        name: 'Asiago Dark',
        description: 'A sophisticated dark theme with cream and gold accents',
        version: '1.0.1',
        author: 'Cheesebox Team',
        category: 'dark',
        tags: ['professional', 'elegant', 'dark', 'original'],
        path: './asiago',
        preview: './asiago/preview.png',
        main: './asiago/theme.ts',
        styles: './asiago/styles.css',
        default: true,
      }],
    };
  }
}

/**
 * Get all available themes
 */
export async function getAvailableThemes(): Promise<ThemeMetadata[]> {
  const registry = await loadThemeRegistry();
  return registry.themes;
}

/**
 * Get a specific theme by ID
 */
export async function getThemeById(themeId: string): Promise<ThemeMetadata | null> {
  const themes = await getAvailableThemes();
  return themes.find(theme => theme.id === themeId) || null;
}

/**
 * Get the default theme
 */
export async function getDefaultTheme(): Promise<ThemeMetadata> {
  const themes = await getAvailableThemes();
  const defaultTheme = themes.find(theme => theme.default);

  if (!defaultTheme) {
    // Fall back to first theme if no default is set
    return themes[0];
  }

  return defaultTheme;
}

/**
 * Load a theme's configuration
 * Uses static imports for Next.js compatibility
 */
export async function loadThemeConfig(themeId: string): Promise<Theme | null> {
  const themeMetadata = await getThemeById(themeId);

  if (!themeMetadata) {
    console.error(`Theme "${themeId}" not found`);
    return null;
  }

  try {
    // Static imports for Next.js compatibility
    let themeModule;
    switch (themeId) {
      case 'asiago':
        themeModule = await import('@/themes/asiago/theme');
        break;
      case 'brie':
        themeModule = await import('@/themes/brie/theme');
        break;
      case 'cheddar':
        themeModule = await import('@/themes/cheddar/theme');
        break;
      case 'danablu':
        themeModule = await import('@/themes/danablu/theme');
        break;
      default:
        console.error(`Unknown theme: ${themeId}`);
        return null;
    }
    return themeModule.theme as Theme;
  } catch (error) {
    console.error(`Failed to load theme config for "${themeId}":`, error);
    return null;
  }
}

/**
 * Get the CSS file path for a theme
 */
export function getThemeStylesPath(themeMetadata: ThemeMetadata): string {
  return path.join(getThemesDir(), themeMetadata.styles);
}

/**
 * Read theme CSS content
 */
export async function getThemeStyles(themeId: string): Promise<string | null> {
  const themeMetadata = await getThemeById(themeId);

  if (!themeMetadata) {
    console.error(`Theme "${themeId}" not found`);
    return null;
  }

  try {
    const stylesPath = getThemeStylesPath(themeMetadata);
    return await fs.readFile(stylesPath, 'utf-8');
  } catch (error) {
    console.error(`Failed to load theme styles for "${themeId}":`, error);
    return null;
  }
}

/**
 * Validate a theme ID
 */
export async function isValidTheme(themeId: string): Promise<boolean> {
  const theme = await getThemeById(themeId);
  return theme !== null;
}

/**
 * Auto-discover themes in development mode
 * (For future enhancement - scans themes directory for new themes not in registry)
 */
export async function autoDiscoverThemes(): Promise<ThemeMetadata[]> {
  if (process.env.NODE_ENV === 'production') {
    // Only use registry in production
    return getAvailableThemes();
  }

  // In development, scan the themes directory
  const themesDir = getThemesDir();
  const discovered: ThemeMetadata[] = [];

  try {
    const entries = await fs.readdir(themesDir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const packageJsonPath = path.join(themesDir, entry.name, 'package.json');

      try {
        const packageData = await fs.readFile(packageJsonPath, 'utf-8');
        const packageJson = JSON.parse(packageData);

        discovered.push({
          id: packageJson.name,
          name: packageJson.displayName || packageJson.name,
          description: packageJson.description || '',
          version: packageJson.version,
          author: packageJson.author || 'Unknown',
          category: packageJson.category || 'custom',
          tags: packageJson.tags || [],
          path: `./${entry.name}`,
          preview: packageJson.preview,
          main: packageJson.main || './theme.ts',
          styles: packageJson.styles || './styles.css',
          default: packageJson.default || false,
          colors: packageJson.colors,
        });
      } catch (error) {
        // Skip themes without valid package.json
        continue;
      }
    }
  } catch (error) {
    console.error('Failed to auto-discover themes:', error);
  }

  return discovered;
}
