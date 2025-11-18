/**
 * Waitlist API Route
 * POST /api/waitlist - Add email to waitlist
 * Sprint 0 - Day 1
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { waitlistSchema } from '@/lib/validations'
import {
  handleApiError,
  createdResponse,
  ConflictError,
} from '@/lib/api-errors'

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate input
    const validated = waitlistSchema.parse(body)

    // Check if email already exists
    const existing = await prisma.waitlistEntry.findUnique({
      where: { email: validated.email },
    })

    if (existing) {
      throw new ConflictError('Email already registered on waitlist')
    }

    // Create waitlist entry
    const entry = await prisma.waitlistEntry.create({
      data: {
        email: validated.email,
        firstName: validated.firstName,
        lastName: validated.lastName,
        source: validated.source || 'api',
        metadata: validated.metadata,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        source: true,
        createdAt: true,
      },
    })

    // Get waitlist position (count of entries)
    const position = await prisma.waitlistEntry.count()

    return createdResponse({
      message: 'Successfully joined the waitlist!',
      entry,
      position,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
