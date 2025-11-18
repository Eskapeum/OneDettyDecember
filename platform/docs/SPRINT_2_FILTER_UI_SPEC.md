# Sprint 2: Filter UI Design Specification

**Developer:** Dev 7 (TOBI) - Design System & UI/UX Lead
**Sprint:** 2 of 13
**Story Points:** 4 points (Filter UI: 2pts + Mobile Optimization: 2pts)
**Status:** 🎨 Design Specification
**Date:** November 18, 2025

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Component Architecture](#component-architecture)
3. [Desktop Filter Panel](#desktop-filter-panel)
4. [Mobile Filter Drawer](#mobile-filter-drawer)
5. [Filter Components](#filter-components)
6. [Interaction Patterns](#interaction-patterns)
7. [Technical Specifications](#technical-specifications)
8. [Accessibility](#accessibility)

---

## Overview

### Purpose
Create a comprehensive, mobile-optimized filter system for package discovery that allows users to refine search results by category, price, date, and location.

### Goals
- ✅ Intuitive filter interface for desktop and mobile
- ✅ Vertical-themed category filters
- ✅ Touch-friendly mobile experience
- ✅ Fast filter application (<200ms)
- ✅ WCAG 2.1 AA compliant
- ✅ Dark mode support

### User Stories
1. **As a user**, I want to filter packages by category so I can find Events, Stays, Experiences, etc.
2. **As a user**, I want to set a price range so I can find packages within my budget
3. **As a user**, I want to filter by date range so I can find packages for specific dates
4. **As a user**, I want to filter by location so I can find packages near me
5. **As a mobile user**, I want easy access to filters without cluttering the screen

---

## Component Architecture

### Component Hierarchy

```
FilterSystem
├── Desktop: FilterPanel (Sidebar)
│   ├── CategoryFilter
│   ├── PriceRangeSlider
│   ├── DateRangePicker
│   ├── LocationFilter
│   └── FilterActions (Apply/Clear)
│
└── Mobile: FilterDrawer (Bottom Sheet)
    ├── DrawerHeader (Title + Close)
    ├── FilterPanel (Same components)
    └── StickyFooter (Show Results Button)
```

### File Structure

```
src/components/search/
├── FilterPanel.tsx           # Main filter container
├── FilterDrawer.tsx          # Mobile bottom sheet
├── CategoryFilter.tsx        # Vertical category chips
├── PriceRangeSlider.tsx     # Price range component
├── DateRangePicker.tsx      # Date range selector
├── LocationFilter.tsx        # Location autocomplete
├── ActiveFilters.tsx         # Active filter chips
└── FilterActions.tsx         # Apply/Clear buttons
```

---

## Desktop Filter Panel

### Layout - Sidebar Design

```
┌─────────────────────────────────────────┐
│                                         │
│  FILTERS                    [Clear All] │
│  ═══════════════════════════════════    │
│                                         │
│  Categories ▼                           │
│  ┌───────────────────────────────────┐  │
│  │ ○ Events       ○ Cars            │  │
│  │ ○ Stays        ○ Marketplace     │  │
│  │ ○ Experiences  ○ Community       │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Price Range ▼                          │
│  ┌───────────────────────────────────┐  │
│  │ $0 ━━━●━━━━━━━━━━━●━━━ $10,000  │  │
│  │ Min: $500      Max: $5,000       │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Date Range ▼                           │
│  ┌───────────────────────────────────┐  │
│  │ From: Dec 1, 2025                │  │
│  │ To:   Dec 31, 2025               │  │
│  │      [Open Calendar]             │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Location ▼                             │
│  ┌───────────────────────────────────┐  │
│  │ [Search locations...]            │  │
│  │ ○ Lagos, Nigeria                 │  │
│  │ ○ Accra, Ghana                   │  │
│  │ ○ Nairobi, Kenya                 │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │      [Apply Filters (125)]       │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

### Desktop Specifications

**Dimensions:**
- Width: 280px fixed
- Position: Fixed left sidebar
- Padding: 24px
- Gap between sections: 24px

**Visual Style:**
- Background: `getThemedClasses.bgElevated`
- Border right: `getThemedClasses.borderPrimary`
- Border width: 1px
- Shadow: `shadows.sm`

**Sections:**
- Collapsible accordion sections
- Section headers: 16px semibold
- Section spacing: 24px vertical

---

## Mobile Filter Drawer

### Layout - Bottom Sheet Design

```
┌─────────────────────────────────────────┐
│          SEARCH RESULTS PAGE            │
│  ┌───────────────────────────────────┐  │
│  │   Package Card 1                  │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │   Package Card 2                  │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  [🔍 Filters (3)] [Sort ▼]       │  │ ← Filter Trigger
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘

When Filter Trigger Clicked:
┌─────────────────────────────────────────┐
│ ▒▒▒▒▒▒▒▒▒▒▒ OVERLAY ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │
│ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │
│ ┌───────────────────────────────────┐ ▒ │
│ │ ━━━━━━                           │ ▒ │ ← Drag Handle
│ │                                  │ ▒ │
│ │ Filters            [✕ Close]    │ ▒ │
│ │ ═══════════════════════════════  │ ▒ │
│ │                                  │ ▒ │
│ │ Categories ▼                     │ ▒ │
│ │ [Events] [Stays] [Experiences]   │ ▒ │
│ │ [Cars] [Marketplace] [Community] │ ▒ │
│ │                                  │ ▒ │
│ │ Price Range ▼                    │ ▒ │
│ │ $0 ━━━●━━━━━━━●━━━ $10,000     │ ▒ │
│ │                                  │ ▒ │
│ │ Date Range ▼                     │ ▒ │
│ │ Dec 1 - Dec 31, 2025             │ ▒ │
│ │                                  │ ▒ │
│ │ Location ▼                       │ ▒ │
│ │ [Search locations...]            │ ▒ │
│ │                                  │ ▒ │
│ │ ┌─────────────────────────────┐  │ ▒ │
│ │ │ Show Results (125)          │  │ ▒ │ ← Sticky Button
│ │ └─────────────────────────────┘  │ ▒ │
│ └───────────────────────────────────┘ ▒ │
└─────────────────────────────────────────┘
```

### Mobile Specifications

**Drawer Dimensions:**
- Height: 80vh (max)
- Min height: 400px
- Border radius: 24px 24px 0 0
- Background: `getThemedClasses.bgPrimary`
- Shadow: `shadows.xl`

**Drawer Header:**
- Height: 56px
- Drag handle: 4px × 40px, centered
- Padding: 16px

**Drawer Content:**
- Padding: 16px
- Max height: calc(80vh - 120px)
- Overflow: scroll

**Sticky Footer:**
- Height: 64px
- Padding: 12px 16px
- Background: `getThemedClasses.bgPrimary`
- Border top: 1px solid border
- Position: Sticky bottom

**Animations:**
- Slide up: 300ms ease-out
- Slide down: 250ms ease-in
- Overlay fade: 200ms

---

## Filter Components

### 1. CategoryFilter Component

**Design: Vertical-Themed Chips**

```
┌─────────────────────────────────────────┐
│ Categories                              │
│                                         │
│ [✓ Events]  [ Cars ]      [ Community] │
│            (Inactive)     (Inactive)    │
│ [✓ Stays]   [ Marketplace]             │
│            (Inactive)                   │
│ [ Experiences]                          │
│ (Inactive)                              │
└─────────────────────────────────────────┘

Active State:
Events: bg-[#E63946] text-white ✓
Stays: bg-[#2A9D8F] text-white ✓

Inactive State:
Cars: border-[#003566] text-primary
```

**Component Spec:**
```tsx
interface CategoryFilterProps {
  selected: Vertical[]
  onChange: (categories: Vertical[]) => void
  layout?: 'grid' | 'wrap'  // Desktop: grid, Mobile: wrap
}

// Visual
- Chip size: 'md' (min-h-[44px] for touch)
- Variant: Active = 'solid', Inactive = 'outline'
- Vertical theming: Use getThemedVerticalClasses()
- Icon: Vertical icon from icon system
- Grid: 2 columns on mobile, 3 on desktop
- Gap: 8px
```

---

### 2. PriceRangeSlider Component

**Design: Dual-Thumb Slider**

```
┌─────────────────────────────────────────┐
│ Price Range                             │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │ Min Price          Max Price      │   │
│ │ ┌──────────┐      ┌──────────┐    │   │
│ │ │  $500    │      │  $5,000  │    │   │
│ │ └──────────┘      └──────────┘    │   │
│ └───────────────────────────────────┘   │
│                                         │
│ $0   ━━━●━━━━━━━━━━━●━━━   $10,000   │
│      ^               ^                  │
│      Min            Max                 │
│                                         │
│ [ Any Price ] [ Under $1000 ]          │
│ [ $1000-$5000 ] [ Over $5000 ]         │
└─────────────────────────────────────────┘
```

**Component Spec:**
```tsx
interface PriceRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (range: [number, number]) => void
  currency?: string
  presets?: { label: string, range: [number, number] }[]
}

// Visual
- Slider track: 8px height
- Slider thumbs: 20px circle (touch: 44×44px tap area)
- Active track: brand gold
- Inactive track: neutral-200
- Input fields: Currency formatted
- Preset chips: Quick filter buttons
```

---

### 3. DateRangePicker Component

**Design: Calendar Picker**

```
Desktop:
┌─────────────────────────────────────────┐
│ Date Range                              │
│                                         │
│ ┌────────────┐  to  ┌────────────┐     │
│ │ Dec 1, 2025│      │ Dec 31, 2025│    │
│ └────────────┘      └────────────┘     │
│                                         │
│ [Open Calendar ▼]                       │
│                                         │
│ Quick Picks:                            │
│ [ This Week ] [ This Month ]            │
│ [ Next Week ] [ Custom ]                │
└─────────────────────────────────────────┘

Calendar Popover:
┌─────────────────────────────────────────┐
│       December 2025                     │
│ Su Mo Tu We Th Fr Sa                    │
│     1  2  3  4  5  6                    │
│  7  8  9 10 11 12 13                    │
│ 14 15 16 17 18 19 20                    │
│ 21 22 23 24 25 26 27                    │
│ 28 29 30 31                             │
│                                         │
│        [Clear]  [Apply]                 │
└─────────────────────────────────────────┘
```

**Component Spec:**
```tsx
interface DateRangePickerProps {
  value: { from: Date | null, to: Date | null }
  onChange: (range: { from: Date | null, to: Date | null }) => void
  presets?: { label: string, range: [Date, Date] }[]
  minDate?: Date
  maxDate?: Date
}

// Visual
- Use react-datepicker or similar
- Custom styling with design system
- Highlight selected range: brand gold
- Quick preset buttons
- Clear selection option
```

---

### 4. LocationFilter Component

**Design: Autocomplete Search**

```
┌─────────────────────────────────────────┐
│ Location                                │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │ 🔍 Search locations...           │   │
│ └───────────────────────────────────┘   │
│                                         │
│ Suggestions:                            │
│ ┌───────────────────────────────────┐   │
│ │ 📍 Lagos, Nigeria                │   │
│ │ 📍 Accra, Ghana                  │   │
│ │ 📍 Nairobi, Kenya                │   │
│ │ 📍 Cape Town, South Africa       │   │
│ └───────────────────────────────────┘   │
│                                         │
│ Selected:                               │
│ [Lagos ✕] [Accra ✕]                    │
└─────────────────────────────────────────┘
```

**Component Spec:**
```tsx
interface LocationFilterProps {
  selected: Location[]
  onChange: (locations: Location[]) => void
  onSearch: (query: string) => Promise<Location[]>
  multiple?: boolean
}

interface Location {
  id: string
  name: string
  country: string
  coordinates?: [number, number]
}

// Visual
- Autocomplete input with debounce (300ms)
- Dropdown with suggestions
- Selected locations as removable chips
- Map pin icon for each location
- Maximum 5 selections
```

---

### 5. ActiveFilters Component

**Design: Filter Chip Display**

```
Search Results (125)
┌─────────────────────────────────────────┐
│ Active Filters:                         │
│ [Events ✕] [Stays ✕] [$500-$5000 ✕]   │
│ [Dec 1-31 ✕] [Lagos ✕]  [Clear All]    │
└─────────────────────────────────────────┘
```

**Component Spec:**
```tsx
interface ActiveFiltersProps {
  filters: {
    categories?: Vertical[]
    priceRange?: [number, number]
    dateRange?: { from: Date, to: Date }
    locations?: Location[]
  }
  onRemove: (filterType: string, value?: any) => void
  onClearAll: () => void
}

// Visual
- Chips: size 'sm', variant 'solid'
- Vertical chips use vertical colors
- Remove icon: X icon (sm)
- Clear all: text button
- Wrap layout with gap
```

---

## Interaction Patterns

### Desktop Interactions

**Filter Application:**
1. User selects filters
2. "Apply Filters" button shows count (e.g., "Apply Filters (125)")
3. On click, filters are applied
4. Results update with loading state
5. Active filters shown above results

**Real-time vs Manual Apply:**
- Categories: Real-time (instant filter)
- Price/Date/Location: Manual apply (performance)
- User can toggle preference in settings

**Collapsible Sections:**
- Click section header to expand/collapse
- Chevron icon indicates state
- Smooth 200ms animation
- Remember state in localStorage

---

### Mobile Interactions

**Opening Filter Drawer:**
1. User taps "Filters (X)" button
2. Overlay fades in (200ms)
3. Drawer slides up from bottom (300ms)
4. Body scroll locked

**Closing Filter Drawer:**
- Tap overlay
- Tap close button
- Swipe down on drag handle
- Tap "Show Results" button (applies + closes)

**Drawer Gestures:**
- Swipe down: Close drawer
- Swipe up on handle: Open fully
- Tap drag handle: Toggle height

**Sticky Footer:**
- Always visible while scrolling filters
- Shows result count dynamically
- Primary CTA color (brand gold)

---

## Technical Specifications

### State Management

```tsx
interface FilterState {
  categories: Vertical[]
  priceRange: [number, number]
  dateRange: { from: Date | null, to: Date | null }
  locations: Location[]
  isOpen: boolean  // Mobile drawer
}

interface FilterActions {
  setCategories: (categories: Vertical[]) => void
  setPriceRange: (range: [number, number]) => void
  setDateRange: (range: { from: Date | null, to: Date | null }) => void
  setLocations: (locations: Location[]) => void
  clearFilters: () => void
  applyFilters: () => void
  toggleDrawer: () => void
}
```

### API Integration

**Filter Endpoint:**
```typescript
GET /api/search/packages?
  categories=events,stays
  &minPrice=500
  &maxPrice=5000
  &startDate=2025-12-01
  &endDate=2025-12-31
  &locations=lagos,accra
  &page=1
  &limit=20
```

**Response:**
```typescript
{
  results: Package[]
  totalCount: number
  filters: {
    categories: { value: string, count: number }[]
    priceRange: { min: number, max: number }
    locations: { id: string, name: string, count: number }[]
  }
}
```

---

## Accessibility

### WCAG 2.1 AA Compliance

**Keyboard Navigation:**
- Tab through all filter controls
- Enter/Space to toggle chips
- Arrow keys for slider
- Escape to close drawer/calendar

**Screen Reader Support:**
- Filter section labels: `<h3>` tags
- Chip roles: `role="checkbox"`
- Slider: `role="slider"` with aria-valuemin/max/now
- Drawer: `role="dialog"` with aria-modal

**Focus Management:**
- Trap focus in mobile drawer
- Return focus to trigger on close
- Visible focus indicators (brand gold ring)

**Color Contrast:**
- All text: ≥4.5:1 ratio
- Chip borders: ≥3:1 ratio
- Interactive elements clearly distinguishable

**Touch Targets:**
- Minimum 44×44px on all interactive elements
- Adequate spacing between targets (8px+)
- Larger targets for primary actions (48px+)

---

## Performance Considerations

### Optimization Strategies

**Debouncing:**
- Location search: 300ms debounce
- Price input changes: 500ms debounce
- Real-time filters: Debounced API calls

**Lazy Loading:**
- Date picker calendar: Load on open
- Location suggestions: Load on search
- Filter counts: Load async

**Caching:**
- Filter options cached (5 minutes)
- Location results cached by query
- Date presets calculated once

**Mobile Performance:**
- Drawer animation: GPU-accelerated transform
- List virtualization for many filters
- Optimized re-renders with React.memo

---

## Design System Usage

### Components from Design System

```tsx
// Buttons
import { getButtonClasses } from '@/lib/component-variants'

// Badges/Chips
import { getBadgeClasses } from '@/lib/component-variants'

// Inputs
import { getInputClasses } from '@/lib/component-variants'

// Responsive
import {
  responsiveSpacing,
  responsiveDisplay,
  touchFriendly
} from '@/lib/responsive-utilities'

// Dark Mode
import {
  getThemedClasses,
  getThemedVerticalClasses
} from '@/lib/dark-mode'

// Icons
import { getIconProps, iconSets } from '@/lib/icon-system'
import { Filter, X, ChevronDown, MapPin } from 'lucide-react'
```

### Color Usage

**Vertical Category Chips:**
- Events: `#E63946` (Afrobeat Red)
- Stays: `#2A9D8F` (Coastal Emerald)
- Experiences: `#FB8500` (Festival Orange)
- Cars: `#003566` (Atlantic Blue)
- Marketplace: `#7209B7` (Highlife Purple)
- Community: `#FFD60A` (Danfo Yellow)

**Neutral Elements:**
- Price slider: Brand gold (`#FFB700`)
- Apply button: Brand gold (`#FFB700`)
- Clear button: Neutral outline
- Borders: `getThemedClasses.borderPrimary`

---

## Testing Checklist

### Functional Testing
- [ ] Category filters toggle correctly
- [ ] Price range updates correctly
- [ ] Date range selects correctly
- [ ] Location search works
- [ ] Active filters display correctly
- [ ] Clear all removes all filters
- [ ] Apply filters triggers API call
- [ ] Filter counts update

### Mobile Testing
- [ ] Drawer opens smoothly
- [ ] Drawer closes on overlay tap
- [ ] Swipe gestures work
- [ ] Sticky footer stays visible
- [ ] Touch targets are adequate
- [ ] Works on iOS Safari
- [ ] Works on Android Chrome

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Focus management works
- [ ] Color contrast passes
- [ ] ARIA labels present
- [ ] Lighthouse accessibility: 100

### Performance Testing
- [ ] Drawer animation smooth (60fps)
- [ ] API calls debounced
- [ ] No unnecessary re-renders
- [ ] Mobile performance good
- [ ] Works on slow connections

---

**Status:** 🎨 **DESIGN SPECIFICATION COMPLETE**

This specification provides complete guidance for implementing the Filter UI system in Sprint 2. All components use the design system built in Sprint 0, ensuring consistency and accessibility.

**Next Steps:**
1. Review with Neriah (Frontend Lead)
2. Confirm with Nesiah (Backend - Filter API)
3. Begin component implementation
4. Iterate based on feedback

**Design System & UI/UX - Dev 7 (TOBI)** 🎨✨
