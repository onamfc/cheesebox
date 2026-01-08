/**
 * THEME CONFIGURATION
 * ===================
 *
 * Centralized theme colors for the entire application.
 * All colors are defined as CSS variables in src/app/globals.css
 *
 * To change colors:
 * 1. Edit the :root variables in src/app/globals.css
 * 2. All components automatically update!
 */

export const theme = {
  colors: {
    // Primary brand color (main buttons, links, accents)
    primary: {
      base: 'brand-primary',           // Main brand color
      hover: 'brand-primary-hover',    // Hover state
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

    // Body/page colors (defined in globals.css :root)
    body: {
      background: 'bg-brand-light',  // Light background
      text: 'text-brand-dark',       // Dark text color
    },
  },

  // Button variants - these use the custom brand classes from globals.css
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

  // Gradients and special components (like VideoRecorder mode buttons)
  gradients: {
    primary: `from-brand-primary to-brand-primary-dark hover:from-brand-primary hover:to-brand-secondary`,
    primaryText: `text-brand-secondary`,
  },
} as const;

/**
 * QUICK THEME CHANGE GUIDE
 * =========================
 *
 * To change your brand colors:
 * 1. Open src/app/globals.css
 * 2. Edit the :root CSS variables
 * 3. Save - the entire app updates automatically!
 *
 * Available color groups:
 * - Brand colors: --brand-primary, --brand-secondary, --brand-accent, etc.
 * - Status colors: --success, --warning, --danger, --info (+ hover and light variants)
 *
 * Example - changing to a blue theme:
 * :root {
 *   --brand-primary: #2563EB;        // Blue-600
 *   --brand-primary-hover: #3B82F6;  // Blue-500
 *   --brand-secondary: #60A5FA;      // Blue-400
 *   --brand-accent: #93C5FD;         // Blue-300
 *   --brand-light: #DBEAFE;          // Blue-100
 *
 *   // Status colors remain consistent or customize them too
 *   --success: #10B981;              // Green
 *   --warning: #F59E0B;              // Amber
 *   --danger: #EF4444;               // Red
 *   --info: #3B82F6;                 // Blue
 * }
 *
 * Button variants available:
 * - primary, secondary, ghost, danger, success, warning, info
 *
 * Usage example:
 * <Button variant="success">Save</Button>
 * <Button variant="danger">Delete</Button>
 * <Button variant="warning">Caution</Button>
 */
