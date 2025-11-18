import { test, expect } from '@playwright/test'

test.describe('User Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login')
  })

  test('displays login form correctly', async ({ page }) => {
    // Check page title and heading
    await expect(page).toHaveTitle(/Sign In - OneDettyDecember/)
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible()

    // Check form fields
    await expect(page.getByLabel(/email address/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByLabel(/remember me/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()

    // Check OAuth options
    await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /continue with facebook/i })).toBeVisible()

    // Check links
    await expect(page.getByRole('link', { name: /forgot password/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /create account/i })).toBeVisible()
  })

  test('validates form fields', async ({ page }) => {
    // Try to submit empty form
    await page.getByRole('button', { name: /sign in/i }).click()

    // Check validation messages
    await expect(page.getByText(/email is required/i)).toBeVisible()
    await expect(page.getByText(/password is required/i)).toBeVisible()

    // Test email validation
    await page.getByLabel(/email address/i).fill('invalid-email')
    await page.getByLabel(/password/i).click() // Trigger blur
    await expect(page.getByText(/please enter a valid email/i)).toBeVisible()

    // Test minimum password length
    await page.getByLabel(/password/i).fill('123')
    await page.getByLabel(/email address/i).click() // Trigger blur
    await expect(page.getByText(/password must be at least 6 characters/i)).toBeVisible()
  })

  test('successfully logs in with valid credentials', async ({ page }) => {
    // Mock successful login API
    await page.route('/api/auth/login', async (route) => {
      const request = route.request()
      const postData = request.postDataJSON()

      expect(postData.email).toBe('john@example.com')
      expect(postData.password).toBe('password123')
      expect(postData.rememberMe).toBe(false)

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: {
            id: 'user-123',
            email: 'john@example.com',
            firstName: 'John',
            lastName: 'Doe',
            emailVerified: true,
          },
          token: 'jwt-token-123',
        }),
      })
    })

    // Fill login form
    await page.getByLabel(/email address/i).fill('john@example.com')
    await page.getByLabel(/password/i).fill('password123')

    // Submit form
    await page.getByRole('button', { name: /sign in/i }).click()

    // Check loading state
    await expect(page.getByRole('button', { name: /signing in/i })).toBeVisible()

    // Check redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('handles remember me option', async ({ page }) => {
    // Mock login API with remember me
    await page.route('/api/auth/login', async (route) => {
      const request = route.request()
      const postData = request.postDataJSON()

      expect(postData.rememberMe).toBe(true)

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: { id: 'user-123', email: 'john@example.com' },
          token: 'jwt-token-123',
        }),
      })
    })

    // Fill form and check remember me
    await page.getByLabel(/email address/i).fill('john@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByLabel(/remember me/i).check()

    await page.getByRole('button', { name: /sign in/i }).click()

    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('handles invalid credentials', async ({ page }) => {
    // Mock login error
    await page.route('/api/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Invalid email or password',
        }),
      })
    })

    // Fill and submit form
    await page.getByLabel(/email address/i).fill('wrong@example.com')
    await page.getByLabel(/password/i).fill('wrongpassword')

    await page.getByRole('button', { name: /sign in/i }).click()

    // Check error message
    await expect(page.getByRole('alert')).toContainText(/invalid email or password/i)
    
    // Form should still be visible
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('handles unverified email', async ({ page }) => {
    // Mock unverified email error
    await page.route('/api/auth/login', async (route) => {
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Please verify your email address before logging in',
          code: 'EMAIL_NOT_VERIFIED',
        }),
      })
    })

    await page.getByLabel(/email address/i).fill('unverified@example.com')
    await page.getByLabel(/password/i).fill('password123')

    await page.getByRole('button', { name: /sign in/i }).click()

    // Check error message and resend link
    await expect(page.getByRole('alert')).toContainText(/please verify your email/i)
    await expect(page.getByRole('link', { name: /resend verification/i })).toBeVisible()
  })

  test('handles account suspension', async ({ page }) => {
    // Mock suspended account error
    await page.route('/api/auth/login', async (route) => {
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Account has been suspended',
          code: 'ACCOUNT_SUSPENDED',
        }),
      })
    })

    await page.getByLabel(/email address/i).fill('suspended@example.com')
    await page.getByLabel(/password/i).fill('password123')

    await page.getByRole('button', { name: /sign in/i }).click()

    // Check error message
    await expect(page.getByRole('alert')).toContainText(/account has been suspended/i)
  })

  test('handles rate limiting', async ({ page }) => {
    // Mock rate limit error
    await page.route('/api/auth/login', async (route) => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Too many login attempts. Please try again later.',
        }),
      })
    })

    await page.getByLabel(/email address/i).fill('john@example.com')
    await page.getByLabel(/password/i).fill('password123')

    await page.getByRole('button', { name: /sign in/i }).click()

    // Check rate limit message
    await expect(page.getByRole('alert')).toContainText(/too many login attempts/i)
  })

  test('Google OAuth login flow', async ({ page }) => {
    // Mock Google OAuth
    await page.route('https://accounts.google.com/oauth/authorize*', async (route) => {
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
          token: 'jwt-token-456',
        }),
      })
    })

    await page.getByRole('button', { name: /continue with google/i }).click()

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('Facebook OAuth login flow', async ({ page }) => {
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
          token: 'jwt-token-789',
        }),
      })
    })

    await page.getByRole('button', { name: /continue with facebook/i }).click()

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('password visibility toggle works', async ({ page }) => {
    const passwordInput = page.getByLabel(/password/i)
    const toggleButton = page.getByRole('button', { name: /show password/i })

    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password')

    // Click toggle to show password
    await toggleButton.click()
    await expect(passwordInput).toHaveAttribute('type', 'text')
    await expect(page.getByRole('button', { name: /hide password/i })).toBeVisible()

    // Click toggle to hide password again
    await page.getByRole('button', { name: /hide password/i }).click()
    await expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('navigation links work correctly', async ({ page }) => {
    // Test forgot password link
    await page.getByRole('link', { name: /forgot password/i }).click()
    await expect(page).toHaveURL(/\/auth\/forgot-password/)

    // Go back to login
    await page.goto('/auth/login')

    // Test create account link
    await page.getByRole('link', { name: /create account/i }).click()
    await expect(page).toHaveURL(/\/auth\/register/)
  })

  test('form is accessible via keyboard navigation', async ({ page }) => {
    // Tab through form elements
    await page.keyboard.press('Tab')
    await expect(page.getByLabel(/email address/i)).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(page.getByLabel(/password/i)).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(page.getByLabel(/remember me/i)).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: /sign in/i })).toBeFocused()

    // Test form submission with Enter key
    await page.getByLabel(/email address/i).fill('john@example.com')
    await page.getByLabel(/password/i).fill('password123')
    
    // Mock successful login
    await page.route('/api/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: { id: 'user-123', email: 'john@example.com' },
          token: 'jwt-token-123',
        }),
      })
    })

    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('handles network errors gracefully', async ({ page }) => {
    // Mock network failure
    await page.route('/api/auth/login', async (route) => {
      await route.abort('failed')
    })

    await page.getByLabel(/email address/i).fill('john@example.com')
    await page.getByLabel(/password/i).fill('password123')

    await page.getByRole('button', { name: /sign in/i }).click()

    // Check error message
    await expect(page.getByRole('alert')).toContainText(/network error/i)
  })

  test('redirects to intended page after login', async ({ page }) => {
    // Try to access protected page first
    await page.goto('/dashboard/profile')
    
    // Should redirect to login with return URL
    await expect(page).toHaveURL(/\/auth\/login\?returnUrl=/)

    // Mock successful login
    await page.route('/api/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: { id: 'user-123', email: 'john@example.com' },
          token: 'jwt-token-123',
        }),
      })
    })

    // Login
    await page.getByLabel(/email address/i).fill('john@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()

    // Should redirect to originally intended page
    await expect(page).toHaveURL(/\/dashboard\/profile/)
  })
})
