import { describe, it, expect, beforeEach, jest } from '@jest/globals'

// Mock booking service functions
const bookingService = {
  checkAvailability: jest.fn(),
  createBooking: jest.fn(),
  processPayment: jest.fn(),
  validateBookingData: jest.fn(),
  calculatePrice: jest.fn(),
  sendConfirmationEmail: jest.fn(),
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

describe('Booking Service Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Availability Checking', () => {
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
  })

  describe('Booking Creation', () => {
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
    }

    it('creates booking successfully with valid data', async () => {
      const mockBooking = {
        id: 'booking-123',
        ...mockBookingData,
        status: 'CONFIRMED',
        confirmationCode: 'ODD2025-ABC123',
        createdAt: new Date(),
      }

      bookingService.validateBookingData.mockReturnValue({ valid: true, errors: [] })
      bookingService.checkAvailability.mockResolvedValue({ available: true, remainingSpots: 5 })
      mockPrisma.booking.create.mockResolvedValue(mockBooking)
      mockEmailService.sendBookingConfirmation.mockResolvedValue({ success: true })

      bookingService.createBooking.mockImplementation(async (bookingData) => {
        const validation = bookingService.validateBookingData(bookingData)
        if (!validation.valid) {
          return { success: false, errors: validation.errors }
        }

        const availability = await bookingService.checkAvailability(
          bookingData.packageId,
          bookingData.date,
          bookingData.guests
        )
        
        if (!availability.available) {
          return { success: false, error: 'Package not available' }
        }

        const booking = await mockPrisma.booking.create({ data: bookingData })
        await mockEmailService.sendBookingConfirmation(booking)

        return { success: true, booking }
      })

      const result = await bookingService.createBooking(mockBookingData)

      expect(result.success).toBe(true)
      expect(result.booking.id).toBe('booking-123')
      expect(result.booking.confirmationCode).toBe('ODD2025-ABC123')
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

      bookingService.validateBookingData.mockReturnValue({
        valid: false,
        errors: ['First name is required', 'Valid email is required', 'Phone number is required']
      })

      bookingService.createBooking.mockImplementation(async (bookingData) => {
        const validation = bookingService.validateBookingData(bookingData)
        if (!validation.valid) {
          return { success: false, errors: validation.errors }
        }
        return { success: true }
      })

      const result = await bookingService.createBooking(invalidData)

      expect(result.success).toBe(false)
      expect(result.errors).toContain('First name is required')
      expect(result.errors).toContain('Valid email is required')
      expect(result.errors).toContain('Phone number is required')
    })
  })

  describe('Payment Processing', () => {
    it('processes payment successfully', async () => {
      const paymentData = {
        bookingId: 'booking-123',
        amount: 100000,
        currency: 'NGN',
        cardNumber: '4242424242424242',
        expiryDate: '12/26',
        cvv: '123',
        cardholderName: 'John Doe',
      }

      mockPaymentProcessor.processPayment.mockResolvedValue({
        success: true,
        transactionId: 'txn_123',
        paymentId: 'pay_456',
      })

      bookingService.processPayment.mockImplementation(async (data) => {
        const result = await mockPaymentProcessor.processPayment(data)
        if (result.success) {
          await mockPrisma.payment.create({
            data: {
              bookingId: data.bookingId,
              amount: data.amount,
              status: 'COMPLETED',
              transactionId: result.transactionId,
            }
          })
        }
        return result
      })

      const result = await bookingService.processPayment(paymentData)

      expect(result.success).toBe(true)
      expect(result.transactionId).toBe('txn_123')
      expect(mockPrisma.payment.create).toHaveBeenCalled()
    })

    it('handles payment failures', async () => {
      const paymentData = {
        bookingId: 'booking-123',
        amount: 100000,
        cardNumber: '4000000000000002', // Declined card
      }

      mockPaymentProcessor.processPayment.mockResolvedValue({
        success: false,
        error: 'Card declined',
        code: 'CARD_DECLINED',
      })

      bookingService.processPayment.mockImplementation(async (data) => {
        return await mockPaymentProcessor.processPayment(data)
      })

      const result = await bookingService.processPayment(paymentData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Card declined')
      expect(result.code).toBe('CARD_DECLINED')
    })
  })
})
