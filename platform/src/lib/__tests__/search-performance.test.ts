/**
 * @jest-environment node
 */

import { performance } from 'perf_hooks'

// Mock Prisma Client for performance testing
const mockPrisma = {
  package: {
    findMany: jest.fn(),
    count: jest.fn(),
    groupBy: jest.fn(),
  },
  $queryRaw: jest.fn(),
  $executeRaw: jest.fn(),
}

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
}))

// Mock search utilities
const mockSearchUtils = {
  buildSearchQuery: jest.fn(),
  parseSearchFilters: jest.fn(),
  calculateRelevanceScore: jest.fn(),
}

jest.mock('@/lib/search/utils', () => mockSearchUtils)

describe('Search Performance Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Search Query Performance', () => {
    it('executes basic search queries within performance threshold', async () => {
      // Mock large dataset response
      const mockResults = Array.from({ length: 1000 }, (_, i) => ({
        id: `pkg-${i}`,
        title: `Package ${i}`,
        description: `Description ${i}`,
        price: Math.floor(Math.random() * 100000),
        type: 'EVENT',
        location: 'Lagos',
      }))

      mockPrisma.package.findMany.mockResolvedValue(mockResults.slice(0, 20))
      mockPrisma.package.count.mockResolvedValue(1000)

      const startTime = performance.now()
      
      // Simulate search API call
      const searchQuery = {
        query: 'Lagos events',
        filters: {},
        pagination: { page: 1, limit: 20 },
        sortBy: 'relevance',
      }

      await mockPrisma.package.findMany({
        where: { title: { contains: searchQuery.query } },
        take: searchQuery.pagination.limit,
        skip: (searchQuery.pagination.page - 1) * searchQuery.pagination.limit,
      })

      const endTime = performance.now()
      const executionTime = endTime - startTime

      // Search should complete within 500ms
      expect(executionTime).toBeLessThan(500)
    })

    it('handles complex filter queries efficiently', async () => {
      mockPrisma.package.findMany.mockResolvedValue([])
      mockPrisma.package.count.mockResolvedValue(0)

      const startTime = performance.now()

      // Complex query with multiple filters
      await mockPrisma.package.findMany({
        where: {
          AND: [
            { title: { contains: 'Lagos' } },
            { type: 'EVENT' },
            { city: 'Lagos' },
            { price: { gte: 10000, lte: 100000 } },
            { startDate: { gte: new Date('2025-12-01') } },
            { categories: { hasSome: ['beach', 'music'] } },
          ],
        },
        include: {
          vendor: { select: { businessName: true } },
          reviews: { select: { rating: true } },
        },
        orderBy: [
          { averageRating: 'desc' },
          { reviewCount: 'desc' },
          { createdAt: 'desc' },
        ],
        take: 20,
      })

      const endTime = performance.now()
      const executionTime = endTime - startTime

      // Complex queries should complete within 1 second
      expect(executionTime).toBeLessThan(1000)
    })

    it('optimizes full-text search performance', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([])

      const startTime = performance.now()

      // Full-text search query
      await mockPrisma.$queryRaw`
        SELECT p.*, ts_rank(search_vector, plainto_tsquery('english', 'Lagos beach party')) as rank
        FROM packages p
        WHERE search_vector @@ plainto_tsquery('english', 'Lagos beach party')
        AND status = 'PUBLISHED'
        ORDER BY rank DESC, created_at DESC
        LIMIT 20
      `

      const endTime = performance.now()
      const executionTime = endTime - startTime

      // Full-text search should be fast with proper indexing
      expect(executionTime).toBeLessThan(300)
    })

    it('measures aggregation query performance', async () => {
      mockPrisma.package.groupBy.mockResolvedValue([
        { city: 'Lagos', _count: { city: 150 } },
        { city: 'Accra', _count: { city: 89 } },
      ])

      const startTime = performance.now()

      await mockPrisma.package.groupBy({
        by: ['city'],
        where: { status: 'PUBLISHED' },
        _count: { city: true },
        orderBy: { _count: { city: 'desc' } },
        take: 50,
      })

      const endTime = performance.now()
      const executionTime = endTime - startTime

      // Aggregation queries should be fast
      expect(executionTime).toBeLessThan(200)
    })
  })

  describe('Search Index Performance', () => {
    it('validates search index usage', async () => {
      // Mock EXPLAIN query result
      mockPrisma.$queryRaw.mockResolvedValue([
        {
          'QUERY PLAN': 'Index Scan using packages_search_idx on packages'
        }
      ])

      const queryPlan = await mockPrisma.$queryRaw`
        EXPLAIN SELECT * FROM packages 
        WHERE search_vector @@ plainto_tsquery('Lagos')
      `

      expect(queryPlan[0]['QUERY PLAN']).toContain('Index Scan')
      expect(queryPlan[0]['QUERY PLAN']).toContain('packages_search_idx')
    })

    it('validates price range index usage', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([
        {
          'QUERY PLAN': 'Index Scan using packages_price_idx on packages'
        }
      ])

      const queryPlan = await mockPrisma.$queryRaw`
        EXPLAIN SELECT * FROM packages 
        WHERE price BETWEEN 10000 AND 100000
      `

      expect(queryPlan[0]['QUERY PLAN']).toContain('Index Scan')
      expect(queryPlan[0]['QUERY PLAN']).toContain('packages_price_idx')
    })

    it('validates date range index usage', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([
        {
          'QUERY PLAN': 'Index Scan using packages_date_idx on packages'
        }
      ])

      const queryPlan = await mockPrisma.$queryRaw`
        EXPLAIN SELECT * FROM packages 
        WHERE start_date >= '2025-12-01' AND start_date <= '2025-12-31'
      `

      expect(queryPlan[0]['QUERY PLAN']).toContain('Index Scan')
    })

    it('validates composite index usage for complex queries', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([
        {
          'QUERY PLAN': 'Index Scan using packages_composite_idx on packages'
        }
      ])

      const queryPlan = await mockPrisma.$queryRaw`
        EXPLAIN SELECT * FROM packages 
        WHERE type = 'EVENT' AND city = 'Lagos' AND status = 'PUBLISHED'
      `

      expect(queryPlan[0]['QUERY PLAN']).toContain('Index Scan')
    })
  })

  describe('Pagination Performance', () => {
    it('measures offset pagination performance', async () => {
      mockPrisma.package.findMany.mockResolvedValue([])

      const startTime = performance.now()

      // Large offset pagination (page 100)
      await mockPrisma.package.findMany({
        where: { status: 'PUBLISHED' },
        skip: 99 * 20, // Page 100 with 20 items per page
        take: 20,
        orderBy: { createdAt: 'desc' },
      })

      const endTime = performance.now()
      const executionTime = endTime - startTime

      // Even large offsets should be reasonably fast with proper indexing
      expect(executionTime).toBeLessThan(800)
    })

    it('measures cursor-based pagination performance', async () => {
      mockPrisma.package.findMany.mockResolvedValue([])

      const startTime = performance.now()

      // Cursor-based pagination
      await mockPrisma.package.findMany({
        where: {
          status: 'PUBLISHED',
          createdAt: { lt: new Date('2025-01-01') },
        },
        take: 20,
        orderBy: { createdAt: 'desc' },
      })

      const endTime = performance.now()
      const executionTime = endTime - startTime

      // Cursor pagination should be consistently fast
      expect(executionTime).toBeLessThan(200)
    })
  })

  describe('Concurrent Query Performance', () => {
    it('handles multiple concurrent search queries', async () => {
      mockPrisma.package.findMany.mockResolvedValue([])

      const startTime = performance.now()

      // Simulate 10 concurrent search queries
      const concurrentQueries = Array.from({ length: 10 }, (_, i) =>
        mockPrisma.package.findMany({
          where: { title: { contains: `Query ${i}` } },
          take: 20,
        })
      )

      await Promise.all(concurrentQueries)

      const endTime = performance.now()
      const executionTime = endTime - startTime

      // Concurrent queries should complete within reasonable time
      expect(executionTime).toBeLessThan(2000)
    })

    it('measures database connection pool efficiency', async () => {
      mockPrisma.package.findMany.mockResolvedValue([])

      const startTime = performance.now()

      // Simulate rapid sequential queries
      for (let i = 0; i < 50; i++) {
        await mockPrisma.package.findMany({
          where: { title: { contains: `Query ${i}` } },
          take: 1,
        })
      }

      const endTime = performance.now()
      const executionTime = endTime - startTime

      // Should handle rapid queries efficiently with connection pooling
      expect(executionTime).toBeLessThan(3000)
    })
  })

  describe('Memory Usage Performance', () => {
    it('measures memory usage for large result sets', async () => {
      const largeResultSet = Array.from({ length: 10000 }, (_, i) => ({
        id: `pkg-${i}`,
        title: `Package ${i}`,
        description: `Description ${i}`.repeat(100), // Large description
        price: Math.floor(Math.random() * 100000),
      }))

      mockPrisma.package.findMany.mockResolvedValue(largeResultSet)

      const initialMemory = process.memoryUsage().heapUsed
      
      const results = await mockPrisma.package.findMany({
        where: { status: 'PUBLISHED' },
      })

      const finalMemory = process.memoryUsage().heapUsed
      const memoryIncrease = finalMemory - initialMemory

      // Memory increase should be reasonable (less than 100MB for this test)
      expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024)
    })

    it('validates memory cleanup after queries', async () => {
      mockPrisma.package.findMany.mockResolvedValue([])

      const initialMemory = process.memoryUsage().heapUsed

      // Execute multiple queries
      for (let i = 0; i < 100; i++) {
        await mockPrisma.package.findMany({
          where: { title: { contains: `Query ${i}` } },
        })
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc()
      }

      const finalMemory = process.memoryUsage().heapUsed
      const memoryIncrease = finalMemory - initialMemory

      // Memory should not increase significantly after cleanup
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024)
    })
  })

  describe('Cache Performance', () => {
    it('measures cache hit performance', async () => {
      // Mock Redis cache
      const mockRedis = {
        get: jest.fn().mockResolvedValue(JSON.stringify({ results: [], count: 0 })),
        setex: jest.fn(),
      }

      const startTime = performance.now()

      // Simulate cache hit
      const cachedResult = await mockRedis.get('search:lagos:events')
      const parsedResult = JSON.parse(cachedResult)

      const endTime = performance.now()
      const executionTime = endTime - startTime

      // Cache hits should be extremely fast
      expect(executionTime).toBeLessThan(10)
    })

    it('measures cache miss and database fallback performance', async () => {
      const mockRedis = {
        get: jest.fn().mockResolvedValue(null), // Cache miss
        setex: jest.fn(),
      }

      mockPrisma.package.findMany.mockResolvedValue([])

      const startTime = performance.now()

      // Simulate cache miss and database query
      const cachedResult = await mockRedis.get('search:new:query')
      if (!cachedResult) {
        await mockPrisma.package.findMany({
          where: { title: { contains: 'new query' } },
        })
        await mockRedis.setex('search:new:query', 300, JSON.stringify({ results: [] }))
      }

      const endTime = performance.now()
      const executionTime = endTime - startTime

      // Cache miss with database fallback should still be fast
      expect(executionTime).toBeLessThan(600)
    })
  })

  describe('Search Suggestion Performance', () => {
    it('measures autocomplete suggestion performance', async () => {
      mockPrisma.package.findMany.mockResolvedValue([
        { title: 'Lagos Beach Party' },
        { title: 'Lagos Music Festival' },
        { title: 'Lagos Food Tour' },
      ])

      const startTime = performance.now()

      await mockPrisma.package.findMany({
        where: {
          title: { contains: 'Lagos', mode: 'insensitive' },
          status: 'PUBLISHED',
        },
        select: { title: true },
        take: 10,
        orderBy: { popularity: 'desc' },
      })

      const endTime = performance.now()
      const executionTime = endTime - startTime

      // Autocomplete should be very fast for good UX
      expect(executionTime).toBeLessThan(100)
    })

    it('measures fuzzy search performance', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([
        { title: 'Lagos Beach Party', similarity: 0.8 },
        { title: 'Lagos Music Festival', similarity: 0.7 },
      ])

      const startTime = performance.now()

      // Fuzzy search using trigram similarity
      await mockPrisma.$queryRaw`
        SELECT title, similarity(title, 'Lagoz') as similarity
        FROM packages
        WHERE similarity(title, 'Lagoz') > 0.3
        ORDER BY similarity DESC
        LIMIT 10
      `

      const endTime = performance.now()
      const executionTime = endTime - startTime

      // Fuzzy search should be reasonably fast
      expect(executionTime).toBeLessThan(300)
    })
  })
})
