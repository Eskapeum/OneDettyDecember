import { z } from 'zod'

// Test the validation schema directly (simplified for testing)
const waitlistSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long').optional(),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long').optional(),
  source: z.string().max(100, 'Source too long').optional(),
})

describe('Waitlist API Validation', () => {
  describe('waitlistSchema validation', () => {
    it('validates correct email format', () => {
      const validData = { email: 'test@example.com' }
      const result = waitlistSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('rejects invalid email format', () => {
      const invalidData = { email: 'invalid-email' }
      const result = waitlistSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0)
        expect(result.error.issues[0].path).toEqual(['email'])
      }
    })

    it('accepts optional firstName and lastName', () => {
      const validData = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe'
      }
      const result = waitlistSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('rejects firstName that is too long', () => {
      const invalidData = {
        email: 'test@example.com',
        firstName: 'a'.repeat(51) // 51 characters
      }
      const result = waitlistSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('accepts valid source field', () => {
      const validData = {
        email: 'test@example.com',
        source: 'landing-page'
      }
      const result = waitlistSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('rejects source that is too long', () => {
      const invalidData = {
        email: 'test@example.com',
        source: 'a'.repeat(101) // 101 characters
      }
      const result = waitlistSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('requires email field', () => {
      const invalidData = { firstName: 'John' }
      const result = waitlistSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('validates complete valid entry', () => {
      const validData = {
        email: 'complete@example.com',
        firstName: 'John',
        lastName: 'Doe',
        source: 'landing-page'
      }
      const result = waitlistSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })
  })

  describe('Email validation edge cases', () => {
    it('accepts various valid email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com'
      ]

      validEmails.forEach(email => {
        const result = waitlistSchema.safeParse({ email })
        expect(result.success).toBe(true)
      })
    })

    it('rejects invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user..name@domain.com',
        'user@domain',
        ''
      ]

      invalidEmails.forEach(email => {
        const result = waitlistSchema.safeParse({ email })
        expect(result.success).toBe(false)
      })
    })
  })
})
