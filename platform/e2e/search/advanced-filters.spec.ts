import { test, expect } from '@playwright/test'

test.describe('Advanced Search Filters', () => {
  test.beforeEach(async ({ page }) => {
    // Mock filter options API
    await page.route('/api/search/filters**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          filters: {
            cities: [
              { value: 'Lagos', label: 'Lagos', count: 150 },
              { value: 'Accra', label: 'Accra', count: 89 },
              { value: 'Abuja', label: 'Abuja', count: 45 },
            ],
            categories: [
              { value: 'beach', label: 'Beach', count: 67 },
              { value: 'music', label: 'Music', count: 45 },
              { value: 'food', label: 'Food', count: 34 },
              { value: 'nightlife', label: 'Nightlife', count: 28 },
            ],
            priceRange: { min: 5000, max: 500000 },
            packageTypes: [
              { value: 'EVENT', label: 'Events' },
              { value: 'STAY', label: 'Stays' },
              { value: 'EXPERIENCE', label: 'Experiences' },
              { value: 'CAR_RENTAL', label: 'Car Rentals' },
            ],
          },
        }),
      })
    })

    // Mock search API with filters
    await page.route('/api/search**', async (route) => {
      const url = new URL(route.request().url())
      const type = url.searchParams.get('type')
      const city = url.searchParams.get('city')
      const minPrice = url.searchParams.get('minPrice')
      const maxPrice = url.searchParams.get('maxPrice')
      const categories = url.searchParams.get('categories')

      let results = []
      let totalCount = 0

      // Mock filtered results based on parameters
      if (type === 'EVENT' && city === 'Lagos') {
        results = [
          {
            id: 'pkg-1',
            title: 'Lagos Beach Party',
            description: 'Amazing beach party',
            price: 50000,
            currency: 'NGN',
            type: 'EVENT',
            location: 'Victoria Island, Lagos',
            vendor: { businessName: 'Party Co' },
            rating: 4.5,
            reviewCount: 23,
          },
        ]
        totalCount = 1
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          results,
          totalCount,
          query: url.searchParams.get('q') || '',
          pagination: {
            currentPage: 1,
            totalPages: Math.ceil(totalCount / 20),
            hasNextPage: false,
            hasPreviousPage: false,
          },
        }),
      })
    })

    await page.goto('/search?q=Lagos')
  })

  describe('Filter Panel', () => {
    test('displays all filter categories', async ({ page }) => {
      await expect(page.getByText(/package type/i)).toBeVisible()
      await expect(page.getByText(/location/i)).toBeVisible()
      await expect(page.getByText(/price range/i)).toBeVisible()
      await expect(page.getByText(/dates/i)).toBeVisible()
      await expect(page.getByText(/categories/i)).toBeVisible()
    })

    test('shows filter counts', async ({ page }) => {
      await expect(page.getByText('Lagos (150)')).toBeVisible()
      await expect(page.getByText('Accra (89)')).toBeVisible()
      await expect(page.getByText('Beach (67)')).toBeVisible()
      await expect(page.getByText('Music (45)')).toBeVisible()
    })

    test('collapses and expands filter sections', async ({ page }) => {
      // Click to collapse package type section
      await page.getByRole('button', { name: /package type/i }).click()
      await expect(page.getByLabelText(/events/i)).not.toBeVisible()

      // Click to expand again
      await page.getByRole('button', { name: /package type/i }).click()
      await expect(page.getByLabelText(/events/i)).toBeVisible()
    })
  })

  describe('Package Type Filter', () => {
    test('filters by package type', async ({ page }) => {
      await page.getByLabelText(/events/i).check()

      await expect(page).toHaveURL(/type=EVENT/)
      await expect(page.getByText('Lagos Beach Party')).toBeVisible()
    })

    test('shows selected package type', async ({ page }) => {
      await page.getByLabelText(/events/i).check()

      await expect(page.getByLabelText(/events/i)).toBeChecked()
      await expect(page.getByText(/1 filter applied/i)).toBeVisible()
    })

    test('clears package type filter', async ({ page }) => {
      await page.getByLabelText(/events/i).check()
      await page.getByLabelText(/all types/i).check()

      await expect(page).toHaveURL(/^(?!.*type=).*$/)
      await expect(page.getByLabelText(/events/i)).not.toBeChecked()
    })
  })

  describe('Location Filter', () => {
    test('filters by city', async ({ page }) => {
      await page.getByRole('combobox', { name: /select city/i }).selectOption('Lagos')

      await expect(page).toHaveURL(/city=Lagos/)
    })

    test('shows selected city', async ({ page }) => {
      await page.getByRole('combobox', { name: /select city/i }).selectOption('Lagos')

      await expect(page.getByRole('combobox', { name: /select city/i })).toHaveValue('Lagos')
    })

    test('clears city filter', async ({ page }) => {
      await page.getByRole('combobox', { name: /select city/i }).selectOption('Lagos')
      await page.getByRole('combobox', { name: /select city/i }).selectOption('')

      await expect(page).toHaveURL(/^(?!.*city=).*$/)
    })
  })

  describe('Price Range Filter', () => {
    test('adjusts price range with slider', async ({ page }) => {
      // Simulate price range adjustment
      await page.getByTestId('min-price-input').fill('10000')
      await page.getByTestId('max-price-input').fill('100000')

      await expect(page).toHaveURL(/minPrice=10000/)
      await expect(page).toHaveURL(/maxPrice=100000/)
    })

    test('shows formatted price labels', async ({ page }) => {
      await page.getByTestId('min-price-input').fill('10000')
      await page.getByTestId('max-price-input').fill('100000')

      await expect(page.getByText('₦10,000')).toBeVisible()
      await expect(page.getByText('₦100,000')).toBeVisible()
    })

    test('validates price range', async ({ page }) => {
      await page.getByTestId('min-price-input').fill('100000')
      await page.getByTestId('max-price-input').fill('50000')

      await expect(page.getByText(/minimum price cannot be greater/i)).toBeVisible()
    })

    test('uses price presets', async ({ page }) => {
      await page.getByRole('button', { name: /under ₦50,000/i }).click()

      await expect(page).toHaveURL(/maxPrice=50000/)
    })
  })

  describe('Date Range Filter', () => {
    test('sets date range', async ({ page }) => {
      await page.getByTestId('start-date-picker').fill('2025-12-01')
      await page.getByTestId('end-date-picker').fill('2025-12-31')

      await expect(page).toHaveURL(/startDate=2025-12-01/)
      await expect(page).toHaveURL(/endDate=2025-12-31/)
    })

    test('uses date presets', async ({ page }) => {
      await page.getByRole('button', { name: /this weekend/i }).click()

      // Should set appropriate weekend dates
      await expect(page.url()).toMatch(/startDate=/)
      await expect(page.url()).toMatch(/endDate=/)
    })

    test('validates date range', async ({ page }) => {
      await page.getByTestId('start-date-picker').fill('2025-12-31')
      await page.getByTestId('end-date-picker').fill('2025-12-01')

      await expect(page.getByText(/start date cannot be after end date/i)).toBeVisible()
    })

    test('shows quick date options', async ({ page }) => {
      await expect(page.getByRole('button', { name: /today/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /this weekend/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /next week/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /this month/i })).toBeVisible()
    })
  })

  describe('Category Filter', () => {
    test('selects multiple categories', async ({ page }) => {
      await page.getByLabelText(/beach/i).check()
      await page.getByLabelText(/music/i).check()

      await expect(page).toHaveURL(/categories=beach%2Cmusic/)
    })

    test('deselects categories', async ({ page }) => {
      await page.getByLabelText(/beach/i).check()
      await page.getByLabelText(/music/i).check()
      await page.getByLabelText(/beach/i).uncheck()

      await expect(page).toHaveURL(/categories=music/)
      await expect(page.url()).not.toMatch(/beach/)
    })

    test('shows selected categories count', async ({ page }) => {
      await page.getByLabelText(/beach/i).check()
      await page.getByLabelText(/music/i).check()

      await expect(page.getByText(/2 categories selected/i)).toBeVisible()
    })
  })

  describe('Filter Combinations', () => {
    test('applies multiple filters simultaneously', async ({ page }) => {
      await page.getByLabelText(/events/i).check()
      await page.getByRole('combobox', { name: /select city/i }).selectOption('Lagos')
      await page.getByLabelText(/beach/i).check()

      await expect(page).toHaveURL(/type=EVENT/)
      await expect(page).toHaveURL(/city=Lagos/)
      await expect(page).toHaveURL(/categories=beach/)
      await expect(page.getByText(/3 filters applied/i)).toBeVisible()
    })

    test('updates results when filters change', async ({ page }) => {
      await page.getByLabelText(/events/i).check()
      await page.getByRole('combobox', { name: /select city/i }).selectOption('Lagos')

      await expect(page.getByText('Lagos Beach Party')).toBeVisible()
      await expect(page.getByText(/1 result found/i)).toBeVisible()
    })

    test('shows no results when filters are too restrictive', async ({ page }) => {
      await page.getByLabelText(/car rentals/i).check()
      await page.getByRole('combobox', { name: /select city/i }).selectOption('Lagos')

      await expect(page.getByText(/no results found/i)).toBeVisible()
      await expect(page.getByText(/try adjusting your filters/i)).toBeVisible()
    })
  })

  describe('Clear Filters', () => {
    test('clears all filters', async ({ page }) => {
      // Apply multiple filters
      await page.getByLabelText(/events/i).check()
      await page.getByRole('combobox', { name: /select city/i }).selectOption('Lagos')
      await page.getByLabelText(/beach/i).check()

      // Clear all filters
      await page.getByRole('button', { name: /clear all filters/i }).click()

      await expect(page.url()).not.toMatch(/type=/)
      await expect(page.url()).not.toMatch(/city=/)
      await expect(page.url()).not.toMatch(/categories=/)
      await expect(page.queryByText(/filters applied/i)).not.toBeVisible()
    })

    test('clears individual filters', async ({ page }) => {
      await page.getByLabelText(/events/i).check()
      await page.getByRole('combobox', { name: /select city/i }).selectOption('Lagos')

      // Clear individual filter
      await page.getByRole('button', { name: /remove events filter/i }).click()

      await expect(page.url()).not.toMatch(/type=/)
      await expect(page).toHaveURL(/city=Lagos/)
    })

    test('disables clear button when no filters applied', async ({ page }) => {
      await expect(page.getByRole('button', { name: /clear all filters/i })).toBeDisabled()
    })
  })

  describe('Filter Persistence', () => {
    test('maintains filters in URL', async ({ page }) => {
      await page.getByLabelText(/events/i).check()
      await page.getByRole('combobox', { name: /select city/i }).selectOption('Lagos')

      await page.reload()

      await expect(page.getByLabelText(/events/i)).toBeChecked()
      await expect(page.getByRole('combobox', { name: /select city/i })).toHaveValue('Lagos')
    })

    test('preserves filters when navigating back', async ({ page }) => {
      await page.getByLabelText(/events/i).check()
      await page.getByRole('combobox', { name: /select city/i }).selectOption('Lagos')

      // Navigate to a package detail page
      await page.getByText('Lagos Beach Party').click()
      await expect(page).toHaveURL(/\/packages\//)

      // Navigate back
      await page.goBack()

      await expect(page.getByLabelText(/events/i)).toBeChecked()
      await expect(page.getByRole('combobox', { name: /select city/i })).toHaveValue('Lagos')
    })
  })

  describe('Mobile Filter Experience', () => {
    test('shows mobile filter toggle', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.reload()

      await expect(page.getByRole('button', { name: /filters/i })).toBeVisible()
      await expect(page.getByTestId('mobile-filter-toggle')).toBeVisible()
    })

    test('opens filter modal on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.reload()

      await page.getByRole('button', { name: /filters/i }).click()

      await expect(page.getByTestId('filter-modal')).toBeVisible()
      await expect(page.getByText(/package type/i)).toBeVisible()
    })

    test('applies filters from mobile modal', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.reload()

      await page.getByRole('button', { name: /filters/i }).click()
      await page.getByLabelText(/events/i).check()
      await page.getByRole('button', { name: /apply filters/i }).click()

      await expect(page).toHaveURL(/type=EVENT/)
      await expect(page.getByTestId('filter-modal')).not.toBeVisible()
    })

    test('shows filter count on mobile toggle', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.reload()

      await page.getByRole('button', { name: /filters/i }).click()
      await page.getByLabelText(/events/i).check()
      await page.getByRole('combobox', { name: /select city/i }).selectOption('Lagos')
      await page.getByRole('button', { name: /apply filters/i }).click()

      await expect(page.getByText(/filters \(2\)/i)).toBeVisible()
    })
  })

  describe('Accessibility', () => {
    test('supports keyboard navigation', async ({ page }) => {
      // Tab through filter controls
      await page.keyboard.press('Tab')
      await expect(page.getByLabelText(/all types/i)).toBeFocused()

      await page.keyboard.press('Tab')
      await expect(page.getByLabelText(/events/i)).toBeFocused()
    })

    test('has proper ARIA labels', async ({ page }) => {
      await expect(page.getByRole('group', { name: /package type/i })).toBeVisible()
      await expect(page.getByRole('group', { name: /location/i })).toBeVisible()
      await expect(page.getByRole('group', { name: /price range/i })).toBeVisible()
    })

    test('announces filter changes', async ({ page }) => {
      await page.getByLabelText(/events/i).check()

      await expect(page.getByText(/filter applied: events/i)).toHaveAttribute('aria-live', 'polite')
    })
  })
})
