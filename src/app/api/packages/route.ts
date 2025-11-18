/**
 * Packages API Routes
 * GET /api/packages - List packages with filters, pagination, and sorting
 * Sprint 0 - Day 1
 * Sprint 2 - Enhanced filtering and category support
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { packageListQuerySchema } from '@/lib/validations'
import { handleApiError, successResponse, paginatedResponse } from '@/lib/api-errors'
import { Prisma } from '@prisma/client'

/**
 * GET /api/packages
 * List packages with advanced filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = request.nextUrl
    const queryParams = Object.fromEntries(searchParams.entries())

    // Validate query parameters
    const validated = packageListQuerySchema.parse(queryParams)

    // Parse pagination
    const page = parseInt(validated.page)
    const limit = parseInt(validated.limit)
    const skip = (page - 1) * limit

    // Build where clause for filtering
    const where: Prisma.PackageWhereInput = {}

    // Filter by type
    if (validated.type) {
      where.type = validated.type
    }

    // Filter by city
    if (validated.city) {
      where.city = validated.city
    }

    // Filter by status (default to PUBLISHED for public listings)
    if (validated.status) {
      where.status = validated.status
    } else {
      where.status = 'PUBLISHED'
    }

    // Filter by price range
    if (validated.minPrice || validated.maxPrice) {
      where.price = {}
      if (validated.minPrice) {
        where.price.gte = parseFloat(validated.minPrice)
      }
      if (validated.maxPrice) {
        where.price.lte = parseFloat(validated.maxPrice)
      }
    }

    // Filter by date range
    if (validated.startDate || validated.endDate) {
      where.startDate = {}
      if (validated.startDate) {
        where.startDate.gte = new Date(validated.startDate)
      }
      if (validated.endDate) {
        where.startDate.lte = new Date(validated.endDate)
      }
    }

    // Search in title and description
    if (validated.search) {
      where.OR = [
        { title: { contains: validated.search, mode: 'insensitive' } },
        { description: { contains: validated.search, mode: 'insensitive' } },
      ]
    }

    // Filter for available packages only (Sprint 2)
    if (validated.availableOnly === 'true') {
      where.AND = [
        ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []),
        {
          OR: [
            { availableSlots: { gt: 0 } },
            { startDate: { gte: new Date() } },
          ],
        },
      ]
    }

    // Filter for verified vendors only (Sprint 2)
    if (validated.verifiedOnly === 'true') {
      where.vendor = {
        verifiedAt: { not: null },
      }
    }

    // Build orderBy clause for sorting
    let orderBy: Prisma.PackageOrderByWithRelationInput = {}
    let needsManualSort = false

    switch (validated.sort) {
      case 'price_asc':
        orderBy = { price: 'asc' }
        break
      case 'price_desc':
        orderBy = { price: 'desc' }
        break
      case 'date_asc':
        orderBy = { startDate: 'asc' }
        break
      case 'date_desc':
        orderBy = { startDate: 'desc' }
        break
      case 'created_asc':
        orderBy = { createdAt: 'asc' }
        break
      case 'rating':
      case 'popularity':
        // These require manual sorting after fetching
        needsManualSort = true
        orderBy = { createdAt: 'desc' }
        break
      case 'created_desc':
      default:
        orderBy = { createdAt: 'desc' }
        break
    }

    // Fetch packages with pagination
    const [packages, total] = await prisma.$transaction([
      prisma.package.findMany({
        where,
        orderBy,
        skip,
        take: limit,
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
            },
          },
          bookings: needsManualSort
            ? {
                select: {
                  status: true,
                },
              }
            : undefined,
        },
      }),
      prisma.package.count({ where }),
    ])

    // Calculate average ratings and review counts
    let packagesWithStats = packages.map((pkg) => {
      const ratings = pkg.reviews.map((r) => r.rating)
      const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null
      const reviewCount = ratings.length

      // Calculate booking count for popularity sorting
      const bookingCount = pkg.bookings
        ? pkg.bookings.filter((b) => b.status === 'COMPLETED' || b.status === 'CONFIRMED').length
        : 0

      return {
        id: pkg.id,
        type: pkg.type,
        status: pkg.status,
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
        updatedAt: pkg.updatedAt,
        vendor: pkg.vendor,
        avgRating: avgRating ? parseFloat(avgRating.toFixed(1)) : null,
        reviewCount,
        bookingCount: needsManualSort ? bookingCount : undefined,
      }
    })

    // Apply manual sorting if needed (Sprint 2)
    if (needsManualSort) {
      if (validated.sort === 'rating') {
        packagesWithStats.sort((a, b) => {
          // Sort by rating (descending), then by review count
          if (b.avgRating !== a.avgRating) {
            return (b.avgRating || 0) - (a.avgRating || 0)
          }
          return b.reviewCount - a.reviewCount
        })
      } else if (validated.sort === 'popularity') {
        packagesWithStats.sort((a, b) => {
          // Sort by booking count, then rating
          if (b.bookingCount !== a.bookingCount) {
            return (b.bookingCount || 0) - (a.bookingCount || 0)
          }
          return (b.avgRating || 0) - (a.avgRating || 0)
        })
      }

      // Remove bookingCount from response
      packagesWithStats = packagesWithStats.map(({ bookingCount, ...pkg }) => pkg)
    }

    // Return paginated response
    return successResponse(paginatedResponse(packagesWithStats, page, limit, total))
  } catch (error) {
    return handleApiError(error)
  }
}
