import { test, expect } from '@playwright/test'

test.describe('Payment Webhook Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock webhook endpoints
    await page.route('/api/webhooks/stripe', async (route) => {
      const body = await route.request().postDataJSON()
      
      // Validate webhook signature (mocked)
      const signature = route.request().headers()['stripe-signature']
      if (!signature) {
        await route.fulfill({ status: 400, body: 'Missing signature' })
        return
      }

      // Process webhook event
      if (body.type === 'payment_intent.succeeded') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ received: true }),
        })
      } else if (body.type === 'payment_intent.payment_failed') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ received: true }),
        })
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ received: true, ignored: true }),
        })
      }
    })

    await page.route('/api/webhooks/paystack', async (route) => {
      const body = await route.request().postDataJSON()
      
      // Validate webhook signature (mocked)
      const signature = route.request().headers()['x-paystack-signature']
      if (!signature) {
        await route.fulfill({ status: 400, body: 'Missing signature' })
        return
      }

      // Process webhook event
      if (body.event === 'charge.success') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ status: 'success' }),
        })
      } else if (body.event === 'charge.failed') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ status: 'success' }),
        })
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ status: 'success' }),
        })
      }
    })

    await page.goto('/admin/webhooks')
  })

  describe('Stripe Webhook Processing', () => {
    test('processes successful payment webhook', async ({ page }) => {
      // Simulate Stripe webhook
      const webhookPayload = {
        id: 'evt_test_webhook',
        object: 'event',
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test_123',
            amount: 10000000, // Amount in kobo for NGN
            currency: 'ngn',
            status: 'succeeded',
            metadata: {
              booking_id: 'booking-123',
            },
          },
        },
        created: Math.floor(Date.now() / 1000),
      }

      // Send webhook
      const response = await page.evaluate(async (payload) => {
        return fetch('/api/webhooks/stripe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Stripe-Signature': 'test_signature_123',
          },
          body: JSON.stringify(payload),
        })
      }, webhookPayload)

      // Should process successfully
      await expect(page.getByTestId('webhook-log')).toBeVisible()
      await expect(page.getByText('Stripe webhook processed')).toBeVisible()
      await expect(page.getByText('payment_intent.succeeded')).toBeVisible()
      await expect(page.getByText('booking-123')).toBeVisible()
    })

    test('processes failed payment webhook', async ({ page }) => {
      const webhookPayload = {
        id: 'evt_test_webhook_failed',
        object: 'event',
        type: 'payment_intent.payment_failed',
        data: {
          object: {
            id: 'pi_test_failed',
            amount: 10000000,
            currency: 'ngn',
            status: 'requires_payment_method',
            last_payment_error: {
              code: 'card_declined',
              message: 'Your card was declined.',
            },
            metadata: {
              booking_id: 'booking-456',
            },
          },
        },
        created: Math.floor(Date.now() / 1000),
      }

      await page.evaluate(async (payload) => {
        return fetch('/api/webhooks/stripe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Stripe-Signature': 'test_signature_456',
          },
          body: JSON.stringify(payload),
        })
      }, webhookPayload)

      // Should log failed payment
      await expect(page.getByText('Payment failed webhook processed')).toBeVisible()
      await expect(page.getByText('card_declined')).toBeVisible()
      await expect(page.getByText('booking-456')).toBeVisible()
    })

    test('handles refund webhook', async ({ page }) => {
      const webhookPayload = {
        id: 'evt_test_refund',
        object: 'event',
        type: 'charge.dispute.created',
        data: {
          object: {
            id: 'dp_test_123',
            amount: 5000000, // Partial refund
            currency: 'ngn',
            reason: 'fraudulent',
            status: 'warning_needs_response',
            charge: 'ch_test_123',
          },
        },
        created: Math.floor(Date.now() / 1000),
      }

      await page.evaluate(async (payload) => {
        return fetch('/api/webhooks/stripe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Stripe-Signature': 'test_signature_dispute',
          },
          body: JSON.stringify(payload),
        })
      }, webhookPayload)

      // Should handle dispute
      await expect(page.getByText('Dispute webhook processed')).toBeVisible()
      await expect(page.getByText('fraudulent')).toBeVisible()
      await expect(page.getByText('warning_needs_response')).toBeVisible()
    })

    test('validates webhook signature', async ({ page }) => {
      const webhookPayload = {
        id: 'evt_test_invalid',
        object: 'event',
        type: 'payment_intent.succeeded',
        data: { object: { id: 'pi_test_invalid' } },
      }

      // Send webhook without signature
      await page.evaluate(async (payload) => {
        return fetch('/api/webhooks/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }, webhookPayload)

      // Should reject invalid signature
      await expect(page.getByText('Webhook signature validation failed')).toBeVisible()
      await expect(page.getByText('Missing signature')).toBeVisible()
    })
  })

  describe('Paystack Webhook Processing', () => {
    test('processes successful charge webhook', async ({ page }) => {
      const webhookPayload = {
        event: 'charge.success',
        data: {
          id: 123456789,
          reference: 'paystack_test_123',
          amount: 10000000, // Amount in kobo
          currency: 'NGN',
          status: 'success',
          paid_at: new Date().toISOString(),
          channel: 'card',
          metadata: {
            booking_id: 'booking-789',
          },
          customer: {
            email: 'customer@example.com',
          },
        },
      }

      await page.evaluate(async (payload) => {
        return fetch('/api/webhooks/paystack', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Paystack-Signature': 'test_paystack_signature',
          },
          body: JSON.stringify(payload),
        })
      }, webhookPayload)

      // Should process successfully
      await expect(page.getByText('Paystack webhook processed')).toBeVisible()
      await expect(page.getByText('charge.success')).toBeVisible()
      await expect(page.getByText('paystack_test_123')).toBeVisible()
      await expect(page.getByText('booking-789')).toBeVisible()
    })

    test('processes failed charge webhook', async ({ page }) => {
      const webhookPayload = {
        event: 'charge.failed',
        data: {
          id: 123456790,
          reference: 'paystack_test_failed',
          amount: 10000000,
          currency: 'NGN',
          status: 'failed',
          gateway_response: 'Declined by financial institution',
          metadata: {
            booking_id: 'booking-890',
          },
        },
      }

      await page.evaluate(async (payload) => {
        return fetch('/api/webhooks/paystack', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Paystack-Signature': 'test_paystack_signature_failed',
          },
          body: JSON.stringify(payload),
        })
      }, webhookPayload)

      // Should log failed charge
      await expect(page.getByText('Charge failed webhook processed')).toBeVisible()
      await expect(page.getByText('Declined by financial institution')).toBeVisible()
      await expect(page.getByText('booking-890')).toBeVisible()
    })

    test('handles transfer webhook', async ({ page }) => {
      const webhookPayload = {
        event: 'transfer.success',
        data: {
          id: 987654321,
          reference: 'transfer_test_123',
          amount: 5000000,
          currency: 'NGN',
          status: 'success',
          recipient: {
            name: 'Vendor Name',
            account_number: '0123456789',
            bank_name: 'Test Bank',
          },
          metadata: {
            payout_id: 'payout-123',
          },
        },
      }

      await page.evaluate(async (payload) => {
        return fetch('/api/webhooks/paystack', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Paystack-Signature': 'test_paystack_transfer_signature',
          },
          body: JSON.stringify(payload),
        })
      }, webhookPayload)

      // Should handle transfer
      await expect(page.getByText('Transfer webhook processed')).toBeVisible()
      await expect(page.getByText('transfer_test_123')).toBeVisible()
      await expect(page.getByText('payout-123')).toBeVisible()
    })
  })

  describe('Webhook Security', () => {
    test('validates request origin', async ({ page }) => {
      // Mock request from invalid origin
      await page.route('/api/webhooks/stripe', async (route) => {
        const origin = route.request().headers()['origin']
        if (origin && !origin.includes('stripe.com')) {
          await route.fulfill({
            status: 403,
            body: 'Invalid origin',
          })
          return
        }
        await route.fulfill({ status: 200, body: '{}' })
      })

      // Should reject invalid origin
      await page.evaluate(() => {
        return fetch('/api/webhooks/stripe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://malicious-site.com',
          },
          body: JSON.stringify({ type: 'test' }),
        })
      })

      await expect(page.getByText('Invalid origin detected')).toBeVisible()
    })

    test('implements rate limiting', async ({ page }) => {
      // Send multiple rapid requests
      const promises = []
      for (let i = 0; i < 10; i++) {
        promises.push(
          page.evaluate((index) => {
            return fetch('/api/webhooks/stripe', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Stripe-Signature': `test_signature_${index}`,
              },
              body: JSON.stringify({
                id: `evt_${index}`,
                type: 'payment_intent.succeeded',
                data: { object: { id: `pi_${index}` } },
              }),
            })
          }, i)
        )
      }

      await Promise.all(promises)

      // Should show rate limiting
      await expect(page.getByText('Rate limit applied')).toBeVisible()
    })

    test('logs webhook attempts', async ({ page }) => {
      const webhookPayload = {
        id: 'evt_test_logging',
        type: 'payment_intent.succeeded',
        data: { object: { id: 'pi_test_logging' } },
      }

      await page.evaluate(async (payload) => {
        return fetch('/api/webhooks/stripe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Stripe-Signature': 'test_signature_logging',
          },
          body: JSON.stringify(payload),
        })
      }, webhookPayload)

      // Should log webhook attempt
      await expect(page.getByTestId('webhook-logs')).toBeVisible()
      await expect(page.getByText('evt_test_logging')).toBeVisible()
      await expect(page.getByText('payment_intent.succeeded')).toBeVisible()
      await expect(page.getByText('Processed successfully')).toBeVisible()
    })
  })

  describe('Webhook Retry Logic', () => {
    test('handles webhook retry attempts', async ({ page }) => {
      // Mock failing webhook endpoint
      let attemptCount = 0
      await page.route('/api/webhooks/stripe', async (route) => {
        attemptCount++
        
        if (attemptCount <= 2) {
          // Fail first two attempts
          await route.fulfill({ status: 500, body: 'Internal server error' })
        } else {
          // Succeed on third attempt
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ received: true }),
          })
        }
      })

      // Simulate webhook retry
      for (let i = 0; i < 3; i++) {
        await page.evaluate((attempt) => {
          return fetch('/api/webhooks/stripe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Stripe-Signature': `test_signature_retry_${attempt}`,
            },
            body: JSON.stringify({
              id: 'evt_test_retry',
              type: 'payment_intent.succeeded',
              data: { object: { id: 'pi_test_retry' } },
            }),
          })
        }, i)
      }

      // Should show retry attempts
      await expect(page.getByText('Webhook retry attempt 1')).toBeVisible()
      await expect(page.getByText('Webhook retry attempt 2')).toBeVisible()
      await expect(page.getByText('Webhook processed successfully')).toBeVisible()
    })

    test('handles maximum retry exceeded', async ({ page }) => {
      // Mock always failing webhook
      await page.route('/api/webhooks/stripe', async (route) => {
        await route.fulfill({ status: 500, body: 'Persistent error' })
      })

      // Simulate max retries
      for (let i = 0; i < 5; i++) {
        await page.evaluate((attempt) => {
          return fetch('/api/webhooks/stripe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Stripe-Signature': `test_signature_max_retry_${attempt}`,
            },
            body: JSON.stringify({
              id: 'evt_test_max_retry',
              type: 'payment_intent.succeeded',
              data: { object: { id: 'pi_test_max_retry' } },
            }),
          })
        }, i)
      }

      // Should show max retries exceeded
      await expect(page.getByText('Maximum webhook retries exceeded')).toBeVisible()
      await expect(page.getByText('Manual intervention required')).toBeVisible()
    })
  })

  describe('Webhook Monitoring', () => {
    test('displays webhook statistics', async ({ page }) => {
      await page.goto('/admin/webhooks/stats')

      // Should show webhook metrics
      await expect(page.getByTestId('webhook-stats')).toBeVisible()
      await expect(page.getByText('Total Webhooks Received')).toBeVisible()
      await expect(page.getByText('Success Rate')).toBeVisible()
      await expect(page.getByText('Average Processing Time')).toBeVisible()
      
      // Should show provider breakdown
      await expect(page.getByText('Stripe Webhooks')).toBeVisible()
      await expect(page.getByText('Paystack Webhooks')).toBeVisible()
      
      // Should show recent activity
      await expect(page.getByTestId('recent-webhooks')).toBeVisible()
    })

    test('shows webhook health status', async ({ page }) => {
      await page.goto('/admin/webhooks/health')

      // Should show health indicators
      await expect(page.getByTestId('webhook-health')).toBeVisible()
      await expect(page.getByText('Webhook Endpoint Status')).toBeVisible()
      await expect(page.getByText('Last Successful Webhook')).toBeVisible()
      await expect(page.getByText('Error Rate (24h)')).toBeVisible()
      
      // Should show alerts if any
      await expect(page.getByTestId('webhook-alerts')).toBeVisible()
    })
  })
})
