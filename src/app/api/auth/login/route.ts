/**
 * Login API Endpoint
 * POST /api/auth/login
 * Sprint 1 - User Authentication
 */

import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { loginSchema } from '@/lib/validations'
import {
  handleApiError,
  successResponse,
  UnauthorizedError,
  ForbiddenError,
} from '@/lib/api-errors'

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validated = loginSchema.parse(body)

    // Create Supabase client
    const supabase = await createServerSupabaseClient()

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    })

    if (authError) {
      throw new UnauthorizedError('Invalid email or password')
    }

    if (!authData.user || !authData.session) {
      throw new UnauthorizedError('Authentication failed')
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: authData.user.id },
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
        profile: {
          select: {
            bio: true,
            avatar: true,
            city: true,
            country: true,
            preferences: true,
          },
        },
        vendor: {
          select: {
            id: true,
            businessName: true,
            businessType: true,
            status: true,
            verifiedAt: true,
          },
        },
      },
    })

    if (!user) {
      throw new UnauthorizedError('User account not found')
    }

    // Check if account is active
    if (user.status === 'SUSPENDED') {
      throw new ForbiddenError('Your account has been suspended')
    }

    if (user.status === 'DELETED') {
      throw new ForbiddenError('Your account has been deleted')
    }

    // Update last login timestamp (optional)
    await prisma.user.update({
      where: { id: user.id },
      data: { updatedAt: new Date() },
    })

    return successResponse({
      message: 'Login successful',
      user,
      session: {
        accessToken: authData.session.access_token,
        refreshToken: authData.session.refresh_token,
        expiresIn: authData.session.expires_in,
        expiresAt: authData.session.expires_at,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
