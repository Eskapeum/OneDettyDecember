import { test, expect } from '@playwright/test'

test.describe('Sign-up Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the waitlist page
    await page.goto('/waitlist')
  })

  test('displays the waitlist form correctly', async ({ page }) => {
    // Check page title and heading
    await expect(page).toHaveTitle(/Create Next App/)
    await expect(page.getByRole('heading', { name: 'OneDettyDecember' })).toBeVisible()
    await expect(page.getByText('The ultimate platform for December experiences')).toBeVisible()

    // Check form elements
    await expect(page.getByRole('heading', { name: 'Join the Waitlist' })).toBeVisible()
    await expect(page.getByText('Be the first to know when OneDettyDecember launches')).toBeVisible()
    
    // Check form fields
    await expect(page.getByLabel('Email Address *')).toBeVisible()
    await expect(page.getByLabel('First Name')).toBeVisible()
    await expect(page.getByLabel('Last Name')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Join Waitlist' })).toBeVisible()
  })

  test('validates required email field', async ({ page }) => {
    // Try to submit without email
    await page.getByRole('button', { name: 'Join Waitlist' }).click()
    
    // Check that form validation prevents submission
    await expect(page.getByLabel('Email Address *')).toBeFocused()
  })

  test('validates email format', async ({ page }) => {
    // Enter invalid email
    await page.getByLabel('Email Address *').fill('invalid-email')
    await page.getByRole('button', { name: 'Join Waitlist' }).click()
    
    // Browser should show validation message
    const emailInput = page.getByLabel('Email Address *')
    await expect(emailInput).toHaveAttribute('type', 'email')
  })

  test('successfully submits waitlist form with email only', async ({ page }) => {
    // Mock the API response
    await page.route('/api/waitlist', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Successfully added to waitlist',
          id: 'test-id',
          email: 'test@example.com'
        })
      })
    })

    // Fill in email and submit
    await page.getByLabel('Email Address *').fill('test@example.com')
    await page.getByRole('button', { name: 'Join Waitlist' }).click()

    // Check loading state
    await expect(page.getByRole('button', { name: 'Joining...' })).toBeVisible()

    // Check success state
    await expect(page.getByText('You\'re on the list!')).toBeVisible()
    await expect(page.getByText('We\'ll notify you when OneDettyDecember launches.')).toBeVisible()
    await expect(page.getByText('✓')).toBeVisible()
  })

  test('successfully submits waitlist form with full details', async ({ page }) => {
    // Mock the API response
    await page.route('/api/waitlist', async (route) => {
      const request = route.request()
      const postData = request.postDataJSON()
      
      // Verify the request data
      expect(postData.email).toBe('john.doe@example.com')
      expect(postData.firstName).toBe('John')
      expect(postData.lastName).toBe('Doe')
      expect(postData.source).toBe('landing-page')

      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Successfully added to waitlist',
          id: 'test-id',
          email: 'john.doe@example.com'
        })
      })
    })

    // Fill in all fields
    await page.getByLabel('Email Address *').fill('john.doe@example.com')
    await page.getByLabel('First Name').fill('John')
    await page.getByLabel('Last Name').fill('Doe')
    
    // Submit form
    await page.getByRole('button', { name: 'Join Waitlist' }).click()

    // Check success state
    await expect(page.getByText('You\'re on the list!')).toBeVisible()
  })

  test('handles API errors gracefully', async ({ page }) => {
    // Mock API error response
    await page.route('/api/waitlist', async (route) => {
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Email already registered for waitlist'
        })
      })
    })

    // Fill in email and submit
    await page.getByLabel('Email Address *').fill('existing@example.com')
    await page.getByRole('button', { name: 'Join Waitlist' }).click()

    // Check error message
    await expect(page.getByRole('alert')).toContainText('Email already registered for waitlist')
    
    // Form should still be visible (not success state)
    await expect(page.getByRole('button', { name: 'Join Waitlist' })).toBeVisible()
  })

  test('handles network errors', async ({ page }) => {
    // Mock network failure
    await page.route('/api/waitlist', async (route) => {
      await route.abort('failed')
    })

    // Fill in email and submit
    await page.getByLabel('Email Address *').fill('test@example.com')
    await page.getByRole('button', { name: 'Join Waitlist' }).click()

    // Check error message
    await expect(page.getByRole('alert')).toContainText('Something went wrong')
  })

  test('form is accessible via keyboard navigation', async ({ page }) => {
    // Tab through form elements
    await page.keyboard.press('Tab')
    await expect(page.getByLabel('Email Address *')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.getByLabel('First Name')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.getByLabel('Last Name')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: 'Join Waitlist' })).toBeFocused()
  })
})
