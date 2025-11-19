/**
 * Availability Service
 * Handles package availability checking and calendar generation
 * Sprint 3 - Booking Flow
 */

import { prisma } from '@/lib/prisma';
import { cache } from '@/lib/redis';
import { addDays, eachDayOfInterval, format, startOfDay } from 'date-fns';

export interface AvailabilityCheck {
  packageId: string;
  date: Date;
  quantity: number;
}

export interface AvailabilityResponse {
  available: boolean;
  availableSlots: number | null;
  reason?: string;
}

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  available: boolean;
  availableSlots: number | null;
  price: number;
  isBlocked: boolean;
}

export interface AvailabilityCalendar {
  packageId: string;
  startDate: string;
  endDate: string;
  days: CalendarDay[];
}

export class AvailabilityService {
  /**
   * Check if a package is available for a specific date and quantity
   */
  static async checkAvailability(input: AvailabilityCheck): Promise<AvailabilityResponse> {
    const { packageId, date, quantity } = input;

    // Get package details
    const pkg = await prisma.packages.findUnique({
      where: { id: packageId },
    });

    if (!pkg) {
      return {
        available: false,
        availableSlots: null,
        reason: 'Package not found',
      };
    }

    // Check if package is published
    if (pkg.status !== 'PUBLISHED') {
      return {
        available: false,
        availableSlots: pkg.availableSlots,
        reason: 'Package is not available for booking',
      };
    }

    // Check date range
    if (pkg.startDate && pkg.endDate) {
      const bookingDate = startOfDay(date);
      const start = startOfDay(pkg.startDate);
      const end = startOfDay(pkg.endDate);

      if (bookingDate < start || bookingDate > end) {
        return {
          available: false,
          availableSlots: pkg.availableSlots,
          reason: 'Date is outside package availability range',
        };
      }
    }

    // Check available slots
    if (pkg.availableSlots !== null) {
      if (pkg.availableSlots < quantity) {
        return {
          available: false,
          availableSlots: pkg.availableSlots,
          reason: `Only ${pkg.availableSlots} slots available`,
        };
      }
    }

    // Check for existing bookings on this date
    const existingBookings = await prisma.bookings.aggregate({
      where: {
        packageId,
        bookingDate: {
          gte: startOfDay(date),
          lt: addDays(startOfDay(date), 1),
        },
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
      _sum: {
        quantity: true,
      },
    });

    const bookedQuantity = existingBookings._sum.quantity || 0;
    const remainingSlots = pkg.availableSlots !== null 
      ? pkg.availableSlots - bookedQuantity 
      : null;

    if (remainingSlots !== null && remainingSlots < quantity) {
      return {
        available: false,
        availableSlots: remainingSlots,
        reason: `Only ${remainingSlots} slots remaining for this date`,
      };
    }

    return {
      available: true,
      availableSlots: remainingSlots,
    };
  }

  /**
   * Get availability calendar for a package
   */
  static async getAvailabilityCalendar(
    packageId: string,
    startDate: Date,
    endDate: Date
  ): Promise<AvailabilityCalendar> {
    const cacheKey = `availability:calendar:${packageId}:${format(startDate, 'yyyy-MM-dd')}:${format(endDate, 'yyyy-MM-dd')}`;
    const cached = await cache.get<AvailabilityCalendar>(cacheKey);
    if (cached) return cached;

    // Get package details
    const pkg = await prisma.packages.findUnique({
      where: { id: packageId },
    });

    if (!pkg) {
      throw new Error('Package not found');
    }

    // Generate calendar days
    const days: CalendarDay[] = [];
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    for (const date of dateRange) {
      const availability = await this.checkAvailability({
        packageId,
        date,
        quantity: 1,
      });

      days.push({
        date: format(date, 'yyyy-MM-dd'),
        available: availability.available,
        availableSlots: availability.availableSlots,
        price: Number(pkg.price),
        isBlocked: !availability.available,
      });
    }

    const calendar: AvailabilityCalendar = {
      packageId,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      days,
    };

    // Cache for 5 minutes
    await cache.set(cacheKey, calendar, 300);

    return calendar;
  }
}
