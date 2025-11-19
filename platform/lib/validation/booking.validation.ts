/**
 * Booking Validation Utilities
 * Validates booking inputs and business rules
 * Sprint 3 - Booking Flow
 */

import { z } from 'zod';
import { addDays, isBefore, isAfter, startOfDay } from 'date-fns';

/**
 * Guest Details Schema
 */
export const guestDetailsSchema = z.object({
  adults: z.number().min(1, 'At least 1 adult required').max(20, 'Maximum 20 adults'),
  children: z.number().min(0).max(20).optional(),
  infants: z.number().min(0).max(10).optional(),
  specialRequests: z.string().max(500, 'Special requests must be less than 500 characters').optional(),
});

/**
 * Contact Info Schema
 */
export const contactInfoSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(20),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
});

/**
 * Create Booking Schema
 */
export const createBookingSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  packageId: z.string().uuid('Invalid package ID'),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(50, 'Maximum 50 bookings'),
  bookingDate: z.date().refine(
    (date) => !isBefore(startOfDay(date), startOfDay(new Date())),
    'Booking date cannot be in the past'
  ),
  guestDetails: guestDetailsSchema.optional(),
  contactInfo: contactInfoSchema.optional(),
});

/**
 * Update Booking Schema
 */
export const updateBookingSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'REFUNDED']).optional(),
  quantity: z.number().min(1).max(50).optional(),
  bookingDate: z.date().optional(),
  metadata: z.any().optional(),
});

/**
 * Availability Check Schema
 */
export const availabilityCheckSchema = z.object({
  packageId: z.string().uuid('Invalid package ID'),
  date: z.date(),
  quantity: z.number().min(1).max(50),
});

/**
 * Date Range Schema
 */
export const dateRangeSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
}).refine(
  (data) => !isAfter(data.startDate, data.endDate),
  'Start date must be before end date'
).refine(
  (data) => !isAfter(addDays(data.startDate, 90), data.endDate),
  'Date range cannot exceed 90 days'
);

/**
 * Booking Filters Schema
 */
export const bookingFiltersSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'REFUNDED']).optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
});

/**
 * Validation helper functions
 */
export class BookingValidator {
  /**
   * Validate create booking input
   */
  static validateCreateBooking(input: unknown) {
    return createBookingSchema.parse(input);
  }

  /**
   * Validate update booking input
   */
  static validateUpdateBooking(input: unknown) {
    return updateBookingSchema.parse(input);
  }

  /**
   * Validate availability check
   */
  static validateAvailabilityCheck(input: unknown) {
    return availabilityCheckSchema.parse(input);
  }

  /**
   * Validate date range
   */
  static validateDateRange(input: unknown) {
    return dateRangeSchema.parse(input);
  }

  /**
   * Validate booking filters
   */
  static validateBookingFilters(input: unknown) {
    return bookingFiltersSchema.parse(input);
  }

  /**
   * Validate guest count
   */
  static validateGuestCount(adults: number, children?: number, infants?: number): boolean {
    const total = adults + (children || 0) + (infants || 0);
    return total >= 1 && total <= 50;
  }

  /**
   * Validate booking date
   */
  static validateBookingDate(date: Date, packageStartDate?: Date, packageEndDate?: Date): {
    valid: boolean;
    reason?: string;
  } {
    const today = startOfDay(new Date());
    const bookingDate = startOfDay(date);

    // Check if date is in the past
    if (isBefore(bookingDate, today)) {
      return {
        valid: false,
        reason: 'Booking date cannot be in the past',
      };
    }

    // Check if date is within package date range
    if (packageStartDate && packageEndDate) {
      const start = startOfDay(packageStartDate);
      const end = startOfDay(packageEndDate);

      if (isBefore(bookingDate, start) || isAfter(bookingDate, end)) {
        return {
          valid: false,
          reason: 'Booking date is outside package availability range',
        };
      }
    }

    return { valid: true };
  }

  /**
   * Validate cancellation eligibility
   */
  static validateCancellation(bookingDate: Date, cancellationPolicy?: {
    hoursBeforeBooking: number;
  }): {
    canCancel: boolean;
    reason?: string;
  } {
    const now = new Date();
    const hoursUntilBooking = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    const minHours = cancellationPolicy?.hoursBeforeBooking || 24;

    if (hoursUntilBooking < minHours) {
      return {
        canCancel: false,
        reason: `Cancellation must be made at least ${minHours} hours before booking`,
      };
    }

    return { canCancel: true };
  }
}

