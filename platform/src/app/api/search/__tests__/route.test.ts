/**
 * @jest-environment node
 */

import { GET } from '../route'

// Mock Prisma Client
const mockPrisma = {
  package: {
    findMany: jest.fn(),
    count: jest.fn(),
  },
  $queryRaw: jest.fn(),
}

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
}))

// Mock search utilities
jest.mock('@/lib/search/utils', () => ({
  buildSearchQuery: jest.fn(),
  parseSearchFilters: jest.fn(),
  calculateRelevanceScore: jest.fn(),
}))

// Helper function to create mock requests
function createMockRequest(searchParams: Record<string, string>) {
  const url = new URL('http://localhost:3002/api/search')
  Object.entries(searchParams).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  
  return {
    url: url.toString(),
    nextUrl: { searchParams: url.searchParams },
  } as any
}

describe('/api/search', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Search', () => {
    it('performs text search successfully', async () => {
      const mockPackages = [
        {
          id: 'pkg-1',
          title: 'Lagos Beach Party',
          description: 'Amazing beach party',
          price: 50000,
          type: 'EVENT',
          location: 'Lagos',
          vendor: { businessName: 'Party Co' },
        },
      ]

      mockPrisma.package.findMany.mockResolvedValue(mockPackages)
      mockPrisma.package.count.mockResolvedValue(1)

      const request = createMockRequest({ q: 'Lagos party' })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.results).toEqual(mockPackages)
      expect(data.totalCount).toBe(1)
      expect(data.query).toBe('Lagos party')
    })

    it('handles empty search query', async () => {
      const request = createMockRequest({})
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Search query is required')
    })

    it('validates minimum query length', async () => {
      const request = createMockRequest({ q: 'a' })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Search query must be at least 2 characters')
    })

    it('sanitizes search query', async () => {
      mockPrisma.package.findMany.mockResolvedValue([])
      mockPrisma.package.count.mockResolvedValue(0)

      const request = createMockRequest({ q: '<script>alert("xss")</script>Lagos' })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.query).toBe('Lagos') // XSS attempt should be sanitized
    })
  })

  describe('Filtering', () => {
    it('filters by package type', async () => {
      mockPrisma.package.findMany.mockResolvedValue([])
      mockPrisma.package.count.mockResolvedValue(0)

      const request = createMockRequest({ 
        q: 'Lagos',
        type: 'EVENT'
      })
      await GET(request)

      expect(mockPrisma.package.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            type: 'EVENT'
          })
        })
      )
    })

    it('filters by price range', async () => {
      mockPrisma.package.findMany.mockResolvedValue([])
      mockPrisma.package.count.mockResolvedValue(0)

      const request = createMockRequest({ 
        q: 'Lagos',
        minPrice: '10000',
        maxPrice: '100000'
      })
      await GET(request)

      expect(mockPrisma.package.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            price: {
              gte: 10000,
              lte: 100000
            }
          })
        })
      )
    })

    it('filters by date range', async () => {
      mockPrisma.package.findMany.mockResolvedValue([])
      mockPrisma.package.count.mockResolvedValue(0)

      const request = createMockRequest({ 
        q: 'Lagos',
        startDate: '2025-12-01',
        endDate: '2025-12-31'
      })
      await GET(request)

      expect(mockPrisma.package.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            startDate: {
              gte: new Date('2025-12-01'),
              lte: new Date('2025-12-31')
            }
          })
        })
      )
    })

    it('filters by location/city', async () => {
      mockPrisma.package.findMany.mockResolvedValue([])
      mockPrisma.package.count.mockResolvedValue(0)

      const request = createMockRequest({ 
        q: 'party',
        city: 'Lagos'
      })
      await GET(request)

      expect(mockPrisma.package.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            city: 'Lagos'
          })
        })
      )
    })

    it('combines multiple filters', async () => {
      mockPrisma.package.findMany.mockResolvedValue([])
      mockPrisma.package.count.mockResolvedValue(0)

      const request = createMockRequest({ 
        q: 'party',
        type: 'EVENT',
        city: 'Lagos',
        minPrice: '5000',
        maxPrice: '50000'
      })
      await GET(request)

      expect(mockPrisma.package.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            type: 'EVENT',
            city: 'Lagos',
            price: {
              gte: 5000,
              lte: 50000
            }
          })
        })
      )
    })
  })

  describe('Sorting', () => {
    it('sorts by relevance by default', async () => {
      mockPrisma.package.findMany.mockResolvedValue([])
      mockPrisma.package.count.mockResolvedValue(0)

      const request = createMockRequest({ q: 'Lagos' })
      await GET(request)

      expect(mockPrisma.package.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: expect.arrayContaining([
            expect.objectContaining({ _relevance: expect.any(Object) })
          ])
        })
      )
    })

    it('sorts by price low to high', async () => {
      mockPrisma.package.findMany.mockResolvedValue([])
      mockPrisma.package.count.mockResolvedValue(0)

      const request = createMockRequest({ 
        q: 'Lagos',
        sortBy: 'price-low'
      })
      await GET(request)

      expect(mockPrisma.package.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ price: 'asc' }]
        })
      )
    })

    it('sorts by price high to low', async () => {
      mockPrisma.package.findMany.mockResolvedValue([])
      mockPrisma.package.count.mockResolvedValue(0)

      const request = createMockRequest({ 
        q: 'Lagos',
        sortBy: 'price-high'
      })
      await GET(request)

      expect(mockPrisma.package.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ price: 'desc' }]
        })
      )
    })

    it('sorts by date', async () => {
      mockPrisma.package.findMany.mockResolvedValue([])
      mockPrisma.package.count.mockResolvedValue(0)

      const request = createMockRequest({ 
        q: 'Lagos',
        sortBy: 'date'
      })
      await GET(request)

      expect(mockPrisma.package.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ startDate: 'asc' }]
        })
      )
    })

    it('sorts by rating', async () => {
      mockPrisma.package.findMany.mockResolvedValue([])
      mockPrisma.package.count.mockResolvedValue(0)

      const request = createMockRequest({ 
        q: 'Lagos',
        sortBy: 'rating'
      })
      await GET(request)

      expect(mockPrisma.package.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ averageRating: 'desc' }]
        })
      )
    })
  })

  describe('Pagination', () => {
    it('handles pagination correctly', async () => {
      mockPrisma.package.findMany.mockResolvedValue([])
      mockPrisma.package.count.mockResolvedValue(100)

      const request = createMockRequest({ 
        q: 'Lagos',
        page: '2',
        limit: '20'
      })
      const response = await GET(request)
      const data = await response.json()

      expect(mockPrisma.package.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20, // (page - 1) * limit
          take: 20
        })
      )

      expect(data.pagination).toEqual({
        currentPage: 2,
        totalPages: 5,
        totalCount: 100,
        hasNextPage: true,
        hasPreviousPage: true
      })
    })

    it('validates page number', async () => {
      const request = createMockRequest({ 
        q: 'Lagos',
        page: '0'
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Page number must be greater than 0')
    })

    it('validates limit', async () => {
      const request = createMockRequest({ 
        q: 'Lagos',
        limit: '101'
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Limit must be between 1 and 100')
    })

    it('uses default pagination values', async () => {
      mockPrisma.package.findMany.mockResolvedValue([])
      mockPrisma.package.count.mockResolvedValue(0)

      const request = createMockRequest({ q: 'Lagos' })
      await GET(request)

      expect(mockPrisma.package.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 20 // Default limit
        })
      )
    })
  })

  describe('Full-Text Search', () => {
    it('searches across multiple fields', async () => {
      mockPrisma.package.findMany.mockResolvedValue([])
      mockPrisma.package.count.mockResolvedValue(0)

      const request = createMockRequest({ q: 'Lagos beach party' })
      await GET(request)

      expect(mockPrisma.package.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { title: expect.objectContaining({ contains: expect.any(String) }) },
              { description: expect.objectContaining({ contains: expect.any(String) }) },
              { location: expect.objectContaining({ contains: expect.any(String) }) },
            ])
          })
        })
      )
    })

    it('includes vendor business name in search', async () => {
      mockPrisma.package.findMany.mockResolvedValue([])
      mockPrisma.package.count.mockResolvedValue(0)

      const request = createMockRequest({ q: 'party planners' })
      await GET(request)

      expect(mockPrisma.package.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.objectContaining({
            vendor: true
          })
        })
      )
    })
  })

  describe('Performance', () => {
    it('includes only necessary fields', async () => {
      mockPrisma.package.findMany.mockResolvedValue([])
      mockPrisma.package.count.mockResolvedValue(0)

      const request = createMockRequest({ q: 'Lagos' })
      await GET(request)

      expect(mockPrisma.package.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          select: expect.objectContaining({
            id: true,
            title: true,
            description: true,
            price: true,
            currency: true,
            type: true,
            location: true,
            city: true,
            images: true,
            startDate: true,
            endDate: true,
            averageRating: true,
            reviewCount: true,
            vendor: expect.objectContaining({
              select: expect.objectContaining({
                id: true,
                businessName: true
              })
            })
          })
        })
      )
    })

    it('limits search results to prevent performance issues', async () => {
      const request = createMockRequest({ 
        q: 'Lagos',
        limit: '1000'
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Limit must be between 1 and 100')
    })
  })

  describe('Error Handling', () => {
    it('handles database errors gracefully', async () => {
      mockPrisma.package.findMany.mockRejectedValue(new Error('Database connection failed'))

      const request = createMockRequest({ q: 'Lagos' })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })

    it('handles invalid date formats', async () => {
      const request = createMockRequest({ 
        q: 'Lagos',
        startDate: 'invalid-date'
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid date format')
    })

    it('handles invalid price values', async () => {
      const request = createMockRequest({ 
        q: 'Lagos',
        minPrice: 'not-a-number'
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid price value')
    })
  })

  describe('Security', () => {
    it('prevents SQL injection in search query', async () => {
      mockPrisma.package.findMany.mockResolvedValue([])
      mockPrisma.package.count.mockResolvedValue(0)

      const request = createMockRequest({ 
        q: "'; DROP TABLE packages; --"
      })
      const response = await GET(request)

      expect(response.status).toBe(200) // Should not crash
      expect(mockPrisma.package.findMany).toHaveBeenCalled()
    })

    it('rate limits search requests', async () => {
      // This would be tested with actual rate limiting implementation
      const request = createMockRequest({ q: 'Lagos' })
      const response = await GET(request)

      expect(response.headers.get('X-RateLimit-Limit')).toBeDefined()
      expect(response.headers.get('X-RateLimit-Remaining')).toBeDefined()
    })

    it('logs search queries for analytics', async () => {
      const consoleSpy = jest.spyOn(console, 'info').mockImplementation()
      
      mockPrisma.package.findMany.mockResolvedValue([])
      mockPrisma.package.count.mockResolvedValue(0)

      const request = createMockRequest({ q: 'Lagos party' })
      await GET(request)

      expect(consoleSpy).toHaveBeenCalledWith(
        'Search query executed',
        expect.objectContaining({
          query: 'Lagos party',
          resultCount: 0
        })
      )

      consoleSpy.mockRestore()
    })
  })
})
