# Sprint 2: Filter UI - Quick Implementation Guide

**For:** Developers implementing filter components
**By:** Dev 7 (TOBI) - Design System & UI/UX Lead
**Sprint:** 2 of 13

---

## 🚀 Quick Start

### Install Dependencies

```bash
# Date picker
npm install react-datepicker
npm install --save-dev @types/react-datepicker

# Bottom sheet (mobile drawer)
npm install react-spring-bottom-sheet

# Slider
npm install rc-slider
npm install --save-dev @types/rc-slider
```

---

## 📦 Component Imports

```tsx
// Design System
import { getButtonClasses, getBadgeClasses, getInputClasses } from '@/lib/component-variants'
import { responsiveSpacing, responsiveDisplay, touchFriendly } from '@/lib/responsive-utilities'
import { getThemedClasses, getThemedVerticalClasses } from '@/lib/dark-mode'
import { getIconProps, iconSets } from '@/lib/icon-system'
import type { Vertical } from '@/lib/vertical-theme'

// Icons
import { Filter, X, ChevronDown, MapPin, Calendar, DollarSign } from 'lucide-react'

// Third-party
import DatePicker from 'react-datepicker'
import { BottomSheet } from 'react-spring-bottom-sheet'
import Slider from 'rc-slider'

// Styles
import 'react-datepicker/dist/react-datepicker.css'
import 'react-spring-bottom-sheet/dist/style.css'
import 'rc-slider/assets/index.css'
```

---

## 🎯 Component Templates

### 1. CategoryFilter Component

```tsx
// src/components/search/CategoryFilter.tsx

import { getBadgeClasses } from '@/lib/component-variants'
import { getThemedVerticalClasses } from '@/lib/dark-mode'
import type { Vertical } from '@/lib/vertical-theme'

interface CategoryFilterProps {
  selected: Vertical[]
  onChange: (categories: Vertical[]) => void
  layout?: 'grid' | 'wrap'
}

const CATEGORIES: { value: Vertical; label: string }[] = [
  { value: 'events', label: 'Events' },
  { value: 'stays', label: 'Stays' },
  { value: 'experiences', label: 'Experiences' },
  { value: 'cars', label: 'Cars' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'community', label: 'Community' },
]

export function CategoryFilter({ selected, onChange, layout = 'grid' }: CategoryFilterProps) {
  const toggleCategory = (category: Vertical) => {
    if (selected.includes(category)) {
      onChange(selected.filter(c => c !== category))
    } else {
      onChange([...selected, category])
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm">Categories</h3>
      <div className={layout === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 gap-2' : 'flex flex-wrap gap-2'}>
        {CATEGORIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => toggleCategory(value)}
            className={getBadgeClasses({
              size: 'md',
              variant: selected.includes(value) ? 'solid' : 'outline',
              vertical: value,
              radius: 'lg'
            })}
            style={{ minHeight: '44px' }} // Touch-friendly
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
```

---

### 2. PriceRangeSlider Component

```tsx
// src/components/search/PriceRangeSlider.tsx

import { useState } from 'react'
import Slider from 'rc-slider'
import { getInputClasses } from '@/lib/component-variants'

interface PriceRangeSliderProps {
  value: [number, number]
  onChange: (range: [number, number]) => void
  min?: number
  max?: number
  currency?: string
}

export function PriceRangeSlider({
  value,
  onChange,
  min = 0,
  max = 10000,
  currency = '$'
}: PriceRangeSliderProps) {
  const [localValue, setLocalValue] = useState(value)

  const formatCurrency = (amount: number) => {
    return `${currency}${amount.toLocaleString()}`
  }

  const handleChange = (newValue: number | number[]) => {
    const range = newValue as [number, number]
    setLocalValue(range)
  }

  const handleAfterChange = (newValue: number | number[]) => {
    onChange(newValue as [number, number])
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm">Price Range</h3>

      {/* Input fields */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-600 dark:text-gray-400">Min Price</label>
          <input
            type="number"
            value={localValue[0]}
            onChange={(e) => {
              const newMin = Number(e.target.value)
              const newRange: [number, number] = [newMin, localValue[1]]
              setLocalValue(newRange)
              onChange(newRange)
            }}
            className={getInputClasses({ size: 'md' })}
          />
        </div>
        <div>
          <label className="text-xs text-gray-600 dark:text-gray-400">Max Price</label>
          <input
            type="number"
            value={localValue[1]}
            onChange={(e) => {
              const newMax = Number(e.target.value)
              const newRange: [number, number] = [localValue[0], newMax]
              setLocalValue(newRange)
              onChange(newRange)
            }}
            className={getInputClasses({ size: 'md' })}
          />
        </div>
      </div>

      {/* Slider */}
      <div className="px-2">
        <Slider
          range
          min={min}
          max={max}
          value={localValue}
          onChange={handleChange}
          onAfterChange={handleAfterChange}
          trackStyle={[{ backgroundColor: '#FFB700' }]}
          handleStyle={[
            { borderColor: '#FFB700', backgroundColor: '#FFB700' },
            { borderColor: '#FFB700', backgroundColor: '#FFB700' }
          ]}
          railStyle={{ backgroundColor: '#E5E5E5' }}
        />
      </div>

      {/* Display values */}
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>{formatCurrency(min)}</span>
        <span>{formatCurrency(max)}</span>
      </div>

      {/* Quick presets (optional) */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onChange([0, 1000])}
          className="text-xs px-3 py-1.5 rounded-full border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Under {formatCurrency(1000)}
        </button>
        <button
          onClick={() => onChange([1000, 5000])}
          className="text-xs px-3 py-1.5 rounded-full border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {formatCurrency(1000)}-{formatCurrency(5000)}
        </button>
        <button
          onClick={() => onChange([5000, max])}
          className="text-xs px-3 py-1.5 rounded-full border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Over {formatCurrency(5000)}
        </button>
      </div>
    </div>
  )
}
```

---

### 3. FilterPanel Component (Desktop Sidebar)

```tsx
// src/components/search/FilterPanel.tsx

import { CategoryFilter } from './CategoryFilter'
import { PriceRangeSlider } from './PriceRangeSlider'
import { DateRangePicker } from './DateRangePicker'
import { LocationFilter } from './LocationFilter'
import { getButtonClasses } from '@/lib/component-variants'
import { getThemedClasses } from '@/lib/dark-mode'
import type { FilterState } from '@/types/filters'

interface FilterPanelProps {
  filters: FilterState
  onChange: (filters: Partial<FilterState>) => void
  onApply: () => void
  onClear: () => void
  resultCount?: number
}

export function FilterPanel({
  filters,
  onChange,
  onApply,
  onClear,
  resultCount
}: FilterPanelProps) {
  return (
    <div className={`${getThemedClasses.bgElevated} border-r ${getThemedClasses.borderPrimary} p-6 space-y-6`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Filters</h2>
        <button
          onClick={onClear}
          className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          Clear All
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-6">
        <CategoryFilter
          selected={filters.categories}
          onChange={(categories) => onChange({ categories })}
        />

        <PriceRangeSlider
          value={filters.priceRange}
          onChange={(priceRange) => onChange({ priceRange })}
        />

        <DateRangePicker
          value={filters.dateRange}
          onChange={(dateRange) => onChange({ dateRange })}
        />

        <LocationFilter
          selected={filters.locations}
          onChange={(locations) => onChange({ locations })}
        />
      </div>

      {/* Apply Button */}
      <button
        onClick={onApply}
        className={getButtonClasses({
          size: 'lg',
          variant: 'solid',
          fullWidth: true
        })}
      >
        Apply Filters {resultCount !== undefined && `(${resultCount})`}
      </button>
    </div>
  )
}
```

---

### 4. FilterDrawer Component (Mobile Bottom Sheet)

```tsx
// src/components/search/FilterDrawer.tsx

import { BottomSheet } from 'react-spring-bottom-sheet'
import { FilterPanel } from './FilterPanel'
import { X } from 'lucide-react'
import { getThemedClasses } from '@/lib/dark-mode'
import type { FilterState } from '@/types/filters'

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterState
  onChange: (filters: Partial<FilterState>) => void
  onApply: () => void
  resultCount?: number
}

export function FilterDrawer({
  isOpen,
  onClose,
  filters,
  onChange,
  onApply,
  resultCount
}: FilterDrawerProps) {
  const handleApply = () => {
    onApply()
    onClose()
  }

  return (
    <BottomSheet
      open={isOpen}
      onDismiss={onClose}
      defaultSnap={({ maxHeight }) => maxHeight * 0.6}
      snapPoints={({ maxHeight }) => [
        maxHeight * 0.6,  // Half screen
        maxHeight * 0.9,  // Full screen
      ]}
      className={getThemedClasses.bgPrimary}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold">Filters</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 140px)' }}>
        <FilterPanel
          filters={filters}
          onChange={onChange}
          onApply={handleApply}
          onClear={() => {
            onChange({
              categories: [],
              priceRange: [0, 10000],
              dateRange: { from: null, to: null },
              locations: []
            })
          }}
          resultCount={resultCount}
        />
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <button
          onClick={handleApply}
          className="w-full h-12 bg-[#FFB700] hover:bg-[#E6A600] text-black font-semibold rounded-lg"
        >
          Show Results {resultCount !== undefined && `(${resultCount})`}
        </button>
      </div>
    </BottomSheet>
  )
}
```

---

## 🎨 Styling Utilities

### Common Patterns

```tsx
// Touch-friendly button
className={`
  ${getButtonClasses({ size: 'md', variant: 'solid' })}
  ${touchFriendly.minTouchTarget}
`}

// Responsive spacing
className={responsiveSpacing.p.all}  // p-4 sm:p-6 lg:p-8

// Hide on mobile
className={responsiveDisplay.hideOnMobile}

// Vertical-themed chip
className={getBadgeClasses({
  size: 'md',
  variant: 'solid',
  vertical: 'events'
})}

// Themed background
className={getThemedClasses.bgPrimary}  // bg-white dark:bg-[#0A0A0A]
```

---

## 🔗 State Management

### Filter State Type

```tsx
// src/types/filters.ts

export type Vertical = 'events' | 'stays' | 'experiences' | 'cars' | 'marketplace' | 'community'

export interface Location {
  id: string
  name: string
  country: string
  coordinates?: [number, number]
}

export interface FilterState {
  categories: Vertical[]
  priceRange: [number, number]
  dateRange: {
    from: Date | null
    to: Date | null
  }
  locations: Location[]
}

export interface FilterActions {
  setCategories: (categories: Vertical[]) => void
  setPriceRange: (range: [number, number]) => void
  setDateRange: (range: { from: Date | null, to: Date | null }) => void
  setLocations: (locations: Location[]) => void
  clearFilters: () => void
  applyFilters: () => void
}
```

### React Hook

```tsx
// src/hooks/useFilters.ts

import { useState, useCallback } from 'react'
import type { FilterState } from '@/types/filters'

export function useFilters(initialState?: Partial<FilterState>) {
  const [filters, setFilters] = useState<FilterState>({
    categories: initialState?.categories || [],
    priceRange: initialState?.priceRange || [0, 10000],
    dateRange: initialState?.dateRange || { from: null, to: null },
    locations: initialState?.locations || [],
  })

  const updateFilters = useCallback((updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({
      categories: [],
      priceRange: [0, 10000],
      dateRange: { from: null, to: null },
      locations: [],
    })
  }, [])

  return {
    filters,
    updateFilters,
    clearFilters,
  }
}
```

---

## 📡 API Integration

### Filter Query Builder

```tsx
// src/lib/api/filters.ts

export function buildFilterQuery(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams()

  // Categories
  if (filters.categories.length > 0) {
    params.append('categories', filters.categories.join(','))
  }

  // Price range
  if (filters.priceRange[0] > 0) {
    params.append('minPrice', filters.priceRange[0].toString())
  }
  if (filters.priceRange[1] < 10000) {
    params.append('maxPrice', filters.priceRange[1].toString())
  }

  // Date range
  if (filters.dateRange.from) {
    params.append('startDate', filters.dateRange.from.toISOString())
  }
  if (filters.dateRange.to) {
    params.append('endDate', filters.dateRange.to.toISOString())
  }

  // Locations
  if (filters.locations.length > 0) {
    params.append('locations', filters.locations.map(l => l.id).join(','))
  }

  return params
}
```

### Fetch with Filters

```tsx
// src/lib/api/packages.ts

export async function fetchPackages(filters: FilterState) {
  const query = buildFilterQuery(filters)
  const response = await fetch(`/api/search/packages?${query}`)

  if (!response.ok) {
    throw new Error('Failed to fetch packages')
  }

  return response.json()
}
```

---

## ⚡ Performance Optimization

### Debounced API Calls

```tsx
import { useMemo } from 'react'
import { debounce } from 'lodash'

function SearchPage() {
  const { filters, updateFilters } = useFilters()
  const [results, setResults] = useState([])

  // Debounced fetch
  const debouncedFetch = useMemo(
    () => debounce(async (filters: FilterState) => {
      const data = await fetchPackages(filters)
      setResults(data.results)
    }, 500),
    []
  )

  // Update filters and trigger fetch
  const handleFilterChange = (updates: Partial<FilterState>) => {
    updateFilters(updates)
    debouncedFetch({ ...filters, ...updates })
  }

  return (
    // UI components
  )
}
```

---

## 📱 Responsive Usage

### Desktop + Mobile Layout

```tsx
export function SearchPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { filters, updateFilters, clearFilters } = useFilters()

  return (
    <div className="flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-80 sticky top-0 h-screen overflow-y-auto">
        <FilterPanel
          filters={filters}
          onChange={updateFilters}
          onApply={() => console.log('Apply')}
          onClear={clearFilters}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Mobile Filter Trigger */}
        <div className="lg:hidden p-4">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2"
          >
            <Filter size={20} />
            Filters {filters.categories.length > 0 && `(${filters.categories.length})`}
          </button>
        </div>

        {/* Results */}
        <div className="p-4">
          {/* Package cards */}
        </div>
      </main>

      {/* Mobile Drawer */}
      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        filters={filters}
        onChange={updateFilters}
        onApply={() => console.log('Apply')}
      />
    </div>
  )
}
```

---

## ✅ Quick Checklist

Before marking filter UI complete:

### Functionality
- [ ] All filters work correctly
- [ ] Mobile drawer opens/closes smoothly
- [ ] Categories toggle correctly
- [ ] Price slider updates correctly
- [ ] Date picker works
- [ ] Location search works
- [ ] Active filters display
- [ ] Clear filters works
- [ ] Apply filters triggers API call

### Visual/UX
- [ ] Matches design spec
- [ ] Vertical colors applied
- [ ] Dark mode works
- [ ] Touch targets ≥ 44px
- [ ] Animations smooth (60fps)
- [ ] Loading states shown
- [ ] Error states handled

### Responsive
- [ ] Works on mobile (375px+)
- [ ] Works on tablet (768px+)
- [ ] Works on desktop (1024px+)
- [ ] Drawer height appropriate
- [ ] Sticky footer works
- [ ] Safe areas respected (iOS)

### Accessibility
- [ ] Keyboard navigable
- [ ] Screen reader compatible
- [ ] Focus management correct
- [ ] ARIA labels present
- [ ] Color contrast passes
- [ ] Lighthouse score 100

### Performance
- [ ] API calls debounced
- [ ] No unnecessary re-renders
- [ ] Smooth on 3G
- [ ] Works on low-end devices

---

**Ready to build!** Use this guide as a reference during Sprint 2 implementation. 🚀

**Design System & UI/UX - Dev 7 (TOBI)** 🎨✨
