# UI Theming Audit & Migration Plan

## Current State Analysis

### Spacing
**Current Issues:**
- Mixed usage: CSS variables (`--spacing-xs`, `--spacing-sm`, etc.) in `main.css` vs Chakra props (`gap={6}`, `p={6}`, `mt={1}`)
- Inconsistent spacing scale: `0.25rem`, `0.5rem`, `1rem`, `1.5rem`, `2rem` in CSS vs Chakra's default scale
- Hardcoded values: `marginBottom: '1rem'`, `gap: '0.75rem'` in inline styles

**Desired State:**
- Use Chakra's spacing tokens: `1`, `2`, `3`, `4`, `5`, `6`, `8`, `10`, `12`, `16`, `20`, `24`
- Consistent spacing scale throughout (multiples of 4px base)
- Remove all CSS spacing variables and inline spacing styles

### Typography
**Current Issues:**
- CSS variable `--font-sans` with system font stack
- Hardcoded font sizes: `fontSize="sm"`, `fontSize="1.5rem"` mixed with Chakra tokens
- Inconsistent font weights: `fontWeight={500}`, `fontWeight={600}` vs CSS `font-weight: bold`

**Desired State:**
- Use Chakra's typography tokens: `textStyles` for headings, body, etc.
- Font family: Inter (matching Chakra UI Pro)
- Consistent font size scale: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`
- Font weights: `400` (normal), `500` (medium), `600` (semibold), `700` (bold)

### Colors
**Current Issues:**
- CSS variables: `--color-primary`, `--color-secondary`, `--color-bg`, `--color-surface`, etc.
- Mixed usage: `color="gray.600"` (Chakra) vs `color: var(--color-text-light)` (CSS)
- Hardcoded colors: `#fee`, `#c00` in error states

**Desired State:**
- Use Chakra's semantic color tokens:
  - `bg.canvas` - main background
  - `bg.surface` - card/surface background
  - `fg.default` - default text
  - `fg.muted` - muted/secondary text
  - `fg.subtle` - subtle text
  - `border.emphasized` - borders
  - `colorPalette` for primary actions (blue by default)
- Remove all CSS color variables

### Border Radius
**Current Issues:**
- CSS variables: `--radius-sm: 0.25rem`, `--radius-md: 0.5rem`
- Inconsistent usage across components

**Desired State:**
- Use Chakra's radius tokens: `sm`, `md`, `lg`, `xl`, `full`
- Consistent radius scale: `sm` (4px), `md` (6px), `lg` (8px)

### Component Patterns
**Current Issues:**
- Mix of Chakra components and custom CSS classes (`.card`, `.button`, `.input-wrapper`)
- Inconsistent component styling
- Modal dialogs use inline styles for positioning

**Desired State:**
- Use Chakra component recipes: `Card`, `Button`, `Input`, `Dialog`, `Table`
- Consistent component variants and sizes
- Remove all custom CSS classes

## Token Mapping

| Current CSS Variable | Chakra Token | Notes |
|---------------------|--------------|-------|
| `--spacing-xs` (0.25rem) | `1` (4px) | |
| `--spacing-sm` (0.5rem) | `2` (8px) | |
| `--spacing-md` (1rem) | `4` (16px) | |
| `--spacing-lg` (1.5rem) | `6` (24px) | |
| `--spacing-xl` (2rem) | `8` (32px) | |
| `--color-primary` (#2563eb) | `colorPalette.blue.500` | Use semantic tokens |
| `--color-bg` (#f8fafc) | `bg.canvas` | |
| `--color-surface` (#ffffff) | `bg.surface` | |
| `--color-text` (#1e293b) | `fg.default` | |
| `--color-text-light` (#64748b) | `fg.muted` | |
| `--color-border` (#e2e8f0) | `border.emphasized` | |
| `--radius-sm` (0.25rem) | `sm` | |
| `--radius-md` (0.5rem) | `md` | |
| `--font-sans` | `fontFamily.sans` (Inter) | |

## Migration Checklist

- [x] Document current state
- [x] Create Chakra theme system with semantic tokens
- [x] Remove `main.css` spacing/color variables
- [x] Update all components to use Chakra tokens
- [x] Remove custom CSS classes
- [x] Update typography to use Inter font
- [x] Standardize component spacing
- [x] Test visual consistency

## Implementation Summary

### Theme System (`src/theme/index.ts`)
- Created custom Chakra UI v3 theme configuration using `createSystem` and `defineConfig`
- Defined semantic color tokens: `bg.canvas`, `bg.surface`, `fg.default`, `fg.muted`, `fg.subtle`, `border.emphasized`, `border.subtle`
- Configured Inter font family (matching Chakra UI Pro)
- Defined spacing scale (multiples of 4px)
- Defined border radius scale
- Added global CSS reset and base styles

### Layout & Navigation
- Updated `app.tsx` to use Chakra `Box` with semantic background color
- Refactored `Navigation.tsx` to use Chakra components with semantic tokens
- Removed inline styles in favor of Chakra props
- Added responsive navigation with active state styling

### Components Updated
- **Forms**: `Input`, `Textarea`, `Select` components now use Chakra `Field` components
- **Tables**: All table components (`IngredientTable`, `RecipeTableContent`, `StorageLocationMiniTable`) updated to use Chakra `Table` components with consistent styling
- **Cards**: `StorageLocationCard` uses Chakra `Card` components
- **Modals**: `IngredientModal`, `RecipeCreationDialog` use Chakra `Dialog` components
- **Filters**: `IngredientFilters` converted from CSS classes to Chakra `Box` and `SimpleGrid`

### Color Token Migration
- Replaced all `color="gray.600"` with `color="fg.muted"`
- Replaced all `color="gray.500"` with `color="fg.subtle"`
- Replaced hardcoded background colors with `bg.canvas` and `bg.surface`
- Updated border colors to use `border.emphasized` and `border.subtle`

### Spacing Standardization
- Removed all CSS spacing variables
- Standardized spacing to Chakra tokens: `1`, `2`, `3`, `4`, `6`, `8`
- Updated all `gap`, `padding`, and `margin` props to use Chakra spacing scale

## Design Tokens Reference

### Colors
- `bg.canvas` - Main application background
- `bg.surface` - Card and surface backgrounds
- `bg.subtle` - Subtle background for hover states
- `fg.default` - Primary text color
- `fg.muted` - Secondary/muted text color
- `fg.subtle` - Subtle text color
- `border.emphasized` - Primary border color
- `border.subtle` - Subtle border color

### Typography
- Font family: Inter (loaded from Google Fonts)
- Font sizes: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`
- Font weights: `400` (normal), `500` (medium), `600` (semibold), `700` (bold)

### Spacing
- Base unit: 4px
- Scale: `1` (4px), `2` (8px), `3` (12px), `4` (16px), `6` (24px), `8` (32px)

### Border Radius
- `sm` - 4px
- `md` - 6px
- `lg` - 8px
- `xl` - 12px

## Usage Guidelines

1. **Always use semantic tokens** for colors instead of hardcoded values
2. **Use Chakra spacing scale** for consistent spacing throughout
3. **Prefer Chakra components** over custom CSS classes
4. **Use responsive props** for mobile-first design (e.g., `display={{ base: 'none', sm: 'inline' }}`)
5. **Follow Chakra UI patterns** for component composition

