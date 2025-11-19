/**
 * Package Detail API Route
 * GET /api/packages/[id] - Get single package details
 * Sprint 3 - Package Details & Booking
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError, successResponse, NotFoundError } from '@/lib/api-errors'

/**
 * GET /api/packages/[id]
 * Get detailed package information including vendor, reviews, and related packages
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Fetch package with all related data
    const packageData = await prisma.package.findUnique({
      where: { id },
      select: {
        id: true,
        type: true,
        status: true,
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
        metadata: true,
        createdAt: true,
        updatedAt: true,
        vendor: {
          select: {
            id: true,
            businessName: true,
            businessType: true,
            description: true,
            logo: true,
            verifiedAt: true,
            createdAt: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profile: {
                  select: {
                    avatar: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 20, // Latest 20 reviews
        },
        bookings: {
          select: {
            status: true,
          },
        },
      },
    })

    if (!packageData) {
      throw new NotFoundError('Package not found')
    }

    // Check if package is published (allow vendors to see their own drafts)
    if (packageData.status !== 'PUBLISHED') {
      // TODO: In future, check if current user is the vendor owner
      throw new NotFoundError('Package not found')
    }

    // Calculate statistics
    const ratings = packageData.reviews.map((r) => r.rating)
    const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null
    const reviewCount = ratings.length

    // Calculate rating distribution
    const ratingDistribution = {
      5: ratings.filter((r) => r === 5).length,
      4: ratings.filter((r) => r === 4).length,
      3: ratings.filter((r) => r === 3).length,
      2: ratings.filter((r) => r === 2).length,
      1: ratings.filter((r) => r === 1).length,
    }

    // Calculate booking statistics
    const totalBookings = packageData.bookings.length
    const confirmedBookings = packageData.bookings.filter(
      (b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED'
    ).length

    // Calculate availability percentage
    const availabilityPercentage =
      packageData.capacity && packageData.availableSlots
        ? Math.round((packageData.availableSlots / packageData.capacity) * 100)
        : null

    // Fetch related packages (same type and city)
    const relatedPackages = await prisma.package.findMany({
      where: {
        status: 'PUBLISHED',
        type: packageData.type,
        city: packageData.city,
        id: { not: id }, // Exclude current package
      },
      take: 4,
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
            verifiedAt: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Enrich related packages with stats
    const relatedPackagesWithStats = relatedPackages.map((pkg) => {
      const pkgRatings = pkg.reviews.map((r) => r.rating)
      const pkgAvgRating =
        pkgRatings.length > 0 ? pkgRatings.reduce((a, b) => a + b, 0) / pkgRatings.length : null

      return {
        id: pkg.id,
        type: pkg.type,
        title: pkg.title,
        price: pkg.price,
        currency: pkg.currency,
        location: pkg.location,
        city: pkg.city,
        images: pkg.images,
        startDate: pkg.startDate,
        endDate: pkg.endDate,
        vendor: pkg.vendor,
        avgRating: pkgAvgRating ? parseFloat(pkgAvgRating.toFixed(1)) : null,
        reviewCount: pkgRatings.length,
      }
    })

    // Build response
    const response = {
      package: {
        id: packageData.id,
        type: packageData.type,
        status: packageData.status,
        title: packageData.title,
        description: packageData.description,
        price: packageData.price,
        currency: packageData.currency,
        location: packageData.location,
        city: packageData.city,
        images: packageData.images,
        capacity: packageData.capacity,
        availableSlots: packageData.availableSlots,
        availabilityPercentage,
        startDate: packageData.startDate,
        endDate: packageData.endDate,
        metadata: packageData.metadata,
        createdAt: packageData.createdAt,
        updatedAt: packageData.updatedAt,
        vendor: packageData.vendor,
        stats: {
          avgRating: avgRating ? parseFloat(avgRating.toFixed(1)) : null,
          reviewCount,
          totalBookings,
          confirmedBookings,
          ratingDistribution,
        },
      },
      reviews: packageData.reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        user: {
          id: review.user.id,
          name: `${review.user.firstName} ${review.user.lastName}`,
          avatar: review.user.profile?.avatar || null,
        },
      })),
      relatedPackages: relatedPackagesWithStats,
    }

    return successResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}
