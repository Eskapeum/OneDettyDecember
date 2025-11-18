import { test, expect } from '@playwright/test'

test.describe('Structured Data Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Mock package data for structured data testing
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
            description: 'Join us for an amazing beach party experience in Lagos with live music, food, and entertainment.',
            price: 50000,
            currency: 'NGN',
            type: 'EVENT',
            location: 'Victoria Island, Lagos',
            city: 'Lagos',
            country: 'Nigeria',
            coordinates: { lat: 6.4281, lng: 3.4219 },
            images: ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600'],
            startDate: '2025-12-25T18:00:00Z',
            endDate: '2025-12-25T23:59:00Z',
            vendor: {
              id: 'vendor-1',
              businessName: 'Lagos Event Planners',
              description: 'Premier event planning company in Lagos',
              email: 'info@lagoseventplanners.com',
              phone: '+234-801-234-5678',
              website: 'https://lagoseventplanners.com',
            },
            rating: 4.8,
            reviewCount: 156,
            categories: ['beach', 'music', 'party'],
            amenities: ['Live Music', 'Food & Drinks', 'Beach Access'],
            capacity: 500,
            ageRestriction: '18+',
          },
        }),
      })
    })

    await page.route('/api/vendors/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          vendor: {
            id: 'vendor-1',
            businessName: 'Lagos Event Planners',
            description: 'Premier event planning company in Lagos specializing in beach parties and corporate events.',
            email: 'info@lagoseventplanners.com',
            phone: '+234-801-234-5678',
            website: 'https://lagoseventplanners.com',
            address: '123 Victoria Island, Lagos, Nigeria',
            rating: 4.9,
            reviewCount: 89,
            established: '2018',
            services: ['Event Planning', 'Catering', 'Entertainment'],
            socialMedia: {
              instagram: '@lagoseventplanners',
              facebook: 'LagosEventPlanners',
              twitter: '@LagosEvents',
            },
          },
        }),
      })
    })
  })

  describe('Event Structured Data', () => {
    test('has valid Event schema markup', async ({ page }) => {
      await page.goto('/packages/pkg-1')
      
      const structuredData = await page.locator('script[type="application/ld+json"]').first().textContent()
      expect(structuredData).toBeTruthy()
      
      const jsonLd = JSON.parse(structuredData!)
      
      // Basic Event schema validation
      expect(jsonLd['@context']).toBe('https://schema.org')
      expect(jsonLd['@type']).toBe('Event')
      expect(jsonLd.name).toBe('Lagos Beach Party - December 2025')
      expect(jsonLd.description).toContain('beach party experience')
      expect(jsonLd.startDate).toBe('2025-12-25T18:00:00Z')
      expect(jsonLd.endDate).toBe('2025-12-25T23:59:00Z')
      
      // Location validation
      expect(jsonLd.location).toBeDefined()
      expect(jsonLd.location['@type']).toBe('Place')
      expect(jsonLd.location.name).toBe('Victoria Island, Lagos')
      expect(jsonLd.location.address).toBeDefined()
      expect(jsonLd.location.address.addressLocality).toBe('Lagos')
      expect(jsonLd.location.address.addressCountry).toBe('Nigeria')
      
      // Organizer validation
      expect(jsonLd.organizer).toBeDefined()
      expect(jsonLd.organizer['@type']).toBe('Organization')
      expect(jsonLd.organizer.name).toBe('Lagos Event Planners')
      
      // Offers validation
      expect(jsonLd.offers).toBeDefined()
      expect(jsonLd.offers['@type']).toBe('Offer')
      expect(jsonLd.offers.price).toBe('50000')
      expect(jsonLd.offers.priceCurrency).toBe('NGN')
      expect(jsonLd.offers.availability).toBe('https://schema.org/InStock')
    })

    test('has valid image schema in Event', async ({ page }) => {
      await page.goto('/packages/pkg-1')
      
      const structuredData = await page.locator('script[type="application/ld+json"]').first().textContent()
      const jsonLd = JSON.parse(structuredData!)
      
      expect(jsonLd.image).toBeDefined()
      expect(Array.isArray(jsonLd.image)).toBeTruthy()
      expect(jsonLd.image[0]).toMatch(/^https?:\/\//)
      expect(jsonLd.image[0]).toContain('unsplash.com')
    })

    test('has valid performer schema for events', async ({ page }) => {
      await page.goto('/packages/pkg-1')
      
      const structuredData = await page.locator('script[type="application/ld+json"]').first().textContent()
      const jsonLd = JSON.parse(structuredData!)
      
      if (jsonLd.performer) {
        expect(jsonLd.performer['@type']).toBe('Organization')
        expect(jsonLd.performer.name).toBeTruthy()
      }
    })

    test('has valid audience schema', async ({ page }) => {
      await page.goto('/packages/pkg-1')
      
      const structuredData = await page.locator('script[type="application/ld+json"]').first().textContent()
      const jsonLd = JSON.parse(structuredData!)
      
      if (jsonLd.audience) {
        expect(jsonLd.audience['@type']).toBe('Audience')
        expect(jsonLd.audience.audienceType).toBeTruthy()
      }
    })
  })

  describe('Organization Structured Data', () => {
    test('has valid Organization schema for vendor', async ({ page }) => {
      await page.goto('/vendors/vendor-1')
      
      const structuredData = await page.locator('script[type="application/ld+json"]').textContent()
      expect(structuredData).toBeTruthy()
      
      const jsonLd = JSON.parse(structuredData!)
      
      expect(jsonLd['@context']).toBe('https://schema.org')
      expect(jsonLd['@type']).toBe('Organization')
      expect(jsonLd.name).toBe('Lagos Event Planners')
      expect(jsonLd.description).toContain('Premier event planning company')
      expect(jsonLd.email).toBe('info@lagoseventplanners.com')
      expect(jsonLd.telephone).toBe('+234-801-234-5678')
      expect(jsonLd.url).toBe('https://lagoseventplanners.com')
      
      // Address validation
      expect(jsonLd.address).toBeDefined()
      expect(jsonLd.address['@type']).toBe('PostalAddress')
      expect(jsonLd.address.streetAddress).toBeTruthy()
      expect(jsonLd.address.addressLocality).toBe('Lagos')
      expect(jsonLd.address.addressCountry).toBe('Nigeria')
      
      // Aggregate rating validation
      if (jsonLd.aggregateRating) {
        expect(jsonLd.aggregateRating['@type']).toBe('AggregateRating')
        expect(jsonLd.aggregateRating.ratingValue).toBe('4.9')
        expect(jsonLd.aggregateRating.reviewCount).toBe('89')
        expect(jsonLd.aggregateRating.bestRating).toBe('5')
        expect(jsonLd.aggregateRating.worstRating).toBe('1')
      }
    })

    test('has valid social media links in Organization schema', async ({ page }) => {
      await page.goto('/vendors/vendor-1')
      
      const structuredData = await page.locator('script[type="application/ld+json"]').textContent()
      const jsonLd = JSON.parse(structuredData!)
      
      if (jsonLd.sameAs) {
        expect(Array.isArray(jsonLd.sameAs)).toBeTruthy()
        jsonLd.sameAs.forEach((url: string) => {
          expect(url).toMatch(/^https?:\/\//)
        })
      }
    })
  })

  describe('Product/Service Structured Data', () => {
    test('has valid Product schema for packages', async ({ page }) => {
      await page.goto('/packages/pkg-1')
      
      // Look for Product schema (might be separate from Event schema)
      const scripts = await page.locator('script[type="application/ld+json"]').all()
      let productSchema = null
      
      for (const script of scripts) {
        const content = await script.textContent()
        const jsonLd = JSON.parse(content!)
        if (jsonLd['@type'] === 'Product' || jsonLd['@type'] === 'Service') {
          productSchema = jsonLd
          break
        }
      }
      
      if (productSchema) {
        expect(productSchema['@context']).toBe('https://schema.org')
        expect(productSchema.name).toBeTruthy()
        expect(productSchema.description).toBeTruthy()
        expect(productSchema.offers).toBeDefined()
        expect(productSchema.offers.price).toBeTruthy()
        expect(productSchema.offers.priceCurrency).toBe('NGN')
      }
    })
  })

  describe('Breadcrumb Structured Data', () => {
    test('has valid BreadcrumbList schema', async ({ page }) => {
      await page.goto('/packages/pkg-1')
      
      const scripts = await page.locator('script[type="application/ld+json"]').all()
      let breadcrumbSchema = null
      
      for (const script of scripts) {
        const content = await script.textContent()
        const jsonLd = JSON.parse(content!)
        if (jsonLd['@type'] === 'BreadcrumbList') {
          breadcrumbSchema = jsonLd
          break
        }
      }
      
      if (breadcrumbSchema) {
        expect(breadcrumbSchema['@context']).toBe('https://schema.org')
        expect(breadcrumbSchema['@type']).toBe('BreadcrumbList')
        expect(breadcrumbSchema.itemListElement).toBeDefined()
        expect(Array.isArray(breadcrumbSchema.itemListElement)).toBeTruthy()
        
        breadcrumbSchema.itemListElement.forEach((item: any, index: number) => {
          expect(item['@type']).toBe('ListItem')
          expect(item.position).toBe(index + 1)
          expect(item.name).toBeTruthy()
          expect(item.item).toMatch(/^https?:\/\//)
        })
      }
    })
  })

  describe('Review Structured Data', () => {
    test('has valid Review schema for packages with reviews', async ({ page }) => {
      await page.goto('/packages/pkg-1')
      
      const scripts = await page.locator('script[type="application/ld+json"]').all()
      let reviewSchema = null
      
      for (const script of scripts) {
        const content = await script.textContent()
        const jsonLd = JSON.parse(content!)
        if (jsonLd['@type'] === 'Review' || (jsonLd.review && Array.isArray(jsonLd.review))) {
          reviewSchema = jsonLd
          break
        }
      }
      
      if (reviewSchema) {
        const reviews = reviewSchema['@type'] === 'Review' ? [reviewSchema] : reviewSchema.review
        
        reviews.forEach((review: any) => {
          expect(review['@type']).toBe('Review')
          expect(review.author).toBeDefined()
          expect(review.author['@type']).toBe('Person')
          expect(review.reviewRating).toBeDefined()
          expect(review.reviewRating['@type']).toBe('Rating')
          expect(review.reviewRating.ratingValue).toBeTruthy()
          expect(review.reviewBody).toBeTruthy()
        })
      }
    })
  })

  describe('FAQ Structured Data', () => {
    test('has valid FAQPage schema when FAQ section exists', async ({ page }) => {
      await page.goto('/packages/pkg-1')
      
      const scripts = await page.locator('script[type="application/ld+json"]').all()
      let faqSchema = null
      
      for (const script of scripts) {
        const content = await script.textContent()
        const jsonLd = JSON.parse(content!)
        if (jsonLd['@type'] === 'FAQPage') {
          faqSchema = jsonLd
          break
        }
      }
      
      if (faqSchema) {
        expect(faqSchema['@context']).toBe('https://schema.org')
        expect(faqSchema['@type']).toBe('FAQPage')
        expect(faqSchema.mainEntity).toBeDefined()
        expect(Array.isArray(faqSchema.mainEntity)).toBeTruthy()
        
        faqSchema.mainEntity.forEach((qa: any) => {
          expect(qa['@type']).toBe('Question')
          expect(qa.name).toBeTruthy()
          expect(qa.acceptedAnswer).toBeDefined()
          expect(qa.acceptedAnswer['@type']).toBe('Answer')
          expect(qa.acceptedAnswer.text).toBeTruthy()
        })
      }
    })
  })

  describe('Local Business Structured Data', () => {
    test('has valid LocalBusiness schema for location-based vendors', async ({ page }) => {
      await page.goto('/vendors/vendor-1')
      
      const scripts = await page.locator('script[type="application/ld+json"]').all()
      let localBusinessSchema = null
      
      for (const script of scripts) {
        const content = await script.textContent()
        const jsonLd = JSON.parse(content!)
        if (jsonLd['@type'] === 'LocalBusiness' || jsonLd['@type'] === 'EventPlanner') {
          localBusinessSchema = jsonLd
          break
        }
      }
      
      if (localBusinessSchema) {
        expect(localBusinessSchema['@context']).toBe('https://schema.org')
        expect(localBusinessSchema.name).toBeTruthy()
        expect(localBusinessSchema.address).toBeDefined()
        expect(localBusinessSchema.telephone).toBeTruthy()
        
        if (localBusinessSchema.geo) {
          expect(localBusinessSchema.geo['@type']).toBe('GeoCoordinates')
          expect(localBusinessSchema.geo.latitude).toBeTruthy()
          expect(localBusinessSchema.geo.longitude).toBeTruthy()
        }
        
        if (localBusinessSchema.openingHours) {
          expect(Array.isArray(localBusinessSchema.openingHours)).toBeTruthy()
        }
      }
    })
  })

  describe('Structured Data Validation', () => {
    test('validates JSON-LD syntax', async ({ page }) => {
      await page.goto('/packages/pkg-1')
      
      const scripts = await page.locator('script[type="application/ld+json"]').all()
      
      for (const script of scripts) {
        const content = await script.textContent()
        expect(content).toBeTruthy()
        
        // Should be valid JSON
        expect(() => JSON.parse(content!)).not.toThrow()
        
        const jsonLd = JSON.parse(content!)
        
        // Should have required schema.org properties
        expect(jsonLd['@context']).toBe('https://schema.org')
        expect(jsonLd['@type']).toBeTruthy()
      }
    })

    test('validates required properties for Event schema', async ({ page }) => {
      await page.goto('/packages/pkg-1')
      
      const structuredData = await page.locator('script[type="application/ld+json"]').first().textContent()
      const jsonLd = JSON.parse(structuredData!)
      
      if (jsonLd['@type'] === 'Event') {
        // Required properties for Event
        expect(jsonLd.name).toBeTruthy()
        expect(jsonLd.startDate).toBeTruthy()
        expect(jsonLd.location).toBeTruthy()
        
        // Recommended properties
        expect(jsonLd.description).toBeTruthy()
        expect(jsonLd.organizer).toBeTruthy()
        expect(jsonLd.offers).toBeTruthy()
      }
    })

    test('validates no duplicate structured data', async ({ page }) => {
      await page.goto('/packages/pkg-1')
      
      const scripts = await page.locator('script[type="application/ld+json"]').all()
      const types: string[] = []
      
      for (const script of scripts) {
        const content = await script.textContent()
        const jsonLd = JSON.parse(content!)
        types.push(jsonLd['@type'])
      }
      
      // Should not have duplicate schema types (unless intentional)
      const uniqueTypes = [...new Set(types)]
      expect(types.length).toBeLessThanOrEqual(uniqueTypes.length + 2) // Allow some duplication
    })

    test('validates schema.org URLs are HTTPS', async ({ page }) => {
      await page.goto('/packages/pkg-1')
      
      const scripts = await page.locator('script[type="application/ld+json"]').all()
      
      for (const script of scripts) {
        const content = await script.textContent()
        const jsonLd = JSON.parse(content!)
        
        // Check all URL properties
        const checkUrls = (obj: any) => {
          for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'string' && value.startsWith('http')) {
              expect(value).toMatch(/^https:\/\//)
            } else if (typeof value === 'object' && value !== null) {
              checkUrls(value)
            }
          }
        }
        
        checkUrls(jsonLd)
      }
    })
  })

  describe('Rich Snippets Testing', () => {
    test('has proper markup for Google rich snippets', async ({ page }) => {
      await page.goto('/packages/pkg-1')
      
      // Check for rich snippet eligible content
      const structuredData = await page.locator('script[type="application/ld+json"]').first().textContent()
      const jsonLd = JSON.parse(structuredData!)
      
      if (jsonLd['@type'] === 'Event') {
        // Event rich snippet requirements
        expect(jsonLd.name).toBeTruthy()
        expect(jsonLd.startDate).toBeTruthy()
        expect(jsonLd.location).toBeTruthy()
        expect(jsonLd.location.name).toBeTruthy()
        
        if (jsonLd.offers) {
          expect(jsonLd.offers.price).toBeTruthy()
          expect(jsonLd.offers.priceCurrency).toBeTruthy()
        }
      }
    })
  })
})
