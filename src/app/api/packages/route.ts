/**
 * Packages API Routes
 * GET /api/packages - List packages with filters, pagination, and sorting
 * Sprint 0 - Day 1
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

    // Build orderBy clause for sorting
    let orderBy: Prisma.PackageOrderByWithRelationInput = {}

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
        },
      }),
      prisma.package.count({ where }),
    ])

    // Calculate average ratings and review counts
    const packagesWithStats = packages.map((pkg) => {
      const ratings = pkg.reviews.map((r) => r.rating)
      const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null
      const reviewCount = ratings.length

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
      }
    })

    // Return paginated response
    return successResponse(paginatedResponse(packagesWithStats, page, limit, total))
  } catch (error) {
    return handleApiError(error)
  }
}
