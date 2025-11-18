/**
 * Logout API Endpoint
 * POST /api/auth/logout
 * Sprint 1 - User Authentication
 */

import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { handleApiError, successResponse } from '@/lib/api-errors'

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client
    const supabase = await createServerSupabaseClient()

    // Sign out from Supabase (clears cookies)
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error)
      // Don't throw error - still return success
    }

    return successResponse({
      message: 'Logged out successfully',
    })
  } catch (error) {
    return handleApiError(error)
  }
}
