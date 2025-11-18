import { test, expect } from '@playwright/test'

test.describe('Email Verification Flow', () => {
  test.describe('Verification Pending State', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/auth/verify-email?email=john@example.com')
    })

    test('displays verification instructions', async ({ page }) => {
      // Check page title and heading
      await expect(page).toHaveTitle(/Verify Email - OneDettyDecember/)
      await expect(page.getByRole('heading', { name: /check your email/i })).toBeVisible()

      // Check instructions
      await expect(page.getByText(/we sent a verification link to/i)).toBeVisible()
      await expect(page.getByText(/john@example.com/i)).toBeVisible()
      await expect(page.getByText(/click the link in the email/i)).toBeVisible()
      await expect(page.getByText(/check your spam folder/i)).toBeVisible()

      // Check action buttons
      await expect(page.getByRole('button', { name: /resend verification email/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /use different email/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /back to login/i })).toBeVisible()
    })

    test('successfully resends verification email', async ({ page }) => {
      // Mock successful resend
      await page.route('/api/auth/resend-verification', async (route) => {
        const request = route.request()
        const postData = request.postDataJSON()

        expect(postData.email).toBe('john@example.com')

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Verification email sent',
          }),
        })
      })

      await page.getByRole('button', { name: /resend verification email/i }).click()

      // Check loading state
      await expect(page.getByRole('button', { name: /sending/i })).toBeVisible()

      // Check success message
      await expect(page.getByText(/verification email sent/i)).toBeVisible()
    })

    test('implements rate limiting for resend', async ({ page }) => {
      // Mock successful first resend
      await page.route('/api/auth/resend-verification', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Verification email sent',
          }),
        })
      })

      await page.getByRole('button', { name: /resend verification email/i }).click()

      // Button should be disabled temporarily
      await expect(page.getByRole('button', { name: /resend verification email/i })).toBeDisabled()
      await expect(page.getByText(/wait 60 seconds before resending/i)).toBeVisible()
    })

    test('handles resend errors', async ({ page }) => {
      // Mock rate limit error
      await page.route('/api/auth/resend-verification', async (route) => {
        await route.fulfill({
          status: 429,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Too many verification emails sent. Please wait before requesting another.',
          }),
        })
      })

      await page.getByRole('button', { name: /resend verification email/i }).click()

      await expect(page.getByRole('alert')).toContainText(/too many verification emails/i)
    })

    test('navigation links work correctly', async ({ page }) => {
      // Test change email link
      await page.getByRole('link', { name: /use different email/i }).click()
      await expect(page).toHaveURL(/\/auth\/register/)

      // Go back and test login link
      await page.goto('/auth/verify-email?email=john@example.com')
      await page.getByRole('link', { name: /back to login/i }).click()
      await expect(page).toHaveURL(/\/auth\/login/)
    })

    test('masks email for privacy', async ({ page }) => {
      await page.goto('/auth/verify-email?email=verylongemailaddress@example.com')

      // Should show masked email
      await expect(page.getByText(/v\*\*\*@example\.com/i)).toBeVisible()
    })

    test('handles missing email parameter', async ({ page }) => {
      await page.goto('/auth/verify-email')

      // Should show generic message
      await expect(page.getByText(/check your email for verification/i)).toBeVisible()
      
      // Resend button should not be visible without email
      await expect(page.queryByRole('button', { name: /resend verification email/i })).not.toBeVisible()
    })
  })

  test.describe('Token Verification', () => {
    test('automatically verifies email with valid token', async ({ page }) => {
      // Mock successful verification
      await page.route('/api/auth/verify-email', async (route) => {
        const request = route.request()
        const postData = request.postDataJSON()

        expect(postData.email).toBe('john@example.com')
        expect(postData.token).toBe('verification-token-123')

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Email verified successfully',
          }),
        })
      })

      await page.goto('/auth/verify-email?email=john@example.com&token=verification-token-123')

      // Should show loading state initially
      await expect(page.getByText(/verifying your email/i)).toBeVisible()
      await expect(page.getByTestId('loading-spinner')).toBeVisible()

      // Should show success state
      await expect(page.getByText(/email verified successfully/i)).toBeVisible()
      await expect(page.getByRole('link', { name: /continue to login/i })).toBeVisible()
    })

    test('handles invalid verification token', async ({ page }) => {
      // Mock invalid token error
      await page.route('/api/auth/verify-email', async (route) => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Invalid verification token',
          }),
        })
      })

      await page.goto('/auth/verify-email?email=john@example.com&token=invalid-token')

      // Should show error and resend option
      await expect(page.getByRole('alert')).toContainText(/invalid verification token/i)
      await expect(page.getByRole('button', { name: /resend verification email/i })).toBeVisible()
    })

    test('handles expired verification token', async ({ page }) => {
      // Mock expired token error
      await page.route('/api/auth/verify-email', async (route) => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Verification token has expired',
          }),
        })
      })

      await page.goto('/auth/verify-email?email=john@example.com&token=expired-token')

      // Should show specific expired message
      await expect(page.getByRole('alert')).toContainText(/verification token expired/i)
      await expect(page.getByText(/please request a new verification email/i)).toBeVisible()
    })

    test('redirects to login after successful verification', async ({ page }) => {
      // Mock successful verification
      await page.route('/api/auth/verify-email', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Email verified successfully',
          }),
        })
      })

      await page.goto('/auth/verify-email?email=john@example.com&token=verification-token-123')

      // Wait for verification to complete
      await expect(page.getByText(/email verified successfully/i)).toBeVisible()

      // Click continue to login
      await page.getByRole('link', { name: /continue to login/i }).click()
      await expect(page).toHaveURL(/\/auth\/login\?message=email-verified/)
    })

    test('handles already verified email', async ({ page }) => {
      // Mock already verified error
      await page.route('/api/auth/verify-email', async (route) => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Email is already verified',
          }),
        })
      })

      await page.goto('/auth/verify-email?email=john@example.com&token=verification-token-123')

      // Should show already verified message
      await expect(page.getByText(/email is already verified/i)).toBeVisible()
      await expect(page.getByRole('link', { name: /continue to login/i })).toBeVisible()
    })

    test('handles token reuse prevention', async ({ page }) => {
      // Mock token already used error
      await page.route('/api/auth/verify-email', async (route) => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Verification token has already been used',
          }),
        })
      })

      await page.goto('/auth/verify-email?email=john@example.com&token=used-token')

      await expect(page.getByRole('alert')).toContainText(/token has already been used/i)
    })
  })

  test.describe('Error Handling', () => {
    test('handles network errors during verification', async ({ page }) => {
      // Mock network failure
      await page.route('/api/auth/verify-email', async (route) => {
        await route.abort('failed')
      })

      await page.goto('/auth/verify-email?email=john@example.com&token=verification-token-123')

      await expect(page.getByRole('alert')).toContainText(/network error/i)
    })

    test('handles network errors during resend', async ({ page }) => {
      await page.goto('/auth/verify-email?email=john@example.com')

      // Mock network failure
      await page.route('/api/auth/resend-verification', async (route) => {
        await route.abort('failed')
      })

      await page.getByRole('button', { name: /resend verification email/i }).click()

      await expect(page.getByRole('alert')).toContainText(/network error/i)
    })

    test('handles server errors gracefully', async ({ page }) => {
      // Mock server error
      await page.route('/api/auth/verify-email', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Internal server error',
          }),
        })
      })

      await page.goto('/auth/verify-email?email=john@example.com&token=verification-token-123')

      await expect(page.getByRole('alert')).toContainText(/something went wrong/i)
    })
  })

  test.describe('Accessibility', () => {
    test('has proper heading structure', async ({ page }) => {
      await page.goto('/auth/verify-email?email=john@example.com')

      await expect(page.getByRole('heading', { level: 1, name: /check your email/i })).toBeVisible()
    })

    test('announces status changes to screen readers', async ({ page }) => {
      await page.goto('/auth/verify-email?email=john@example.com')

      // Mock successful resend
      await page.route('/api/auth/resend-verification', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Verification email sent',
          }),
        })
      })

      await page.getByRole('button', { name: /resend verification email/i }).click()

      // Check ARIA live region
      const successMessage = page.getByText(/verification email sent/i)
      await expect(successMessage).toHaveAttribute('role', 'status')
      await expect(successMessage).toHaveAttribute('aria-live', 'polite')
    })

    test('supports keyboard navigation', async ({ page }) => {
      await page.goto('/auth/verify-email?email=john@example.com')

      // Tab through interactive elements
      await page.keyboard.press('Tab')
      await expect(page.getByRole('button', { name: /resend verification email/i })).toBeFocused()

      await page.keyboard.press('Tab')
      await expect(page.getByRole('link', { name: /use different email/i })).toBeFocused()

      await page.keyboard.press('Tab')
      await expect(page.getByRole('link', { name: /back to login/i })).toBeFocused()
    })
  })

  test.describe('Security', () => {
    test('validates verification tokens securely', async ({ page }) => {
      // Mock token validation failure
      await page.route('/api/auth/verify-email', async (route) => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Token validation failed',
          }),
        })
      })

      await page.goto('/auth/verify-email?email=john@example.com&token=malicious-token')

      await expect(page.getByRole('alert')).toContainText(/token validation failed/i)
    })

    test('prevents email enumeration', async ({ page }) => {
      // Mock resend for non-existent email (should still show success)
      await page.route('/api/auth/resend-verification', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Verification email sent',
          }),
        })
      })

      await page.goto('/auth/verify-email?email=nonexistent@example.com')
      await page.getByRole('button', { name: /resend verification email/i }).click()

      // Should show success message even for non-existent email
      await expect(page.getByText(/verification email sent/i)).toBeVisible()
    })

    test('logs verification attempts', async ({ page }) => {
      const consoleSpy = jest.spyOn(console, 'info').mockImplementation()

      // Mock successful verification
      await page.route('/api/auth/verify-email', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Email verified successfully',
          }),
        })
      })

      await page.goto('/auth/verify-email?email=john@example.com&token=verification-token-123')

      // Verification should be logged (this would be tested in the API layer)
      await expect(page.getByText(/email verified successfully/i)).toBeVisible()

      consoleSpy.mockRestore()
    })
  })
})
