/**
 * Search Service - Optimized search algorithm with caching
 * 
 * Features:
 * - Full-text search with PostgreSQL tsvector
 * - Relevance ranking (text match 40%, popularity 30%, recency 20%, availability 10%)
 * - Redis caching with 5-minute TTL
 * - Performance target: <200ms
 * 
 * @author Amelia (Lead Dev)
 * @sprint Sprint 2
 */

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

export interface SearchFilters {
  q?: string;
  category?: string[];
  location?: string[];
  city?: string[];
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  rating?: number;
  sort?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  location: string;
  city: string;
  price: number;
  currency: string;
  type: string;
  images: string[];
  capacity: number | null;
  availableSlots: number | null;
  startDate: Date | null;
  endDate: Date | null;
  relevanceScore?: number;
  reviewCount?: number;
  rating?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    categories: Array<{ id: string; count: number }>;
    locations: Array<{ city: string; count: number }>;
    priceRange: { min: number; max: number };
  };
}

export class SearchService {
  private static readonly CACHE_TTL = 300; // 5 minutes
  private static readonly DEFAULT_LIMIT = 20;
  private static readonly MAX_LIMIT = 100;

  /**
   * Search packages with full-text search and filters
   */
  static async searchPackages(filters: SearchFilters): Promise<SearchResponse> {
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || this.DEFAULT_LIMIT, this.MAX_LIMIT);
    const skip = (page - 1) * limit;

    // Try cache first
    const cacheKey = this.getCacheKey(filters);
    const cached = await this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    // Build search query
    const whereClause = this.buildWhereClause(filters);
    const orderBy = this.buildOrderBy(filters);

    // Execute search with relevance ranking
    const [results, total, aggregations] = await Promise.all([
      this.executeSearch(whereClause, orderBy, skip, limit, filters.q),
      this.countResults(whereClause),
      this.getAggregations(whereClause),
    ]);

    const response: SearchResponse = {
      results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      filters: aggregations,
    };

    // Cache the results
    await this.setCache(cacheKey, response);

    return response;
  }

  /**
   * Build WHERE clause for search query
   */
  private static buildWhereClause(filters: SearchFilters): Prisma.packagesWhereInput {
    const where: Prisma.packagesWhereInput = {
      status: 'PUBLISHED',
    };

    // Full-text search
    if (filters.q && filters.q.trim()) {
      where.AND = [
        {
          OR: [
            { title: { contains: filters.q, mode: 'insensitive' } },
            { description: { contains: filters.q, mode: 'insensitive' } },
            { location: { contains: filters.q, mode: 'insensitive' } },
            { city: { contains: filters.q, mode: 'insensitive' } },
          ],
        },
      ];
    }

    // Category filter
    if (filters.category && filters.category.length > 0) {
      where.type = { in: filters.category as any };
    }

    // City filter
    if (filters.city && filters.city.length > 0) {
      where.city = { in: filters.city };
    }

    // Price range
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    // Date range
    if (filters.startDate || filters.endDate) {
      where.AND = where.AND || [];
      if (filters.startDate) {
        (where.AND as any[]).push({
          startDate: { gte: new Date(filters.startDate) },
        });
      }
      if (filters.endDate) {
        (where.AND as any[]).push({
          endDate: { lte: new Date(filters.endDate) },
        });
      }
    }

    return where;
  }

  /**
   * Build ORDER BY clause
   */
  private static buildOrderBy(filters: SearchFilters): Prisma.packagesOrderByWithRelationInput[] {
    switch (filters.sort) {
      case 'price_asc':
        return [{ price: 'asc' }];
      case 'price_desc':
        return [{ price: 'desc' }];
      case 'newest':
        return [{ createdAt: 'desc' }];
      case 'relevance':
      default:
        // For relevance, we'll use a combination of factors
        // This will be enhanced with the actual relevance score from full-text search
        return [{ createdAt: 'desc' }];
    }
  }

  // ... (continued in next file)
}

