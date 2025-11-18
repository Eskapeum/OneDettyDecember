// Mock implementation for search filters API route
// This will be replaced with actual implementation

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  
  // Mock response
  return NextResponse.json({
    success: true,
    filters: {
      cities: [],
      categories: [],
      priceRange: { min: 0, max: 1000000 },
      packageTypes: [
        { value: 'EVENT', label: 'Events' },
        { value: 'STAY', label: 'Stays' },
        { value: 'EXPERIENCE', label: 'Experiences' },
        { value: 'CAR_RENTAL', label: 'Car Rentals' },
      ],
    },
  })
}
