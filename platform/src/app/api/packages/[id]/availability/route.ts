// Mock implementation for package availability API route
// This will be replaced with actual implementation

import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = request.nextUrl.searchParams
  const date = searchParams.get('date')
  const guests = parseInt(searchParams.get('guests') || '1')
  
  // Validation
  if (!date) {
    return NextResponse.json({
      success: false,
      error: 'Date parameter is required',
    }, { status: 400 })
  }
  
  if (guests < 1) {
    return NextResponse.json({
      success: false,
      error: 'Guest count must be at least 1',
    }, { status: 400 })
  }
  
  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(date)) {
    return NextResponse.json({
      success: false,
      error: 'Invalid date format. Use YYYY-MM-DD',
    }, { status: 400 })
  }
  
  // Check if package exists (mock)
  if (params.id === 'nonexistent') {
    return NextResponse.json({
      success: false,
      error: 'Package not found',
    }, { status: 404 })
  }
  
  // Mock availability logic
  const soldOutDates = ['2025-12-31']
  const limitedDates = {
    '2025-12-27': 2,
    '2025-12-30': 3,
  }
  
  const isDateSoldOut = soldOutDates.includes(date)
  const maxGuestsForDate = limitedDates[date] || 10
  const currentBookings = isDateSoldOut ? 10 : Math.floor(Math.random() * 5)
  const remainingSpots = Math.max(0, maxGuestsForDate - currentBookings)
  const available = !isDateSoldOut && guests <= remainingSpots
  
  let message = null
  if (isDateSoldOut) {
    message = 'This date is sold out'
  } else if (guests > remainingSpots) {
    message = `Only ${remainingSpots} spots remaining`
  }
  
  return NextResponse.json({
    success: true,
    available,
    remainingSpots,
    price: 50000,
    totalPrice: 50000 * guests,
    date,
    guests,
    message,
  })
}
