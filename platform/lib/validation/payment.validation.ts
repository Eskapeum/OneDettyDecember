/**
 * Payment Validation Schemas
 * Sprint 4 - Payment Integration
 * Created by: Nesiah (Backend Lead)
 */

import { z } from 'zod'

// ============================================
// REFUND VALIDATION SCHEMAS
// ============================================

/**
 * Refund creation schema
 * Validates refund request input
 */
export const refundCreateSchema = z.object({
  bookingId: z.string().cuid('Invalid booking ID'),
  amount: z
    .number()
    .positive('Refund amount must be positive')
    .optional(), // If not provided, full refund
  reason: z
    .string()
    .min(10, 'Refund reason must be at least 10 characters')
    .max(500, 'Refund reason must be less than 500 characters'),
  refundType: z.enum(['FULL', 'PARTIAL']).default('FULL'),
  metadata: z.record(z.any()).optional(),
})

export type RefundCreateInput = z.infer<typeof refundCreateSchema>

/**
 * Refund processing schema
 * Internal validation for refund processing
 */
export const refundProcessSchema = z.object({
  paymentId: z.string().cuid('Invalid payment ID'),
  refundId: z.string().cuid('Invalid refund ID'),
  amount: z.number().positive('Refund amount must be positive'),
  provider: z.enum(['STRIPE', 'PAYSTACK']),
  providerPaymentId: z.string().min(1, 'Provider payment ID is required'),
  idempotencyKey: z.string().min(1, 'Idempotency key is required'),
})

export type RefundProcessInput = z.infer<typeof refundProcessSchema>

/**
 * Refund webhook schema
 * Validates refund webhook payloads
 */
export const refundWebhookSchema = z.object({
  refundId: z.string(),
  status: z.enum(['succeeded', 'failed', 'pending', 'canceled']),
  amount: z.number().positive(),
  currency: z.string().length(3, 'Currency must be 3 characters'),
  failureReason: z.string().optional(),
  metadata: z.record(z.any()).optional(),
})

export type RefundWebhookInput = z.infer<typeof refundWebhookSchema>

// ============================================
// PAYMENT VERIFICATION SCHEMAS
// ============================================

/**
 * Payment verification schema
 * Validates payment confirmation requests
 */
export const paymentVerificationSchema = z.object({
  bookingId: z.string().cuid('Invalid booking ID'),
  provider: z.enum(['STRIPE', 'PAYSTACK']),
  paymentIntentId: z.string().min(1, 'Payment intent ID is required'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters'),
})

export type PaymentVerificationInput = z.infer<typeof paymentVerificationSchema>

/**
 * Payment status check schema
 */
export const paymentStatusSchema = z.object({
  paymentId: z.string().cuid('Invalid payment ID'),
})

export type PaymentStatusInput = z.infer<typeof paymentStatusSchema>

// ============================================
// FRAUD DETECTION SCHEMAS
// ============================================

/**
 * Fraud detection input schema
 * Validates data for fraud analysis
 */
export const fraudDetectionSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  bookingId: z.string().cuid('Invalid booking ID'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters'),
  ipAddress: z.string().ip('Invalid IP address').optional(),
  userAgent: z.string().optional(),
  paymentMethod: z
    .object({
      type: z.enum(['card', 'bank_transfer', 'mobile_money', 'ussd', 'wallet']),
      fingerprint: z.string().optional(),
      country: z.string().length(2, 'Country must be 2 characters').optional(),
    })
    .optional(),
  metadata: z.record(z.any()).optional(),
})

export type FraudDetectionInput = z.infer<typeof fraudDetectionSchema>

/**
 * Fraud check result schema
 */
export const fraudCheckResultSchema = z.object({
  riskScore: z.number().min(0).max(100),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  flags: z.array(
    z.object({
      type: z.string(),
      severity: z.enum(['INFO', 'WARNING', 'CRITICAL']),
      message: z.string(),
    })
  ),
  recommendation: z.enum(['APPROVE', 'REVIEW', 'DECLINE']),
  metadata: z.record(z.any()).optional(),
})

export type FraudCheckResult = z.infer<typeof fraudCheckResultSchema>

// ============================================
// PAYMENT RECONCILIATION SCHEMAS
// ============================================

/**
 * Payment reconciliation schema
 * Validates reconciliation requests
 */
export const reconciliationSchema = z.object({
  startDate: z.string().datetime('Invalid start date'),
  endDate: z.string().datetime('Invalid end date'),
  provider: z.enum(['STRIPE', 'PAYSTACK', 'ALL']).default('ALL'),
  status: z.enum(['ALL', 'MATCHED', 'UNMATCHED', 'DISCREPANCY']).default('ALL'),
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(50),
})

export type ReconciliationInput = z.infer<typeof reconciliationSchema>

/**
 * Payment reconciliation record schema
 */
export const reconciliationRecordSchema = z.object({
  paymentId: z.string(),
  bookingId: z.string(),
  providerPaymentId: z.string(),
  internalAmount: z.number(),
  providerAmount: z.number(),
  matched: z.boolean(),
  discrepancy: z.number().optional(),
  status: z.enum(['MATCHED', 'UNMATCHED', 'DISCREPANCY']),
  notes: z.string().optional(),
})

export type ReconciliationRecord = z.infer<typeof reconciliationRecordSchema>

// ============================================
// PAYMENT METHOD SCHEMAS
// ============================================

/**
 * Payment method validation schema
 * Validates payment method selection
 */
export const paymentMethodSchema = z.object({
  provider: z.enum(['STRIPE', 'PAYSTACK']),
  type: z.enum(['card', 'bank_transfer', 'mobile_money', 'ussd', 'wallet']),
  currency: z.string().length(3, 'Currency must be 3 characters'),
  saveForLater: z.boolean().default(false),
  metadata: z.record(z.any()).optional(),
})

export type PaymentMethodInput = z.infer<typeof paymentMethodSchema>

// ============================================
// WEBHOOK VALIDATION SCHEMAS
// ============================================

/**
 * Stripe webhook event schema
 */
export const stripeWebhookSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    object: z.record(z.any()),
  }),
  created: z.number(),
})

export type StripeWebhookEvent = z.infer<typeof stripeWebhookSchema>

/**
 * Paystack webhook event schema
 */
export const paystackWebhookSchema = z.object({
  event: z.string(),
  data: z.record(z.any()),
})

export type PaystackWebhookEvent = z.infer<typeof paystackWebhookSchema>

// ============================================
// PAYMENT AMOUNT VALIDATION
// ============================================

/**
 * Validate payment amount against booking
 */
export const paymentAmountValidationSchema = z.object({
  bookingAmount: z.number().positive(),
  paymentAmount: z.number().positive(),
  currency: z.string().length(3),
  tolerance: z.number().min(0).max(1).default(0.01), // 1% tolerance for rounding
})

export type PaymentAmountValidation = z.infer<typeof paymentAmountValidationSchema>

/**
 * Validate refund amount against payment
 */
export const refundAmountValidationSchema = z.object({
  paymentAmount: z.number().positive(),
  refundAmount: z.number().positive(),
  existingRefunds: z.number().min(0).default(0),
  allowPartial: z.boolean().default(true),
})

export type RefundAmountValidation = z.infer<typeof refundAmountValidationSchema>

// ============================================
// CURRENCY VALIDATION
// ============================================

/**
 * Supported currencies
 */
export const SUPPORTED_CURRENCIES = ['USD', 'NGN', 'GHS', 'EUR', 'GBP'] as const

export const currencySchema = z.enum(SUPPORTED_CURRENCIES)

export type SupportedCurrency = z.infer<typeof currencySchema>

/**
 * Currency conversion schema
 */
export const currencyConversionSchema = z.object({
  amount: z.number().positive(),
  fromCurrency: currencySchema,
  toCurrency: currencySchema,
  exchangeRate: z.number().positive().optional(),
})

export type CurrencyConversion = z.infer<typeof currencyConversionSchema>

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Validate refund amount is not greater than payment amount
 */
export function validateRefundAmount(
  paymentAmount: number,
  refundAmount: number,
  existingRefunds: number = 0
): boolean {
  const totalRefunded = existingRefunds + refundAmount
  return totalRefunded <= paymentAmount
}

/**
 * Validate payment amount matches booking amount (with tolerance)
 */
export function validatePaymentAmountMatch(
  bookingAmount: number,
  paymentAmount: number,
  tolerance: number = 0.01
): boolean {
  const difference = Math.abs(bookingAmount - paymentAmount)
  const allowedDifference = bookingAmount * tolerance
  return difference <= allowedDifference
}

/**
 * Validate currency is supported
 */
export function isSupportedCurrency(currency: string): currency is SupportedCurrency {
  return SUPPORTED_CURRENCIES.includes(currency as SupportedCurrency)
}

/**
 * Calculate refund amount based on type
 */
export function calculateRefundAmount(
  paymentAmount: number,
  refundType: 'FULL' | 'PARTIAL',
  partialAmount?: number
): number {
  if (refundType === 'FULL') {
    return paymentAmount
  }

  if (!partialAmount) {
    throw new Error('Partial refund amount is required for partial refunds')
  }

  if (partialAmount > paymentAmount) {
    throw new Error('Partial refund amount cannot exceed payment amount')
  }

  return partialAmount
}
