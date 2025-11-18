/**
 * Search API Route
 * 
 * GET /api/packages/search
 * 
 * Query Parameters:
 * - q: Search query
 * - category: Category filter (array)
 * - city: City filter (array)
 * - minPrice: Minimum price
 * - maxPrice: Maximum price
 * - startDate: Start date (ISO 8601)
 * - endDate: End date (ISO 8601)
 * - rating: Minimum rating
 * - sort: Sort order (relevance, price_asc, price_desc, rating, newest)
 * - page: Page number (default: 1)
 * - limit: Results per page (default: 20, max: 100)
 * 
 * @author Amelia (Lead Dev)
 * @sprint Sprint 2
 */

import { NextRequest, NextResponse } from 'next/server';
import { SearchService, SearchFilters } from '@/lib/services/search.service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const filters: SearchFilters = {
      q: searchParams.get('q') || undefined,
      category: searchParams.getAll('category'),
      city: searchParams.getAll('city'),
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      rating: searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined,
      sort: (searchParams.get('sort') as any) || 'relevance',
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
    };

    // Validate parameters
    if (filters.page && filters.page < 1) {
      return NextResponse.json(
        { error: 'Page must be >= 1' },
        { status: 400 }
      );
    }

    if (filters.limit && (filters.limit < 1 || filters.limit > 100)) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 100' },
        { status: 400 }
      );
    }

    if (filters.minPrice && filters.maxPrice && filters.minPrice > filters.maxPrice) {
      return NextResponse.json(
        { error: 'minPrice cannot be greater than maxPrice' },
        { status: 400 }
      );
    }

    // Execute search
    const startTime = Date.now();
    const results = await SearchService.searchPackages(filters);
    const duration = Date.now() - startTime;

    // Add performance header
    const response = NextResponse.json(results);
    response.headers.set('X-Search-Duration', `${duration}ms`);
    response.headers.set('X-Cache-Status', duration < 50 ? 'HIT' : 'MISS');

    return response;
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler for CORS
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

