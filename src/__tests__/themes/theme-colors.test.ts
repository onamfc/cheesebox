/**
 * Theme Colors Test
 * ==================
 *
 * Critical test to ensure color swatches always display in theme switcher.
 * Color swatches are a key feature and must never be missing.
 */

import { describe, it, expect } from '@jest/globals';
import fs from 'fs/promises';
import path from 'path';

describe('Theme Color Swatches', () => {
  const themesDir = path.join(process.cwd(), 'themes');
  const registryPath = path.join(themesDir, 'registry.json');

  it('registry.json exists', async () => {
    const exists = await fs.access(registryPath).then(() => true).catch(() => false);
    expect(exists).toBe(true);
  });

  it('all themes in registry have color definitions', async () => {
    const registryData = await fs.readFile(registryPath, 'utf-8');
    const registry = JSON.parse(registryData);

    expect(registry.themes).toBeDefined();
    expect(Array.isArray(registry.themes)).toBe(true);
    expect(registry.themes.length).toBeGreaterThan(0);

    for (const theme of registry.themes) {
      expect(theme.colors).toBeDefined();
      expect(typeof theme.colors).toBe('object');

      // Verify all required color properties exist
      expect(theme.colors.primary).toBeDefined();
      expect(theme.colors.secondary).toBeDefined();
      expect(theme.colors.accent).toBeDefined();
      expect(theme.colors.success).toBeDefined();
      expect(theme.colors.warning).toBeDefined();
      expect(theme.colors.danger).toBeDefined();

      // Verify colors are valid hex codes
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      expect(theme.colors.primary).toMatch(hexColorRegex);
      expect(theme.colors.secondary).toMatch(hexColorRegex);
      expect(theme.colors.accent).toMatch(hexColorRegex);
      expect(theme.colors.success).toMatch(hexColorRegex);
      expect(theme.colors.warning).toMatch(hexColorRegex);
      expect(theme.colors.danger).toMatch(hexColorRegex);
    }
  });

  it('each theme package.json has color definitions', async () => {
    const themeNames = ['asiago', 'brie', 'cheddar', 'danablu'];

    for (const themeName of themeNames) {
      const packagePath = path.join(themesDir, themeName, 'package.json');
      const packageData = await fs.readFile(packagePath, 'utf-8');
      const packageJson = JSON.parse(packageData);

      expect(packageJson.colors).toBeDefined();
      expect(typeof packageJson.colors).toBe('object');

      // Verify all required color properties
      expect(packageJson.colors.primary).toBeDefined();
      expect(packageJson.colors.secondary).toBeDefined();
      expect(packageJson.colors.accent).toBeDefined();
      expect(packageJson.colors.success).toBeDefined();
      expect(packageJson.colors.warning).toBeDefined();
      expect(packageJson.colors.danger).toBeDefined();

      // Verify colors are valid hex codes
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      expect(packageJson.colors.primary).toMatch(hexColorRegex);
      expect(packageJson.colors.secondary).toMatch(hexColorRegex);
      expect(packageJson.colors.accent).toMatch(hexColorRegex);
      expect(packageJson.colors.success).toMatch(hexColorRegex);
      expect(packageJson.colors.warning).toMatch(hexColorRegex);
      expect(packageJson.colors.danger).toMatch(hexColorRegex);
    }
  });

  it('registry and package.json colors match', async () => {
    const registryData = await fs.readFile(registryPath, 'utf-8');
    const registry = JSON.parse(registryData);

    for (const theme of registry.themes) {
      const packagePath = path.join(themesDir, theme.id, 'package.json');
      const packageData = await fs.readFile(packagePath, 'utf-8');
      const packageJson = JSON.parse(packageData);

      // Verify colors match between registry and package.json
      expect(theme.colors.primary).toBe(packageJson.colors.primary);
      expect(theme.colors.secondary).toBe(packageJson.colors.secondary);
      expect(theme.colors.accent).toBe(packageJson.colors.accent);
      expect(theme.colors.success).toBe(packageJson.colors.success);
      expect(theme.colors.warning).toBe(packageJson.colors.warning);
      expect(theme.colors.danger).toBe(packageJson.colors.danger);
    }
  });
});
