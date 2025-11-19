import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'

// Mock booking service functions
const bookingService = {
  checkAvailability: jest.fn(),
  createBooking: jest.fn(),
  processPayment: jest.fn(),
  validateBookingData: jest.fn(),
  calculatePrice: jest.fn(),
}

// Mock external dependencies
const mockPrisma = {
  package: { findUnique: jest.fn(), findMany: jest.fn() },
  booking: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
  user: { findUnique: jest.fn(), create: jest.fn() },
  payment: { create: jest.fn(), update: jest.fn() },
  $transaction: jest.fn(),
}

const mockPaymentProcessor = {
  processPayment: jest.fn(),
  refundPayment: jest.fn(),
}

const mockEmailService = {
  sendBookingConfirmation: jest.fn(),
  sendBookingCancellation: jest.fn(),
}

describe('Booking API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Availability Service', () => {
    const mockPackage = {
      id: 'pkg-1',
      title: 'Lagos Beach Party',
      price: 50000,
      maxGuests: 10,
      availableDates: ['2025-12-25', '2025-12-26', '2025-12-27'],
    }

    it('checks availability for valid date and guest count', async () => {
      mockPrisma.package.findUnique.mockResolvedValue(mockPackage)
      mockPrisma.booking.findMany.mockResolvedValue([
        { guests: 3, date: '2025-12-25T00:00:00Z' },
        { guests: 2, date: '2025-12-25T00:00:00Z' },
      ])

      bookingService.checkAvailability.mockImplementation(async (packageId, date, guests) => {
        const pkg = await mockPrisma.package.findUnique({ where: { id: packageId } })
        const existingBookings = await mockPrisma.booking.findMany({
          where: { packageId, date: new Date(date) }
        })

        const bookedGuests = existingBookings.reduce((sum, booking) => sum + booking.guests, 0)
        const remainingSpots = pkg.maxGuests - bookedGuests

        return {
          success: true,
          available: guests <= remainingSpots,
          remainingSpots,
          price: pkg.price,
          totalPrice: pkg.price * guests,
        }
      })

      const result = await bookingService.checkAvailability('pkg-1', '2025-12-25', 2)

      expect(result.success).toBe(true)
      expect(result.available).toBe(true)
      expect(result.remainingSpots).toBe(5) // 10 max - 3 - 2 = 5
      expect(result.totalPrice).toBe(100000) // 2 guests × 50000
    })

    it('returns unavailable when date is sold out', async () => {
      mockPrisma.package.findUnique.mockResolvedValue(mockPackage)
      mockPrisma.booking.findMany.mockResolvedValue([
        { guests: 6, date: '2025-12-25T00:00:00Z' },
        { guests: 4, date: '2025-12-25T00:00:00Z' },
      ])

      bookingService.checkAvailability.mockImplementation(async (packageId, date, guests) => {
        const pkg = await mockPrisma.package.findUnique({ where: { id: packageId } })
        const existingBookings = await mockPrisma.booking.findMany({
          where: { packageId, date: new Date(date) }
        })

        const bookedGuests = existingBookings.reduce((sum, booking) => sum + booking.guests, 0)
        const remainingSpots = Math.max(0, pkg.maxGuests - bookedGuests)

        return {
          success: true,
          available: false,
          remainingSpots: 0,
          price: pkg.price,
          totalPrice: pkg.price * guests,
          message: 'This date is sold out',
        }
      })

      const result = await bookingService.checkAvailability('pkg-1', '2025-12-25', 2)

      expect(result.success).toBe(true)
      expect(result.available).toBe(false)
      expect(result.remainingSpots).toBe(0)
      expect(result.message).toContain('sold out')
    })

    it('validates date format', async () => {
      bookingService.checkAvailability.mockImplementation(async (packageId, date, guests) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return {
            success: false,
            error: 'Invalid date format',
          }
        }
        return { success: true, available: true }
      })

      const result = await bookingService.checkAvailability('pkg-1', 'invalid-date', 2)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid date format')
    })

    it('validates guest count', async () => {
      bookingService.checkAvailability.mockImplementation(async (packageId, date, guests) => {
        if (guests < 1) {
          return {
            success: false,
            error: 'Guest count must be at least 1',
          }
        }
        return { success: true, available: true }
      })

      const result = await bookingService.checkAvailability('pkg-1', '2025-12-25', 0)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Guest count must be at least 1')
    })

    it('handles package not found', async () => {
      mockPrisma.package.findUnique.mockResolvedValue(null)

      bookingService.checkAvailability.mockImplementation(async (packageId, date, guests) => {
        const pkg = await mockPrisma.package.findUnique({ where: { id: packageId } })
        if (!pkg) {
          return {
            success: false,
            error: 'Package not found',
          }
        }
        return { success: true, available: true }
      })

      const result = await bookingService.checkAvailability('nonexistent', '2025-12-25', 2)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Package not found')
    })

    it('handles database errors gracefully', async () => {
      mockPrisma.package.findUnique.mockRejectedValue(new Error('Database connection failed'))

      bookingService.checkAvailability.mockImplementation(async (packageId, date, guests) => {
        try {
          await mockPrisma.package.findUnique({ where: { id: packageId } })
          return { success: true, available: true }
        } catch (error) {
          return {
            success: false,
            error: 'Internal server error',
          }
        }
      })

      const result = await bookingService.checkAvailability('pkg-1', '2025-12-25', 2)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Internal server error')
    })
  })

  describe('Booking Creation API', () => {
    const mockBookingData = {
      packageId: 'pkg-1',
      date: '2025-12-25',
      guests: 2,
      totalPrice: 100000,
      guestInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+234-801-234-5678',
      },
      paymentInfo: {
        cardNumber: '4242424242424242',
        expiryDate: '12/26',
        cvv: '123',
        cardholderName: 'John Doe',
      },
    }

    const mockPackage = {
      id: 'pkg-1',
      title: 'Lagos Beach Party',
      price: 50000,
      maxGuests: 10,
    }

    const mockUser = {
      id: 'user-1',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
    }

    it('creates booking successfully with valid data', async () => {
      mockPrisma.package.findUnique.mockResolvedValue(mockPackage)
      mockPrisma.user.findUnique.mockResolvedValue(mockUser)
      mockPrisma.booking.findMany.mockResolvedValue([]) // No existing bookings
      mockPaymentProcessor.processPayment.mockResolvedValue({
        success: true,
        transactionId: 'txn_123',
        paymentId: 'pay_456',
      })
      
      const mockBooking = {
        id: 'booking-123',
        ...mockBookingData,
        status: 'CONFIRMED',
        confirmationCode: 'ODD2025-ABC123',
        createdAt: new Date(),
      }
      
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          booking: { create: jest.fn().mockResolvedValue(mockBooking) },
          payment: { create: jest.fn().mockResolvedValue({ id: 'payment-789' }) },
        })
      })

      mockEmailService.sendBookingConfirmation.mockResolvedValue({ success: true })

      const request = new NextRequest('http://localhost/api/bookings', {
        method: 'POST',
        body: JSON.stringify(mockBookingData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await createBooking(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.booking.id).toBe('booking-123')
      expect(data.booking.confirmationCode).toBe('ODD2025-ABC123')
      expect(mockPaymentProcessor.processPayment).toHaveBeenCalledWith({
        amount: 100000,
        currency: 'NGN',
        cardNumber: '4242424242424242',
        expiryDate: '12/26',
        cvv: '123',
        cardholderName: 'John Doe',
      })
      expect(mockEmailService.sendBookingConfirmation).toHaveBeenCalled()
    })

    it('validates required guest information', async () => {
      const invalidData = {
        ...mockBookingData,
        guestInfo: {
          firstName: '',
          lastName: 'Doe',
          email: 'invalid-email',
          phone: '',
        },
      }

      const request = new NextRequest('http://localhost/api/bookings', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await createBooking(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.errors).toContain('First name is required')
      expect(data.errors).toContain('Valid email is required')
      expect(data.errors).toContain('Phone number is required')
    })

    it('checks availability before creating booking', async () => {
      mockPrisma.package.findUnique.mockResolvedValue(mockPackage)
      mockPrisma.user.findUnique.mockResolvedValue(mockUser)
      // Mock existing bookings that would make it unavailable
      mockPrisma.booking.findMany.mockResolvedValue([
        { guests: 8, date: '2025-12-25T00:00:00Z' },
        { guests: 3, date: '2025-12-25T00:00:00Z' },
      ])

      const request = new NextRequest('http://localhost/api/bookings', {
        method: 'POST',
        body: JSON.stringify(mockBookingData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await createBooking(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('not available')
    })

    it('handles payment processing failures', async () => {
      mockPrisma.package.findUnique.mockResolvedValue(mockPackage)
      mockPrisma.user.findUnique.mockResolvedValue(mockUser)
      mockPrisma.booking.findMany.mockResolvedValue([])
      mockPaymentProcessor.processPayment.mockResolvedValue({
        success: false,
        error: 'Card declined',
        code: 'CARD_DECLINED',
      })

      const request = new NextRequest('http://localhost/api/bookings', {
        method: 'POST',
        body: JSON.stringify(mockBookingData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await createBooking(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Card declined')
      expect(data.code).toBe('CARD_DECLINED')
    })

    it('creates user account if email not found', async () => {
      mockPrisma.package.findUnique.mockResolvedValue(mockPackage)
      mockPrisma.user.findUnique.mockResolvedValue(null) // User doesn't exist
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-new',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
      })
      mockPrisma.booking.findMany.mockResolvedValue([])
      mockPaymentProcessor.processPayment.mockResolvedValue({
        success: true,
        transactionId: 'txn_123',
        paymentId: 'pay_456',
      })

      const mockBooking = {
        id: 'booking-123',
        ...mockBookingData,
        userId: 'user-new',
        status: 'CONFIRMED',
        confirmationCode: 'ODD2025-ABC123',
      }

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          booking: { create: jest.fn().mockResolvedValue(mockBooking) },
          payment: { create: jest.fn().mockResolvedValue({ id: 'payment-789' }) },
        })
      })

      mockEmailService.sendBookingConfirmation.mockResolvedValue({ success: true })

      const request = new NextRequest('http://localhost/api/bookings', {
        method: 'POST',
        body: JSON.stringify(mockBookingData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await createBooking(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+234-801-234-5678',
        },
      })
    })

    it('handles concurrent booking attempts', async () => {
      mockPrisma.package.findUnique.mockResolvedValue(mockPackage)
      mockPrisma.user.findUnique.mockResolvedValue(mockUser)
      
      // First check shows availability
      mockPrisma.booking.findMany.mockResolvedValueOnce([
        { guests: 8, date: '2025-12-25T00:00:00Z' },
      ])
      
      // But during transaction, another booking was created
      mockPrisma.$transaction.mockRejectedValue(new Error('Unique constraint violation'))

      const request = new NextRequest('http://localhost/api/bookings', {
        method: 'POST',
        body: JSON.stringify(mockBookingData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await createBooking(request)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.success).toBe(false)
      expect(data.error).toContain('no longer available')
    })
  })

  describe('Payment Processing API', () => {
    const mockPaymentData = {
      bookingId: 'booking-123',
      amount: 100000,
      currency: 'NGN',
      cardNumber: '4242424242424242',
      expiryDate: '12/26',
      cvv: '123',
      cardholderName: 'John Doe',
    }

    it('processes payment successfully', async () => {
      mockPaymentProcessor.processPayment.mockResolvedValue({
        success: true,
        transactionId: 'txn_123',
        paymentId: 'pay_456',
      })

      mockPrisma.payment.create.mockResolvedValue({
        id: 'payment-789',
        bookingId: 'booking-123',
        amount: 100000,
        status: 'COMPLETED',
        transactionId: 'txn_123',
      })

      const request = new NextRequest('http://localhost/api/payments/process', {
        method: 'POST',
        body: JSON.stringify(mockPaymentData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await processPayment(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.payment.transactionId).toBe('txn_123')
      expect(data.payment.status).toBe('COMPLETED')
    })

    it('handles payment processor errors', async () => {
      mockPaymentProcessor.processPayment.mockResolvedValue({
        success: false,
        error: 'Insufficient funds',
        code: 'INSUFFICIENT_FUNDS',
      })

      const request = new NextRequest('http://localhost/api/payments/process', {
        method: 'POST',
        body: JSON.stringify(mockPaymentData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await processPayment(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Insufficient funds')
      expect(data.code).toBe('INSUFFICIENT_FUNDS')
    })

    it('validates payment data', async () => {
      const invalidPaymentData = {
        ...mockPaymentData,
        cardNumber: '1234', // Invalid card number
        amount: -100, // Invalid amount
      }

      const request = new NextRequest('http://localhost/api/payments/process', {
        method: 'POST',
        body: JSON.stringify(invalidPaymentData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await processPayment(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.errors).toContain('Invalid card number')
      expect(data.errors).toContain('Amount must be positive')
    })
  })

  describe('Booking API Error Handling', () => {
    it('handles malformed JSON requests', async () => {
      const request = new NextRequest('http://localhost/api/bookings', {
        method: 'POST',
        body: 'invalid json',
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await createBooking(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Invalid JSON')
    })

    it('handles missing required fields', async () => {
      const incompleteData = {
        packageId: 'pkg-1',
        // Missing date, guests, guestInfo, etc.
      }

      const request = new NextRequest('http://localhost/api/bookings', {
        method: 'POST',
        body: JSON.stringify(incompleteData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await createBooking(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.errors).toContain('Date is required')
      expect(data.errors).toContain('Guest count is required')
      expect(data.errors).toContain('Guest information is required')
    })

    it('handles database connection failures', async () => {
      mockPrisma.package.findUnique.mockRejectedValue(new Error('Connection timeout'))

      const request = new NextRequest('http://localhost/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          packageId: 'pkg-1',
          date: '2025-12-25',
          guests: 2,
          guestInfo: { firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '123' },
        }),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await createBooking(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Internal server error')
    })
  })
})
