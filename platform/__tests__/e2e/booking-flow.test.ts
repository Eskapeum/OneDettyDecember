import { test, expect } from '@playwright/test'

test.describe('Complete Booking Flow E2E Tests', () => {
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
            description: 'Amazing beach party experience with live music and entertainment',
            price: 50000,
            currency: 'NGN',
            type: 'EVENT',
            location: 'Victoria Island, Lagos',
            maxGuests: 10,
            availableDates: [
              '2025-12-25',
              '2025-12-26',
              '2025-12-27',
              '2025-12-28',
              '2025-12-29',
              '2025-12-30',
              '2025-12-31',
            ],
            images: ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600'],
            vendor: {
              id: 'vendor-1',
              businessName: 'Lagos Event Planners',
              rating: 4.8,
            },
            amenities: ['Live Music', 'Food & Drinks', 'Beach Access'],
            cancellationPolicy: 'Free cancellation up to 24 hours before event',
            requirements: ['Valid ID required', 'Age 18+ only'],
          },
        }),
      })
    })

    // Mock availability check
    await page.route('/api/packages/*/availability**', async (route) => {
      const url = new URL(route.request().url())
      const date = url.searchParams.get('date')
      const guests = parseInt(url.searchParams.get('guests') || '1')
      
      // Simulate sold out on specific dates
      const soldOutDates = ['2025-12-31']
      const isAvailable = !soldOutDates.includes(date || '') && guests <= 8
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          available: isAvailable,
          remainingSpots: isAvailable ? Math.max(0, 8 - guests) : 0,
          price: 50000,
          totalPrice: 50000 * guests,
          date,
          guests,
        }),
      })
    })

    // Mock booking creation
    await page.route('/api/bookings', async (route) => {
      if (route.request().method() === 'POST') {
        const body = await route.request().postDataJSON()
        
        // Simulate validation errors
        if (!body.guestInfo?.firstName) {
          await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
              success: false,
              error: 'First name is required',
              field: 'firstName',
            }),
          })
          return
        }

        if (!body.guestInfo?.email?.includes('@')) {
          await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
              success: false,
              error: 'Valid email is required',
              field: 'email',
            }),
          })
          return
        }

        // Simulate successful booking
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            booking: {
              id: 'booking-123',
              packageId: body.packageId,
              date: body.date,
              guests: body.guests,
              totalPrice: body.totalPrice,
              status: 'CONFIRMED',
              confirmationCode: 'ODD2025-ABC123',
              guestInfo: body.guestInfo,
              createdAt: new Date().toISOString(),
            },
          }),
        })
      }
    })

    // Mock payment processing
    await page.route('/api/payments/process', async (route) => {
      if (route.request().method() === 'POST') {
        const body = await route.request().postDataJSON()
        
        // Simulate payment failure for specific card
        if (body.cardNumber === '4000000000000002') {
          await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
              success: false,
              error: 'Your card was declined',
              code: 'CARD_DECLINED',
            }),
          })
          return
        }

        // Simulate successful payment
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            payment: {
              id: 'payment-456',
              amount: body.amount,
              currency: 'NGN',
              status: 'COMPLETED',
              transactionId: 'txn_789',
            },
          }),
        })
      }
    })

    await page.goto('/packages/pkg-1')
  })

  describe('Complete Booking Flow', () => {
    test('successfully completes full booking flow', async ({ page }) => {
      // Step 1: View package details
      await expect(page.getByRole('heading', { name: /lagos beach party/i })).toBeVisible()
      await expect(page.getByText('₦50,000')).toBeVisible()
      
      // Step 2: Click book now button
      await page.getByRole('button', { name: /book now/i }).click()
      
      // Step 3: Select date
      await expect(page.getByRole('heading', { name: /select date/i })).toBeVisible()
      await page.getByTestId('date-picker').click()
      await page.getByText('25').click() // December 25th
      
      // Verify date selection
      await expect(page.getByText('December 25, 2025')).toBeVisible()
      
      // Step 4: Select number of guests
      await expect(page.getByRole('heading', { name: /select guests/i })).toBeVisible()
      await page.getByTestId('guest-selector').click()
      await page.getByText('2 guests').click()
      
      // Verify price calculation
      await expect(page.getByText('₦100,000')).toBeVisible() // 2 guests × ₦50,000
      
      // Step 5: Continue to guest information
      await page.getByRole('button', { name: /continue/i }).click()
      
      // Step 6: Fill guest information
      await expect(page.getByRole('heading', { name: /guest information/i })).toBeVisible()
      
      await page.getByLabel(/first name/i).fill('John')
      await page.getByLabel(/last name/i).fill('Doe')
      await page.getByLabel(/email/i).fill('john.doe@example.com')
      await page.getByLabel(/phone/i).fill('+234-801-234-5678')
      
      // Special requirements (optional)
      await page.getByLabel(/special requirements/i).fill('Vegetarian meal preference')
      
      // Step 7: Continue to payment
      await page.getByRole('button', { name: /continue to payment/i }).click()
      
      // Step 8: Review booking details
      await expect(page.getByRole('heading', { name: /review booking/i })).toBeVisible()
      await expect(page.getByText('Lagos Beach Party')).toBeVisible()
      await expect(page.getByText('December 25, 2025')).toBeVisible()
      await expect(page.getByText('2 guests')).toBeVisible()
      await expect(page.getByText('₦100,000')).toBeVisible()
      await expect(page.getByText('John Doe')).toBeVisible()
      await expect(page.getByText('john.doe@example.com')).toBeVisible()
      
      // Step 9: Enter payment information
      await page.getByLabel(/card number/i).fill('4242424242424242')
      await page.getByLabel(/expiry date/i).fill('12/26')
      await page.getByLabel(/cvv/i).fill('123')
      await page.getByLabel(/cardholder name/i).fill('John Doe')
      
      // Step 10: Complete booking
      await page.getByRole('button', { name: /complete booking/i }).click()
      
      // Step 11: Verify booking confirmation
      await expect(page.getByRole('heading', { name: /booking confirmed/i })).toBeVisible()
      await expect(page.getByText(/confirmation code/i)).toBeVisible()
      await expect(page.getByText('ODD2025-ABC123')).toBeVisible()
      await expect(page.getByText(/booking details have been sent/i)).toBeVisible()
      
      // Verify booking summary
      await expect(page.getByText('Lagos Beach Party')).toBeVisible()
      await expect(page.getByText('December 25, 2025')).toBeVisible()
      await expect(page.getByText('2 guests')).toBeVisible()
      await expect(page.getByText('₦100,000')).toBeVisible()
      
      // Check for next steps
      await expect(page.getByText(/what happens next/i)).toBeVisible()
      await expect(page.getByRole('button', { name: /download confirmation/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /add to calendar/i })).toBeVisible()
    })

    test('handles booking flow with maximum guests', async ({ page }) => {
      await page.getByRole('button', { name: /book now/i }).click()
      
      // Select date
      await page.getByTestId('date-picker').click()
      await page.getByText('26').click()
      
      // Select maximum guests (8)
      await page.getByTestId('guest-selector').click()
      await page.getByText('8 guests').click()
      
      // Verify price for maximum guests
      await expect(page.getByText('₦400,000')).toBeVisible() // 8 guests × ₦50,000
      
      // Continue with booking
      await page.getByRole('button', { name: /continue/i }).click()
      
      // Fill guest information
      await page.getByLabel(/first name/i).fill('Jane')
      await page.getByLabel(/last name/i).fill('Smith')
      await page.getByLabel(/email/i).fill('jane.smith@example.com')
      await page.getByLabel(/phone/i).fill('+234-802-345-6789')
      
      await page.getByRole('button', { name: /continue to payment/i }).click()
      
      // Verify maximum guest booking
      await expect(page.getByText('8 guests')).toBeVisible()
      await expect(page.getByText('₦400,000')).toBeVisible()
    })

    test('saves booking progress and allows resumption', async ({ page }) => {
      await page.getByRole('button', { name: /book now/i }).click()
      
      // Select date and guests
      await page.getByTestId('date-picker').click()
      await page.getByText('27').click()
      await page.getByTestId('guest-selector').click()
      await page.getByText('3 guests').click()
      await page.getByRole('button', { name: /continue/i }).click()
      
      // Partially fill guest information
      await page.getByLabel(/first name/i).fill('Mike')
      await page.getByLabel(/last name/i).fill('Johnson')
      
      // Refresh page to simulate interruption
      await page.reload()
      
      // Verify booking progress is saved
      await expect(page.getByDisplayValue('Mike')).toBeVisible()
      await expect(page.getByDisplayValue('Johnson')).toBeVisible()
      await expect(page.getByText('December 27, 2025')).toBeVisible()
      await expect(page.getByText('3 guests')).toBeVisible()
      
      // Complete the booking
      await page.getByLabel(/email/i).fill('mike.johnson@example.com')
      await page.getByLabel(/phone/i).fill('+234-803-456-7890')
      await page.getByRole('button', { name: /continue to payment/i }).click()
      
      // Verify saved data is preserved
      await expect(page.getByText('Mike Johnson')).toBeVisible()
      await expect(page.getByText('₦150,000')).toBeVisible() // 3 guests × ₦50,000
    })
  })

  describe('Booking Flow Navigation', () => {
    test('allows navigation between booking steps', async ({ page }) => {
      await page.getByRole('button', { name: /book now/i }).click()
      
      // Step 1: Date selection
      await page.getByTestId('date-picker').click()
      await page.getByText('28').click()
      await page.getByTestId('guest-selector').click()
      await page.getByText('2 guests').click()
      await page.getByRole('button', { name: /continue/i }).click()
      
      // Step 2: Guest information
      await page.getByLabel(/first name/i).fill('Sarah')
      await page.getByLabel(/last name/i).fill('Wilson')
      await page.getByLabel(/email/i).fill('sarah.wilson@example.com')
      await page.getByLabel(/phone/i).fill('+234-804-567-8901')
      await page.getByRole('button', { name: /continue to payment/i }).click()
      
      // Step 3: Review and payment - Go back to edit guest info
      await page.getByRole('button', { name: /edit guest information/i }).click()
      
      // Verify we're back at guest information step
      await expect(page.getByRole('heading', { name: /guest information/i })).toBeVisible()
      await expect(page.getByDisplayValue('Sarah')).toBeVisible()
      
      // Edit information
      await page.getByLabel(/first name/i).fill('Sarah Jane')
      await page.getByRole('button', { name: /continue to payment/i }).click()
      
      // Go back to date selection
      await page.getByRole('button', { name: /edit date & guests/i }).click()
      
      // Verify we're back at date selection
      await expect(page.getByRole('heading', { name: /select date/i })).toBeVisible()
      await expect(page.getByText('December 28, 2025')).toBeVisible()
      
      // Change guest count
      await page.getByTestId('guest-selector').click()
      await page.getByText('4 guests').click()
      await page.getByRole('button', { name: /continue/i }).click()
      
      // Verify updated information is preserved
      await expect(page.getByDisplayValue('Sarah Jane')).toBeVisible()
      await page.getByRole('button', { name: /continue to payment/i }).click()
      
      // Verify updated guest count and price
      await expect(page.getByText('4 guests')).toBeVisible()
      await expect(page.getByText('₦200,000')).toBeVisible() // 4 guests × ₦50,000
    })

    test('shows booking progress indicator', async ({ page }) => {
      await page.getByRole('button', { name: /book now/i }).click()
      
      // Step 1: Date & Guests
      await expect(page.getByTestId('progress-indicator')).toBeVisible()
      await expect(page.getByText('Step 1 of 3')).toBeVisible()
      await expect(page.getByText('Date & Guests')).toHaveClass(/active/)
      
      // Continue to step 2
      await page.getByTestId('date-picker').click()
      await page.getByText('29').click()
      await page.getByTestId('guest-selector').click()
      await page.getByText('1 guest').click()
      await page.getByRole('button', { name: /continue/i }).click()
      
      // Step 2: Guest Information
      await expect(page.getByText('Step 2 of 3')).toBeVisible()
      await expect(page.getByText('Guest Information')).toHaveClass(/active/)
      await expect(page.getByText('Date & Guests')).toHaveClass(/completed/)
      
      // Continue to step 3
      await page.getByLabel(/first name/i).fill('Alex')
      await page.getByLabel(/last name/i).fill('Brown')
      await page.getByLabel(/email/i).fill('alex.brown@example.com')
      await page.getByLabel(/phone/i).fill('+234-805-678-9012')
      await page.getByRole('button', { name: /continue to payment/i }).click()
      
      // Step 3: Review & Payment
      await expect(page.getByText('Step 3 of 3')).toBeVisible()
      await expect(page.getByText('Review & Payment')).toHaveClass(/active/)
      await expect(page.getByText('Guest Information')).toHaveClass(/completed/)
    })
  })

  describe('Booking Flow Accessibility', () => {
    test('supports keyboard navigation throughout booking flow', async ({ page }) => {
      await page.getByRole('button', { name: /book now/i }).click()
      
      // Navigate with keyboard
      await page.keyboard.press('Tab')
      await expect(page.getByTestId('date-picker')).toBeFocused()
      
      await page.keyboard.press('Enter')
      await page.keyboard.press('ArrowRight') // Navigate to next day
      await page.keyboard.press('Enter') // Select date
      
      await page.keyboard.press('Tab')
      await expect(page.getByTestId('guest-selector')).toBeFocused()
      
      await page.keyboard.press('Enter')
      await page.keyboard.press('ArrowDown') // Select 2 guests
      await page.keyboard.press('Enter')
      
      await page.keyboard.press('Tab')
      await expect(page.getByRole('button', { name: /continue/i })).toBeFocused()
      await page.keyboard.press('Enter')
      
      // Guest information form keyboard navigation
      await page.keyboard.press('Tab')
      await expect(page.getByLabel(/first name/i)).toBeFocused()
    })

    test('has proper ARIA labels and announcements', async ({ page }) => {
      await page.getByRole('button', { name: /book now/i }).click()
      
      // Check ARIA labels
      await expect(page.getByRole('group', { name: /date selection/i })).toBeVisible()
      await expect(page.getByRole('group', { name: /guest selection/i })).toBeVisible()
      
      // Check live regions for announcements
      await page.getByTestId('date-picker').click()
      await page.getByText('25').click()
      
      await expect(page.getByRole('status')).toContainText('Date selected: December 25, 2025')
      
      await page.getByTestId('guest-selector').click()
      await page.getByText('3 guests').click()
      
      await expect(page.getByRole('status')).toContainText('3 guests selected. Total price: ₦150,000')
    })
  })
})
