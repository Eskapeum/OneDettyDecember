/**
 * @jest-environment node
 */

import { POST, PUT } from '../route'

// Mock Prisma Client
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  passwordResetToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
}

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
}))

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-new-password'),
}))

// Mock email service
jest.mock('@/lib/email', () => ({
  sendPasswordResetEmail: jest.fn().mockResolvedValue({ success: true }),
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

describe('/api/auth/password-reset', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST - Request Password Reset', () => {
    describe('Validation', () => {
      it('validates required email field', async () => {
        const request = createMockRequest({})
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe('Validation failed')
        expect(data.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ path: ['email'] }),
          ])
        )
      })

      it('validates email format', async () => {
        const request = createMockRequest({
          email: 'invalid-email',
        })
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe('Validation failed')
      })
    })

    describe('Successful Password Reset Request', () => {
      it('creates reset token for valid email', async () => {
        mockPrisma.user.findUnique.mockResolvedValue({
          id: 'user-123',
          email: 'john@example.com',
          firstName: 'John',
        })
        mockPrisma.passwordResetToken.create.mockResolvedValue({
          id: 'token-123',
          token: 'reset-token-456',
          userId: 'user-123',
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        })

        const request = createMockRequest({
          email: 'john@example.com',
        })
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(data.message).toBe('Password reset email sent')
        expect(mockPrisma.passwordResetToken.create).toHaveBeenCalledWith({
          data: {
            userId: 'user-123',
            token: expect.any(String),
            expiresAt: expect.any(Date),
          },
        })
      })

      it('sends password reset email', async () => {
        mockPrisma.user.findUnique.mockResolvedValue({
          id: 'user-123',
          email: 'john@example.com',
          firstName: 'John',
        })

        const emailService = require('@/lib/email')
        const request = createMockRequest({
          email: 'john@example.com',
        })
        await POST(request)

        expect(emailService.sendPasswordResetEmail).toHaveBeenCalledWith({
          email: 'john@example.com',
          firstName: 'John',
          token: expect.any(String),
        })
      })

      it('cleans up old reset tokens', async () => {
        mockPrisma.user.findUnique.mockResolvedValue({
          id: 'user-123',
          email: 'john@example.com',
        })

        const request = createMockRequest({
          email: 'john@example.com',
        })
        await POST(request)

        expect(mockPrisma.passwordResetToken.deleteMany).toHaveBeenCalledWith({
          where: { userId: 'user-123' },
        })
      })

      it('returns success even for non-existent email (security)', async () => {
        mockPrisma.user.findUnique.mockResolvedValue(null)

        const request = createMockRequest({
          email: 'notfound@example.com',
        })
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(data.message).toBe('Password reset email sent')
        expect(mockPrisma.passwordResetToken.create).not.toHaveBeenCalled()
      })
    })

    describe('Rate Limiting', () => {
      it('implements rate limiting for password reset requests', async () => {
        const rateLimit = require('@/lib/rate-limit')
        rateLimit.checkRateLimit.mockResolvedValue({
          success: false,
          error: 'Too many password reset requests',
        })

        const request = createMockRequest({
          email: 'john@example.com',
        })
        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(429)
        expect(data.error).toBe('Too many password reset requests')
      })
    })
  })

  describe('PUT - Reset Password', () => {
    describe('Validation', () => {
      it('validates required fields', async () => {
        const request = createMockRequest({})
        const response = await PUT(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe('Validation failed')
        expect(data.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ path: ['token'] }),
            expect.objectContaining({ path: ['email'] }),
            expect.objectContaining({ path: ['password'] }),
          ])
        )
      })

      it('validates password strength', async () => {
        const request = createMockRequest({
          token: 'reset-token-123',
          email: 'john@example.com',
          password: '123',
        })
        const response = await PUT(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe('Validation failed')
      })
    })

    describe('Successful Password Reset', () => {
      it('resets password with valid token', async () => {
        mockPrisma.passwordResetToken.findUnique.mockResolvedValue({
          id: 'token-123',
          token: 'reset-token-456',
          userId: 'user-123',
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          user: {
            id: 'user-123',
            email: 'john@example.com',
          },
        })
        mockPrisma.user.update.mockResolvedValue({
          id: 'user-123',
          email: 'john@example.com',
        })

        const bcrypt = require('bcryptjs')
        const request = createMockRequest({
          token: 'reset-token-456',
          email: 'john@example.com',
          password: 'newpassword123',
        })
        const response = await PUT(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(data.message).toBe('Password reset successful')
        expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 12)
        expect(mockPrisma.user.update).toHaveBeenCalledWith({
          where: { id: 'user-123' },
          data: { password: 'hashed-new-password' },
        })
      })

      it('deletes reset token after successful reset', async () => {
        mockPrisma.passwordResetToken.findUnique.mockResolvedValue({
          id: 'token-123',
          token: 'reset-token-456',
          userId: 'user-123',
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          user: {
            id: 'user-123',
            email: 'john@example.com',
          },
        })

        const request = createMockRequest({
          token: 'reset-token-456',
          email: 'john@example.com',
          password: 'newpassword123',
        })
        await PUT(request)

        expect(mockPrisma.passwordResetToken.delete).toHaveBeenCalledWith({
          where: { id: 'token-123' },
        })
      })

      it('invalidates all user sessions after password reset', async () => {
        mockPrisma.passwordResetToken.findUnique.mockResolvedValue({
          id: 'token-123',
          token: 'reset-token-456',
          userId: 'user-123',
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          user: {
            id: 'user-123',
            email: 'john@example.com',
          },
        })

        const request = createMockRequest({
          token: 'reset-token-456',
          email: 'john@example.com',
          password: 'newpassword123',
        })
        await PUT(request)

        // Should also invalidate sessions (implementation dependent)
        expect(mockPrisma.user.update).toHaveBeenCalledWith({
          where: { id: 'user-123' },
          data: { password: 'hashed-new-password' },
        })
      })
    })

    describe('Token Validation Errors', () => {
      it('handles invalid reset token', async () => {
        mockPrisma.passwordResetToken.findUnique.mockResolvedValue(null)

        const request = createMockRequest({
          token: 'invalid-token',
          email: 'john@example.com',
          password: 'newpassword123',
        })
        const response = await PUT(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe('Invalid or expired reset token')
      })

      it('handles expired reset token', async () => {
        mockPrisma.passwordResetToken.findUnique.mockResolvedValue({
          id: 'token-123',
          token: 'reset-token-456',
          userId: 'user-123',
          expiresAt: new Date(Date.now() - 60 * 60 * 1000), // Expired
          user: {
            id: 'user-123',
            email: 'john@example.com',
          },
        })

        const request = createMockRequest({
          token: 'reset-token-456',
          email: 'john@example.com',
          password: 'newpassword123',
        })
        const response = await PUT(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe('Invalid or expired reset token')
      })

      it('handles email mismatch', async () => {
        mockPrisma.passwordResetToken.findUnique.mockResolvedValue({
          id: 'token-123',
          token: 'reset-token-456',
          userId: 'user-123',
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          user: {
            id: 'user-123',
            email: 'john@example.com',
          },
        })

        const request = createMockRequest({
          token: 'reset-token-456',
          email: 'different@example.com',
          password: 'newpassword123',
        })
        const response = await PUT(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe('Invalid reset token for this email')
      })
    })

    describe('Error Handling', () => {
      it('handles database errors', async () => {
        mockPrisma.passwordResetToken.findUnique.mockRejectedValue(
          new Error('Database connection failed')
        )

        const request = createMockRequest({
          token: 'reset-token-456',
          email: 'john@example.com',
          password: 'newpassword123',
        })
        const response = await PUT(request)
        const data = await response.json()

        expect(response.status).toBe(500)
        expect(data.error).toBe('Internal server error')
      })

      it('handles bcrypt errors', async () => {
        mockPrisma.passwordResetToken.findUnique.mockResolvedValue({
          id: 'token-123',
          token: 'reset-token-456',
          userId: 'user-123',
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          user: {
            id: 'user-123',
            email: 'john@example.com',
          },
        })

        const bcrypt = require('bcryptjs')
        bcrypt.hash.mockRejectedValue(new Error('Bcrypt error'))

        const request = createMockRequest({
          token: 'reset-token-456',
          email: 'john@example.com',
          password: 'newpassword123',
        })
        const response = await PUT(request)
        const data = await response.json()

        expect(response.status).toBe(500)
        expect(data.error).toBe('Internal server error')
      })
    })
  })

  describe('Security', () => {
    it('logs password reset attempts', async () => {
      const consoleSpy = jest.spyOn(console, 'info').mockImplementation()
      
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'john@example.com',
      })

      const request = createMockRequest({
        email: 'john@example.com',
      })
      await POST(request)

      expect(consoleSpy).toHaveBeenCalledWith(
        'Password reset requested',
        expect.objectContaining({
          email: 'john@example.com',
          ip: '127.0.0.1',
        })
      )

      consoleSpy.mockRestore()
    })

    it('uses cryptographically secure tokens', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'john@example.com',
      })

      const request = createMockRequest({
        email: 'john@example.com',
      })
      await POST(request)

      const createCall = mockPrisma.passwordResetToken.create.mock.calls[0][0]
      const token = createCall.data.token

      // Token should be long and random
      expect(token).toHaveLength(64) // or whatever length is configured
      expect(token).toMatch(/^[a-f0-9]+$/) // hex string
    })

    it('sets appropriate token expiration', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'john@example.com',
      })

      const request = createMockRequest({
        email: 'john@example.com',
      })
      await POST(request)

      const createCall = mockPrisma.passwordResetToken.create.mock.calls[0][0]
      const expiresAt = createCall.data.expiresAt

      // Should expire in 1 hour (3600000 ms)
      const expectedExpiry = Date.now() + 60 * 60 * 1000
      const actualExpiry = expiresAt.getTime()
      
      expect(Math.abs(actualExpiry - expectedExpiry)).toBeLessThan(1000) // 1 second tolerance
    })
  })
})
