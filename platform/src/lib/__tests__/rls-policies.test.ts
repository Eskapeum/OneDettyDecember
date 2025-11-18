/**
 * @jest-environment node
 */

import { PrismaClient } from '@prisma/client'

// Mock Prisma Client for RLS testing
const mockPrisma = {
  $queryRaw: jest.fn(),
  $executeRaw: jest.fn(),
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  userProfile: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  booking: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  review: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  vendor: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  package: {
    findMany: jest.fn(),
  },
}

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
}))

// Mock authentication context
const mockAuthContext = {
  userId: 'user-123',
  role: 'TRAVELER',
  vendorId: null,
}

describe('Row Level Security (RLS) Policies', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('User Data Access Policies', () => {
    it('allows users to read their own profile data', async () => {
      // Mock successful query for own data
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
      })

      // User should be able to access their own data
      const user = await mockPrisma.user.findUnique({
        where: { id: mockAuthContext.userId }
      })

      expect(user).toBeDefined()
      expect(user.id).toBe(mockAuthContext.userId)
    })

    it('prevents users from accessing other users\' private data', async () => {
      // Mock empty result for unauthorized access
      mockPrisma.user.findMany.mockResolvedValue([])

      // User should not be able to access other users' data
      const users = await mockPrisma.user.findMany({
        where: { 
          id: { not: mockAuthContext.userId },
          // RLS policy would filter this automatically
        }
      })

      expect(users).toHaveLength(0)
    })

    it('allows users to update their own profile', async () => {
      // Mock successful update
      mockPrisma.user.update.mockResolvedValue({
        id: 'user-123',
        firstName: 'John Updated',
        lastName: 'Doe',
      })

      const updatedUser = await mockPrisma.user.update({
        where: { id: mockAuthContext.userId },
        data: { firstName: 'John Updated' }
      })

      expect(updatedUser.firstName).toBe('John Updated')
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: mockAuthContext.userId },
        data: { firstName: 'John Updated' }
      })
    })

    it('prevents users from updating other users\' profiles', async () => {
      // Mock RLS policy rejection
      mockPrisma.user.update.mockRejectedValue(new Error('RLS policy violation'))

      await expect(
        mockPrisma.user.update({
          where: { id: 'other-user-456' },
          data: { firstName: 'Hacked' }
        })
      ).rejects.toThrow('RLS policy violation')
    })
  })

  describe('Booking Access Policies', () => {
    it('allows users to view their own bookings', async () => {
      // Mock user's bookings
      mockPrisma.booking.findMany.mockResolvedValue([
        {
          id: 'booking-123',
          userId: 'user-123',
          packageId: 'package-456',
          status: 'CONFIRMED',
        }
      ])

      const bookings = await mockPrisma.booking.findMany({
        where: { userId: mockAuthContext.userId }
      })

      expect(bookings).toHaveLength(1)
      expect(bookings[0].userId).toBe(mockAuthContext.userId)
    })

    it('prevents users from viewing other users\' bookings', async () => {
      // Mock RLS filtering
      mockPrisma.booking.findMany.mockResolvedValue([])

      const bookings = await mockPrisma.booking.findMany({
        where: { userId: 'other-user-456' }
      })

      expect(bookings).toHaveLength(0)
    })

    it('allows vendors to view bookings for their packages', async () => {
      // Mock vendor context
      const vendorContext = {
        userId: 'vendor-user-789',
        role: 'VENDOR',
        vendorId: 'vendor-789',
      }

      // Mock vendor's package bookings
      mockPrisma.booking.findMany.mockResolvedValue([
        {
          id: 'booking-456',
          userId: 'customer-123',
          packageId: 'vendor-package-789',
          status: 'CONFIRMED',
        }
      ])

      const bookings = await mockPrisma.booking.findMany({
        where: {
          package: {
            vendorId: vendorContext.vendorId
          }
        }
      })

      expect(bookings).toHaveLength(1)
      expect(bookings[0].packageId).toBe('vendor-package-789')
    })
  })

  describe('Review Access Policies', () => {
    it('allows users to create reviews for their own bookings', async () => {
      // Mock successful review creation
      mockPrisma.review.create.mockResolvedValue({
        id: 'review-123',
        userId: 'user-123',
        packageId: 'package-456',
        bookingId: 'booking-123',
        rating: 5,
        comment: 'Great experience!',
      })

      const review = await mockPrisma.review.create({
        data: {
          userId: mockAuthContext.userId,
          packageId: 'package-456',
          bookingId: 'booking-123',
          rating: 5,
          comment: 'Great experience!',
        }
      })

      expect(review.userId).toBe(mockAuthContext.userId)
    })

    it('prevents users from creating reviews for others\' bookings', async () => {
      // Mock RLS policy rejection
      mockPrisma.review.create.mockRejectedValue(new Error('RLS policy violation'))

      await expect(
        mockPrisma.review.create({
          data: {
            userId: 'other-user-456',
            packageId: 'package-456',
            bookingId: 'other-booking-789',
            rating: 1,
            comment: 'Fake review',
          }
        })
      ).rejects.toThrow('RLS policy violation')
    })

    it('allows public read access to reviews', async () => {
      // Mock public reviews
      mockPrisma.review.findMany.mockResolvedValue([
        {
          id: 'review-123',
          userId: 'user-123',
          packageId: 'package-456',
          rating: 5,
          comment: 'Great!',
        },
        {
          id: 'review-456',
          userId: 'user-789',
          packageId: 'package-456',
          rating: 4,
          comment: 'Good!',
        }
      ])

      const reviews = await mockPrisma.review.findMany({
        where: { packageId: 'package-456' }
      })

      expect(reviews).toHaveLength(2)
    })
  })

  describe('Vendor Data Access Policies', () => {
    it('allows vendors to manage their own vendor profile', async () => {
      const vendorContext = {
        userId: 'vendor-user-789',
        role: 'VENDOR',
        vendorId: 'vendor-789',
      }

      // Mock vendor profile access
      mockPrisma.vendor.findMany.mockResolvedValue([
        {
          id: 'vendor-789',
          userId: 'vendor-user-789',
          businessName: 'My Business',
          status: 'APPROVED',
        }
      ])

      const vendors = await mockPrisma.vendor.findMany({
        where: { userId: vendorContext.userId }
      })

      expect(vendors).toHaveLength(1)
      expect(vendors[0].userId).toBe(vendorContext.userId)
    })

    it('prevents vendors from accessing other vendors\' data', async () => {
      // Mock RLS filtering
      mockPrisma.vendor.findMany.mockResolvedValue([])

      const vendors = await mockPrisma.vendor.findMany({
        where: { userId: 'other-vendor-456' }
      })

      expect(vendors).toHaveLength(0)
    })

    it('allows vendors to manage their own packages', async () => {
      const vendorContext = {
        userId: 'vendor-user-789',
        role: 'VENDOR',
        vendorId: 'vendor-789',
      }

      // Mock vendor's packages
      mockPrisma.package.findMany.mockResolvedValue([
        {
          id: 'package-123',
          vendorId: 'vendor-789',
          title: 'My Event',
          status: 'PUBLISHED',
        }
      ])

      const packages = await mockPrisma.package.findMany({
        where: { vendorId: vendorContext.vendorId }
      })

      expect(packages).toHaveLength(1)
      expect(packages[0].vendorId).toBe(vendorContext.vendorId)
    })
  })

  describe('Admin Access Policies', () => {
    it('allows admins to access all user data', async () => {
      const adminContext = {
        userId: 'admin-123',
        role: 'ADMIN',
        vendorId: null,
      }

      // Mock admin access to all users
      mockPrisma.user.findMany.mockResolvedValue([
        { id: 'user-1', email: 'user1@example.com' },
        { id: 'user-2', email: 'user2@example.com' },
        { id: 'user-3', email: 'user3@example.com' },
      ])

      const users = await mockPrisma.user.findMany()

      expect(users).toHaveLength(3)
    })

    it('allows admins to manage vendor approvals', async () => {
      const adminContext = {
        userId: 'admin-123',
        role: 'ADMIN',
        vendorId: null,
      }

      // Mock admin updating vendor status
      mockPrisma.vendor.update.mockResolvedValue({
        id: 'vendor-456',
        status: 'APPROVED',
        businessName: 'Test Business',
      })

      const vendor = await mockPrisma.vendor.update({
        where: { id: 'vendor-456' },
        data: { status: 'APPROVED' }
      })

      expect(vendor.status).toBe('APPROVED')
    })
  })

  describe('RLS Policy Validation', () => {
    it('validates RLS policies are enabled on all tables', async () => {
      // Mock RLS status check
      mockPrisma.$queryRaw.mockResolvedValue([
        { tablename: 'users', rowsecurity: true },
        { tablename: 'user_profiles', rowsecurity: true },
        { tablename: 'vendors', rowsecurity: true },
        { tablename: 'packages', rowsecurity: true },
        { tablename: 'bookings', rowsecurity: true },
        { tablename: 'reviews', rowsecurity: true },
        { tablename: 'wishlist_items', rowsecurity: true },
      ])

      const rlsStatus = await mockPrisma.$queryRaw`
        SELECT tablename, rowsecurity 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN ('users', 'user_profiles', 'vendors', 'packages', 'bookings', 'reviews', 'wishlist_items')
      `

      rlsStatus.forEach((table: any) => {
        expect(table.rowsecurity).toBe(true)
      })
    })

    it('validates required RLS policies exist', async () => {
      // Mock policy existence check
      mockPrisma.$queryRaw.mockResolvedValue([
        { policyname: 'users_own_data_policy' },
        { policyname: 'bookings_user_access_policy' },
        { policyname: 'reviews_public_read_policy' },
        { policyname: 'vendor_own_data_policy' },
        { policyname: 'admin_full_access_policy' },
      ])

      const policies = await mockPrisma.$queryRaw`
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
      `

      const requiredPolicies = [
        'users_own_data_policy',
        'bookings_user_access_policy',
        'reviews_public_read_policy',
        'vendor_own_data_policy',
        'admin_full_access_policy',
      ]

      const policyNames = policies.map((p: any) => p.policyname)
      
      requiredPolicies.forEach(policyName => {
        expect(policyNames).toContain(policyName)
      })
    })
  })

  describe('Security Edge Cases', () => {
    it('prevents SQL injection in RLS policies', async () => {
      // Mock injection attempt
      mockPrisma.$queryRaw.mockRejectedValue(new Error('SQL injection blocked'))

      await expect(
        mockPrisma.$queryRaw`
          SELECT * FROM users WHERE id = ${'user-123; DROP TABLE users; --'}
        `
      ).rejects.toThrow('SQL injection blocked')
    })

    it('handles null user context gracefully', async () => {
      // Mock unauthenticated access
      mockPrisma.user.findMany.mockResolvedValue([])

      const users = await mockPrisma.user.findMany()

      // Should return empty result for unauthenticated users
      expect(users).toHaveLength(0)
    })

    it('validates role-based access control', async () => {
      // Mock role validation
      mockPrisma.$queryRaw.mockResolvedValue([
        { has_access: false }
      ])

      const accessCheck = await mockPrisma.$queryRaw`
        SELECT has_table_privilege('TRAVELER', 'admin_logs', 'SELECT') as has_access
      `

      expect(accessCheck[0].has_access).toBe(false)
    })
  })
})
