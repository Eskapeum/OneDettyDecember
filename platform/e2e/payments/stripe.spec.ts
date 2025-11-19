import { test, expect } from '@playwright/test'

test.describe('Stripe Payment Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Stripe SDK
    await page.addInitScript(() => {
      window.Stripe = () => ({
        elements: () => ({
          create: () => ({
            mount: () => {},
            on: () => {},
            unmount: () => {},
          }),
          getElement: () => null,
        }),
        createPaymentMethod: () => Promise.resolve({
          paymentMethod: { id: 'pm_test_123' },
        }),
        confirmCardPayment: () => Promise.resolve({
          paymentIntent: { 
            id: 'pi_test_123',
            status: 'succeeded',
            amount: 10000,
            currency: 'usd',
          },
        }),
        createToken: () => Promise.resolve({
          token: { id: 'tok_test_123' },
        }),
      })
    })

    // Mock booking data
    await page.route('/api/bookings/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          booking: {
            id: 'booking-123',
            packageId: 'pkg-1',
            totalPrice: 100000,
            currency: 'NGN',
            status: 'PENDING_PAYMENT',
            guestInfo: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
            },
          },
        }),
      })
    })

    // Mock Stripe payment intent creation
    await page.route('/api/payments/stripe/create-intent', async (route) => {
      const body = await route.request().postDataJSON()
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          clientSecret: 'pi_test_123_secret_456',
          paymentIntentId: 'pi_test_123',
          amount: body.amount,
          currency: body.currency,
        }),
      })
    })

    // Mock Stripe payment confirmation
    await page.route('/api/payments/stripe/confirm', async (route) => {
      const body = await route.request().postDataJSON()
      
      // Simulate different payment outcomes
      if (body.paymentMethodId === 'pm_card_declined') {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: 'Your card was declined.',
            code: 'card_declined',
          }),
        })
        return
      }

      if (body.paymentMethodId === 'pm_card_insufficient_funds') {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: 'Your card has insufficient funds.',
            code: 'insufficient_funds',
          }),
        })
        return
      }

      // Successful payment
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          paymentIntent: {
            id: 'pi_test_123',
            status: 'succeeded',
            amount: 100000,
            currency: 'ngn',
            charges: {
              data: [{
                id: 'ch_test_123',
                receipt_url: 'https://pay.stripe.com/receipts/test_123',
              }],
            },
          },
          booking: {
            id: 'booking-123',
            status: 'CONFIRMED',
            confirmationCode: 'ODD2025-STR123',
          },
        }),
      })
    })

    await page.goto('/booking/booking-123/payment')
  })

  describe('Stripe Checkout Flow', () => {
    test('displays Stripe payment form', async ({ page }) => {
      // Should show payment method selector
      await expect(page.getByTestId('payment-method-selector')).toBeVisible()
      
      // Select Stripe as payment method
      await page.getByTestId('payment-method-stripe').click()
      
      // Should show Stripe payment form
      await expect(page.getByTestId('stripe-payment-form')).toBeVisible()
      await expect(page.getByText('Pay with Stripe')).toBeVisible()
      
      // Should show Stripe Elements
      await expect(page.getByTestId('stripe-card-element')).toBeVisible()
      await expect(page.getByText('Card number')).toBeVisible()
      await expect(page.getByText('MM / YY')).toBeVisible()
      await expect(page.getByText('CVC')).toBeVisible()
      
      // Should show payment amount
      await expect(page.getByText('₦100,000')).toBeVisible()
      
      // Should show accepted cards
      await expect(page.getByTestId('accepted-cards')).toBeVisible()
      await expect(page.getByAltText('Visa')).toBeVisible()
      await expect(page.getByAltText('Mastercard')).toBeVisible()
    })

    test('processes successful Stripe payment', async ({ page }) => {
      // Select Stripe payment
      await page.getByTestId('payment-method-stripe').click()
      
      // Fill payment form (simulated)
      await page.getByTestId('stripe-card-element').click()
      
      // Simulate card input
      await page.evaluate(() => {
        const cardElement = document.querySelector('[data-testid="stripe-card-element"]')
        if (cardElement) {
          cardElement.dispatchEvent(new CustomEvent('change', {
            detail: { complete: true, error: null }
          }))
        }
      })
      
      // Fill billing details
      await page.getByLabel(/cardholder name/i).fill('John Doe')
      await page.getByLabel(/email/i).fill('john.doe@example.com')
      
      // Submit payment
      await page.getByRole('button', { name: /pay now/i }).click()
      
      // Should show processing state
      await expect(page.getByTestId('payment-processing')).toBeVisible()
      await expect(page.getByText('Processing payment...')).toBeVisible()
      
      // Should redirect to success page
      await expect(page).toHaveURL(/\/payments\/.*\/success/)
      
      // Should show success message
      await expect(page.getByRole('heading', { name: /payment successful/i })).toBeVisible()
      await expect(page.getByText('ODD2025-STR123')).toBeVisible()
      
      // Should show receipt link
      await expect(page.getByRole('link', { name: /view receipt/i })).toBeVisible()
      
      // Should show booking confirmation
      await expect(page.getByText('Your booking is confirmed')).toBeVisible()
    })

    test('handles Stripe payment failures', async ({ page }) => {
      // Mock declined card
      await page.evaluate(() => {
        window.mockPaymentMethodId = 'pm_card_declined'
      })
      
      await page.getByTestId('payment-method-stripe').click()
      await page.getByTestId('stripe-card-element').click()
      
      // Simulate declined card
      await page.evaluate(() => {
        const cardElement = document.querySelector('[data-testid="stripe-card-element"]')
        if (cardElement) {
          cardElement.dispatchEvent(new CustomEvent('change', {
            detail: { complete: true, error: null }
          }))
        }
      })
      
      await page.getByLabel(/cardholder name/i).fill('John Doe')
      await page.getByRole('button', { name: /pay now/i }).click()
      
      // Should show error message
      await expect(page.getByTestId('payment-error')).toBeVisible()
      await expect(page.getByText('Your card was declined')).toBeVisible()
      
      // Should allow retry
      await expect(page.getByRole('button', { name: /try again/i })).toBeVisible()
      
      // Should not redirect
      await expect(page).toHaveURL(/\/booking\/.*\/payment/)
    })

    test('handles insufficient funds error', async ({ page }) => {
      await page.evaluate(() => {
        window.mockPaymentMethodId = 'pm_card_insufficient_funds'
      })
      
      await page.getByTestId('payment-method-stripe').click()
      await page.getByTestId('stripe-card-element').click()
      
      await page.evaluate(() => {
        const cardElement = document.querySelector('[data-testid="stripe-card-element"]')
        if (cardElement) {
          cardElement.dispatchEvent(new CustomEvent('change', {
            detail: { complete: true, error: null }
          }))
        }
      })
      
      await page.getByLabel(/cardholder name/i).fill('John Doe')
      await page.getByRole('button', { name: /pay now/i }).click()
      
      // Should show specific error
      await expect(page.getByText('Your card has insufficient funds')).toBeVisible()
      
      // Should suggest alternative payment methods
      await expect(page.getByText('Try a different payment method')).toBeVisible()
    })
  })

  describe('Stripe 3D Secure', () => {
    test('handles 3D Secure authentication', async ({ page }) => {
      // Mock 3D Secure required
      await page.route('/api/payments/stripe/confirm', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            requiresAction: true,
            paymentIntent: {
              id: 'pi_test_123',
              status: 'requires_action',
              next_action: {
                type: 'use_stripe_sdk',
              },
            },
          }),
        })
      })
      
      await page.getByTestId('payment-method-stripe').click()
      await page.getByTestId('stripe-card-element').click()
      
      await page.evaluate(() => {
        const cardElement = document.querySelector('[data-testid="stripe-card-element"]')
        if (cardElement) {
          cardElement.dispatchEvent(new CustomEvent('change', {
            detail: { complete: true, error: null }
          }))
        }
      })
      
      await page.getByLabel(/cardholder name/i).fill('John Doe')
      await page.getByRole('button', { name: /pay now/i }).click()
      
      // Should show 3D Secure modal
      await expect(page.getByTestId('3ds-modal')).toBeVisible()
      await expect(page.getByText('Additional authentication required')).toBeVisible()
      
      // Should show authentication iframe
      await expect(page.getByTestId('3ds-iframe')).toBeVisible()
    })
  })

  describe('Stripe Apple Pay / Google Pay', () => {
    test('shows Apple Pay button on supported devices', async ({ page }) => {
      // Mock Apple Pay support
      await page.addInitScript(() => {
        window.ApplePaySession = {
          canMakePayments: () => true,
          supportsVersion: () => true,
        }
      })
      
      await page.reload()
      await page.getByTestId('payment-method-stripe').click()
      
      // Should show Apple Pay button
      await expect(page.getByTestId('apple-pay-button')).toBeVisible()
      await expect(page.getByText('Pay with Apple Pay')).toBeVisible()
    })

    test('shows Google Pay button on supported devices', async ({ page }) => {
      // Mock Google Pay support
      await page.addInitScript(() => {
        window.google = {
          payments: {
            api: {
              PaymentsClient: function() {
                return {
                  isReadyToPay: () => Promise.resolve({ result: true }),
                  createButton: () => document.createElement('button'),
                }
              },
            },
          },
        }
      })
      
      await page.reload()
      await page.getByTestId('payment-method-stripe').click()
      
      // Should show Google Pay button
      await expect(page.getByTestId('google-pay-button')).toBeVisible()
      await expect(page.getByText('Pay with Google Pay')).toBeVisible()
    })
  })

  describe('Stripe Payment Security', () => {
    test('validates card input security', async ({ page }) => {
      await page.getByTestId('payment-method-stripe').click()
      
      // Card element should be in secure iframe
      const cardFrame = page.frameLocator('iframe[name*="__privateStripeFrame"]')
      await expect(cardFrame.locator('input')).toBeVisible()
      
      // Should not expose card data to main page
      const cardData = await page.evaluate(() => {
        return document.querySelector('[data-testid="stripe-card-element"]')?.textContent
      })
      expect(cardData).not.toContain('4242')
    })

    test('uses HTTPS for all requests', async ({ page }) => {
      const requests: string[] = []
      
      page.on('request', request => {
        if (request.url().includes('stripe')) {
          requests.push(request.url())
        }
      })
      
      await page.getByTestId('payment-method-stripe').click()
      await page.getByRole('button', { name: /pay now/i }).click()
      
      // All Stripe requests should use HTTPS
      requests.forEach(url => {
        expect(url).toMatch(/^https:\/\//)
      })
    })
  })
})
