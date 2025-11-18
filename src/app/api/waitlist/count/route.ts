/**
 * Waitlist Count API Route
 * GET /api/waitlist/count - Get total waitlist signups
 * Sprint 0 - Day 1
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError, successResponse } from '@/lib/api-errors'

export async function GET(request: NextRequest) {
  try {
    const count = await prisma.waitlistEntry.count()

    return successResponse({
      count,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
