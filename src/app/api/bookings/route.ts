/**
 * Bookings API Routes
 * POST /api/bookings - Create new booking
 * GET /api/bookings - Get user's booking history
 * Sprint 3 - Booking Flow
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { bookingCreateSchema, bookingListQuerySchema } from '@/lib/validations'
import {
  handleApiError,
  successResponse,
  createdResponse,
  paginatedResponse,
  NotFoundError,
  ConflictError,
  ValidationError,
} from '@/lib/api-errors'
import { getCurrentUser } from '@/lib/auth-helpers'
import { Prisma } from '@prisma/client'

/**
 * POST /api/bookings
 * Create a new booking
 */
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getCurrentUser()

    // Parse and validate request body
    const body = await request.json()
    const validated = bookingCreateSchema.parse(body)

    // Fetch package details
    const packageData = await prisma.package.findUnique({
      where: { id: validated.packageId },
      select: {
        id: true,
        type: true,
        status: true,
        title: true,
        price: true,
        currency: true,
        capacity: true,
        availableSlots: true,
        startDate: true,
        endDate: true,
        vendorId: true,
      },
    })

    if (!packageData) {
      throw new NotFoundError('Package not found')
    }

    // Check if package is published
    if (packageData.status !== 'PUBLISHED') {
      throw new ValidationError('Package is not available for booking')
    }

    // Check if package is sold out
    if (packageData.status === 'SOLD_OUT') {
      throw new ConflictError('Package is sold out')
    }

    // Check availability for events/experiences
    if (packageData.availableSlots !== null) {
      if (packageData.availableSlots < validated.quantity) {
        throw new ConflictError(
          `Only ${packageData.availableSlots} slot(s) available. Requested: ${validated.quantity}`
        )
      }
    }

    // Check booking date is in the future
    const bookingDate = new Date(validated.bookingDate)
    if (bookingDate < new Date()) {
      throw new ValidationError('Booking date must be in the future')
    }

    // Check booking date is within package date range (if applicable)
    if (packageData.startDate && packageData.endDate) {
      if (bookingDate < packageData.startDate || bookingDate > packageData.endDate) {
        throw new ValidationError('Booking date must be within package availability dates')
      }
    }

    // Prevent users from booking their own vendor's packages
    if (packageData.vendorId) {
      const userVendor = await prisma.vendor.findUnique({
        where: { userId: user.id },
        select: { id: true },
      })

      if (userVendor && userVendor.id === packageData.vendorId) {
        throw new ValidationError('You cannot book your own packages')
      }
    }

    // Calculate total price
    const totalPrice = packageData.price.toNumber() * validated.quantity

    // Create booking and update available slots in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create booking
      const booking = await tx.booking.create({
        data: {
          userId: user.id,
          packageId: validated.packageId,
          status: 'PENDING',
          quantity: validated.quantity,
          totalPrice: totalPrice,
          currency: packageData.currency,
          bookingDate: bookingDate,
          metadata: {
            ...validated.metadata,
            specialRequests: validated.specialRequests || null,
            bookedAt: new Date().toISOString(),
          },
        },
        select: {
          id: true,
          userId: true,
          packageId: true,
          status: true,
          quantity: true,
          totalPrice: true,
          currency: true,
          bookingDate: true,
          metadata: true,
          createdAt: true,
          updatedAt: true,
          package: {
            select: {
              id: true,
              type: true,
              title: true,
              price: true,
              currency: true,
              location: true,
              city: true,
              images: true,
              startDate: true,
              endDate: true,
              vendor: {
                select: {
                  businessName: true,
                  logo: true,
                },
              },
            },
          },
        },
      })

      // Update available slots if applicable
      if (packageData.availableSlots !== null) {
        const newAvailableSlots = packageData.availableSlots - validated.quantity

        await tx.package.update({
          where: { id: validated.packageId },
          data: {
            availableSlots: newAvailableSlots,
            // Mark as sold out if no slots left
            status: newAvailableSlots <= 0 ? 'SOLD_OUT' : packageData.status,
          },
        })
      }

      return booking
    })

    // TODO: Trigger booking confirmation email (Neziah's task - Sprint 3)
    // TODO: Trigger vendor notification (Future sprint)

    return createdResponse({
      message: 'Booking created successfully',
      booking: result,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * GET /api/bookings
 * Get user's booking history with filters and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getCurrentUser()

    // Parse query parameters
    const { searchParams } = request.nextUrl
    const queryParams = Object.fromEntries(searchParams.entries())

    // Validate query parameters
    const validated = bookingListQuerySchema.parse(queryParams)

    // Parse pagination
    const page = parseInt(validated.page)
    const limit = parseInt(validated.limit)
    const skip = (page - 1) * limit

    // Build where clause
    const where: Prisma.BookingWhereInput = {
      userId: user.id,
    }

    // Filter by status
    if (validated.status) {
      where.status = validated.status
    }

    // Filter by package type
    if (validated.packageType) {
      where.package = {
        type: validated.packageType,
      }
    }

    // Filter by date range
    if (validated.startDate || validated.endDate) {
      where.bookingDate = {}
      if (validated.startDate) {
        where.bookingDate.gte = new Date(validated.startDate)
      }
      if (validated.endDate) {
        where.bookingDate.lte = new Date(validated.endDate)
      }
    }

    // Build orderBy clause
    let orderBy: Prisma.BookingOrderByWithRelationInput = {}

    switch (validated.sort) {
      case 'date_asc':
        orderBy = { bookingDate: 'asc' }
        break
      case 'date_desc':
        orderBy = { bookingDate: 'desc' }
        break
      case 'price_asc':
        orderBy = { totalPrice: 'asc' }
        break
      case 'price_desc':
        orderBy = { totalPrice: 'desc' }
        break
      case 'created_asc':
        orderBy = { createdAt: 'asc' }
        break
      case 'created_desc':
      default:
        orderBy = { createdAt: 'desc' }
        break
    }

    // Fetch bookings with pagination
    const [bookings, total] = await prisma.$transaction([
      prisma.booking.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          userId: true,
          packageId: true,
          status: true,
          quantity: true,
          totalPrice: true,
          currency: true,
          bookingDate: true,
          metadata: true,
          createdAt: true,
          updatedAt: true,
          package: {
            select: {
              id: true,
              type: true,
              title: true,
              price: true,
              currency: true,
              location: true,
              city: true,
              images: true,
              startDate: true,
              endDate: true,
              status: true,
              vendor: {
                select: {
                  businessName: true,
                  logo: true,
                  verifiedAt: true,
                },
              },
            },
          },
          payment: {
            select: {
              id: true,
              status: true,
              amount: true,
              paymentMethod: true,
            },
          },
        },
      }),
      prisma.booking.count({ where }),
    ])

    return successResponse(paginatedResponse(bookings, page, limit, total))
  } catch (error) {
    return handleApiError(error)
  }
}
