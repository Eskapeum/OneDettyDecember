/**
 * Featured Packages API
 * GET /api/packages/featured - Get featured/trending packages for homepage
 * Sprint 2 - Search & Discovery
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { featuredPackagesQuerySchema } from '@/lib/validations'
import { handleApiError, successResponse } from '@/lib/api-errors'
import { Prisma } from '@prisma/client'

/**
 * GET /api/packages/featured
 * Get featured packages based on popularity, ratings, and recency
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = request.nextUrl
    const queryParams = Object.fromEntries(searchParams.entries())

    // Validate query parameters
    const validated = featuredPackagesQuerySchema.parse(queryParams)

    const limit = parseInt(validated.limit)

    // Build where clause
    const where: Prisma.PackageWhereInput = {
      status: 'PUBLISHED',
      // Only show packages with available slots or future dates
      OR: [
        { availableSlots: { gt: 0 } },
        { startDate: { gte: new Date() } },
      ],
    }

    // Filter by type
    if (validated.type) {
      where.type = validated.type
    }

    // Filter by city
    if (validated.city) {
      where.city = validated.city
    }

    // Fetch packages with reviews
    const packages = await prisma.package.findMany({
      where,
      take: limit * 3, // Fetch more than needed for scoring
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
        createdAt: true,
        updatedAt: true,
        vendor: {
          select: {
            id: true,
            businessName: true,
            businessType: true,
            logo: true,
            verifiedAt: true,
          },
        },
        reviews: {
          select: {
            rating: true,
            createdAt: true,
          },
        },
        bookings: {
          select: {
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Calculate feature score for each package
    const packagesWithScore = packages.map((pkg) => {
      let featuredScore = 0

      // Rating score (0-40 points)
      const ratings = pkg.reviews.map((r) => r.rating)
      const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0
      const reviewCount = ratings.length

      if (avgRating >= 4.5 && reviewCount >= 10) {
        featuredScore += 40
      } else if (avgRating >= 4.0 && reviewCount >= 5) {
        featuredScore += 30
      } else if (avgRating >= 3.5 && reviewCount >= 3) {
        featuredScore += 20
      }

      // Booking popularity score (0-30 points)
      const completedBookings = pkg.bookings.filter((b) => b.status === 'COMPLETED').length
      const recentBookings = pkg.bookings.filter(
        (b) => new Date(b.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length

      featuredScore += Math.min(completedBookings * 2, 20)
      featuredScore += Math.min(recentBookings * 5, 10)

      // Recency score (0-15 points)
      const daysSinceCreated = Math.floor(
        (Date.now() - new Date(pkg.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      )
      if (daysSinceCreated <= 7) {
        featuredScore += 15
      } else if (daysSinceCreated <= 30) {
        featuredScore += 10
      } else if (daysSinceCreated <= 90) {
        featuredScore += 5
      }

      // Verified vendor bonus (0-10 points)
      if (pkg.vendor.verifiedAt) {
        featuredScore += 10
      }

      // Availability score (0-5 points)
      if (pkg.availableSlots && pkg.capacity) {
        const availabilityRatio = pkg.availableSlots / pkg.capacity
        if (availabilityRatio > 0.7) {
          featuredScore += 5
        } else if (availabilityRatio > 0.3) {
          featuredScore += 3
        }
      }

      return {
        id: pkg.id,
        type: pkg.type,
        title: pkg.title,
        description: pkg.description,
        price: pkg.price,
        currency: pkg.currency,
        location: pkg.location,
        city: pkg.city,
        images: pkg.images,
        capacity: pkg.capacity,
        availableSlots: pkg.availableSlots,
        startDate: pkg.startDate,
        endDate: pkg.endDate,
        createdAt: pkg.createdAt,
        vendor: pkg.vendor,
        avgRating: avgRating ? parseFloat(avgRating.toFixed(1)) : null,
        reviewCount,
        bookingCount: pkg.bookings.length,
        featuredScore,
      }
    })

    // Sort by featured score and take top results
    packagesWithScore.sort((a, b) => b.featuredScore - a.featuredScore)
    const featuredPackages = packagesWithScore.slice(0, limit)

    return successResponse({
      packages: featuredPackages,
      count: featuredPackages.length,
      filters: {
        type: validated.type || null,
        city: validated.city || null,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
