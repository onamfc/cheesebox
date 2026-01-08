# Theming Guide for Cheesebox

This guide explains how to customize the look and feel of your Cheesebox installation.

## Quick Start

**All theme colors are centralized in one file**: `src/config/theme.ts`

To change colors throughout the entire app, just edit this one file!

## How to Change Colors

### Option 1: Simple Find-Replace in theme.ts (Recommended)

1. Open `src/config/theme.ts`
2. Use find-and-replace (Cmd+F or Ctrl+F) within that file only
3. Replace color names throughout the file

**Example: Purple → Yellow**
- Find: `purple` → Replace with: `yellow`
- Adjust shade numbers if needed (e.g., change `yellow-600` to `yellow-500` for a lighter look)

**Example: Purple → Blue**
- Find: `purple` → Replace with: `blue`
- Done!

The entire app updates automatically since all components import from this theme file.

### Option 2: Manual Color Adjustment

Edit specific colors in `src/config/theme.ts`:

```ts
export const theme = {
  // Change these to update your brand colors
  button: {
    primary: `bg-yellow-500 hover:bg-yellow-600 text-white`,
    secondary: `bg-white border-2 border-yellow-300 text-yellow-900 hover:bg-yellow-50`,
    ghost: `bg-transparent border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white`,
    danger: `bg-red-600 hover:bg-red-700 text-white`,
  },

  input: {
    border: `border-gray-300 focus:border-yellow-500 focus:ring-yellow-500`,
    errorBorder: `border-red-300 focus:border-red-500 focus:ring-red-500`,
  },

  gradients: {
    primary: `from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500`,
    primaryText: `text-yellow-100`,
  },
}
```

## Current Color Scheme

The app currently uses **purple** as the primary color:

- **Primary buttons**: `purple-600` (hover: `purple-700`)
- **Secondary buttons**: `white` with `purple-300` border (hover: `purple-50`)
- **Ghost/outline**: `transparent` with `purple-600` border
- **Danger buttons**: `red-600` (hover: `red-700`)
- **Focus rings**: `purple-500`
- **Gradients**: `purple-600` to `purple-700`

## Alternative: Using Custom Colors

If you want to use **exact hex colors** instead of Tailwind's palette, you can define custom utility classes:

### Step 1: Define Custom Color Classes

Uncomment and edit the custom utilities in `src/app/globals.css`:

```css
@layer utilities {
  /* Change these hex values to your brand colors */
  .bg-brand-primary { background-color: #FF6B35; }  /* Your brand orange */
  .bg-brand-primary-hover { background-color: #E55A2B; }
  .bg-brand-secondary { background-color: #FFA07A; }

  .text-brand-primary { color: #FF6B35; }
  .text-brand-dark { color: #2C3E50; }

  .border-brand-primary { border-color: #FF6B35; }

  .ring-brand-primary { --tw-ring-color: #FF6B35; }

  .from-brand-primary { --tw-gradient-from: #FF6B35; }
  .to-brand-primary-dark { --tw-gradient-to: #E55A2B; }
}
```

### Step 2: Update theme.ts

Then update `src/config/theme.ts` to use your custom classes:

```ts
export const theme = {
  button: {
    primary: `bg-brand-primary hover:bg-brand-primary-hover text-white`,
    secondary: `bg-white border-2 border-brand-secondary text-brand-dark hover:bg-gray-50`,
    ghost: `bg-transparent border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white`,
    danger: `bg-red-600 hover:bg-red-700 text-white`,
  },

  input: {
    border: `border-gray-300 focus:border-brand-primary focus:ring-brand-primary`,
    errorBorder: `border-red-300 focus:border-red-500 focus:ring-red-500`,
  },

  gradients: {
    primary: `from-brand-primary to-brand-primary-dark`,
    primaryText: `text-brand-secondary`,
  },
}
```

### Benefits of Custom Colors

✅ **Exact brand colors** - Use your specific hex values
✅ **Semantic naming** - `brand-primary` makes sense regardless of color
✅ **Single source of truth** - All hex values in `globals.css`
✅ **No color confusion** - Names are generic, not color-specific

### Drawbacks

⚠️ **More setup** - Need to define all utilities yourself
⚠️ **No autocomplete** - IDE won't suggest custom class names as well
⚠️ **More maintenance** - Add new utilities as needed (hover states, focus, etc.)

## Why This Approach?

### Centralized Configuration
- **One file to edit**: Change colors in `src/config/theme.ts` only
- **No hunting**: Don't search through multiple components
- **Type-safe**: All components import from the same source

### Accurate Naming
- Using Tailwind colors means names always match reality
- `purple-600` is purple, `yellow-500` is yellow
- No confusion like "vibrant-purple" being yellow after a rebrand

### Easy Updates
- All components use the theme config
- Change the theme file, everything updates
- Consistent colors automatically

## Component System

Cheesebox uses a centralized component system for consistent theming.

### Button Components

All buttons use `src/components/ui/Button.tsx`:

```tsx
import { Button, LinkButton } from '@/components/ui/Button';

// Primary button (uses --primary color)
<Button variant="primary">Click Me</Button>

// Ghost/outline button
<Button variant="ghost">Secondary Action</Button>

// Link button
<LinkButton href="/somewhere" variant="primary">
  Go Somewhere
</LinkButton>
```

### Available Variants

- `primary` - Main action buttons (uses `--primary` color)
- `secondary` - Secondary actions (uses `--surface` with `--accent` border)
- `ghost` - Outline buttons (transparent with `--primary` border)
- `danger` - Destructive actions (red)

### Button Sizes

- `sm` - Small buttons
- `md` - Default size
- `lg` - Large buttons

```tsx
<Button variant="primary" size="lg">Large Button</Button>
```

## Tailwind CSS Classes

You can use these color classes throughout your components:

### Background Colors
- `bg-primary` / `bg-primary-dark`
- `bg-vibrant-purple` / `bg-royal-purple` / `bg-lavender`
- `bg-surface` / `bg-surface-secondary`
- `bg-background` / `bg-foreground`

### Text Colors
- `text-primary` / `text-primary-dark`
- `text-vibrant-purple` / `text-royal-purple`
- `text-charcoal`

### Border Colors
- `border-primary` / `border-accent`
- `border-lavender`

## Advanced Customization

### Adding New Color Variants

1. Add your color to `globals.css`:

```css
:root {
  --my-custom-color: #FF6B6B;
}

@theme inline {
  --color-my-custom: var(--my-custom-color);
}
```

2. Use it in components:

```tsx
<div className="bg-my-custom text-white">Custom styled element</div>
```

### Customizing Components

To customize button styles, edit `src/components/ui/Button.tsx`:

```tsx
const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-vibrant-purple hover:bg-royal-purple text-white',
  // Modify existing variants or add new ones
  custom: 'bg-my-custom hover:bg-my-custom-dark text-white',
};
```

## Dark Mode (Future)

Dark mode support is planned for a future release. The current architecture with CSS variables makes it easy to add:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: var(--charcoal);
    --foreground: var(--ghost);
    /* ... */
  }
}
```

## Need Help?

- Check the [main README](./README.md) for general documentation
- Open an issue on GitHub for theming questions
- See `src/components/ui/Button.tsx` for component implementation details

## Color Picker Tools

Helpful tools for choosing your color palette:

- [Coolors.co](https://coolors.co) - Generate color palettes
- [Adobe Color](https://color.adobe.com) - Create color schemes
- [Material Design Color Tool](https://material.io/resources/color) - Material palette generator
