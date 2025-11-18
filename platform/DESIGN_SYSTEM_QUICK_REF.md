# Design System Quick Reference

**Quick copy-paste reference for common design system patterns**

---

## 🎨 Import Statements

```typescript
// Design Tokens
import { colors, typography, spacing, borderRadius, shadows } from '@/lib/design-tokens'

// Vertical Theming
import { getVerticalClasses, getVerticalBorderClasses, getVerticalColor } from '@/lib/vertical-theme'
import type { Vertical } from '@/lib/vertical-theme'

// Animations
import { animations, transitions } from '@/lib/animations'
```

---

## 🎯 Common Patterns

### Primary Button
```tsx
<button className="bg-[#FFB700] hover:bg-[#E6A600] text-black px-6 py-3 rounded-lg font-semibold transition-all duration-200">
  Primary Action
</button>
```

### Vertical Button
```tsx
<button className={`${getVerticalClasses('events')} px-6 py-3 rounded-lg font-semibold ${animations.hoverLift}`}>
  Book Event
</button>
```

### Card
```tsx
<div className={`bg-white p-6 rounded-lg ${animations.hoverLift}`} style={{ boxShadow: shadows.md }}>
  Card Content
</div>
```

### Vertical Card Border
```tsx
<div className={`${getVerticalBorderClasses('stays')} border-2 bg-white p-6 rounded-lg`}>
  Vertical Content
</div>
```

### Badge
```tsx
<span className="bg-[#FFB700] text-black px-3 py-1 rounded-full text-sm font-semibold">
  New
</span>
```

### Vertical Badge
```tsx
<span style={{
  backgroundColor: getVerticalColor('events'),
  color: '#FFF',
  padding: '4px 12px',
  borderRadius: '9999px',
  fontSize: '0.875rem',
  fontWeight: 600
}}>
  Events
</span>
```

---

## 🎨 Color Quick Reference

### Brand
```typescript
'#FFB700'  // Gold (Primary)
'#1A1A1A'  // Black (Text)
'#264653'  // Midnight (Accent)
```

### Verticals
```typescript
'#E63946'  // Events (Red)
'#2A9D8F'  // Stays (Emerald)
'#FB8500'  // Experiences (Orange)
'#003566'  // Cars (Blue)
'#7209B7'  // Marketplace (Purple)
'#FFD60A'  // Community (Yellow)
```

### Semantic
```typescript
'#10B981'  // Success (Green)
'#F59E0B'  // Warning (Amber)
'#EF4444'  // Error (Red)
'#3B82F6'  // Info (Blue)
```

---

## 📏 Spacing Quick Reference

```typescript
4px   → spacing[1]  → '0.25rem'
8px   → spacing[2]  → '0.5rem'
12px  → spacing[3]  → '0.75rem'
16px  → spacing[4]  → '1rem'     // Base unit
24px  → spacing[6]  → '1.5rem'
32px  → spacing[8]  → '2rem'
48px  → spacing[12] → '3rem'
64px  → spacing[16] → '4rem'
```

---

## 📝 Typography Quick Reference

### Font Families
```css
font-family: 'Geist Mono, monospace'      /* Primary - Code/Technical */
font-family: 'DM Sans, sans-serif'        /* Secondary - Body */
font-family: 'Space Grotesk, sans-serif'  /* Accent - Headlines */
```

### Common Sizes
```typescript
12px → typography.sizes.xs
14px → typography.sizes.sm
16px → typography.sizes.base  // Default
18px → typography.sizes.lg
24px → typography.sizes['2xl']
36px → typography.sizes['4xl']
48px → typography.sizes['5xl']
```

### Common Weights
```typescript
400 → typography.weights.normal    // Body
600 → typography.weights.semibold  // Subheadings
700 → typography.weights.bold      // Headlines
```

---

## ✨ Animation Quick Reference

### Common Animations
```typescript
animations.fadeIn              // Modal/Toast appear
animations.slideInFromRight    // Drawer/Sidebar
animations.scaleIn            // Dialog/Popover
animations.hoverLift          // Cards
animations.pulse              // Loading skeleton
```

### Common Transitions
```typescript
transitions.fast  // 150ms - Hover effects
transitions.base  // 200ms - Default
transitions.slow  // 300ms - Page transitions
```

---

## 🎯 Vertical-Specific Examples

### Events (Red)
```tsx
<button className="bg-[#E63946] hover:bg-[#D62839] text-white px-6 py-3 rounded-lg">
  Book Event
</button>
```

### Stays (Emerald)
```tsx
<button className="bg-[#2A9D8F] hover:bg-[#238276] text-white px-6 py-3 rounded-lg">
  Book Stay
</button>
```

### Community (Yellow - Black Text!)
```tsx
<button className="bg-[#FFD60A] hover:bg-[#E6C109] text-black px-6 py-3 rounded-lg">
  Join Community
</button>
```

---

## 🔄 Common Component Patterns

### Loading Skeleton
```tsx
<div className={`${animations.pulse} bg-gray-200 h-12 rounded`} />
```

### Success Toast
```tsx
<div className={`${animations.fadeIn} ${animations.slideInFromTop} bg-[#10B981] text-white p-4 rounded-lg`}>
  ✅ Success!
</div>
```

### Modal Backdrop
```tsx
<div className={`${animations.fadeIn} fixed inset-0 bg-black/50 z-40`} />
```

### Card with Hover
```tsx
<div className={`bg-white p-6 rounded-lg ${animations.hoverLift} cursor-pointer`}>
  Interactive Card
</div>
```

---

## 📱 Responsive Breakpoints

```typescript
sm: '640px'   // @media (min-width: 640px)
md: '768px'   // @media (min-width: 768px)
lg: '1024px'  // @media (min-width: 1024px)
xl: '1280px'  // @media (min-width: 1280px)
```

### Tailwind Usage
```tsx
<div className="px-4 md:px-8 lg:px-16">
  {/* 4px mobile, 8px tablet, 16px desktop */}
</div>
```

---

## 🎨 Shadow Quick Pick

```typescript
shadows.sm    // Subtle hover
shadows.base  // Default cards
shadows.md    // Raised elements
shadows.lg    // Modals/Popovers
shadows.xl    // Hero/Overlays
```

### Usage
```tsx
<div style={{ boxShadow: shadows.md }}>Card</div>
```

---

## ♿ Accessibility Checklist

- [ ] Text contrast ≥ 4.5:1
- [ ] Interactive elements ≥ 44x44px
- [ ] Visible focus states
- [ ] Semantic HTML
- [ ] Alt text for images
- [ ] ARIA labels where needed

---

## 🚫 Common Mistakes to Avoid

❌ Using arbitrary colors outside the design system
❌ Creating custom spacing values
❌ Mixing vertical colors in one component
❌ Animations longer than 300ms
❌ Using primary (mono) font for body text
❌ Skipping focus states

---

**For full documentation:** See `DESIGN_SYSTEM.md`
**Questions?** Contact Dev 7 (TOBI)
