# Cheesebox Theme System

Cheesebox uses a WordPress-style pluggable theme system that allows users to customize the appearance of their workspace. This document explains the theme architecture and how to create new themes.

## Overview

The theme system provides:
- **Hot-swappable themes** - Switch themes instantly without page reload
- **Live preview** - Preview themes with confirm/revert options
- **Database persistence** - Theme preferences synced across devices
- **Type-safe** - Full TypeScript support for theme configurations
- **Scoped CSS** - Each theme's styles are scoped to prevent conflicts

## Architecture

### Directory Structure

```
/themes
├── registry.json              # Theme registry (metadata for all themes)
├── registry-schema.json       # JSON schema for registry validation
├── asiago/                    # Theme directory (example)
│   ├── package.json          # Theme metadata
│   ├── theme.ts              # Theme configuration object
│   ├── styles.css            # Theme-specific CSS variables
│   ├── preview.png           # Theme preview image (optional)
│   └── README.md             # Theme documentation
└── [theme-name]/             # Additional themes...
```

### Theme Files

Each theme consists of 4 required files:

#### 1. `package.json` - Theme Metadata
```json
{
  "name": "asiago",
  "version": "1.0.1",
  "displayName": "Asiago Dark",
  "description": "A sophisticated dark theme with cream and gold accents",
  "author": "Cheesebox Team",
  "category": "dark",
  "tags": ["professional", "elegant", "dark"],
  "preview": "./preview.png",
  "main": "./theme.ts",
  "styles": "./styles.css"
}
```

**Fields:**
- `name` (required): Unique theme identifier (lowercase, no spaces)
- `version` (required): Semantic version (e.g., "1.0.0")
- `displayName` (required): Human-readable theme name
- `description` (required): Brief description of the theme
- `author` (required): Theme author or team name
- `category` (required): Theme category (`light`, `dark`, `high-contrast`, `custom`)
- `tags` (optional): Searchable tags (array of strings)
- `preview` (optional): Path to preview image
- `main` (required): Path to theme.ts file
- `styles` (required): Path to styles.css file

#### 2. `theme.ts` - Theme Configuration

Defines button variants, input styles, colors, and gradients:

```typescript
export const theme = {
  colors: {
    primary: { base: 'brand-primary', hover: 'brand-primary-hover' },
    secondary: { base: 'brand-secondary', border: 'brand-secondary' },
    accent: 'brand-accent',
    light: 'brand-light',
    success: { base: 'success', hover: 'success-hover', light: 'success-light' },
    warning: { base: 'warning', hover: 'warning-hover', light: 'warning-light' },
    danger: { base: 'danger', hover: 'danger-hover', light: 'danger-light' },
    info: { base: 'info', hover: 'info-hover', light: 'info-light' },
    focus: 'brand-primary',
    body: { background: 'bg-brand-light', text: 'text-brand-dark' },
  },
  button: {
    primary: `bg-brand-primary border-2 border-brand-primary hover:bg-brand-primary-hover text-white`,
    secondary: `bg-white border-2 border-brand-secondary text-brand-dark hover:bg-gray-50`,
    ghost: `bg-transparent border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white`,
    danger: `bg-danger border-2 border-danger hover:bg-danger-hover text-white`,
    success: `bg-success border-2 border-success hover:bg-success-hover text-white`,
    warning: `bg-warning border-2 border-warning hover:bg-warning-hover text-white`,
    info: `bg-info border-2 border-info hover:bg-info-hover text-white`,
  },
  input: {
    border: `border-gray-300 focus:border-brand-primary focus:ring-brand-primary`,
    errorBorder: `border-danger focus:border-danger focus:ring-danger`,
  },
  gradients: {
    primary: `from-brand-primary to-brand-primary-dark hover:from-brand-primary hover:to-brand-secondary`,
    primaryText: `text-brand-secondary`,
  },
} as const;

export type Theme = typeof theme;
```

#### 3. `styles.css` - Theme-Specific CSS

Defines CSS variables scoped to the theme:

```css
[data-theme="asiago"] {
  /* Brand colors */
  --brand-primary: #181717;
  --brand-primary-hover: rgba(24,23,23, 1);
  --brand-secondary: #FAEACB;
  --brand-accent: #F5BE4B;
  --brand-light: #FAEACB;
  --brand-dark: #181717;

  /* Status colors */
  --success: #10B981;
  --success-hover: #059669;
  --success-light: #D1FAE5;
  /* ... additional colors ... */
}

@layer utilities {
  [data-theme="asiago"] .bg-brand-primary { background-color: var(--brand-primary); }
  [data-theme="asiago"] .text-brand-primary { color: var(--brand-primary); }
  /* ... additional utilities ... */
}
```

**Important:** All CSS selectors must be scoped with `[data-theme="theme-name"]` to prevent conflicts.

#### 4. `README.md` - Theme Documentation

Provides information about the theme, color palette, features, and usage instructions.

## Creating a New Theme

### Step 1: Create Theme Directory

```bash
mkdir -p themes/my-theme
```

### Step 2: Create Required Files

Copy an existing theme as a starting point:

```bash
cp -r themes/asiago themes/my-theme
```

### Step 3: Customize Theme

1. **Update `package.json`**:
   - Change `name` to your theme ID (lowercase, no spaces)
   - Update `displayName`, `description`, `author`
   - Set appropriate `category` and `tags`

2. **Customize `theme.ts`**:
   - Keep the structure the same
   - Only change Tailwind class names if needed
   - The color values come from CSS variables

3. **Customize `styles.css`**:
   - Update the `[data-theme="my-theme"]` selector
   - Change CSS variable values to your color palette
   - Keep all variable names the same
   - Update all utility selectors to use your theme name

4. **Update `README.md`**:
   - Document your color palette
   - Describe theme features
   - Add usage instructions

### Step 4: Register Theme

Add your theme to `/themes/registry.json`:

```json
{
  "id": "my-theme",
  "name": "My Theme",
  "description": "A beautiful theme for Cheesebox",
  "version": "1.0.0",
  "author": "Your Name",
  "category": "light",
  "tags": ["custom", "beautiful"],
  "path": "./my-theme",
  "preview": "./my-theme/preview.png",
  "main": "./my-theme/theme.ts",
  "styles": "./my-theme/styles.css"
}
```

### Step 5: Test Your Theme

1. Restart the development server
2. Navigate to Settings > Theme Settings
3. Your theme should appear in the theme selector
4. Click to preview and confirm to apply

## Theme Development Best Practices

### Color Palette

- **Primary**: Main brand color (buttons, links, accents)
- **Secondary**: Supporting color (borders, secondary buttons)
- **Accent**: Highlight color (special elements)
- **Light**: Background color
- **Dark**: Text color

### Status Colors

Keep status colors consistent for accessibility:
- **Success**: Green tones (#10B981)
- **Warning**: Amber tones (#F59E0B)
- **Danger**: Red tones (#EF4444)
- **Info**: Blue tones (#3B82F6)

### Accessibility

- Maintain sufficient contrast ratios (WCAG AA: 4.5:1 for text)
- Test with screen readers
- Ensure focus states are clearly visible

### Performance

- Keep CSS minimal and scoped
- Avoid complex selectors
- Use CSS variables for easy customization

## API Reference

### Theme Context

Components can access the current theme using the `useTheme` hook:

```typescript
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { currentTheme, themeConfig, setTheme, previewTheme, confirmTheme, revertTheme, isPreviewMode } = useTheme();

  // Access theme configuration
  const primaryColor = themeConfig.colors.primary.base;

  // Preview a theme
  const handlePreview = () => previewTheme('cheddar');

  // Confirm previewed theme
  const handleConfirm = async () => await confirmTheme();

  // Revert to previous theme
  const handleRevert = () => revertTheme();
}
```

### Theme Loader Utilities

```typescript
import { getAvailableThemes, getThemeById, loadThemeConfig } from '@/lib/themes/theme-loader';

// Get all available themes
const themes = await getAvailableThemes();

// Get specific theme metadata
const theme = await getThemeById('asiago');

// Load theme configuration
const config = await loadThemeConfig('asiago');
```

## Available Themes

### Asiago Dark (Default)
- **Category**: Dark
- **Colors**: Deep blacks with cream and gold accents
- **Use Case**: Professional, elegant, original Cheesebox theme

### Cheddar Bright
- **Category**: Light
- **Colors**: Warm orange and yellow tones
- **Use Case**: Vibrant, energetic, creative workspaces

### Mozzarella Light
- **Category**: Light
- **Colors**: Soft blues and whites
- **Use Case**: Clean, minimal, focused work

### Swiss Neutral
- **Category**: Light
- **Colors**: Balanced grays
- **Use Case**: Professional, business, corporate environments

## Troubleshooting

### Theme Not Appearing

1. Check `registry.json` - ensure theme is registered
2. Verify file paths in `package.json`
3. Restart development server
4. Check browser console for errors

### Styles Not Applying

1. Verify CSS selectors use `[data-theme="your-theme"]`
2. Check that CSS variable names match `theme.ts`
3. Ensure styles are in `@layer utilities`
4. Clear browser cache

### Theme Not Persisting

1. Check database connection
2. Verify user is authenticated
3. Check `/api/user/settings` endpoint
4. Inspect browser network tab for errors

## Contributing

To contribute a new theme to Cheesebox:

1. Create your theme following this guide
2. Test thoroughly across all pages
3. Create a preview image (1200x630px recommended)
4. Submit a pull request with your theme

## License

Themes are part of the Cheesebox project and follow the same license as the main application.
