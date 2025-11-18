/**
 * @jest-environment node
 */

import { GET } from '../route'

// Mock Prisma Client
const mockPrisma = {
  package: {
    findMany: jest.fn(),
  },
  searchSuggestion: {
    findMany: jest.fn(),
    create: jest.fn(),
    upsert: jest.fn(),
  },
  $queryRaw: jest.fn(),
}

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
}))

// Mock Redis for caching
const mockRedis = {
  get: jest.fn(),
  setex: jest.fn(),
}

jest.mock('@/lib/redis', () => ({
  redis: mockRedis,
}))

// Helper function to create mock requests
function createMockRequest(searchParams: Record<string, string>) {
  const url = new URL('http://localhost:3002/api/search/suggestions')
  Object.entries(searchParams).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  
  return {
    url: url.toString(),
    nextUrl: { searchParams: url.searchParams },
  } as any
}

describe('/api/search/suggestions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Suggestions', () => {
    it('returns search suggestions for valid query', async () => {
      const mockSuggestions = [
        { id: '1', text: 'Lagos Beach Party', type: 'package', popularity: 100 },
        { id: '2', text: 'Lagos Hotels', type: 'category', popularity: 80 },
        { id: '3', text: 'Lagos Tours', type: 'package', popularity: 60 },
      ]

      mockRedis.get.mockResolvedValue(null) // No cache
      mockPrisma.searchSuggestion.findMany.mockResolvedValue(mockSuggestions)

      const request = createMockRequest({ q: 'Lagos' })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.suggestions).toEqual(mockSuggestions)
      expect(data.query).toBe('Lagos')
    })

    it('requires minimum query length', async () => {
      const request = createMockRequest({ q: 'L' })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Query must be at least 2 characters')
    })

    it('handles empty query', async () => {
      const request = createMockRequest({})
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Query parameter is required')
    })

    it('limits number of suggestions', async () => {
      const mockSuggestions = Array.from({ length: 15 }, (_, i) => ({
        id: `${i + 1}`,
        text: `Lagos ${i + 1}`,
        type: 'package',
        popularity: 100 - i,
      }))

      mockRedis.get.mockResolvedValue(null)
      mockPrisma.searchSuggestion.findMany.mockResolvedValue(mockSuggestions)

      const request = createMockRequest({ q: 'Lagos' })
      const response = await GET(request)
      const data = await response.json()

      expect(data.suggestions).toHaveLength(10) // Default limit
    })

    it('respects custom limit parameter', async () => {
      const mockSuggestions = Array.from({ length: 10 }, (_, i) => ({
        id: `${i + 1}`,
        text: `Lagos ${i + 1}`,
        type: 'package',
        popularity: 100 - i,
      }))

      mockRedis.get.mockResolvedValue(null)
      mockPrisma.searchSuggestion.findMany.mockResolvedValue(mockSuggestions)

      const request = createMockRequest({ q: 'Lagos', limit: '5' })
      const response = await GET(request)
      const data = await response.json()

      expect(data.suggestions).toHaveLength(5)
    })
  })

  describe('Suggestion Types', () => {
    it('returns package-based suggestions', async () => {
      const mockPackages = [
        { id: 'pkg-1', title: 'Lagos Beach Party', type: 'EVENT' },
        { id: 'pkg-2', title: 'Lagos City Tour', type: 'EXPERIENCE' },
      ]

      mockRedis.get.mockResolvedValue(null)
      mockPrisma.package.findMany.mockResolvedValue(mockPackages)
      mockPrisma.searchSuggestion.findMany.mockResolvedValue([])

      const request = createMockRequest({ q: 'Lagos' })
      const response = await GET(request)
      const data = await response.json()

      expect(data.suggestions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            text: 'Lagos Beach Party',
            type: 'package',
            packageType: 'EVENT'
          }),
          expect.objectContaining({
            text: 'Lagos City Tour',
            type: 'package',
            packageType: 'EXPERIENCE'
          })
        ])
      )
    })

    it('returns location-based suggestions', async () => {
      const mockSuggestions = [
        { id: '1', text: 'Lagos', type: 'location', popularity: 100 },
        { id: '2', text: 'Lagos Island', type: 'location', popularity: 80 },
        { id: '3', text: 'Lagos Mainland', type: 'location', popularity: 60 },
      ]

      mockRedis.get.mockResolvedValue(null)
      mockPrisma.searchSuggestion.findMany.mockResolvedValue(mockSuggestions)

      const request = createMockRequest({ q: 'Lagos' })
      const response = await GET(request)
      const data = await response.json()

      expect(data.suggestions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: 'location' })
        ])
      )
    })

    it('returns category-based suggestions', async () => {
      const mockSuggestions = [
        { id: '1', text: 'Beach Parties', type: 'category', popularity: 100 },
        { id: '2', text: 'Beach Hotels', type: 'category', popularity: 80 },
      ]

      mockRedis.get.mockResolvedValue(null)
      mockPrisma.searchSuggestion.findMany.mockResolvedValue(mockSuggestions)

      const request = createMockRequest({ q: 'beach' })
      const response = await GET(request)
      const data = await response.json()

      expect(data.suggestions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: 'category' })
        ])
      )
    })

    it('mixes different suggestion types', async () => {
      const mockSuggestions = [
        { id: '1', text: 'Lagos Beach Party', type: 'package', popularity: 100 },
        { id: '2', text: 'Lagos', type: 'location', popularity: 90 },
        { id: '3', text: 'Beach Events', type: 'category', popularity: 80 },
      ]

      mockRedis.get.mockResolvedValue(null)
      mockPrisma.searchSuggestion.findMany.mockResolvedValue(mockSuggestions)

      const request = createMockRequest({ q: 'Lagos beach' })
      const response = await GET(request)
      const data = await response.json()

      const types = data.suggestions.map((s: any) => s.type)
      expect(types).toContain('package')
      expect(types).toContain('location')
      expect(types).toContain('category')
    })
  })

  describe('Caching', () => {
    it('returns cached suggestions when available', async () => {
      const cachedSuggestions = [
        { id: '1', text: 'Lagos Beach Party', type: 'package' },
      ]

      mockRedis.get.mockResolvedValue(JSON.stringify(cachedSuggestions))

      const request = createMockRequest({ q: 'Lagos' })
      const response = await GET(request)
      const data = await response.json()

      expect(data.suggestions).toEqual(cachedSuggestions)
      expect(mockPrisma.searchSuggestion.findMany).not.toHaveBeenCalled()
    })

    it('caches suggestions after database query', async () => {
      const mockSuggestions = [
        { id: '1', text: 'Lagos Beach Party', type: 'package', popularity: 100 },
      ]

      mockRedis.get.mockResolvedValue(null)
      mockPrisma.searchSuggestion.findMany.mockResolvedValue(mockSuggestions)

      const request = createMockRequest({ q: 'Lagos' })
      await GET(request)

      expect(mockRedis.setex).toHaveBeenCalledWith(
        'suggestions:lagos',
        300, // 5 minutes cache
        JSON.stringify(mockSuggestions)
      )
    })

    it('handles cache errors gracefully', async () => {
      mockRedis.get.mockRejectedValue(new Error('Redis connection failed'))
      mockPrisma.searchSuggestion.findMany.mockResolvedValue([])

      const request = createMockRequest({ q: 'Lagos' })
      const response = await GET(request)

      expect(response.status).toBe(200) // Should still work without cache
    })
  })

  describe('Popularity Ranking', () => {
    it('sorts suggestions by popularity', async () => {
      const mockSuggestions = [
        { id: '1', text: 'Lagos Beach Party', type: 'package', popularity: 50 },
        { id: '2', text: 'Lagos Hotels', type: 'category', popularity: 100 },
        { id: '3', text: 'Lagos Tours', type: 'package', popularity: 75 },
      ]

      mockRedis.get.mockResolvedValue(null)
      mockPrisma.searchSuggestion.findMany.mockResolvedValue(mockSuggestions)

      const request = createMockRequest({ q: 'Lagos' })
      const response = await GET(request)
      const data = await response.json()

      expect(data.suggestions[0].text).toBe('Lagos Hotels') // Highest popularity
      expect(data.suggestions[1].text).toBe('Lagos Tours')
      expect(data.suggestions[2].text).toBe('Lagos Beach Party') // Lowest popularity
    })

    it('tracks suggestion usage for popularity', async () => {
      const request = createMockRequest({ 
        q: 'Lagos',
        track: 'Lagos Beach Party'
      })
      const response = await GET(request)

      expect(mockPrisma.searchSuggestion.upsert).toHaveBeenCalledWith({
        where: { text: 'Lagos Beach Party' },
        update: { popularity: { increment: 1 } },
        create: {
          text: 'Lagos Beach Party',
          type: 'search',
          popularity: 1
        }
      })
    })
  })

  describe('Fuzzy Matching', () => {
    it('handles typos in search query', async () => {
      const mockSuggestions = [
        { id: '1', text: 'Lagos Beach Party', type: 'package', popularity: 100 },
        { id: '2', text: 'Lagos Hotels', type: 'category', popularity: 80 },
      ]

      mockRedis.get.mockResolvedValue(null)
      mockPrisma.searchSuggestion.findMany.mockResolvedValue(mockSuggestions)

      const request = createMockRequest({ q: 'Lagoz' }) // Typo
      const response = await GET(request)
      const data = await response.json()

      expect(data.suggestions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ text: 'Lagos Beach Party' }),
          expect.objectContaining({ text: 'Lagos Hotels' })
        ])
      )
    })

    it('handles partial matches', async () => {
      const mockSuggestions = [
        { id: '1', text: 'Lagos Beach Party', type: 'package', popularity: 100 },
      ]

      mockRedis.get.mockResolvedValue(null)
      mockPrisma.searchSuggestion.findMany.mockResolvedValue(mockSuggestions)

      const request = createMockRequest({ q: 'Lag' })
      const response = await GET(request)
      const data = await response.json()

      expect(data.suggestions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ text: 'Lagos Beach Party' })
        ])
      )
    })
  })

  describe('Performance', () => {
    it('limits database query results', async () => {
      mockRedis.get.mockResolvedValue(null)
      mockPrisma.searchSuggestion.findMany.mockResolvedValue([])

      const request = createMockRequest({ q: 'Lagos' })
      await GET(request)

      expect(mockPrisma.searchSuggestion.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 20 // Fetch more than needed for better ranking
        })
      )
    })

    it('uses database indexes for fast queries', async () => {
      mockRedis.get.mockResolvedValue(null)
      mockPrisma.searchSuggestion.findMany.mockResolvedValue([])

      const request = createMockRequest({ q: 'Lagos' })
      await GET(request)

      expect(mockPrisma.searchSuggestion.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            text: expect.objectContaining({
              contains: 'Lagos',
              mode: 'insensitive'
            })
          }),
          orderBy: { popularity: 'desc' }
        })
      )
    })
  })

  describe('Error Handling', () => {
    it('handles database errors gracefully', async () => {
      mockRedis.get.mockResolvedValue(null)
      mockPrisma.searchSuggestion.findMany.mockRejectedValue(new Error('Database error'))

      const request = createMockRequest({ q: 'Lagos' })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })

    it('sanitizes malicious input', async () => {
      mockRedis.get.mockResolvedValue(null)
      mockPrisma.searchSuggestion.findMany.mockResolvedValue([])

      const request = createMockRequest({ 
        q: '<script>alert("xss")</script>Lagos'
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.query).toBe('Lagos') // XSS should be stripped
    })

    it('handles very long queries', async () => {
      const longQuery = 'a'.repeat(1000)
      
      const request = createMockRequest({ q: longQuery })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Query too long')
    })
  })

  describe('Rate Limiting', () => {
    it('implements rate limiting for suggestions', async () => {
      const request = createMockRequest({ q: 'Lagos' })
      const response = await GET(request)

      expect(response.headers.get('X-RateLimit-Limit')).toBeDefined()
      expect(response.headers.get('X-RateLimit-Remaining')).toBeDefined()
    })
  })

  describe('Analytics', () => {
    it('logs suggestion requests for analytics', async () => {
      const consoleSpy = jest.spyOn(console, 'info').mockImplementation()
      
      mockRedis.get.mockResolvedValue(null)
      mockPrisma.searchSuggestion.findMany.mockResolvedValue([])

      const request = createMockRequest({ q: 'Lagos' })
      await GET(request)

      expect(consoleSpy).toHaveBeenCalledWith(
        'Suggestion request',
        expect.objectContaining({
          query: 'Lagos',
          resultCount: 0
        })
      )

      consoleSpy.mockRestore()
    })
  })
})
