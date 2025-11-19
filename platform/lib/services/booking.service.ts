/**
 * Booking Service
 * Handles all booking-related business logic
 * Sprint 3 - Booking Flow
 */

import { prisma } from '@/lib/prisma';
import { cache } from '@/lib/redis';
import { BookingStatus } from '@prisma/client';
import type { Decimal } from '@prisma/client/runtime/library';

export interface CreateBookingInput {
  userId: string;
  packageId: string;
  quantity: number;
  bookingDate: Date;
  guestDetails?: {
    adults: number;
    children?: number;
    infants?: number;
    specialRequests?: string;
  };
  contactInfo?: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
  };
}

export interface BookingResponse {
  id: string;
  userId: string;
  packageId: string;
  status: BookingStatus;
  quantity: number;
  totalPrice: Decimal;
  currency: string;
  bookingDate: Date;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
  package?: {
    id: string;
    title: string;
    description: string;
    price: Decimal;
    images: string[];
    location: string;
    city: string;
  };
}

export interface UpdateBookingInput {
  status?: BookingStatus;
  quantity?: number;
  bookingDate?: Date;
  metadata?: any;
}

export class BookingService {
  /**
   * Create a new booking
   */
  static async createBooking(input: CreateBookingInput): Promise<BookingResponse> {
    // 1. Validate package exists and is available
    const pkg = await prisma.packages.findUnique({
      where: { id: input.packageId },
    });

    if (!pkg) {
      throw new Error('Package not found');
    }

    if (pkg.status !== 'PUBLISHED') {
      throw new Error('Package is not available for booking');
    }

    // 2. Check availability
    const isAvailable = await this.checkAvailability(
      input.packageId,
      input.bookingDate,
      input.quantity
    );

    if (!isAvailable) {
      throw new Error('Package is not available for the selected date');
    }

    // 3. Calculate total price
    const totalPrice = Number(pkg.price) * input.quantity;

    // 4. Create booking
    const booking = await prisma.bookings.create({
      data: {
        userId: input.userId,
        packageId: input.packageId,
        status: 'PENDING',
        quantity: input.quantity,
        totalPrice,
        currency: pkg.currency || 'USD',
        bookingDate: input.bookingDate,
        metadata: {
          guestDetails: input.guestDetails,
          contactInfo: input.contactInfo,
        },
      },
      include: {
        packages: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            images: true,
            location: true,
            city: true,
          },
        },
      },
    });

    // 5. Update available slots
    if (pkg.availableSlots !== null) {
      await prisma.packages.update({
        where: { id: input.packageId },
        data: {
          availableSlots: {
            decrement: input.quantity,
          },
        },
      });
    }

    // 6. Invalidate cache
    await cache.delPattern(`package:${input.packageId}:*`);
    await cache.delPattern(`bookings:user:${input.userId}:*`);

    return {
      ...booking,
      package: booking.packages,
    };
  }

  /**
   * Get booking by ID
   */
  static async getBooking(bookingId: string, userId?: string): Promise<BookingResponse | null> {
    const booking = await prisma.bookings.findUnique({
      where: { id: bookingId },
      include: {
        packages: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            images: true,
            location: true,
            city: true,
          },
        },
      },
    });

    if (!booking) {
      return null;
    }

    // If userId provided, verify ownership
    if (userId && booking.userId !== userId) {
      throw new Error('Unauthorized access to booking');
    }

    return {
      ...booking,
      package: booking.packages,
    };
  }

  /**
   * Get user bookings
   */
  static async getUserBookings(
    userId: string,
    filters?: {
      status?: BookingStatus;
      limit?: number;
      offset?: number;
    }
  ): Promise<BookingResponse[]> {
    const cacheKey = `bookings:user:${userId}:${JSON.stringify(filters || {})}`;
    const cached = await cache.get<BookingResponse[]>(cacheKey);
    if (cached) return cached;

    const bookings = await prisma.bookings.findMany({
      where: {
        userId,
        ...(filters?.status && { status: filters.status }),
      },
      include: {
        packages: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            images: true,
            location: true,
            city: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 50,
      skip: filters?.offset || 0,
    });

    const result = bookings.map((booking) => ({
      ...booking,
      package: booking.packages,
    }));

    await cache.set(cacheKey, result, 300); // 5 min cache
    return result;
  }

  /**
   * Update booking
   */
  static async updateBooking(
    bookingId: string,
    userId: string,
    input: UpdateBookingInput
  ): Promise<BookingResponse> {
    // Verify ownership
    const existing = await this.getBooking(bookingId, userId);
    if (!existing) {
      throw new Error('Booking not found');
    }

    const booking = await prisma.bookings.update({
      where: { id: bookingId },
      data: input,
      include: {
        packages: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            images: true,
            location: true,
            city: true,
          },
        },
      },
    });

    // Invalidate cache
    await cache.delPattern(`bookings:user:${userId}:*`);
    await cache.del(`booking:${bookingId}`);

    return {
      ...booking,
      package: booking.packages,
    };
  }

  /**
   * Cancel booking
   */
  static async cancelBooking(bookingId: string, userId: string): Promise<BookingResponse> {
    const booking = await this.updateBooking(bookingId, userId, {
      status: 'CANCELLED',
    });

    // Restore available slots
    if (booking.package) {
      await prisma.packages.update({
        where: { id: booking.packageId },
        data: {
          availableSlots: {
            increment: booking.quantity,
          },
        },
      });
    }

    return booking;
  }

  /**
   * Check availability for a package
   */
  static async checkAvailability(
    packageId: string,
    bookingDate: Date,
    quantity: number
  ): Promise<boolean> {
    const pkg = await prisma.packages.findUnique({
      where: { id: packageId },
    });

    if (!pkg) return false;

    // Check if package is published
    if (pkg.status !== 'PUBLISHED') return false;

    // Check date range
    if (pkg.startDate && pkg.endDate) {
      if (bookingDate < pkg.startDate || bookingDate > pkg.endDate) {
        return false;
      }
    }

    // Check available slots
    if (pkg.availableSlots !== null) {
      if (pkg.availableSlots < quantity) {
        return false;
      }
    }

    return true;
  }

  /**
   * Confirm booking (after payment)
   */
  static async confirmBooking(bookingId: string): Promise<BookingResponse> {
    const booking = await prisma.bookings.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' },
      include: {
        packages: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            images: true,
            location: true,
            city: true,
          },
        },
      },
    });

    // Invalidate cache
    await cache.delPattern(`bookings:user:${booking.userId}:*`);
    await cache.del(`booking:${bookingId}`);

    return {
      ...booking,
      package: booking.packages,
    };
  }
}
