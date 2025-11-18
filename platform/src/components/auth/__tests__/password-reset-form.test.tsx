import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PasswordResetForm } from '../password-reset-form'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/auth/forgot-password'
  }),
  useSearchParams: () => ({
    get: jest.fn().mockReturnValue(null)
  })
}))

// Mock auth functions
const mockRequestPasswordReset = jest.fn()
const mockResetPassword = jest.fn()
jest.mock('@/lib/auth', () => ({
  requestPasswordReset: mockRequestPasswordReset,
  resetPassword: mockResetPassword
}))

describe('PasswordResetForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Request Reset Flow', () => {
    it('renders email input for password reset request', () => {
      render(<PasswordResetForm />)
      
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument()
      expect(screen.getByText(/enter your email to receive a password reset link/i)).toBeInTheDocument()
    })

    it('validates email field', async () => {
      const user = userEvent.setup()
      render(<PasswordResetForm />)
      
      const submitButton = screen.getByRole('button', { name: /send reset link/i })
      await user.click(submitButton)
      
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    })

    it('validates email format', async () => {
      const user = userEvent.setup()
      render(<PasswordResetForm />)
      
      const emailInput = screen.getByLabelText(/email address/i)
      await user.type(emailInput, 'invalid-email')
      await user.tab()
      
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument()
    })

    it('submits password reset request', async () => {
      const user = userEvent.setup()
      mockRequestPasswordReset.mockResolvedValue({ success: true })
      
      render(<PasswordResetForm />)
      
      const emailInput = screen.getByLabelText(/email address/i)
      await user.type(emailInput, 'john@example.com')
      
      const submitButton = screen.getByRole('button', { name: /send reset link/i })
      await user.click(submitButton)
      
      expect(mockRequestPasswordReset).toHaveBeenCalledWith('john@example.com')
    })

    it('shows success message after sending reset link', async () => {
      const user = userEvent.setup()
      mockRequestPasswordReset.mockResolvedValue({ success: true })
      
      render(<PasswordResetForm />)
      
      const emailInput = screen.getByLabelText(/email address/i)
      await user.type(emailInput, 'john@example.com')
      
      const submitButton = screen.getByRole('button', { name: /send reset link/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/password reset link sent/i)).toBeInTheDocument()
        expect(screen.getByText(/check your email for the reset link/i)).toBeInTheDocument()
      })
    })

    it('handles email not found error', async () => {
      const user = userEvent.setup()
      mockRequestPasswordReset.mockRejectedValue(new Error('Email not found'))
      
      render(<PasswordResetForm />)
      
      const emailInput = screen.getByLabelText(/email address/i)
      await user.type(emailInput, 'notfound@example.com')
      
      const submitButton = screen.getByRole('button', { name: /send reset link/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/email not found/i)
      })
    })

    it('shows loading state during request', async () => {
      const user = userEvent.setup()
      mockRequestPasswordReset.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))
      
      render(<PasswordResetForm />)
      
      const emailInput = screen.getByLabelText(/email address/i)
      await user.type(emailInput, 'john@example.com')
      
      const submitButton = screen.getByRole('button', { name: /send reset link/i })
      await user.click(submitButton)
      
      expect(screen.getByRole('button', { name: /sending/i })).toBeInTheDocument()
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })
  })

  describe('Reset Password Flow', () => {
    beforeEach(() => {
      // Mock URL params to simulate reset token
      jest.mocked(require('next/navigation').useSearchParams).mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === 'token') return 'reset-token-123'
          if (key === 'email') return 'john@example.com'
          return null
        })
      })
    })

    it('renders password reset form with token', () => {
      render(<PasswordResetForm />)
      
      expect(screen.getByLabelText(/new password/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument()
    })

    it('validates password requirements', async () => {
      const user = userEvent.setup()
      render(<PasswordResetForm />)
      
      const passwordInput = screen.getByLabelText(/new password/i)
      await user.type(passwordInput, '123')
      await user.tab()
      
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()
    })

    it('validates password confirmation', async () => {
      const user = userEvent.setup()
      render(<PasswordResetForm />)
      
      const passwordInput = screen.getByLabelText(/new password/i)
      const confirmInput = screen.getByLabelText(/confirm password/i)
      
      await user.type(passwordInput, 'newpassword123')
      await user.type(confirmInput, 'different123')
      await user.tab()
      
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })

    it('submits password reset with valid data', async () => {
      const user = userEvent.setup()
      mockResetPassword.mockResolvedValue({ success: true })
      
      render(<PasswordResetForm />)
      
      const passwordInput = screen.getByLabelText(/new password/i)
      const confirmInput = screen.getByLabelText(/confirm password/i)
      
      await user.type(passwordInput, 'newpassword123')
      await user.type(confirmInput, 'newpassword123')
      
      const submitButton = screen.getByRole('button', { name: /reset password/i })
      await user.click(submitButton)
      
      expect(mockResetPassword).toHaveBeenCalledWith({
        token: 'reset-token-123',
        email: 'john@example.com',
        password: 'newpassword123'
      })
    })

    it('shows success message after password reset', async () => {
      const user = userEvent.setup()
      mockResetPassword.mockResolvedValue({ success: true })
      
      render(<PasswordResetForm />)
      
      const passwordInput = screen.getByLabelText(/new password/i)
      const confirmInput = screen.getByLabelText(/confirm password/i)
      
      await user.type(passwordInput, 'newpassword123')
      await user.type(confirmInput, 'newpassword123')
      
      const submitButton = screen.getByRole('button', { name: /reset password/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/password reset successful/i)).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
      })
    })

    it('handles invalid token error', async () => {
      const user = userEvent.setup()
      mockResetPassword.mockRejectedValue(new Error('Invalid or expired token'))
      
      render(<PasswordResetForm />)
      
      const passwordInput = screen.getByLabelText(/new password/i)
      const confirmInput = screen.getByLabelText(/confirm password/i)
      
      await user.type(passwordInput, 'newpassword123')
      await user.type(confirmInput, 'newpassword123')
      
      const submitButton = screen.getByRole('button', { name: /reset password/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/invalid or expired token/i)
        expect(screen.getByRole('link', { name: /request new reset link/i })).toBeInTheDocument()
      })
    })
  })

  describe('Navigation', () => {
    it('provides back to login link', () => {
      render(<PasswordResetForm />)
      
      const backLink = screen.getByRole('link', { name: /back to login/i })
      expect(backLink).toHaveAttribute('href', '/auth/login')
    })

    it('redirects to login after successful reset', async () => {
      const mockPush = jest.fn()
      jest.mocked(require('next/navigation').useRouter).mockReturnValue({
        push: mockPush,
        pathname: '/auth/forgot-password'
      })
      
      const user = userEvent.setup()
      mockResetPassword.mockResolvedValue({ success: true })
      
      // Mock token presence
      jest.mocked(require('next/navigation').useSearchParams).mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === 'token') return 'reset-token-123'
          if (key === 'email') return 'john@example.com'
          return null
        })
      })
      
      render(<PasswordResetForm />)
      
      const passwordInput = screen.getByLabelText(/new password/i)
      const confirmInput = screen.getByLabelText(/confirm password/i)
      
      await user.type(passwordInput, 'newpassword123')
      await user.type(confirmInput, 'newpassword123')
      
      const submitButton = screen.getByRole('button', { name: /reset password/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/auth/login?message=password-reset-success')
      })
    })
  })

  describe('Accessibility', () => {
    it('supports keyboard navigation', async () => {
      render(<PasswordResetForm />)
      
      await userEvent.tab()
      expect(screen.getByLabelText(/email address/i)).toHaveFocus()
      
      await userEvent.tab()
      expect(screen.getByRole('button', { name: /send reset link/i })).toHaveFocus()
    })

    it('has proper ARIA labels', () => {
      render(<PasswordResetForm />)
      
      expect(screen.getByLabelText(/email address/i)).toHaveAttribute('aria-required', 'true')
    })

    it('announces errors to screen readers', async () => {
      const user = userEvent.setup()
      render(<PasswordResetForm />)
      
      const submitButton = screen.getByRole('button', { name: /send reset link/i })
      await user.click(submitButton)
      
      const errorMessage = screen.getByText(/email is required/i)
      expect(errorMessage).toHaveAttribute('role', 'alert')
      expect(errorMessage).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('Security Features', () => {
    it('masks password inputs', () => {
      // Mock token presence to show password reset form
      jest.mocked(require('next/navigation').useSearchParams).mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === 'token') return 'reset-token-123'
          return null
        })
      })
      
      render(<PasswordResetForm />)
      
      expect(screen.getByLabelText(/new password/i)).toHaveAttribute('type', 'password')
      expect(screen.getByLabelText(/confirm password/i)).toHaveAttribute('type', 'password')
    })

    it('shows password strength indicator', async () => {
      const user = userEvent.setup()
      
      // Mock token presence
      jest.mocked(require('next/navigation').useSearchParams).mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === 'token') return 'reset-token-123'
          return null
        })
      })
      
      render(<PasswordResetForm />)
      
      const passwordInput = screen.getByLabelText(/new password/i)
      await user.type(passwordInput, 'weak')
      
      expect(screen.getByText(/weak/i)).toBeInTheDocument()
      
      await user.clear(passwordInput)
      await user.type(passwordInput, 'StrongPassword123!')
      
      expect(screen.getByText(/strong/i)).toBeInTheDocument()
    })
  })
})
