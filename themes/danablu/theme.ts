/**
 * DANABLU THEME
 * =============
 *
 * A professional neutral theme with balanced grays.
 * Perfect for business and corporate environments.
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

  // Layout configuration - Corporate/Organized layout
  layout: {
    dashboard: {
      gridCols: { sm: 1, md: 2, lg: 3 },
      cardSpacing: 'normal' as const,
      showAdvancedFeatures: true,
    },
    videoList: {
      gridCols: { sm: 1, md: 1, lg: 1 },
      variant: 'list' as const,
    },
    navigation: {
      variant: 'sidebar' as const,
      position: 'left' as const,
    },
  },

  // Typography configuration - Professional sizing
  typography: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    baseFontSize: '15px',
    headingSizes: {
      h1: 'text-2xl',
      h2: 'text-xl',
      h3: 'text-lg',
    },
    bodySize: 'text-base',
    lineHeight: 'normal' as const,
  },

  // Spacing configuration - Standard spacing
  spacing: {
    scale: 'normal' as const,
    cardPadding: 'p-6',
    sectionGap: 'gap-6',
    containerMaxWidth: 'max-w-6xl' as const,
  },

  // Component configuration - All features enabled
  components: {
    showFloatingActionMenu: true,
    showQuickActions: true,
    buttonSize: 'md' as const,
    cardStyle: 'outlined' as const,
  },
} as const;

export type Theme = typeof theme;
