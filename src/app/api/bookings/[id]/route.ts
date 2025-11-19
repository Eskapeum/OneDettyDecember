/**
 * Single Booking API Routes
 * GET /api/bookings/[id] - Get booking details
 * PATCH /api/bookings/[id] - Update booking (cancel, modify)
 * Sprint 3 - Booking Flow
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { bookingUpdateSchema } from '@/lib/validations'
import {
  handleApiError,
  successResponse,
  NotFoundError,
  ForbiddenError,
  ValidationError,
} from '@/lib/api-errors'
import { getCurrentUser } from '@/lib/auth-helpers'

/**
 * GET /api/bookings/[id]
 * Get detailed booking information
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get authenticated user
    const user = await getCurrentUser()

    const { id } = params

    // Fetch booking
    const booking = await prisma.booking.findUnique({
      where: { id },
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
            description: true,
            price: true,
            currency: true,
            location: true,
            city: true,
            images: true,
            capacity: true,
            availableSlots: true,
            startDate: true,
            endDate: true,
            status: true,
            vendor: {
              select: {
                id: true,
                businessName: true,
                businessType: true,
                description: true,
                logo: true,
                verifiedAt: true,
                user: {
                  select: {
                    email: true,
                    phoneNumber: true,
                  },
                },
              },
            },
          },
        },
        payment: {
          select: {
            id: true,
            status: true,
            amount: true,
            currency: true,
            paymentMethod: true,
            transactionId: true,
            createdAt: true,
          },
        },
        review: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
          },
        },
      },
    })

    if (!booking) {
      throw new NotFoundError('Booking not found')
    }

    // Check if user owns this booking or is the vendor
    const isOwner = booking.userId === user.id

    // Check if user is the vendor
    const isVendor =
      user.role === 'VENDOR' &&
      (await prisma.vendor.findFirst({
        where: {
          userId: user.id,
          id: booking.package.vendor.id,
        },
      }))

    if (!isOwner && !isVendor && user.role !== 'ADMIN') {
      throw new ForbiddenError('You do not have permission to view this booking')
    }

    return successResponse({ booking })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PATCH /api/bookings/[id]
 * Update booking (cancel, modify special requests, etc.)
 */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get authenticated user
    const user = await getCurrentUser()

    const { id } = params

    // Parse and validate request body
    const body = await request.json()
    const validated = bookingUpdateSchema.parse(body)

    // Fetch existing booking
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        packageId: true,
        status: true,
        quantity: true,
        package: {
          select: {
            id: true,
            availableSlots: true,
            vendor: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    })

    if (!existingBooking) {
      throw new NotFoundError('Booking not found')
    }

    // Check permissions
    const isOwner = existingBooking.userId === user.id
    const isVendor = user.role === 'VENDOR' && existingBooking.package.vendor.userId === user.id
    const isAdmin = user.role === 'ADMIN'

    if (!isOwner && !isVendor && !isAdmin) {
      throw new ForbiddenError('You do not have permission to update this booking')
    }

    // Validate status transitions
    if (validated.status) {
      const currentStatus = existingBooking.status

      // Users can only cancel their own pending/confirmed bookings
      if (isOwner && !isVendor && !isAdmin) {
        if (validated.status !== 'CANCELLED') {
          throw new ForbiddenError('Users can only cancel their bookings')
        }
        if (currentStatus !== 'PENDING' && currentStatus !== 'CONFIRMED') {
          throw new ValidationError('Only pending or confirmed bookings can be cancelled')
        }
      }

      // Vendors can confirm or cancel
      if (isVendor && !isAdmin) {
        if (!['CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(validated.status)) {
          throw new ForbiddenError('Vendors can only confirm, complete, or cancel bookings')
        }
      }

      // Prevent updating completed/refunded bookings
      if (currentStatus === 'COMPLETED' || currentStatus === 'REFUNDED') {
        throw new ValidationError('Cannot update completed or refunded bookings')
      }
    }

    // Handle cancellation - restore available slots
    const shouldRestoreSlots =
      validated.status === 'CANCELLED' && existingBooking.status !== 'CANCELLED'

    // Update booking in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update booking
      const updatedBooking = await tx.booking.update({
        where: { id },
        data: {
          status: validated.status,
          metadata: validated.metadata
            ? {
                ...(existingBooking.package as any).metadata,
                ...validated.metadata,
                specialRequests: validated.specialRequests,
                updatedAt: new Date().toISOString(),
              }
            : undefined,
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
              location: true,
              city: true,
              images: true,
              vendor: {
                select: {
                  businessName: true,
                },
              },
            },
          },
        },
      })

      // Restore available slots if booking was cancelled
      if (shouldRestoreSlots && existingBooking.package.availableSlots !== null) {
        await tx.package.update({
          where: { id: existingBooking.packageId },
          data: {
            availableSlots: {
              increment: existingBooking.quantity,
            },
            // Change status back to PUBLISHED if was SOLD_OUT
            status: 'PUBLISHED',
          },
        })
      }

      return updatedBooking
    })

    // TODO: Trigger cancellation email if status changed to CANCELLED
    // TODO: Trigger confirmation email if status changed to CONFIRMED

    return successResponse({
      message: 'Booking updated successfully',
      booking: result,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
