/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchFilters } from '../SearchFilters'

// Mock date picker
jest.mock('@/components/ui/DatePicker', () => ({
  DatePicker: ({ value, onChange, placeholder }: any) => (
    <input
      data-testid="date-picker"
      type="date"
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
    />
  ),
}))

// Mock price range slider
jest.mock('@/components/ui/PriceRangeSlider', () => ({
  PriceRangeSlider: ({ min, max, value, onChange }: any) => (
    <div data-testid="price-range-slider">
      <input
        data-testid="min-price"
        type="number"
        value={value[0]}
        onChange={(e) => onChange([parseInt(e.target.value), value[1]])}
      />
      <input
        data-testid="max-price"
        type="number"
        value={value[1]}
        onChange={(e) => onChange([value[0], parseInt(e.target.value)])}
      />
    </div>
  ),
}))

describe('SearchFilters Component', () => {
  const defaultProps = {
    filters: {
      type: '',
      city: '',
      minPrice: 0,
      maxPrice: 1000000,
      startDate: '',
      endDate: '',
      categories: [],
    },
    onFiltersChange: jest.fn(),
    onClearFilters: jest.fn(),
    isLoading: false,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders all filter sections', () => {
      render(<SearchFilters {...defaultProps} />)

      expect(screen.getByText(/package type/i)).toBeInTheDocument()
      expect(screen.getByText(/location/i)).toBeInTheDocument()
      expect(screen.getByText(/price range/i)).toBeInTheDocument()
      expect(screen.getByText(/dates/i)).toBeInTheDocument()
      expect(screen.getByText(/categories/i)).toBeInTheDocument()
    })

    it('renders clear filters button', () => {
      render(<SearchFilters {...defaultProps} />)

      expect(screen.getByRole('button', { name: /clear all filters/i })).toBeInTheDocument()
    })

    it('shows filter count when filters are applied', () => {
      const filtersWithValues = {
        ...defaultProps.filters,
        type: 'EVENT',
        city: 'Lagos',
        minPrice: 10000,
      }

      render(<SearchFilters {...defaultProps} filters={filtersWithValues} />)

      expect(screen.getByText(/3 filters applied/i)).toBeInTheDocument()
    })

    it('hides filter count when no filters applied', () => {
      render(<SearchFilters {...defaultProps} />)

      expect(screen.queryByText(/filters applied/i)).not.toBeInTheDocument()
    })
  })

  describe('Package Type Filter', () => {
    it('renders package type options', () => {
      render(<SearchFilters {...defaultProps} />)

      expect(screen.getByLabelText(/all types/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/events/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/stays/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/experiences/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/car rentals/i)).toBeInTheDocument()
    })

    it('selects package type', async () => {
      const user = userEvent.setup()
      const onFiltersChange = jest.fn()
      render(<SearchFilters {...defaultProps} onFiltersChange={onFiltersChange} />)

      await user.click(screen.getByLabelText(/events/i))

      expect(onFiltersChange).toHaveBeenCalledWith({
        ...defaultProps.filters,
        type: 'EVENT',
      })
    })

    it('shows selected package type', () => {
      const filtersWithType = {
        ...defaultProps.filters,
        type: 'EVENT',
      }

      render(<SearchFilters {...defaultProps} filters={filtersWithType} />)

      expect(screen.getByLabelText(/events/i)).toBeChecked()
    })

    it('clears package type when "All Types" selected', async () => {
      const user = userEvent.setup()
      const onFiltersChange = jest.fn()
      const filtersWithType = {
        ...defaultProps.filters,
        type: 'EVENT',
      }

      render(<SearchFilters {...defaultProps} filters={filtersWithType} onFiltersChange={onFiltersChange} />)

      await user.click(screen.getByLabelText(/all types/i))

      expect(onFiltersChange).toHaveBeenCalledWith({
        ...defaultProps.filters,
        type: '',
      })
    })
  })

  describe('Location Filter', () => {
    it('renders location dropdown', () => {
      render(<SearchFilters {...defaultProps} />)

      expect(screen.getByRole('combobox', { name: /select city/i })).toBeInTheDocument()
    })

    it('shows available cities', async () => {
      const user = userEvent.setup()
      render(<SearchFilters {...defaultProps} />)

      const citySelect = screen.getByRole('combobox', { name: /select city/i })
      await user.click(citySelect)

      expect(screen.getByRole('option', { name: /all cities/i })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: /lagos/i })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: /accra/i })).toBeInTheDocument()
    })

    it('selects city', async () => {
      const user = userEvent.setup()
      const onFiltersChange = jest.fn()
      render(<SearchFilters {...defaultProps} onFiltersChange={onFiltersChange} />)

      const citySelect = screen.getByRole('combobox', { name: /select city/i })
      await user.selectOptions(citySelect, 'Lagos')

      expect(onFiltersChange).toHaveBeenCalledWith({
        ...defaultProps.filters,
        city: 'Lagos',
      })
    })

    it('shows selected city', () => {
      const filtersWithCity = {
        ...defaultProps.filters,
        city: 'Lagos',
      }

      render(<SearchFilters {...defaultProps} filters={filtersWithCity} />)

      expect(screen.getByRole('combobox', { name: /select city/i })).toHaveValue('Lagos')
    })
  })

  describe('Price Range Filter', () => {
    it('renders price range slider', () => {
      render(<SearchFilters {...defaultProps} />)

      expect(screen.getByTestId('price-range-slider')).toBeInTheDocument()
      expect(screen.getByTestId('min-price')).toBeInTheDocument()
      expect(screen.getByTestId('max-price')).toBeInTheDocument()
    })

    it('updates price range', async () => {
      const user = userEvent.setup()
      const onFiltersChange = jest.fn()
      render(<SearchFilters {...defaultProps} onFiltersChange={onFiltersChange} />)

      const minPriceInput = screen.getByTestId('min-price')
      await user.clear(minPriceInput)
      await user.type(minPriceInput, '10000')

      expect(onFiltersChange).toHaveBeenCalledWith({
        ...defaultProps.filters,
        minPrice: 10000,
      })
    })

    it('shows current price range', () => {
      const filtersWithPrice = {
        ...defaultProps.filters,
        minPrice: 10000,
        maxPrice: 100000,
      }

      render(<SearchFilters {...defaultProps} filters={filtersWithPrice} />)

      expect(screen.getByTestId('min-price')).toHaveValue(10000)
      expect(screen.getByTestId('max-price')).toHaveValue(100000)
    })

    it('displays formatted price labels', () => {
      const filtersWithPrice = {
        ...defaultProps.filters,
        minPrice: 10000,
        maxPrice: 100000,
      }

      render(<SearchFilters {...defaultProps} filters={filtersWithPrice} />)

      expect(screen.getByText('₦10,000')).toBeInTheDocument()
      expect(screen.getByText('₦100,000')).toBeInTheDocument()
    })

    it('validates price range (min < max)', async () => {
      const user = userEvent.setup()
      const onFiltersChange = jest.fn()
      render(<SearchFilters {...defaultProps} onFiltersChange={onFiltersChange} />)

      const minPriceInput = screen.getByTestId('min-price')
      const maxPriceInput = screen.getByTestId('max-price')

      await user.clear(minPriceInput)
      await user.type(minPriceInput, '100000')
      await user.clear(maxPriceInput)
      await user.type(maxPriceInput, '50000')

      expect(screen.getByText(/minimum price cannot be greater than maximum/i)).toBeInTheDocument()
    })
  })

  describe('Date Range Filter', () => {
    it('renders date pickers', () => {
      render(<SearchFilters {...defaultProps} />)

      const datePickers = screen.getAllByTestId('date-picker')
      expect(datePickers).toHaveLength(2) // Start and end date
    })

    it('updates start date', async () => {
      const user = userEvent.setup()
      const onFiltersChange = jest.fn()
      render(<SearchFilters {...defaultProps} onFiltersChange={onFiltersChange} />)

      const startDatePicker = screen.getAllByTestId('date-picker')[0]
      await user.type(startDatePicker, '2025-12-01')

      expect(onFiltersChange).toHaveBeenCalledWith({
        ...defaultProps.filters,
        startDate: '2025-12-01',
      })
    })

    it('updates end date', async () => {
      const user = userEvent.setup()
      const onFiltersChange = jest.fn()
      render(<SearchFilters {...defaultProps} onFiltersChange={onFiltersChange} />)

      const endDatePicker = screen.getAllByTestId('date-picker')[1]
      await user.type(endDatePicker, '2025-12-31')

      expect(onFiltersChange).toHaveBeenCalledWith({
        ...defaultProps.filters,
        endDate: '2025-12-31',
      })
    })

    it('validates date range (start < end)', async () => {
      const user = userEvent.setup()
      const filtersWithDates = {
        ...defaultProps.filters,
        startDate: '2025-12-31',
        endDate: '2025-12-01',
      }

      render(<SearchFilters {...defaultProps} filters={filtersWithDates} />)

      expect(screen.getByText(/start date cannot be after end date/i)).toBeInTheDocument()
    })

    it('shows quick date presets', () => {
      render(<SearchFilters {...defaultProps} />)

      expect(screen.getByRole('button', { name: /today/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /this weekend/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /next week/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /this month/i })).toBeInTheDocument()
    })

    it('applies quick date preset', async () => {
      const user = userEvent.setup()
      const onFiltersChange = jest.fn()
      render(<SearchFilters {...defaultProps} onFiltersChange={onFiltersChange} />)

      await user.click(screen.getByRole('button', { name: /this weekend/i }))

      expect(onFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          startDate: expect.any(String),
          endDate: expect.any(String),
        })
      )
    })
  })

  describe('Category Filter', () => {
    it('renders category checkboxes', () => {
      render(<SearchFilters {...defaultProps} />)

      expect(screen.getByLabelText(/beach/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/music/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/food/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/nightlife/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/culture/i)).toBeInTheDocument()
    })

    it('selects multiple categories', async () => {
      const user = userEvent.setup()
      const onFiltersChange = jest.fn()
      render(<SearchFilters {...defaultProps} onFiltersChange={onFiltersChange} />)

      await user.click(screen.getByLabelText(/beach/i))
      await user.click(screen.getByLabelText(/music/i))

      expect(onFiltersChange).toHaveBeenCalledWith({
        ...defaultProps.filters,
        categories: ['beach', 'music'],
      })
    })

    it('deselects categories', async () => {
      const user = userEvent.setup()
      const onFiltersChange = jest.fn()
      const filtersWithCategories = {
        ...defaultProps.filters,
        categories: ['beach', 'music'],
      }

      render(<SearchFilters {...defaultProps} filters={filtersWithCategories} onFiltersChange={onFiltersChange} />)

      await user.click(screen.getByLabelText(/beach/i))

      expect(onFiltersChange).toHaveBeenCalledWith({
        ...defaultProps.filters,
        categories: ['music'],
      })
    })

    it('shows selected categories', () => {
      const filtersWithCategories = {
        ...defaultProps.filters,
        categories: ['beach', 'music'],
      }

      render(<SearchFilters {...defaultProps} filters={filtersWithCategories} />)

      expect(screen.getByLabelText(/beach/i)).toBeChecked()
      expect(screen.getByLabelText(/music/i)).toBeChecked()
      expect(screen.getByLabelText(/food/i)).not.toBeChecked()
    })
  })

  describe('Clear Filters', () => {
    it('clears all filters', async () => {
      const user = userEvent.setup()
      const onClearFilters = jest.fn()
      const filtersWithValues = {
        type: 'EVENT',
        city: 'Lagos',
        minPrice: 10000,
        maxPrice: 100000,
        startDate: '2025-12-01',
        endDate: '2025-12-31',
        categories: ['beach', 'music'],
      }

      render(<SearchFilters {...defaultProps} filters={filtersWithValues} onClearFilters={onClearFilters} />)

      await user.click(screen.getByRole('button', { name: /clear all filters/i }))

      expect(onClearFilters).toHaveBeenCalled()
    })

    it('disables clear button when no filters applied', () => {
      render(<SearchFilters {...defaultProps} />)

      expect(screen.getByRole('button', { name: /clear all filters/i })).toBeDisabled()
    })

    it('enables clear button when filters applied', () => {
      const filtersWithValues = {
        ...defaultProps.filters,
        type: 'EVENT',
      }

      render(<SearchFilters {...defaultProps} filters={filtersWithValues} />)

      expect(screen.getByRole('button', { name: /clear all filters/i })).toBeEnabled()
    })
  })

  describe('Loading State', () => {
    it('shows loading state', () => {
      render(<SearchFilters {...defaultProps} isLoading={true} />)

      expect(screen.getByTestId('filters-loading')).toBeInTheDocument()
    })

    it('disables interactions during loading', () => {
      render(<SearchFilters {...defaultProps} isLoading={true} />)

      expect(screen.getByLabelText(/events/i)).toBeDisabled()
      expect(screen.getByRole('combobox', { name: /select city/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /clear all filters/i })).toBeDisabled()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<SearchFilters {...defaultProps} />)

      expect(screen.getByRole('group', { name: /package type/i })).toBeInTheDocument()
      expect(screen.getByRole('group', { name: /location/i })).toBeInTheDocument()
      expect(screen.getByRole('group', { name: /price range/i })).toBeInTheDocument()
      expect(screen.getByRole('group', { name: /dates/i })).toBeInTheDocument()
      expect(screen.getByRole('group', { name: /categories/i })).toBeInTheDocument()
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<SearchFilters {...defaultProps} />)

      // Tab through filter controls
      await user.tab()
      expect(screen.getByLabelText(/all types/i)).toHaveFocus()

      await user.tab()
      expect(screen.getByLabelText(/events/i)).toHaveFocus()
    })

    it('announces filter changes to screen readers', async () => {
      const user = userEvent.setup()
      render(<SearchFilters {...defaultProps} />)

      await user.click(screen.getByLabelText(/events/i))

      expect(screen.getByText(/filter applied: events/i)).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('Mobile Responsiveness', () => {
    it('collapses filters on mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      render(<SearchFilters {...defaultProps} />)

      expect(screen.getByRole('button', { name: /filters/i })).toBeInTheDocument()
      expect(screen.getByTestId('mobile-filter-toggle')).toBeInTheDocument()
    })

    it('expands filters when toggle clicked on mobile', async () => {
      const user = userEvent.setup()
      
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      render(<SearchFilters {...defaultProps} />)

      await user.click(screen.getByRole('button', { name: /filters/i }))

      expect(screen.getByTestId('expanded-filters')).toBeVisible()
    })
  })
})
