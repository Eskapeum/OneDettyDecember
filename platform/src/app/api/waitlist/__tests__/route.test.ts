import { z } from 'zod'

// Test the validation schema directly
const waitlistSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long').optional(),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long').optional(),
  source: z.string().max(100, 'Source too long').optional(),
  metadata: z.record(z.any()).optional(),
})

describe('/api/waitlist', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/waitlist', () => {
    it('successfully creates a waitlist entry with valid data', async () => {
      const requestData = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        source: 'landing-page'
      }

      mockPrisma.waitlistEntry.findUnique.mockResolvedValue(null)
      mockPrisma.waitlistEntry.create.mockResolvedValue({
        id: 'test-id',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        source: 'landing-page',
        createdAt: new Date(),
      })

      const request = new NextRequest('http://localhost:3002/api/waitlist', {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.message).toBe('Successfully added to waitlist')
      expect(data.email).toBe('test@example.com')
      expect(mockPrisma.waitlistEntry.create).toHaveBeenCalledWith({
        data: requestData
      })
    })

    it('creates entry with minimal data (email only)', async () => {
      const requestData = { email: 'minimal@example.com' }

      mockPrisma.waitlistEntry.findUnique.mockResolvedValue(null)
      mockPrisma.waitlistEntry.create.mockResolvedValue({
        id: 'test-id',
        email: 'minimal@example.com',
        createdAt: new Date(),
      })

      const request = new NextRequest('http://localhost:3002/api/waitlist', {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      expect(response.status).toBe(201)
    })

    it('returns 400 for invalid email', async () => {
      const requestData = { email: 'invalid-email' }

      const request = new NextRequest('http://localhost:3002/api/waitlist', {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation failed')
      expect(data.details).toBeDefined()
    })

    it('returns 400 for missing email', async () => {
      const requestData = { firstName: 'John' }

      const request = new NextRequest('http://localhost:3002/api/waitlist', {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })

    it('returns 409 for duplicate email', async () => {
      const requestData = { email: 'existing@example.com' }

      mockPrisma.waitlistEntry.findUnique.mockResolvedValue({
        id: 'existing-id',
        email: 'existing@example.com',
      })

      const request = new NextRequest('http://localhost:3002/api/waitlist', {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('Email already registered for waitlist')
    })

    it('returns 500 for database errors', async () => {
      const requestData = { email: 'test@example.com' }

      mockPrisma.waitlistEntry.findUnique.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3002/api/waitlist', {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })
  })

  describe('GET /api/waitlist', () => {
    it('returns paginated waitlist entries', async () => {
      const mockEntries = [
        { id: '1', email: 'user1@example.com', firstName: 'User', lastName: 'One', source: 'web', createdAt: new Date() },
        { id: '2', email: 'user2@example.com', firstName: 'User', lastName: 'Two', source: 'mobile', createdAt: new Date() },
      ]

      mockPrisma.waitlistEntry.findMany.mockResolvedValue(mockEntries)
      mockPrisma.waitlistEntry.count.mockResolvedValue(25)

      const request = new NextRequest('http://localhost:3002/api/waitlist?page=1&limit=10')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.entries).toEqual(mockEntries)
      expect(data.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 25,
        totalPages: 3
      })
    })

    it('handles pagination parameters correctly', async () => {
      mockPrisma.waitlistEntry.findMany.mockResolvedValue([])
      mockPrisma.waitlistEntry.count.mockResolvedValue(0)

      const request = new NextRequest('http://localhost:3002/api/waitlist?page=2&limit=5')
      await GET(request)

      expect(mockPrisma.waitlistEntry.findMany).toHaveBeenCalledWith({
        skip: 5, // (page 2 - 1) * limit 5
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          source: true,
          createdAt: true,
        }
      })
    })

    it('uses default pagination when no params provided', async () => {
      mockPrisma.waitlistEntry.findMany.mockResolvedValue([])
      mockPrisma.waitlistEntry.count.mockResolvedValue(0)

      const request = new NextRequest('http://localhost:3002/api/waitlist')
      await GET(request)

      expect(mockPrisma.waitlistEntry.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: expect.any(Object)
      })
    })
  })
})
