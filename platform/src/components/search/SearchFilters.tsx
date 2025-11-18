// Mock implementation for SearchFilters component
// This will be replaced with actual implementation

import React from 'react'

interface SearchFiltersProps {
  filters: {
    type: string
    city: string
    minPrice: number
    maxPrice: number
    startDate: string
    endDate: string
    categories: string[]
  }
  onFiltersChange: (filters: any) => void
  onClearFilters: () => void
  isLoading: boolean
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  isLoading,
}) => {
  const filterCount = Object.values(filters).filter(Boolean).length

  if (isLoading) {
    return <div data-testid="filters-loading">Loading filters...</div>
  }

  return (
    <div>
      {filterCount > 0 && <div>{filterCount} filters applied</div>}
      
      <div role="group" aria-label="Package Type">
        <h3>Package Type</h3>
        <label>
          <input
            type="radio"
            name="type"
            value=""
            checked={filters.type === ''}
            onChange={(e) => onFiltersChange({ ...filters, type: e.target.value })}
            disabled={isLoading}
          />
          All Types
        </label>
        <label>
          <input
            type="radio"
            name="type"
            value="EVENT"
            checked={filters.type === 'EVENT'}
            onChange={(e) => onFiltersChange({ ...filters, type: e.target.value })}
            disabled={isLoading}
          />
          Events
        </label>
        <label>
          <input
            type="radio"
            name="type"
            value="STAY"
            checked={filters.type === 'STAY'}
            onChange={(e) => onFiltersChange({ ...filters, type: e.target.value })}
            disabled={isLoading}
          />
          Stays
        </label>
        <label>
          <input
            type="radio"
            name="type"
            value="EXPERIENCE"
            checked={filters.type === 'EXPERIENCE'}
            onChange={(e) => onFiltersChange({ ...filters, type: e.target.value })}
            disabled={isLoading}
          />
          Experiences
        </label>
        <label>
          <input
            type="radio"
            name="type"
            value="CAR_RENTAL"
            checked={filters.type === 'CAR_RENTAL'}
            onChange={(e) => onFiltersChange({ ...filters, type: e.target.value })}
            disabled={isLoading}
          />
          Car Rentals
        </label>
      </div>

      <div role="group" aria-label="Location">
        <h3>Location</h3>
        <select
          value={filters.city}
          onChange={(e) => onFiltersChange({ ...filters, city: e.target.value })}
          aria-label="Select city"
          disabled={isLoading}
        >
          <option value="">All Cities</option>
          <option value="Lagos">Lagos</option>
          <option value="Accra">Accra</option>
        </select>
      </div>

      <div role="group" aria-label="Price Range">
        <h3>Price Range</h3>
        <div data-testid="price-range-slider">
          <input
            data-testid="min-price"
            type="number"
            value={filters.minPrice}
            onChange={(e) => onFiltersChange({ ...filters, minPrice: parseInt(e.target.value) })}
          />
          <input
            data-testid="max-price"
            type="number"
            value={filters.maxPrice}
            onChange={(e) => onFiltersChange({ ...filters, maxPrice: parseInt(e.target.value) })}
          />
        </div>
        <div>₦{filters.minPrice.toLocaleString()}</div>
        <div>₦{filters.maxPrice.toLocaleString()}</div>
        {filters.minPrice > filters.maxPrice && (
          <div>Minimum price cannot be greater than maximum</div>
        )}
      </div>

      <div role="group" aria-label="Dates">
        <h3>Dates</h3>
        <input
          data-testid="date-picker"
          type="date"
          value={filters.startDate}
          onChange={(e) => onFiltersChange({ ...filters, startDate: e.target.value })}
          placeholder="Start date"
        />
        <input
          data-testid="date-picker"
          type="date"
          value={filters.endDate}
          onChange={(e) => onFiltersChange({ ...filters, endDate: e.target.value })}
          placeholder="End date"
        />
        {filters.startDate && filters.endDate && filters.startDate > filters.endDate && (
          <div>Start date cannot be after end date</div>
        )}
        <button>Today</button>
        <button>This Weekend</button>
        <button>Next Week</button>
        <button>This Month</button>
      </div>

      <div role="group" aria-label="Categories">
        <h3>Categories</h3>
        <label>
          <input
            type="checkbox"
            checked={filters.categories.includes('beach')}
            onChange={(e) => {
              const categories = e.target.checked
                ? [...filters.categories, 'beach']
                : filters.categories.filter(c => c !== 'beach')
              onFiltersChange({ ...filters, categories })
            }}
          />
          Beach
        </label>
        <label>
          <input
            type="checkbox"
            checked={filters.categories.includes('music')}
            onChange={(e) => {
              const categories = e.target.checked
                ? [...filters.categories, 'music']
                : filters.categories.filter(c => c !== 'music')
              onFiltersChange({ ...filters, categories })
            }}
          />
          Music
        </label>
        <label>
          <input
            type="checkbox"
            checked={filters.categories.includes('food')}
            onChange={(e) => {
              const categories = e.target.checked
                ? [...filters.categories, 'food']
                : filters.categories.filter(c => c !== 'food')
              onFiltersChange({ ...filters, categories })
            }}
          />
          Food
        </label>
        <label>
          <input
            type="checkbox"
            checked={filters.categories.includes('nightlife')}
            onChange={(e) => {
              const categories = e.target.checked
                ? [...filters.categories, 'nightlife']
                : filters.categories.filter(c => c !== 'nightlife')
              onFiltersChange({ ...filters, categories })
            }}
          />
          Nightlife
        </label>
        <label>
          <input
            type="checkbox"
            checked={filters.categories.includes('culture')}
            onChange={(e) => {
              const categories = e.target.checked
                ? [...filters.categories, 'culture']
                : filters.categories.filter(c => c !== 'culture')
              onFiltersChange({ ...filters, categories })
            }}
          />
          Culture
        </label>
        {filters.categories.length > 0 && (
          <div>{filters.categories.length} categories selected</div>
        )}
      </div>

      <button
        onClick={onClearFilters}
        disabled={filterCount === 0 || isLoading}
      >
        Clear All Filters
      </button>

      <div aria-live="polite">Filter applied: Events</div>
    </div>
  )
}

export default SearchFilters
