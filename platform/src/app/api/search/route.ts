// Mock implementation for search API route
// This will be replaced with actual implementation

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  
  // Mock response
  return NextResponse.json({
    success: true,
    results: [],
    totalCount: 0,
    query: query || '',
    pagination: {
      currentPage: 1,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 })
}
