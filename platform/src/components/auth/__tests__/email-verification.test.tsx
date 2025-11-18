import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EmailVerification } from '../email-verification'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/auth/verify-email'
  }),
  useSearchParams: () => ({
    get: jest.fn().mockImplementation((key) => {
      if (key === 'email') return 'john@example.com'
      if (key === 'token') return null
      return null
    })
  })
}))

// Mock auth functions
const mockVerifyEmail = jest.fn()
const mockResendVerification = jest.fn()
jest.mock('@/lib/auth', () => ({
  verifyEmail: mockVerifyEmail,
  resendVerification: mockResendVerification
}))

describe('EmailVerification', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Verification Pending State', () => {
    it('displays verification instructions', () => {
      render(<EmailVerification />)
      
      expect(screen.getByText(/check your email/i)).toBeInTheDocument()
      expect(screen.getByText(/we sent a verification link to/i)).toBeInTheDocument()
      expect(screen.getByText(/john@example.com/i)).toBeInTheDocument()
    })

    it('shows resend verification button', () => {
      render(<EmailVerification />)
      
      expect(screen.getByRole('button', { name: /resend verification email/i })).toBeInTheDocument()
    })

    it('displays helpful instructions', () => {
      render(<EmailVerification />)
      
      expect(screen.getByText(/check your spam folder/i)).toBeInTheDocument()
      expect(screen.getByText(/click the link in the email/i)).toBeInTheDocument()
    })

    it('shows change email option', () => {
      render(<EmailVerification />)
      
      expect(screen.getByRole('link', { name: /use different email/i })).toBeInTheDocument()
    })
  })

  describe('Resend Verification', () => {
    it('resends verification email', async () => {
      const user = userEvent.setup()
      mockResendVerification.mockResolvedValue({ success: true })
      
      render(<EmailVerification />)
      
      const resendButton = screen.getByRole('button', { name: /resend verification email/i })
      await user.click(resendButton)
      
      expect(mockResendVerification).toHaveBeenCalledWith('john@example.com')
    })

    it('shows success message after resending', async () => {
      const user = userEvent.setup()
      mockResendVerification.mockResolvedValue({ success: true })
      
      render(<EmailVerification />)
      
      const resendButton = screen.getByRole('button', { name: /resend verification email/i })
      await user.click(resendButton)
      
      await waitFor(() => {
        expect(screen.getByText(/verification email sent/i)).toBeInTheDocument()
      })
    })

    it('implements rate limiting for resend', async () => {
      const user = userEvent.setup()
      mockResendVerification.mockResolvedValue({ success: true })
      
      render(<EmailVerification />)
      
      const resendButton = screen.getByRole('button', { name: /resend verification email/i })
      await user.click(resendButton)
      
      // Button should be disabled temporarily
      await waitFor(() => {
        expect(resendButton).toBeDisabled()
        expect(screen.getByText(/wait 60 seconds before resending/i)).toBeInTheDocument()
      })
    })

    it('handles resend errors', async () => {
      const user = userEvent.setup()
      mockResendVerification.mockRejectedValue(new Error('Rate limit exceeded'))
      
      render(<EmailVerification />)
      
      const resendButton = screen.getByRole('button', { name: /resend verification email/i })
      await user.click(resendButton)
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/rate limit exceeded/i)
      })
    })

    it('shows loading state during resend', async () => {
      const user = userEvent.setup()
      mockResendVerification.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))
      
      render(<EmailVerification />)
      
      const resendButton = screen.getByRole('button', { name: /resend verification email/i })
      await user.click(resendButton)
      
      expect(screen.getByRole('button', { name: /sending/i })).toBeInTheDocument()
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })
  })

  describe('Token Verification', () => {
    beforeEach(() => {
      // Mock URL params with verification token
      jest.mocked(require('next/navigation').useSearchParams).mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === 'email') return 'john@example.com'
          if (key === 'token') return 'verification-token-123'
          return null
        })
      })
    })

    it('automatically verifies email with token', async () => {
      mockVerifyEmail.mockResolvedValue({ success: true })
      
      render(<EmailVerification />)
      
      await waitFor(() => {
        expect(mockVerifyEmail).toHaveBeenCalledWith({
          email: 'john@example.com',
          token: 'verification-token-123'
        })
      })
    })

    it('shows success state after verification', async () => {
      mockVerifyEmail.mockResolvedValue({ success: true })
      
      render(<EmailVerification />)
      
      await waitFor(() => {
        expect(screen.getByText(/email verified successfully/i)).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /continue to login/i })).toBeInTheDocument()
      })
    })

    it('handles invalid token error', async () => {
      mockVerifyEmail.mockRejectedValue(new Error('Invalid verification token'))
      
      render(<EmailVerification />)
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/invalid verification token/i)
        expect(screen.getByRole('button', { name: /resend verification email/i })).toBeInTheDocument()
      })
    })

    it('handles expired token error', async () => {
      mockVerifyEmail.mockRejectedValue(new Error('Verification token expired'))
      
      render(<EmailVerification />)
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/verification token expired/i)
        expect(screen.getByText(/please request a new verification email/i)).toBeInTheDocument()
      })
    })

    it('shows loading state during verification', async () => {
      mockVerifyEmail.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))
      
      render(<EmailVerification />)
      
      expect(screen.getByText(/verifying your email/i)).toBeInTheDocument()
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('redirects to login after successful verification', async () => {
      const mockPush = jest.fn()
      jest.mocked(require('next/navigation').useRouter).mockReturnValue({
        push: mockPush,
        pathname: '/auth/verify-email'
      })
      
      // Mock token verification
      jest.mocked(require('next/navigation').useSearchParams).mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === 'email') return 'john@example.com'
          if (key === 'token') return 'verification-token-123'
          return null
        })
      })
      
      mockVerifyEmail.mockResolvedValue({ success: true })
      
      render(<EmailVerification />)
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/auth/login?message=email-verified')
      })
    })

    it('provides link to change email', () => {
      render(<EmailVerification />)
      
      const changeEmailLink = screen.getByRole('link', { name: /use different email/i })
      expect(changeEmailLink).toHaveAttribute('href', '/auth/register')
    })

    it('provides back to login link', () => {
      render(<EmailVerification />)
      
      const loginLink = screen.getByRole('link', { name: /back to login/i })
      expect(loginLink).toHaveAttribute('href', '/auth/login')
    })
  })

  describe('Email Display', () => {
    it('masks email for privacy', () => {
      // Mock long email
      jest.mocked(require('next/navigation').useSearchParams).mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === 'email') return 'verylongemailaddress@example.com'
          return null
        })
      })
      
      render(<EmailVerification />)
      
      expect(screen.getByText(/v\*\*\*@example\.com/i)).toBeInTheDocument()
    })

    it('handles missing email parameter', () => {
      jest.mocked(require('next/navigation').useSearchParams).mockReturnValue({
        get: jest.fn().mockReturnValue(null)
      })
      
      render(<EmailVerification />)
      
      expect(screen.getByText(/check your email for verification/i)).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /resend verification email/i })).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(<EmailVerification />)
      
      expect(screen.getByRole('heading', { level: 1, name: /check your email/i })).toBeInTheDocument()
    })

    it('announces status changes to screen readers', async () => {
      const user = userEvent.setup()
      mockResendVerification.mockResolvedValue({ success: true })
      
      render(<EmailVerification />)
      
      const resendButton = screen.getByRole('button', { name: /resend verification email/i })
      await user.click(resendButton)
      
      await waitFor(() => {
        const successMessage = screen.getByText(/verification email sent/i)
        expect(successMessage).toHaveAttribute('role', 'status')
        expect(successMessage).toHaveAttribute('aria-live', 'polite')
      })
    })

    it('supports keyboard navigation', async () => {
      render(<EmailVerification />)
      
      await userEvent.tab()
      expect(screen.getByRole('button', { name: /resend verification email/i })).toHaveFocus()
      
      await userEvent.tab()
      expect(screen.getByRole('link', { name: /use different email/i })).toHaveFocus()
    })
  })

  describe('Security', () => {
    it('validates verification tokens', async () => {
      mockVerifyEmail.mockRejectedValue(new Error('Token validation failed'))
      
      // Mock token presence
      jest.mocked(require('next/navigation').useSearchParams).mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === 'token') return 'invalid-token'
          if (key === 'email') return 'john@example.com'
          return null
        })
      })
      
      render(<EmailVerification />)
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/token validation failed/i)
      })
    })

    it('prevents token reuse', async () => {
      mockVerifyEmail.mockRejectedValue(new Error('Token already used'))
      
      // Mock used token
      jest.mocked(require('next/navigation').useSearchParams).mockReturnValue({
        get: jest.fn().mockImplementation((key) => {
          if (key === 'token') return 'used-token'
          if (key === 'email') return 'john@example.com'
          return null
        })
      })
      
      render(<EmailVerification />)
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/token already used/i)
      })
    })
  })
})
