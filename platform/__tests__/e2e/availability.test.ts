import { test, expect } from '@playwright/test'

test.describe('Date Selection and Availability Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock package data with availability
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
            availableDates: [
              '2025-12-20',
              '2025-12-21',
              '2025-12-22',
              '2025-12-23',
              '2025-12-24',
              '2025-12-25',
              '2025-12-26',
              '2025-12-27',
              '2025-12-28',
              '2025-12-29',
              '2025-12-30',
            ],
            unavailableDates: [
              '2025-12-31', // Sold out
              '2025-12-19', // Past date
            ],
            schedule: {
              '2025-12-25': { startTime: '18:00', endTime: '23:59', availableSpots: 8 },
              '2025-12-26': { startTime: '19:00', endTime: '01:00', availableSpots: 5 },
              '2025-12-27': { startTime: '20:00', endTime: '02:00', availableSpots: 2 },
              '2025-12-28': { startTime: '18:30', endTime: '23:30', availableSpots: 10 },
              '2025-12-29': { startTime: '19:30', endTime: '00:30', availableSpots: 7 },
              '2025-12-30': { startTime: '21:00', endTime: '03:00', availableSpots: 3 },
            },
          },
        }),
      })
    })

    // Mock real-time availability check
    await page.route('/api/packages/*/availability**', async (route) => {
      const url = new URL(route.request().url())
      const date = url.searchParams.get('date')
      const guests = parseInt(url.searchParams.get('guests') || '1')
      
      // Define availability scenarios
      const availabilityData: Record<string, any> = {
        '2025-12-25': { available: true, remainingSpots: 8, price: 50000 },
        '2025-12-26': { available: true, remainingSpots: 5, price: 50000 },
        '2025-12-27': { available: guests <= 2, remainingSpots: Math.max(0, 2 - guests), price: 50000 },
        '2025-12-28': { available: true, remainingSpots: 10, price: 50000 },
        '2025-12-29': { available: true, remainingSpots: 7, price: 50000 },
        '2025-12-30': { available: guests <= 3, remainingSpots: Math.max(0, 3 - guests), price: 50000 },
        '2025-12-31': { available: false, remainingSpots: 0, price: 50000 }, // Sold out
      }
      
      const dayData = availabilityData[date || ''] || { available: false, remainingSpots: 0, price: 50000 }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          available: dayData.available && guests <= dayData.remainingSpots,
          remainingSpots: dayData.remainingSpots,
          price: dayData.price,
          totalPrice: dayData.price * guests,
          date,
          guests,
          message: !dayData.available ? 'This date is sold out' : 
                   guests > dayData.remainingSpots ? `Only ${dayData.remainingSpots} spots remaining` : null,
        }),
      })
    })

    await page.goto('/packages/pkg-1')
  })

  describe('Date Selection Interface', () => {
    test('displays calendar with available and unavailable dates', async ({ page }) => {
      await page.getByRole('button', { name: /book now/i }).click()
      
      // Calendar should be visible
      await expect(page.getByTestId('date-picker-calendar')).toBeVisible()
      await expect(page.getByRole('heading', { name: /december 2025/i })).toBeVisible()
      
      // Available dates should be clickable
      await expect(page.getByTestId('date-25')).toHaveClass(/available/)
      await expect(page.getByTestId('date-26')).toHaveClass(/available/)
      await expect(page.getByTestId('date-28')).toHaveClass(/available/)
      
      // Unavailable dates should be disabled
      await expect(page.getByTestId('date-31')).toHaveClass(/unavailable/)
      await expect(page.getByTestId('date-19')).toHaveClass(/past-date/)
      
      // Past dates should be disabled
      const today = new Date()
      if (today.getDate() > 20) {
        await expect(page.getByTestId('date-19')).toBeDisabled()
      }
    })

    test('shows availability information on date hover', async ({ page }) => {
      await page.getByRole('button', { name: /book now/i }).click()
      
      // Hover over available date
      await page.getByTestId('date-25').hover()
      await expect(page.getByTestId('availability-tooltip')).toBeVisible()
      await expect(page.getByText('8 spots available')).toBeVisible()
      await expect(page.getByText('6:00 PM - 11:59 PM')).toBeVisible()
      
      // Hover over limited availability date
      await page.getByTestId('date-27').hover()
      await expect(page.getByText('2 spots available')).toBeVisible()
      await expect(page.getByText('8:00 PM - 2:00 AM')).toBeVisible()
      
      // Hover over sold out date
      await page.getByTestId('date-31').hover()
      await expect(page.getByText('Sold out')).toBeVisible()
    })

    test('allows navigation between months', async ({ page }) => {
      await page.getByRole('button', { name: /book now/i }).click()
      
      // Navigate to next month
      await page.getByRole('button', { name: /next month/i }).click()
      await expect(page.getByRole('heading', { name: /january 2026/i })).toBeVisible()
      
      // Navigate back to previous month
      await page.getByRole('button', { name: /previous month/i }).click()
      await expect(page.getByRole('heading', { name: /december 2025/i })).toBeVisible()
      
      // Should not allow navigation to past months
      await page.getByRole('button', { name: /previous month/i }).click()
      await expect(page.getByRole('heading', { name: /november 2025/i })).not.toBeVisible()
    })

    test('selects date and updates booking summary', async ({ page }) => {
      await page.getByRole('button', { name: /book now/i }).click()
      
      // Select a date
      await page.getByTestId('date-25').click()
      
      // Verify date selection
      await expect(page.getByTestId('selected-date')).toContainText('December 25, 2025')
      await expect(page.getByTestId('selected-time')).toContainText('6:00 PM - 11:59 PM')
      
      // Verify booking summary updates
      await expect(page.getByTestId('booking-summary')).toBeVisible()
      await expect(page.getByText('Lagos Beach Party')).toBeVisible()
      await expect(page.getByText('December 25, 2025')).toBeVisible()
      await expect(page.getByText('₦50,000')).toBeVisible()
    })
  })

  describe('Guest Selection', () => {
    test('displays guest selector with availability constraints', async ({ page }) => {
      await page.getByRole('button', { name: /book now/i }).click()
      
      // Select date with limited availability
      await page.getByTestId('date-27').click() // Only 2 spots available
      
      // Guest selector should be visible
      await expect(page.getByTestId('guest-selector')).toBeVisible()
      await expect(page.getByRole('heading', { name: /select guests/i })).toBeVisible()
      
      // Should show maximum available guests
      await expect(page.getByText('Maximum 2 guests for this date')).toBeVisible()
      
      // Guest options should be limited
      await page.getByTestId('guest-selector').click()
      await expect(page.getByText('1 guest')).toBeVisible()
      await expect(page.getByText('2 guests')).toBeVisible()
      await expect(page.getByText('3 guests')).toBeDisabled()
    })

    test('updates price when guest count changes', async ({ page }) => {
      await page.getByRole('button', { name: /book now/i }).click()
      
      // Select date
      await page.getByTestId('date-25').click()
      
      // Select different guest counts and verify price updates
      await page.getByTestId('guest-selector').click()
      await page.getByText('1 guest').click()
      await expect(page.getByTestId('total-price')).toContainText('₦50,000')
      
      await page.getByTestId('guest-selector').click()
      await page.getByText('3 guests').click()
      await expect(page.getByTestId('total-price')).toContainText('₦150,000')
      
      await page.getByTestId('guest-selector').click()
      await page.getByText('5 guests').click()
      await expect(page.getByTestId('total-price')).toContainText('₦250,000')
    })

    test('validates guest count against availability in real-time', async ({ page }) => {
      await page.getByRole('button', { name: /book now/i }).click()
      
      // Select date with limited availability
      await page.getByTestId('date-30').click() // Only 3 spots available
      
      // Try to select more guests than available
      await page.getByTestId('guest-selector').click()
      await page.getByText('5 guests').click()
      
      // Should show availability error
      await expect(page.getByTestId('availability-error')).toBeVisible()
      await expect(page.getByText('Only 3 spots remaining for this date')).toBeVisible()
      
      // Should suggest alternative
      await expect(page.getByText('Select a different date or reduce guest count')).toBeVisible()
      
      // Reduce guest count to valid amount
      await page.getByTestId('guest-selector').click()
      await page.getByText('3 guests').click()
      
      // Error should disappear
      await expect(page.getByTestId('availability-error')).not.toBeVisible()
      await expect(page.getByRole('button', { name: /continue/i })).toBeEnabled()
    })
  })

  describe('Real-time Availability Updates', () => {
    test('updates availability when other users book', async ({ page, context }) => {
      await page.getByRole('button', { name: /book now/i }).click()
      
      // Select date with limited availability
      await page.getByTestId('date-27').click() // 2 spots available
      await page.getByTestId('guest-selector').click()
      await page.getByText('1 guest').click()
      
      // Simulate another user booking (reduce availability)
      await page.route('/api/packages/*/availability**', async (route) => {
        const url = new URL(route.request().url())
        const date = url.searchParams.get('date')
        
        if (date === '2025-12-27') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              available: false,
              remainingSpots: 0,
              price: 50000,
              totalPrice: 50000,
              date,
              guests: 1,
              message: 'This date is now sold out',
            }),
          })
        }
      })
      
      // Trigger availability check (e.g., by changing guest count)
      await page.getByTestId('guest-selector').click()
      await page.getByText('2 guests').click()
      
      // Should show sold out message
      await expect(page.getByTestId('availability-error')).toBeVisible()
      await expect(page.getByText('This date is now sold out')).toBeVisible()
      
      // Continue button should be disabled
      await expect(page.getByRole('button', { name: /continue/i })).toBeDisabled()
      
      // Should suggest alternative dates
      await expect(page.getByText('Try these available dates:')).toBeVisible()
      await expect(page.getByTestId('alternative-dates')).toBeVisible()
    })

    test('shows live availability counter', async ({ page }) => {
      await page.getByRole('button', { name: /book now/i }).click()
      
      // Select date
      await page.getByTestId('date-26').click() // 5 spots available
      
      // Should show live counter
      await expect(page.getByTestId('availability-counter')).toBeVisible()
      await expect(page.getByText('5 spots remaining')).toBeVisible()
      
      // Select guests and see counter update
      await page.getByTestId('guest-selector').click()
      await page.getByText('2 guests').click()
      
      await expect(page.getByText('3 spots remaining after your booking')).toBeVisible()
      
      // Select more guests
      await page.getByTestId('guest-selector').click()
      await page.getByText('4 guests').click()
      
      await expect(page.getByText('1 spot remaining after your booking')).toBeVisible()
    })
  })

  describe('Date and Guest Selection Validation', () => {
    test('prevents booking without date selection', async ({ page }) => {
      await page.getByRole('button', { name: /book now/i }).click()
      
      // Try to continue without selecting date
      await expect(page.getByRole('button', { name: /continue/i })).toBeDisabled()
      
      // Should show validation message
      await expect(page.getByText('Please select a date to continue')).toBeVisible()
    })

    test('prevents booking without guest selection', async ({ page }) => {
      await page.getByRole('button', { name: /book now/i }).click()
      
      // Select date but not guests
      await page.getByTestId('date-25').click()
      
      // Continue button should still be disabled
      await expect(page.getByRole('button', { name: /continue/i })).toBeDisabled()
      await expect(page.getByText('Please select number of guests')).toBeVisible()
      
      // Select guests
      await page.getByTestId('guest-selector').click()
      await page.getByText('2 guests').click()
      
      // Now continue should be enabled
      await expect(page.getByRole('button', { name: /continue/i })).toBeEnabled()
    })

    test('validates date is not in the past', async ({ page }) => {
      await page.getByRole('button', { name: /book now/i }).click()
      
      // Past dates should be disabled
      await expect(page.getByTestId('date-19')).toBeDisabled()
      await expect(page.getByTestId('date-19')).toHaveClass(/past-date/)
      
      // Clicking past date should show message
      await page.getByTestId('date-19').click({ force: true })
      await expect(page.getByText('Cannot select past dates')).toBeVisible()
    })

    test('validates guest count limits', async ({ page }) => {
      await page.getByRole('button', { name: /book now/i }).click()
      
      // Select date
      await page.getByTestId('date-25').click()
      
      // Try to select more than maximum guests
      await page.getByTestId('guest-selector').click()
      
      // Should not show options beyond package limit
      await expect(page.getByText('10 guests')).toBeVisible() // Package max
      await expect(page.getByText('11 guests')).not.toBeVisible()
      
      // Select maximum guests
      await page.getByText('10 guests').click()
      
      // Should show warning about group size
      await expect(page.getByText('Large group booking - please review requirements')).toBeVisible()
    })
  })

  describe('Accessibility for Date and Guest Selection', () => {
    test('supports keyboard navigation in calendar', async ({ page }) => {
      await page.getByRole('button', { name: /book now/i }).click()
      
      // Focus calendar
      await page.getByTestId('date-picker-calendar').focus()
      
      // Navigate with arrow keys
      await page.keyboard.press('ArrowRight')
      await page.keyboard.press('ArrowRight')
      await page.keyboard.press('ArrowDown')
      
      // Select date with Enter
      await page.keyboard.press('Enter')
      
      // Should select the focused date
      await expect(page.getByTestId('selected-date')).toBeVisible()
    })

    test('has proper ARIA labels for date picker', async ({ page }) => {
      await page.getByRole('button', { name: /book now/i }).click()
      
      // Calendar should have proper ARIA labels
      await expect(page.getByRole('grid', { name: /calendar/i })).toBeVisible()
      await expect(page.getByRole('gridcell', { name: /december 25/i })).toBeVisible()
      
      // Available dates should have proper state
      await expect(page.getByTestId('date-25')).toHaveAttribute('aria-label', 'December 25, 2025, available, 8 spots remaining')
      
      // Unavailable dates should indicate status
      await expect(page.getByTestId('date-31')).toHaveAttribute('aria-label', 'December 31, 2025, sold out')
    })

    test('announces availability changes to screen readers', async ({ page }) => {
      await page.getByRole('button', { name: /book now/i }).click()
      
      // Select date
      await page.getByTestId('date-27').click()
      
      // Should announce selection
      await expect(page.getByRole('status')).toContainText('December 27, 2025 selected. 2 spots available.')
      
      // Select guests
      await page.getByTestId('guest-selector').click()
      await page.getByText('2 guests').click()
      
      // Should announce guest selection and availability
      await expect(page.getByRole('status')).toContainText('2 guests selected. All remaining spots will be reserved.')
    })
  })
})
