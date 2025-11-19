/**
 * Bookings API Routes
 * Handles booking CRUD operations
 * Sprint 3 - Booking Flow
 * Developer: Nesiah (Backend Lead)
 */

import { NextRequest, NextResponse } from 'next/server';
import { BookingService } from '@/lib/services/booking.service';
import { BookingValidator } from '@/lib/validation/booking.validation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/bookings
 * Get user's bookings with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as any;
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    // Validate filters
    const filters = BookingValidator.validateBookingFilters({
      status,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });

    // Get bookings
    const bookings = await BookingService.getUserBookings(
      session.user.id,
      filters
    );

    return NextResponse.json({
      success: true,
      data: bookings,
      count: bookings.length,
    });
  } catch (error: any) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get bookings' },
      { status: 400 }
    );
  }
}

/**
 * POST /api/bookings
 * Create a new booking
 */
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate input
    const validatedInput = BookingValidator.validateCreateBooking({
      ...body,
      userId: session.user.id,
      bookingDate: new Date(body.bookingDate),
    });

    // Create booking
    const booking = await BookingService.createBooking(validatedInput);

    return NextResponse.json({
      success: true,
      data: booking,
      message: 'Booking created successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create booking error:', error);
    
    // Handle specific errors
    if (error.message.includes('not available')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 } // Conflict
      );
    }

    if (error.message.includes('not found')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create booking' },
      { status: 400 }
    );
  }
}

