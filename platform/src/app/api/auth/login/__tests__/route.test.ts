/**
 * @jest-environment node
 */

import { POST } from '../route'

// Mock Prisma Client
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  session: {
    create: jest.fn(),
    deleteMany: jest.fn(),
  },
}

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
}))

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}))

// Mock JWT
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('jwt-token'),
}))

// Mock rate limiting
jest.mock('@/lib/rate-limit', () => ({
  checkRateLimit: jest.fn().mockResolvedValue({ success: true }),
}))

// Helper function to create mock requests
function createMockRequest(body: any) {
  return {
    json: jest.fn().mockResolvedValue(body),
    headers: {
      get: jest.fn().mockReturnValue('127.0.0.1'),
    },
  } as any
}

describe('/api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Login Validation', () => {
    it('validates required fields', async () => {
      const request = createMockRequest({})
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation failed')
      expect(data.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: ['email'] }),
          expect.objectContaining({ path: ['password'] }),
        ])
      )
    })

    it('validates email format', async () => {
      const request = createMockRequest({
        email: 'invalid-email',
        password: 'password123',
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation failed')
    })

    it('validates minimum password length', async () => {
      const request = createMockRequest({
        email: 'john@example.com',
        password: '123',
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation failed')
    })
  })

  describe('Successful Login', () => {
    it('authenticates user with valid credentials', async () => {
      const bcrypt = require('bcryptjs')
      bcrypt.compare.mockResolvedValue(true)

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'john@example.com',
        password: 'hashed-password',
        firstName: 'John',
        lastName: 'Doe',
        emailVerified: true,
        lastLoginAt: null,
      })

      mockPrisma.user.update.mockResolvedValue({
        id: 'user-123',
        lastLoginAt: new Date(),
      })

      mockPrisma.session.create.mockResolvedValue({
        id: 'session-123',
        userId: 'user-123',
        token: 'session-token',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })

      const request = createMockRequest({
        email: 'john@example.com',
        password: 'password123',
        rememberMe: false,
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.user).toEqual({
        id: 'user-123',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        emailVerified: true,
      })
      expect(data.token).toBe('jwt-token')
    })

    it('updates last login timestamp', async () => {
      const bcrypt = require('bcryptjs')
      bcrypt.compare.mockResolvedValue(true)

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'john@example.com',
        password: 'hashed-password',
        emailVerified: true,
      })

      const request = createMockRequest({
        email: 'john@example.com',
        password: 'password123',
      })
      await POST(request)

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: { lastLoginAt: expect.any(Date) },
      })
    })

    it('creates session for remember me', async () => {
      const bcrypt = require('bcryptjs')
      bcrypt.compare.mockResolvedValue(true)

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'john@example.com',
        password: 'hashed-password',
        emailVerified: true,
      })

      const request = createMockRequest({
        email: 'john@example.com',
        password: 'password123',
        rememberMe: true,
      })
      await POST(request)

      expect(mockPrisma.session.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-123',
          token: expect.any(String),
          expiresAt: expect.any(Date),
          rememberMe: true,
        },
      })
    })

    it('cleans up old sessions when remember me is false', async () => {
      const bcrypt = require('bcryptjs')
      bcrypt.compare.mockResolvedValue(true)

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'john@example.com',
        password: 'hashed-password',
        emailVerified: true,
      })

      const request = createMockRequest({
        email: 'john@example.com',
        password: 'password123',
        rememberMe: false,
      })
      await POST(request)

      expect(mockPrisma.session.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
      })
    })
  })

  describe('Authentication Failures', () => {
    it('handles user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)

      const request = createMockRequest({
        email: 'notfound@example.com',
        password: 'password123',
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Invalid email or password')
    })

    it('handles incorrect password', async () => {
      const bcrypt = require('bcryptjs')
      bcrypt.compare.mockResolvedValue(false)

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'john@example.com',
        password: 'hashed-password',
        emailVerified: true,
      })

      const request = createMockRequest({
        email: 'john@example.com',
        password: 'wrongpassword',
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Invalid email or password')
    })

    it('handles unverified email', async () => {
      const bcrypt = require('bcryptjs')
      bcrypt.compare.mockResolvedValue(true)

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'john@example.com',
        password: 'hashed-password',
        emailVerified: false,
      })

      const request = createMockRequest({
        email: 'john@example.com',
        password: 'password123',
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Please verify your email address before logging in')
      expect(data.code).toBe('EMAIL_NOT_VERIFIED')
    })

    it('handles account suspension', async () => {
      const bcrypt = require('bcryptjs')
      bcrypt.compare.mockResolvedValue(true)

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'john@example.com',
        password: 'hashed-password',
        emailVerified: true,
        status: 'SUSPENDED',
      })

      const request = createMockRequest({
        email: 'john@example.com',
        password: 'password123',
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Account has been suspended')
      expect(data.code).toBe('ACCOUNT_SUSPENDED')
    })
  })

  describe('Security Features', () => {
    it('implements rate limiting', async () => {
      const rateLimit = require('@/lib/rate-limit')
      rateLimit.checkRateLimit.mockResolvedValue({ 
        success: false, 
        error: 'Too many login attempts' 
      })

      const request = createMockRequest({
        email: 'john@example.com',
        password: 'password123',
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(429)
      expect(data.error).toBe('Too many login attempts')
    })

    it('logs failed login attempts', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      
      mockPrisma.user.findUnique.mockResolvedValue(null)

      const request = createMockRequest({
        email: 'attacker@example.com',
        password: 'password123',
      })
      await POST(request)

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed login attempt',
        expect.objectContaining({
          email: 'attacker@example.com',
          ip: '127.0.0.1',
        })
      )

      consoleSpy.mockRestore()
    })

    it('sanitizes email input', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)

      const request = createMockRequest({
        email: '  JOHN@EXAMPLE.COM  ',
        password: 'password123',
      })
      await POST(request)

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      })
    })

    it('prevents timing attacks', async () => {
      const bcrypt = require('bcryptjs')
      
      // Test with non-existent user
      mockPrisma.user.findUnique.mockResolvedValue(null)
      const start1 = Date.now()
      
      const request1 = createMockRequest({
        email: 'notfound@example.com',
        password: 'password123',
      })
      await POST(request1)
      const time1 = Date.now() - start1

      // Test with existing user but wrong password
      bcrypt.compare.mockResolvedValue(false)
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'john@example.com',
        password: 'hashed-password',
        emailVerified: true,
      })
      
      const start2 = Date.now()
      const request2 = createMockRequest({
        email: 'john@example.com',
        password: 'wrongpassword',
      })
      await POST(request2)
      const time2 = Date.now() - start2

      // Response times should be similar (within reasonable variance)
      const timeDifference = Math.abs(time1 - time2)
      expect(timeDifference).toBeLessThan(100) // 100ms tolerance
    })
  })

  describe('Error Handling', () => {
    it('handles database errors', async () => {
      mockPrisma.user.findUnique.mockRejectedValue(new Error('Database connection failed'))

      const request = createMockRequest({
        email: 'john@example.com',
        password: 'password123',
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })

    it('handles bcrypt errors', async () => {
      const bcrypt = require('bcryptjs')
      bcrypt.compare.mockRejectedValue(new Error('Bcrypt error'))

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'john@example.com',
        password: 'hashed-password',
        emailVerified: true,
      })

      const request = createMockRequest({
        email: 'john@example.com',
        password: 'password123',
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })
  })
})
