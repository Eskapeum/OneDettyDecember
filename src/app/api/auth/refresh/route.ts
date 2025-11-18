/**
 * Token Refresh Endpoint
 * POST /api/auth/refresh
 * Sprint 1 - JWT Refresh Token Logic
 */

import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import {
  handleApiError,
  successResponse,
  UnauthorizedError,
} from '@/lib/api-errors'

export async function POST(request: NextRequest) {
  try {
    // Parse request body for refresh token
    const body = await request.json()
    const { refreshToken } = body

    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token is required')
    }

    // Create Supabase client
    const supabase = await createServerSupabaseClient()

    // Refresh the session
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    })

    if (error || !data.session) {
      throw new UnauthorizedError('Invalid or expired refresh token')
    }

    return successResponse({
      message: 'Token refreshed successfully',
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in,
        expiresAt: data.session.expires_at,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
