/**
 * Search Autocomplete API
 * GET /api/search/autocomplete - Get search suggestions
 * Sprint 2 - Search & Discovery
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { autocompleteQuerySchema } from '@/lib/validations'
import { handleApiError, successResponse } from '@/lib/api-errors'

/**
 * GET /api/search/autocomplete
 * Get autocomplete suggestions based on query
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = request.nextUrl
    const queryParams = Object.fromEntries(searchParams.entries())

    // Validate query parameters
    const validated = autocompleteQuerySchema.parse(queryParams)

    const searchQuery = validated.q.trim()
    const limit = parseInt(validated.limit)

    // Search in titles and locations for autocomplete
    const packages = await prisma.package.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: searchQuery, mode: 'insensitive' } },
          { location: { contains: searchQuery, mode: 'insensitive' } },
          { city: { contains: searchQuery, mode: 'insensitive' } },
        ],
      },
      take: limit,
      select: {
        id: true,
        title: true,
        type: true,
        location: true,
        city: true,
        images: true,
        price: true,
        currency: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Extract unique suggestions
    const suggestions: Array<{
      text: string
      type: 'package' | 'location' | 'city'
      packageType?: string
      image?: string
      price?: number
      currency?: string
      packageId?: string
    }> = []

    const seenTexts = new Set<string>()

    // Add package titles as suggestions
    packages.forEach((pkg) => {
      const titleLower = pkg.title.toLowerCase()
      if (!seenTexts.has(titleLower)) {
        suggestions.push({
          text: pkg.title,
          type: 'package',
          packageType: pkg.type,
          image: pkg.images?.[0] || null,
          price: pkg.price,
          currency: pkg.currency,
          packageId: pkg.id,
        })
        seenTexts.add(titleLower)
      }
    })

    // Add locations as suggestions
    packages.forEach((pkg) => {
      const locationLower = pkg.location.toLowerCase()
      if (!seenTexts.has(locationLower) && locationLower.includes(searchQuery.toLowerCase())) {
        suggestions.push({
          text: pkg.location,
          type: 'location',
        })
        seenTexts.add(locationLower)
      }
    })

    // Add cities as suggestions
    const cities = new Set<string>()
    packages.forEach((pkg) => {
      const cityLower = pkg.city.toLowerCase()
      if (!cities.has(cityLower) && cityLower.includes(searchQuery.toLowerCase())) {
        cities.add(cityLower)
        suggestions.push({
          text: pkg.city,
          type: 'city',
        })
      }
    })

    // Limit total suggestions
    const limitedSuggestions = suggestions.slice(0, limit)

    return successResponse({
      query: searchQuery,
      suggestions: limitedSuggestions,
      count: limitedSuggestions.length,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
