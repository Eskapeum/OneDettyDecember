# Sprint 3: Mobile Booking Flow UX

**Developer:** Dev 7 (TOBI) - Design System & UI/UX Lead
**Sprint:** 3 of 13
**Focus:** Mobile-First Booking Experience
**Date:** November 18, 2025

---

## 📱 Mobile-First Philosophy

The booking flow is the critical conversion path for OneDettyDecember. Every interaction must be smooth, intuitive, and optimized for mobile devices where most bookings will occur.

### Mobile Context
- **Primary Device:** Mobile phones (375px - 428px width)
- **User Intent:** High purchase intent, quick decisions
- **Connection:** Variable (3G/4G, WiFi)
- **Environment:** On-the-go, possibly distracted
- **Friction Points:** Form filling, date selection, payment anxiety

---

## 🎯 Booking Flow Overview

### User Journey

```
1. Browse/Search
   ↓
2. View Package Details ← You are here
   ↓
3. Select Dates (DateRangePicker)
   ↓
4. Select Guests (GuestSelector)
   ↓
5. Review & Confirm
   ↓
6. Payment (Sprint 4)
   ↓
7. Confirmation
```

### Flow Principles

**Progressive Disclosure:**
- Show only what's needed at each step
- Minimize cognitive load
- Clear progress indicators

**Immediate Feedback:**
- Real-time validation
- Live price updates
- Availability checking
- Error prevention

**Reversibility:**
- Easy to go back
- Save progress
- Clear reset/cancel options

---

## 📐 Package Detail Page Layout

### Mobile Wireframe

```
┌─────────────────────────┐
│ ◀ Back     🔗 Share  ❤️ │ ← Sticky header
├─────────────────────────┤
│                         │
│   [Hero Image]          │ ← Full-width, 60vh
│   • • • • •             │ ← Image indicators
│                         │
├─────────────────────────┤
│ Luxury Lagos Villa      │ ← Title
│ ⭐️ 4.8 (124 reviews)    │
│ 📍 Victoria Island      │
│                         │
│ ₦450,000 / night        │ ← Price (sticky on scroll)
│ ─────────────────────   │
│                         │
│ 🏠 2 Bedrooms           │
│ 🚿 2 Bathrooms          │ ← Quick specs
│ 👥 6 Guests             │
│ 📶 WiFi                 │
│                         │
│ ─────────────────────   │
│                         │
│ Description             │
│ Experience luxury...    │ ← Expandable
│ [Read more]             │
│                         │
│ ─────────────────────   │
│                         │
│ Amenities               │
│ ✓ Pool  ✓ Gym          │
│ ✓ WiFi  ✓ Parking      │ ← Grid layout
│ [+12 more]              │
│                         │
│ ─────────────────────   │
│                         │
│ Reviews (124)           │
│ ┌─────────────────────┐ │
│ │ ⭐️⭐️⭐️⭐️⭐️             │ │
│ │ "Amazing place!"    │ │ ← Review cards
│ │ - Sarah K.          │ │
│ └─────────────────────┘ │
│ [Show all reviews]      │
│                         │
│ ─────────────────────   │
│                         │
│ Location                │
│ [Map Preview]           │
│ Victoria Island, Lagos  │
│                         │
│ ─────────────────────   │
│                         │
│ Cancellation Policy     │
│ Free until 48hrs...     │
│                         │
│ ─────────────────────   │
│                         │
│ [Empty space for CTA]   │ ← Bottom padding
│                         │
├─────────────────────────┤
│ ₦450,000 / night        │ ← Sticky footer
│ [Select Dates]          │ ← Primary CTA
└─────────────────────────┘
```

### Sticky Elements

**Header (Top):**
```
┌─────────────────────────┐
│ ◀ Back     🔗 Share  ❤️ │ ← Always visible
└─────────────────────────┘
```

**Booking Bar (Bottom):**
```
┌─────────────────────────┐
│ ₦450,000 / night        │
│ [Select Dates]          │ ← Sticky CTA
└─────────────────────────┘

After dates selected:
┌─────────────────────────┐
│ ₦1,350,000 · 3 nights   │
│ [Reserve]               │ ← Updated pricing
└─────────────────────────┘
```

### Image Gallery Pattern

```
Full-Screen Carousel:
┌─────────────────────────┐
│ ✕                       │ ← Close button
│                         │
│                         │
│    [Full Image]         │ ← Swipeable
│                         │
│                         │
│  • • • • •  3/5         │ ← Indicators + count
└─────────────────────────┘

Interactions:
- Swipe left/right: Navigate images
- Pinch: Zoom in/out
- Double tap: Toggle zoom
- Tap outside: Close gallery
```

---

## 📅 Date Selection Flow

### Entry Point (Sticky CTA)

```
Initial State:
┌─────────────────────────┐
│ ₦450,000 / night        │
│ ┌─────────────────────┐ │
│ │  Select Dates       │ │ ← Tap to open
│ └─────────────────────┘ │
└─────────────────────────┘
```

### Bottom Sheet Drawer

```
State 1: Half-Open (Default)
┌─────────────────────────┐
│  Package Details        │
│  (dimmed 60%)           │
├─────────────────────────┤
│  ━━━━                   │ ← Drag handle
│  Select Dates        ✕  │
│  ─────────────────────  │
│  ┌────┐ ┌────┐ ┌────┐  │
│  │Wknd│ │Week│ │NYE │  │ ← Quick picks
│  └────┘ └────┘ └────┘  │
│                         │
│   December 2025         │
│  ◀   ─────────   ▶     │ ← Month nav
│                         │
│  Su Mo Tu We Th Fr Sa   │
│   1  2  3  4  5  6  7   │
│   8  9 10 11 12 13 14   │ ← 50% screen
│  15 16 17 18 19 20 21   │
│  22 23 24 25 26 27 28   │
│                         │
│  [Clear]    [Apply]     │
└─────────────────────────┘

State 2: Fully-Open (On scroll/swipe)
┌─────────────────────────┐
│  ━━━━                   │
│  Select Dates        ✕  │
│  ─────────────────────  │
│  ┌────┐ ┌────┐ ┌────┐  │
│  │Wknd│ │Week│ │NYE │  │
│  └────┘ └────┘ └────┘  │
│                         │
│   December 2025         │
│  ◀   ─────────   ▶     │
│                         │
│  Su Mo Tu We Th Fr Sa   │
│   1  2  3  4  5  6  7   │
│   8  9 10 11 12 13 14   │
│  15 16 17●18●19●20 21   │ ← 80% screen
│  22 23 24 25 26 27 28   │
│  29 30 31               │
│                         │
│   January 2026          │
│  ◀   ─────────   ▶     │
│                         │
│  Su Mo Tu We Th Fr Sa   │ ← Multiple months
│   1  2  3  4            │
│   5  6  7  8  9 10 11   │
│                         │
│  3 nights · ₦1,350,000  │
│  [Apply Dates]          │
└─────────────────────────┘
```

### Date Selection Animation

```
Step 1: Tap Start Date
┌─────────────────────────┐
│  15 16 17●18 19 20 21   │ ← 17 selected (solid)
└─────────────────────────┘
Animation: Scale 1→1.2→1, Haptic feedback

Step 2: Hover/Preview End Date
┌─────────────────────────┐
│  15 16 17●18 19●20 21   │ ← 17-19 range preview
│         └─────┘         │ ← Dotted connection
└─────────────────────────┘
Animation: Preview line fades in 200ms

Step 3: Tap End Date
┌─────────────────────────┐
│  15 16 17●18●19●20 21   │ ← 17-20 confirmed
│         └─────┘         │ ← Solid connection
│                         │
│  3 nights · ₦1,350,000  │ ← Price updates
└─────────────────────────┘
Animation:
- End date scales
- Range fills in (200ms ease-out)
- Price counter animates
- Haptic feedback (medium)
```

### Availability Indicators

```
Visual States:
┌───┐ ┌───┐ ┌───┐ ┌───┐
│ 1 │ │ 2 │ │ 3•│ │ 4✕│
└───┘ └───┘ └───┘ └───┘
  ↑     ↑     ↑     ↑
  │     │     │     └─ Unavailable (disabled)
  │     │     └─────── Limited (yellow dot)
  │     └───────────── Available (no indicator)
  └─────────────────── Selected (solid bg)

Price on Hover/Tap:
┌─────────────┐
│  ₦450,000   │ ← Tooltip
│   /night    │
└──────┬──────┘
       │
   ┌───┴───┐
   │  17   │ ← Date cell
   └───────┘
```

### Gesture Interactions

**Calendar Navigation:**
- **Swipe left:** Next month (300ms slide)
- **Swipe right:** Previous month (300ms slide)
- **Swipe down (on handle):** Close drawer (250ms)
- **Swipe up:** Expand drawer (200ms)

**Date Selection:**
- **Tap:** Select date (100ms scale, haptic)
- **Long press:** Show price tooltip (vibrate + tooltip)
- **Double tap:** Deselect (if already selected)

---

## 👥 Guest Selection Flow

### Entry Point (After Dates)

```
Updated CTA after dates:
┌─────────────────────────┐
│ ₦1,350,000 · 3 nights   │
│ ┌─────────────────────┐ │
│ │ Add Guests          │ │ ← Tap to open
│ └─────────────────────┘ │
└─────────────────────────┘
```

### Bottom Sheet Layout

```
┌─────────────────────────┐
│  ━━━━                   │
│  Guests              ✕  │
│  ─────────────────────  │
│                         │
│  Adults  (Age 18+)      │
│  ┌────┐ ┌───┐ ┌────┐   │
│  │ −  │ │ 2 │ │ +  │   │ ← 44×44px buttons
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
│                         │
│  Total: 3 guests        │
│  Capacity: 3/6 used     │
│  ████████░░░░           │ ← Progress bar
│                         │
│  [Clear]    [Apply]     │
└─────────────────────────┘
```

### Button States & Animations

```
Increment Animation:
┌────┐      ┌────┐      ┌────┐
│ 2  │  →   │2→3 │  →   │ 3  │
└────┘      └────┘      └────┘
  ↓           ↓           ↓
Tap      Scale 0.95   Haptic + Update
         50ms         Number++

Disabled State (At Max):
┌────┐
│ +  │ ← Opacity 0.3, no cursor
└────┘
Tap → Shake animation (no action)

Near Capacity Warning:
┌─────────────────────────┐
│  Capacity: 5/6 used     │
│  ██████████░░           │ ← Amber
│  ⚠ 1 spot remaining     │
└─────────────────────────┘

At Capacity:
┌─────────────────────────┐
│  Capacity: 6/6 used     │
│  ████████████           │ ← Red
│  🔴 Fully booked        │
└─────────────────────────┘
```

### Validation Feedback

```
Error: Remove adult with children
┌─────────────────────────┐
│  Adults  (Age 18+)      │
│  ┌────┐ ┌───┐ ┌────┐   │
│  │ −  │ │ 1 │ │ +  │   │ ← Shake animation
│  └────┘ └───┘ └────┘   │
│                         │
│  ⚠ At least 1 adult     │ ← Error message
│    required with kids   │
└─────────────────────────┘
Animation: Buttons shake (400ms), error fades in
```

---

## 🎨 Animation Specifications

### Micro-Syntax Reference

```
# Date Selection
dateTap: 100ms ease-out [S1→1.2→1] + haptic(light)
rangePreview: 200ms ease-out [α0→0.5, bg→accent]
rangeConfirm: 200ms ease-out [α0.5→1, bg→solid] + haptic(medium)
priceUpdate: 300ms ease-out [countUp animation]

# Guest Counter
increment: 50ms [S1→0.95] + 100ms [number++] + haptic(light)
decrement: 50ms [S1→0.95] + 100ms [number--] + haptic(light)
disabled: 400ms [X±5] shake + haptic(warning)
capacityBar: 300ms ease-out [W→newWidth]

# Drawer
open: 300ms ease-out [Y100%→0, α0→1]
close: 250ms ease-in [Y0→100%, α1→0]
expand: 200ms ease-out [H50%→80%]
collapse: 200ms ease-in [H80%→50%]

# Calendar Navigation
monthSwipe: 300ms ease-out [X±100%→0]
quickPick: 200ms [bg→accent, dates→selected]

# Validation
error: 400ms [shake + fade-in(message)]
success: 200ms [bg→success + checkmark]
warning: 300ms [bg→warning + pulse]

# Loading States
availability: 800ms [skeleton pulse]
priceCheck: 600ms [spinner 360°]
```

### Implementation Examples

```css
/* Date cell selection */
@keyframes dateSelect {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.date-selected {
  animation: dateSelect 100ms ease-out;
}

/* Range preview */
.date-range-preview {
  background: linear-gradient(
    to right,
    transparent,
    var(--vertical-color-10%) 10%,
    var(--vertical-color-10%) 90%,
    transparent
  );
  transition: opacity 200ms ease-out;
}

/* Guest counter */
@keyframes counterUpdate {
  0% { transform: scale(1); }
  50% { transform: scale(0.8); }
  100% { transform: scale(1); }
}

.guest-count {
  animation: counterUpdate 150ms ease-out;
}

/* Capacity bar */
.capacity-progress {
  transition: width 300ms ease-out;
}

/* Shake error */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.error-shake {
  animation: shake 400ms ease-in-out;
}
```

---

## 🎯 Touch Target Guidelines

### Minimum Sizes (WCAG 2.1 Level AA)

**All Interactive Elements:**
- Date cells: 44×44px
- Guest increment/decrement: 44×44px
- Quick pick chips: 44px height
- Month navigation arrows: 44×44px
- Drawer drag handle: 44px tap area
- Apply/Clear buttons: 48px height

### Spacing Between Targets

```
Good - Adequate Spacing:
┌────┐  ┌────┐  ┌────┐
│ −  │  │ 2  │  │ +  │
└────┘  └────┘  └────┘
  ↑ 12px ↑  ↑ 12px ↑

Bad - Too Close:
┌────┐┌────┐┌────┐
│ − ││ 2 ││ + │
└────┘└────┘└────┘
   No spacing = Mis-taps
```

---

## ♿ Accessibility Patterns

### Screen Reader Flow

```tsx
// Date picker announcement
<div aria-live="polite" aria-atomic="true">
  {startDate && endDate && (
    `Selected ${formatDate(startDate)} to ${formatDate(endDate)},
     ${getNights()} nights, Total ${formatPrice(totalPrice)}`
  )}
</div>

// Guest count announcement
<div aria-live="polite" aria-atomic="true">
  {`${totalGuests} guests selected.
   ${adults} adults, ${children} children, ${infants} infants.
   ${remainingCapacity} spots remaining.`}
</div>

// Validation errors
<div role="alert" aria-live="assertive">
  {error && `Error: ${error.message}`}
</div>
```

### Keyboard Navigation

**Date Picker:**
```
Tab       → Navigate to calendar
Arrow keys → Move between dates
Enter/Space → Select date
Escape    → Close drawer
PageUp/Down → Navigate months
Home/End  → Jump to start/end of month
```

**Guest Selector:**
```
Tab       → Navigate between categories
Arrow Up  → Increment count
Arrow Down → Decrement count
Enter/Space → Activate button
Escape    → Close drawer
```

### Focus Management

```tsx
// Opening drawer
const handleOpenDrawer = () => {
  setOpen(true)
  // Focus first interactive element
  setTimeout(() => {
    firstInputRef.current?.focus()
  }, 300) // After animation
}

// Closing drawer
const handleCloseDrawer = () => {
  const previousFocus = document.activeElement
  setOpen(false)
  // Return focus to trigger button
  setTimeout(() => {
    triggerButtonRef.current?.focus()
  }, 250)
}
```

---

## 📊 Loading & Error States

### Availability Loading

```
While checking availability:
┌─────────────────────────┐
│   December 2025         │
│                         │
│  Su Mo Tu We Th Fr Sa   │
│  ▯  ▯  ▯  ▯  ▯  ▯  ▯   │ ← Skeleton loader
│  ▯  ▯  ▯  ▯  ▯  ▯  ▯   │
│  ▯  ▯  ▯  ▯  ▯  ▯  ▯   │
│                         │
│  Checking availability… │
└─────────────────────────┘

After loaded:
┌─────────────────────────┐
│   December 2025         │
│                         │
│  Su Mo Tu We Th Fr Sa   │
│   1  2  3  4  5  6  7   │ ← Real data
│   8  9 10✕11✕12✕13 14   │
│  15 16 17 18 19 20 21   │
└─────────────────────────┘
```

### Price Calculation Loading

```
While calculating:
┌─────────────────────────┐
│  [Spinner] Calculating… │
│  ₦--,---                │
└─────────────────────────┘

After loaded:
┌─────────────────────────┐
│  3 nights · ₦1,350,000  │ ← Animated counter
└─────────────────────────┘
```

### Error States

```
Network Error:
┌─────────────────────────┐
│  ⚠ Connection Error     │
│  Could not load         │
│  availability           │
│                         │
│  [Retry]                │
└─────────────────────────┘

Booking Error:
┌─────────────────────────┐
│  ❌ Booking Failed       │
│  These dates are no     │
│  longer available       │
│                         │
│  [Select New Dates]     │
└─────────────────────────┘
```

---

## 🌐 Platform-Specific Optimizations

### iOS Safari

```css
/* Safe area insets */
.drawer {
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
}

/* Momentum scrolling */
.drawer-content {
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
}

/* Prevent zoom on focus */
input, select {
  font-size: 16px; /* Minimum to prevent zoom */
}

/* Fix viewport height */
.drawer {
  height: calc(var(--vh, 1vh) * 80);
}
```

```tsx
// Calculate actual viewport height
useEffect(() => {
  const setVH = () => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }
  setVH()
  window.addEventListener('resize', setVH)
  return () => window.removeEventListener('resize', setVH)
}, [])
```

### Android Chrome

```css
/* Address bar compensation */
.drawer {
  height: 80vh;
  height: 80dvh; /* Dynamic viewport height */
}

/* Touch callout */
* {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}
```

---

## 🧪 Testing Checklist

### Date Picker
- [ ] Drawer opens smoothly (300ms)
- [ ] Swipe gestures work (left/right months, up/down drawer)
- [ ] Date selection animates correctly
- [ ] Range preview shows on hover/tap
- [ ] Price updates in real-time
- [ ] Unavailable dates are disabled
- [ ] Quick picks populate correctly
- [ ] Touch targets are 44×44px
- [ ] Keyboard navigation works
- [ ] Screen reader announces selections
- [ ] Works in landscape orientation
- [ ] Safe areas respected (iOS)
- [ ] Performance is smooth (60 FPS)

### Guest Selector
- [ ] Drawer opens smoothly
- [ ] Increment/decrement buttons work
- [ ] Haptic feedback triggers
- [ ] Capacity bar updates
- [ ] Validation messages appear
- [ ] Adult requirement enforced
- [ ] Max capacity enforced
- [ ] Touch targets adequate
- [ ] Keyboard navigation works
- [ ] Screen reader announces counts
- [ ] Buttons disable at limits
- [ ] Error animations play

### Complete Booking Flow
- [ ] Can navigate from package → dates → guests → review
- [ ] Back navigation preserves state
- [ ] Progress is saved
- [ ] Price updates correctly throughout
- [ ] All validations work
- [ ] Error states handle gracefully
- [ ] Loading states show appropriately
- [ ] Works on slow connections (3G)

---

## 💡 UX Best Practices

### Smart Defaults

```typescript
// Pre-populate if coming from search
const defaultDates = useMemo(() => {
  if (searchParams.checkIn && searchParams.checkOut) {
    return {
      start: new Date(searchParams.checkIn),
      end: new Date(searchParams.checkOut)
    }
  }
  // Default: This weekend
  return {
    start: getNextFriday(),
    end: getNextSunday()
  }
}, [searchParams])

// Default guests
const defaultGuests = useMemo(() => {
  return {
    adults: Number(searchParams.adults) || 2,
    children: Number(searchParams.children) || 0,
    infants: 0
  }
}, [searchParams])
```

### Progress Persistence

```typescript
// Save booking progress
useEffect(() => {
  if (startDate && endDate && totalGuests > 0) {
    localStorage.setItem('bookingDraft', JSON.stringify({
      packageId,
      startDate,
      endDate,
      guests: { adults, children, infants },
      timestamp: Date.now()
    }))
  }
}, [startDate, endDate, adults, children, infants])

// Restore on return (within 24hrs)
useEffect(() => {
  const draft = localStorage.getItem('bookingDraft')
  if (draft) {
    const parsed = JSON.parse(draft)
    const age = Date.now() - parsed.timestamp
    if (age < 24 * 60 * 60 * 1000) { // 24 hours
      // Show "Resume booking?" prompt
      setShowResumePrompt(true)
      setDraftData(parsed)
    }
  }
}, [])
```

### Clear CTAs

```
Progressive CTAs:
1. No selection: [Select Dates]
2. Dates selected: [Add Guests] (price shown)
3. Guests added: [Review Booking] (total shown)
4. Review page: [Proceed to Payment]
```

---

## 🎯 Success Metrics

### User Experience
- Date selection completion: >85%
- Guest selection completion: >90%
- Booking flow completion: >70%
- Average time to book: <3 minutes
- Error rate: <5%

### Technical Performance
- Drawer open time: <300ms
- Animation FPS: 60
- Availability check: <500ms
- Price calculation: <200ms
- No jank or layout shift

### Accessibility
- Lighthouse score: 100
- Keyboard navigable: 100%
- Screen reader compatible: 100%
- Touch target compliance: 100%

---

**Status:** 📱 **MOBILE UX PATTERNS DOCUMENTED**

These patterns ensure a smooth, intuitive mobile booking experience that drives conversions while maintaining accessibility and performance.

**Next:** Create implementation guide with ready-to-use component code!

**Design System & UI/UX - Dev 7 (TOBI)** 📱💎✨
