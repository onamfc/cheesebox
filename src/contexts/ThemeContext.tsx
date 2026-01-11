"use client";

/**
 * Theme Context
 * =============
 *
 * React Context for managing the current theme across the application.
 * Provides theme state, theme switching, and live preview functionality.
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Theme } from '@/lib/themes/theme-types';
import { theme as asiagoTheme } from '@/themes/asiago/theme';
import { fetchWithCsrf } from '@/lib/csrf-client';

interface ThemeContextValue {
  currentTheme: string;
  themeConfig: Theme;
  setTheme: (themeId: string) => Promise<void>;
  previewTheme: (themeId: string) => void;
  confirmTheme: () => Promise<void>;
  revertTheme: () => void;
  isPreviewMode: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: string;
}

export function ThemeProvider({ children, initialTheme = 'asiago' }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const [themeConfig, setThemeConfig] = useState<Theme>(asiagoTheme);
  const [previewThemeId, setPreviewThemeId] = useState<string | null>(null);
  const [previousTheme, setPreviousTheme] = useState<string | null>(null);

  const isPreviewMode = previewThemeId !== null;

  // Apply theme to document
  useEffect(() => {
    const activeTheme = previewThemeId || currentTheme;
    document.documentElement.setAttribute('data-theme', activeTheme);

    // Load theme CSS dynamically
    loadThemeStyles(activeTheme);
  }, [currentTheme, previewThemeId]);

  /**
   * Load theme styles dynamically
   */
  const loadThemeStyles = async (themeId: string) => {
    // Remove existing theme stylesheets
    const existingStyles = document.querySelectorAll('link[data-theme-styles]');
    existingStyles.forEach(style => style.remove());

    // Add new theme stylesheet
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/themes/${themeId}/styles.css`;
    link.setAttribute('data-theme-styles', 'true');
    document.head.appendChild(link);

    // Load theme config
    try {
      const response = await fetch(`/api/themes/${themeId}`);
      if (response.ok) {
        const config = await response.json();
        setThemeConfig(config);
      }
    } catch (error) {
      console.error(`Failed to load theme config for "${themeId}":`, error);
    }
  };

  /**
   * Set and persist a new theme
   */
  const setTheme = async (themeId: string) => {
    try {
      // Update in database
      const response = await fetchWithCsrf('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: themeId }),
      });

      if (!response.ok) {
        throw new Error('Failed to save theme preference');
      }

      setCurrentTheme(themeId);
      setPreviewThemeId(null);
      setPreviousTheme(null);
    } catch (error) {
      console.error('Failed to set theme:', error);
      throw error;
    }
  };

  /**
   * Preview a theme without saving
   */
  const previewTheme = (themeId: string) => {
    if (!isPreviewMode) {
      setPreviousTheme(currentTheme);
    }
    setPreviewThemeId(themeId);
  };

  /**
   * Confirm the previewed theme and save it
   */
  const confirmTheme = async () => {
    if (!previewThemeId) return;

    await setTheme(previewThemeId);
  };

  /**
   * Revert to the previous theme
   */
  const revertTheme = () => {
    setPreviewThemeId(null);
    setPreviousTheme(null);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme: previewThemeId || currentTheme,
        themeConfig,
        setTheme,
        previewTheme,
        confirmTheme,
        revertTheme,
        isPreviewMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to use the theme context
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
