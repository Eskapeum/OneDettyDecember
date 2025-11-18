/**
 * Search API Routes
 * GET /api/search - Full-text search with filters and ranking
 * Sprint 2 - Search & Discovery
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { searchQuerySchema } from '@/lib/validations'
import { handleApiError, successResponse, paginatedResponse } from '@/lib/api-errors'
import { Prisma } from '@prisma/client'

/**
 * GET /api/search
 * Search packages with relevance ranking
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = request.nextUrl
    const queryParams = Object.fromEntries(searchParams.entries())

    // Validate query parameters
    const validated = searchQuerySchema.parse(queryParams)

    // Parse pagination
    const page = parseInt(validated.page)
    const limit = parseInt(validated.limit)
    const skip = (page - 1) * limit

    // Search query
    const searchQuery = validated.q.trim()

    // Build where clause for filtering
    const where: Prisma.PackageWhereInput = {
      status: 'PUBLISHED', // Only search published packages
    }

    // Add type filter
    if (validated.type) {
      where.type = validated.type
    }

    // Add city filter
    if (validated.city) {
      where.city = validated.city
    }

    // Add price range filter
    if (validated.minPrice || validated.maxPrice) {
      where.price = {}
      if (validated.minPrice) {
        where.price.gte = parseFloat(validated.minPrice)
      }
      if (validated.maxPrice) {
        where.price.lte = parseFloat(validated.maxPrice)
      }
    }

    // Add date range filter
    if (validated.startDate || validated.endDate) {
      where.startDate = {}
      if (validated.startDate) {
        where.startDate.gte = new Date(validated.startDate)
      }
      if (validated.endDate) {
        where.startDate.lte = new Date(validated.endDate)
      }
    }

    // Full-text search in multiple fields with relevance ranking
    // We'll use a weighted search across title, description, and location
    where.OR = [
      { title: { contains: searchQuery, mode: 'insensitive' } },
      { description: { contains: searchQuery, mode: 'insensitive' } },
      { location: { contains: searchQuery, mode: 'insensitive' } },
      { city: { contains: searchQuery, mode: 'insensitive' } },
    ]

    // Fetch packages
    const [packages, total] = await prisma.$transaction([
      prisma.package.findMany({
        where,
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

    // Calculate relevance score and enrich with stats
    const packagesWithRelevance = packages.map((pkg) => {
      // Calculate relevance score (0-100)
      let relevanceScore = 0
      const lowerQuery = searchQuery.toLowerCase()
      const lowerTitle = pkg.title.toLowerCase()
      const lowerDesc = pkg.description.toLowerCase()
      const lowerLocation = pkg.location.toLowerCase()

      // Title match (highest weight: 50 points)
      if (lowerTitle === lowerQuery) {
        relevanceScore += 50
      } else if (lowerTitle.startsWith(lowerQuery)) {
        relevanceScore += 40
      } else if (lowerTitle.includes(lowerQuery)) {
        relevanceScore += 30
      }

      // Description match (medium weight: 20 points)
      if (lowerDesc.includes(lowerQuery)) {
        const occurrences = (lowerDesc.match(new RegExp(lowerQuery, 'g')) || []).length
        relevanceScore += Math.min(occurrences * 5, 20)
      }

      // Location match (low weight: 15 points)
      if (lowerLocation.includes(lowerQuery)) {
        relevanceScore += 15
      }

      // Boost for verified vendors (10 points)
      if (pkg.vendor.verifiedAt) {
        relevanceScore += 10
      }

      // Boost for highly rated packages (5 points)
      const ratings = pkg.reviews.map((r) => r.rating)
      const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0
      if (avgRating >= 4.5) {
        relevanceScore += 5
      }

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
        reviewCount: ratings.length,
        relevanceScore,
      }
    })

    // Sort by relevance score (descending)
    packagesWithRelevance.sort((a, b) => b.relevanceScore - a.relevanceScore)

    // Return paginated response with search metadata
    return successResponse({
      ...paginatedResponse(packagesWithRelevance, page, limit, total),
      query: searchQuery,
      filters: {
        type: validated.type || null,
        city: validated.city || null,
        priceRange: {
          min: validated.minPrice ? parseFloat(validated.minPrice) : null,
          max: validated.maxPrice ? parseFloat(validated.maxPrice) : null,
        },
        dateRange: {
          start: validated.startDate || null,
          end: validated.endDate || null,
        },
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
