import { test, expect } from '@playwright/test'

test.describe('Paystack Payment Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock Paystack SDK
    await page.addInitScript(() => {
      window.PaystackPop = {
        setup: (options: any) => ({
          openIframe: () => {
            // Simulate successful payment
            setTimeout(() => {
              options.onSuccess({
                reference: 'paystack_test_123',
                status: 'success',
                trans: 'TXN_123',
                transaction: 'TXN_123',
                trxref: 'paystack_test_123',
              })
            }, 1000)
          },
        }),
      }
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
              firstName: 'Adebayo',
              lastName: 'Ogundimu',
              email: 'adebayo.ogundimu@example.com',
            },
          },
        }),
      })
    })

    // Mock Paystack payment initialization
    await page.route('/api/payments/paystack/initialize', async (route) => {
      const body = await route.request().postDataJSON()
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            authorization_url: 'https://checkout.paystack.com/test_123',
            access_code: 'access_code_123',
            reference: 'paystack_test_123',
          },
          amount: body.amount,
          currency: body.currency,
        }),
      })
    })

    // Mock Paystack payment verification
    await page.route('/api/payments/paystack/verify', async (route) => {
      const body = await route.request().postDataJSON()
      
      // Simulate different payment outcomes
      if (body.reference === 'paystack_declined_123') {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: 'Transaction was declined',
            code: 'transaction_declined',
          }),
        })
        return
      }

      // Successful payment verification
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 123456789,
            reference: body.reference,
            status: 'success',
            amount: 10000000, // Amount in kobo
            currency: 'NGN',
            paid_at: new Date().toISOString(),
            channel: 'card',
            authorization: {
              authorization_code: 'AUTH_123',
              bin: '408408',
              last4: '4081',
              exp_month: '12',
              exp_year: '2030',
              channel: 'card',
              card_type: 'visa',
              bank: 'TEST BANK',
              country_code: 'NG',
              brand: 'visa',
            },
            customer: {
              email: 'adebayo.ogundimu@example.com',
            },
          },
          booking: {
            id: 'booking-123',
            status: 'CONFIRMED',
            confirmationCode: 'ODD2025-PAY123',
          },
        }),
      })
    })

    await page.goto('/booking/booking-123/payment')
  })

  describe('Paystack Checkout Flow', () => {
    test('displays Paystack payment form', async ({ page }) => {
      // Should show payment method selector
      await expect(page.getByTestId('payment-method-selector')).toBeVisible()
      
      // Select Paystack as payment method
      await page.getByTestId('payment-method-paystack').click()
      
      // Should show Paystack payment form
      await expect(page.getByTestId('paystack-payment-form')).toBeVisible()
      await expect(page.getByText('Pay with Paystack')).toBeVisible()
      
      // Should show payment amount in Naira
      await expect(page.getByText('₦100,000')).toBeVisible()
      
      // Should show accepted payment methods
      await expect(page.getByTestId('accepted-methods')).toBeVisible()
      await expect(page.getByText('Card')).toBeVisible()
      await expect(page.getByText('Bank Transfer')).toBeVisible()
      await expect(page.getByText('USSD')).toBeVisible()
      await expect(page.getByText('Mobile Money')).toBeVisible()
      
      // Should show Nigerian banks
      await expect(page.getByAltText('GTBank')).toBeVisible()
      await expect(page.getByAltText('Access Bank')).toBeVisible()
      await expect(page.getByAltText('First Bank')).toBeVisible()
    })

    test('processes successful Paystack card payment', async ({ page }) => {
      // Select Paystack payment
      await page.getByTestId('payment-method-paystack').click()
      
      // Fill customer details
      await page.getByLabel(/email/i).fill('adebayo.ogundimu@example.com')
      await page.getByLabel(/phone/i).fill('+234-801-234-5678')
      
      // Submit payment
      await page.getByRole('button', { name: /pay with paystack/i }).click()
      
      // Should show Paystack popup
      await expect(page.getByTestId('paystack-popup')).toBeVisible()
      await expect(page.getByText('Paystack Checkout')).toBeVisible()
      
      // Should show processing state
      await expect(page.getByTestId('payment-processing')).toBeVisible()
      await expect(page.getByText('Processing payment...')).toBeVisible()
      
      // Wait for payment completion
      await page.waitForTimeout(1500)
      
      // Should redirect to success page
      await expect(page).toHaveURL(/\/payments\/.*\/success/)
      
      // Should show success message
      await expect(page.getByRole('heading', { name: /payment successful/i })).toBeVisible()
      await expect(page.getByText('ODD2025-PAY123')).toBeVisible()
      
      // Should show transaction reference
      await expect(page.getByText('paystack_test_123')).toBeVisible()
      
      // Should show booking confirmation
      await expect(page.getByText('Your booking is confirmed')).toBeVisible()
    })

    test('handles Paystack payment failures', async ({ page }) => {
      // Mock declined payment
      await page.addInitScript(() => {
        window.PaystackPop = {
          setup: (options: any) => ({
            openIframe: () => {
              setTimeout(() => {
                options.onCancel()
              }, 1000)
            },
          }),
        }
      })
      
      await page.getByTestId('payment-method-paystack').click()
      await page.getByLabel(/email/i).fill('adebayo.ogundimu@example.com')
      await page.getByRole('button', { name: /pay with paystack/i }).click()
      
      // Wait for cancellation
      await page.waitForTimeout(1500)
      
      // Should show error message
      await expect(page.getByTestId('payment-error')).toBeVisible()
      await expect(page.getByText('Payment was cancelled')).toBeVisible()
      
      // Should allow retry
      await expect(page.getByRole('button', { name: /try again/i })).toBeVisible()
      
      // Should not redirect
      await expect(page).toHaveURL(/\/booking\/.*\/payment/)
    })
  })

  describe('Paystack Bank Transfer', () => {
    test('displays bank transfer option', async ({ page }) => {
      await page.getByTestId('payment-method-paystack').click()
      
      // Should show bank transfer option
      await expect(page.getByTestId('bank-transfer-option')).toBeVisible()
      await page.getByTestId('bank-transfer-option').click()
      
      // Should show bank transfer instructions
      await expect(page.getByText('Bank Transfer Instructions')).toBeVisible()
      await expect(page.getByText('Account Number:')).toBeVisible()
      await expect(page.getByText('Account Name:')).toBeVisible()
      await expect(page.getByText('Bank:')).toBeVisible()
      
      // Should show transfer amount
      await expect(page.getByText('₦100,000')).toBeVisible()
      
      // Should show reference number
      await expect(page.getByText('Reference:')).toBeVisible()
      
      // Should have copy buttons
      await expect(page.getByRole('button', { name: /copy account number/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /copy reference/i })).toBeVisible()
    })

    test('handles bank transfer confirmation', async ({ page }) => {
      await page.getByTestId('payment-method-paystack').click()
      await page.getByTestId('bank-transfer-option').click()
      
      // Should show confirmation button
      await expect(page.getByRole('button', { name: /i have made the transfer/i })).toBeVisible()
      
      await page.getByRole('button', { name: /i have made the transfer/i }).click()
      
      // Should show pending verification message
      await expect(page.getByText('Transfer confirmation pending')).toBeVisible()
      await expect(page.getByText('We will verify your payment within 10 minutes')).toBeVisible()
      
      // Should show booking status as pending
      await expect(page.getByText('Booking Status: Pending Payment')).toBeVisible()
    })
  })

  describe('Paystack USSD Payment', () => {
    test('displays USSD payment option', async ({ page }) => {
      await page.getByTestId('payment-method-paystack').click()
      
      // Should show USSD option
      await expect(page.getByTestId('ussd-option')).toBeVisible()
      await page.getByTestId('ussd-option').click()
      
      // Should show bank selection
      await expect(page.getByText('Select your bank')).toBeVisible()
      await expect(page.getByTestId('bank-selector')).toBeVisible()
      
      // Select a bank
      await page.getByTestId('bank-selector').click()
      await page.getByText('GTBank').click()
      
      // Should show USSD code
      await expect(page.getByText('Dial this USSD code:')).toBeVisible()
      await expect(page.getByTestId('ussd-code')).toBeVisible()
      await expect(page.getByText('*737*')).toBeVisible()
      
      // Should have copy button
      await expect(page.getByRole('button', { name: /copy ussd code/i })).toBeVisible()
    })
  })

  describe('Paystack Mobile Money', () => {
    test('displays mobile money option for supported countries', async ({ page }) => {
      // Mock Ghana location
      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'geolocation', {
          value: {
            getCurrentPosition: (success: any) => {
              success({
                coords: {
                  latitude: 5.6037,
                  longitude: -0.1870, // Accra, Ghana
                },
              })
            },
          },
        })
      })
      
      await page.reload()
      await page.getByTestId('payment-method-paystack').click()
      
      // Should show mobile money option
      await expect(page.getByTestId('mobile-money-option')).toBeVisible()
      await page.getByTestId('mobile-money-option').click()
      
      // Should show mobile money providers
      await expect(page.getByText('Select mobile money provider')).toBeVisible()
      await expect(page.getByText('MTN Mobile Money')).toBeVisible()
      await expect(page.getByText('Vodafone Cash')).toBeVisible()
      await expect(page.getByText('AirtelTigo Money')).toBeVisible()
      
      // Should require phone number
      await expect(page.getByLabel(/mobile number/i)).toBeVisible()
    })
  })

  describe('Paystack Payment Security', () => {
    test('validates email format', async ({ page }) => {
      await page.getByTestId('payment-method-paystack').click()
      
      // Enter invalid email
      await page.getByLabel(/email/i).fill('invalid-email')
      await page.getByRole('button', { name: /pay with paystack/i }).click()
      
      // Should show validation error
      await expect(page.getByText('Please enter a valid email address')).toBeVisible()
      
      // Button should be disabled
      await expect(page.getByRole('button', { name: /pay with paystack/i })).toBeDisabled()
    })

    test('validates phone number format', async ({ page }) => {
      await page.getByTestId('payment-method-paystack').click()
      
      // Enter invalid phone
      await page.getByLabel(/phone/i).fill('123')
      await page.getByRole('button', { name: /pay with paystack/i }).click()
      
      // Should show validation error
      await expect(page.getByText('Please enter a valid phone number')).toBeVisible()
    })

    test('uses secure payment popup', async ({ page }) => {
      await page.getByTestId('payment-method-paystack').click()
      await page.getByLabel(/email/i).fill('test@example.com')
      await page.getByRole('button', { name: /pay with paystack/i }).click()
      
      // Should open secure popup
      await expect(page.getByTestId('paystack-popup')).toBeVisible()
      
      // Should have secure indicators
      await expect(page.getByText('Secured by Paystack')).toBeVisible()
      await expect(page.getByTestId('ssl-indicator')).toBeVisible()
    })
  })

  describe('Paystack Webhook Handling', () => {
    test('handles successful payment webhook', async ({ page }) => {
      // Mock webhook endpoint
      await page.route('/api/webhooks/paystack', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        })
      })
      
      // Simulate webhook call
      await page.evaluate(() => {
        fetch('/api/webhooks/paystack', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'charge.success',
            data: {
              reference: 'paystack_test_123',
              status: 'success',
              amount: 10000000,
              currency: 'NGN',
            },
          }),
        })
      })
      
      // Should update booking status
      await page.waitForTimeout(1000)
      await expect(page.getByText('Payment confirmed')).toBeVisible()
    })
  })

  describe('Paystack Currency Support', () => {
    test('supports Nigerian Naira (NGN)', async ({ page }) => {
      await page.getByTestId('payment-method-paystack').click()
      
      // Should display amount in Naira
      await expect(page.getByText('₦100,000')).toBeVisible()
      
      // Should show Naira-specific payment methods
      await expect(page.getByText('Bank Transfer')).toBeVisible()
      await expect(page.getByText('USSD')).toBeVisible()
    })

    test('supports Ghanaian Cedi (GHS)', async ({ page }) => {
      // Mock Ghana location and currency
      await page.route('/api/bookings/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            booking: {
              id: 'booking-123',
              totalPrice: 600,
              currency: 'GHS',
              status: 'PENDING_PAYMENT',
            },
          }),
        })
      })
      
      await page.reload()
      await page.getByTestId('payment-method-paystack').click()
      
      // Should display amount in Cedis
      await expect(page.getByText('GH₵600')).toBeVisible()
      
      // Should show Ghana-specific payment methods
      await expect(page.getByText('Mobile Money')).toBeVisible()
    })
  })
})
