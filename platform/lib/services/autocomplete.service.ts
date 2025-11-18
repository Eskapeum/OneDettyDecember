/**
 * Autocomplete Service
 * 
 * Provides fast autocomplete suggestions for search
 * - Package titles
 * - Locations (cities)
 * - Categories
 * 
 * @author Amelia (Lead Dev)
 * @sprint Sprint 2
 */

import { prisma } from '@/lib/prisma';
import { cache } from '@/lib/redis';

export interface AutocompleteSuggestion {
  type: 'package' | 'location' | 'category';
  text: string;
  id: string;
  metadata?: {
    price?: number;
    city?: string;
    count?: number;
  };
}

export interface AutocompleteResponse {
  suggestions: AutocompleteSuggestion[];
}

export class AutocompleteService {
  private static readonly CACHE_TTL = 600; // 10 minutes
  private static readonly MIN_QUERY_LENGTH = 2;
  private static readonly DEFAULT_LIMIT = 10;

  /**
   * Get autocomplete suggestions
   */
  static async getSuggestions(
    query: string,
    limit: number = this.DEFAULT_LIMIT
  ): Promise<AutocompleteResponse> {
    // Validate query
    if (!query || query.trim().length < this.MIN_QUERY_LENGTH) {
      return { suggestions: [] };
    }

    const q = query.trim().toLowerCase();

    // Try cache first
    const cacheKey = `autocomplete:${q}:${limit}`;
    const cached = await cache.get<AutocompleteResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    // Get suggestions from different sources
    const [packageSuggestions, locationSuggestions, categorySuggestions] = await Promise.all([
      this.getPackageSuggestions(q, Math.ceil(limit * 0.5)),
      this.getLocationSuggestions(q, Math.ceil(limit * 0.3)),
      this.getCategorySuggestions(q, Math.ceil(limit * 0.2)),
    ]);

    // Combine and limit results
    const allSuggestions = [
      ...packageSuggestions,
      ...locationSuggestions,
      ...categorySuggestions,
    ].slice(0, limit);

    const response: AutocompleteResponse = {
      suggestions: allSuggestions,
    };

    // Cache the results
    await cache.set(cacheKey, response, this.CACHE_TTL);

    return response;
  }

  /**
   * Get package title suggestions
   */
  private static async getPackageSuggestions(
    query: string,
    limit: number
  ): Promise<AutocompleteSuggestion[]> {
    const packages = await prisma.packages.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        title: true,
        price: true,
        city: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return packages.map((pkg) => ({
      type: 'package' as const,
      text: pkg.title,
      id: pkg.id,
      metadata: {
        price: Number(pkg.price),
        city: pkg.city,
      },
    }));
  }

  /**
   * Get location suggestions
   */
  private static async getLocationSuggestions(
    query: string,
    limit: number
  ): Promise<AutocompleteSuggestion[]> {
    const locations = await prisma.packages.groupBy({
      by: ['city', 'location'],
      where: {
        status: 'PUBLISHED',
        OR: [
          { city: { contains: query, mode: 'insensitive' } },
          { location: { contains: query, mode: 'insensitive' } },
        ],
      },
      _count: true,
      orderBy: {
        _count: {
          city: 'desc',
        },
      },
      take: limit,
    });

    return locations.map((loc) => ({
      type: 'location' as const,
      text: `${loc.city}, ${loc.location}`,
      id: `loc_${loc.city.toLowerCase().replace(/\s+/g, '_')}`,
      metadata: {
        count: loc._count,
      },
    }));
  }

  /**
   * Get category suggestions
   */
  private static async getCategorySuggestions(
    query: string,
    limit: number
  ): Promise<AutocompleteSuggestion[]> {
    // Define available categories
    const categories = [
      { id: 'NIGHTLIFE', name: 'Nightlife & Parties' },
      { id: 'ACCOMMODATION', name: 'Accommodation' },
      { id: 'EXPERIENCE', name: 'Experiences & Tours' },
      { id: 'TRANSPORT', name: 'Transportation' },
      { id: 'FOOD', name: 'Food & Dining' },
      { id: 'WELLNESS', name: 'Wellness & Spa' },
      { id: 'ADVENTURE', name: 'Adventure & Sports' },
      { id: 'CULTURE', name: 'Culture & Arts' },
    ];

    // Filter categories matching query
    const matchingCategories = categories
      .filter((cat) => cat.name.toLowerCase().includes(query))
      .slice(0, limit);

    // Get counts for matching categories
    const categoryCounts = await Promise.all(
      matchingCategories.map(async (cat) => {
        const count = await prisma.packages.count({
          where: {
            status: 'PUBLISHED',
            type: cat.id as any,
          },
        });
        return { ...cat, count };
      })
    );

    return categoryCounts.map((cat) => ({
      type: 'category' as const,
      text: cat.name,
      id: cat.id,
      metadata: {
        count: cat.count,
      },
    }));
  }

  /**
   * Invalidate autocomplete cache
   */
  static async invalidateCache(): Promise<void> {
    await cache.delPattern('autocomplete:*');
  }
}

