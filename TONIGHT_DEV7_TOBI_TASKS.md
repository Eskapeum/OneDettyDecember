# Dev 7 (Tobi) - Design System & UI/UX - Tonight's Tasks

**Role:** Design System & UI/UX Lead  
**Time:** 10:10 PM - 11:30 PM EST (1 hour 20 minutes)  
**Status:** 🆕 Starting Now

---

## 🎯 YOUR MISSION

Implement the **design system foundation** for OneDettyDecember - the vertical theming system, design tokens, and animation library.

**Why this matters:**
- 6 marketplace verticals need unique visual identities
- Consistency across 18 epics
- Neriah builds components - you define how they look and behave

---

## ✅ TONIGHT'S TASKS (1 hour 20 min)

### **TASK 1: Create Design Tokens System** (40 min)

**What:** Define all design tokens (colors, spacing, typography, shadows, etc.)

**Create `src/lib/design-tokens.ts`:**
```typescript
// OneDettyDecember Design Tokens
// Based on PRD v4 and design principles

export const colors = {
  // Brand Colors
  brand: {
    gold: '#FFB700',        // Detty Gold
    black: '#1A1A1A',       // Unity Black
    midnight: '#264653',    // Midnight Indigo
  },
  
  // Vertical Colors
  verticals: {
    events: '#E63946',      // Afrobeat Red
    stays: '#2A9D8F',       // Coastal Emerald
    experiences: '#FB8500', // Festival Orange
    cars: '#003566',        // Atlantic Blue
    marketplace: '#7209B7', // Highlife Purple
    community: '#FFD60A',   // Danfo Yellow
  },
  
  // Neutral Colors
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Semantic Colors
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
}

export const typography = {
  fonts: {
    primary: 'Geist Mono, monospace',
    secondary: 'DM Sans, sans-serif',
    accent: 'Space Grotesk, sans-serif',
  },
  
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
}

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
}

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',
}

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
}

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}
```

**Deliverable:** ✅ Design tokens defined

---

### **TASK 2: Create Vertical Theme Utility** (20 min)

**What:** Build utility to apply vertical-specific theming to components

**Create `src/lib/vertical-theme.ts`:**
```typescript
import { colors } from './design-tokens'

export type Vertical = 'events' | 'stays' | 'experiences' | 'cars' | 'marketplace' | 'community'

export const getVerticalColor = (vertical: Vertical): string => {
  return colors.verticals[vertical]
}

export const getVerticalClasses = (vertical: Vertical) => {
  const colorMap = {
    events: 'bg-[#E63946] hover:bg-[#D62839] text-white',
    stays: 'bg-[#2A9D8F] hover:bg-[#238276] text-white',
    experiences: 'bg-[#FB8500] hover:bg-[#E07700] text-white',
    cars: 'bg-[#003566] hover:bg-[#002A52] text-white',
    marketplace: 'bg-[#7209B7] hover:bg-[#5F07A0] text-white',
    community: 'bg-[#FFD60A] hover:bg-[#E6C109] text-black',
  }
  
  return colorMap[vertical]
}

export const getVerticalBorderClasses = (vertical: Vertical) => {
  const borderMap = {
    events: 'border-[#E63946]',
    stays: 'border-[#2A9D8F]',
    experiences: 'border-[#FB8500]',
    cars: 'border-[#003566]',
    marketplace: 'border-[#7209B7]',
    community: 'border-[#FFD60A]',
  }
  
  return borderMap[vertical]
}
```

**Deliverable:** ✅ Vertical theme utilities created

---

### **TASK 3: Create Animation Library** (20 min)

**What:** Define reusable animations for the platform

**Create `src/lib/animations.ts`:**
```typescript
// OneDettyDecember Animation Library
// Smooth, purposeful animations for better UX

export const animations = {
  // Fade animations
  fadeIn: 'animate-in fade-in duration-300',
  fadeOut: 'animate-out fade-out duration-200',
  
  // Slide animations
  slideInFromTop: 'animate-in slide-in-from-top duration-300',
  slideInFromBottom: 'animate-in slide-in-from-bottom duration-300',
  slideInFromLeft: 'animate-in slide-in-from-left duration-300',
  slideInFromRight: 'animate-in slide-in-from-right duration-300',
  
  // Scale animations
  scaleIn: 'animate-in zoom-in duration-200',
  scaleOut: 'animate-out zoom-out duration-150',
  
  // Hover effects
  hoverLift: 'transition-transform hover:-translate-y-1 duration-200',
  hoverScale: 'transition-transform hover:scale-105 duration-200',
  
  // Loading states
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  bounce: 'animate-bounce',
}

export const transitions = {
  fast: 'transition-all duration-150 ease-in-out',
  base: 'transition-all duration-200 ease-in-out',
  slow: 'transition-all duration-300 ease-in-out',
}
```

**Deliverable:** ✅ Animation library created

---

## 📊 SUCCESS CRITERIA - TONIGHT

By 11:30 PM EST, you should have:

- [ ] Design tokens file created (`src/lib/design-tokens.ts`)
- [ ] Vertical theme utilities created (`src/lib/vertical-theme.ts`)
- [ ] Animation library created (`src/lib/animations.ts`)
- [ ] All files properly typed with TypeScript
- [ ] Git commit: "Add design system foundation (tokens, themes, animations)"

---

## 🚀 TOMORROW (Sprint 0 Day 1)

**Your focus:**
1. Create responsive design utilities
2. Build component variants system
3. Implement dark mode support
4. Create design system documentation
5. Work with Neriah on component styling

---

**Tobi:** Welcome to the team! You're the design guardian. Make it beautiful! 🎨✨

