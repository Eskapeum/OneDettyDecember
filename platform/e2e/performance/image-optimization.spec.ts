import { test, expect } from '@playwright/test'

test.describe('Image Optimization Performance', () => {
  test.beforeEach(async ({ page }) => {
    // Mock image-heavy content
    await page.route('/api/packages/featured**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          packages: Array.from({ length: 12 }, (_, i) => ({
            id: `pkg-${i}`,
            title: `Package ${i}`,
            description: `Description for package ${i}`,
            price: Math.floor(Math.random() * 100000),
            currency: 'NGN',
            images: [
              `https://images.unsplash.com/photo-${1500000000000 + i}?w=800&h=600&fit=crop&crop=center`,
              `https://images.unsplash.com/photo-${1500000000000 + i + 100}?w=400&h=300&fit=crop&crop=center`,
            ],
            vendor: { businessName: `Vendor ${i}` },
            rating: 4.5,
            reviewCount: 23,
          })),
        }),
      })
    })

    await page.route('/api/search**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          results: Array.from({ length: 20 }, (_, i) => ({
            id: `search-${i}`,
            title: `Search Result ${i}`,
            images: [`https://images.unsplash.com/photo-${1600000000000 + i}?w=600&h=400&fit=crop`],
            price: Math.floor(Math.random() * 100000),
            vendor: { businessName: `Vendor ${i}` },
          })),
          totalCount: 100,
        }),
      })
    })
  })

  describe('Image Loading Strategy', () => {
    test('implements lazy loading for images', async ({ page }) => {
      await page.goto('/')
      
      // Check that images below the fold have lazy loading
      const images = page.locator('img')
      const imageCount = await images.count()
      
      for (let i = 0; i < imageCount; i++) {
        const image = images.nth(i)
        const loading = await image.getAttribute('loading')
        const isAboveFold = await image.evaluate(el => {
          const rect = el.getBoundingClientRect()
          return rect.top < window.innerHeight
        })
        
        if (!isAboveFold) {
          expect(loading).toBe('lazy')
        }
      }
    })

    test('prioritizes above-the-fold images', async ({ page }) => {
      await page.goto('/')
      
      // Hero image should load eagerly
      const heroImage = page.locator('[data-testid="hero-image"]').first()
      if (await heroImage.count() > 0) {
        await expect(heroImage).toHaveAttribute('loading', 'eager')
        await expect(heroImage).toHaveAttribute('fetchpriority', 'high')
      }
    })

    test('uses progressive image loading', async ({ page }) => {
      await page.goto('/')
      
      const images = page.locator('img[src*="unsplash"]')
      const firstImage = images.first()
      
      if (await firstImage.count() > 0) {
        // Should have placeholder or blur effect initially
        const hasPlaceholder = await firstImage.evaluate(el => {
          const style = window.getComputedStyle(el)
          return style.filter.includes('blur') || el.classList.contains('placeholder')
        })
        
        expect(hasPlaceholder).toBeTruthy()
      }
    })

    test('implements responsive images', async ({ page }) => {
      await page.goto('/')
      
      const images = page.locator('img[src*="unsplash"]')
      const imageCount = await images.count()
      
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const image = images.nth(i)
        const srcset = await image.getAttribute('srcset')
        const sizes = await image.getAttribute('sizes')
        
        // Should have responsive image attributes
        expect(srcset).toBeTruthy()
        expect(sizes).toBeTruthy()
      }
    })
  })

  describe('Image Format Optimization', () => {
    test('serves modern image formats', async ({ page }) => {
      const imageFormats: string[] = []
      
      page.on('response', response => {
        if (response.url().includes('image') || response.url().includes('.jpg') || response.url().includes('.png')) {
          const contentType = response.headers()['content-type']
          if (contentType) {
            imageFormats.push(contentType)
          }
        }
      })
      
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Should serve WebP or AVIF for modern browsers
      const modernFormats = imageFormats.filter(format => 
        format.includes('webp') || format.includes('avif')
      )
      
      expect(modernFormats.length).toBeGreaterThan(0)
    })

    test('falls back to JPEG/PNG for older browsers', async ({ page }) => {
      // Simulate older browser that doesn't support WebP
      await page.setExtraHTTPHeaders({
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/jpeg,image/png,*/*;q=0.8'
      })
      
      const imageFormats: string[] = []
      
      page.on('response', response => {
        if (response.url().includes('image')) {
          const contentType = response.headers()['content-type']
          if (contentType) {
            imageFormats.push(contentType)
          }
        }
      })
      
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Should serve JPEG/PNG for older browsers
      const fallbackFormats = imageFormats.filter(format => 
        format.includes('jpeg') || format.includes('png')
      )
      
      expect(fallbackFormats.length).toBeGreaterThan(0)
    })
  })

  describe('Image Size Optimization', () => {
    test('serves appropriately sized images', async ({ page }) => {
      await page.goto('/')
      
      const images = page.locator('img[src*="unsplash"]')
      const imageCount = await images.count()
      
      for (let i = 0; i < Math.min(imageCount, 3); i++) {
        const image = images.nth(i)
        const src = await image.getAttribute('src')
        const { width, height } = await image.boundingBox() || { width: 0, height: 0 }
        
        // Image URL should contain size parameters
        expect(src).toMatch(/w=\d+/)
        expect(src).toMatch(/h=\d+/)
        
        // Extract size from URL
        const urlWidth = src?.match(/w=(\d+)/)?.[1]
        const urlHeight = src?.match(/h=(\d+)/)?.[1]
        
        if (urlWidth && urlHeight) {
          // Served image should not be significantly larger than display size
          const widthRatio = parseInt(urlWidth) / width
          const heightRatio = parseInt(urlHeight) / height
          
          expect(widthRatio).toBeLessThan(3) // Allow for retina displays
          expect(heightRatio).toBeLessThan(3)
        }
      }
    })

    test('optimizes images for different viewport sizes', async ({ page }) => {
      // Test desktop size
      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.goto('/')
      
      const desktopImageSrc = await page.locator('img').first().getAttribute('src')
      
      // Test mobile size
      await page.setViewportSize({ width: 375, height: 667 })
      await page.reload()
      
      const mobileImageSrc = await page.locator('img').first().getAttribute('src')
      
      // Should serve different sized images for different viewports
      expect(desktopImageSrc).not.toBe(mobileImageSrc)
    })
  })

  describe('Image Loading Performance', () => {
    test('measures image load times', async ({ page }) => {
      const imageLoadTimes: number[] = []
      
      page.on('response', response => {
        if (response.url().includes('unsplash') || response.url().includes('image')) {
          const timing = response.timing()
          const loadTime = timing.responseEnd - timing.requestStart
          imageLoadTimes.push(loadTime)
        }
      })
      
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Images should load reasonably fast
      const averageLoadTime = imageLoadTimes.reduce((a, b) => a + b, 0) / imageLoadTimes.length
      expect(averageLoadTime).toBeLessThan(800)
      
      // No single image should take too long
      const maxLoadTime = Math.max(...imageLoadTimes)
      expect(maxLoadTime).toBeLessThan(2000)
    })

    test('validates image compression', async ({ page }) => {
      const imageSizes: number[] = []
      
      page.on('response', response => {
        if (response.url().includes('unsplash') || response.url().includes('image')) {
          const contentLength = response.headers()['content-length']
          if (contentLength) {
            imageSizes.push(parseInt(contentLength))
          }
        }
      })
      
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Images should be reasonably compressed
      const averageSize = imageSizes.reduce((a, b) => a + b, 0) / imageSizes.length
      expect(averageSize).toBeLessThan(150 * 1024) // 150KB average
      
      // No single image should be too large
      const maxSize = Math.max(...imageSizes)
      expect(maxSize).toBeLessThan(500 * 1024) // 500KB max
    })

    test('measures cumulative image load impact', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto('/')
      
      // Wait for all images to load
      await page.waitForFunction(() => {
        const images = Array.from(document.querySelectorAll('img'))
        return images.every(img => img.complete)
      }, { timeout: 10000 })
      
      const totalImageLoadTime = Date.now() - startTime
      
      // All images should load within reasonable time
      expect(totalImageLoadTime).toBeLessThan(5000)
    })
  })

  describe('Image CDN Performance', () => {
    test('validates CDN usage', async ({ page }) => {
      const cdnRequests: string[] = []
      
      page.on('request', request => {
        const url = request.url()
        if (url.includes('image') || url.includes('unsplash') || url.includes('cloudinary')) {
          cdnRequests.push(url)
        }
      })
      
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Should use CDN for image delivery
      expect(cdnRequests.length).toBeGreaterThan(0)
      
      // CDN URLs should have optimization parameters
      cdnRequests.forEach(url => {
        expect(url).toMatch(/w=\d+|width=\d+/)
        expect(url).toMatch(/q=\d+|quality=\d+/)
      })
    })

    test('measures CDN response times', async ({ page }) => {
      const cdnResponseTimes: number[] = []
      
      page.on('response', response => {
        const url = response.url()
        if (url.includes('unsplash') || url.includes('cloudinary')) {
          const timing = response.timing()
          cdnResponseTimes.push(timing.responseEnd - timing.requestStart)
        }
      })
      
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      if (cdnResponseTimes.length > 0) {
        const averageResponseTime = cdnResponseTimes.reduce((a, b) => a + b, 0) / cdnResponseTimes.length
        
        // CDN should be fast
        expect(averageResponseTime).toBeLessThan(500)
      }
    })
  })

  describe('Image Accessibility and Performance', () => {
    test('validates alt text for performance and accessibility', async ({ page }) => {
      await page.goto('/')
      
      const images = page.locator('img')
      const imageCount = await images.count()
      
      for (let i = 0; i < imageCount; i++) {
        const image = images.nth(i)
        const alt = await image.getAttribute('alt')
        
        // All images should have alt text
        expect(alt).toBeTruthy()
        expect(alt?.length).toBeGreaterThan(0)
      }
    })

    test('implements proper image aspect ratios', async ({ page }) => {
      await page.goto('/')
      
      const images = page.locator('img[src*="unsplash"]')
      const imageCount = await images.count()
      
      for (let i = 0; i < Math.min(imageCount, 3); i++) {
        const image = images.nth(i)
        
        // Should have aspect-ratio CSS or explicit dimensions
        const hasAspectRatio = await image.evaluate(el => {
          const style = window.getComputedStyle(el)
          return style.aspectRatio !== 'auto' || (el.width > 0 && el.height > 0)
        })
        
        expect(hasAspectRatio).toBeTruthy()
      }
    })
  })

  describe('Search Results Image Performance', () => {
    test('optimizes search result images', async ({ page }) => {
      await page.goto('/search?q=Lagos+events')
      
      const resultImages = page.locator('[data-testid="package-card"] img')
      const imageCount = await resultImages.count()
      
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const image = resultImages.nth(i)
        const src = await image.getAttribute('src')
        const loading = await image.getAttribute('loading')
        
        // Search result images should be optimized
        expect(src).toMatch(/w=\d+/)
        expect(src).toMatch(/h=\d+/)
        expect(loading).toBe('lazy')
      }
    })

    test('measures search result image load performance', async ({ page }) => {
      const imageLoadTimes: number[] = []
      
      page.on('response', response => {
        if (response.url().includes('unsplash') && response.url().includes('1600000')) {
          const timing = response.timing()
          imageLoadTimes.push(timing.responseEnd - timing.requestStart)
        }
      })
      
      await page.goto('/search?q=Lagos+events')
      await page.waitForLoadState('networkidle')
      
      if (imageLoadTimes.length > 0) {
        const averageLoadTime = imageLoadTimes.reduce((a, b) => a + b, 0) / imageLoadTimes.length
        expect(averageLoadTime).toBeLessThan(600)
      }
    })
  })

  describe('Image Error Handling', () => {
    test('handles broken images gracefully', async ({ page }) => {
      // Mock broken image response
      await page.route('**/broken-image.jpg', route => {
        route.fulfill({ status: 404 })
      })
      
      await page.goto('/')
      
      // Should show fallback image or placeholder
      const brokenImages = page.locator('img[src*="broken-image"]')
      if (await brokenImages.count() > 0) {
        const fallbackSrc = await brokenImages.first().getAttribute('src')
        expect(fallbackSrc).toMatch(/placeholder|fallback|default/)
      }
    })

    test('implements image loading error recovery', async ({ page }) => {
      let errorCount = 0
      
      page.on('response', response => {
        if (response.url().includes('image') && response.status() >= 400) {
          errorCount++
        }
      })
      
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      // Should handle image errors without breaking the page
      expect(errorCount).toBeLessThan(3) // Allow for some failures
    })
  })
})
