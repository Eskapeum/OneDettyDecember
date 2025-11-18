import { test, expect } from '@playwright/test'

test.describe('User Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/register')
  })

  test('displays registration form correctly', async ({ page }) => {
    // Check page title and heading
    await expect(page).toHaveTitle(/Register - OneDettyDecember/)
    await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible()

    // Check form fields
    await expect(page.getByLabel(/first name/i)).toBeVisible()
    await expect(page.getByLabel(/last name/i)).toBeVisible()
    await expect(page.getByLabel(/email address/i)).toBeVisible()
    await expect(page.getByLabel(/^password/i)).toBeVisible()
    await expect(page.getByLabel(/confirm password/i)).toBeVisible()
    await expect(page.getByLabel(/agree to terms/i)).toBeVisible()

    // Check OAuth options
    await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /continue with facebook/i })).toBeVisible()

    // Check links
    await expect(page.getByRole('link', { name: /terms of service/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /privacy policy/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /already have an account/i })).toBeVisible()
  })

  test('validates form fields', async ({ page }) => {
    // Try to submit empty form
    await page.getByRole('button', { name: /create account/i }).click()

    // Check validation messages
    await expect(page.getByText(/first name is required/i)).toBeVisible()
    await expect(page.getByText(/email is required/i)).toBeVisible()
    await expect(page.getByText(/password is required/i)).toBeVisible()

    // Test email validation
    await page.getByLabel(/email address/i).fill('invalid-email')
    await page.getByLabel(/first name/i).click() // Trigger blur
    await expect(page.getByText(/please enter a valid email/i)).toBeVisible()

    // Test password validation
    await page.getByLabel(/^password/i).fill('123')
    await page.getByLabel(/first name/i).click() // Trigger blur
    await expect(page.getByText(/password must be at least 8 characters/i)).toBeVisible()

    // Test password confirmation
    await page.getByLabel(/^password/i).fill('password123')
    await page.getByLabel(/confirm password/i).fill('different123')
    await page.getByLabel(/first name/i).click() // Trigger blur
    await expect(page.getByText(/passwords do not match/i)).toBeVisible()
  })

  test('requires terms acceptance', async ({ page }) => {
    // Fill valid form data but don't check terms
    await page.getByLabel(/first name/i).fill('John')
    await page.getByLabel(/last name/i).fill('Doe')
    await page.getByLabel(/email address/i).fill('john@example.com')
    await page.getByLabel(/^password/i).fill('password123')
    await page.getByLabel(/confirm password/i).fill('password123')

    await page.getByRole('button', { name: /create account/i }).click()
    await expect(page.getByText(/you must agree to the terms/i)).toBeVisible()
  })

  test('successfully registers new user', async ({ page }) => {
    // Mock successful registration API
    await page.route('/api/auth/register', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: {
            id: 'user-123',
            email: 'john@example.com',
            firstName: 'John',
            lastName: 'Doe',
            emailVerified: false,
          },
          message: 'Registration successful. Please check your email for verification.',
        }),
      })
    })

    // Fill registration form
    await page.getByLabel(/first name/i).fill('John')
    await page.getByLabel(/last name/i).fill('Doe')
    await page.getByLabel(/email address/i).fill('john@example.com')
    await page.getByLabel(/^password/i).fill('password123')
    await page.getByLabel(/confirm password/i).fill('password123')
    await page.getByLabel(/agree to terms/i).check()

    // Submit form
    await page.getByRole('button', { name: /create account/i }).click()

    // Check loading state
    await expect(page.getByRole('button', { name: /creating account/i })).toBeVisible()

    // Check redirect to verification page
    await expect(page).toHaveURL(/\/auth\/verify-email/)
    await expect(page.getByText(/check your email/i)).toBeVisible()
    await expect(page.getByText(/john@example.com/i)).toBeVisible()
  })

  test('handles registration errors', async ({ page }) => {
    // Mock registration error
    await page.route('/api/auth/register', async (route) => {
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Email already registered',
        }),
      })
    })

    // Fill and submit form
    await page.getByLabel(/first name/i).fill('John')
    await page.getByLabel(/last name/i).fill('Doe')
    await page.getByLabel(/email address/i).fill('existing@example.com')
    await page.getByLabel(/^password/i).fill('password123')
    await page.getByLabel(/confirm password/i).fill('password123')
    await page.getByLabel(/agree to terms/i).check()

    await page.getByRole('button', { name: /create account/i }).click()

    // Check error message
    await expect(page.getByRole('alert')).toContainText(/email already registered/i)
    
    // Form should still be visible
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible()
  })

  test('Google OAuth registration flow', async ({ page }) => {
    // Mock Google OAuth popup
    await page.route('https://accounts.google.com/oauth/authorize*', async (route) => {
      // Simulate OAuth success callback
      await route.fulfill({
        status: 302,
        headers: {
          Location: '/api/auth/oauth/callback?provider=google&code=auth-code-123&state=csrf-token',
        },
      })
    })

    // Mock OAuth callback API
    await page.route('/api/auth/oauth/callback*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: {
            id: 'user-456',
            email: 'john.google@example.com',
            firstName: 'John',
            lastName: 'Google',
            emailVerified: true,
          },
          token: 'jwt-token-123',
        }),
      })
    })

    // Click Google OAuth button
    await page.getByRole('button', { name: /continue with google/i }).click()

    // Should redirect to dashboard after successful OAuth
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('Facebook OAuth registration flow', async ({ page }) => {
    // Mock Facebook OAuth
    await page.route('https://www.facebook.com/v18.0/dialog/oauth*', async (route) => {
      await route.fulfill({
        status: 302,
        headers: {
          Location: '/api/auth/oauth/callback?provider=facebook&code=fb-auth-code-123&state=csrf-token',
        },
      })
    })

    // Mock OAuth callback API
    await page.route('/api/auth/oauth/callback*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: {
            id: 'user-789',
            email: 'jane.facebook@example.com',
            firstName: 'Jane',
            lastName: 'Facebook',
            emailVerified: true,
          },
          token: 'jwt-token-456',
        }),
      })
    })

    // Click Facebook OAuth button
    await page.getByRole('button', { name: /continue with facebook/i }).click()

    // Should redirect to dashboard after successful OAuth
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('handles OAuth errors', async ({ page }) => {
    // Mock OAuth error
    await page.route('/api/auth/oauth/callback*', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'OAuth authentication failed',
        }),
      })
    })

    // Mock OAuth provider error response
    await page.route('https://accounts.google.com/oauth/authorize*', async (route) => {
      await route.fulfill({
        status: 302,
        headers: {
          Location: '/api/auth/oauth/callback?error=access_denied&error_description=User denied access',
        },
      })
    })

    await page.getByRole('button', { name: /continue with google/i }).click()

    // Should show error message
    await expect(page.getByRole('alert')).toContainText(/oauth authentication failed/i)
  })

  test('navigation links work correctly', async ({ page }) => {
    // Test login link
    await page.getByRole('link', { name: /already have an account/i }).click()
    await expect(page).toHaveURL(/\/auth\/login/)

    // Go back to register
    await page.goto('/auth/register')

    // Test terms of service link
    const termsLink = page.getByRole('link', { name: /terms of service/i })
    await expect(termsLink).toHaveAttribute('href', '/legal/terms')

    // Test privacy policy link
    const privacyLink = page.getByRole('link', { name: /privacy policy/i })
    await expect(privacyLink).toHaveAttribute('href', '/legal/privacy')
  })

  test('form is accessible via keyboard navigation', async ({ page }) => {
    // Tab through form elements
    await page.keyboard.press('Tab')
    await expect(page.getByLabel(/first name/i)).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(page.getByLabel(/last name/i)).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(page.getByLabel(/email address/i)).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(page.getByLabel(/^password/i)).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(page.getByLabel(/confirm password/i)).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(page.getByLabel(/agree to terms/i)).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: /create account/i })).toBeFocused()
  })

  test('password strength indicator works', async ({ page }) => {
    const passwordInput = page.getByLabel(/^password/i)
    
    // Test weak password
    await passwordInput.fill('123')
    await expect(page.getByText(/weak/i)).toBeVisible()

    // Test medium password
    await passwordInput.fill('password123')
    await expect(page.getByText(/medium/i)).toBeVisible()

    // Test strong password
    await passwordInput.fill('StrongPassword123!')
    await expect(page.getByText(/strong/i)).toBeVisible()
  })

  test('handles network errors gracefully', async ({ page }) => {
    // Mock network failure
    await page.route('/api/auth/register', async (route) => {
      await route.abort('failed')
    })

    // Fill and submit form
    await page.getByLabel(/first name/i).fill('John')
    await page.getByLabel(/last name/i).fill('Doe')
    await page.getByLabel(/email address/i).fill('john@example.com')
    await page.getByLabel(/^password/i).fill('password123')
    await page.getByLabel(/confirm password/i).fill('password123')
    await page.getByLabel(/agree to terms/i).check()

    await page.getByRole('button', { name: /create account/i }).click()

    // Check error message
    await expect(page.getByRole('alert')).toContainText(/network error/i)
  })
})
