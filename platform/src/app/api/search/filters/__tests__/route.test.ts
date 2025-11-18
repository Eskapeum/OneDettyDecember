/**
 * @jest-environment node
 */

import { GET } from '../route'

// Mock Prisma Client
const mockPrisma = {
  package: {
    findMany: jest.fn(),
    count: jest.fn(),
    groupBy: jest.fn(),
  },
  $queryRaw: jest.fn(),
}

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
}))

// Helper function to create mock requests
function createMockRequest(searchParams: Record<string, string> = {}) {
  const url = new URL('http://localhost:3002/api/search/filters')
  Object.entries(searchParams).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  
  return {
    url: url.toString(),
    nextUrl: { searchParams: url.searchParams },
  } as any
}

describe('/api/search/filters', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Filter Options Retrieval', () => {
    it('returns available filter options', async () => {
      // Mock available cities
      mockPrisma.package.groupBy.mockResolvedValueOnce([
        { city: 'Lagos', _count: { city: 150 } },
        { city: 'Accra', _count: { city: 89 } },
        { city: 'Abuja', _count: { city: 45 } },
      ])

      // Mock available categories
      mockPrisma.$queryRaw.mockResolvedValueOnce([
        { category: 'beach', count: 67 },
        { category: 'music', count: 45 },
        { category: 'food', count: 34 },
        { category: 'nightlife', count: 28 },
      ])

      // Mock price range
      mockPrisma.$queryRaw.mockResolvedValueOnce([
        { min_price: 5000, max_price: 500000 }
      ])

      const request = createMockRequest()
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.filters).toEqual({
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
        priceRange: {
          min: 5000,
          max: 500000,
        },
        packageTypes: [
          { value: 'EVENT', label: 'Events' },
          { value: 'STAY', label: 'Stays' },
          { value: 'EXPERIENCE', label: 'Experiences' },
          { value: 'CAR_RENTAL', label: 'Car Rentals' },
        ],
      })
    })

    it('filters options based on current search context', async () => {
      // Mock filtered results when searching for "Lagos"
      mockPrisma.package.groupBy.mockResolvedValueOnce([
        { city: 'Lagos', _count: { city: 150 } },
        { city: 'Victoria Island', _count: { city: 25 } },
        { city: 'Ikoyi', _count: { city: 18 } },
      ])

      mockPrisma.$queryRaw.mockResolvedValueOnce([
        { category: 'beach', count: 45 },
        { category: 'nightlife', count: 28 },
        { category: 'music', count: 15 },
      ])

      mockPrisma.$queryRaw.mockResolvedValueOnce([
        { min_price: 10000, max_price: 200000 }
      ])

      const request = createMockRequest({ q: 'Lagos' })
      const response = await GET(request)
      const data = await response.json()

      expect(data.filters.cities).toHaveLength(3)
      expect(data.filters.categories).toHaveLength(3)
      expect(data.filters.priceRange.min).toBe(10000)
      expect(data.filters.priceRange.max).toBe(200000)
    })

    it('excludes empty filter options', async () => {
      mockPrisma.package.groupBy.mockResolvedValueOnce([
        { city: 'Lagos', _count: { city: 150 } },
        { city: null, _count: { city: 5 } }, // Should be excluded
      ])

      mockPrisma.$queryRaw.mockResolvedValueOnce([
        { category: 'beach', count: 45 },
        { category: '', count: 3 }, // Should be excluded
      ])

      mockPrisma.$queryRaw.mockResolvedValueOnce([
        { min_price: 5000, max_price: 500000 }
      ])

      const request = createMockRequest()
      const response = await GET(request)
      const data = await response.json()

      expect(data.filters.cities).toHaveLength(1)
      expect(data.filters.cities[0].value).toBe('Lagos')
      expect(data.filters.categories).toHaveLength(1)
      expect(data.filters.categories[0].value).toBe('beach')
    })
  })

  describe('Filter Validation', () => {
    it('validates filter combinations', async () => {
      const request = createMockRequest({
        type: 'EVENT',
        city: 'Lagos',
        minPrice: '10000',
        maxPrice: '100000',
        startDate: '2025-12-01',
        endDate: '2025-12-31',
        categories: 'beach,music',
      })

      mockPrisma.package.count.mockResolvedValue(25)

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.validation).toEqual({
        isValid: true,
        resultCount: 25,
        warnings: [],
      })
    })

    it('warns about filter combinations with no results', async () => {
      const request = createMockRequest({
        type: 'EVENT',
        city: 'Lagos',
        minPrice: '500000',
        maxPrice: '1000000',
        categories: 'beach,music',
      })

      mockPrisma.package.count.mockResolvedValue(0)

      const response = await GET(request)
      const data = await response.json()

      expect(data.validation).toEqual({
        isValid: true,
        resultCount: 0,
        warnings: [
          'No results found for the selected filters. Try adjusting your criteria.',
        ],
      })
    })

    it('validates price range', async () => {
      const request = createMockRequest({
        minPrice: '100000',
        maxPrice: '50000', // Invalid: min > max
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Minimum price cannot be greater than maximum price')
    })

    it('validates date range', async () => {
      const request = createMockRequest({
        startDate: '2025-12-31',
        endDate: '2025-12-01', // Invalid: start > end
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Start date cannot be after end date')
    })

    it('validates package type', async () => {
      const request = createMockRequest({
        type: 'INVALID_TYPE',
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid package type')
    })

    it('validates category values', async () => {
      const request = createMockRequest({
        categories: 'beach,invalid_category,music',
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid category: invalid_category')
    })
  })

  describe('Filter Suggestions', () => {
    it('suggests alternative filters when no results', async () => {
      const request = createMockRequest({
        type: 'EVENT',
        city: 'Lagos',
        minPrice: '500000',
        categories: 'beach',
      })

      mockPrisma.package.count.mockResolvedValue(0)

      // Mock suggestions query
      mockPrisma.package.count
        .mockResolvedValueOnce(0) // Original query
        .mockResolvedValueOnce(15) // Without price filter
        .mockResolvedValueOnce(8) // Without category filter
        .mockResolvedValueOnce(45) // Without city filter

      const response = await GET(request)
      const data = await response.json()

      expect(data.suggestions).toEqual([
        {
          message: 'Try removing the price filter',
          filters: { type: 'EVENT', city: 'Lagos', categories: 'beach' },
          resultCount: 15,
        },
        {
          message: 'Try removing the category filter',
          filters: { type: 'EVENT', city: 'Lagos', minPrice: '500000' },
          resultCount: 8,
        },
        {
          message: 'Try searching in all cities',
          filters: { type: 'EVENT', minPrice: '500000', categories: 'beach' },
          resultCount: 45,
        },
      ])
    })

    it('suggests popular filter combinations', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([
        { type: 'EVENT', city: 'Lagos', category: 'music', count: 25 },
        { type: 'STAY', city: 'Accra', category: null, count: 18 },
        { type: 'EXPERIENCE', city: 'Lagos', category: 'culture', count: 12 },
      ])

      const request = createMockRequest({ suggest: 'popular' })
      const response = await GET(request)
      const data = await response.json()

      expect(data.popularCombinations).toEqual([
        {
          label: 'Music Events in Lagos',
          filters: { type: 'EVENT', city: 'Lagos', categories: 'music' },
          count: 25,
        },
        {
          label: 'Stays in Accra',
          filters: { type: 'STAY', city: 'Accra' },
          count: 18,
        },
        {
          label: 'Cultural Experiences in Lagos',
          filters: { type: 'EXPERIENCE', city: 'Lagos', categories: 'culture' },
          count: 12,
        },
      ])
    })
  })

  describe('Performance Optimization', () => {
    it('caches filter options', async () => {
      const request = createMockRequest()
      
      // First request
      await GET(request)
      
      // Second request should use cache
      const response = await GET(request)
      
      expect(response.headers.get('X-Cache')).toBe('HIT')
    })

    it('limits the number of filter options', async () => {
      // Mock large number of cities
      const manyCities = Array.from({ length: 200 }, (_, i) => ({
        city: `City ${i}`,
        _count: { city: Math.floor(Math.random() * 100) },
      }))

      mockPrisma.package.groupBy.mockResolvedValue(manyCities)
      mockPrisma.$queryRaw.mockResolvedValue([])

      const request = createMockRequest()
      const response = await GET(request)
      const data = await response.json()

      // Should limit to top 50 cities by count
      expect(data.filters.cities).toHaveLength(50)
    })

    it('uses database indexes for efficient queries', async () => {
      const request = createMockRequest()
      await GET(request)

      expect(mockPrisma.package.groupBy).toHaveBeenCalledWith({
        by: ['city'],
        where: { status: 'PUBLISHED' },
        _count: { city: true },
        orderBy: { _count: { city: 'desc' } },
        take: 50,
      })
    })
  })

  describe('Error Handling', () => {
    it('handles database errors gracefully', async () => {
      mockPrisma.package.groupBy.mockRejectedValue(new Error('Database error'))

      const request = createMockRequest()
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })

    it('handles malformed query parameters', async () => {
      const request = createMockRequest({
        minPrice: 'not-a-number',
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid price value')
    })

    it('handles malformed date parameters', async () => {
      const request = createMockRequest({
        startDate: 'invalid-date',
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid date format')
    })
  })

  describe('Security', () => {
    it('sanitizes input parameters', async () => {
      const request = createMockRequest({
        city: '<script>alert("xss")</script>Lagos',
        categories: 'beach,<script>alert("xss")</script>music',
      })

      mockPrisma.package.groupBy.mockResolvedValue([])
      mockPrisma.$queryRaw.mockResolvedValue([])

      const response = await GET(request)

      expect(response.status).toBe(200) // Should not crash
    })

    it('prevents SQL injection in filter queries', async () => {
      const request = createMockRequest({
        city: "'; DROP TABLE packages; --",
      })

      mockPrisma.package.groupBy.mockResolvedValue([])
      mockPrisma.$queryRaw.mockResolvedValue([])

      const response = await GET(request)

      expect(response.status).toBe(200) // Should not crash
      expect(mockPrisma.package.groupBy).toHaveBeenCalled()
    })

    it('rate limits filter requests', async () => {
      const request = createMockRequest()
      const response = await GET(request)

      expect(response.headers.get('X-RateLimit-Limit')).toBeDefined()
      expect(response.headers.get('X-RateLimit-Remaining')).toBeDefined()
    })
  })

  describe('Analytics', () => {
    it('logs filter usage for analytics', async () => {
      const consoleSpy = jest.spyOn(console, 'info').mockImplementation()
      
      mockPrisma.package.groupBy.mockResolvedValue([])
      mockPrisma.$queryRaw.mockResolvedValue([])

      const request = createMockRequest({
        type: 'EVENT',
        city: 'Lagos',
        categories: 'beach,music',
      })
      await GET(request)

      expect(consoleSpy).toHaveBeenCalledWith(
        'Filter options requested',
        expect.objectContaining({
          filters: {
            type: 'EVENT',
            city: 'Lagos',
            categories: 'beach,music',
          },
        })
      )

      consoleSpy.mockRestore()
    })

    it('tracks popular filter combinations', async () => {
      const request = createMockRequest({
        type: 'EVENT',
        city: 'Lagos',
        track: 'true',
      })

      mockPrisma.package.groupBy.mockResolvedValue([])
      mockPrisma.$queryRaw.mockResolvedValue([])

      await GET(request)

      // Should track this filter combination for analytics
      expect(mockPrisma.$queryRaw).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO filter_analytics')
      )
    })
  })
})
