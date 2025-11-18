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

**Happy Testing! 🧪✨**

*For questions or improvements to this guide, please reach out to the QA team.*
