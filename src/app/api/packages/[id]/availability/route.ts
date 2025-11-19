/**
 * Package Availability API
 * POST /api/packages/[id]/availability - Check availability for specific date
 * Sprint 3 - Availability System
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { availabilityCheckSchema } from '@/lib/validations'
import { handleApiError, successResponse, NotFoundError } from '@/lib/api-errors'

/**
 * POST /api/packages/[id]/availability
 * Check real-time availability for a package on a specific date
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Parse and validate request body
    const body = await request.json()
    const validated = availabilityCheckSchema.parse(body)

    const requestedDate = new Date(validated.date)
    const requestedQuantity = validated.quantity

    // Fetch package details
    const packageData = await prisma.package.findUnique({
      where: { id },
      select: {
        id: true,
        type: true,
        status: true,
        title: true,
        capacity: true,
        availableSlots: true,
        startDate: true,
        endDate: true,
        bookings: {
          where: {
            status: {
              in: ['PENDING', 'CONFIRMED'],
            },
            bookingDate: requestedDate,
          },
          select: {
            quantity: true,
          },
        },
      },
    })

    if (!packageData) {
      throw new NotFoundError('Package not found')
    }

    // Check if package is available for booking
    if (packageData.status !== 'PUBLISHED') {
      return successResponse({
        available: false,
        reason: 'Package is not currently available for booking',
        package: {
          id: packageData.id,
          title: packageData.title,
          status: packageData.status,
        },
      })
    }

    // Check if date is within package date range
    if (packageData.startDate && packageData.endDate) {
      if (requestedDate < packageData.startDate || requestedDate > packageData.endDate) {
        return successResponse({
          available: false,
          reason: 'Requested date is outside package availability window',
          package: {
            id: packageData.id,
            title: packageData.title,
            availableDates: {
              start: packageData.startDate,
              end: packageData.endDate,
            },
          },
        })
      }
    }

    // Check if date is in the past
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (requestedDate < today) {
      return successResponse({
        available: false,
        reason: 'Requested date is in the past',
        package: {
          id: packageData.id,
          title: packageData.title,
        },
      })
    }

    // Calculate total booked slots for this date
    const bookedQuantity = packageData.bookings.reduce((sum, booking) => sum + booking.quantity, 0)

    // Check availability based on package type
    let availableSlots: number | null = null
    let isAvailable = false

    if (packageData.availableSlots !== null && packageData.capacity !== null) {
      // For events/experiences with capacity
      availableSlots = packageData.availableSlots
      isAvailable = availableSlots >= requestedQuantity

      return successResponse({
        available: isAvailable,
        reason: isAvailable ? null : `Only ${availableSlots} slot(s) available`,
        package: {
          id: packageData.id,
          title: packageData.title,
          type: packageData.type,
          capacity: packageData.capacity,
          availableSlots,
          bookedSlots: packageData.capacity - availableSlots,
          requestedQuantity,
        },
      })
    } else {
      // For stays, car rentals, marketplace products
      // Check for double bookings on the same date
      const hasConflict = bookedQuantity > 0

      if (hasConflict) {
        return successResponse({
          available: false,
          reason: 'Package is already booked for this date',
          package: {
            id: packageData.id,
            title: packageData.title,
            type: packageData.type,
            requestedDate,
          },
        })
      }

      return successResponse({
        available: true,
        reason: null,
        package: {
          id: packageData.id,
          title: packageData.title,
          type: packageData.type,
          requestedDate,
          requestedQuantity,
        },
      })
    }
  } catch (error) {
    return handleApiError(error)
  }
}
