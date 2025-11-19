/**
 * Availability Check API
 * Checks package availability for specific dates
 * Sprint 3 - Booking Flow
 * Developer: Nesiah (Backend Lead)
 */

import { NextRequest, NextResponse } from 'next/server';
import { AvailabilityService } from '@/lib/services/availability.service';
import { BookingValidator } from '@/lib/validation/booking.validation';

/**
 * POST /api/availability/check
 * Check availability for a package on a specific date
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input
    const validatedInput = BookingValidator.validateAvailabilityCheck({
      packageId: body.packageId,
      date: new Date(body.date),
      quantity: body.quantity || 1,
    });

    // Check availability
    const availability = await AvailabilityService.checkAvailability(validatedInput);

    return NextResponse.json({
      success: true,
      data: availability,
    });
  } catch (error: any) {
    console.error('Check availability error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check availability' },
      { status: 400 }
    );
  }
}

/**
 * GET /api/availability/check
 * Check availability via query parameters (for simple checks)
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get('packageId');
    const date = searchParams.get('date');
    const quantity = searchParams.get('quantity');

    if (!packageId || !date) {
      return NextResponse.json(
        { error: 'packageId and date are required' },
        { status: 400 }
      );
    }

    // Validate input
    const validatedInput = BookingValidator.validateAvailabilityCheck({
      packageId,
      date: new Date(date),
      quantity: quantity ? parseInt(quantity) : 1,
    });

    // Check availability
    const availability = await AvailabilityService.checkAvailability(validatedInput);

    return NextResponse.json({
      success: true,
      data: availability,
    });
  } catch (error: any) {
    console.error('Check availability error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check availability' },
      { status: 400 }
    );
  }
}

