# OneDettyDecember Design System

**Version:** 1.0.0
**Last Updated:** November 17, 2025
**Maintained By:** Dev 7 (TOBI) - Design System & UI/UX Lead

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Design Principles](#design-principles)
3. [Design Tokens](#design-tokens)
4. [Vertical Theming System](#vertical-theming-system)
5. [Animation Library](#animation-library)
6. [Usage Examples](#usage-examples)
7. [Best Practices](#best-practices)
8. [Contributing](#contributing)

---

## Overview

The OneDettyDecember Design System provides a comprehensive foundation for building consistent, accessible, and beautiful user interfaces across all 6 marketplace verticals.

### Key Features

- **🎨 Vertical Theming**: Unique visual identity for each marketplace vertical
- **📦 Design Tokens**: Centralized design variables for consistency
- **✨ Animation Library**: Smooth, purposeful animations
- **📱 Responsive**: Mobile-first, works across all screen sizes
- **🔒 Type-Safe**: Full TypeScript support
- **♿ Accessible**: WCAG 2.1 AA compliant colors

### File Structure

```
src/lib/
├── design-tokens.ts      # All design tokens (colors, typography, spacing, etc.)
├── vertical-theme.ts     # Vertical-specific theming utilities
└── animations.ts         # Animation and transition utilities
```

---

## Design Principles

### 1. **Unity Through Diversity**
Each vertical has its own visual identity while maintaining cohesive brand elements.

### 2. **Cultural Authenticity**
Design choices reflect African and diaspora aesthetics and naming conventions.

### 3. **Purposeful Animation**
Every animation serves a UX purpose - no decoration without function.

### 4. **Mobile-First**
Optimized for mobile experiences, enhanced for desktop.

### 5. **Accessibility First**
All color combinations meet WCAG 2.1 AA contrast ratios.

---

## Design Tokens

Design tokens are the single source of truth for all design decisions.

### Colors

#### Brand Colors
```typescript
import { colors } from '@/lib/design-tokens'

colors.brand.gold      // '#FFB700' - Detty Gold (primary brand)
colors.brand.black     // '#1A1A1A' - Unity Black (text, headers)
colors.brand.midnight  // '#264653' - Midnight Indigo (accents)
```

**Usage:**
- **Gold**: CTAs, highlights, premium features
- **Black**: Text, headers, high contrast elements
- **Midnight**: Secondary actions, subtle accents

#### Vertical Colors
Each of the 6 marketplace verticals has a unique brand color:

```typescript
colors.verticals.events       // '#E63946' - Afrobeat Red
colors.verticals.stays        // '#2A9D8F' - Coastal Emerald
colors.verticals.experiences  // '#FB8500' - Festival Orange
colors.verticals.cars         // '#003566' - Atlantic Blue
colors.verticals.marketplace  // '#7209B7' - Highlife Purple
colors.verticals.community    // '#FFD60A' - Danfo Yellow
```

**Cultural References:**
- **Afrobeat Red**: Energy of live music and events
- **Coastal Emerald**: West African coastlines
- **Festival Orange**: Vibrant festival atmosphere
- **Atlantic Blue**: Deep ocean connections
- **Highlife Purple**: Royalty and premium goods
- **Danfo Yellow**: Lagos transport culture

#### Neutral Colors
A complete grayscale palette for UI elements:

```typescript
colors.neutral[50]   // '#FAFAFA' - Lightest backgrounds
colors.neutral[100]  // '#F5F5F5'
colors.neutral[200]  // '#E5E5E5'
colors.neutral[300]  // '#D4D4D4'
colors.neutral[400]  // '#A3A3A3'
colors.neutral[500]  // '#737373' - Mid-gray
colors.neutral[600]  // '#525252'
colors.neutral[700]  // '#404040'
colors.neutral[800]  // '#262626'
colors.neutral[900]  // '#171717' - Darkest text
```

#### Semantic Colors
Status and feedback colors:

```typescript
colors.semantic.success  // '#10B981' - Success states
colors.semantic.warning  // '#F59E0B' - Warning states
colors.semantic.error    // '#EF4444' - Error states
colors.semantic.info     // '#3B82F6' - Informational
```

### Typography

#### Font Families
```typescript
import { typography } from '@/lib/design-tokens'

typography.fonts.primary    // 'Geist Mono, monospace'
typography.fonts.secondary  // 'DM Sans, sans-serif'
typography.fonts.accent     // 'Space Grotesk, sans-serif'
```

**Usage:**
- **Primary (Geist Mono)**: Code blocks, technical content, monospace needs
- **Secondary (DM Sans)**: Body text, descriptions, UI labels
- **Accent (Space Grotesk)**: Headlines, hero text, emphasis

#### Font Sizes
```typescript
typography.sizes.xs    // '0.75rem'  (12px)
typography.sizes.sm    // '0.875rem' (14px)
typography.sizes.base  // '1rem'     (16px) - Default body
typography.sizes.lg    // '1.125rem' (18px)
typography.sizes.xl    // '1.25rem'  (20px)
typography.sizes['2xl'] // '1.5rem'  (24px)
typography.sizes['3xl'] // '1.875rem'(30px)
typography.sizes['4xl'] // '2.25rem' (36px)
typography.sizes['5xl'] // '3rem'    (48px)
```

#### Font Weights
```typescript
typography.weights.normal    // 400 - Body text
typography.weights.medium    // 500 - Emphasized text
typography.weights.semibold  // 600 - Subheadings
typography.weights.bold      // 700 - Headlines
```

#### Line Heights
```typescript
typography.lineHeights.tight    // 1.25 - Headings
typography.lineHeights.normal   // 1.5  - Body text
typography.lineHeights.relaxed  // 1.75 - Long-form content
```

### Spacing

8-point grid system for consistent spacing:

```typescript
import { spacing } from '@/lib/design-tokens'

spacing[0]   // '0'        (0px)
spacing[1]   // '0.25rem'  (4px)
spacing[2]   // '0.5rem'   (8px)
spacing[3]   // '0.75rem'  (12px)
spacing[4]   // '1rem'     (16px)  - Base unit
spacing[5]   // '1.25rem'  (20px)
spacing[6]   // '1.5rem'   (24px)
spacing[8]   // '2rem'     (32px)
spacing[10]  // '2.5rem'   (40px)
spacing[12]  // '3rem'     (48px)
spacing[16]  // '4rem'     (64px)
spacing[20]  // '5rem'     (80px)
spacing[24]  // '6rem'     (96px)
```

### Border Radius

```typescript
import { borderRadius } from '@/lib/design-tokens'

borderRadius.none  // '0'         - Sharp corners
borderRadius.sm    // '0.125rem'  (2px)
borderRadius.base  // '0.25rem'   (4px)  - Default
borderRadius.md    // '0.375rem'  (6px)
borderRadius.lg    // '0.5rem'    (8px)
borderRadius.xl    // '0.75rem'   (12px)
borderRadius['2xl'] // '1rem'     (16px)
borderRadius.full  // '9999px'    - Fully rounded (pills, avatars)
```

### Shadows

Elevation system for depth and hierarchy:

```typescript
import { shadows } from '@/lib/design-tokens'

shadows.sm   // Subtle hover states
shadows.base // Default card shadow
shadows.md   // Raised cards, dropdowns
shadows.lg   // Modals, popovers
shadows.xl   // Hero elements, overlays
```

### Breakpoints

Mobile-first responsive breakpoints:

```typescript
import { breakpoints } from '@/lib/design-tokens'

breakpoints.sm    // '640px'  - Small tablets
breakpoints.md    // '768px'  - Tablets
breakpoints.lg    // '1024px' - Small laptops
breakpoints.xl    // '1280px' - Desktops
breakpoints['2xl'] // '1536px' - Large screens
```

---

## Vertical Theming System

The vertical theming system allows components to automatically adapt their appearance based on the marketplace vertical.

### Import

```typescript
import {
  getVerticalColor,
  getVerticalClasses,
  getVerticalBorderClasses,
  type Vertical
} from '@/lib/vertical-theme'
```

### Available Verticals

```typescript
type Vertical = 'events' | 'stays' | 'experiences' | 'cars' | 'marketplace' | 'community'
```

### Functions

#### `getVerticalColor(vertical: Vertical): string`

Returns the hex color for a vertical.

```typescript
const eventColor = getVerticalColor('events')
// Returns: '#E63946'

const stayColor = getVerticalColor('stays')
// Returns: '#2A9D8F'
```

**Use Case:** Dynamic styling, chart colors, custom CSS

#### `getVerticalClasses(vertical: Vertical): string`

Returns Tailwind classes for background, hover, and text colors.

```typescript
const eventClasses = getVerticalClasses('events')
// Returns: 'bg-[#E63946] hover:bg-[#D62839] text-white'

const communityClasses = getVerticalClasses('community')
// Returns: 'bg-[#FFD60A] hover:bg-[#E6C109] text-black'
```

**Use Case:** Buttons, cards, badges, chips

#### `getVerticalBorderClasses(vertical: Vertical): string`

Returns Tailwind border color classes.

```typescript
const carsBorder = getVerticalBorderClasses('cars')
// Returns: 'border-[#003566]'
```

**Use Case:** Card borders, input fields, dividers

### Complete Vertical Class Map

| Vertical | Background | Hover | Text | Border |
|----------|-----------|-------|------|--------|
| **Events** | `#E63946` | `#D62839` | White | `#E63946` |
| **Stays** | `#2A9D8F` | `#238276` | White | `#2A9D8F` |
| **Experiences** | `#FB8500` | `#E07700` | White | `#FB8500` |
| **Cars** | `#003566` | `#002A52` | White | `#003566` |
| **Marketplace** | `#7209B7` | `#5F07A0` | White | `#7209B7` |
| **Community** | `#FFD60A` | `#E6C109` | Black | `#FFD60A` |

---

## Animation Library

Smooth, purposeful animations that enhance UX without being distracting.

### Import

```typescript
import { animations, transitions } from '@/lib/animations'
```

### Fade Animations

```typescript
animations.fadeIn   // 'animate-in fade-in duration-300'
animations.fadeOut  // 'animate-out fade-out duration-200'
```

**Use Case:** Content loading, modals, tooltips

### Slide Animations

```typescript
animations.slideInFromTop     // 'animate-in slide-in-from-top duration-300'
animations.slideInFromBottom  // 'animate-in slide-in-from-bottom duration-300'
animations.slideInFromLeft    // 'animate-in slide-in-from-left duration-300'
animations.slideInFromRight   // 'animate-in slide-in-from-right duration-300'
```

**Use Case:** Drawers, sidebars, notifications, mobile menus

### Scale Animations

```typescript
animations.scaleIn   // 'animate-in zoom-in duration-200'
animations.scaleOut  // 'animate-out zoom-out duration-150'
```

**Use Case:** Dialogs, popovers, quick actions

### Hover Effects

```typescript
animations.hoverLift   // 'transition-transform hover:-translate-y-1 duration-200'
animations.hoverScale  // 'transition-transform hover:scale-105 duration-200'
```

**Use Case:** Cards, buttons, interactive elements

### Loading States

```typescript
animations.pulse   // 'animate-pulse'
animations.spin    // 'animate-spin'
animations.bounce  // 'animate-bounce'
```

**Use Case:** Loading indicators, processing states

### Transitions

```typescript
transitions.fast  // 'transition-all duration-150 ease-in-out'
transitions.base  // 'transition-all duration-200 ease-in-out'
transitions.slow  // 'transition-all duration-300 ease-in-out'
```

**Use Case:** General transitions, color changes, size adjustments

---

## Usage Examples

### Example 1: Vertical-Themed Button

```tsx
import { getVerticalClasses } from '@/lib/vertical-theme'
import { animations } from '@/lib/animations'

function VerticalButton({ vertical, children }) {
  return (
    <button
      className={`
        ${getVerticalClasses(vertical)}
        ${animations.hoverLift}
        px-6 py-3 rounded-lg font-semibold
      `}
    >
      {children}
    </button>
  )
}

// Usage
<VerticalButton vertical="events">Book Event</VerticalButton>
<VerticalButton vertical="stays">Book Stay</VerticalButton>
```

### Example 2: Themed Card

```tsx
import { getVerticalBorderClasses } from '@/lib/vertical-theme'
import { shadows, borderRadius } from '@/lib/design-tokens'
import { animations } from '@/lib/animations'

function VerticalCard({ vertical, title, children }) {
  return (
    <div
      className={`
        ${getVerticalBorderClasses(vertical)}
        ${animations.fadeIn}
        ${animations.hoverLift}
        border-2 p-6 bg-white
      `}
      style={{
        borderRadius: borderRadius.lg,
        boxShadow: shadows.md,
      }}
    >
      <h3 className="font-bold text-xl mb-4">{title}</h3>
      {children}
    </div>
  )
}
```

### Example 3: Loading Skeleton

```tsx
import { animations } from '@/lib/animations'
import { borderRadius, spacing } from '@/lib/design-tokens'

function Skeleton({ className }) {
  return (
    <div
      className={`${animations.pulse} bg-gray-200 ${className}`}
      style={{ borderRadius: borderRadius.base }}
    />
  )
}

// Usage
<div className="space-y-4">
  <Skeleton className="h-12 w-full" />
  <Skeleton className="h-32 w-full" />
</div>
```

### Example 4: Animated Modal

```tsx
import { animations } from '@/lib/animations'
import { shadows } from '@/lib/design-tokens'

function Modal({ isOpen, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className={`${animations.fadeIn} absolute inset-0 bg-black/50`} />

      {/* Modal Content */}
      <div
        className={`
          ${animations.scaleIn}
          relative bg-white p-8 rounded-xl max-w-md w-full mx-4
        `}
        style={{ boxShadow: shadows.xl }}
      >
        {children}
      </div>
    </div>
  )
}
```

### Example 5: Responsive Typography

```tsx
import { typography, spacing } from '@/lib/design-tokens'

function Hero() {
  return (
    <div style={{ padding: spacing[8] }}>
      <h1
        style={{
          fontFamily: typography.fonts.accent,
          fontSize: typography.sizes['5xl'],
          fontWeight: typography.weights.bold,
          lineHeight: typography.lineHeights.tight,
        }}
      >
        OneDettyDecember
      </h1>
      <p
        style={{
          fontFamily: typography.fonts.secondary,
          fontSize: typography.sizes.lg,
          lineHeight: typography.lineHeights.relaxed,
          marginTop: spacing[4],
        }}
      >
        Your December, Your Way
      </p>
    </div>
  )
}
```

### Example 6: Vertical Badge

```tsx
import { getVerticalColor, type Vertical } from '@/lib/vertical-theme'
import { borderRadius, spacing } from '@/lib/design-tokens'

function VerticalBadge({ vertical, label }: { vertical: Vertical, label: string }) {
  const textColor = vertical === 'community' ? '#000' : '#FFF'

  return (
    <span
      style={{
        backgroundColor: getVerticalColor(vertical),
        color: textColor,
        padding: `${spacing[1]} ${spacing[3]}`,
        borderRadius: borderRadius.full,
        fontSize: '0.875rem',
        fontWeight: 600,
      }}
    >
      {label}
    </span>
  )
}

// Usage
<VerticalBadge vertical="events" label="Events" />
<VerticalBadge vertical="stays" label="Stays" />
```

---

## Best Practices

### 🎨 Colors

✅ **DO:**
- Use vertical colors for vertical-specific features
- Use brand.gold for primary CTAs
- Use neutral colors for backgrounds and text
- Ensure 4.5:1 contrast ratio for text

❌ **DON'T:**
- Mix vertical colors within the same feature
- Use vertical colors for unrelated features
- Use semantic colors for decoration

### 📝 Typography

✅ **DO:**
- Use font scale consistently
- Maintain proper line height for readability
- Use accent font for impact, secondary for body

❌ **DON'T:**
- Create custom font sizes outside the scale
- Use primary (mono) font for long-form content
- Mix more than 2 font families per component

### 📏 Spacing

✅ **DO:**
- Use the spacing scale for all margins/padding
- Stick to 8px grid (spacing[2], spacing[4], spacing[6])
- Use consistent spacing within component types

❌ **DON'T:**
- Use arbitrary spacing values
- Mix spacing scales inconsistently

### ✨ Animations

✅ **DO:**
- Use animations to provide feedback
- Keep animations under 300ms for interactions
- Respect prefers-reduced-motion

❌ **DON'T:**
- Animate everything
- Use animations longer than 500ms
- Create custom animation timings

### 🎯 Vertical Theming

✅ **DO:**
- Use `getVerticalClasses()` for interactive elements
- Apply vertical colors to relevant features
- Keep vertical theming consistent per section

❌ **DON'T:**
- Use vertical colors outside their context
- Override vertical theme colors
- Mix multiple vertical themes in one component

---

## Contributing

### Adding New Tokens

1. Add to appropriate section in `design-tokens.ts`
2. Update this documentation with examples
3. Add usage guidelines
4. Create example components

### Modifying Existing Tokens

⚠️ **Warning:** Changing tokens affects the entire platform!

1. Discuss with design team
2. Test across all verticals
3. Update documentation
4. Review accessibility compliance
5. Update affected components

### Adding New Animations

1. Add to `animations.ts`
2. Follow naming convention: `[action][Direction]`
3. Keep duration under 300ms for interactions
4. Test on mobile devices
5. Document use cases

---

## Accessibility

### Color Contrast

All color combinations meet **WCAG 2.1 AA** standards:
- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio
- UI components: 3:1 contrast ratio

### Motion

All animations respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Focus States

All interactive elements have visible focus indicators using:
- Brand.gold for primary focus
- Vertical color for vertical-specific elements

---

## Resources

### Design Files
- Figma: [Link to Figma file]
- Brand Guidelines: [Link to brand guide]

### Related Documentation
- [Component Library](./COMPONENTS.md)
- [PRD v4](./docs/prd-v4.md)
- [Architecture Guide](./ARCHITECTURE.md)

### Tools
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Color Blindness Simulator](https://www.color-blindness.com/coblis-color-blindness-simulator/)

---

**Design System Maintained By:** Dev 7 (TOBI)
**Questions?** Open an issue or contact the design team
**Last Updated:** November 17, 2025

---

*OneDettyDecember Design System v1.0.0 - Making December Detty, One Beautiful Component at a Time* 🎨✨
