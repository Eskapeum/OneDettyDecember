import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '../login-form'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/login'
  })
}))

// Mock auth functions
const mockLogin = jest.fn()
const mockOAuthLogin = jest.fn()
jest.mock('@/lib/auth', () => ({
  login: mockLogin,
  oauthLogin: mockOAuthLogin
}))

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders all form fields', () => {
      render(<LoginForm />)
      
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })

    it('displays remember me checkbox', () => {
      render(<LoginForm />)
      
      expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument()
    })

    it('shows forgot password link', () => {
      render(<LoginForm />)
      
      expect(screen.getByRole('link', { name: /forgot password/i })).toBeInTheDocument()
    })

    it('displays OAuth options', () => {
      render(<LoginForm />)
      
      expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /continue with facebook/i })).toBeInTheDocument()
    })

    it('shows registration link', () => {
      render(<LoginForm />)
      
      expect(screen.getByRole('link', { name: /create account/i })).toBeInTheDocument()
    })
  })

  describe('Form Validation', () => {
    it('validates required fields', async () => {
      const user = userEvent.setup()
      render(<LoginForm />)
      
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)
      
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })

    it('validates email format', async () => {
      const user = userEvent.setup()
      render(<LoginForm />)
      
      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 'invalid-email')
      await user.tab()
      
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument()
    })

    it('validates minimum password length', async () => {
      const user = userEvent.setup()
      render(<LoginForm />)
      
      const passwordInput = screen.getByLabelText(/password/i)
      await user.type(passwordInput, '123')
      await user.tab()
      
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('submits form with valid credentials', async () => {
      const user = userEvent.setup()
      mockLogin.mockResolvedValue({ 
        success: true, 
        user: { id: '1', email: 'john@example.com' },
        token: 'jwt-token'
      })
      
      render(<LoginForm />)
      
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)
      
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'password123',
        rememberMe: false
      })
    })

    it('includes remember me option', async () => {
      const user = userEvent.setup()
      mockLogin.mockResolvedValue({ success: true })
      
      render(<LoginForm />)
      
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      await user.click(screen.getByLabelText(/remember me/i))
      
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)
      
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'password123',
        rememberMe: true
      })
    })

    it('shows loading state during submission', async () => {
      const user = userEvent.setup()
      mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))
      
      render(<LoginForm />)
      
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)
      
      expect(screen.getByRole('button', { name: /signing in/i })).toBeInTheDocument()
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })

    it('handles invalid credentials error', async () => {
      const user = userEvent.setup()
      mockLogin.mockRejectedValue(new Error('Invalid email or password'))
      
      render(<LoginForm />)
      
      await user.type(screen.getByLabelText(/email/i), 'wrong@example.com')
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
      
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/invalid email or password/i)
      })
    })

    it('handles account not verified error', async () => {
      const user = userEvent.setup()
      mockLogin.mockRejectedValue(new Error('Please verify your email address'))
      
      render(<LoginForm />)
      
      await user.type(screen.getByLabelText(/email/i), 'unverified@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/please verify your email/i)
        expect(screen.getByRole('link', { name: /resend verification/i })).toBeInTheDocument()
      })
    })

    it('redirects to dashboard on successful login', async () => {
      const mockPush = jest.fn()
      jest.mocked(require('next/navigation').useRouter).mockReturnValue({
        push: mockPush,
        pathname: '/login'
      })
      
      const user = userEvent.setup()
      mockLogin.mockResolvedValue({ 
        success: true, 
        user: { id: '1', email: 'john@example.com' }
      })
      
      render(<LoginForm />)
      
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/password/i), 'password123')
      
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard')
      })
    })
  })

  describe('OAuth Integration', () => {
    it('handles Google OAuth login', async () => {
      const user = userEvent.setup()
      mockOAuthLogin.mockResolvedValue({ success: true })
      
      render(<LoginForm />)
      
      const googleButton = screen.getByRole('button', { name: /continue with google/i })
      await user.click(googleButton)
      
      expect(mockOAuthLogin).toHaveBeenCalledWith('google')
    })

    it('handles Facebook OAuth login', async () => {
      const user = userEvent.setup()
      mockOAuthLogin.mockResolvedValue({ success: true })
      
      render(<LoginForm />)
      
      const facebookButton = screen.getByRole('button', { name: /continue with facebook/i })
      await user.click(facebookButton)
      
      expect(mockOAuthLogin).toHaveBeenCalledWith('facebook')
    })

    it('handles OAuth errors', async () => {
      const user = userEvent.setup()
      mockOAuthLogin.mockRejectedValue(new Error('OAuth authentication failed'))
      
      render(<LoginForm />)
      
      const googleButton = screen.getByRole('button', { name: /continue with google/i })
      await user.click(googleButton)
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/oauth authentication failed/i)
      })
    })
  })

  describe('Password Reset', () => {
    it('navigates to forgot password page', async () => {
      const user = userEvent.setup()
      render(<LoginForm />)
      
      const forgotPasswordLink = screen.getByRole('link', { name: /forgot password/i })
      expect(forgotPasswordLink).toHaveAttribute('href', '/auth/forgot-password')
    })
  })

  describe('Accessibility', () => {
    it('supports keyboard navigation', async () => {
      render(<LoginForm />)
      
      await userEvent.tab()
      expect(screen.getByLabelText(/email/i)).toHaveFocus()
      
      await userEvent.tab()
      expect(screen.getByLabelText(/password/i)).toHaveFocus()
      
      await userEvent.tab()
      expect(screen.getByLabelText(/remember me/i)).toHaveFocus()
    })

    it('has proper ARIA labels', () => {
      render(<LoginForm />)
      
      expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-required', 'true')
      expect(screen.getByLabelText(/password/i)).toHaveAttribute('aria-required', 'true')
    })

    it('announces errors to screen readers', async () => {
      const user = userEvent.setup()
      render(<LoginForm />)
      
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)
      
      const errorMessage = screen.getByText(/email is required/i)
      expect(errorMessage).toHaveAttribute('role', 'alert')
      expect(errorMessage).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('Security Features', () => {
    it('masks password input', () => {
      render(<LoginForm />)
      
      const passwordInput = screen.getByLabelText(/password/i)
      expect(passwordInput).toHaveAttribute('type', 'password')
    })

    it('provides password visibility toggle', async () => {
      const user = userEvent.setup()
      render(<LoginForm />)
      
      const passwordInput = screen.getByLabelText(/password/i)
      const toggleButton = screen.getByRole('button', { name: /show password/i })
      
      await user.click(toggleButton)
      expect(passwordInput).toHaveAttribute('type', 'text')
      expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument()
    })
  })
})
