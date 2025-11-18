import { test, expect } from '@playwright/test'

test.describe('SEO Meta Tags Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Mock package data for consistent testing
    await page.route('/api/packages/**', async (route) => {
      const url = route.request().url()
      const packageId = url.split('/').pop()
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          package: {
            id: packageId,
            title: 'Lagos Beach Party - December 2025',
            description: 'Join us for an amazing beach party experience in Lagos with live music, food, and entertainment. Perfect for celebrating the holiday season.',
            price: 50000,
            currency: 'NGN',
            type: 'EVENT',
            location: 'Victoria Island, Lagos',
            city: 'Lagos',
            country: 'Nigeria',
            images: [
              'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600',
              'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600',
            ],
            startDate: '2025-12-25T18:00:00Z',
            endDate: '2025-12-25T23:59:00Z',
            vendor: {
              id: 'vendor-1',
              businessName: 'Lagos Event Planners',
              description: 'Premier event planning company in Lagos',
            },
            rating: 4.8,
            reviewCount: 156,
            categories: ['beach', 'music', 'party'],
            amenities: ['Live Music', 'Food & Drinks', 'Beach Access'],
          },
        }),
      })
    })

    await page.route('/api/search**', async (route) => {
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
              location: 'Lagos',
              images: ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300'],
            },
          ],
          totalCount: 1,
        }),
      })
    })
  })

  describe('Homepage Meta Tags', () => {
    test('has proper title tag', async ({ page }) => {
      await page.goto('/')
      
      const title = await page.title()
      expect(title).toBe('OneDettyDecember - Discover Amazing Events, Stays & Experiences in West Africa')
      expect(title.length).toBeLessThan(60) // SEO best practice
    })

    test('has meta description', async ({ page }) => {
      await page.goto('/')
      
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content')
      expect(metaDescription).toBeTruthy()
      expect(metaDescription).toContain('OneDettyDecember')
      expect(metaDescription).toContain('events')
      expect(metaDescription).toContain('West Africa')
      expect(metaDescription!.length).toBeGreaterThan(120)
      expect(metaDescription!.length).toBeLessThan(160) // SEO best practice
    })

    test('has Open Graph meta tags', async ({ page }) => {
      await page.goto('/')
      
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
      const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content')
      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')
      const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content')
      const ogType = await page.locator('meta[property="og:type"]').getAttribute('content')
      
      expect(ogTitle).toBeTruthy()
      expect(ogDescription).toBeTruthy()
      expect(ogImage).toBeTruthy()
      expect(ogUrl).toBeTruthy()
      expect(ogType).toBe('website')
      
      // Validate image URL
      expect(ogImage).toMatch(/^https?:\/\//)
    })

    test('has Twitter Card meta tags', async ({ page }) => {
      await page.goto('/')
      
      const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content')
      const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content')
      const twitterDescription = await page.locator('meta[name="twitter:description"]').getAttribute('content')
      const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute('content')
      
      expect(twitterCard).toBe('summary_large_image')
      expect(twitterTitle).toBeTruthy()
      expect(twitterDescription).toBeTruthy()
      expect(twitterImage).toBeTruthy()
    })

    test('has canonical URL', async ({ page }) => {
      await page.goto('/')
      
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
      expect(canonical).toBeTruthy()
      expect(canonical).toMatch(/^https?:\/\//)
    })

    test('has proper viewport meta tag', async ({ page }) => {
      await page.goto('/')
      
      const viewport = await page.locator('meta[name="viewport"]').getAttribute('content')
      expect(viewport).toBe('width=device-width, initial-scale=1')
    })

    test('has language attributes', async ({ page }) => {
      await page.goto('/')
      
      const htmlLang = await page.locator('html').getAttribute('lang')
      expect(htmlLang).toBe('en')
    })
  })

  describe('Search Results Meta Tags', () => {
    test('has dynamic title for search results', async ({ page }) => {
      await page.goto('/search?q=Lagos+events')
      
      const title = await page.title()
      expect(title).toContain('Lagos events')
      expect(title).toContain('OneDettyDecember')
      expect(title.length).toBeLessThan(60)
    })

    test('has dynamic meta description for search', async ({ page }) => {
      await page.goto('/search?q=Lagos+events')
      
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content')
      expect(metaDescription).toContain('Lagos events')
      expect(metaDescription).toContain('search results')
      expect(metaDescription!.length).toBeLessThan(160)
    })

    test('has proper canonical URL for search', async ({ page }) => {
      await page.goto('/search?q=Lagos+events')
      
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
      expect(canonical).toContain('/search')
      expect(canonical).toContain('q=Lagos+events')
    })

    test('has noindex for filtered search results', async ({ page }) => {
      await page.goto('/search?q=Lagos&type=EVENT&city=Lagos&minPrice=10000')
      
      const robots = await page.locator('meta[name="robots"]').getAttribute('content')
      expect(robots).toContain('noindex')
    })
  })

  describe('Package Detail Meta Tags', () => {
    test('has dynamic title for package detail', async ({ page }) => {
      await page.goto('/packages/pkg-1')
      
      const title = await page.title()
      expect(title).toContain('Lagos Beach Party')
      expect(title).toContain('OneDettyDecember')
      expect(title.length).toBeLessThan(60)
    })

    test('has dynamic meta description for package', async ({ page }) => {
      await page.goto('/packages/pkg-1')
      
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content')
      expect(metaDescription).toContain('Lagos Beach Party')
      expect(metaDescription).toContain('beach party experience')
      expect(metaDescription!.length).toBeGreaterThan(120)
      expect(metaDescription!.length).toBeLessThan(160)
    })

    test('has package-specific Open Graph tags', async ({ page }) => {
      await page.goto('/packages/pkg-1')
      
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
      const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content')
      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')
      const ogType = await page.locator('meta[property="og:type"]').getAttribute('content')
      const ogPrice = await page.locator('meta[property="product:price:amount"]').getAttribute('content')
      const ogCurrency = await page.locator('meta[property="product:price:currency"]').getAttribute('content')
      
      expect(ogTitle).toContain('Lagos Beach Party')
      expect(ogDescription).toContain('beach party experience')
      expect(ogImage).toContain('unsplash.com')
      expect(ogType).toBe('product')
      expect(ogPrice).toBe('50000')
      expect(ogCurrency).toBe('NGN')
    })

    test('has event-specific structured data', async ({ page }) => {
      await page.goto('/packages/pkg-1')
      
      const structuredData = await page.locator('script[type="application/ld+json"]').textContent()
      expect(structuredData).toBeTruthy()
      
      const jsonLd = JSON.parse(structuredData!)
      expect(jsonLd['@type']).toBe('Event')
      expect(jsonLd.name).toBe('Lagos Beach Party - December 2025')
      expect(jsonLd.description).toContain('beach party experience')
      expect(jsonLd.startDate).toBe('2025-12-25T18:00:00Z')
      expect(jsonLd.location).toBeDefined()
      expect(jsonLd.offers).toBeDefined()
      expect(jsonLd.organizer).toBeDefined()
    })

    test('has proper image meta tags', async ({ page }) => {
      await page.goto('/packages/pkg-1')
      
      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')
      const ogImageWidth = await page.locator('meta[property="og:image:width"]').getAttribute('content')
      const ogImageHeight = await page.locator('meta[property="og:image:height"]').getAttribute('content')
      const ogImageAlt = await page.locator('meta[property="og:image:alt"]').getAttribute('content')
      
      expect(ogImage).toMatch(/^https?:\/\//)
      expect(ogImageWidth).toBe('800')
      expect(ogImageHeight).toBe('600')
      expect(ogImageAlt).toContain('Lagos Beach Party')
    })
  })

  describe('Meta Tags Validation', () => {
    test('validates meta tag lengths', async ({ page }) => {
      await page.goto('/')
      
      const title = await page.title()
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content')
      
      // Title should be 50-60 characters
      expect(title.length).toBeGreaterThan(30)
      expect(title.length).toBeLessThan(60)
      
      // Meta description should be 120-160 characters
      expect(metaDescription!.length).toBeGreaterThan(120)
      expect(metaDescription!.length).toBeLessThan(160)
    })

    test('validates no duplicate meta tags', async ({ page }) => {
      await page.goto('/')
      
      const titleTags = await page.locator('title').count()
      const descriptionTags = await page.locator('meta[name="description"]').count()
      const canonicalTags = await page.locator('link[rel="canonical"]').count()
      
      expect(titleTags).toBe(1)
      expect(descriptionTags).toBe(1)
      expect(canonicalTags).toBe(1)
    })

    test('validates meta tag content quality', async ({ page }) => {
      await page.goto('/')
      
      const title = await page.title()
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content')
      
      // Should not contain placeholder text
      expect(title).not.toContain('TODO')
      expect(title).not.toContain('placeholder')
      expect(metaDescription).not.toContain('TODO')
      expect(metaDescription).not.toContain('placeholder')
      
      // Should contain relevant keywords
      expect(title.toLowerCase()).toMatch(/events?|experiences?|stays?/)
      expect(metaDescription!.toLowerCase()).toMatch(/events?|experiences?|stays?/)
    })

    test('validates social media meta tags', async ({ page }) => {
      await page.goto('/packages/pkg-1')
      
      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')
      const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute('content')
      
      // Images should be absolute URLs
      expect(ogImage).toMatch(/^https?:\/\//)
      expect(twitterImage).toMatch(/^https?:\/\//)
      
      // Should have proper dimensions for social sharing
      const ogImageWidth = await page.locator('meta[property="og:image:width"]').getAttribute('content')
      const ogImageHeight = await page.locator('meta[property="og:image:height"]').getAttribute('content')
      
      expect(parseInt(ogImageWidth!)).toBeGreaterThan(600)
      expect(parseInt(ogImageHeight!)).toBeGreaterThan(400)
    })
  })

  describe('Mobile Meta Tags', () => {
    test('has mobile-specific meta tags', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')
      
      const viewport = await page.locator('meta[name="viewport"]').getAttribute('content')
      const appleMobileCapable = await page.locator('meta[name="apple-mobile-web-app-capable"]').getAttribute('content')
      const appleMobileTitle = await page.locator('meta[name="apple-mobile-web-app-title"]').getAttribute('content')
      
      expect(viewport).toContain('width=device-width')
      expect(viewport).toContain('initial-scale=1')
      
      if (appleMobileCapable) {
        expect(appleMobileCapable).toBe('yes')
      }
      
      if (appleMobileTitle) {
        expect(appleMobileTitle).toContain('OneDettyDecember')
      }
    })

    test('has proper theme color meta tag', async ({ page }) => {
      await page.goto('/')
      
      const themeColor = await page.locator('meta[name="theme-color"]').getAttribute('content')
      expect(themeColor).toBeTruthy()
      expect(themeColor).toMatch(/^#[0-9a-fA-F]{6}$/) // Valid hex color
    })
  })

  describe('Internationalization Meta Tags', () => {
    test('has proper hreflang tags for supported languages', async ({ page }) => {
      await page.goto('/')
      
      const hreflangTags = await page.locator('link[rel="alternate"][hreflang]').count()
      
      if (hreflangTags > 0) {
        const hreflangEn = await page.locator('link[rel="alternate"][hreflang="en"]').getAttribute('href')
        expect(hreflangEn).toBeTruthy()
      }
    })

    test('has proper language declaration', async ({ page }) => {
      await page.goto('/')
      
      const htmlLang = await page.locator('html').getAttribute('lang')
      expect(htmlLang).toBe('en')
    })
  })
})
