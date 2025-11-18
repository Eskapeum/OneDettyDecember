import { test, expect } from '@playwright/test'

test.describe('Homepage Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Mock featured packages API
    await page.route('/api/packages/featured**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          packages: [
            {
              id: 'pkg-1',
              title: 'Lagos Beach Party',
              description: 'Amazing beach party experience in Lagos',
              price: 50000,
              currency: 'NGN',
              type: 'EVENT',
              location: 'Victoria Island, Lagos',
              images: ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300'],
              startDate: '2025-12-25T18:00:00Z',
              vendor: { businessName: 'Lagos Event Planners' },
              rating: 4.8,
              reviewCount: 156,
              featured: true,
            },
            {
              id: 'pkg-2',
              title: 'Luxury Hotel Stay',
              description: '5-star hotel experience in Ikoyi',
              price: 120000,
              currency: 'NGN',
              type: 'STAY',
              location: 'Ikoyi, Lagos',
              images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300'],
              startDate: '2025-12-20T15:00:00Z',
              vendor: { businessName: 'Luxury Hotels Ltd' },
              rating: 4.9,
              reviewCount: 89,
              featured: true,
            },
            {
              id: 'pkg-3',
              title: 'Cultural Experience Tour',
              description: 'Explore the rich culture of Accra',
              price: 75000,
              currency: 'NGN',
              type: 'EXPERIENCE',
              location: 'Accra, Ghana',
              images: ['https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300'],
              startDate: '2025-12-22T09:00:00Z',
              vendor: { businessName: 'Cultural Tours Ghana' },
              rating: 4.7,
              reviewCount: 67,
              featured: true,
            },
          ],
        }),
      })
    })

    // Mock categories API
    await page.route('/api/categories**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          categories: [
            { id: 'events', name: 'Events', icon: 'calendar', count: 245 },
            { id: 'stays', name: 'Stays', icon: 'bed', count: 156 },
            { id: 'experiences', name: 'Experiences', icon: 'compass', count: 89 },
            { id: 'car-rentals', name: 'Car Rentals', icon: 'car', count: 67 },
          ],
        }),
      })
    })

    // Mock search suggestions API
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
          }),
        })
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            suggestions: [],
          }),
        })
      }
    })

    await page.goto('/')
  })

  describe('Hero Section', () => {
    test('displays hero section with title and search', async ({ page }) => {
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Discover Amazing')
      
      await expect(page.getByPlaceholderText(/search for events/i)).toBeVisible()
      await expect(page.getByRole('button', { name: /search/i })).toBeVisible()
    })

    test('performs search from hero section', async ({ page }) => {
      const searchInput = page.getByPlaceholderText(/search for events/i)
      const searchButton = page.getByRole('button', { name: /search/i })
      
      await searchInput.fill('Lagos events')
      await searchButton.click()
      
      await expect(page).toHaveURL(/\/search\?q=Lagos\+events/)
    })

    test('shows search suggestions', async ({ page }) => {
      const searchInput = page.getByPlaceholderText(/search for events/i)
      
      await searchInput.fill('Lagos')
      
      await expect(page.getByText('Lagos events')).toBeVisible()
      await expect(page.getByText('Lagos hotels')).toBeVisible()
      await expect(page.getByText('Lagos Beach Party')).toBeVisible()
    })

    test('navigates with CTA buttons', async ({ page }) => {
      await page.getByRole('button', { name: /explore events/i }).click()
      await expect(page).toHaveURL(/\/search\?type=EVENT/)
      
      await page.goBack()
      
      await page.getByRole('button', { name: /find stays/i }).click()
      await expect(page).toHaveURL(/\/search\?type=STAY/)
    })

    test('navigates to popular destinations', async ({ page }) => {
      await page.getByText('Lagos', { exact: true }).click()
      await expect(page).toHaveURL(/\/search\?city=Lagos/)
    })
  })

  describe('Featured Packages Section', () => {
    test('displays featured packages', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /featured packages/i })).toBeVisible()
      
      await expect(page.getByText('Lagos Beach Party')).toBeVisible()
      await expect(page.getByText('Luxury Hotel Stay')).toBeVisible()
      await expect(page.getByText('Cultural Experience Tour')).toBeVisible()
      
      await expect(page.getByText('₦50,000')).toBeVisible()
      await expect(page.getByText('₦120,000')).toBeVisible()
      await expect(page.getByText('₦75,000')).toBeVisible()
    })

    test('shows package details', async ({ page }) => {
      // Check ratings
      await expect(page.getByText('4.8')).toBeVisible()
      await expect(page.getByText('4.9')).toBeVisible()
      await expect(page.getByText('4.7')).toBeVisible()
      
      // Check review counts
      await expect(page.getByText('(156 reviews)')).toBeVisible()
      await expect(page.getByText('(89 reviews)')).toBeVisible()
      await expect(page.getByText('(67 reviews)')).toBeVisible()
      
      // Check vendor names
      await expect(page.getByText('Lagos Event Planners')).toBeVisible()
      await expect(page.getByText('Luxury Hotels Ltd')).toBeVisible()
      await expect(page.getByText('Cultural Tours Ghana')).toBeVisible()
    })

    test('navigates to package detail', async ({ page }) => {
      await page.getByText('Lagos Beach Party').click()
      await expect(page).toHaveURL('/packages/pkg-1')
    })

    test('shows package images', async ({ page }) => {
      const images = page.locator('[data-testid="package-card"] img')
      await expect(images).toHaveCount(3)
      
      for (let i = 0; i < 3; i++) {
        await expect(images.nth(i)).toHaveAttribute('src')
        await expect(images.nth(i)).toHaveAttribute('alt')
      }
    })

    test('handles package interactions', async ({ page }) => {
      // Hover over package card
      await page.getByTestId('package-card-pkg-1').hover()
      await expect(page.getByTestId('package-quick-view')).toBeVisible()
      
      // Test favorite button
      await page.getByRole('button', { name: /add to favorites/i }).first().click()
      await expect(page.getByText(/added to favorites/i)).toBeVisible()
    })
  })

  describe('Categories Section', () => {
    test('displays package categories', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /browse by category/i })).toBeVisible()
      
      await expect(page.getByText('Events')).toBeVisible()
      await expect(page.getByText('Stays')).toBeVisible()
      await expect(page.getByText('Experiences')).toBeVisible()
      await expect(page.getByText('Car Rentals')).toBeVisible()
    })

    test('shows category counts', async ({ page }) => {
      await expect(page.getByText('245 packages')).toBeVisible()
      await expect(page.getByText('156 packages')).toBeVisible()
      await expect(page.getByText('89 packages')).toBeVisible()
      await expect(page.getByText('67 packages')).toBeVisible()
    })

    test('navigates to category search', async ({ page }) => {
      await page.getByText('Events').click()
      await expect(page).toHaveURL(/\/search\?type=EVENT/)
    })

    test('shows category icons', async ({ page }) => {
      const categoryCards = page.locator('[data-testid="category-card"]')
      await expect(categoryCards).toHaveCount(4)
      
      for (let i = 0; i < 4; i++) {
        await expect(categoryCards.nth(i).locator('[data-testid="category-icon"]')).toBeVisible()
      }
    })
  })

  describe('Newsletter Signup', () => {
    test('displays newsletter signup section', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /stay updated/i })).toBeVisible()
      await expect(page.getByText(/get the latest updates/i)).toBeVisible()
      
      await expect(page.getByPlaceholderText(/enter your email/i)).toBeVisible()
      await expect(page.getByRole('button', { name: /subscribe/i })).toBeVisible()
    })

    test('handles newsletter signup', async ({ page }) => {
      const emailInput = page.getByPlaceholderText(/enter your email/i)
      const subscribeButton = page.getByRole('button', { name: /subscribe/i })
      
      await emailInput.fill('test@example.com')
      await subscribeButton.click()
      
      await expect(page.getByText(/thank you for subscribing/i)).toBeVisible()
    })

    test('validates email format', async ({ page }) => {
      const emailInput = page.getByPlaceholderText(/enter your email/i)
      const subscribeButton = page.getByRole('button', { name: /subscribe/i })
      
      await emailInput.fill('invalid-email')
      await subscribeButton.click()
      
      await expect(page.getByText(/please enter a valid email/i)).toBeVisible()
    })
  })

  describe('Footer', () => {
    test('displays footer with links', async ({ page }) => {
      await expect(page.getByRole('contentinfo')).toBeVisible()
      
      // Company links
      await expect(page.getByRole('link', { name: /about us/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /contact/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /careers/i })).toBeVisible()
      
      // Legal links
      await expect(page.getByRole('link', { name: /privacy policy/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /terms of service/i })).toBeVisible()
      
      // Social media links
      await expect(page.getByRole('link', { name: /facebook/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /twitter/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /instagram/i })).toBeVisible()
    })

    test('shows company information', async ({ page }) => {
      await expect(page.getByText(/onedetty/i)).toBeVisible()
      await expect(page.getByText(/discover amazing events/i)).toBeVisible()
      await expect(page.getByText(/© 2025/i)).toBeVisible()
    })
  })

  describe('Loading States', () => {
    test('shows loading state for featured packages', async ({ page }) => {
      // Mock slow API response
      await page.route('/api/packages/featured**', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, packages: [] }),
        })
      })
      
      await page.reload()
      
      await expect(page.getByTestId('featured-packages-loading')).toBeVisible()
    })

    test('shows loading state for categories', async ({ page }) => {
      await page.route('/api/categories**', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, categories: [] }),
        })
      })
      
      await page.reload()
      
      await expect(page.getByTestId('categories-loading')).toBeVisible()
    })
  })

  describe('Error Handling', () => {
    test('handles featured packages API error', async ({ page }) => {
      await page.route('/api/packages/featured**', async (route) => {
        await route.fulfill({ status: 500 })
      })
      
      await page.reload()
      
      await expect(page.getByText(/failed to load featured packages/i)).toBeVisible()
      await expect(page.getByRole('button', { name: /try again/i })).toBeVisible()
    })

    test('retries failed API calls', async ({ page }) => {
      let callCount = 0
      await page.route('/api/packages/featured**', async (route) => {
        callCount++
        if (callCount === 1) {
          await route.fulfill({ status: 500 })
        } else {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ success: true, packages: [] }),
          })
        }
      })
      
      await page.reload()
      await page.getByRole('button', { name: /try again/i }).click()
      
      await expect(page.getByText(/no featured packages/i)).toBeVisible()
    })
  })

  describe('Mobile Responsiveness', () => {
    test('adapts layout for mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.reload()
      
      // Hero section should be mobile-optimized
      await expect(page.getByTestId('hero-section')).toHaveClass(/mobile-layout/)
      
      // Featured packages should show fewer items
      const packageCards = page.locator('[data-testid^="package-card-"]')
      await expect(packageCards).toHaveCount(3) // Should show all but in mobile layout
      
      // Categories should be in mobile grid
      await expect(page.getByTestId('categories-grid')).toHaveClass(/mobile-grid/)
    })

    test('mobile navigation works', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.reload()
      
      // Mobile menu should be accessible
      await page.getByRole('button', { name: /menu/i }).click()
      await expect(page.getByTestId('mobile-menu')).toBeVisible()
    })
  })

  describe('Performance', () => {
    test('loads within acceptable time', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/')
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      
      const loadTime = Date.now() - startTime
      expect(loadTime).toBeLessThan(3000) // Should load within 3 seconds
    })

    test('lazy loads images', async ({ page }) => {
      const images = page.locator('img[loading="lazy"]')
      await expect(images.first()).toBeVisible()
    })

    test('preloads critical resources', async ({ page }) => {
      const preloadLinks = page.locator('link[rel="preload"]')
      await expect(preloadLinks.first()).toBeAttached()
    })
  })

  describe('SEO and Accessibility', () => {
    test('has proper heading structure', async ({ page }) => {
      const h1 = page.getByRole('heading', { level: 1 })
      await expect(h1).toBeVisible()
      await expect(h1).toHaveCount(1)
      
      const h2Elements = page.getByRole('heading', { level: 2 })
      await expect(h2Elements).toHaveCount(3) // Featured, Categories, Newsletter
    })

    test('has proper meta tags', async ({ page }) => {
      const title = await page.title()
      expect(title).toContain('OneDettyDecember')
      expect(title.length).toBeLessThan(60)
      
      const metaDescription = page.locator('meta[name="description"]')
      await expect(metaDescription).toHaveAttribute('content')
    })

    test('supports keyboard navigation', async ({ page }) => {
      // Tab through main interactive elements
      await page.keyboard.press('Tab')
      await expect(page.getByPlaceholderText(/search for events/i)).toBeFocused()
      
      await page.keyboard.press('Tab')
      await expect(page.getByRole('button', { name: /search/i })).toBeFocused()
    })

    test('has proper ARIA labels', async ({ page }) => {
      const searchInput = page.getByRole('searchbox')
      await expect(searchInput).toHaveAttribute('aria-label')
      
      const mainContent = page.getByRole('main')
      await expect(mainContent).toBeVisible()
    })
  })

  describe('Analytics', () => {
    test('tracks page view', async ({ page }) => {
      const analyticsEvents: any[] = []
      
      await page.addInitScript(() => {
        window.gtag = (...args: any[]) => {
          (window as any).analyticsEvents = (window as any).analyticsEvents || []
          ;(window as any).analyticsEvents.push(args)
        }
      })
      
      await page.goto('/')
      
      const events = await page.evaluate(() => (window as any).analyticsEvents)
      expect(events).toContainEqual(['event', 'page_view', expect.any(Object)])
    })

    test('tracks user interactions', async ({ page }) => {
      const analyticsEvents: any[] = []
      
      await page.addInitScript(() => {
        window.gtag = (...args: any[]) => {
          (window as any).analyticsEvents = (window as any).analyticsEvents || []
          ;(window as any).analyticsEvents.push(args)
        }
      })
      
      await page.goto('/')
      await page.getByText('Lagos Beach Party').click()
      
      const events = await page.evaluate(() => (window as any).analyticsEvents)
      expect(events).toContainEqual(['event', 'package_click', expect.any(Object)])
    })
  })
})
