import { test, expect } from '@playwright/test'

test.describe('Payment Refund System Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock user authentication
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 'user-123',
        email: 'john.doe@example.com',
        role: 'customer',
      }))
    })

    // Mock booking with payment
    await page.route('/api/bookings/**', async (route) => {
      const url = route.request().url()
      const bookingId = url.split('/').pop()
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          booking: {
            id: bookingId,
            packageId: 'pkg-1',
            packageTitle: 'Lagos Beach Party',
            date: '2025-12-25',
            guests: 2,
            totalPrice: 100000,
            currency: 'NGN',
            status: 'CONFIRMED',
            confirmationCode: 'ODD2025-ABC123',
            createdAt: '2025-11-18T10:00:00Z',
            payment: {
              id: 'payment-456',
              amount: 100000,
              currency: 'NGN',
              status: 'COMPLETED',
              provider: 'stripe',
              transactionId: 'pi_test_123',
              createdAt: '2025-11-18T10:05:00Z',
            },
            guestInfo: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
            },
            refundPolicy: {
              fullRefundUntil: '2025-12-18T00:00:00Z', // 7 days before
              partialRefundUntil: '2025-12-23T00:00:00Z', // 2 days before
              partialRefundPercentage: 50,
            },
          },
        }),
      })
    })

    // Mock refund API
    await page.route('/api/payments/refund', async (route) => {
      const body = await route.request().postDataJSON()
      
      // Simulate different refund scenarios
      if (body.reason === 'test_failure') {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: 'Refund processing failed',
            code: 'refund_failed',
          }),
        })
        return
      }

      if (body.reason === 'already_refunded') {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: 'This booking has already been refunded',
            code: 'already_refunded',
          }),
        })
        return
      }

      // Calculate refund amount based on timing
      const now = new Date()
      const eventDate = new Date('2025-12-25T00:00:00Z')
      const fullRefundDate = new Date('2025-12-18T00:00:00Z')
      const partialRefundDate = new Date('2025-12-23T00:00:00Z')
      
      let refundAmount = 100000
      let refundType = 'full'
      
      if (now > fullRefundDate && now <= partialRefundDate) {
        refundAmount = 50000 // 50% refund
        refundType = 'partial'
      } else if (now > partialRefundDate) {
        refundAmount = 0
        refundType = 'none'
      }

      if (refundAmount === 0) {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: 'Refund period has expired',
            code: 'refund_expired',
          }),
        })
        return
      }

      // Successful refund
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          refund: {
            id: 'refund-789',
            bookingId: body.bookingId,
            amount: refundAmount,
            currency: 'NGN',
            type: refundType,
            reason: body.reason,
            status: 'PROCESSING',
            estimatedCompletion: '2025-11-25T10:00:00Z',
            refundMethod: 'original_payment_method',
            createdAt: new Date().toISOString(),
          },
          booking: {
            id: body.bookingId,
            status: 'CANCELLED',
            refundStatus: 'PROCESSING',
          },
        }),
      })
    })

    await page.goto('/bookings/booking-123')
  })

  describe('Refund Eligibility', () => {
    test('shows refund option for eligible bookings', async ({ page }) => {
      // Should show booking details
      await expect(page.getByText('Lagos Beach Party')).toBeVisible()
      await expect(page.getByText('ODD2025-ABC123')).toBeVisible()
      await expect(page.getByText('₦100,000')).toBeVisible()
      
      // Should show refund button
      await expect(page.getByRole('button', { name: /request refund/i })).toBeVisible()
      
      // Should show refund policy
      await expect(page.getByText('Refund Policy')).toBeVisible()
      await expect(page.getByText('Full refund until December 18')).toBeVisible()
      await expect(page.getByText('50% refund until December 23')).toBeVisible()
      await expect(page.getByText('No refund after December 23')).toBeVisible()
    })

    test('calculates correct refund amount based on timing', async ({ page }) => {
      await page.getByRole('button', { name: /request refund/i }).click()
      
      // Should show refund modal
      await expect(page.getByTestId('refund-modal')).toBeVisible()
      await expect(page.getByRole('heading', { name: /request refund/i })).toBeVisible()
      
      // Should show calculated refund amount
      await expect(page.getByText('Refund Amount: ₦100,000')).toBeVisible()
      await expect(page.getByText('Full refund (100%)')).toBeVisible()
      
      // Should show refund timeline
      await expect(page.getByText('Processing time: 5-10 business days')).toBeVisible()
      await expect(page.getByText('Refund method: Original payment method')).toBeVisible()
    })

    test('shows partial refund for late cancellations', async ({ page }) => {
      // Mock current date to be in partial refund period
      await page.addInitScript(() => {
        const mockDate = new Date('2025-12-20T10:00:00Z')
        Date.now = jest.fn(() => mockDate.getTime())
        global.Date = jest.fn(() => mockDate) as any
        global.Date.now = Date.now
      })
      
      await page.reload()
      await page.getByRole('button', { name: /request refund/i }).click()
      
      // Should show partial refund amount
      await expect(page.getByText('Refund Amount: ₦50,000')).toBeVisible()
      await expect(page.getByText('Partial refund (50%)')).toBeVisible()
      await expect(page.getByText('Late cancellation fee: ₦50,000')).toBeVisible()
    })

    test('prevents refund after deadline', async ({ page }) => {
      // Mock current date to be after refund deadline
      await page.addInitScript(() => {
        const mockDate = new Date('2025-12-24T10:00:00Z')
        Date.now = jest.fn(() => mockDate.getTime())
        global.Date = jest.fn(() => mockDate) as any
        global.Date.now = Date.now
      })
      
      await page.reload()
      
      // Refund button should be disabled
      await expect(page.getByRole('button', { name: /request refund/i })).toBeDisabled()
      
      // Should show refund expired message
      await expect(page.getByText('Refund period has expired')).toBeVisible()
      await expect(page.getByText('Refunds are not available within 2 days of the event')).toBeVisible()
    })
  })

  describe('Refund Request Process', () => {
    test('processes successful refund request', async ({ page }) => {
      await page.getByRole('button', { name: /request refund/i }).click()
      
      // Fill refund form
      await expect(page.getByLabel(/reason for refund/i)).toBeVisible()
      await page.getByLabel(/reason for refund/i).selectOption('personal_emergency')
      
      await page.getByLabel(/additional details/i).fill('Family emergency requires travel cancellation')
      
      // Confirm refund terms
      await page.getByLabel(/i understand the refund policy/i).check()
      await page.getByLabel(/i confirm this cancellation/i).check()
      
      // Submit refund request
      await page.getByRole('button', { name: /submit refund request/i }).click()
      
      // Should show processing message
      await expect(page.getByTestId('refund-processing')).toBeVisible()
      await expect(page.getByText('Processing refund request...')).toBeVisible()
      
      // Should show success confirmation
      await expect(page.getByRole('heading', { name: /refund requested/i })).toBeVisible()
      await expect(page.getByText('Refund ID: refund-789')).toBeVisible()
      await expect(page.getByText('Amount: ₦100,000')).toBeVisible()
      await expect(page.getByText('Status: Processing')).toBeVisible()
      await expect(page.getByText('Estimated completion: November 25, 2025')).toBeVisible()
      
      // Should update booking status
      await expect(page.getByText('Booking Status: Cancelled')).toBeVisible()
      await expect(page.getByText('Refund Status: Processing')).toBeVisible()
    })

    test('validates refund form inputs', async ({ page }) => {
      await page.getByRole('button', { name: /request refund/i }).click()
      
      // Try to submit without reason
      await page.getByRole('button', { name: /submit refund request/i }).click()
      
      // Should show validation errors
      await expect(page.getByText('Please select a reason for refund')).toBeVisible()
      await expect(page.getByText('Please confirm you understand the refund policy')).toBeVisible()
      
      // Fill required fields
      await page.getByLabel(/reason for refund/i).selectOption('change_of_plans')
      await page.getByLabel(/i understand the refund policy/i).check()
      
      // Should enable submit button
      await expect(page.getByRole('button', { name: /submit refund request/i })).toBeEnabled()
    })

    test('handles refund processing failures', async ({ page }) => {
      await page.getByRole('button', { name: /request refund/i }).click()
      
      // Fill form with failure trigger
      await page.getByLabel(/reason for refund/i).selectOption('test_failure')
      await page.getByLabel(/i understand the refund policy/i).check()
      await page.getByLabel(/i confirm this cancellation/i).check()
      
      await page.getByRole('button', { name: /submit refund request/i }).click()
      
      // Should show error message
      await expect(page.getByTestId('refund-error')).toBeVisible()
      await expect(page.getByText('Refund processing failed')).toBeVisible()
      
      // Should allow retry
      await expect(page.getByRole('button', { name: /try again/i })).toBeVisible()
      
      // Should show support contact
      await expect(page.getByText('Contact support if this problem persists')).toBeVisible()
      await expect(page.getByRole('link', { name: /contact support/i })).toBeVisible()
    })
  })

  describe('Refund Status Tracking', () => {
    test('displays refund status updates', async ({ page }) => {
      // Mock refund status endpoint
      await page.route('/api/refunds/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            refund: {
              id: 'refund-789',
              status: 'COMPLETED',
              amount: 100000,
              currency: 'NGN',
              completedAt: '2025-11-20T14:30:00Z',
              timeline: [
                {
                  status: 'REQUESTED',
                  timestamp: '2025-11-18T10:00:00Z',
                  description: 'Refund request submitted',
                },
                {
                  status: 'PROCESSING',
                  timestamp: '2025-11-18T10:05:00Z',
                  description: 'Refund approved and processing',
                },
                {
                  status: 'COMPLETED',
                  timestamp: '2025-11-20T14:30:00Z',
                  description: 'Refund completed to original payment method',
                },
              ],
            },
          }),
        })
      })
      
      // Navigate to refund status page
      await page.goto('/refunds/refund-789')
      
      // Should show refund details
      await expect(page.getByRole('heading', { name: /refund status/i })).toBeVisible()
      await expect(page.getByText('Refund ID: refund-789')).toBeVisible()
      await expect(page.getByText('Status: Completed')).toBeVisible()
      await expect(page.getByText('Amount: ₦100,000')).toBeVisible()
      
      // Should show timeline
      await expect(page.getByTestId('refund-timeline')).toBeVisible()
      await expect(page.getByText('Refund request submitted')).toBeVisible()
      await expect(page.getByText('Refund approved and processing')).toBeVisible()
      await expect(page.getByText('Refund completed to original payment method')).toBeVisible()
      
      // Should show completion date
      await expect(page.getByText('Completed on November 20, 2025')).toBeVisible()
    })

    test('shows pending refund status', async ({ page }) => {
      await page.route('/api/refunds/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            refund: {
              id: 'refund-789',
              status: 'PROCESSING',
              amount: 100000,
              currency: 'NGN',
              estimatedCompletion: '2025-11-25T10:00:00Z',
              timeline: [
                {
                  status: 'REQUESTED',
                  timestamp: '2025-11-18T10:00:00Z',
                  description: 'Refund request submitted',
                },
                {
                  status: 'PROCESSING',
                  timestamp: '2025-11-18T10:05:00Z',
                  description: 'Refund approved and processing',
                },
              ],
            },
          }),
        })
      })
      
      await page.goto('/refunds/refund-789')
      
      // Should show processing status
      await expect(page.getByText('Status: Processing')).toBeVisible()
      await expect(page.getByTestId('processing-indicator')).toBeVisible()
      
      // Should show estimated completion
      await expect(page.getByText('Estimated completion: November 25, 2025')).toBeVisible()
      
      // Should show progress indicator
      await expect(page.getByTestId('refund-progress')).toBeVisible()
      await expect(page.getByText('Step 2 of 3')).toBeVisible()
    })
  })

  describe('Partial Refunds', () => {
    test('handles partial refund for multi-guest bookings', async ({ page }) => {
      // Mock booking with multiple guests
      await page.route('/api/bookings/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            booking: {
              id: 'booking-123',
              guests: 4,
              totalPrice: 200000,
              currency: 'NGN',
              status: 'CONFIRMED',
              guestDetails: [
                { firstName: 'John', lastName: 'Doe' },
                { firstName: 'Jane', lastName: 'Doe' },
                { firstName: 'Bob', lastName: 'Smith' },
                { firstName: 'Alice', lastName: 'Smith' },
              ],
            },
          }),
        })
      })
      
      await page.reload()
      await page.getByRole('button', { name: /request refund/i }).click()
      
      // Should show partial refund option
      await expect(page.getByText('Partial Refund Options')).toBeVisible()
      await expect(page.getByLabel(/number of guests to cancel/i)).toBeVisible()
      
      // Select partial cancellation
      await page.getByLabel(/number of guests to cancel/i).fill('2')
      
      // Should update refund amount
      await expect(page.getByText('Refund Amount: ₦100,000')).toBeVisible()
      await expect(page.getByText('Remaining guests: 2')).toBeVisible()
      await expect(page.getByText('Remaining amount: ₦100,000')).toBeVisible()
    })
  })

  describe('Refund Notifications', () => {
    test('sends refund confirmation email', async ({ page }) => {
      // Mock email service
      await page.route('/api/emails/refund-confirmation', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, messageId: 'msg_123' }),
        })
      })
      
      await page.getByRole('button', { name: /request refund/i }).click()
      await page.getByLabel(/reason for refund/i).selectOption('personal_emergency')
      await page.getByLabel(/i understand the refund policy/i).check()
      await page.getByLabel(/i confirm this cancellation/i).check()
      await page.getByRole('button', { name: /submit refund request/i }).click()
      
      // Should show email confirmation
      await expect(page.getByText('Confirmation email sent to john.doe@example.com')).toBeVisible()
    })
  })
})
