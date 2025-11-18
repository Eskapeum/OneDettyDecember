# Testing Guide - OneDettyDecember Platform

This document outlines the testing standards, practices, and guidelines for the OneDettyDecember platform.

## 📋 Table of Contents

- [Overview](#overview)
- [Testing Stack](#testing-stack)
- [Testing Standards](#testing-standards)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Coverage Requirements](#coverage-requirements)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Best Practices](#best-practices)

## 🎯 Overview

Our testing strategy ensures code quality, prevents regressions, and maintains confidence in our platform as we scale. We follow a comprehensive testing pyramid approach:

- **Unit Tests**: Test individual components and functions in isolation
- **Integration Tests**: Test API endpoints and component interactions
- **E2E Tests**: Test complete user workflows and critical paths

## 🛠 Testing Stack

### Core Testing Tools
- **Jest**: Unit and integration test runner
- **React Testing Library**: Component testing utilities
- **Playwright**: End-to-end browser testing
- **Zod**: Schema validation testing

### Additional Tools
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Custom Jest matchers
- **Coverage Reports**: HTML, LCOV, and JSON formats

## 📏 Testing Standards

### Coverage Requirements
- **Global Minimum**: 70% coverage (lines, functions, branches, statements)
- **Components**: 80% coverage minimum
- **Utilities**: 75% coverage minimum
- **Critical Paths**: 90%+ coverage required

### File Naming Conventions
```
src/
├── components/
│   └── ui/
│       ├── button.tsx
│       └── __tests__/
│           └── button.test.tsx
├── lib/
│   ├── utils.ts
│   └── __tests__/
│       └── utils.test.ts
└── app/
    └── api/
        └── waitlist/
            ├── route.ts
            └── __tests__/
                └── route.test.ts
```

### Test Structure
```typescript
describe('ComponentName', () => {
  // Setup and teardown
  beforeEach(() => {
    // Common setup
  })

  describe('when condition', () => {
    it('should behave correctly', () => {
      // Arrange
      // Act  
      // Assert
    })
  })
})
```

## 🧪 Unit Testing

### Component Testing Example
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../button'

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    await user.click(screen.getByRole('button'))
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### Utility Function Testing
```typescript
import { cn } from '../utils'

describe('cn utility', () => {
  it('merges class names correctly', () => {
    expect(cn('base', 'additional')).toBe('base additional')
  })

  it('handles conditional classes', () => {
    expect(cn('base', true && 'conditional')).toBe('base conditional')
    expect(cn('base', false && 'conditional')).toBe('base')
  })
})
```

## 🔗 Integration Testing

### API Route Testing
```typescript
import { POST } from '../route'

// Mock external dependencies
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
}))

describe('/api/waitlist', () => {
  it('creates waitlist entry successfully', async () => {
    mockPrisma.waitlistEntry.findUnique.mockResolvedValue(null)
    mockPrisma.waitlistEntry.create.mockResolvedValue(mockEntry)

    const request = createMockRequest('POST', { email: 'test@example.com' })
    const response = await POST(request)

    expect(response.status).toBe(201)
    expect(mockPrisma.waitlistEntry.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ email: 'test@example.com' })
    })
  })
})
```

### Schema Validation Testing
```typescript
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1)
})

describe('Validation Schema', () => {
  it('validates correct data', () => {
    const result = schema.safeParse({ email: 'test@example.com', name: 'John' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = schema.safeParse({ email: 'invalid', name: 'John' })
    expect(result.success).toBe(false)
  })
})
```

## 🌐 End-to-End Testing

### User Flow Testing
```typescript
import { test, expect } from '@playwright/test'

test.describe('Waitlist Sign-up Flow', () => {
  test('user can join waitlist successfully', async ({ page }) => {
    // Mock API response
    await page.route('/api/waitlist', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Success' })
      })
    })

    // Navigate and fill form
    await page.goto('/waitlist')
    await page.getByLabel('Email').fill('test@example.com')
    await page.getByRole('button', { name: 'Join Waitlist' }).click()

    // Verify success state
    await expect(page.getByText('You\'re on the list!')).toBeVisible()
  })
})
```

### Accessibility Testing
```typescript
test('form is accessible via keyboard', async ({ page }) => {
  await page.goto('/waitlist')

  // Tab through form elements
  await page.keyboard.press('Tab')
  await expect(page.getByLabel('Email')).toBeFocused()

  await page.keyboard.press('Tab')
  await expect(page.getByRole('button')).toBeFocused()
})
```

## 📊 Coverage Requirements

### Running Coverage Reports
```bash
# Generate coverage report
npm run test:coverage

# View detailed coverage report
npm run coverage:report

# Open HTML coverage report
npm run test:coverage:open
```

### Coverage Thresholds
- **Critical Components**: 90%+ (Button, Form inputs, API routes)
- **UI Components**: 80%+ (Cards, Layout components)
- **Utility Functions**: 75%+ (Helpers, validators)
- **Global Minimum**: 70%+ (All code)

## 🚀 Running Tests

### Development Commands
```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run all tests (unit + E2E)
npm run test:all
```

### CI/CD Commands
```bash
# Run tests for CI (no watch, with coverage)
npm run test:ci

# Generate coverage report
npm run coverage:report
```

## ✍️ Writing Tests

### Test Naming Conventions
- **Descriptive**: `it('should disable button when loading is true')`
- **Behavior-focused**: `it('displays error message when API fails')`
- **User-centric**: `it('allows user to submit form with valid email')`

### Test Organization
```typescript
describe('WaitlistForm', () => {
  describe('rendering', () => {
    it('displays all form fields')
    it('shows correct labels and placeholders')
  })

  describe('validation', () => {
    it('requires email field')
    it('validates email format')
  })

  describe('submission', () => {
    it('submits form with valid data')
    it('handles API errors gracefully')
  })
})
```

### Mocking Guidelines
```typescript
// Mock external dependencies
jest.mock('@/lib/api', () => ({
  submitWaitlist: jest.fn()
}))

// Mock React hooks
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn()
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/test'
  })
}))
```

## 🎯 Best Practices

### Do's ✅
- **Test behavior, not implementation**
- **Use descriptive test names**
- **Follow AAA pattern (Arrange, Act, Assert)**
- **Mock external dependencies**
- **Test edge cases and error states**
- **Keep tests focused and isolated**
- **Use semantic queries (getByRole, getByLabelText)**

### Don'ts ❌
- **Don't test implementation details**
- **Don't write overly complex tests**
- **Don't ignore failing tests**
- **Don't mock everything**
- **Don't test third-party libraries**
- **Don't duplicate test logic**

### Performance Tips
- **Use `screen.getByRole()` over `container.querySelector()`**
- **Prefer `userEvent` over `fireEvent`**
- **Clean up after tests with `afterEach()`**
- **Use `waitFor()` for async operations**
- **Mock heavy operations and API calls**

### Accessibility Testing
```typescript
// Test ARIA labels
expect(screen.getByLabelText('Email Address')).toBeInTheDocument()

// Test keyboard navigation
await user.tab()
expect(screen.getByRole('button')).toHaveFocus()

// Test screen reader content
expect(screen.getByRole('alert')).toHaveTextContent('Error message')
```

## 🔧 Troubleshooting

### Common Issues
1. **Tests timing out**: Increase timeout or check for async operations
2. **Element not found**: Use `waitFor()` or check selectors
3. **Mock not working**: Verify mock placement and implementation
4. **Coverage not updating**: Clear Jest cache with `npx jest --clearCache`

### Debug Commands
```bash
# Run specific test file
npm test button.test.tsx

# Run tests in debug mode
npm test -- --verbose

# Clear Jest cache
npx jest --clearCache

# Run E2E tests in headed mode
npm run test:e2e -- --headed
```

---

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## 🔐 Authentication Testing Guidelines

### Unit Testing Auth Components

#### Registration Component Testing
```typescript
describe('RegistrationForm', () => {
  it('validates password strength requirements', async () => {
    render(<RegistrationForm />)

    const passwordInput = screen.getByLabelText(/password/i)
    await user.type(passwordInput, 'weak')

    expect(screen.getByText(/password must be at least 8 characters/i)).toBeVisible()
  })

  it('handles OAuth registration flow', async () => {
    const mockGoogleAuth = jest.fn()
    Object.defineProperty(window, 'google', {
      value: { accounts: { id: { initialize: mockGoogleAuth } } }
    })

    render(<RegistrationForm />)
    await user.click(screen.getByRole('button', { name: /continue with google/i }))

    expect(mockGoogleAuth).toHaveBeenCalled()
  })
})
```

#### Login Component Testing
```typescript
describe('LoginForm', () => {
  it('handles authentication errors correctly', async () => {
    mockLogin.mockRejectedValue(new Error('Invalid credentials'))

    render(<LoginForm />)
    await user.type(screen.getByLabelText(/email/i), 'wrong@example.com')
    await user.type(screen.getByLabelText(/password/i), 'wrongpass')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/invalid credentials/i)
    })
  })
})
```

### API Testing for Authentication

#### Registration API Testing
```typescript
describe('/api/auth/register', () => {
  it('validates email uniqueness', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing-user' })

    const request = createMockRequest({
      email: 'existing@example.com',
      password: 'password123'
    })
    const response = await POST(request)

    expect(response.status).toBe(409)
    expect(await response.json()).toEqual({
      error: 'Email already registered'
    })
  })

  it('hashes passwords securely', async () => {
    const bcrypt = require('bcryptjs')
    bcrypt.hash.mockResolvedValue('$2b$12$hashedpassword')

    await POST(createMockRequest({
      email: 'test@example.com',
      password: 'plaintext'
    }))

    expect(bcrypt.hash).toHaveBeenCalledWith('plaintext', 12)
  })
})
```

#### OAuth Callback Testing
```typescript
describe('/api/auth/oauth/callback', () => {
  it('handles Google OAuth flow', async () => {
    mockGoogleOAuth.verifyToken.mockResolvedValue({ valid: true })
    mockGoogleOAuth.getUserInfo.mockResolvedValue({
      id: 'google-123',
      email: 'user@gmail.com',
      verified_email: true
    })

    const request = createMockRequest({
      provider: 'google',
      code: 'auth-code-123'
    })
    const response = await GET(request)

    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({
      success: true,
      user: { email: 'user@gmail.com' }
    })
  })
})
```

### E2E Authentication Testing

#### Complete Registration Flow
```typescript
test('user can complete full registration flow', async ({ page }) => {
  // Mock successful API responses
  await page.route('/api/auth/register', async (route) => {
    await route.fulfill({
      status: 201,
      body: JSON.stringify({ success: true, user: { id: '123' } })
    })
  })

  // Navigate and fill registration form
  await page.goto('/auth/register')
  await page.fill('[data-testid="firstName"]', 'John')
  await page.fill('[data-testid="email"]', 'john@example.com')
  await page.fill('[data-testid="password"]', 'SecurePass123!')
  await page.check('[data-testid="terms"]')

  // Submit and verify redirect
  await page.click('[data-testid="submit"]')
  await expect(page).toHaveURL(/\/auth\/verify-email/)
})
```

#### OAuth Integration Testing
```typescript
test('Google OAuth registration works', async ({ page }) => {
  // Mock OAuth popup and callback
  await page.route('**/oauth/callback**', async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ success: true, token: 'jwt-123' })
    })
  })

  await page.goto('/auth/register')
  await page.click('[data-testid="google-oauth"]')

  // Verify successful authentication
  await expect(page).toHaveURL(/\/dashboard/)
})
```

### Database Testing for Authentication

#### Migration Testing
```typescript
describe('Auth Schema Migrations', () => {
  it('creates required authentication tables', async () => {
    const tables = await prisma.$queryRaw`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
    `

    const tableNames = tables.map(t => t.table_name)
    expect(tableNames).toContain('users')
    expect(tableNames).toContain('user_sessions')
    expect(tableNames).toContain('oauth_accounts')
    expect(tableNames).toContain('email_verification_tokens')
  })
})
```

#### RLS Policy Testing
```typescript
describe('Row Level Security', () => {
  it('prevents users from accessing other users data', async () => {
    // Set user context
    await prisma.$executeRaw`SET app.current_user_id = 'user-123'`

    // Try to access another user's data
    const users = await prisma.user.findMany({
      where: { id: 'other-user-456' }
    })

    // Should return empty due to RLS policy
    expect(users).toHaveLength(0)
  })
})
```

### Security Testing Best Practices

#### Password Security
- Test password hashing with bcrypt
- Validate password strength requirements
- Test password reset token security
- Verify session token randomness

#### OAuth Security
- Test CSRF protection in OAuth flows
- Validate OAuth token verification
- Test account linking security
- Verify OAuth provider validation

#### Session Management
- Test session expiration
- Validate session cleanup
- Test concurrent session limits
- Verify session hijacking protection

### Authentication Test Data

#### Test Users
```typescript
export const testUsers = {
  validUser: {
    email: 'test@example.com',
    password: 'SecurePass123!',
    firstName: 'Test',
    lastName: 'User'
  },
  adminUser: {
    email: 'admin@example.com',
    password: 'AdminPass123!',
    role: 'ADMIN'
  },
  vendorUser: {
    email: 'vendor@example.com',
    password: 'VendorPass123!',
    role: 'VENDOR'
  }
}
```

#### Mock OAuth Responses
```typescript
export const mockOAuthResponses = {
  google: {
    success: {
      id: 'google-123',
      email: 'user@gmail.com',
      given_name: 'John',
      family_name: 'Doe',
      verified_email: true
    }
  },
  facebook: {
    success: {
      id: 'facebook-456',
      email: 'user@facebook.com',
      first_name: 'Jane',
      last_name: 'Smith'
    }
  }
}
```

**Happy Testing! 🧪✨**

*For questions or improvements to this guide, please reach out to the QA team.*
