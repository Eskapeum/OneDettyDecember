/**
 * User Profile API Routes
 * GET /api/users/profile - Get current user's profile
 * PATCH /api/users/profile - Update current user's profile
 * Sprint 0 - Day 1
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { userProfileUpdateSchema } from '@/lib/validations'
import {
  handleApiError,
  successResponse,
  NotFoundError,
} from '@/lib/api-errors'
import { getCurrentUser } from '@/lib/auth-helpers'

/**
 * GET /api/users/profile
 * Get current user's profile with related data
 */
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const authUser = await getCurrentUser()

    // Fetch user with profile
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
            id: true,
            bio: true,
            avatar: true,
            country: true,
            city: true,
            dateOfBirth: true,
            preferences: true,
            createdAt: true,
            updatedAt: true,
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
      throw new NotFoundError('User not found')
    }

    return successResponse({ user })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PATCH /api/users/profile
 * Update current user's profile
 */
export async function PATCH(request: NextRequest) {
  try {
    // Get authenticated user
    const authUser = await getCurrentUser()

    // Parse and validate request body
    const body = await request.json()
    const validated = userProfileUpdateSchema.parse(body)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      include: { profile: true },
    })

    if (!user) {
      throw new NotFoundError('User not found')
    }

    // Prepare profile data
    const profileData: any = {}
    if (validated.bio !== undefined) profileData.bio = validated.bio
    if (validated.avatar !== undefined) profileData.avatar = validated.avatar
    if (validated.country !== undefined) profileData.country = validated.country
    if (validated.city !== undefined) profileData.city = validated.city
    if (validated.dateOfBirth !== undefined) {
      profileData.dateOfBirth = new Date(validated.dateOfBirth)
    }
    if (validated.preferences !== undefined) {
      profileData.preferences = validated.preferences
    }

    // Update or create profile
    const profile = await prisma.userProfile.upsert({
      where: { userId: authUser.id },
      update: profileData,
      create: {
        userId: authUser.id,
        ...profileData,
      },
      select: {
        id: true,
        bio: true,
        avatar: true,
        country: true,
        city: true,
        dateOfBirth: true,
        preferences: true,
        updatedAt: true,
      },
    })

    return successResponse({
      message: 'Profile updated successfully',
      profile,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
