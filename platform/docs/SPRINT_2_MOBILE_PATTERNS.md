# Sprint 2: Mobile Interaction Patterns

**Developer:** Dev 7 (TOBI) - Design System & UI/UX Lead
**Sprint:** 2 of 13
**Focus:** Mobile Filter UX & Touch Optimization
**Date:** November 18, 2025

---

## 📱 Mobile-First Philosophy

OneDettyDecember is built mobile-first. The filter system must work flawlessly on mobile devices where most of our users will discover packages.

### Mobile Context
- **Primary Device:** Mobile phones (375px - 428px width)
- **Secondary:** Tablets (768px - 1024px width)
- **Connection:** Often 3G/4G (not always fast WiFi)
- **Usage:** On-the-go, quick decisions, thumb navigation

---

## 🎯 Filter Drawer UX Pattern

### Why Bottom Sheet?

**Advantages:**
- ✅ Natural thumb reach (bottom of screen)
- ✅ Familiar pattern (iOS native, Google apps)
- ✅ Doesn't block entire screen
- ✅ Easy to dismiss (swipe down)
- ✅ Supports variable content height

**vs. Full-Screen Modal:**
- ❌ Requires extra tap to close
- ❌ Feels more "heavy"
- ❌ Harder to compare with results

**vs. Slide-out Sidebar:**
- ❌ Covers content completely
- ❌ Harder to reach on larger screens
- ❌ Not standard on mobile web

---

## 📐 Bottom Sheet Specifications

### Height States

```
State 1: Collapsed (Peek)
┌─────────────────────┐
│                     │
│   Search Results    │
│                     │
├─────────────────────┤
│ ━━━━                │ ← 48px visible
│ Filters (3)    ▼   │
└─────────────────────┘

State 2: Half-Expanded (Default)
┌─────────────────────┐
│                     │
│   Search Results    │
│ (dimmed overlay)    │
├─────────────────────┤
│ ━━━━                │
│ Filters      ✕     │
│ ───────────────────│
│ Categories ▼        │
│ [Events] [Stays]    │ ← 50% screen height
│ Price Range ▼       │
│ $0 ━━●━━━●━━ $10k  │
│                     │
│ [Show Results (125)]│
└─────────────────────┘

State 3: Fully-Expanded
┌─────────────────────┐
│ ━━━━                │
│ Filters      ✕     │
│ ───────────────────│
│ Categories ▼        │
│ [Events] [Stays]    │
│ [Experiences]       │
│ [Cars] [Marketplace]│
│                     │ ← 80% screen height
│ Price Range ▼       │
│ $0 ━━●━━━●━━ $10k  │
│                     │
│ Date Range ▼        │
│ Dec 1 - Dec 31      │
│                     │
│ [Show Results (125)]│
└─────────────────────┘
```

### State Transitions

**Trigger → Half-Expanded:**
- Animation: Slide up 300ms ease-out
- Overlay: Fade in 200ms
- Body: Lock scroll

**Half → Fully Expanded:**
- Swipe up on content
- Tap "Show More" if content overflows
- Smooth 200ms transition

**Any State → Closed:**
- Swipe down on drag handle
- Tap overlay
- Tap close button (✕)
- Tap "Show Results" button
- Animation: Slide down 250ms ease-in
- Overlay: Fade out 150ms

---

## 👆 Touch Interactions

### Drag Handle

```
┌─────────────────────┐
│      ━━━━━━         │ ← 40px wide, 4px tall, centered
└─────────────────────┘
```

**Behavior:**
- Grab area: 44px height (WCAG minimum)
- Visual: 4px × 40px rounded bar
- Color: `neutral-400` (subtle but visible)
- Swipe down: Close drawer
- Swipe up: Expand drawer

**Haptic Feedback:**
- Light vibration on grab
- Snap vibration at state changes

---

### Gesture Zones

```
┌─────────────────────────────┐
│ ━━━━  DRAG HANDLE          │ ← Drag Zone (44px)
│ Filters            ✕        │ ← Header (56px)
├─────────────────────────────┤
│                             │
│  SCROLLABLE CONTENT         │ ← Scroll Zone
│                             │
│  (Categories, Price, etc.)  │
│                             │
├─────────────────────────────┤
│ [Show Results (125)]        │ ← Action Zone (64px sticky)
└─────────────────────────────┘
```

**Zone Behaviors:**
1. **Drag Zone (Top 44px):**
   - Vertical swipe: Open/close drawer
   - No horizontal scroll

2. **Header Zone (56px):**
   - Tap title: No action
   - Tap close (✕): Close drawer
   - Drag: Move drawer

3. **Scroll Zone (Content):**
   - Vertical scroll: Scroll content
   - Horizontal scroll: If needed (chips)
   - Pull-to-refresh: Disabled

4. **Action Zone (Bottom 64px):**
   - Sticky position
   - Tap button: Apply + close
   - Always visible

---

## 🎨 Visual Feedback

### Touch States

**Chips/Buttons:**
```css
/* Default */
background: transparent
border: 2px solid vertical-color

/* Pressed (Active) */
transform: scale(0.95)
transition: 100ms

/* Selected */
background: vertical-color
color: white
border: 2px solid vertical-color

/* Disabled */
opacity: 0.5
cursor: not-allowed
```

**Slider Thumbs:**
```css
/* Default */
width: 20px
height: 20px
touch-area: 44px × 44px (invisible)

/* Pressed */
transform: scale(1.2)
box-shadow: 0 0 0 8px rgba(gold, 0.2)
```

**Inputs:**
```css
/* Default */
height: 48px (touch-friendly)
border: 2px solid border-color

/* Focus */
border: 2px solid brand-gold
ring: 4px rgba(gold, 0.2)
```

---

## ⚡ Performance Patterns

### Smooth Animations

**GPU Acceleration:**
```css
/* Bottom Sheet */
transform: translateY(0)  /* Not top/bottom */
will-change: transform    /* GPU hint */

/* Overlay */
opacity: 0.6
will-change: opacity

/* Avoid */
height changes (causes reflow)
margin/padding animations
```

**60 FPS Target:**
- Animation duration: 200-300ms
- Easing: ease-out (natural feel)
- No layout shifts during animation

---

### Debouncing & Throttling

**Real-time Filters (Categories):**
```typescript
// No debounce - instant feedback
const handleCategoryToggle = (vertical: Vertical) => {
  updateFilters({ categories: [...selected, vertical] })
  // API call with debounce
  debouncedFetchResults(500ms)
}
```

**Text Input (Location):**
```typescript
// Debounce: 300ms
const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    fetchLocations(query)
  }, 300),
  []
)
```

**Slider (Price):**
```typescript
// Throttle: Update while dragging, debounce API
const throttledUpdate = useThrottle(
  (value) => setLocalValue(value),
  16 // 60fps
)

const debouncedAPI = useDebounce(
  (value) => fetchResults(value),
  500
)
```

---

## 📊 Filter Count Badge

### Dynamic Count Display

```
Before Filters Applied:
┌──────────────────┐
│  🔍 Filters      │
└──────────────────┘

Filters Applied:
┌──────────────────┐
│  🔍 Filters (3)  │ ← Badge shows active count
└──────────────────┘

In Drawer:
┌──────────────────┐
│ Show Results (125)│ ← Shows result count
└──────────────────┘
```

**Badge Specs:**
```tsx
// Trigger button
<button className={responsiveSpacing.px.all}>
  <Filter {...iconProps} />
  Filters
  {activeCount > 0 && (
    <span className="badge-count">
      ({activeCount})
    </span>
  )}
</button>

// Result count updates live
<button className="sticky-footer">
  Show Results ({resultCount})
</button>
```

**Live Update:**
- Count updates as filters change
- Debounced API call (500ms)
- Loading state shows spinner
- Error state shows last count

---

## 🎯 Touch Target Guidelines

### Minimum Sizes (WCAG 2.1 Level AA)

**Interactive Elements:**
- Buttons: 44×44px minimum
- Chips: 44px height minimum
- Links: 44px height (with padding)
- Form inputs: 48px height
- Slider thumbs: 44×44px tap area

**Spacing:**
- Between targets: 8px minimum
- In dense areas: 12px preferred
- Around primary actions: 16px

---

### Target Size Examples

```
✅ Good - Adequate Spacing
┌────────┐  ┌────────┐  ┌────────┐
│ Events │  │ Stays  │  │  Cars  │
│  44px  │  │  44px  │  │  44px  │
└────────┘  └────────┘  └────────┘
   ↑ 12px ↑    ↑ 12px ↑

❌ Bad - Too Close
┌────────┐┌────────┐┌────────┐
│ Events ││ Stays  ││  Cars  │
└────────┘└────────┘└────────┘
  No spacing = Mis-taps

✅ Good - Stacked with Space
┌──────────────────┐
│     Events       │ 44px
├──────────────────┤ 8px gap
│     Stays        │ 44px
├──────────────────┤ 8px gap
│     Cars         │ 44px
└──────────────────┘
```

---

## 🌐 Responsive Breakpoints

### Filter Layout by Screen Size

**Mobile (< 768px):**
```tsx
- Filter trigger button in header
- Bottom sheet drawer
- Single column chips
- Simplified slider
- Sticky footer button
```

**Tablet (768px - 1024px):**
```tsx
- Filter trigger OR mini sidebar
- Bottom sheet OR side panel
- 2-column chip grid
- Full-featured slider
- Inline apply button
```

**Desktop (> 1024px):**
```tsx
- Fixed left sidebar
- No drawer
- 3-column chip grid
- Full slider with inputs
- Inline apply + clear
```

---

## 🎨 Animation Specs

### Drawer Animations

```css
/* Open Drawer */
.drawer-enter {
  transform: translateY(100%);
  opacity: 0;
}

.drawer-enter-active {
  transform: translateY(0);
  opacity: 1;
  transition: transform 300ms ease-out,
              opacity 200ms ease-out;
}

/* Close Drawer */
.drawer-exit {
  transform: translateY(0);
  opacity: 1;
}

.drawer-exit-active {
  transform: translateY(100%);
  opacity: 0;
  transition: transform 250ms ease-in,
              opacity 150ms ease-in;
}

/* Overlay */
.overlay-enter {
  opacity: 0;
}

.overlay-enter-active {
  opacity: 0.6;
  transition: opacity 200ms ease-out;
}
```

### Micro-interactions

```css
/* Chip Toggle */
.chip-toggle {
  transition: all 150ms ease-out;
}

.chip-active {
  transform: scale(1);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Slider Thumb */
.slider-thumb {
  transition: transform 100ms ease-out;
}

.slider-thumb:active {
  transform: scale(1.2);
}

/* Button Press */
.button-press {
  transform: scale(0.95);
  transition: transform 100ms ease-out;
}
```

---

## ♿ Mobile Accessibility

### Screen Reader Navigation

**Drawer Announcement:**
```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="filter-title"
  aria-describedby="filter-desc"
>
  <h2 id="filter-title">Filter Packages</h2>
  <p id="filter-desc" className="sr-only">
    Select filters to refine your package search
  </p>
</div>
```

**Filter Sections:**
```tsx
<section aria-labelledby="category-filter">
  <h3 id="category-filter">Categories</h3>
  <div role="group" aria-label="Package categories">
    {/* Category chips */}
  </div>
</section>
```

**Live Regions:**
```tsx
<div
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {resultCount} packages found
</div>
```

---

### Focus Management

**Opening Drawer:**
1. Save current focus
2. Trap focus in drawer
3. Focus close button or first filter

**Closing Drawer:**
1. Release focus trap
2. Return focus to trigger button
3. Announce results update

**Keyboard Shortcuts:**
- `Escape`: Close drawer
- `Tab/Shift+Tab`: Navigate filters
- `Enter/Space`: Toggle chips
- `Arrow keys`: Slider control

---

## 📱 Platform-Specific Patterns

### iOS Safari

**Quirks:**
- No :active on touch (needs touchstart event)
- Scroll momentum issues
- Viewport height with keyboard
- Safe area insets

**Solutions:**
```css
/* Momentum scrolling */
.drawer-content {
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
}

/* Safe areas */
.drawer {
  padding-bottom: env(safe-area-inset-bottom);
}

/* Viewport height */
.drawer {
  height: calc(80vh - env(safe-area-inset-bottom));
}
```

---

### Android Chrome

**Quirks:**
- Address bar height changes
- Different scroll behavior
- Haptic feedback variations

**Solutions:**
```tsx
// Dynamic viewport
const [viewportHeight, setViewportHeight] = useState('100vh')

useEffect(() => {
  const updateHeight = () => {
    setViewportHeight(`${window.innerHeight}px`)
  }
  window.addEventListener('resize', updateHeight)
  return () => window.removeEventListener('resize', updateHeight)
}, [])
```

---

## 🧪 Testing Patterns

### Device Testing

**Must Test On:**
- iPhone SE (375px - small screen)
- iPhone 13/14 (390px - standard)
- iPhone 14 Pro Max (428px - large)
- Galaxy S21 (360px - Android)
- iPad Mini (768px - tablet)

**Test Cases:**
- [ ] Drawer opens smoothly
- [ ] Swipe gestures work
- [ ] Touch targets are adequate
- [ ] Filters apply correctly
- [ ] Performance is smooth
- [ ] Works in landscape
- [ ] Keyboard doesn't break layout
- [ ] Safe areas respected

---

### Performance Testing

**Metrics:**
- Drawer animation: 60 FPS
- Filter application: <200ms
- API response: <500ms
- Initial load: <1s

**Tools:**
- Chrome DevTools Performance
- Lighthouse Mobile
- WebPageTest (3G throttling)
- Real device testing

---

## 💡 UX Best Practices

### Progressive Disclosure

**Show Most Common First:**
1. Categories (always visible)
2. Price range (collapsed by default)
3. Date range (collapsed)
4. Location (collapsed)

**Advanced Filters:**
- More filters button
- Additional options in popover
- Don't overwhelm on first view

---

### Smart Defaults

**Remember Preferences:**
```typescript
// Save filter state
localStorage.setItem('filters', JSON.stringify(filterState))

// Restore on return
const savedFilters = localStorage.getItem('filters')
if (savedFilters) {
  setFilters(JSON.parse(savedFilters))
}
```

**Clear Filters:**
- Obvious "Clear All" button
- Individual filter remove (X)
- Reset to defaults option

---

## 🎯 Success Metrics

### User Experience
- Filter usage rate > 60%
- Average filters per search: 2-3
- Time to apply filters: <30s
- Filter abandonment rate: <20%

### Technical Performance
- Drawer open time: <300ms
- API response: <500ms
- 60 FPS animations
- No jank or layout shift

### Accessibility
- Lighthouse score: 100
- Keyboard navigable: 100%
- Screen reader compatible: 100%
- Touch target compliance: 100%

---

**Status:** 🎨 **MOBILE PATTERNS DOCUMENTED**

These patterns ensure a smooth, accessible, and performant mobile filter experience for OneDettyDecember users.

**Next:** Implement components following these patterns in Sprint 2!

**Design System & UI/UX - Dev 7 (TOBI)** 📱✨
