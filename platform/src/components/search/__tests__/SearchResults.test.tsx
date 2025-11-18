/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchResults } from '../SearchResults'

// Mock search API
const mockSearchAPI = {
  search: jest.fn(),
  getFilters: jest.fn(),
}

jest.mock('@/lib/api/search', () => ({
  searchAPI: mockSearchAPI,
}))

// Mock router
const mockPush = jest.fn()
const mockQuery = { q: 'Lagos events' }
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    query: mockQuery,
  }),
  useSearchParams: () => new URLSearchParams('q=Lagos+events'),
}))

// Mock package data
const mockPackages = [
  {
    id: 'pkg-1',
    title: 'Lagos Beach Party',
    description: 'Amazing beach party in Lagos',
    price: 50000,
    currency: 'NGN',
    type: 'EVENT',
    location: 'Victoria Island, Lagos',
    images: ['https://example.com/image1.jpg'],
    startDate: '2025-12-25T18:00:00Z',
    vendor: {
      id: 'vendor-1',
      businessName: 'Party Planners Lagos',
    },
    rating: 4.5,
    reviewCount: 23,
  },
  {
    id: 'pkg-2',
    title: 'Luxury Hotel Stay',
    description: '5-star hotel in Ikoyi',
    price: 120000,
    currency: 'NGN',
    type: 'STAY',
    location: 'Ikoyi, Lagos',
    images: ['https://example.com/image2.jpg'],
    startDate: '2025-12-20T15:00:00Z',
    vendor: {
      id: 'vendor-2',
      businessName: 'Luxury Hotels Ltd',
    },
    rating: 4.8,
    reviewCount: 45,
  },
]

describe('SearchResults Component', () => {
  const defaultProps = {
    query: 'Lagos events',
    results: mockPackages,
    loading: false,
    totalCount: 2,
    currentPage: 1,
    totalPages: 1,
    onPageChange: jest.fn(),
    onSortChange: jest.fn(),
    onViewModeChange: jest.fn(),
    viewMode: 'grid' as const,
    sortBy: 'relevance' as const,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders search results header with count', () => {
      render(<SearchResults {...defaultProps} />)
      
      expect(screen.getByText(/2 results found for "Lagos events"/i)).toBeInTheDocument()
    })

    it('renders all search result items', () => {
      render(<SearchResults {...defaultProps} />)
      
      expect(screen.getByText('Lagos Beach Party')).toBeInTheDocument()
      expect(screen.getByText('Luxury Hotel Stay')).toBeInTheDocument()
    })

    it('renders view mode toggle buttons', () => {
      render(<SearchResults {...defaultProps} />)
      
      expect(screen.getByRole('button', { name: /grid view/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /list view/i })).toBeInTheDocument()
    })

    it('renders sort dropdown', () => {
      render(<SearchResults {...defaultProps} />)
      
      expect(screen.getByRole('combobox', { name: /sort by/i })).toBeInTheDocument()
    })

    it('renders pagination when multiple pages', () => {
      render(<SearchResults {...defaultProps} totalPages={3} />)
      
      expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('shows loading skeleton when loading', () => {
      render(<SearchResults {...defaultProps} loading={true} results={[]} />)
      
      expect(screen.getByTestId('search-results-loading')).toBeInTheDocument()
      expect(screen.getAllByTestId('package-card-skeleton')).toHaveLength(6) // Default skeleton count
    })

    it('shows loading overlay when loading more results', () => {
      render(<SearchResults {...defaultProps} loading={true} />)
      
      expect(screen.getByTestId('loading-overlay')).toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('shows empty state when no results', () => {
      render(<SearchResults {...defaultProps} results={[]} totalCount={0} />)
      
      expect(screen.getByText(/no results found/i)).toBeInTheDocument()
      expect(screen.getByText(/try adjusting your search/i)).toBeInTheDocument()
    })

    it('shows search suggestions in empty state', () => {
      render(<SearchResults {...defaultProps} results={[]} totalCount={0} />)
      
      expect(screen.getByText(/popular searches/i)).toBeInTheDocument()
      expect(screen.getByText('Events in Lagos')).toBeInTheDocument()
      expect(screen.getByText('Hotels in Accra')).toBeInTheDocument()
    })

    it('handles empty state suggestion clicks', async () => {
      const user = userEvent.setup()
      render(<SearchResults {...defaultProps} results={[]} totalCount={0} />)
      
      await user.click(screen.getByText('Events in Lagos'))
      
      expect(mockPush).toHaveBeenCalledWith('/search?q=Events+in+Lagos')
    })
  })

  describe('View Mode Toggle', () => {
    it('switches to list view when list button clicked', async () => {
      const user = userEvent.setup()
      const onViewModeChange = jest.fn()
      render(<SearchResults {...defaultProps} onViewModeChange={onViewModeChange} />)
      
      await user.click(screen.getByRole('button', { name: /list view/i }))
      
      expect(onViewModeChange).toHaveBeenCalledWith('list')
    })

    it('switches to grid view when grid button clicked', async () => {
      const user = userEvent.setup()
      const onViewModeChange = jest.fn()
      render(<SearchResults {...defaultProps} viewMode="list" onViewModeChange={onViewModeChange} />)
      
      await user.click(screen.getByRole('button', { name: /grid view/i }))
      
      expect(onViewModeChange).toHaveBeenCalledWith('grid')
    })

    it('shows active state for current view mode', () => {
      render(<SearchResults {...defaultProps} viewMode="grid" />)
      
      expect(screen.getByRole('button', { name: /grid view/i })).toHaveClass('active')
      expect(screen.getByRole('button', { name: /list view/i })).not.toHaveClass('active')
    })

    it('renders results in grid layout', () => {
      render(<SearchResults {...defaultProps} viewMode="grid" />)
      
      const resultsContainer = screen.getByTestId('search-results-grid')
      expect(resultsContainer).toHaveClass('grid')
    })

    it('renders results in list layout', () => {
      render(<SearchResults {...defaultProps} viewMode="list" />)
      
      const resultsContainer = screen.getByTestId('search-results-list')
      expect(resultsContainer).toHaveClass('list')
    })
  })

  describe('Sorting', () => {
    it('changes sort order when dropdown selection changes', async () => {
      const user = userEvent.setup()
      const onSortChange = jest.fn()
      render(<SearchResults {...defaultProps} onSortChange={onSortChange} />)
      
      const sortSelect = screen.getByRole('combobox', { name: /sort by/i })
      await user.selectOptions(sortSelect, 'price-low')
      
      expect(onSortChange).toHaveBeenCalledWith('price-low')
    })

    it('shows current sort option as selected', () => {
      render(<SearchResults {...defaultProps} sortBy="price-high" />)
      
      const sortSelect = screen.getByRole('combobox', { name: /sort by/i })
      expect(sortSelect).toHaveValue('price-high')
    })

    it('includes all sort options', () => {
      render(<SearchResults {...defaultProps} />)
      
      const sortSelect = screen.getByRole('combobox', { name: /sort by/i })
      
      expect(screen.getByRole('option', { name: /relevance/i })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: /price: low to high/i })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: /price: high to low/i })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: /rating/i })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: /date/i })).toBeInTheDocument()
    })
  })

  describe('Pagination', () => {
    it('calls onPageChange when page number clicked', async () => {
      const user = userEvent.setup()
      const onPageChange = jest.fn()
      render(<SearchResults {...defaultProps} totalPages={3} currentPage={1} onPageChange={onPageChange} />)
      
      await user.click(screen.getByRole('button', { name: 'Page 2' }))
      
      expect(onPageChange).toHaveBeenCalledWith(2)
    })

    it('calls onPageChange when next button clicked', async () => {
      const user = userEvent.setup()
      const onPageChange = jest.fn()
      render(<SearchResults {...defaultProps} totalPages={3} currentPage={1} onPageChange={onPageChange} />)
      
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      expect(onPageChange).toHaveBeenCalledWith(2)
    })

    it('calls onPageChange when previous button clicked', async () => {
      const user = userEvent.setup()
      const onPageChange = jest.fn()
      render(<SearchResults {...defaultProps} totalPages={3} currentPage={2} onPageChange={onPageChange} />)
      
      await user.click(screen.getByRole('button', { name: /previous/i }))
      
      expect(onPageChange).toHaveBeenCalledWith(1)
    })

    it('disables previous button on first page', () => {
      render(<SearchResults {...defaultProps} totalPages={3} currentPage={1} />)
      
      expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled()
    })

    it('disables next button on last page', () => {
      render(<SearchResults {...defaultProps} totalPages={3} currentPage={3} />)
      
      expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
    })
  })

  describe('Package Cards', () => {
    it('renders package information correctly', () => {
      render(<SearchResults {...defaultProps} />)
      
      // Check first package
      expect(screen.getByText('Lagos Beach Party')).toBeInTheDocument()
      expect(screen.getByText('Amazing beach party in Lagos')).toBeInTheDocument()
      expect(screen.getByText('₦50,000')).toBeInTheDocument()
      expect(screen.getByText('Victoria Island, Lagos')).toBeInTheDocument()
      expect(screen.getByText('Party Planners Lagos')).toBeInTheDocument()
      
      // Check rating
      expect(screen.getByText('4.5')).toBeInTheDocument()
      expect(screen.getByText('(23 reviews)')).toBeInTheDocument()
    })

    it('navigates to package detail when card clicked', async () => {
      const user = userEvent.setup()
      render(<SearchResults {...defaultProps} />)
      
      await user.click(screen.getByText('Lagos Beach Party'))
      
      expect(mockPush).toHaveBeenCalledWith('/packages/pkg-1')
    })

    it('shows package type badges', () => {
      render(<SearchResults {...defaultProps} />)
      
      expect(screen.getByText('Event')).toBeInTheDocument()
      expect(screen.getByText('Stay')).toBeInTheDocument()
    })

    it('formats dates correctly', () => {
      render(<SearchResults {...defaultProps} />)
      
      expect(screen.getByText('Dec 25, 2025')).toBeInTheDocument()
      expect(screen.getByText('Dec 20, 2025')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(<SearchResults {...defaultProps} />)
      
      expect(screen.getByRole('heading', { level: 1, name: /search results/i })).toBeInTheDocument()
    })

    it('has proper ARIA labels for controls', () => {
      render(<SearchResults {...defaultProps} />)
      
      expect(screen.getByRole('combobox', { name: /sort by/i })).toHaveAttribute('aria-label', 'Sort search results')
      expect(screen.getByRole('button', { name: /grid view/i })).toHaveAttribute('aria-label', 'Switch to grid view')
      expect(screen.getByRole('button', { name: /list view/i })).toHaveAttribute('aria-label', 'Switch to list view')
    })

    it('announces result count to screen readers', () => {
      render(<SearchResults {...defaultProps} />)
      
      const resultCount = screen.getByText(/2 results found/i)
      expect(resultCount).toHaveAttribute('aria-live', 'polite')
    })

    it('supports keyboard navigation for pagination', async () => {
      const user = userEvent.setup()
      render(<SearchResults {...defaultProps} totalPages={3} />)
      
      // Tab to pagination
      await user.tab()
      expect(screen.getByRole('button', { name: 'Page 1' })).toHaveFocus()
      
      // Arrow key navigation
      await user.keyboard('{ArrowRight}')
      expect(screen.getByRole('button', { name: 'Page 2' })).toHaveFocus()
    })
  })

  describe('Error Handling', () => {
    it('shows error state when search fails', () => {
      render(<SearchResults {...defaultProps} error="Search failed" />)
      
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      expect(screen.getByText('Search failed')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
    })

    it('retries search when try again button clicked', async () => {
      const user = userEvent.setup()
      const onRetry = jest.fn()
      render(<SearchResults {...defaultProps} error="Search failed" onRetry={onRetry} />)
      
      await user.click(screen.getByRole('button', { name: /try again/i }))
      
      expect(onRetry).toHaveBeenCalled()
    })
  })
})
