import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Validation schema for waitlist entry
const waitlistSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long').optional(),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long').optional(),
  source: z.string().max(100, 'Source too long').optional(),
  metadata: z.record(z.string(), z.any()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validationResult = waitlistSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues
        },
        { status: 400 }
      )
    }

    const { email, firstName, lastName, source, metadata } = validationResult.data

    // Check if email already exists
    const existingEntry = await prisma.waitlistEntry.findUnique({
      where: { email }
    })

    if (existingEntry) {
      return NextResponse.json(
        { error: 'Email already registered for waitlist' },
        { status: 409 }
      )
    }

    // Create waitlist entry
    const waitlistEntry = await prisma.waitlistEntry.create({
      data: {
        email,
        firstName,
        lastName,
        source,
        metadata,
      }
    })

    return NextResponse.json(
      { 
        message: 'Successfully added to waitlist',
        id: waitlistEntry.id,
        email: waitlistEntry.email
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Waitlist API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const [entries, total] = await Promise.all([
      prisma.waitlistEntry.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          source: true,
          createdAt: true,
        }
      }),
      prisma.waitlistEntry.count()
    ])

    return NextResponse.json({
      entries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Waitlist GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
