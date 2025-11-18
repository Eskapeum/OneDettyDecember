/**
 * Registration API Endpoint
 * POST /api/auth/register
 * Sprint 1 - User Registration & Authentication
 */

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations'
import {
  handleApiError,
  createdResponse,
  ConflictError,
  ServerError,
} from '@/lib/api-errors'

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validated = registerSchema.parse(body)

    // Check if email already exists in database
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    })

    if (existingUser) {
      throw new ConflictError('An account with this email already exists')
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: validated.email,
      password: validated.password,
      email_confirm: false, // Require email verification
      user_metadata: {
        firstName: validated.firstName,
        lastName: validated.lastName,
        phoneNumber: validated.phoneNumber,
      },
    })

    if (authError) {
      console.error('Supabase Auth Error:', authError)

      if (authError.message.includes('already registered')) {
        throw new ConflictError('An account with this email already exists')
      }

      throw new ServerError('Failed to create user account')
    }

    if (!authData.user) {
      throw new ServerError('Failed to create user account')
    }

    // Create user record in database
    const user = await prisma.user.create({
      data: {
        id: authData.user.id,
        email: validated.email,
        firstName: validated.firstName,
        lastName: validated.lastName,
        phoneNumber: validated.phoneNumber,
        role: 'TRAVELER',
        status: 'ACTIVE',
        emailVerified: false,
      },
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
      },
    })

    // Create empty user profile
    await prisma.userProfile.create({
      data: {
        userId: user.id,
      },
    })

    // Send verification email
    const { error: emailError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email: validated.email,
    })

    if (emailError) {
      console.error('Email verification error:', emailError)
      // Don't fail registration if email fails - user can request resend
    }

    return createdResponse({
      message: 'Registration successful! Please check your email to verify your account.',
      user,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
