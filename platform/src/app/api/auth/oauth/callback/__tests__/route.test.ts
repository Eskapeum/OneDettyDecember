/**
 * @jest-environment node
 */

import { GET } from '../route'

// Mock Prisma Client
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  oauthAccount: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  session: {
    create: jest.fn(),
  },
}

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
}))

// Mock OAuth providers
jest.mock('@/lib/oauth/google', () => ({
  verifyGoogleToken: jest.fn(),
  getGoogleUserInfo: jest.fn(),
}))

jest.mock('@/lib/oauth/facebook', () => ({
  verifyFacebookToken: jest.fn(),
  getFacebookUserInfo: jest.fn(),
}))

// Mock JWT
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('jwt-token'),
}))

// Helper function to create mock requests
function createMockRequest(searchParams: Record<string, string>) {
  const url = new URL('http://localhost:3002/api/auth/oauth/callback')
  Object.entries(searchParams).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  
  return {
    url: url.toString(),
    nextUrl: { searchParams: url.searchParams },
  } as any
}

describe('/api/auth/oauth/callback', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Google OAuth', () => {
    it('handles successful Google OAuth callback', async () => {
      const googleOAuth = require('@/lib/oauth/google')
      googleOAuth.verifyGoogleToken.mockResolvedValue({ valid: true })
      googleOAuth.getGoogleUserInfo.mockResolvedValue({
        id: 'google-123',
        email: 'john@example.com',
        given_name: 'John',
        family_name: 'Doe',
        picture: 'https://example.com/avatar.jpg',
        email_verified: true,
      })

      mockPrisma.user.findUnique.mockResolvedValue(null)
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-123',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        emailVerified: true,
        avatar: 'https://example.com/avatar.jpg',
      })
      mockPrisma.oauthAccount.create.mockResolvedValue({
        id: 'oauth-123',
        provider: 'google',
        providerId: 'google-123',
        userId: 'user-123',
      })

      const request = createMockRequest({
        provider: 'google',
        code: 'auth-code-123',
        state: 'csrf-state-token',
      })
      const response = await GET(request)
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

    it('links Google account to existing user', async () => {
      const googleOAuth = require('@/lib/oauth/google')
      googleOAuth.verifyGoogleToken.mockResolvedValue({ valid: true })
      googleOAuth.getGoogleUserInfo.mockResolvedValue({
        id: 'google-123',
        email: 'john@example.com',
        given_name: 'John',
        family_name: 'Doe',
        email_verified: true,
      })

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'existing-user-123',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        emailVerified: true,
      })
      mockPrisma.oauthAccount.findUnique.mockResolvedValue(null)
      mockPrisma.oauthAccount.create.mockResolvedValue({
        id: 'oauth-123',
        provider: 'google',
        providerId: 'google-123',
        userId: 'existing-user-123',
      })

      const request = createMockRequest({
        provider: 'google',
        code: 'auth-code-123',
        state: 'csrf-state-token',
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(mockPrisma.user.create).not.toHaveBeenCalled()
      expect(mockPrisma.oauthAccount.create).toHaveBeenCalledWith({
        data: {
          provider: 'google',
          providerId: 'google-123',
          userId: 'existing-user-123',
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        },
      })
    })

    it('handles existing Google OAuth account', async () => {
      const googleOAuth = require('@/lib/oauth/google')
      googleOAuth.verifyGoogleToken.mockResolvedValue({ valid: true })
      googleOAuth.getGoogleUserInfo.mockResolvedValue({
        id: 'google-123',
        email: 'john@example.com',
        given_name: 'John',
        family_name: 'Doe',
        email_verified: true,
      })

      mockPrisma.oauthAccount.findUnique.mockResolvedValue({
        id: 'oauth-123',
        provider: 'google',
        providerId: 'google-123',
        userId: 'user-123',
        user: {
          id: 'user-123',
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          emailVerified: true,
        },
      })

      const request = createMockRequest({
        provider: 'google',
        code: 'auth-code-123',
        state: 'csrf-state-token',
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(mockPrisma.user.create).not.toHaveBeenCalled()
      expect(mockPrisma.oauthAccount.create).not.toHaveBeenCalled()
    })
  })

  describe('Facebook OAuth', () => {
    it('handles successful Facebook OAuth callback', async () => {
      const facebookOAuth = require('@/lib/oauth/facebook')
      facebookOAuth.verifyFacebookToken.mockResolvedValue({ valid: true })
      facebookOAuth.getFacebookUserInfo.mockResolvedValue({
        id: 'facebook-123',
        email: 'jane@example.com',
        first_name: 'Jane',
        last_name: 'Smith',
        picture: { data: { url: 'https://example.com/avatar.jpg' } },
      })

      mockPrisma.user.findUnique.mockResolvedValue(null)
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-456',
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        emailVerified: true,
      })

      const request = createMockRequest({
        provider: 'facebook',
        code: 'fb-auth-code-123',
        state: 'csrf-state-token',
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.user.email).toBe('jane@example.com')
    })

    it('handles Facebook OAuth without email permission', async () => {
      const facebookOAuth = require('@/lib/oauth/facebook')
      facebookOAuth.verifyFacebookToken.mockResolvedValue({ valid: true })
      facebookOAuth.getFacebookUserInfo.mockResolvedValue({
        id: 'facebook-123',
        first_name: 'Jane',
        last_name: 'Smith',
        // No email provided
      })

      const request = createMockRequest({
        provider: 'facebook',
        code: 'fb-auth-code-123',
        state: 'csrf-state-token',
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Email permission required for registration')
    })
  })

  describe('Error Handling', () => {
    it('handles missing provider parameter', async () => {
      const request = createMockRequest({
        code: 'auth-code-123',
        state: 'csrf-state-token',
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Missing provider parameter')
    })

    it('handles unsupported OAuth provider', async () => {
      const request = createMockRequest({
        provider: 'twitter',
        code: 'auth-code-123',
        state: 'csrf-state-token',
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Unsupported OAuth provider')
    })

    it('handles missing authorization code', async () => {
      const request = createMockRequest({
        provider: 'google',
        state: 'csrf-state-token',
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Missing authorization code')
    })

    it('handles OAuth error responses', async () => {
      const request = createMockRequest({
        provider: 'google',
        error: 'access_denied',
        error_description: 'User denied access',
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('OAuth authorization failed: User denied access')
    })

    it('handles invalid OAuth tokens', async () => {
      const googleOAuth = require('@/lib/oauth/google')
      googleOAuth.verifyGoogleToken.mockResolvedValue({ valid: false, error: 'Invalid token' })

      const request = createMockRequest({
        provider: 'google',
        code: 'invalid-code',
        state: 'csrf-state-token',
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Invalid OAuth token')
    })

    it('handles OAuth provider API errors', async () => {
      const googleOAuth = require('@/lib/oauth/google')
      googleOAuth.verifyGoogleToken.mockResolvedValue({ valid: true })
      googleOAuth.getGoogleUserInfo.mockRejectedValue(new Error('Google API error'))

      const request = createMockRequest({
        provider: 'google',
        code: 'auth-code-123',
        state: 'csrf-state-token',
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('OAuth provider error')
    })

    it('handles database errors during user creation', async () => {
      const googleOAuth = require('@/lib/oauth/google')
      googleOAuth.verifyGoogleToken.mockResolvedValue({ valid: true })
      googleOAuth.getGoogleUserInfo.mockResolvedValue({
        id: 'google-123',
        email: 'john@example.com',
        given_name: 'John',
        family_name: 'Doe',
        email_verified: true,
      })

      mockPrisma.user.findUnique.mockResolvedValue(null)
      mockPrisma.user.create.mockRejectedValue(new Error('Database error'))

      const request = createMockRequest({
        provider: 'google',
        code: 'auth-code-123',
        state: 'csrf-state-token',
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })
  })

  describe('Security', () => {
    it('validates CSRF state parameter', async () => {
      const request = createMockRequest({
        provider: 'google',
        code: 'auth-code-123',
        // Missing state parameter
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid or missing CSRF state')
    })

    it('prevents account takeover via email collision', async () => {
      const googleOAuth = require('@/lib/oauth/google')
      googleOAuth.verifyGoogleToken.mockResolvedValue({ valid: true })
      googleOAuth.getGoogleUserInfo.mockResolvedValue({
        id: 'google-123',
        email: 'victim@example.com',
        given_name: 'Attacker',
        family_name: 'User',
        email_verified: false, // Unverified email from OAuth
      })

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'victim-user-123',
        email: 'victim@example.com',
        emailVerified: true, // Existing verified user
      })

      const request = createMockRequest({
        provider: 'google',
        code: 'auth-code-123',
        state: 'csrf-state-token',
      })
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('Email already registered with a different account')
    })

    it('logs OAuth authentication attempts', async () => {
      const consoleSpy = jest.spyOn(console, 'info').mockImplementation()
      
      const googleOAuth = require('@/lib/oauth/google')
      googleOAuth.verifyGoogleToken.mockResolvedValue({ valid: true })
      googleOAuth.getGoogleUserInfo.mockResolvedValue({
        id: 'google-123',
        email: 'john@example.com',
        given_name: 'John',
        family_name: 'Doe',
        email_verified: true,
      })

      mockPrisma.user.findUnique.mockResolvedValue(null)
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-123',
        email: 'john@example.com',
      })

      const request = createMockRequest({
        provider: 'google',
        code: 'auth-code-123',
        state: 'csrf-state-token',
      })
      await GET(request)

      expect(consoleSpy).toHaveBeenCalledWith(
        'OAuth authentication successful',
        expect.objectContaining({
          provider: 'google',
          userId: 'user-123',
          email: 'john@example.com',
        })
      )

      consoleSpy.mockRestore()
    })
  })
})
