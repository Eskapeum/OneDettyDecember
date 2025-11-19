/**
 * Availability Calendar API
 * Returns availability calendar for a package
 * Sprint 3 - Booking Flow
 * Developer: Nesiah (Backend Lead)
 */

import { NextRequest, NextResponse } from 'next/server';
import { AvailabilityService } from '@/lib/services/availability.service';
import { BookingValidator } from '@/lib/validation/booking.validation';
import { addDays, startOfDay } from 'date-fns';

/**
 * GET /api/availability/calendar/[packageId]
 * Get availability calendar for a package
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { packageId: string } }
) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const days = searchParams.get('days');

    // Determine date range
    let startDate: Date;
    let endDate: Date;

    if (startDateParam && endDateParam) {
      startDate = new Date(startDateParam);
      endDate = new Date(endDateParam);
    } else if (days) {
      startDate = startOfDay(new Date());
      endDate = addDays(startDate, parseInt(days));
    } else {
      // Default: next 30 days
      startDate = startOfDay(new Date());
      endDate = addDays(startDate, 30);
    }

    // Validate date range
    BookingValidator.validateDateRange({ startDate, endDate });

    // Get availability calendar
    const calendar = await AvailabilityService.getAvailabilityCalendar(
      params.packageId,
      startDate,
      endDate
    );

    return NextResponse.json({
      success: true,
      data: calendar,
    });
  } catch (error: any) {
    console.error('Get availability calendar error:', error);
    
    if (error.message.includes('not found')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to get availability calendar' },
      { status: 400 }
    );
  }
}

