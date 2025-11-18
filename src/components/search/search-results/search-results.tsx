import * as React from 'react'
import { cn } from '@/lib/utils'
import type { VerticalTheme } from '@/types/vertical'
import type { Package } from '@/components/home/featured-packages'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface FilterOption {
  id: string
  label: string
  count?: number
}

export interface FilterGroup {
  id: string
  label: string
  type: 'checkbox' | 'radio' | 'range' | 'date'
  options?: FilterOption[]
  min?: number
  max?: number
  value?: any
}

export interface SortOption {
  id: string
  label: string
}

export interface SearchResultsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Search results (packages)
   */
  results: Package[]
  /**
   * Total number of results
   */
  totalResults?: number
  /**
   * Search query
   */
  query?: string
  /**
   * Filter groups for sidebar
   */
  filterGroups?: FilterGroup[]
  /**
   * Show filter sidebar (desktop)
   */
  showFilters?: boolean
  /**
   * Filter sidebar toggle handler
   */
  onToggleFilters?: () => void
  /**
   * Filter change handler
   */
  onFilterChange?: (groupId: string, value: any) => void
  /**
   * Sort options
   */
  sortOptions?: SortOption[]
  /**
   * Current sort value
   */
  currentSort?: string
  /**
   * Sort change handler
   */
  onSortChange?: (sortId: string) => void
  /**
   * View mode: grid or list
   */
  viewMode?: 'grid' | 'list'
  /**
   * View mode change handler
   */
  onViewModeChange?: (mode: 'grid' | 'list') => void
  /**
   * Package click handler
   */
  onPackageClick?: (pkg: Package) => void
  /**
   * Loading state
   */
  loading?: boolean
  /**
   * Current page (for pagination)
   */
  currentPage?: number
  /**
   * Total pages (for pagination)
   */
  totalPages?: number
  /**
   * Page change handler
   */
  onPageChange?: (page: number) => void
}

const SearchResults = React.forwardRef<HTMLDivElement, SearchResultsProps>(
  (
    {
      className,
      results,
      totalResults,
      query,
      filterGroups = [],
      showFilters = true,
      onToggleFilters,
      onFilterChange,
      sortOptions = [
        { id: 'relevance', label: 'Most Relevant' },
        { id: 'price-low', label: 'Price: Low to High' },
        { id: 'price-high', label: 'Price: High to Low' },
        { id: 'rating', label: 'Highest Rated' },
      ],
      currentSort = 'relevance',
      onSortChange,
      viewMode = 'grid',
      onViewModeChange,
      onPackageClick,
      loading = false,
      currentPage = 1,
      totalPages = 1,
      onPageChange,
      ...props
    },
    ref
  ) => {
    const formatPrice = (price: number, currency = 'NGN') => {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
      }).format(price)
    }

    return (
      <div ref={ref} className={cn('py-6', className)} {...props}>
        <div className="container mx-auto px-4">
          <div className="flex gap-6">
            {/* Filter Sidebar - Desktop */}
            {showFilters && (
              <aside className="hidden lg:block w-64 shrink-0">
                <div className="sticky top-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Filters</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Reset all filters
                        filterGroups.forEach((group) => {
                          onFilterChange?.(group.id, null)
                        })
                      }}
                    >
                      Clear All
                    </Button>
                  </div>

                  {/* Filter Groups */}
                  {filterGroups.map((group) => (
                    <div key={group.id} className="space-y-3">
                      <h4 className="font-medium text-sm">{group.label}</h4>

                      {/* Checkbox Filters */}
                      {group.type === 'checkbox' && group.options && (
                        <div className="space-y-2">
                          {group.options.map((option) => (
                            <label
                              key={option.id}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                className="rounded border-input"
                                onChange={(e) => {
                                  onFilterChange?.(group.id, {
                                    ...group.value,
                                    [option.id]: e.target.checked,
                                  })
                                }}
                              />
                              <span className="text-sm flex-1">{option.label}</span>
                              {option.count !== undefined && (
                                <span className="text-xs text-muted-foreground">
                                  ({option.count})
                                </span>
                              )}
                            </label>
                          ))}
                        </div>
                      )}

                      {/* Range Filter */}
                      {group.type === 'range' && (
                        <div className="space-y-2">
                          <input
                            type="range"
                            min={group.min}
                            max={group.max}
                            className="w-full"
                            onChange={(e) => {
                              onFilterChange?.(group.id, e.target.value)
                            }}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{group.min}</span>
                            <span>{group.max}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </aside>
            )}

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {/* Header */}
              <div className="mb-6">
                {/* Results Count & Query */}
                <div className="mb-4">
                  <h2 className="text-2xl font-bold mb-1">
                    {query ? `Results for "${query}"` : 'All Results'}
                  </h2>
                  <p className="text-muted-foreground">
                    {totalResults !== undefined
                      ? `${totalResults} ${totalResults === 1 ? 'result' : 'results'} found`
                      : `${results.length} ${results.length === 1 ? 'result' : 'results'}`}
                  </p>
                </div>

                {/* Controls Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b">
                  {/* Mobile Filter Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onToggleFilters}
                    className="lg:hidden"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filters
                  </Button>

                  <div className="flex items-center gap-3 ml-auto">
                    {/* Sort */}
                    <select
                      value={currentSort}
                      onChange={(e) => onSortChange?.(e.target.value)}
                      className="h-9 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    {/* View Toggle */}
                    <div className="flex border border-input rounded-md overflow-hidden">
                      <button
                        onClick={() => onViewModeChange?.('grid')}
                        className={cn(
                          'p-2 transition-colors',
                          viewMode === 'grid'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background hover:bg-accent'
                        )}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onViewModeChange?.('list')}
                        className={cn(
                          'p-2 transition-colors',
                          viewMode === 'list'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background hover:bg-accent'
                        )}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="py-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="mt-4 text-muted-foreground">Loading results...</p>
                </div>
              )}

              {/* Results Grid/List */}
              {!loading && results.length > 0 && (
                <div
                  className={cn(
                    'gap-6',
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                      : 'flex flex-col'
                  )}
                >
                  {results.map((pkg) => (
                    <Card
                      key={pkg.id}
                      hoverable
                      vertical={pkg.vertical}
                      className={cn(
                        'group cursor-pointer overflow-hidden',
                        viewMode === 'list' && 'flex flex-row'
                      )}
                      onClick={() => onPackageClick?.(pkg)}
                    >
                      {/* Image */}
                      <div
                        className={cn(
                          'relative overflow-hidden',
                          viewMode === 'grid' ? 'aspect-[4/3]' : 'w-64 shrink-0 aspect-[4/3]'
                        )}
                      >
                        <img
                          src={pkg.image}
                          alt={pkg.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge vertical={pkg.vertical}>
                            {pkg.vertical.charAt(0).toUpperCase() + pkg.vertical.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 flex-1">
                        <h3 className="font-semibold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                          {pkg.title}
                        </h3>
                        {pkg.location && (
                          <p className="text-sm text-muted-foreground mb-2">📍 {pkg.location}</p>
                        )}
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {pkg.description}
                        </p>
                        <div className="flex items-center justify-between pt-3 border-t">
                          {pkg.rating && (
                            <div className="flex items-center gap-1 text-sm">
                              <span className="text-yellow-500">★</span>
                              <span className="font-medium">{pkg.rating.toFixed(1)}</span>
                            </div>
                          )}
                          <div className="font-bold text-lg">
                            {formatPrice(pkg.price, pkg.currency)}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loading && results.length === 0 && (
                <div className="py-12 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search or filters
                  </p>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Clear Search
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {!loading && results.length > 0 && totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange?.(currentPage - 1)}
                  >
                    Previous
                  </Button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => onPageChange?.(page)}
                      >
                        {page}
                      </Button>
                    )
                  })}

                  {totalPages > 5 && <span className="text-muted-foreground">...</span>}

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange?.(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    )
  }
)
SearchResults.displayName = 'SearchResults'

export { SearchResults }
