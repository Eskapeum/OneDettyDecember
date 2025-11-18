import { test, expect } from '@playwright/test'

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Mock search API responses
    await page.route('/api/search**', async (route) => {
      const url = new URL(route.request().url())
      const query = url.searchParams.get('q')
      
      if (query === 'Lagos events') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            results: [
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
                vendor: { businessName: 'Party Planners Lagos' },
                rating: 4.5,
                reviewCount: 23,
              },
              {
                id: 'pkg-2',
                title: 'Lagos Music Festival',
                description: 'Annual music festival',
                price: 75000,
                currency: 'NGN',
                type: 'EVENT',
                location: 'Tafawa Balewa Square, Lagos',
                images: ['https://example.com/image2.jpg'],
                startDate: '2025-12-30T20:00:00Z',
                vendor: { businessName: 'Music Events Ltd' },
                rating: 4.8,
                reviewCount: 156,
              }
            ],
            totalCount: 2,
            query: 'Lagos events',
            pagination: {
              currentPage: 1,
              totalPages: 1,
              hasNextPage: false,
              hasPreviousPage: false
            }
          })
        })
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            results: [],
            totalCount: 0,
            query: query,
            pagination: {
              currentPage: 1,
              totalPages: 0,
              hasNextPage: false,
              hasPreviousPage: false
            }
          })
        })
      }
    })

    // Mock suggestions API
    await page.route('/api/search/suggestions**', async (route) => {
      const url = new URL(route.request().url())
      const query = url.searchParams.get('q')
      
      if (query === 'Lagos') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            suggestions: [
              { id: '1', text: 'Lagos events', type: 'category' },
              { id: '2', text: 'Lagos hotels', type: 'category' },
              { id: '3', text: 'Lagos Beach Party', type: 'package' },
            ],
            query: 'Lagos'
          })
        })
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            suggestions: [],
            query: query
          })
        })
      }
    })

    await page.goto('/')
  })

  describe('Search Bar Functionality', () => {
    test('displays search bar on homepage', async ({ page }) => {
      await expect(page.getByPlaceholderText(/search for events/i)).toBeVisible()
      await expect(page.getByRole('button', { name: /search/i })).toBeVisible()
    })

    test('performs basic text search', async ({ page }) => {
      const searchInput = page.getByPlaceholderText(/search for events/i)
      const searchButton = page.getByRole('button', { name: /search/i })

      await searchInput.fill('Lagos events')
      await searchButton.click()

      // Should navigate to search results page
      await expect(page).toHaveURL(/\/search\?q=Lagos\+events/)
      
      // Should display search results
      await expect(page.getByText('2 results found for "Lagos events"')).toBeVisible()
      await expect(page.getByText('Lagos Beach Party')).toBeVisible()
      await expect(page.getByText('Lagos Music Festival')).toBeVisible()
    })

    test('performs search on Enter key press', async ({ page }) => {
      const searchInput = page.getByPlaceholderText(/search for events/i)

      await searchInput.fill('Lagos events')
      await searchInput.press('Enter')

      await expect(page).toHaveURL(/\/search\?q=Lagos\+events/)
      await expect(page.getByText('Lagos Beach Party')).toBeVisible()
    })

    test('shows autocomplete suggestions', async ({ page }) => {
      const searchInput = page.getByPlaceholderText(/search for events/i)

      await searchInput.fill('Lagos')
      
      // Wait for suggestions to appear
      await expect(page.getByText('Lagos events')).toBeVisible()
      await expect(page.getByText('Lagos hotels')).toBeVisible()
      await expect(page.getByText('Lagos Beach Party')).toBeVisible()
    })

    test('selects suggestion on click', async ({ page }) => {
      const searchInput = page.getByPlaceholderText(/search for events/i)

      await searchInput.fill('Lagos')
      await page.getByText('Lagos events').click()

      await expect(page).toHaveURL(/\/search\?q=Lagos\+events/)
      await expect(page.getByText('Lagos Beach Party')).toBeVisible()
    })

    test('navigates suggestions with keyboard', async ({ page }) => {
      const searchInput = page.getByPlaceholderText(/search for events/i)

      await searchInput.fill('Lagos')
      
      // Wait for suggestions
      await expect(page.getByText('Lagos events')).toBeVisible()
      
      // Navigate with arrow keys
      await searchInput.press('ArrowDown')
      await expect(page.getByText('Lagos events')).toHaveClass(/highlighted/)
      
      await searchInput.press('ArrowDown')
      await expect(page.getByText('Lagos hotels')).toHaveClass(/highlighted/)
      
      // Select with Enter
      await searchInput.press('Enter')
      await expect(page).toHaveURL(/\/search\?q=Lagos\+hotels/)
    })

    test('clears search input', async ({ page }) => {
      const searchInput = page.getByPlaceholderText(/search for events/i)

      await searchInput.fill('test query')
      await page.getByRole('button', { name: /clear/i }).click()

      await expect(searchInput).toHaveValue('')
    })
  })

  describe('Search Results Page', () => {
    test('displays search results correctly', async ({ page }) => {
      await page.goto('/search?q=Lagos+events')

      // Check results header
      await expect(page.getByText('2 results found for "Lagos events"')).toBeVisible()
      
      // Check individual results
      await expect(page.getByText('Lagos Beach Party')).toBeVisible()
      await expect(page.getByText('Amazing beach party in Lagos')).toBeVisible()
      await expect(page.getByText('₦50,000')).toBeVisible()
      await expect(page.getByText('Victoria Island, Lagos')).toBeVisible()
      await expect(page.getByText('Party Planners Lagos')).toBeVisible()
      
      await expect(page.getByText('Lagos Music Festival')).toBeVisible()
      await expect(page.getByText('₦75,000')).toBeVisible()
    })

    test('shows empty state for no results', async ({ page }) => {
      await page.goto('/search?q=nonexistent')

      await expect(page.getByText(/no results found/i)).toBeVisible()
      await expect(page.getByText(/try adjusting your search/i)).toBeVisible()
      await expect(page.getByText(/popular searches/i)).toBeVisible()
    })

    test('navigates to package detail on click', async ({ page }) => {
      await page.goto('/search?q=Lagos+events')

      await page.getByText('Lagos Beach Party').click()

      await expect(page).toHaveURL('/packages/pkg-1')
    })

    test('switches between grid and list view', async ({ page }) => {
      await page.goto('/search?q=Lagos+events')

      // Default should be grid view
      await expect(page.getByTestId('search-results-grid')).toBeVisible()
      await expect(page.getByRole('button', { name: /grid view/i })).toHaveClass(/active/)

      // Switch to list view
      await page.getByRole('button', { name: /list view/i }).click()
      await expect(page.getByTestId('search-results-list')).toBeVisible()
      await expect(page.getByRole('button', { name: /list view/i })).toHaveClass(/active/)

      // Switch back to grid view
      await page.getByRole('button', { name: /grid view/i }).click()
      await expect(page.getByTestId('search-results-grid')).toBeVisible()
    })

    test('sorts search results', async ({ page }) => {
      await page.goto('/search?q=Lagos+events')

      const sortSelect = page.getByRole('combobox', { name: /sort by/i })
      
      // Change sort to price low to high
      await sortSelect.selectOption('price-low')
      await expect(page).toHaveURL(/sortBy=price-low/)
      
      // Change sort to rating
      await sortSelect.selectOption('rating')
      await expect(page).toHaveURL(/sortBy=rating/)
    })
  })

  describe('Search Persistence', () => {
    test('maintains search query in URL', async ({ page }) => {
      await page.goto('/search?q=Lagos+events')

      const searchInput = page.getByPlaceholderText(/search for events/i)
      await expect(searchInput).toHaveValue('Lagos events')
    })

    test('preserves search state on page refresh', async ({ page }) => {
      await page.goto('/search?q=Lagos+events&sortBy=price-low&view=list')

      await page.reload()

      // Check that state is preserved
      await expect(page.getByPlaceholderText(/search for events/i)).toHaveValue('Lagos events')
      await expect(page.getByRole('combobox', { name: /sort by/i })).toHaveValue('price-low')
      await expect(page.getByRole('button', { name: /list view/i })).toHaveClass(/active/)
    })

    test('updates URL when search parameters change', async ({ page }) => {
      await page.goto('/search?q=Lagos+events')

      // Change sort
      await page.getByRole('combobox', { name: /sort by/i }).selectOption('price-high')
      await expect(page).toHaveURL(/sortBy=price-high/)

      // Change view
      await page.getByRole('button', { name: /list view/i }).click()
      await expect(page).toHaveURL(/view=list/)
    })
  })

  describe('Loading States', () => {
    test('shows loading state during search', async ({ page }) => {
      // Mock slow API response
      await page.route('/api/search**', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            results: [],
            totalCount: 0,
            query: 'test'
          })
        })
      })

      const searchInput = page.getByPlaceholderText(/search for events/i)
      await searchInput.fill('test')
      await searchInput.press('Enter')

      // Should show loading state
      await expect(page.getByTestId('search-results-loading')).toBeVisible()
    })

    test('shows loading state for suggestions', async ({ page }) => {
      // Mock slow suggestions API
      await page.route('/api/search/suggestions**', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 500))
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            suggestions: [],
            query: 'test'
          })
        })
      })

      const searchInput = page.getByPlaceholderText(/search for events/i)
      await searchInput.fill('test')

      await expect(page.getByTestId('suggestions-loading')).toBeVisible()
    })
  })

  describe('Error Handling', () => {
    test('handles search API errors gracefully', async ({ page }) => {
      await page.route('/api/search**', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Internal server error'
          })
        })
      })

      const searchInput = page.getByPlaceholderText(/search for events/i)
      await searchInput.fill('test')
      await searchInput.press('Enter')

      await expect(page.getByText(/something went wrong/i)).toBeVisible()
      await expect(page.getByRole('button', { name: /try again/i })).toBeVisible()
    })

    test('handles network errors', async ({ page }) => {
      await page.route('/api/search**', async (route) => {
        await route.abort('failed')
      })

      const searchInput = page.getByPlaceholderText(/search for events/i)
      await searchInput.fill('test')
      await searchInput.press('Enter')

      await expect(page.getByText(/network error/i)).toBeVisible()
    })

    test('retries failed search', async ({ page }) => {
      let callCount = 0
      await page.route('/api/search**', async (route) => {
        callCount++
        if (callCount === 1) {
          await route.fulfill({ status: 500 })
        } else {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              results: [],
              totalCount: 0,
              query: 'test'
            })
          })
        }
      })

      const searchInput = page.getByPlaceholderText(/search for events/i)
      await searchInput.fill('test')
      await searchInput.press('Enter')

      await expect(page.getByText(/something went wrong/i)).toBeVisible()
      await page.getByRole('button', { name: /try again/i }).click()

      await expect(page.getByText(/no results found/i)).toBeVisible()
    })
  })

  describe('Accessibility', () => {
    test('supports keyboard navigation', async ({ page }) => {
      await page.goto('/')

      // Tab to search input
      await page.keyboard.press('Tab')
      await expect(page.getByPlaceholderText(/search for events/i)).toBeFocused()

      // Tab to search button
      await page.keyboard.press('Tab')
      await expect(page.getByRole('button', { name: /search/i })).toBeFocused()
    })

    test('has proper ARIA labels', async ({ page }) => {
      await page.goto('/')

      const searchInput = page.getByRole('searchbox')
      await expect(searchInput).toHaveAttribute('aria-label', 'Search packages')

      const searchButton = page.getByRole('button', { name: /search/i })
      await expect(searchButton).toHaveAttribute('aria-label', 'Search')
    })

    test('announces search results to screen readers', async ({ page }) => {
      await page.goto('/search?q=Lagos+events')

      const resultCount = page.getByText(/2 results found/i)
      await expect(resultCount).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('Mobile Responsiveness', () => {
    test('works on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')

      // Search should be visible and functional
      await expect(page.getByPlaceholderText(/search for events/i)).toBeVisible()
      
      const searchInput = page.getByPlaceholderText(/search for events/i)
      await searchInput.fill('Lagos events')
      await searchInput.press('Enter')

      await expect(page).toHaveURL(/\/search\?q=Lagos\+events/)
      await expect(page.getByText('Lagos Beach Party')).toBeVisible()
    })

    test('adapts layout for mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/search?q=Lagos+events')

      // Should show mobile-optimized layout
      await expect(page.getByTestId('mobile-search-layout')).toBeVisible()
    })
  })
})
