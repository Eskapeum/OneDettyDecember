import { test, expect } from '@playwright/test'

test.describe('Password Reset Flow', () => {
  test.describe('Request Password Reset', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/auth/forgot-password')
    })

    test('displays password reset request form', async ({ page }) => {
      // Check page title and heading
      await expect(page).toHaveTitle(/Forgot Password - OneDettyDecember/)
      await expect(page.getByRole('heading', { name: /forgot your password/i })).toBeVisible()

      // Check form elements
      await expect(page.getByLabel(/email address/i)).toBeVisible()
      await expect(page.getByRole('button', { name: /send reset link/i })).toBeVisible()
      await expect(page.getByText(/enter your email to receive a password reset link/i)).toBeVisible()

      // Check navigation links
      await expect(page.getByRole('link', { name: /back to login/i })).toBeVisible()
    })

    test('validates email field', async ({ page }) => {
      // Try to submit empty form
      await page.getByRole('button', { name: /send reset link/i }).click()
      await expect(page.getByText(/email is required/i)).toBeVisible()

      // Test invalid email format
      await page.getByLabel(/email address/i).fill('invalid-email')
      await page.getByRole('button', { name: /send reset link/i }).click()
      await expect(page.getByText(/please enter a valid email/i)).toBeVisible()
    })

    test('successfully sends reset link', async ({ page }) => {
      // Mock successful password reset request
      await page.route('/api/auth/password-reset', async (route) => {
        const request = route.request()
        const postData = request.postDataJSON()

        expect(postData.email).toBe('john@example.com')

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Password reset email sent',
          }),
        })
      })

      // Fill and submit form
      await page.getByLabel(/email address/i).fill('john@example.com')
      await page.getByRole('button', { name: /send reset link/i }).click()

      // Check loading state
      await expect(page.getByRole('button', { name: /sending/i })).toBeVisible()

      // Check success message
      await expect(page.getByText(/password reset link sent/i)).toBeVisible()
      await expect(page.getByText(/check your email for the reset link/i)).toBeVisible()
    })

    test('handles email not found gracefully', async ({ page }) => {
      // Mock email not found (but still return success for security)
      await page.route('/api/auth/password-reset', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Password reset email sent',
          }),
        })
      })

      await page.getByLabel(/email address/i).fill('notfound@example.com')
      await page.getByRole('button', { name: /send reset link/i }).click()

      // Should still show success message for security
      await expect(page.getByText(/password reset link sent/i)).toBeVisible()
    })

    test('handles rate limiting', async ({ page }) => {
      // Mock rate limit error
      await page.route('/api/auth/password-reset', async (route) => {
        await route.fulfill({
          status: 429,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Too many password reset requests. Please try again later.',
          }),
        })
      })

      await page.getByLabel(/email address/i).fill('john@example.com')
      await page.getByRole('button', { name: /send reset link/i }).click()

      await expect(page.getByRole('alert')).toContainText(/too many password reset requests/i)
    })

    test('navigation links work correctly', async ({ page }) => {
      await page.getByRole('link', { name: /back to login/i }).click()
      await expect(page).toHaveURL(/\/auth\/login/)
    })
  })

  test.describe('Reset Password with Token', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to reset page with token
      await page.goto('/auth/reset-password?token=reset-token-123&email=john@example.com')
    })

    test('displays password reset form with token', async ({ page }) => {
      // Check page title and heading
      await expect(page).toHaveTitle(/Reset Password - OneDettyDecember/)
      await expect(page.getByRole('heading', { name: /reset your password/i })).toBeVisible()

      // Check form elements
      await expect(page.getByLabel(/new password/i)).toBeVisible()
      await expect(page.getByLabel(/confirm password/i)).toBeVisible()
      await expect(page.getByRole('button', { name: /reset password/i })).toBeVisible()

      // Check email display
      await expect(page.getByText(/john@example.com/i)).toBeVisible()
    })

    test('validates password requirements', async ({ page }) => {
      // Test empty passwords
      await page.getByRole('button', { name: /reset password/i }).click()
      await expect(page.getByText(/password is required/i)).toBeVisible()

      // Test password length
      await page.getByLabel(/new password/i).fill('123')
      await page.getByLabel(/confirm password/i).click() // Trigger blur
      await expect(page.getByText(/password must be at least 8 characters/i)).toBeVisible()

      // Test password confirmation
      await page.getByLabel(/new password/i).fill('newpassword123')
      await page.getByLabel(/confirm password/i).fill('different123')
      await page.getByRole('button', { name: /reset password/i }).click()
      await expect(page.getByText(/passwords do not match/i)).toBeVisible()
    })

    test('successfully resets password', async ({ page }) => {
      // Mock successful password reset
      await page.route('/api/auth/password-reset', async (route) => {
        const request = route.request()
        const postData = request.postDataJSON()

        expect(postData.token).toBe('reset-token-123')
        expect(postData.email).toBe('john@example.com')
        expect(postData.password).toBe('newpassword123')

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Password reset successful',
          }),
        })
      })

      // Fill and submit form
      await page.getByLabel(/new password/i).fill('newpassword123')
      await page.getByLabel(/confirm password/i).fill('newpassword123')
      await page.getByRole('button', { name: /reset password/i }).click()

      // Check loading state
      await expect(page.getByRole('button', { name: /resetting password/i })).toBeVisible()

      // Check success message and redirect
      await expect(page.getByText(/password reset successful/i)).toBeVisible()
      await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible()
    })

    test('handles invalid token', async ({ page }) => {
      // Mock invalid token error
      await page.route('/api/auth/password-reset', async (route) => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Invalid or expired reset token',
          }),
        })
      })

      await page.getByLabel(/new password/i).fill('newpassword123')
      await page.getByLabel(/confirm password/i).fill('newpassword123')
      await page.getByRole('button', { name: /reset password/i }).click()

      // Check error message and new request link
      await expect(page.getByRole('alert')).toContainText(/invalid or expired token/i)
      await expect(page.getByRole('link', { name: /request new reset link/i })).toBeVisible()
    })

    test('handles expired token', async ({ page }) => {
      // Mock expired token error
      await page.route('/api/auth/password-reset', async (route) => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Reset token has expired',
          }),
        })
      })

      await page.getByLabel(/new password/i).fill('newpassword123')
      await page.getByLabel(/confirm password/i).fill('newpassword123')
      await page.getByRole('button', { name: /reset password/i }).click()

      await expect(page.getByRole('alert')).toContainText(/token has expired/i)
    })

    test('shows password strength indicator', async ({ page }) => {
      const passwordInput = page.getByLabel(/new password/i)
      
      // Test weak password
      await passwordInput.fill('weak')
      await expect(page.getByText(/weak/i)).toBeVisible()

      // Test medium password
      await passwordInput.fill('password123')
      await expect(page.getByText(/medium/i)).toBeVisible()

      // Test strong password
      await passwordInput.fill('StrongPassword123!')
      await expect(page.getByText(/strong/i)).toBeVisible()
    })

    test('password visibility toggle works', async ({ page }) => {
      const newPasswordInput = page.getByLabel(/new password/i)
      const confirmPasswordInput = page.getByLabel(/confirm password/i)
      
      // Initially passwords should be hidden
      await expect(newPasswordInput).toHaveAttribute('type', 'password')
      await expect(confirmPasswordInput).toHaveAttribute('type', 'password')

      // Click toggle to show passwords
      await page.getByRole('button', { name: /show passwords/i }).click()
      await expect(newPasswordInput).toHaveAttribute('type', 'text')
      await expect(confirmPasswordInput).toHaveAttribute('type', 'text')

      // Click toggle to hide passwords again
      await page.getByRole('button', { name: /hide passwords/i }).click()
      await expect(newPasswordInput).toHaveAttribute('type', 'password')
      await expect(confirmPasswordInput).toHaveAttribute('type', 'password')
    })

    test('redirects to login after successful reset', async ({ page }) => {
      // Mock successful password reset
      await page.route('/api/auth/password-reset', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Password reset successful',
          }),
        })
      })

      await page.getByLabel(/new password/i).fill('newpassword123')
      await page.getByLabel(/confirm password/i).fill('newpassword123')
      await page.getByRole('button', { name: /reset password/i }).click()

      // Click sign in link
      await page.getByRole('link', { name: /sign in/i }).click()
      await expect(page).toHaveURL(/\/auth\/login\?message=password-reset-success/)
    })
  })

  test.describe('Invalid Token Scenarios', () => {
    test('handles missing token parameter', async ({ page }) => {
      await page.goto('/auth/reset-password')

      // Should show error message
      await expect(page.getByText(/invalid reset link/i)).toBeVisible()
      await expect(page.getByRole('link', { name: /request new reset link/i })).toBeVisible()
    })

    test('handles missing email parameter', async ({ page }) => {
      await page.goto('/auth/reset-password?token=reset-token-123')

      // Should show error message
      await expect(page.getByText(/invalid reset link/i)).toBeVisible()
      await expect(page.getByRole('link', { name: /request new reset link/i })).toBeVisible()
    })

    test('handles malformed token', async ({ page }) => {
      await page.goto('/auth/reset-password?token=invalid&email=john@example.com')

      // Mock token validation error
      await page.route('/api/auth/password-reset', async (route) => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Malformed reset token',
          }),
        })
      })

      await page.getByLabel(/new password/i).fill('newpassword123')
      await page.getByLabel(/confirm password/i).fill('newpassword123')
      await page.getByRole('button', { name: /reset password/i }).click()

      await expect(page.getByRole('alert')).toContainText(/malformed reset token/i)
    })
  })

  test.describe('Accessibility', () => {
    test('form is accessible via keyboard navigation', async ({ page }) => {
      await page.goto('/auth/reset-password?token=reset-token-123&email=john@example.com')

      // Tab through form elements
      await page.keyboard.press('Tab')
      await expect(page.getByLabel(/new password/i)).toBeFocused()

      await page.keyboard.press('Tab')
      await expect(page.getByLabel(/confirm password/i)).toBeFocused()

      await page.keyboard.press('Tab')
      await expect(page.getByRole('button', { name: /reset password/i })).toBeFocused()
    })

    test('has proper ARIA labels and announcements', async ({ page }) => {
      await page.goto('/auth/reset-password?token=reset-token-123&email=john@example.com')

      // Check ARIA attributes
      await expect(page.getByLabel(/new password/i)).toHaveAttribute('aria-required', 'true')
      await expect(page.getByLabel(/confirm password/i)).toHaveAttribute('aria-required', 'true')

      // Test error announcements
      await page.getByRole('button', { name: /reset password/i }).click()
      
      const errorMessage = page.getByText(/password is required/i)
      await expect(errorMessage).toHaveAttribute('role', 'alert')
      await expect(errorMessage).toHaveAttribute('aria-live', 'polite')
    })
  })

  test.describe('Security', () => {
    test('prevents token reuse', async ({ page }) => {
      await page.goto('/auth/reset-password?token=used-token-123&email=john@example.com')

      // Mock token already used error
      await page.route('/api/auth/password-reset', async (route) => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Reset token has already been used',
          }),
        })
      })

      await page.getByLabel(/new password/i).fill('newpassword123')
      await page.getByLabel(/confirm password/i).fill('newpassword123')
      await page.getByRole('button', { name: /reset password/i }).click()

      await expect(page.getByRole('alert')).toContainText(/token has already been used/i)
    })

    test('handles network errors gracefully', async ({ page }) => {
      await page.goto('/auth/reset-password?token=reset-token-123&email=john@example.com')

      // Mock network failure
      await page.route('/api/auth/password-reset', async (route) => {
        await route.abort('failed')
      })

      await page.getByLabel(/new password/i).fill('newpassword123')
      await page.getByLabel(/confirm password/i).fill('newpassword123')
      await page.getByRole('button', { name: /reset password/i }).click()

      await expect(page.getByRole('alert')).toContainText(/network error/i)
    })
  })
})
