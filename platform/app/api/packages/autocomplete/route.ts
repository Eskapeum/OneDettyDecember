/**
 * Autocomplete API Route
 * 
 * GET /api/packages/autocomplete
 * 
 * Query Parameters:
 * - q: Search query (minimum 2 characters)
 * - limit: Maximum suggestions (default: 10)
 * 
 * @author Amelia (Lead Dev)
 * @sprint Sprint 2
 */

import { NextRequest, NextResponse } from 'next/server';
import { AutocompleteService } from '@/lib/services/autocomplete.service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;

    // Validate query
    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Query must be at least 2 characters' },
        { status: 400 }
      );
    }

    // Validate limit
    if (limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 50' },
        { status: 400 }
      );
    }

    // Get suggestions
    const startTime = Date.now();
    const results = await AutocompleteService.getSuggestions(query, limit);
    const duration = Date.now() - startTime;

    // Add performance header
    const response = NextResponse.json(results);
    response.headers.set('X-Autocomplete-Duration', `${duration}ms`);
    response.headers.set('X-Cache-Status', duration < 20 ? 'HIT' : 'MISS');

    return response;
  } catch (error) {
    console.error('Autocomplete API error:', error);
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

