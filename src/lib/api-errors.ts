/**
 * API Error Handling Utilities
 * Sprint 0 - Day 1
 */

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { formatZodErrors } from './validations'

// ============================================
// ERROR TYPES
// ============================================

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMIT'
  | 'SERVER_ERROR'
  | 'BAD_REQUEST'

export interface ApiError {
  code: ErrorCode
  message: string
  details?: Record<string, any>
}

// ============================================
// CUSTOM ERROR CLASSES
// ============================================

export class ValidationError extends Error {
  code: ErrorCode = 'VALIDATION_ERROR'
  statusCode = 400
  details?: Record<string, string[]>

  constructor(message: string, details?: Record<string, string[]>) {
    super(message)
    this.name = 'ValidationError'
    this.details = details
  }
}

export class UnauthorizedError extends Error {
  code: ErrorCode = 'UNAUTHORIZED'
  statusCode = 401

  constructor(message = 'Authentication required') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends Error {
  code: ErrorCode = 'FORBIDDEN'
  statusCode = 403

  constructor(message = 'Access denied') {
    super(message)
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends Error {
  code: ErrorCode = 'NOT_FOUND'
  statusCode = 404

  constructor(message = 'Resource not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends Error {
  code: ErrorCode = 'CONFLICT'
  statusCode = 409

  constructor(message = 'Resource already exists') {
    super(message)
    this.name = 'ConflictError'
  }
}

export class RateLimitError extends Error {
  code: ErrorCode = 'RATE_LIMIT'
  statusCode = 429

  constructor(message = 'Too many requests') {
    super(message)
    this.name = 'RateLimitError'
  }
}

export class ServerError extends Error {
  code: ErrorCode = 'SERVER_ERROR'
  statusCode = 500

  constructor(message = 'Internal server error') {
    super(message)
    this.name = 'ServerError'
  }
}

// ============================================
// ERROR RESPONSE HELPERS
// ============================================

/**
 * Format error for API response
 */
export function formatApiError(error: ApiError): {
  error: ApiError
} {
  return {
    error: {
      code: error.code,
      message: error.message,
      ...(error.details && { details: error.details }),
    },
  }
}

/**
 * Create error response
 */
export function errorResponse(
  error: ValidationError | UnauthorizedError | ForbiddenError | NotFoundError | ConflictError | RateLimitError | ServerError,
  statusCode?: number
): NextResponse {
  const status = statusCode || error.statusCode

  return NextResponse.json(
    formatApiError({
      code: error.code,
      message: error.message,
      details: 'details' in error ? error.details : undefined,
    }),
    { status }
  )
}

/**
 * Handle Zod validation errors
 */
export function handleZodError(error: z.ZodError): NextResponse {
  const validationError = new ValidationError('Validation failed', formatZodErrors(error))
  return errorResponse(validationError)
}

/**
 * Handle Prisma errors
 */
export function handlePrismaError(error: any): NextResponse {
  // Unique constraint violation
  if (error.code === 'P2002') {
    const fields = error.meta?.target || ['field']
    return errorResponse(
      new ConflictError(`Resource with this ${fields.join(', ')} already exists`)
    )
  }

  // Record not found
  if (error.code === 'P2025') {
    return errorResponse(new NotFoundError('Resource not found'))
  }

  // Foreign key constraint violation
  if (error.code === 'P2003') {
    return errorResponse(new ValidationError('Invalid reference to related resource'))
  }

  // Default to server error
  console.error('Prisma error:', error)
  return errorResponse(new ServerError('Database operation failed'))
}

/**
 * Generic error handler for API routes
 */
export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error)

  // Zod validation errors
  if (error instanceof z.ZodError) {
    return handleZodError(error)
  }

  // Custom API errors
  if (
    error instanceof ValidationError ||
    error instanceof UnauthorizedError ||
    error instanceof ForbiddenError ||
    error instanceof NotFoundError ||
    error instanceof ConflictError ||
    error instanceof RateLimitError ||
    error instanceof ServerError
  ) {
    return errorResponse(error)
  }

  // Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    return handlePrismaError(error)
  }

  // Unknown errors
  return errorResponse(new ServerError('An unexpected error occurred'))
}

// ============================================
// SUCCESS RESPONSE HELPERS
// ============================================

/**
 * Success response with data
 */
export function successResponse<T>(data: T, statusCode = 200): NextResponse {
  return NextResponse.json(data, { status: statusCode })
}

/**
 * Created response (201)
 */
export function createdResponse<T>(data: T): NextResponse {
  return successResponse(data, 201)
}

/**
 * No content response (204)
 */
export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 })
}

// ============================================
// PAGINATION HELPERS
// ============================================

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/**
 * Create paginated response
 */
export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResponse<T> {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}
