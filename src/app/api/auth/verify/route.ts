/**
 * Email Verification Endpoint
 * GET /api/auth/verify?token=...
 * Sprint 1 - Email Verification
 */

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import {
  handleApiError,
  successResponse,
  ValidationError,
} from '@/lib/api-errors'

export async function GET(request: NextRequest) {
  try {
    // Get verification token from query params
    const { searchParams } = request.nextUrl
    const token = searchParams.get('token')

    if (!token) {
      throw new ValidationError('Verification token is required')
    }

    // Verify the token with Supabase
    const { data, error } = await supabaseAdmin.auth.verifyOtp({
      token_hash: token,
      type: 'signup',
    })

    if (error || !data.user) {
      throw new ValidationError('Invalid or expired verification token')
    }

    // Update user's emailVerified status in database
    await prisma.user.update({
      where: { id: data.user.id },
      data: { emailVerified: true },
    })

    return successResponse({
      message: 'Email verified successfully! You can now log in.',
      userId: data.user.id,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
