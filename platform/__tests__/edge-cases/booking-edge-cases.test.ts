import { test, expect } from '@playwright/test'

test.describe('Booking Edge Cases and Error Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    // Mock package data
    await page.route('/api/packages/**', async (route) => {
      const url = route.request().url()
      const packageId = url.split('/').pop()
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          package: {
            id: packageId,
            title: 'Lagos Beach Party - December 2025',
            description: 'Amazing beach party experience',
            price: 50000,
            currency: 'NGN',
            type: 'EVENT',
            maxGuests: 10,
            availableDates: ['2025-12-25', '2025-12-26', '2025-12-27'],
            vendor: { businessName: 'Lagos Event Planners' },
          },
        }),
      })
    })

    await page.goto('/packages/pkg-1')
  })

  describe('Sold Out Packages', () => {
    test('handles completely sold out package', async ({ page }) => {
      // Mock all dates as sold out
      await page.route('/api/packages/*/availability**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            available: false,
            remainingSpots: 0,
            message: 'This package is completely sold out',
          }),
        })
      })

      await page.getByRole('button', { name: /book now/i }).click()

      // Should show sold out message
      await expect(page.getByTestId('sold-out-banner')).toBeVisible()
      await expect(page.getByText('This package is completely sold out')).toBeVisible()
      
      // Should suggest alternatives
      await expect(page.getByText('Similar experiences you might like:')).toBeVisible()
      await expect(page.getByTestId('alternative-packages')).toBeVisible()
      
      // Should offer waitlist option
      await expect(page.getByRole('button', { name: /join waitlist/i })).toBeVisible()
      
      // Date picker should be disabled
      await expect(page.getByTestId('date-picker')).toBeDisabled()
    })

    test('handles specific date sold out during booking process', async ({ page }) => {
      let callCount = 0
      await page.route('/api/packages/*/availability**', async (route) => {
        callCount++
        
        if (callCount === 1) {
          // First check - available
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              available: true,
              remainingSpots: 2,
              price: 50000,
              totalPrice: 100000,
            }),
          })
        } else {
          // Subsequent checks - sold out
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              available: false,
              remainingSpots: 0,
              message: 'This date just sold out',
            }),
          })
        }
      })

      await page.getByRole('button', { name: /book now/i }).click()
      
      // Select date and guests
      await page.getByTestId('date-25').click()
      await page.getByTestId('guest-selector').click()
      await page.getByText('2 guests').click()
      
      // Try to continue - should trigger availability recheck
      await page.getByRole('button', { name: /continue/i }).click()
      
      // Should show sold out error
      await expect(page.getByTestId('availability-error')).toBeVisible()
      await expect(page.getByText('This date just sold out')).toBeVisible()
      
      // Should suggest alternative dates
      await expect(page.getByText('Try these available dates:')).toBeVisible()
      await expect(page.getByTestId('alternative-dates')).toBeVisible()
      
      // Should allow user to select different date
      await page.getByTestId('date-26').click()
      await expect(page.getByRole('button', { name: /continue/i })).toBeEnabled()
    })

    test('handles last spot scenario', async ({ page }) => {
      await page.route('/api/packages/*/availability**', async (route) => {
        const url = new URL(route.request().url())
        const guests = parseInt(url.searchParams.get('guests') || '1')
        
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            available: guests === 1,
            remainingSpots: 1,
            price: 50000,
            totalPrice: 50000 * guests,
            message: guests > 1 ? 'Only 1 spot remaining' : null,
          }),
        })
      })

      await page.getByRole('button', { name: /book now/i }).click()
      await page.getByTestId('date-25').click()
      
      // Try to select 2 guests when only 1 spot available
      await page.getByTestId('guest-selector').click()
      await page.getByText('2 guests').click()
      
      // Should show availability warning
      await expect(page.getByTestId('availability-warning')).toBeVisible()
      await expect(page.getByText('Only 1 spot remaining')).toBeVisible()
      
      // Should suggest reducing guest count
      await expect(page.getByText('Reduce to 1 guest to continue')).toBeVisible()
      
      // Select 1 guest
      await page.getByTestId('guest-selector').click()
      await page.getByText('1 guest').click()
      
      // Should show urgency message
      await expect(page.getByText('Last spot available! Book now to secure your place.')).toBeVisible()
      
      // Continue button should be enabled
      await expect(page.getByRole('button', { name: /continue/i })).toBeEnabled()
    })
  })

  describe('Invalid Dates', () => {
    test('handles past date selection attempts', async ({ page }) => {
      await page.getByRole('button', { name: /book now/i }).click()
      
      // Mock current date to make December 20 a past date
      await page.addInitScript(() => {
        const mockDate = new Date('2025-12-21T10:00:00Z')
        Date.now = jest.fn(() => mockDate.getTime())
        global.Date = jest.fn(() => mockDate) as any
        global.Date.now = Date.now
      })
      
      // Past dates should be disabled
      await expect(page.getByTestId('date-20')).toBeDisabled()
      await expect(page.getByTestId('date-20')).toHaveClass(/past-date/)
      
      // Clicking past date should show error
      await page.getByTestId('date-20').click({ force: true })
      await expect(page.getByText('Cannot select past dates')).toBeVisible()
      
      // Should suggest earliest available date
      await expect(page.getByText('Earliest available: December 25, 2025')).toBeVisible()
    })

    test('handles invalid date format in URL', async ({ page }) => {
      await page.goto('/packages/pkg-1?date=invalid-date')
      await page.getByRole('button', { name: /book now/i }).click()
      
      // Should show error message
      await expect(page.getByText('Invalid date in URL. Please select a valid date.')).toBeVisible()
      
      // Date picker should be reset
      await expect(page.getByTestId('selected-date')).not.toBeVisible()
    })

    test('handles date outside available range', async ({ page }) => {
      await page.goto('/packages/pkg-1?date=2026-01-15')
      await page.getByRole('button', { name: /book now/i }).click()
      
      // Should show out of range message
      await expect(page.getByText('Selected date is not available for this package')).toBeVisible()
      
      // Should show available date range
      await expect(page.getByText('Available dates: December 25 - December 27, 2025')).toBeVisible()
    })
  })

  describe('Concurrent Bookings', () => {
    test('handles race condition during booking creation', async ({ page }) => {
      let bookingAttempts = 0
      
      await page.route('/api/bookings', async (route) => {
        bookingAttempts++
        
        if (bookingAttempts === 1) {
          // First attempt - simulate race condition
          await route.fulfill({
            status: 409,
            contentType: 'application/json',
            body: JSON.stringify({
              success: false,
              error: 'This date is no longer available. Another booking was just completed.',
              code: 'CONCURRENT_BOOKING',
            }),
          })
        } else {
          // Retry attempt - success
          await route.fulfill({
            status: 201,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              booking: {
                id: 'booking-123',
                confirmationCode: 'ODD2025-ABC123',
                status: 'CONFIRMED',
              },
            }),
          })
        }
      })

      // Complete booking flow
      await page.getByRole('button', { name: /book now/i }).click()
      await page.getByTestId('date-25').click()
      await page.getByTestId('guest-selector').click()
      await page.getByText('2 guests').click()
      await page.getByRole('button', { name: /continue/i }).click()
      
      // Fill guest information
      await page.getByLabel(/first name/i).fill('John')
      await page.getByLabel(/last name/i).fill('Doe')
      await page.getByLabel(/email/i).fill('john.doe@example.com')
      await page.getByLabel(/phone/i).fill('+234-801-234-5678')
      await page.getByRole('button', { name: /continue to payment/i }).click()
      
      // Complete payment
      await page.getByLabel(/card number/i).fill('4242424242424242')
      await page.getByLabel(/expiry date/i).fill('12/26')
      await page.getByLabel(/cvv/i).fill('123')
      await page.getByLabel(/cardholder name/i).fill('John Doe')
      await page.getByRole('button', { name: /complete booking/i }).click()
      
      // Should show race condition error first
      await expect(page.getByTestId('booking-error')).toBeVisible()
      await expect(page.getByText('Another booking was just completed')).toBeVisible()
      
      // Should offer retry option
      await expect(page.getByRole('button', { name: /try again/i })).toBeVisible()
      await page.getByRole('button', { name: /try again/i }).click()
      
      // Should eventually succeed
      await expect(page.getByRole('heading', { name: /booking confirmed/i })).toBeVisible()
      await expect(page.getByText('ODD2025-ABC123')).toBeVisible()
    })

    test('handles multiple users booking same last spots', async ({ page, context }) => {
      // Simulate multiple browser sessions
      const page2 = await context.newPage()
      
      await page.route('/api/packages/*/availability**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            available: true,
            remainingSpots: 1, // Only 1 spot left
            price: 50000,
            totalPrice: 50000,
          }),
        })
      })
      
      await page2.route('/api/packages/*/availability**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            available: true,
            remainingSpots: 1,
            price: 50000,
            totalPrice: 50000,
          }),
        })
      })

      // Both users start booking process
      await page.goto('/packages/pkg-1')
      await page2.goto('/packages/pkg-1')
      
      await page.getByRole('button', { name: /book now/i }).click()
      await page2.getByRole('button', { name: /book now/i }).click()
      
      // Both select the same date and 1 guest
      await page.getByTestId('date-25').click()
      await page2.getByTestId('date-25').click()
      
      await page.getByTestId('guest-selector').click()
      await page.getByText('1 guest').click()
      await page2.getByTestId('guest-selector').click()
      await page2.getByText('1 guest').click()
      
      // First user completes booking successfully
      await page.route('/api/bookings', async (route) => {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            booking: { id: 'booking-123', confirmationCode: 'ODD2025-ABC123' },
          }),
        })
      })
      
      // Second user gets conflict
      await page2.route('/api/bookings', async (route) => {
        await route.fulfill({
          status: 409,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: 'This date is no longer available',
            code: 'SOLD_OUT',
          }),
        })
      })
      
      // Complete both booking flows simultaneously
      await Promise.all([
        page.getByRole('button', { name: /continue/i }).click(),
        page2.getByRole('button', { name: /continue/i }).click(),
      ])
      
      // First user should succeed
      // Second user should get sold out message
      await expect(page2.getByText('This date is no longer available')).toBeVisible()
      
      await page2.close()
    })
  })

  describe('Network Failures', () => {
    test('handles network timeout during availability check', async ({ page }) => {
      await page.route('/api/packages/*/availability**', async (route) => {
        // Simulate network timeout
        await new Promise(resolve => setTimeout(resolve, 10000))
      })

      await page.getByRole('button', { name: /book now/i }).click()
      await page.getByTestId('date-25').click()
      await page.getByTestId('guest-selector').click()
      await page.getByText('2 guests').click()
      
      // Should show loading state
      await expect(page.getByTestId('availability-loading')).toBeVisible()
      
      // Should timeout and show error
      await expect(page.getByTestId('network-error')).toBeVisible({ timeout: 15000 })
      await expect(page.getByText('Network timeout. Please check your connection.')).toBeVisible()
      
      // Should offer retry
      await expect(page.getByRole('button', { name: /retry/i })).toBeVisible()
    })

    test('handles intermittent network failures', async ({ page }) => {
      let attemptCount = 0
      
      await page.route('/api/packages/*/availability**', async (route) => {
        attemptCount++
        
        if (attemptCount <= 2) {
          // First two attempts fail
          await route.abort('failed')
        } else {
          // Third attempt succeeds
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              available: true,
              remainingSpots: 5,
              price: 50000,
              totalPrice: 100000,
            }),
          })
        }
      })

      await page.getByRole('button', { name: /book now/i }).click()
      await page.getByTestId('date-25').click()
      await page.getByTestId('guest-selector').click()
      await page.getByText('2 guests').click()
      
      // Should show network error
      await expect(page.getByTestId('network-error')).toBeVisible()
      
      // Retry should eventually succeed
      await page.getByRole('button', { name: /retry/i }).click()
      await page.getByRole('button', { name: /retry/i }).click()
      
      // Should eventually show success
      await expect(page.getByRole('button', { name: /continue/i })).toBeEnabled()
    })

    test('handles payment processing network failure', async ({ page }) => {
      await page.route('/api/payments/process', async (route) => {
        await route.abort('failed')
      })

      // Complete booking flow up to payment
      await page.getByRole('button', { name: /book now/i }).click()
      await page.getByTestId('date-25').click()
      await page.getByTestId('guest-selector').click()
      await page.getByText('2 guests').click()
      await page.getByRole('button', { name: /continue/i }).click()
      
      await page.getByLabel(/first name/i).fill('John')
      await page.getByLabel(/last name/i).fill('Doe')
      await page.getByLabel(/email/i).fill('john.doe@example.com')
      await page.getByLabel(/phone/i).fill('+234-801-234-5678')
      await page.getByRole('button', { name: /continue to payment/i }).click()
      
      await page.getByLabel(/card number/i).fill('4242424242424242')
      await page.getByLabel(/expiry date/i).fill('12/26')
      await page.getByLabel(/cvv/i).fill('123')
      await page.getByLabel(/cardholder name/i).fill('John Doe')
      await page.getByRole('button', { name: /complete booking/i }).click()
      
      // Should show payment network error
      await expect(page.getByTestId('payment-error')).toBeVisible()
      await expect(page.getByText('Payment processing failed due to network error')).toBeVisible()
      
      // Should preserve booking data for retry
      await expect(page.getByText('Your booking details have been saved')).toBeVisible()
      await expect(page.getByRole('button', { name: /retry payment/i })).toBeVisible()
    })

    test('handles offline scenario', async ({ page, context }) => {
      // Simulate offline
      await context.setOffline(true)
      
      await page.getByRole('button', { name: /book now/i }).click()
      
      // Should detect offline state
      await expect(page.getByTestId('offline-banner')).toBeVisible()
      await expect(page.getByText('You are currently offline')).toBeVisible()
      
      // Booking should be disabled
      await expect(page.getByTestId('date-picker')).toBeDisabled()
      await expect(page.getByText('Booking requires internet connection')).toBeVisible()
      
      // Should offer offline mode features
      await expect(page.getByRole('button', { name: /save for later/i })).toBeVisible()
      
      // Go back online
      await context.setOffline(false)
      
      // Should detect online state
      await expect(page.getByTestId('offline-banner')).not.toBeVisible()
      await expect(page.getByTestId('date-picker')).toBeEnabled()
    })
  })

  describe('Browser and Device Edge Cases', () => {
    test('handles browser back button during booking', async ({ page }) => {
      await page.getByRole('button', { name: /book now/i }).click()
      await page.getByTestId('date-25').click()
      await page.getByTestId('guest-selector').click()
      await page.getByText('2 guests').click()
      await page.getByRole('button', { name: /continue/i }).click()
      
      // Fill some guest information
      await page.getByLabel(/first name/i).fill('John')
      await page.getByLabel(/last name/i).fill('Doe')
      
      // Use browser back button
      await page.goBack()
      
      // Should return to date selection with data preserved
      await expect(page.getByText('December 25, 2025')).toBeVisible()
      await expect(page.getByText('2 guests')).toBeVisible()
      
      // Continue again
      await page.getByRole('button', { name: /continue/i }).click()
      
      // Guest information should be preserved
      await expect(page.getByDisplayValue('John')).toBeVisible()
      await expect(page.getByDisplayValue('Doe')).toBeVisible()
    })

    test('handles page refresh during booking', async ({ page }) => {
      await page.getByRole('button', { name: /book now/i }).click()
      await page.getByTestId('date-25').click()
      await page.getByTestId('guest-selector').click()
      await page.getByText('3 guests').click()
      await page.getByRole('button', { name: /continue/i }).click()
      
      await page.getByLabel(/first name/i).fill('Jane')
      await page.getByLabel(/last name/i).fill('Smith')
      await page.getByLabel(/email/i).fill('jane.smith@example.com')
      
      // Refresh page
      await page.reload()
      
      // Should restore booking progress
      await expect(page.getByDisplayValue('Jane')).toBeVisible()
      await expect(page.getByDisplayValue('Smith')).toBeVisible()
      await expect(page.getByDisplayValue('jane.smith@example.com')).toBeVisible()
      await expect(page.getByText('December 25, 2025')).toBeVisible()
      await expect(page.getByText('3 guests')).toBeVisible()
    })

    test('handles low memory/slow device scenarios', async ({ page }) => {
      // Simulate slow device by throttling
      await page.emulateMedia({ reducedMotion: 'reduce' })
      
      await page.getByRole('button', { name: /book now/i }).click()
      
      // Should use reduced animations
      await expect(page.getByTestId('date-picker')).toHaveClass(/reduced-motion/)
      
      // Should show simplified UI for performance
      await expect(page.getByTestId('performance-mode')).toBeVisible()
      await expect(page.getByText('Simplified view for better performance')).toBeVisible()
    })
  })
})
