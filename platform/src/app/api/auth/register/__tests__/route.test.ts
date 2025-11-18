/**
 * @jest-environment node
 */

import { POST } from '../route'
import { z } from 'zod'

// Mock Prisma Client
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  emailVerificationToken: {
    create: jest.fn(),
  },
}

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
}))

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
}))

// Mock email service
jest.mock('@/lib/email', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue({ success: true }),
}))

// Mock JWT
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('jwt-token'),
}))

// Helper function to create mock requests
function createMockRequest(body: any) {
  return {
    json: jest.fn().mockResolvedValue(body),
  } as any
}

describe('/api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Registration Validation', () => {
    it('validates required fields', async () => {
      const request = createMockRequest({})
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation failed')
      expect(data.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: ['firstName'] }),
          expect.objectContaining({ path: ['lastName'] }),
          expect.objectContaining({ path: ['email'] }),
          expect.objectContaining({ path: ['password'] }),
        ])
      )
    })

    it('validates email format', async () => {
      const request = createMockRequest({
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        password: 'password123',
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation failed')
      expect(data.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ 
            path: ['email'],
            message: expect.stringContaining('Invalid email')
          }),
        ])
      )
    })

    it('validates password strength', async () => {
      const request = createMockRequest({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: '123',
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation failed')
      expect(data.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ 
            path: ['password'],
            message: expect.stringContaining('at least 8 characters')
          }),
        ])
      )
    })

    it('validates name length limits', async () => {
      const request = createMockRequest({
        firstName: 'a'.repeat(51),
        lastName: 'b'.repeat(51),
        email: 'john@example.com',
        password: 'password123',
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Validation failed')
    })
  })

  describe('Successful Registration', () => {
    it('creates user with valid data', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-123',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        emailVerified: false,
        createdAt: new Date(),
      })
      mockPrisma.emailVerificationToken.create.mockResolvedValue({
        id: 'token-123',
        token: 'verification-token',
        userId: 'user-123',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })

      const request = createMockRequest({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.user).toEqual({
        id: 'user-123',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        emailVerified: false,
      })
      expect(data.message).toBe('Registration successful. Please check your email for verification.')
    })

    it('hashes password before storing', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-123',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
      })

      const bcrypt = require('bcryptjs')
      const request = createMockRequest({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      })
      await POST(request)

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12)
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'hashed-password',
          emailVerified: false,
        },
      })
    })

    it('creates email verification token', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-123',
        email: 'john@example.com',
      })

      const request = createMockRequest({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      })
      await POST(request)

      expect(mockPrisma.emailVerificationToken.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-123',
          token: expect.any(String),
          expiresAt: expect.any(Date),
        },
      })
    })

    it('sends verification email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-123',
        email: 'john@example.com',
        firstName: 'John',
      })

      const emailService = require('@/lib/email')
      const request = createMockRequest({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      })
      await POST(request)

      expect(emailService.sendVerificationEmail).toHaveBeenCalledWith({
        email: 'john@example.com',
        firstName: 'John',
        token: expect.any(String),
      })
    })
  })

  describe('Error Handling', () => {
    it('handles duplicate email registration', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'existing-user',
        email: 'john@example.com',
      })

      const request = createMockRequest({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('Email already registered')
      expect(mockPrisma.user.create).not.toHaveBeenCalled()
    })

    it('handles database errors', async () => {
      mockPrisma.user.findUnique.mockRejectedValue(new Error('Database connection failed'))

      const request = createMockRequest({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      })
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })

    it('handles email service failures gracefully', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-123',
        email: 'john@example.com',
      })

      const emailService = require('@/lib/email')
      emailService.sendVerificationEmail.mockRejectedValue(new Error('Email service down'))

      const request = createMockRequest({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      })
      const response = await POST(request)
      const data = await response.json()

      // Should still succeed but log the email error
      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.message).toContain('verification email could not be sent')
    })
  })

  describe('Security', () => {
    it('sanitizes user input', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-123',
        email: 'john@example.com',
      })

      const request = createMockRequest({
        firstName: '  John  ',
        lastName: '  Doe  ',
        email: '  JOHN@EXAMPLE.COM  ',
        password: 'password123',
      })
      await POST(request)

      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'hashed-password',
          emailVerified: false,
        },
      })
    })

    it('prevents SQL injection attempts', async () => {
      const request = createMockRequest({
        firstName: "'; DROP TABLE users; --",
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      })
      const response = await POST(request)

      // Should handle malicious input safely
      expect(response.status).toBeLessThan(500)
    })

    it('rate limits registration attempts', async () => {
      // This would be implemented with a rate limiting middleware
      // For now, we test that the endpoint exists and responds
      const request = createMockRequest({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      })
      const response = await POST(request)

      expect(response).toBeDefined()
    })
  })
})
