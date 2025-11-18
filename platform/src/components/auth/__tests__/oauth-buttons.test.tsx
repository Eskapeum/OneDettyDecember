import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OAuthButtons } from '../oauth-buttons'

// Mock OAuth providers
const mockGoogleLogin = jest.fn()
const mockFacebookLogin = jest.fn()

// Mock Google OAuth
Object.defineProperty(window, 'google', {
  value: {
    accounts: {
      id: {
        initialize: jest.fn(),
        prompt: jest.fn(),
        renderButton: jest.fn()
      }
    }
  },
  writable: true
})

// Mock Facebook OAuth
Object.defineProperty(window, 'FB', {
  value: {
    init: jest.fn(),
    login: mockFacebookLogin,
    api: jest.fn()
  },
  writable: true
})

// Mock auth functions
jest.mock('@/lib/auth', () => ({
  googleOAuth: mockGoogleLogin,
  facebookOAuth: mockFacebookLogin
}))

describe('OAuthButtons', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders Google and Facebook OAuth buttons', () => {
      render(<OAuthButtons />)
      
      expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /continue with facebook/i })).toBeInTheDocument()
    })

    it('displays correct button icons', () => {
      render(<OAuthButtons />)
      
      expect(screen.getByTestId('google-icon')).toBeInTheDocument()
      expect(screen.getByTestId('facebook-icon')).toBeInTheDocument()
    })

    it('shows divider with "or" text', () => {
      render(<OAuthButtons />)
      
      expect(screen.getByText(/or/i)).toBeInTheDocument()
    })
  })

  describe('Google OAuth', () => {
    it('handles Google OAuth click', async () => {
      const user = userEvent.setup()
      mockGoogleLogin.mockResolvedValue({ success: true })
      
      render(<OAuthButtons />)
      
      const googleButton = screen.getByRole('button', { name: /continue with google/i })
      await user.click(googleButton)
      
      expect(mockGoogleLogin).toHaveBeenCalled()
    })

    it('shows loading state during Google OAuth', async () => {
      const user = userEvent.setup()
      mockGoogleLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))
      
      render(<OAuthButtons />)
      
      const googleButton = screen.getByRole('button', { name: /continue with google/i })
      await user.click(googleButton)
      
      expect(screen.getByRole('button', { name: /signing in with google/i })).toBeInTheDocument()
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })

    it('handles Google OAuth success', async () => {
      const user = userEvent.setup()
      const mockOnSuccess = jest.fn()
      mockGoogleLogin.mockResolvedValue({ 
        success: true, 
        user: { id: '1', email: 'john@example.com' }
      })
      
      render(<OAuthButtons onSuccess={mockOnSuccess} />)
      
      const googleButton = screen.getByRole('button', { name: /continue with google/i })
      await user.click(googleButton)
      
      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledWith({
          success: true,
          user: { id: '1', email: 'john@example.com' }
        })
      })
    })

    it('handles Google OAuth error', async () => {
      const user = userEvent.setup()
      const mockOnError = jest.fn()
      mockGoogleLogin.mockRejectedValue(new Error('Google OAuth failed'))
      
      render(<OAuthButtons onError={mockOnError} />)
      
      const googleButton = screen.getByRole('button', { name: /continue with google/i })
      await user.click(googleButton)
      
      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(new Error('Google OAuth failed'))
      })
    })

    it('handles Google OAuth cancellation', async () => {
      const user = userEvent.setup()
      mockGoogleLogin.mockRejectedValue(new Error('User cancelled'))
      
      render(<OAuthButtons />)
      
      const googleButton = screen.getByRole('button', { name: /continue with google/i })
      await user.click(googleButton)
      
      await waitFor(() => {
        // Should not show error for cancellation
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      })
    })
  })

  describe('Facebook OAuth', () => {
    it('handles Facebook OAuth click', async () => {
      const user = userEvent.setup()
      mockFacebookLogin.mockResolvedValue({ success: true })
      
      render(<OAuthButtons />)
      
      const facebookButton = screen.getByRole('button', { name: /continue with facebook/i })
      await user.click(facebookButton)
      
      expect(mockFacebookLogin).toHaveBeenCalled()
    })

    it('shows loading state during Facebook OAuth', async () => {
      const user = userEvent.setup()
      mockFacebookLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))
      
      render(<OAuthButtons />)
      
      const facebookButton = screen.getByRole('button', { name: /continue with facebook/i })
      await user.click(facebookButton)
      
      expect(screen.getByRole('button', { name: /signing in with facebook/i })).toBeInTheDocument()
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })

    it('handles Facebook OAuth success', async () => {
      const user = userEvent.setup()
      const mockOnSuccess = jest.fn()
      mockFacebookLogin.mockResolvedValue({ 
        success: true, 
        user: { id: '2', email: 'jane@example.com' }
      })
      
      render(<OAuthButtons onSuccess={mockOnSuccess} />)
      
      const facebookButton = screen.getByRole('button', { name: /continue with facebook/i })
      await user.click(facebookButton)
      
      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledWith({
          success: true,
          user: { id: '2', email: 'jane@example.com' }
        })
      })
    })

    it('handles Facebook OAuth error', async () => {
      const user = userEvent.setup()
      const mockOnError = jest.fn()
      mockFacebookLogin.mockRejectedValue(new Error('Facebook OAuth failed'))
      
      render(<OAuthButtons onError={mockOnError} />)
      
      const facebookButton = screen.getByRole('button', { name: /continue with facebook/i })
      await user.click(facebookButton)
      
      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(new Error('Facebook OAuth failed'))
      })
    })
  })

  describe('Props and Configuration', () => {
    it('accepts custom button text', () => {
      render(
        <OAuthButtons 
          googleText="Sign up with Google"
          facebookText="Sign up with Facebook"
        />
      )
      
      expect(screen.getByRole('button', { name: /sign up with google/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign up with facebook/i })).toBeInTheDocument()
    })

    it('can disable specific providers', () => {
      render(<OAuthButtons disableGoogle />)
      
      expect(screen.queryByRole('button', { name: /continue with google/i })).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: /continue with facebook/i })).toBeInTheDocument()
    })

    it('can disable all providers', () => {
      render(<OAuthButtons disabled />)
      
      const googleButton = screen.getByRole('button', { name: /continue with google/i })
      const facebookButton = screen.getByRole('button', { name: /continue with facebook/i })
      
      expect(googleButton).toBeDisabled()
      expect(facebookButton).toBeDisabled()
    })

    it('accepts custom styling', () => {
      render(<OAuthButtons className="custom-oauth-buttons" />)
      
      const container = screen.getByTestId('oauth-buttons-container')
      expect(container).toHaveClass('custom-oauth-buttons')
    })
  })

  describe('Accessibility', () => {
    it('supports keyboard navigation', async () => {
      render(<OAuthButtons />)
      
      await userEvent.tab()
      expect(screen.getByRole('button', { name: /continue with google/i })).toHaveFocus()
      
      await userEvent.tab()
      expect(screen.getByRole('button', { name: /continue with facebook/i })).toHaveFocus()
    })

    it('has proper ARIA labels', () => {
      render(<OAuthButtons />)
      
      const googleButton = screen.getByRole('button', { name: /continue with google/i })
      const facebookButton = screen.getByRole('button', { name: /continue with facebook/i })
      
      expect(googleButton).toHaveAttribute('aria-label', 'Sign in with Google')
      expect(facebookButton).toHaveAttribute('aria-label', 'Sign in with Facebook')
    })

    it('announces loading states to screen readers', async () => {
      const user = userEvent.setup()
      mockGoogleLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))
      
      render(<OAuthButtons />)
      
      const googleButton = screen.getByRole('button', { name: /continue with google/i })
      await user.click(googleButton)
      
      expect(screen.getByRole('button', { name: /signing in with google/i })).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('Error Handling', () => {
    it('displays error messages', async () => {
      const user = userEvent.setup()
      mockGoogleLogin.mockRejectedValue(new Error('Network error'))
      
      render(<OAuthButtons />)
      
      const googleButton = screen.getByRole('button', { name: /continue with google/i })
      await user.click(googleButton)
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/network error/i)
      })
    })

    it('clears errors when retrying', async () => {
      const user = userEvent.setup()
      mockGoogleLogin
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ success: true })
      
      render(<OAuthButtons />)
      
      const googleButton = screen.getByRole('button', { name: /continue with google/i })
      
      // First attempt - error
      await user.click(googleButton)
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })
      
      // Second attempt - success
      await user.click(googleButton)
      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      })
    })
  })

  describe('Security', () => {
    it('validates OAuth responses', async () => {
      const user = userEvent.setup()
      mockGoogleLogin.mockResolvedValue({ success: false, error: 'Invalid token' })
      
      render(<OAuthButtons />)
      
      const googleButton = screen.getByRole('button', { name: /continue with google/i })
      await user.click(googleButton)
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/invalid token/i)
      })
    })

    it('handles CSRF protection', async () => {
      const user = userEvent.setup()
      mockGoogleLogin.mockRejectedValue(new Error('CSRF token mismatch'))
      
      render(<OAuthButtons />)
      
      const googleButton = screen.getByRole('button', { name: /continue with google/i })
      await user.click(googleButton)
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/csrf token mismatch/i)
      })
    })
  })
})
