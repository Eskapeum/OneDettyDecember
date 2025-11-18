import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { VerticalTheme } from '@/types/vertical'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const searchBarVariants = cva(
  'w-full',
  {
    variants: {
      size: {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        full: 'max-w-full',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface SearchSuggestion {
  id: string
  text: string
  vertical?: VerticalTheme
  type?: 'package' | 'location' | 'category' | 'recent'
}

export interface SearchBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof searchBarVariants> {
  /**
   * Search input placeholder
   */
  placeholder?: string
  /**
   * Current search value
   */
  value?: string
  /**
   * Search value change handler
   */
  onValueChange?: (value: string) => void
  /**
   * Search submit handler
   */
  onSearch?: (value: string) => void
  /**
   * Show search button
   */
  showSearchButton?: boolean
  /**
   * Show filter button
   */
  showFilterButton?: boolean
  /**
   * Filter button click handler
   */
  onFilterClick?: () => void
  /**
   * Autocomplete suggestions
   */
  suggestions?: SearchSuggestion[]
  /**
   * Show suggestions dropdown
   */
  showSuggestions?: boolean
  /**
   * Suggestion click handler
   */
  onSuggestionClick?: (suggestion: SearchSuggestion) => void
  /**
   * Loading state
   */
  loading?: boolean
  /**
   * Vertical theme for focus ring
   */
  vertical?: VerticalTheme
}

const SearchBar = React.forwardRef<HTMLDivElement, SearchBarProps>(
  (
    {
      className,
      size,
      placeholder = 'Search for packages, events, experiences...',
      value,
      onValueChange,
      onSearch,
      showSearchButton = true,
      showFilterButton = true,
      onFilterClick,
      suggestions = [],
      showSuggestions = false,
      onSuggestionClick,
      loading = false,
      vertical,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(value || '')
    const [isFocused, setIsFocused] = React.useState(false)
    const searchInputRef = React.useRef<HTMLInputElement>(null)

    const currentValue = value !== undefined ? value : internalValue

    const handleValueChange = (newValue: string) => {
      setInternalValue(newValue)
      onValueChange?.(newValue)
    }

    const handleSearch = () => {
      onSearch?.(currentValue)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch()
      }
    }

    const handleSuggestionClick = (suggestion: SearchSuggestion) => {
      handleValueChange(suggestion.text)
      onSuggestionClick?.(suggestion)
      setIsFocused(false)
    }

    const displaySuggestions = showSuggestions && isFocused && suggestions.length > 0

    return (
      <div
        ref={ref}
        className={cn(searchBarVariants({ size }), 'relative', className)}
        {...props}
      >
        {/* Search Input Container */}
        <div className="relative flex items-center gap-2">
          {/* Search Icon */}
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Input */}
            <input
              ref={searchInputRef}
              type="text"
              value={currentValue}
              onChange={(e) => handleValueChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder={placeholder}
              className={cn(
                'w-full h-12 pl-11 pr-4 rounded-lg border border-input bg-background',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                vertical && `focus:ring-[var(--vertical-${vertical})]`,
                !vertical && 'focus:ring-ring',
                'transition-shadow'
              )}
            />

            {/* Loading Spinner */}
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg
                  className="animate-spin h-5 w-5 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Filter Button */}
          {showFilterButton && (
            <Button
              variant="outline"
              size="icon"
              onClick={onFilterClick}
              className="h-12 w-12 shrink-0"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </Button>
          )}

          {/* Search Button */}
          {showSearchButton && (
            <Button
              size="lg"
              onClick={handleSearch}
              className="h-12 shrink-0"
              vertical={vertical}
            >
              Search
            </Button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {displaySuggestions && (
          <div className="absolute z-50 w-full mt-2 bg-background border border-input rounded-lg shadow-lg max-h-80 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Icon based on type */}
                  <div className="text-muted-foreground shrink-0">
                    {suggestion.type === 'recent' && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {suggestion.type === 'location' && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                    {suggestion.type === 'package' && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    )}
                    {suggestion.type === 'category' && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    )}
                  </div>

                  {/* Text */}
                  <span className="truncate">{suggestion.text}</span>
                </div>

                {/* Vertical Badge */}
                {suggestion.vertical && (
                  <Badge vertical={suggestion.vertical} className="shrink-0">
                    {suggestion.vertical}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }
)
SearchBar.displayName = 'SearchBar'

export { SearchBar, searchBarVariants }
