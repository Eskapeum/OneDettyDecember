/**
 * Categories API
 * GET /api/categories - List package categories with counts
 * Sprint 2 - Search & Discovery
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { categoryListQuerySchema } from '@/lib/validations'
import { handleApiError, successResponse } from '@/lib/api-errors'

/**
 * GET /api/categories
 * Get all package categories with optional counts
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = request.nextUrl
    const queryParams = Object.fromEntries(searchParams.entries())

    // Validate query parameters
    const validated = categoryListQuerySchema.parse(queryParams)
    const includeCount = validated.includeCount === 'true'

    // Define category metadata
    const categoryMetadata = [
      {
        type: 'EVENT',
        name: 'Events',
        description: 'New Year parties, concerts, festivals, and nightlife experiences',
        icon: 'calendar',
        color: '#FF6B6B',
      },
      {
        type: 'STAY',
        name: 'Stays',
        description: 'Hotels, apartments, villas, and unique accommodations',
        icon: 'home',
        color: '#4ECDC4',
      },
      {
        type: 'EXPERIENCE',
        name: 'Experiences',
        description: 'Tours, activities, adventures, and cultural experiences',
        icon: 'compass',
        color: '#95E1D3',
      },
      {
        type: 'CAR_RENTAL',
        name: 'Car Rentals',
        description: 'Vehicle rentals for getting around Lagos and Accra',
        icon: 'car',
        color: '#F38181',
      },
      {
        type: 'MARKETPLACE_PRODUCT',
        name: 'Marketplace',
        description: 'Party supplies, costumes, decorations, and more',
        icon: 'shopping-bag',
        color: '#AA96DA',
      },
    ]

    // Get counts if requested
    let categories = categoryMetadata

    if (includeCount) {
      // Get counts for each category
      const counts = await prisma.package.groupBy({
        by: ['type'],
        where: {
          status: 'PUBLISHED',
        },
        _count: {
          id: true,
        },
      })

      // Create count map
      const countMap = new Map(counts.map((c) => [c.type, c._count.id]))

      // Enrich categories with counts
      categories = categoryMetadata.map((cat) => ({
        ...cat,
        count: countMap.get(cat.type as any) || 0,
      }))

      // Also get city-specific counts
      const cityCountsByType = await prisma.package.groupBy({
        by: ['type', 'city'],
        where: {
          status: 'PUBLISHED',
        },
        _count: {
          id: true,
        },
      })

      // Add city breakdown to categories
      categories = categories.map((cat) => {
        const cityCounts = cityCountsByType
          .filter((c) => c.type === cat.type)
          .reduce((acc, c) => {
            acc[c.city] = c._count.id
            return acc
          }, {} as Record<string, number>)

        return {
          ...cat,
          cityBreakdown: cityCounts,
        }
      })
    }

    // Get popular categories (top 3 by package count)
    const popularCategories = includeCount
      ? [...categories].sort((a, b) => (b as any).count - (a as any).count).slice(0, 3)
      : null

    return successResponse({
      categories,
      count: categories.length,
      popular: popularCategories,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
