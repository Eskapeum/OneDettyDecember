# Sprint 3: Booking Component Specifications

**Developer:** Dev 7 (TOBI) - Design System & UI/UX Lead
**Sprint:** 3 of 13
**Focus:** Date Picker & Guest Selector Components
**Date:** November 18, 2025

---

## 🎯 Component Overview

This document specifies the two critical booking components for Sprint 3:
1. **DateRangePicker** - Date selection with availability checking
2. **GuestSelector** - Guest count management with category support

Both components are mobile-first, accessible, and integrate with the OneDettyDecember design system.

---

## 📅 DateRangePicker Component

### Purpose
Allow users to select check-in and check-out dates (or event dates) with real-time availability checking and pricing updates.

### Component Architecture

```
DateRangePicker
├── CalendarHeader (Month navigation)
├── QuickPicks (Preset date ranges)
├── CalendarGrid (Date cells)
├── AvailabilityIndicators (Visual availability)
├── PriceTooltips (Pricing per night)
└── MobileDrawer (Bottom sheet on mobile)
```

### Desktop Layout (Wireframe)

```
┌─────────────────────────────────────────────────────┐
│  Select Dates                                    ✕  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ This Wknd│  │ Next Week│  │ New Year │         │
│  └──────────┘  └──────────┘  └──────────┘         │
│                                                     │
│  ┌──────────────────────┬──────────────────────┐  │
│  │   December 2025      │   January 2026       │  │
│  │  ◀    ─────    ▶     │  ◀    ─────    ▶     │  │
│  │                      │                      │  │
│  │  Su Mo Tu We Th Fr Sa│  Su Mo Tu We Th Fr Sa│  │
│  │   1  2  3  4  5  6  7│            1  2  3  4│  │
│  │   8  9 10 11 12 13 14│   5  6  7  8  9 10 11│  │
│  │  15 16 17●18●19●20 21│  12 13 14 15 16 17 18│  │
│  │  22 23 24 25 26 27 28│  19 20 21 22 23 24 25│  │
│  │  29 30 31            │  26 27 28 29 30 31   │  │
│  │                      │                      │  │
│  │  ● = Selected        │  ○ = Available       │  │
│  │  ✕ = Unavailable     │  ─ = Range           │  │
│  └──────────────────────┴──────────────────────┘  │
│                                                     │
│  Check-in: Dec 17, 2025    →    Check-out: Dec 20  │
│  3 nights × ₦45,000/night = ₦135,000               │
│                                                     │
│  [Clear]                      [Apply Dates]        │
└─────────────────────────────────────────────────────┘
```

### Mobile Layout (Wireframe)

```
State 1: Collapsed Input
┌─────────────────────────┐
│  Dates                  │
│  ┌────────────────────┐ │
│  │ Dec 17 → Dec 20    │ │ ← Tap to open drawer
│  │ 3 nights           │ │
│  └────────────────────┘ │
└─────────────────────────┘

State 2: Expanded Drawer (Bottom Sheet)
┌─────────────────────────┐
│  Search Results         │
│  (dimmed overlay)       │
├─────────────────────────┤
│  ━━━━                   │ ← Drag handle
│  Select Dates        ✕  │
│  ─────────────────────  │
│  ┌────┐ ┌────┐ ┌────┐  │
│  │Wknd│ │Week│ │NYE │  │
│  └────┘ └────┘ └────┘  │
│                         │
│    December 2025        │
│   ◀   ─────────   ▶    │
│                         │
│  Su Mo Tu We Th Fr Sa   │
│   1  2  3  4  5  6  7   │
│   8  9 10 11 12 13 14   │
│  15 16 17●18●19●20 21   │ ← Swipe to scroll
│  22 23 24 25 26 27 28   │
│  29 30 31               │
│                         │
│  3 nights · ₦135,000    │
│                         │
│  [Apply Dates]          │
└─────────────────────────┘
```

### Component Props

```typescript
interface DateRangePickerProps {
  // Selection
  startDate: Date | null
  endDate: Date | null
  onChange: (start: Date | null, end: Date | null) => void

  // Availability
  availabilityData?: {
    date: Date
    available: boolean
    price?: number
    minStay?: number
  }[]
  onDateHover?: (date: Date) => void // For price tooltips

  // Constraints
  minDate?: Date // Default: today
  maxDate?: Date // Default: 1 year ahead
  minStay?: number // Minimum nights required
  maxStay?: number // Maximum nights allowed
  blockedDates?: Date[] // Fully unavailable dates

  // UI Options
  mode?: 'range' | 'single' // Default: 'range'
  numberOfMonths?: number // Desktop: 2, Mobile: 1
  showPricing?: boolean // Show price per night
  showQuickPicks?: boolean // Show preset ranges
  quickPicks?: QuickPickOption[]

  // Responsive
  isMobile?: boolean // Auto-detected
  drawerMode?: boolean // Use bottom sheet on mobile

  // Styling
  vertical?: Vertical // Theme color
  className?: string

  // Callbacks
  onApply?: (start: Date, end: Date) => void
  onClear?: () => void
  onClose?: () => void
}

interface QuickPickOption {
  label: string
  startDate: Date
  endDate: Date
  icon?: string
}
```

### States & Interactions

**1. Default State (No Selection)**
```
┌──────────────┐
│ Select dates │ ← Placeholder text
└──────────────┘
```

**2. Selecting Start Date**
```
Calendar shows:
- Current date highlighted
- Future dates available
- Past dates disabled
- Hover effect on available dates
```

**3. Selecting End Date (After Start)**
```
Calendar shows:
- Start date marked with solid circle ●
- Hovered date creates range preview (dotted line)
- Invalid dates disabled (< minStay, > maxStay)
- Blocked dates shown as unavailable
```

**4. Range Selected**
```
Calendar shows:
- Start date: Solid circle ●
- End date: Solid circle ●
- Range between: Connected line ─
- Nights count displayed
- Total price calculated
```

**5. Hover State (Desktop)**
```
Date cell:
- Slight scale up (1.05)
- Shadow effect
- Price tooltip appears above cell
- Available: Green border
- Unavailable: Red border with disabled cursor
```

**6. Mobile Touch State**
```
Date cell:
- Active: Scale down (0.95)
- Selected: Solid background color
- Haptic feedback on selection
- Bottom sheet slides up smoothly
```

### Availability Indicators

```css
/* Visual Legend */
.date-available {
  /* Green dot in corner */
  &::after {
    content: '';
    width: 6px;
    height: 6px;
    background: emerald-500;
    border-radius: 50%;
    position: absolute;
    top: 4px;
    right: 4px;
  }
}

.date-limited {
  /* Yellow dot (few slots left) */
  &::after {
    background: amber-500;
  }
}

.date-unavailable {
  /* Red X or disabled */
  opacity: 0.3;
  cursor: not-allowed;
  text-decoration: line-through;
}

.date-selected-start,
.date-selected-end {
  /* Solid circle background */
  background: vertical-color;
  color: white;
  border-radius: 50%;
}

.date-in-range {
  /* Light background for range */
  background: vertical-color-10%; /* 10% opacity */
  border-radius: 0;
}
```

### Price Tooltip

```
Desktop hover:
┌─────────────┐
│ ₦45,000     │ ← Tooltip above date
│  /night     │
└──────┬──────┘
       │
   ┌───┴───┐
   │  17   │ ← Date cell
   └───────┘

Mobile tap:
Sheet at bottom shows total:
┌─────────────────────┐
│ 3 nights × ₦45,000  │
│ Total: ₦135,000     │
└─────────────────────┘
```

### Quick Pick Presets

```typescript
const DEFAULT_QUICK_PICKS: QuickPickOption[] = [
  {
    label: 'This Weekend',
    startDate: getNextFriday(),
    endDate: getNextSunday(),
    icon: 'calendar-days'
  },
  {
    label: 'Next Week',
    startDate: addDays(getNextMonday(), 7),
    endDate: addDays(getNextFriday(), 7),
    icon: 'calendar-range'
  },
  {
    label: 'New Year',
    startDate: new Date(2025, 11, 31),
    endDate: new Date(2026, 0, 2),
    icon: 'sparkles'
  },
  {
    label: 'Detty December',
    startDate: new Date(2025, 11, 1),
    endDate: new Date(2025, 11, 31),
    icon: 'party-popper'
  }
]
```

### Accessibility

**ARIA Labels:**
```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="date-picker-title"
  aria-describedby="date-picker-description"
>
  <h2 id="date-picker-title">Select Dates</h2>
  <p id="date-picker-description" className="sr-only">
    Choose your check-in and check-out dates. Use arrow keys to navigate.
  </p>

  <div
    role="grid"
    aria-label="Calendar"
    aria-readonly="false"
  >
    <button
      role="gridcell"
      aria-label="December 17, 2025, Available, ₦45,000 per night"
      aria-selected={isSelected}
      aria-disabled={!isAvailable}
      tabIndex={isSelectable ? 0 : -1}
    >
      17
    </button>
  </div>
</div>
```

**Keyboard Navigation:**
- `Arrow keys`: Navigate between dates
- `Enter/Space`: Select date
- `Escape`: Close picker
- `Tab`: Navigate between months, quick picks, actions
- `PageUp/PageDown`: Navigate months

**Screen Reader Announcements:**
```tsx
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {selectedStart && selectedEnd && (
    `Selected ${formatDateRange(selectedStart, selectedEnd)},
     ${getNights(selectedStart, selectedEnd)} nights,
     Total ${formatPrice(totalPrice)}`
  )}
</div>
```

---

## 👥 GuestSelector Component

### Purpose
Allow users to specify the number of guests across different categories (adults, children, infants) with package capacity validation.

### Component Architecture

```
GuestSelector
├── GuestCategory (Adults)
├── GuestCategory (Children)
├── GuestCategory (Infants)
├── TotalDisplay (Guest summary)
└── CapacityIndicator (Remaining capacity)
```

### Desktop Layout (Wireframe)

```
┌─────────────────────────────────────┐
│  Guests                          ✕  │
├─────────────────────────────────────┤
│                                     │
│  Adults                             │
│  Age 18+                            │
│  ┌───┐   ┌───┐   ┌───┐             │
│  │ - │   │ 2 │   │ + │             │
│  └───┘   └───┘   └───┘             │
│                                     │
│  Children                           │
│  Age 2-17                           │
│  ┌───┐   ┌───┐   ┌───┐             │
│  │ - │   │ 1 │   │ + │             │
│  └───┘   └───┘   └───┘             │
│                                     │
│  Infants                            │
│  Under 2                            │
│  ┌───┐   ┌───┐   ┌───┐             │
│  │ - │   │ 0 │   │ + │             │
│  └───┘   └───┘   └───┘             │
│                                     │
│  ─────────────────────────────────  │
│  Total: 3 guests                    │
│  Capacity: 3 of 6 used              │
│                                     │
│  [Clear]              [Apply]       │
└─────────────────────────────────────┘
```

### Mobile Layout (Wireframe)

```
State 1: Collapsed Input
┌─────────────────────────┐
│  Guests                 │
│  ┌────────────────────┐ │
│  │ 3 guests           │ │ ← Tap to open drawer
│  │ 2 adults, 1 child  │ │
│  └────────────────────┘ │
└─────────────────────────┘

State 2: Expanded Drawer (Bottom Sheet)
┌─────────────────────────┐
│  Package Details        │
│  (dimmed overlay)       │
├─────────────────────────┤
│  ━━━━                   │ ← Drag handle
│  Guests              ✕  │
│  ─────────────────────  │
│                         │
│  Adults  (Age 18+)      │
│  ┌────┐ ┌───┐ ┌────┐   │
│  │ −  │ │ 2 │ │ +  │   │ ← 44×44px touch targets
│  └────┘ └───┘ └────┘   │
│                         │
│  Children  (Age 2-17)   │
│  ┌────┐ ┌───┐ ┌────┐   │
│  │ −  │ │ 1 │ │ +  │   │
│  └────┘ └───┘ └────┘   │
│                         │
│  Infants  (Under 2)     │
│  ┌────┐ ┌───┐ ┌────┐   │
│  │ −  │ │ 0 │ │ +  │   │
│  └────┘ └───┘ └────┘   │
│                         │
│  ─────────────────────  │
│  Total: 3 guests        │
│  3 of 6 capacity used   │
│                         │
│  [Apply]                │
└─────────────────────────┘
```

### Component Props

```typescript
interface GuestSelectorProps {
  // Guest counts
  adults: number
  children: number
  infants: number
  onChange: (guests: GuestCounts) => void

  // Constraints
  minAdults?: number // Default: 1
  maxAdults?: number // From package capacity
  maxChildren?: number // From package capacity
  maxInfants?: number // From package capacity
  maxTotal?: number // Total capacity

  // Package rules
  requireAdult?: boolean // Default: true (need adult with children)
  infantsCountTowardCapacity?: boolean // Default: false

  // UI Options
  showLabels?: boolean // Show age descriptions
  showTotal?: boolean // Show total guest count
  showCapacity?: boolean // Show remaining capacity
  compactMode?: boolean // Condensed layout

  // Responsive
  isMobile?: boolean
  drawerMode?: boolean

  // Styling
  vertical?: Vertical
  className?: string

  // Callbacks
  onApply?: (guests: GuestCounts) => void
  onClear?: () => void
  onCapacityReached?: () => void
}

interface GuestCounts {
  adults: number
  children: number
  infants: number
}
```

### States & Interactions

**1. Default State**
```
Adults: 2 (minimum 1)
Children: 0
Infants: 0
Total: 2 guests
```

**2. Increment/Decrement Behavior**

```typescript
// Increment logic
const handleIncrement = (category: 'adults' | 'children' | 'infants') => {
  const current = guests[category]
  const total = getTotalGuests(guests, !infantsCountTowardCapacity)

  // Check capacity
  if (total >= maxTotal) {
    showCapacityError()
    return
  }

  // Check category limit
  if (current >= maxByCategory[category]) {
    showCategoryLimitError()
    return
  }

  // Update count with haptic feedback
  onChange({ ...guests, [category]: current + 1 })
  triggerHaptic('light')
}

// Decrement logic
const handleDecrement = (category: 'adults' | 'children' | 'infants') => {
  const current = guests[category]

  // Prevent going below minimum
  if (category === 'adults' && current <= minAdults) {
    return
  }

  if (current <= 0) {
    return
  }

  // Prevent leaving children without adults
  if (category === 'adults' && requireAdult) {
    const hasChildren = guests.children > 0
    if (hasChildren && current <= 1) {
      showAdultRequiredError()
      return
    }
  }

  onChange({ ...guests, [category]: current - 1 })
  triggerHaptic('light')
}
```

**3. Button States**

```css
/* Increment button */
.guest-increment {
  /* Enabled */
  &:not(:disabled) {
    background: vertical-color;
    color: white;
    cursor: pointer;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 2px 8px rgba(vertical-color, 0.3);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  /* Disabled (at limit) */
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    background: neutral-200;
  }
}

/* Decrement button */
.guest-decrement {
  /* Enabled */
  &:not(:disabled) {
    border: 2px solid vertical-color;
    color: vertical-color;
    background: transparent;

    &:hover {
      background: vertical-color-10%;
    }
  }

  /* Disabled (at minimum) */
  &:disabled {
    opacity: 0.3;
    border-color: neutral-300;
    color: neutral-400;
  }
}
```

**4. Capacity Indicator**

```
Normal:
┌─────────────────────┐
│ 3 of 6 guests       │
│ ██████░░░░░░        │ ← Progress bar (50%)
└─────────────────────┘

Near Capacity (80%+):
┌─────────────────────┐
│ 5 of 6 guests       │
│ ██████████░░        │ ← Amber warning
│ ⚠ 1 spot left       │
└─────────────────────┘

At Capacity:
┌─────────────────────┐
│ 6 of 6 guests       │
│ ████████████        │ ← Red (full)
│ 🔴 Fully booked     │
└─────────────────────┘
```

### Validation Messages

```typescript
const VALIDATION_MESSAGES = {
  minAdults: 'At least 1 adult required',
  maxCapacity: 'Package capacity reached',
  adultRequired: 'Children require at least 1 adult',
  categoryLimit: (category: string, max: number) =>
    `Maximum ${max} ${category} allowed`,
}
```

### Guest Summary Display

```tsx
// Compact format
<span className="guest-summary">
  {adults + children + infants} guests
</span>

// Detailed format
<div className="guest-summary-detailed">
  <span className="total">{adults + children + infants} guests</span>
  <span className="breakdown">
    {adults > 0 && `${adults} adult${adults > 1 ? 's' : ''}`}
    {children > 0 && `, ${children} child${children > 1 ? 'ren' : ''}`}
    {infants > 0 && `, ${infants} infant${infants > 1 ? 's' : ''}`}
  </span>
</div>
```

### Accessibility

**ARIA Labels:**
```tsx
<div role="group" aria-labelledby="guest-selector-title">
  <h3 id="guest-selector-title">Guest Selection</h3>

  <div className="guest-category">
    <label id="adults-label">Adults (Age 18+)</label>
    <div role="group" aria-labelledby="adults-label">
      <button
        aria-label="Decrease adults"
        aria-controls="adults-count"
        disabled={adults <= minAdults}
        onClick={() => handleDecrement('adults')}
      >
        −
      </button>

      <span
        id="adults-count"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {adults}
      </span>

      <button
        aria-label="Increase adults"
        aria-controls="adults-count"
        disabled={adults >= maxAdults || totalAtCapacity}
        onClick={() => handleIncrement('adults')}
      >
        +
      </button>
    </div>
  </div>

  <div
    role="status"
    aria-live="polite"
    aria-atomic="true"
    className="sr-only"
  >
    {getTotalGuests()} guests selected.
    {maxTotal - getTotalGuests()} spots remaining.
  </div>
</div>
```

**Keyboard Navigation:**
- `Tab`: Navigate between categories and buttons
- `Enter/Space`: Activate increment/decrement
- `Arrow Up/Down`: Increment/decrement (when focused on count)
- `Escape`: Close drawer

---

## 🎨 Design System Integration

### Using Design Tokens

```tsx
import { colors, spacing, borderRadius, shadows } from '@/lib/design-tokens'
import { getVerticalColor, getVerticalClasses } from '@/lib/vertical-theme'
import { getButtonClasses } from '@/lib/component-variants'
import { responsiveSpacing, touchFriendly } from '@/lib/responsive-utilities'

// Date cell styling
const dateCellClasses = classNames(
  touchFriendly.minTouchTarget, // 44×44px minimum
  'rounded-full',
  'transition-all duration-200',
  isSelected && getVerticalClasses(vertical, 'bg'),
  isInRange && 'bg-opacity-10',
  !isAvailable && 'opacity-30 cursor-not-allowed'
)

// Guest selector button
const incrementButton = getButtonClasses({
  size: 'md',
  variant: 'solid',
  vertical,
  radius: 'lg'
})
```

### Vertical Theming

```tsx
// Date picker themed by package vertical
<DateRangePicker
  vertical="events" // Afrobeat Red theme
  {...props}
/>

<DateRangePicker
  vertical="stays" // Coastal Emerald theme
  {...props}
/>

// Guest selector matches
<GuestSelector
  vertical="events" // Same theme
  {...props}
/>
```

---

## 📱 Mobile Optimization

### Touch Targets
All interactive elements meet WCAG 2.1 AA guidelines:
- Date cells: 44×44px minimum
- Increment/decrement buttons: 44×44px
- Quick pick chips: 44px height minimum
- Drawer drag handle: 44px tap area

### Bottom Sheet Behavior

```tsx
import BottomSheet from 'react-spring-bottom-sheet'

<BottomSheet
  open={isOpen}
  onDismiss={onClose}
  defaultSnap={({ maxHeight }) => maxHeight * 0.6}
  snapPoints={({ maxHeight }) => [
    maxHeight * 0.6, // Default (60%)
    maxHeight * 0.9  // Expanded (90%)
  ]}
  header={
    <div className="flex items-center justify-between p-4">
      <h2 className="font-semibold">Select Dates</h2>
      <button onClick={onClose}>✕</button>
    </div>
  }
>
  <CalendarGrid {...props} />
</BottomSheet>
```

### Gesture Support
- **Swipe down**: Close drawer
- **Swipe up**: Expand drawer
- **Swipe left/right**: Navigate months (calendar)
- **Tap**: Select date or adjust guest count
- **Long press**: Show price tooltip (calendar)

---

## ⚡ Performance Considerations

### Lazy Loading
```tsx
// Load calendar only when needed
const DateRangePicker = lazy(() => import('./DateRangePicker'))

// In parent component
<Suspense fallback={<DatePickerSkeleton />}>
  {showDatePicker && <DateRangePicker {...props} />}
</Suspense>
```

### Memoization
```tsx
// Memoize expensive calculations
const availableDates = useMemo(() => {
  return calculateAvailability(availabilityData, blockedDates)
}, [availabilityData, blockedDates])

// Memoize date formatting
const formattedDates = useMemo(() => {
  return formatDateRange(startDate, endDate)
}, [startDate, endDate])
```

### Debouncing
```tsx
// Debounce availability checks on hover
const debouncedFetchPrice = useMemo(
  () => debounce((date: Date) => {
    fetchDatePrice(date)
  }, 300),
  []
)
```

---

## 🧪 Testing Checklist

### DateRangePicker
- [ ] Can select start and end dates
- [ ] Range highlights correctly
- [ ] Blocked dates are disabled
- [ ] Min/max stay validation works
- [ ] Quick picks populate correctly
- [ ] Price calculation is accurate
- [ ] Mobile drawer opens/closes smoothly
- [ ] Keyboard navigation works
- [ ] Screen reader announces selections
- [ ] Touch targets are adequate (44×44px)
- [ ] Works in dark mode
- [ ] Vertical theming applies correctly

### GuestSelector
- [ ] Can increment/decrement each category
- [ ] Minimum adult count enforced
- [ ] Maximum capacity enforced
- [ ] Adult required with children validation
- [ ] Capacity indicator updates
- [ ] Summary displays correctly
- [ ] Buttons disable at limits
- [ ] Mobile drawer works
- [ ] Keyboard navigation works
- [ ] Screen reader announces counts
- [ ] Touch targets adequate
- [ ] Haptic feedback on mobile

---

**Status:** 📐 **COMPONENT SPECS COMPLETE**

These specifications provide the foundation for implementing the date picker and guest selector components in Sprint 3.

**Next:** Create mobile UX patterns and implementation guides!

**Design System & UI/UX - Dev 7 (TOBI)** 📅👥✨
