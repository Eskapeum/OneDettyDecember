import { test, expect } from '@playwright/test'

test.describe('Page Load Performance', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses for consistent testing
    await page.route('/api/search**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          results: Array.from({ length: 20 }, (_, i) => ({
            id: `pkg-${i}`,
            title: `Package ${i}`,
            description: `Description for package ${i}`,
            price: Math.floor(Math.random() * 100000),
            currency: 'NGN',
            type: 'EVENT',
            location: 'Lagos',
            images: [`https://example.com/image${i}.jpg`],
            vendor: { businessName: `Vendor ${i}` },
            rating: 4.5,
            reviewCount: 23,
          })),
          totalCount: 100,
          pagination: {
            currentPage: 1,
            totalPages: 5,
            hasNextPage: true,
            hasPreviousPage: false,
          },
        }),
      })
    })

    await page.route('/api/packages/featured**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          packages: Array.from({ length: 8 }, (_, i) => ({
            id: `featured-${i}`,
            title: `Featured Package ${i}`,
            price: Math.floor(Math.random() * 100000),
            images: [`https://example.com/featured${i}.jpg`],
            rating: 4.8,
          })),
        }),
      })
    })
  })

  describe('Homepage Performance', () => {
    test('homepage loads within performance budget', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/')
      
      // Wait for main content to be visible
      await expect(page.getByRole('heading', { name: /discover amazing/i })).toBeVisible()
      await expect(page.getByPlaceholderText(/search for events/i)).toBeVisible()
      
      const loadTime = Date.now() - startTime
      
      // Homepage should load within 2 seconds
      expect(loadTime).toBeLessThan(2000)
    })

    test('measures First Contentful Paint (FCP)', async ({ page }) => {
      await page.goto('/')
      
      const fcpMetric = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint')
            if (fcpEntry) {
              resolve(fcpEntry.startTime)
            }
          }).observe({ entryTypes: ['paint'] })
        })
      })
      
      // FCP should be under 1.5 seconds
      expect(fcpMetric).toBeLessThan(1500)
    })

    test('measures Largest Contentful Paint (LCP)', async ({ page }) => {
      await page.goto('/')
      
      const lcpMetric = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const lastEntry = entries[entries.length - 1]
            resolve(lastEntry.startTime)
          }).observe({ entryTypes: ['largest-contentful-paint'] })
          
          // Resolve after 5 seconds if no LCP detected
          setTimeout(() => resolve(5000), 5000)
        })
      })
      
      // LCP should be under 2.5 seconds
      expect(lcpMetric).toBeLessThan(2500)
    })

    test('measures Cumulative Layout Shift (CLS)', async ({ page }) => {
      await page.goto('/')
      
      // Wait for page to fully load
      await page.waitForLoadState('networkidle')
      
      const clsMetric = await page.evaluate(() => {
        return new Promise((resolve) => {
          let clsValue = 0
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value
              }
            }
            resolve(clsValue)
          }).observe({ entryTypes: ['layout-shift'] })
          
          // Resolve after 3 seconds
          setTimeout(() => resolve(clsValue), 3000)
        })
      })
      
      // CLS should be under 0.1
      expect(clsMetric).toBeLessThan(0.1)
    })

    test('measures Time to Interactive (TTI)', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/')
      
      // Wait for page to be interactive
      await page.waitForLoadState('networkidle')
      
      // Test interactivity by clicking search
      await page.getByPlaceholderText(/search for events/i).click()
      await page.getByPlaceholderText(/search for events/i).type('test')
      
      const ttiTime = Date.now() - startTime
      
      // TTI should be under 3 seconds
      expect(ttiTime).toBeLessThan(3000)
    })
  })

  describe('Search Results Performance', () => {
    test('search results page loads quickly', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/search?q=Lagos+events')
      
      // Wait for search results to be visible
      await expect(page.getByText(/results found/i)).toBeVisible()
      await expect(page.getByText('Package 0')).toBeVisible()
      
      const loadTime = Date.now() - startTime
      
      // Search results should load within 1.5 seconds
      expect(loadTime).toBeLessThan(1500)
    })

    test('search API response time is acceptable', async ({ page }) => {
      let apiResponseTime = 0
      
      page.on('response', response => {
        if (response.url().includes('/api/search')) {
          const timing = response.timing()
          apiResponseTime = timing.responseEnd - timing.requestStart
        }
      })
      
      await page.goto('/search?q=Lagos+events')
      await expect(page.getByText(/results found/i)).toBeVisible()
      
      // API should respond within 500ms
      expect(apiResponseTime).toBeLessThan(500)
    })

    test('pagination performance', async ({ page }) => {
      await page.goto('/search?q=Lagos+events')
      await expect(page.getByText('Package 0')).toBeVisible()
      
      const startTime = Date.now()
      
      // Click next page
      await page.getByRole('button', { name: /next/i }).click()
      await expect(page.getByText('Package 0')).toBeVisible()
      
      const paginationTime = Date.now() - startTime
      
      // Pagination should be fast
      expect(paginationTime).toBeLessThan(800)
    })

    test('filter application performance', async ({ page }) => {
      await page.goto('/search?q=Lagos')
      await expect(page.getByText(/results found/i)).toBeVisible()
      
      const startTime = Date.now()
      
      // Apply a filter
      await page.getByLabelText(/events/i).check()
      await expect(page.getByText(/results found/i)).toBeVisible()
      
      const filterTime = Date.now() - startTime
      
      // Filter application should be fast
      expect(filterTime).toBeLessThan(600)
    })
  })

  describe('Image Loading Performance', () => {
    test('images load progressively', async ({ page }) => {
      await page.goto('/search?q=Lagos+events')
      
      // Check that images have proper loading attributes
      const images = page.locator('img[src*="example.com"]')
      const firstImage = images.first()
      
      await expect(firstImage).toHaveAttribute('loading', 'lazy')
      await expect(firstImage).toBeVisible()
    })

    test('measures image load time', async ({ page }) => {
      const imageLoadTimes: number[] = []
      
      page.on('response', response => {
        if (response.url().includes('image') && response.url().includes('.jpg')) {
          const timing = response.timing()
          imageLoadTimes.push(timing.responseEnd - timing.requestStart)
        }
      })
      
      await page.goto('/search?q=Lagos+events')
      await page.waitForLoadState('networkidle')
      
      // Images should load reasonably fast
      const averageImageLoadTime = imageLoadTimes.reduce((a, b) => a + b, 0) / imageLoadTimes.length
      expect(averageImageLoadTime).toBeLessThan(1000)
    })

    test('validates image optimization', async ({ page }) => {
      await page.goto('/search?q=Lagos+events')
      
      const images = page.locator('img[src*="example.com"]')
      const imageCount = await images.count()
      
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const image = images.nth(i)
        const src = await image.getAttribute('src')
        
        // Images should have optimization parameters
        expect(src).toMatch(/w=\d+/) // Width parameter
        expect(src).toMatch(/q=\d+/) // Quality parameter
      }
    })
  })

  describe('JavaScript Bundle Performance', () => {
    test('measures JavaScript bundle size', async ({ page }) => {
      const bundleSizes: number[] = []
      
      page.on('response', response => {
        if (response.url().includes('.js') && !response.url().includes('node_modules')) {
          bundleSizes.push(parseInt(response.headers()['content-length'] || '0'))
        }
      })
      
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      const totalBundleSize = bundleSizes.reduce((a, b) => a + b, 0)
      
      // Total JS bundle should be under 500KB
      expect(totalBundleSize).toBeLessThan(500 * 1024)
    })

    test('validates code splitting', async ({ page }) => {
      const jsFiles: string[] = []
      
      page.on('response', response => {
        if (response.url().includes('.js')) {
          jsFiles.push(response.url())
        }
      })
      
      await page.goto('/')
      const homePageJsFiles = [...jsFiles]
      
      await page.goto('/search?q=test')
      const searchPageJsFiles = jsFiles.filter(file => !homePageJsFiles.includes(file))
      
      // Should have separate chunks for different pages
      expect(searchPageJsFiles.length).toBeGreaterThan(0)
    })
  })

  describe('Network Performance', () => {
    test('measures total network requests', async ({ page }) => {
      let requestCount = 0
      
      page.on('request', () => {
        requestCount++
      })
      
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Should not make excessive network requests
      expect(requestCount).toBeLessThan(50)
    })

    test('validates resource caching', async ({ page }) => {
      const cachedResources: string[] = []
      
      page.on('response', response => {
        const cacheControl = response.headers()['cache-control']
        if (cacheControl && cacheControl.includes('max-age')) {
          cachedResources.push(response.url())
        }
      })
      
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Static assets should be cached
      expect(cachedResources.length).toBeGreaterThan(5)
    })

    test('measures DNS lookup time', async ({ page }) => {
      const navigationTiming = await page.evaluate(() => {
        const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        return {
          dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
          connect: timing.connectEnd - timing.connectStart,
          request: timing.responseStart - timing.requestStart,
        }
      })
      
      // DNS lookup should be fast
      expect(navigationTiming.dnsLookup).toBeLessThan(100)
      expect(navigationTiming.connect).toBeLessThan(200)
      expect(navigationTiming.request).toBeLessThan(300)
    })
  })

  describe('Mobile Performance', () => {
    test('mobile page load performance', async ({ page }) => {
      // Simulate mobile device
      await page.setViewportSize({ width: 375, height: 667 })
      await page.emulateMedia({ media: 'screen' })
      
      const startTime = Date.now()
      
      await page.goto('/')
      await expect(page.getByRole('heading', { name: /discover amazing/i })).toBeVisible()
      
      const loadTime = Date.now() - startTime
      
      // Mobile should load within 3 seconds
      expect(loadTime).toBeLessThan(3000)
    })

    test('mobile search performance', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      
      const startTime = Date.now()
      
      await page.goto('/search?q=Lagos+events')
      await expect(page.getByText(/results found/i)).toBeVisible()
      
      const loadTime = Date.now() - startTime
      
      // Mobile search should load within 2 seconds
      expect(loadTime).toBeLessThan(2000)
    })
  })

  describe('Performance Monitoring', () => {
    test('validates Web Vitals thresholds', async ({ page }) => {
      await page.goto('/')
      
      const webVitals = await page.evaluate(() => {
        return new Promise((resolve) => {
          const vitals = { fcp: 0, lcp: 0, cls: 0, fid: 0 }
          
          // Measure FCP
          new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint')
            if (fcpEntry) vitals.fcp = fcpEntry.startTime
          }).observe({ entryTypes: ['paint'] })
          
          // Measure LCP
          new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const lastEntry = entries[entries.length - 1]
            vitals.lcp = lastEntry.startTime
          }).observe({ entryTypes: ['largest-contentful-paint'] })
          
          // Measure CLS
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) {
                vitals.cls += entry.value
              }
            }
          }).observe({ entryTypes: ['layout-shift'] })
          
          setTimeout(() => resolve(vitals), 3000)
        })
      })
      
      // Validate Web Vitals thresholds
      expect(webVitals.fcp).toBeLessThan(1800) // Good FCP
      expect(webVitals.lcp).toBeLessThan(2500) // Good LCP
      expect(webVitals.cls).toBeLessThan(0.1)  // Good CLS
    })
  })
})
