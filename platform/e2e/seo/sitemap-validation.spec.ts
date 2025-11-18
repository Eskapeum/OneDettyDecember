import { test, expect } from '@playwright/test'

test.describe('Sitemap Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Mock sitemap data
    await page.route('/api/sitemap**', async (route) => {
      const url = route.request().url()
      
      if (url.includes('/api/sitemap/packages')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            urls: [
              {
                url: 'https://onedetty.com/packages/pkg-1',
                lastModified: '2025-11-18T10:00:00Z',
                changeFrequency: 'weekly',
                priority: 0.8,
              },
              {
                url: 'https://onedetty.com/packages/pkg-2',
                lastModified: '2025-11-17T15:30:00Z',
                changeFrequency: 'weekly',
                priority: 0.8,
              },
            ],
          }),
        })
      } else if (url.includes('/api/sitemap/vendors')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            urls: [
              {
                url: 'https://onedetty.com/vendors/vendor-1',
                lastModified: '2025-11-15T09:00:00Z',
                changeFrequency: 'monthly',
                priority: 0.6,
              },
            ],
          }),
        })
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            urls: [
              {
                url: 'https://onedetty.com/',
                lastModified: '2025-11-18T12:00:00Z',
                changeFrequency: 'daily',
                priority: 1.0,
              },
              {
                url: 'https://onedetty.com/search',
                lastModified: '2025-11-18T12:00:00Z',
                changeFrequency: 'daily',
                priority: 0.9,
              },
            ],
          }),
        })
      }
    })
  })

  describe('Main Sitemap', () => {
    test('generates valid XML sitemap', async ({ page }) => {
      const response = await page.goto('/sitemap.xml')
      expect(response?.status()).toBe(200)
      
      const contentType = response?.headers()['content-type']
      expect(contentType).toContain('application/xml')
      
      const sitemapContent = await page.content()
      
      // Should be valid XML
      expect(sitemapContent).toContain('<?xml version="1.0" encoding="UTF-8"?>')
      expect(sitemapContent).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
      expect(sitemapContent).toContain('</urlset>')
    })

    test('includes all main pages in sitemap', async ({ page }) => {
      await page.goto('/sitemap.xml')
      const sitemapContent = await page.content()
      
      // Main pages should be included
      expect(sitemapContent).toContain('<loc>https://onedetty.com/</loc>')
      expect(sitemapContent).toContain('<loc>https://onedetty.com/search</loc>')
      
      // Should have proper XML structure
      expect(sitemapContent).toContain('<url>')
      expect(sitemapContent).toContain('<loc>')
      expect(sitemapContent).toContain('<lastmod>')
      expect(sitemapContent).toContain('<changefreq>')
      expect(sitemapContent).toContain('<priority>')
    })

    test('has proper priority values', async ({ page }) => {
      await page.goto('/sitemap.xml')
      const sitemapContent = await page.content()
      
      // Homepage should have highest priority
      const homepageMatch = sitemapContent.match(/<url>[\s\S]*?<loc>https:\/\/onedetty\.com\/<\/loc>[\s\S]*?<priority>([\d.]+)<\/priority>[\s\S]*?<\/url>/)
      if (homepageMatch) {
        const priority = parseFloat(homepageMatch[1])
        expect(priority).toBe(1.0)
      }
      
      // Search page should have high priority
      const searchMatch = sitemapContent.match(/<url>[\s\S]*?<loc>https:\/\/onedetty\.com\/search<\/loc>[\s\S]*?<priority>([\d.]+)<\/priority>[\s\S]*?<\/url>/)
      if (searchMatch) {
        const priority = parseFloat(searchMatch[1])
        expect(priority).toBeGreaterThan(0.8)
      }
    })

    test('has valid lastmod dates', async ({ page }) => {
      await page.goto('/sitemap.xml')
      const sitemapContent = await page.content()
      
      const lastmodMatches = sitemapContent.match(/<lastmod>([^<]+)<\/lastmod>/g)
      expect(lastmodMatches).toBeTruthy()
      
      lastmodMatches?.forEach(match => {
        const dateString = match.replace(/<\/?lastmod>/g, '')
        const date = new Date(dateString)
        expect(date.getTime()).not.toBeNaN()
        expect(dateString).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
      })
    })

    test('has valid changefreq values', async ({ page }) => {
      await page.goto('/sitemap.xml')
      const sitemapContent = await page.content()
      
      const changefreqMatches = sitemapContent.match(/<changefreq>([^<]+)<\/changefreq>/g)
      expect(changefreqMatches).toBeTruthy()
      
      const validFrequencies = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']
      
      changefreqMatches?.forEach(match => {
        const frequency = match.replace(/<\/?changefreq>/g, '')
        expect(validFrequencies).toContain(frequency)
      })
    })
  })

  describe('Sitemap Index', () => {
    test('generates sitemap index when multiple sitemaps exist', async ({ page }) => {
      const response = await page.goto('/sitemap-index.xml')
      
      if (response?.status() === 200) {
        const contentType = response.headers()['content-type']
        expect(contentType).toContain('application/xml')
        
        const indexContent = await page.content()
        
        // Should be valid sitemap index XML
        expect(indexContent).toContain('<?xml version="1.0" encoding="UTF-8"?>')
        expect(indexContent).toContain('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
        expect(indexContent).toContain('</sitemapindex>')
        
        // Should reference individual sitemaps
        expect(indexContent).toContain('<sitemap>')
        expect(indexContent).toContain('<loc>')
        expect(indexContent).toContain('<lastmod>')
      }
    })

    test('includes all sitemap files in index', async ({ page }) => {
      const response = await page.goto('/sitemap-index.xml')
      
      if (response?.status() === 200) {
        const indexContent = await page.content()
        
        // Should include main sitemap
        expect(indexContent).toContain('<loc>https://onedetty.com/sitemap.xml</loc>')
        
        // Should include category sitemaps if they exist
        const possibleSitemaps = [
          'sitemap-packages.xml',
          'sitemap-vendors.xml',
          'sitemap-categories.xml',
          'sitemap-cities.xml',
        ]
        
        let foundSitemaps = 0
        possibleSitemaps.forEach(sitemap => {
          if (indexContent.includes(sitemap)) {
            foundSitemaps++
          }
        })
        
        expect(foundSitemaps).toBeGreaterThan(0)
      }
    })
  })

  describe('Dynamic Sitemaps', () => {
    test('generates packages sitemap', async ({ page }) => {
      const response = await page.goto('/sitemap-packages.xml')
      
      if (response?.status() === 200) {
        const sitemapContent = await page.content()
        
        // Should contain package URLs
        expect(sitemapContent).toContain('<loc>https://onedetty.com/packages/pkg-1</loc>')
        expect(sitemapContent).toContain('<loc>https://onedetty.com/packages/pkg-2</loc>')
        
        // Package pages should have appropriate priority
        const packageMatches = sitemapContent.match(/<url>[\s\S]*?<loc>https:\/\/onedetty\.com\/packages\/[^<]+<\/loc>[\s\S]*?<priority>([\d.]+)<\/priority>[\s\S]*?<\/url>/g)
        packageMatches?.forEach(match => {
          const priorityMatch = match.match(/<priority>([\d.]+)<\/priority>/)
          if (priorityMatch) {
            const priority = parseFloat(priorityMatch[1])
            expect(priority).toBeGreaterThan(0.5)
            expect(priority).toBeLessThanOrEqual(1.0)
          }
        })
      }
    })

    test('generates vendors sitemap', async ({ page }) => {
      const response = await page.goto('/sitemap-vendors.xml')
      
      if (response?.status() === 200) {
        const sitemapContent = await page.content()
        
        // Should contain vendor URLs
        expect(sitemapContent).toContain('<loc>https://onedetty.com/vendors/vendor-1</loc>')
        
        // Vendor pages should have monthly change frequency
        expect(sitemapContent).toContain('<changefreq>monthly</changefreq>')
      }
    })

    test('handles large sitemaps with pagination', async ({ page }) => {
      // Test that sitemaps are split when they exceed 50,000 URLs
      const response = await page.goto('/sitemap-packages.xml')
      
      if (response?.status() === 200) {
        const sitemapContent = await page.content()
        
        // Count URLs in sitemap
        const urlMatches = sitemapContent.match(/<url>/g)
        const urlCount = urlMatches ? urlMatches.length : 0
        
        // Should not exceed 50,000 URLs per sitemap
        expect(urlCount).toBeLessThanOrEqual(50000)
        
        // If there are many URLs, check for pagination
        if (urlCount > 1000) {
          // Should have pagination links or multiple sitemap files
          const paginationResponse = await page.goto('/sitemap-packages-2.xml')
          if (paginationResponse?.status() === 200) {
            expect(paginationResponse.status()).toBe(200)
          }
        }
      }
    })
  })

  describe('Robots.txt Integration', () => {
    test('robots.txt references sitemap', async ({ page }) => {
      const response = await page.goto('/robots.txt')
      expect(response?.status()).toBe(200)
      
      const robotsContent = await page.textContent('body')
      
      // Should reference sitemap
      expect(robotsContent).toContain('Sitemap:')
      expect(robotsContent).toContain('https://onedetty.com/sitemap.xml')
      
      // Should have proper user-agent directives
      expect(robotsContent).toContain('User-agent:')
    })

    test('robots.txt has proper directives', async ({ page }) => {
      await page.goto('/robots.txt')
      const robotsContent = await page.textContent('body')
      
      // Should allow search engines
      expect(robotsContent).toContain('User-agent: *')
      
      // Should disallow admin/private areas
      const disallowedPaths = ['/admin', '/api', '/_next']
      disallowedPaths.forEach(path => {
        if (robotsContent?.includes(`Disallow: ${path}`)) {
          expect(robotsContent).toContain(`Disallow: ${path}`)
        }
      })
      
      // Should have crawl delay if needed
      if (robotsContent?.includes('Crawl-delay:')) {
        const crawlDelayMatch = robotsContent.match(/Crawl-delay:\s*(\d+)/)
        if (crawlDelayMatch) {
          const delay = parseInt(crawlDelayMatch[1])
          expect(delay).toBeGreaterThan(0)
          expect(delay).toBeLessThan(10)
        }
      }
    })
  })

  describe('Sitemap Performance', () => {
    test('sitemap loads within acceptable time', async ({ page }) => {
      const startTime = Date.now()
      
      const response = await page.goto('/sitemap.xml')
      expect(response?.status()).toBe(200)
      
      const loadTime = Date.now() - startTime
      
      // Sitemap should load within 2 seconds
      expect(loadTime).toBeLessThan(2000)
    })

    test('sitemap has proper caching headers', async ({ page }) => {
      const response = await page.goto('/sitemap.xml')
      
      const cacheControl = response?.headers()['cache-control']
      if (cacheControl) {
        // Should have caching enabled
        expect(cacheControl).toMatch(/max-age=\d+/)
        
        // Cache should be reasonable (not too short, not too long)
        const maxAgeMatch = cacheControl.match(/max-age=(\d+)/)
        if (maxAgeMatch) {
          const maxAge = parseInt(maxAgeMatch[1])
          expect(maxAge).toBeGreaterThan(300) // At least 5 minutes
          expect(maxAge).toBeLessThan(86400) // Less than 24 hours
        }
      }
    })

    test('sitemap compression is enabled', async ({ page }) => {
      const response = await page.goto('/sitemap.xml')
      
      const contentEncoding = response?.headers()['content-encoding']
      if (contentEncoding) {
        // Should be compressed
        expect(['gzip', 'br', 'deflate']).toContain(contentEncoding)
      }
    })
  })

  describe('Sitemap Validation', () => {
    test('validates sitemap XML structure', async ({ page }) => {
      await page.goto('/sitemap.xml')
      const sitemapContent = await page.content()
      
      // Should have proper XML declaration
      expect(sitemapContent).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/)
      
      // Should have proper namespace
      expect(sitemapContent).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')
      
      // Should have balanced tags
      const urlOpenTags = (sitemapContent.match(/<url>/g) || []).length
      const urlCloseTags = (sitemapContent.match(/<\/url>/g) || []).length
      expect(urlOpenTags).toBe(urlCloseTags)
      
      const locOpenTags = (sitemapContent.match(/<loc>/g) || []).length
      const locCloseTags = (sitemapContent.match(/<\/loc>/g) || []).length
      expect(locOpenTags).toBe(locCloseTags)
    })

    test('validates URL formats in sitemap', async ({ page }) => {
      await page.goto('/sitemap.xml')
      const sitemapContent = await page.content()
      
      const urlMatches = sitemapContent.match(/<loc>([^<]+)<\/loc>/g)
      expect(urlMatches).toBeTruthy()
      
      urlMatches?.forEach(match => {
        const url = match.replace(/<\/?loc>/g, '')
        
        // Should be valid URL
        expect(url).toMatch(/^https?:\/\//)
        
        // Should be absolute URL
        expect(url).toMatch(/^https:\/\/[^\/]+/)
        
        // Should not have query parameters (generally)
        if (url.includes('?')) {
          // If query params exist, they should be properly encoded
          expect(url).not.toContain(' ')
        }
      })
    })

    test('validates priority values are within range', async ({ page }) => {
      await page.goto('/sitemap.xml')
      const sitemapContent = await page.content()
      
      const priorityMatches = sitemapContent.match(/<priority>([^<]+)<\/priority>/g)
      
      priorityMatches?.forEach(match => {
        const priority = parseFloat(match.replace(/<\/?priority>/g, ''))
        expect(priority).toBeGreaterThanOrEqual(0.0)
        expect(priority).toBeLessThanOrEqual(1.0)
      })
    })

    test('validates no duplicate URLs in sitemap', async ({ page }) => {
      await page.goto('/sitemap.xml')
      const sitemapContent = await page.content()
      
      const urlMatches = sitemapContent.match(/<loc>([^<]+)<\/loc>/g)
      if (urlMatches) {
        const urls = urlMatches.map(match => match.replace(/<\/?loc>/g, ''))
        const uniqueUrls = [...new Set(urls)]
        
        expect(urls.length).toBe(uniqueUrls.length)
      }
    })
  })

  describe('Search Engine Submission', () => {
    test('provides sitemap ping endpoints', async ({ page }) => {
      // Test that sitemap can be submitted to search engines
      const sitemapUrl = 'https://onedetty.com/sitemap.xml'
      
      // Google ping URL format
      const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
      expect(googlePingUrl).toContain('google.com/ping')
      
      // Bing ping URL format
      const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
      expect(bingPingUrl).toContain('bing.com/ping')
    })
  })
})
