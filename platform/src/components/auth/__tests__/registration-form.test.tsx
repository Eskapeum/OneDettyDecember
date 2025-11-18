import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RegistrationForm } from '../registration-form'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/register'
  })
}))

// Mock API calls
const mockRegister = jest.fn()
jest.mock('@/lib/auth', () => ({
  register: mockRegister
}))

describe('RegistrationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders all form fields', () => {
      render(<RegistrationForm />)
      
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
    })

    it('displays terms and conditions checkbox', () => {
      render(<RegistrationForm />)
      
      expect(screen.getByLabelText(/agree to terms/i)).toBeInTheDocument()
      expect(screen.getByText(/terms of service/i)).toBeInTheDocument()
      expect(screen.getByText(/privacy policy/i)).toBeInTheDocument()
    })

    it('shows OAuth options', () => {
      render(<RegistrationForm />)
      
      expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /continue with facebook/i })).toBeInTheDocument()
    })
  })

  describe('Form Validation', () => {
    it('validates required fields', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm />)
      
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)
      
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })

    it('validates email format', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm />)
      
      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 'invalid-email')
      await user.tab()
      
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument()
    })

    it('validates password strength', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm />)
      
      const passwordInput = screen.getByLabelText(/^password/i)
      await user.type(passwordInput, '123')
      await user.tab()
      
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()
    })

    it('validates password confirmation', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm />)
      
      const passwordInput = screen.getByLabelText(/^password/i)
      const confirmInput = screen.getByLabelText(/confirm password/i)
      
      await user.type(passwordInput, 'password123')
      await user.type(confirmInput, 'different123')
      await user.tab()
      
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })

    it('requires terms acceptance', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm />)
      
      // Fill valid form data but don't check terms
      await user.type(screen.getByLabelText(/first name/i), 'John')
      await user.type(screen.getByLabelText(/last name/i), 'Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'password123')
      
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)
      
      expect(screen.getByText(/you must agree to the terms/i)).toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('submits form with valid data', async () => {
      const user = userEvent.setup()
      mockRegister.mockResolvedValue({ success: true, user: { id: '1', email: 'john@example.com' } })
      
      render(<RegistrationForm />)
      
      // Fill form with valid data
      await user.type(screen.getByLabelText(/first name/i), 'John')
      await user.type(screen.getByLabelText(/last name/i), 'Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'password123')
      await user.click(screen.getByLabelText(/agree to terms/i))
      
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)
      
      expect(mockRegister).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      })
    })

    it('shows loading state during submission', async () => {
      const user = userEvent.setup()
      mockRegister.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))
      
      render(<RegistrationForm />)
      
      // Fill and submit form
      await user.type(screen.getByLabelText(/first name/i), 'John')
      await user.type(screen.getByLabelText(/last name/i), 'Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'password123')
      await user.click(screen.getByLabelText(/agree to terms/i))
      
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)
      
      expect(screen.getByRole('button', { name: /creating account/i })).toBeInTheDocument()
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })

    it('handles registration errors', async () => {
      const user = userEvent.setup()
      mockRegister.mockRejectedValue(new Error('Email already exists'))
      
      render(<RegistrationForm />)
      
      // Fill and submit form
      await user.type(screen.getByLabelText(/first name/i), 'John')
      await user.type(screen.getByLabelText(/last name/i), 'Doe')
      await user.type(screen.getByLabelText(/email/i), 'existing@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'password123')
      await user.click(screen.getByLabelText(/agree to terms/i))
      
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/email already exists/i)
      })
    })

    it('redirects to verification page on success', async () => {
      const mockPush = jest.fn()
      jest.mocked(require('next/navigation').useRouter).mockReturnValue({
        push: mockPush,
        pathname: '/register'
      })
      
      const user = userEvent.setup()
      mockRegister.mockResolvedValue({ success: true, user: { id: '1', email: 'john@example.com' } })
      
      render(<RegistrationForm />)
      
      // Fill and submit form
      await user.type(screen.getByLabelText(/first name/i), 'John')
      await user.type(screen.getByLabelText(/last name/i), 'Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'password123')
      await user.click(screen.getByLabelText(/agree to terms/i))
      
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/auth/verify-email?email=john@example.com')
      })
    })
  })

  describe('OAuth Integration', () => {
    it('handles Google OAuth', async () => {
      const user = userEvent.setup()
      const mockGoogleAuth = jest.fn()
      
      // Mock Google OAuth
      Object.defineProperty(window, 'google', {
        value: { accounts: { id: { initialize: mockGoogleAuth } } },
        writable: true
      })
      
      render(<RegistrationForm />)
      
      const googleButton = screen.getByRole('button', { name: /continue with google/i })
      await user.click(googleButton)
      
      expect(mockGoogleAuth).toHaveBeenCalled()
    })

    it('handles Facebook OAuth', async () => {
      const user = userEvent.setup()
      const mockFacebookAuth = jest.fn()
      
      // Mock Facebook OAuth
      Object.defineProperty(window, 'FB', {
        value: { login: mockFacebookAuth },
        writable: true
      })
      
      render(<RegistrationForm />)
      
      const facebookButton = screen.getByRole('button', { name: /continue with facebook/i })
      await user.click(facebookButton)
      
      expect(mockFacebookAuth).toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('supports keyboard navigation', async () => {
      render(<RegistrationForm />)
      
      // Tab through form elements
      await userEvent.tab()
      expect(screen.getByLabelText(/first name/i)).toHaveFocus()
      
      await userEvent.tab()
      expect(screen.getByLabelText(/last name/i)).toHaveFocus()
      
      await userEvent.tab()
      expect(screen.getByLabelText(/email/i)).toHaveFocus()
    })

    it('has proper ARIA labels', () => {
      render(<RegistrationForm />)
      
      expect(screen.getByLabelText(/first name/i)).toHaveAttribute('aria-required', 'true')
      expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-required', 'true')
      expect(screen.getByLabelText(/password/i)).toHaveAttribute('aria-required', 'true')
    })

    it('announces errors to screen readers', async () => {
      const user = userEvent.setup()
      render(<RegistrationForm />)
      
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)
      
      const errorMessage = screen.getByText(/first name is required/i)
      expect(errorMessage).toHaveAttribute('role', 'alert')
      expect(errorMessage).toHaveAttribute('aria-live', 'polite')
    })
  })
})
