// Mock implementation for SearchResults component
// This will be replaced with actual implementation

import React from 'react'

interface SearchResultsProps {
  query: string
  results: any[]
  loading: boolean
  totalCount: number
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onSortChange: (sort: string) => void
  onViewModeChange: (mode: string) => void
  viewMode: 'grid' | 'list'
  sortBy: string
  error?: string
  onRetry?: () => void
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  results,
  loading,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
  onSortChange,
  onViewModeChange,
  viewMode,
  sortBy,
  error,
  onRetry,
}) => {
  if (loading) {
    return (
      <div data-testid="search-results-loading">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} data-testid="package-card-skeleton">Loading...</div>
        ))}
        <div data-testid="loading-overlay">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <div>Something went wrong</div>
        <div>{error}</div>
        <button onClick={onRetry}>Try again</button>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div>
        <div>No results found</div>
        <div>Try adjusting your search</div>
        <div>Popular searches</div>
        <div>Events in Lagos</div>
        <div>Hotels in Accra</div>
      </div>
    )
  }

  return (
    <div>
      <h1>Search Results</h1>
      <div aria-live="polite">{totalCount} results found for "{query}"</div>
      
      <div>
        <button
          className={viewMode === 'grid' ? 'active' : ''}
          onClick={() => onViewModeChange('grid')}
          aria-label="Switch to grid view"
        >
          Grid View
        </button>
        <button
          className={viewMode === 'list' ? 'active' : ''}
          onClick={() => onViewModeChange('list')}
          aria-label="Switch to list view"
        >
          List View
        </button>
      </div>

      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label="Sort search results"
      >
        <option value="relevance">Relevance</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="rating">Rating</option>
        <option value="date">Date</option>
      </select>

      <div
        data-testid={viewMode === 'grid' ? 'search-results-grid' : 'search-results-list'}
        className={viewMode}
      >
        {results.map((result) => (
          <div key={result.id}>
            <h3>{result.title}</h3>
            <p>{result.description}</p>
            <div>{result.price}</div>
            <div>{result.location}</div>
            <div>{result.vendor?.businessName}</div>
            <div>{result.rating}</div>
            <div>({result.reviewCount} reviews)</div>
          </div>
        ))}
      </div>

      <nav aria-label="Pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            aria-label={`Page ${i + 1}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </nav>
    </div>
  )
}

export default SearchResults
