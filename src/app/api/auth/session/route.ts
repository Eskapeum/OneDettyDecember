/**
 * Session Management Endpoint
 * GET /api/auth/session - Get current session
 * Sprint 1 - Session Management
 */

import { NextRequest } from 'next/server'
import { getSession, getUser } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import {
  handleApiError,
  successResponse,
  UnauthorizedError,
} from '@/lib/api-errors'

export async function GET(request: NextRequest) {
  try {
    // Get session from Supabase
    const session = await getSession()

    if (!session) {
      throw new UnauthorizedError('No active session')
    }

    // Get user from Supabase
    const authUser = await getUser()

    if (!authUser) {
      throw new UnauthorizedError('User not found')
    }

    // Fetch full user data from database
    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            bio: true,
            avatar: true,
            city: true,
            country: true,
            dateOfBirth: true,
            preferences: true,
          },
        },
        vendor: {
          select: {
            id: true,
            businessName: true,
            businessType: true,
            status: true,
            logo: true,
            verifiedAt: true,
          },
        },
      },
    })

    if (!user) {
      throw new UnauthorizedError('User account not found')
    }

    return successResponse({
      user,
      session: {
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        expiresIn: session.expires_in,
        expiresAt: session.expires_at,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
