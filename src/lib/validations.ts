/**
 * Zod validation schemas for OneDettyDecember API
 * Sprint 0 - Day 1
 */

import { z } from 'zod'

// ============================================
// WAITLIST SCHEMAS
// ============================================

export const waitlistSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required').max(100).optional(),
  lastName: z.string().min(1, 'Last name is required').max(100).optional(),
  source: z.string().max(50).optional(),
  metadata: z.record(z.any()).optional(),
})

export type WaitlistInput = z.infer<typeof waitlistSchema>

// ============================================
// USER PROFILE SCHEMAS
// ============================================

export const userProfileUpdateSchema = z.object({
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  country: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  dateOfBirth: z.string().datetime().optional(),
  preferences: z
    .object({
      theme: z.enum(['events', 'stays', 'experiences', 'cars', 'marketplace', 'community']).optional(),
      notifications: z.boolean().optional(),
      language: z.string().optional(),
      currency: z.string().length(3).optional(), // ISO 4217 codes
    })
    .optional(),
})

export type UserProfileUpdateInput = z.infer<typeof userProfileUpdateSchema>

// ============================================
// PACKAGE SCHEMAS
// ============================================

export const packageListQuerySchema = z.object({
  // Filters
  type: z.enum(['EVENT', 'STAY', 'EXPERIENCE', 'CAR_RENTAL', 'MARKETPLACE_PRODUCT']).optional(),
  city: z.string().max(100).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SOLD_OUT', 'CANCELLED']).optional(),
  minPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format').optional(),
  maxPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format').optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  search: z.string().max(200).optional(),

  // Pagination
  page: z.string().regex(/^\d+$/).optional().default('1'),
  limit: z.string().regex(/^\d+$/).optional().default('20'),

  // Sorting
  sort: z
    .enum([
      'price_asc',
      'price_desc',
      'date_asc',
      'date_desc',
      'rating',
      'created_asc',
      'created_desc',
    ])
    .optional()
    .default('created_desc'),
})

export type PackageListQuery = z.infer<typeof packageListQuerySchema>

export const packageCreateSchema = z.object({
  type: z.enum(['EVENT', 'STAY', 'EXPERIENCE', 'CAR_RENTAL', 'MARKETPLACE_PRODUCT']),
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.number().positive('Price must be positive'),
  currency: z.string().length(3).default('USD'),
  location: z.string().min(5, 'Location is required'),
  city: z.enum(['Lagos', 'Accra']),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  capacity: z.number().int().positive().optional(),
  availableSlots: z.number().int().nonnegative().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  metadata: z.record(z.any()).optional(),
})

export type PackageCreateInput = z.infer<typeof packageCreateSchema>

// ============================================
// COMMON VALIDATION HELPERS
// ============================================

/**
 * Validate pagination parameters
 */
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(20),
})

export type PaginationParams = z.infer<typeof paginationSchema>

/**
 * Safe validation with error formatting
 */
export function validateSchema<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  return { success: false, errors: result.error }
}

/**
 * Format Zod errors for API responses
 */
export function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {}

  error.errors.forEach((err) => {
    const path = err.path.join('.')
    if (!formatted[path]) {
      formatted[path] = []
    }
    formatted[path].push(err.message)
  })

  return formatted
}
