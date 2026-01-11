/**
 * CHEDDAR THEME
 * =============
 *
 * A warm and energetic theme with orange and yellow tones.
 * Perfect for a vibrant, creative workspace.
 */

export const theme = {
  colors: {
    // Primary brand color (main buttons, links, accents)
    primary: {
      base: 'brand-primary',
      hover: 'brand-primary-hover',
    },

    // Secondary colors (used for secondary buttons, borders)
    secondary: {
      base: 'brand-secondary',
      border: 'brand-secondary',
    },

    // Accent and light colors
    accent: 'brand-accent',
    light: 'brand-light',

    // Status colors
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

    // Focus rings
    focus: 'brand-primary',

    // Body/page colors
    body: {
      background: 'bg-brand-light',
      text: 'text-brand-dark',
    },
  },

  // Button variants
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

  // Gradients
  gradients: {
    primary: `from-brand-primary to-brand-primary-dark hover:from-brand-primary hover:to-brand-secondary`,
    primaryText: `text-brand-secondary`,
  },

  // Layout configuration - Creative/Wide layout
  layout: {
    dashboard: {
      gridCols: { sm: 1, md: 1, lg: 2 },
      cardSpacing: 'spacious' as const,
      showAdvancedFeatures: true,
    },
    videoList: {
      gridCols: { sm: 1, md: 1, lg: 2 },
      variant: 'masonry' as const,
    },
    navigation: {
      variant: 'sidebar' as const,
      position: 'left' as const,
    },
  },

  // Typography configuration - Large, creative sizing
  typography: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    baseFontSize: '16px',
    headingSizes: {
      h1: 'text-3xl',
      h2: 'text-2xl',
      h3: 'text-xl',
    },
    bodySize: 'text-lg',
    lineHeight: 'relaxed' as const,
  },

  // Spacing configuration - Spacious
  spacing: {
    scale: 'spacious' as const,
    cardPadding: 'p-8',
    sectionGap: 'gap-8',
    containerMaxWidth: 'max-w-7xl' as const,
  },

  // Component configuration - All creative features
  components: {
    showFloatingActionMenu: true,
    showQuickActions: true,
    buttonSize: 'lg' as const,
    cardStyle: 'elevated' as const,
  },
} as const;

export type Theme = typeof theme;
