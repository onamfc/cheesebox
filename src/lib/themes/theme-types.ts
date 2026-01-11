/**
 * Theme Type Definitions
 * ======================
 *
 * TypeScript type definitions for the theme system.
 */

import type { Theme } from '@/themes/asiago/theme';

export type { Theme };

export interface ThemeColors {
  primary: {
    base: string;
    hover: string;
  };
  secondary: {
    base: string;
    border: string;
  };
  accent: string;
  light: string;
  success: {
    base: string;
    hover: string;
    light: string;
  };
  warning: {
    base: string;
    hover: string;
    light: string;
  };
  danger: {
    base: string;
    hover: string;
    light: string;
  };
  info: {
    base: string;
    hover: string;
    light: string;
  };
  focus: string;
  body: {
    background: string;
    text: string;
  };
}

export interface ThemeButton {
  primary: string;
  secondary: string;
  ghost: string;
  danger: string;
  success: string;
  warning: string;
  info: string;
}

export interface ThemeInput {
  border: string;
  errorBorder: string;
}

export interface ThemeGradients {
  primary: string;
  primaryText: string;
}

export interface ThemeLayout {
  dashboard: {
    gridCols: { sm: number; md: number; lg: number };
    cardSpacing: 'compact' | 'normal' | 'spacious';
    showAdvancedFeatures: boolean;
  };
  videoList: {
    gridCols: { sm: number; md: number; lg: number };
    variant: 'grid' | 'list' | 'masonry';
  };
  navigation: {
    variant: 'sidebar' | 'top' | 'minimal';
    position: 'left' | 'right' | 'top';
  };
}

export interface ThemeTypography {
  fontFamily: string;
  baseFontSize: string; // e.g., '14px', '16px'
  headingSizes: {
    h1: string; // e.g., '2xl', '3xl', '4xl'
    h2: string;
    h3: string;
  };
  bodySize: string; // e.g., 'sm', 'base', 'lg'
  lineHeight: 'tight' | 'normal' | 'relaxed';
}

export interface ThemeSpacing {
  scale: 'compact' | 'normal' | 'spacious';
  cardPadding: string; // e.g., 'p-4', 'p-6', 'p-8'
  sectionGap: string; // e.g., 'gap-4', 'gap-6', 'gap-8'
  containerMaxWidth: 'max-w-4xl' | 'max-w-5xl' | 'max-w-6xl' | 'max-w-7xl';
}

export interface ThemeComponents {
  showFloatingActionMenu: boolean;
  showQuickActions: boolean;
  buttonSize: 'sm' | 'md' | 'lg';
  cardStyle: 'elevated' | 'flat' | 'outlined';
}

export interface ThemeConfig {
  colors: ThemeColors;
  button: ThemeButton;
  input: ThemeInput;
  gradients: ThemeGradients;
  layout: ThemeLayout;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  components: ThemeComponents;
}

export type ThemeCategory = 'light' | 'dark' | 'high-contrast' | 'custom';

export interface ThemePreview {
  id: string;
  name: string;
  description: string;
  category: ThemeCategory;
  previewUrl?: string;
}
