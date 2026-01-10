/**
 * BRIE THEME
 * ==========
 *
 * A clean, minimal light theme with soft blues and whites.
 * Perfect for focused, distraction-free work.
 */

export const theme = {
  colors: {
    primary: {
      base: 'brand-primary',
      hover: 'brand-primary-hover',
    },
    secondary: {
      base: 'brand-secondary',
      border: 'brand-secondary',
    },
    accent: 'brand-accent',
    light: 'brand-light',
    success: {
      base: 'success',
      hover: 'success-hover',
      light: 'success-light',
    },
    warning: {
      base: 'warning',
      hover: 'warning-hover',
      light: 'warning-light',
    },
    danger: {
      base: 'danger',
      hover: 'danger-hover',
      light: 'danger-light',
    },
    info: {
      base: 'info',
      hover: 'info-hover',
      light: 'info-light',
    },
    focus: 'brand-primary',
    body: {
      background: 'bg-brand-light',
      text: 'text-brand-dark',
    },
  },
  button: {
    primary: `bg-brand-primary border-2 border-brand-primary hover:bg-brand-primary-hover hover:border-brand-primary-hover text-white`,
    secondary: `bg-white border-2 border-brand-secondary text-brand-dark hover:bg-gray-50`,
    ghost: `bg-transparent border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white`,
    danger: `bg-danger border-2 border-danger hover:bg-danger-hover hover:border-danger-hover text-white`,
    success: `bg-success border-2 border-success hover:bg-success-hover hover:border-success-hover text-white`,
    warning: `bg-warning border-2 border-warning hover:bg-warning-hover hover:border-warning-hover text-white`,
    info: `bg-info border-2 border-info hover:bg-info-hover hover:border-info-hover text-white`,
  },
  input: {
    border: `border-gray-300 focus:border-brand-primary focus:ring-brand-primary`,
    errorBorder: `border-danger focus:border-danger focus:ring-danger`,
  },
  gradients: {
    primary: `from-brand-primary to-brand-primary-dark hover:from-brand-primary hover:to-brand-secondary`,
    primaryText: `text-brand-secondary`,
  },

  // Layout configuration - Minimal/Compact layout
  layout: {
    dashboard: {
      gridCols: { sm: 1, md: 2, lg: 4 },
      cardSpacing: 'compact' as const,
      showAdvancedFeatures: false,
    },
    videoList: {
      gridCols: { sm: 1, md: 2, lg: 4 },
      variant: 'grid' as const,
    },
    navigation: {
      variant: 'minimal' as const,
      position: 'top' as const,
    },
  },

  // Typography configuration - Compact sizing
  typography: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    baseFontSize: '14px',
    headingSizes: {
      h1: 'text-xl',
      h2: 'text-lg',
      h3: 'text-base',
    },
    bodySize: 'text-sm',
    lineHeight: 'tight' as const,
  },

  // Spacing configuration - Compact spacing
  spacing: {
    scale: 'compact' as const,
    cardPadding: 'p-4',
    sectionGap: 'gap-4',
    containerMaxWidth: 'max-w-6xl' as const,
  },

  // Component configuration - Minimal features
  components: {
    showFloatingActionMenu: false,
    showQuickActions: false,
    buttonSize: 'sm' as const,
    cardStyle: 'flat' as const,
  },
} as const;

export type Theme = typeof theme;
