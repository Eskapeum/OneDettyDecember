import { test, expect } from '@playwright/test'

test.describe('Payment Edge Cases and Error Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    // Mock booking data
    await page.route('/api/bookings/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          booking: {
            id: 'booking-123',
            totalPrice: 100000,
            currency: 'NGN',
            status: 'PENDING_PAYMENT',
            expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
          },
        }),
      })
    })

    await page.goto('/booking/booking-123/payment')
  })

  describe('Network and Connectivity Issues', () => {
    test('handles payment timeout', async ({ page, context }) => {
      // Mock slow payment API
      await page.route('/api/payments/**', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 30000)) // 30 second delay
      })

      await page.getByTestId('payment-method-stripe').click()
      await page.getByLabel(/cardholder name/i).fill('John Doe')
      await page.getByRole('button', { name: /pay now/i }).click()

      // Should show timeout error
      await expect(page.getByTestId('payment-timeout')).toBeVisible({ timeout: 35000 })
      await expect(page.getByText('Payment request timed out')).toBeVisible()
      await expect(page.getByText('Please try again')).toBeVisible()
      
      // Should offer retry option
      await expect(page.getByRole('button', { name: /retry payment/i })).toBeVisible()
    })

    test('handles offline payment attempt', async ({ page, context }) => {
      // Go offline
      await context.setOffline(true)

      await page.getByTestId('payment-method-stripe').click()
      await page.getByLabel(/cardholder name/i).fill('John Doe')
      await page.getByRole('button', { name: /pay now/i }).click()

      // Should detect offline state
      await expect(page.getByTestId('offline-error')).toBeVisible()
      await expect(page.getByText('No internet connection')).toBeVisible()
      await expect(page.getByText('Please check your connection and try again')).toBeVisible()

      // Go back online
      await context.setOffline(false)

      // Should automatically retry
      await expect(page.getByText('Connection restored')).toBeVisible()
      await expect(page.getByRole('button', { name: /retry payment/i })).toBeEnabled()
    })

    test('handles intermittent network failures', async ({ page }) => {
      let attemptCount = 0
      
      await page.route('/api/payments/**', async (route) => {
        attemptCount++
        
        if (attemptCount <= 2) {
          // Fail first two attempts
          await route.abort('failed')
        } else {
          // Succeed on third attempt
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              paymentIntent: { status: 'succeeded' },
            }),
          })
        }
      })

      await page.getByTestId('payment-method-stripe').click()
      await page.getByLabel(/cardholder name/i).fill('John Doe')
      await page.getByRole('button', { name: /pay now/i }).click()

      // Should show network error
      await expect(page.getByTestId('network-error')).toBeVisible()
      
      // Retry should eventually succeed
      await page.getByRole('button', { name: /retry payment/i }).click()
      await page.getByRole('button', { name: /retry payment/i }).click()
      
      // Should eventually show success
      await expect(page.getByText('Payment successful')).toBeVisible()
    })
  })

  describe('Payment Session Expiry', () => {
    test('handles booking expiry during payment', async ({ page }) => {
      // Mock booking expiry
      await page.route('/api/bookings/**', async (route) => {
        await route.fulfill({
          status: 410,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: 'Booking has expired',
            code: 'booking_expired',
          }),
        })
      })

      await page.getByTestId('payment-method-stripe').click()
      await page.getByLabel(/cardholder name/i).fill('John Doe')
      await page.getByRole('button', { name: /pay now/i }).click()

      // Should show expiry message
      await expect(page.getByTestId('booking-expired')).toBeVisible()
      await expect(page.getByText('Your booking has expired')).toBeVisible()
      await expect(page.getByText('Please start a new booking')).toBeVisible()
      
      // Should offer to restart booking
      await expect(page.getByRole('button', { name: /start new booking/i })).toBeVisible()
    })

    test('shows countdown timer for booking expiry', async ({ page }) => {
      // Should show expiry timer
      await expect(page.getByTestId('booking-timer')).toBeVisible()
      await expect(page.getByText(/expires in/i)).toBeVisible()
      
      // Timer should count down
      const initialTime = await page.getByTestId('timer-minutes').textContent()
      await page.waitForTimeout(2000)
      const laterTime = await page.getByTestId('timer-minutes').textContent()
      
      expect(parseInt(laterTime || '0')).toBeLessThanOrEqual(parseInt(initialTime || '0'))
    })

    test('warns user when booking is about to expire', async ({ page }) => {
      // Mock booking with 2 minutes left
      await page.route('/api/bookings/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            booking: {
              id: 'booking-123',
              totalPrice: 100000,
              currency: 'NGN',
              status: 'PENDING_PAYMENT',
              expiresAt: new Date(Date.now() + 2 * 60 * 1000).toISOString(), // 2 minutes
            },
          }),
        })
      })

      await page.reload()

      // Should show warning
      await expect(page.getByTestId('expiry-warning')).toBeVisible()
      await expect(page.getByText('Your booking expires soon')).toBeVisible()
      await expect(page.getByText('Please complete payment quickly')).toBeVisible()
    })
  })

  describe('Currency and Amount Edge Cases', () => {
    test('handles very large payment amounts', async ({ page }) => {
      // Mock large amount booking
      await page.route('/api/bookings/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            booking: {
              id: 'booking-123',
              totalPrice: 50000000, // 50 million NGN
              currency: 'NGN',
              status: 'PENDING_PAYMENT',
            },
          }),
        })
      })

      await page.reload()

      // Should display large amount correctly
      await expect(page.getByText('₦50,000,000')).toBeVisible()
      
      // Should show additional verification for large amounts
      await expect(page.getByText('Large payment amount')).toBeVisible()
      await expect(page.getByText('Additional verification may be required')).toBeVisible()
    })

    test('handles zero amount edge case', async ({ page }) => {
      await page.route('/api/bookings/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            booking: {
              id: 'booking-123',
              totalPrice: 0,
              currency: 'NGN',
              status: 'PENDING_PAYMENT',
            },
          }),
        })
      })

      await page.reload()

      // Should handle zero amount
      await expect(page.getByText('₦0')).toBeVisible()
      await expect(page.getByText('No payment required')).toBeVisible()
      
      // Should skip payment and confirm booking
      await expect(page.getByRole('button', { name: /confirm booking/i })).toBeVisible()
    })

    test('handles currency conversion errors', async ({ page }) => {
      // Mock currency conversion failure
      await page.route('/api/payments/convert-currency', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: 'Currency conversion service unavailable',
          }),
        })
      })

      // Mock USD booking
      await page.route('/api/bookings/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            booking: {
              id: 'booking-123',
              totalPrice: 100,
              currency: 'USD',
              status: 'PENDING_PAYMENT',
            },
          }),
        })
      })

      await page.reload()

      // Should show conversion error
      await expect(page.getByText('Currency conversion unavailable')).toBeVisible()
      await expect(page.getByText('Please contact support')).toBeVisible()
    })
  })

  describe('Browser and Device Edge Cases', () => {
    test('handles payment in private/incognito mode', async ({ page, context }) => {
      // Simulate incognito mode restrictions
      await page.addInitScript(() => {
        // Disable localStorage
        Object.defineProperty(window, 'localStorage', {
          value: {
            getItem: () => null,
            setItem: () => { throw new Error('localStorage disabled') },
            removeItem: () => {},
            clear: () => {},
          },
        })
      })

      await page.getByTestId('payment-method-stripe').click()

      // Should show incognito warning
      await expect(page.getByText('Private browsing detected')).toBeVisible()
      await expect(page.getByText('Some features may not work properly')).toBeVisible()
    })

    test('handles payment with disabled JavaScript', async ({ page }) => {
      // Disable JavaScript
      await page.addInitScript(() => {
        window.Stripe = undefined
        window.PaystackPop = undefined
      })

      await page.reload()

      // Should show fallback payment options
      await expect(page.getByText('JavaScript is required for secure payments')).toBeVisible()
      await expect(page.getByText('Please enable JavaScript')).toBeVisible()
      
      // Should offer alternative payment methods
      await expect(page.getByText('Alternative payment options:')).toBeVisible()
      await expect(page.getByRole('link', { name: /bank transfer/i })).toBeVisible()
    })

    test('handles payment on slow device', async ({ page }) => {
      // Simulate slow device
      await page.emulateMedia({ reducedMotion: 'reduce' })
      
      // Mock slow payment processing
      await page.route('/api/payments/**', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 5000))
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        })
      })

      await page.getByTestId('payment-method-stripe').click()
      await page.getByLabel(/cardholder name/i).fill('John Doe')
      await page.getByRole('button', { name: /pay now/i }).click()

      // Should show extended loading for slow devices
      await expect(page.getByText('Processing payment...')).toBeVisible()
      await expect(page.getByText('This may take a moment on slower devices')).toBeVisible()
    })
  })

  describe('Security Edge Cases', () => {
    test('handles suspicious payment patterns', async ({ page }) => {
      // Mock security check failure
      await page.route('/api/payments/**', async (route) => {
        await route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: 'Payment blocked for security reasons',
            code: 'security_block',
          }),
        })
      })

      await page.getByTestId('payment-method-stripe').click()
      await page.getByLabel(/cardholder name/i).fill('John Doe')
      await page.getByRole('button', { name: /pay now/i }).click()

      // Should show security block message
      await expect(page.getByTestId('security-block')).toBeVisible()
      await expect(page.getByText('Payment blocked for security reasons')).toBeVisible()
      await expect(page.getByText('Please contact support')).toBeVisible()
      
      // Should provide support contact
      await expect(page.getByRole('link', { name: /contact support/i })).toBeVisible()
    })

    test('handles multiple failed payment attempts', async ({ page }) => {
      let attemptCount = 0
      
      await page.route('/api/payments/**', async (route) => {
        attemptCount++
        
        if (attemptCount >= 3) {
          await route.fulfill({
            status: 429,
            contentType: 'application/json',
            body: JSON.stringify({
              success: false,
              error: 'Too many failed attempts',
              code: 'rate_limited',
            }),
          })
        } else {
          await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
              success: false,
              error: 'Payment failed',
            }),
          })
        }
      })

      // Make multiple failed attempts
      for (let i = 0; i < 3; i++) {
        await page.getByTestId('payment-method-stripe').click()
        await page.getByLabel(/cardholder name/i).fill('John Doe')
        await page.getByRole('button', { name: /pay now/i }).click()
        
        if (i < 2) {
          await page.getByRole('button', { name: /try again/i }).click()
        }
      }

      // Should show rate limiting
      await expect(page.getByText('Too many failed attempts')).toBeVisible()
      await expect(page.getByText('Please wait before trying again')).toBeVisible()
      
      // Payment button should be disabled
      await expect(page.getByRole('button', { name: /pay now/i })).toBeDisabled()
    })
  })

  describe('Data Validation Edge Cases', () => {
    test('handles malformed payment response', async ({ page }) => {
      // Mock malformed response
      await page.route('/api/payments/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: 'invalid json response',
        })
      })

      await page.getByTestId('payment-method-stripe').click()
      await page.getByLabel(/cardholder name/i).fill('John Doe')
      await page.getByRole('button', { name: /pay now/i }).click()

      // Should handle parsing error gracefully
      await expect(page.getByText('Payment response error')).toBeVisible()
      await expect(page.getByText('Please try again')).toBeVisible()
    })

    test('handles missing payment data', async ({ page }) => {
      // Mock incomplete response
      await page.route('/api/payments/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            // Missing payment data
          }),
        })
      })

      await page.getByTestId('payment-method-stripe').click()
      await page.getByLabel(/cardholder name/i).fill('John Doe')
      await page.getByRole('button', { name: /pay now/i }).click()

      // Should handle missing data
      await expect(page.getByText('Incomplete payment response')).toBeVisible()
      await expect(page.getByText('Please contact support')).toBeVisible()
    })
  })
})
