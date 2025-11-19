/**
 * Package Detail API
 * Returns detailed package information
 * Sprint 3 - Booking Flow
 * Developer: Nesiah (Backend Lead)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cache } from '@/lib/redis';

/**
 * GET /api/packages/[id]
 * Get package details by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const packageId = params.id;

    // Check cache first
    const cacheKey = `package:${packageId}:detail`;
    const cached = await cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({
        success: true,
        data: cached,
        cached: true,
      });
    }

    // Get package from database
    const pkg = await prisma.packages.findUnique({
      where: { id: packageId },
      include: {
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            images: true,
            createdAt: true,
            users: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        _count: {
          select: {
            reviews: true,
            bookings: true,
          },
        },
      },
    });

    if (!pkg) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }

    // Calculate average rating
    const avgRating = await prisma.reviews.aggregate({
      where: { packageId },
      _avg: {
        rating: true,
      },
    });

    // Format response
    const response = {
      ...pkg,
      vendor: pkg.users,
      averageRating: avgRating._avg.rating || 0,
      totalReviews: pkg._count.reviews,
      totalBookings: pkg._count.bookings,
    };

    // Cache for 5 minutes
    await cache.set(cacheKey, response, 300);

    return NextResponse.json({
      success: true,
      data: response,
      cached: false,
    });
  } catch (error: any) {
    console.error('Get package error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get package' },
      { status: 400 }
    );
  }
}

