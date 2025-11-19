/**
 * Refund Service
 * Sprint 4 - Payment Integration
 * Created by: Nesiah (Backend Lead)
 *
 * Handles refund processing for both Stripe and Paystack payments
 */

import { prisma } from '../prisma'
import { Prisma } from '@prisma/client'
import {
  type RefundCreateInput,
  type RefundProcessInput,
  validateRefundAmount,
  calculateRefundAmount,
} from '../validation/payment.validation'

// ============================================
// TYPES
// ============================================

export interface RefundResult {
  success: boolean
  refund?: any
  error?: string
  providerRefundId?: string
}

export interface RefundOptions {
  reason: string
  metadata?: Record<string, any>
  idempotencyKey?: string
}

// ============================================
// REFUND CREATION
// ============================================

/**
 * Create a new refund request
 * Validates the refund amount and creates a refund record
 */
export async function createRefundRequest(
  input: RefundCreateInput,
  requestedBy: string
): Promise<RefundResult> {
  try {
    // Fetch the booking with payment details
    const booking = await prisma.booking.findUnique({
      where: { id: input.bookingId },
      include: {
        payment: {
          include: {
            refunds: true,
          },
        },
      },
    })

    if (!booking) {
      return {
        success: false,
        error: 'Booking not found',
      }
    }

    if (!booking.payment) {
      return {
        success: false,
        error: 'No payment found for this booking',
      }
    }

    // Check payment status
    if (booking.payment.status !== 'COMPLETED' && booking.payment.status !== 'REFUNDED') {
      return {
        success: false,
        error: `Cannot refund payment with status: ${booking.payment.status}`,
      }
    }

    // Calculate total already refunded
    const totalRefunded = booking.payment.refunds.reduce(
      (sum, refund) =>
        refund.status === 'COMPLETED' ? sum + Number(refund.amount) : sum,
      0
    )

    // Calculate refund amount
    const paymentAmount = Number(booking.payment.amount)
    const refundAmount = calculateRefundAmount(
      paymentAmount,
      input.refundType,
      input.amount
    )

    // Validate refund amount
    if (!validateRefundAmount(paymentAmount, refundAmount, totalRefunded)) {
      return {
        success: false,
        error: `Refund amount ${refundAmount} exceeds remaining payment amount ${paymentAmount - totalRefunded}`,
      }
    }

    // Create refund record
    const refund = await prisma.refund.create({
      data: {
        paymentId: booking.payment.id,
        bookingId: booking.id,
        amount: new Prisma.Decimal(refundAmount),
        currency: booking.payment.currency,
        status: 'PENDING',
        refundType: input.refundType,
        reason: input.reason,
        provider: booking.payment.provider,
        metadata: {
          ...input.metadata,
          requestedBy,
          requestedAt: new Date().toISOString(),
          originalPaymentAmount: paymentAmount,
          totalRefundedBefore: totalRefunded,
        },
      },
    })

    return {
      success: true,
      refund,
    }
  } catch (error) {
    console.error('Error creating refund request:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create refund request',
    }
  }
}

// ============================================
// REFUND PROCESSING
// ============================================

/**
 * Process a refund with the payment provider (Stripe or Paystack)
 */
export async function processRefund(input: RefundProcessInput): Promise<RefundResult> {
  try {
    // Update refund status to PROCESSING
    await prisma.refund.update({
      where: { id: input.refundId },
      data: {
        status: 'PROCESSING',
        metadata: {
          processingStartedAt: new Date().toISOString(),
        },
      },
    })

    let result: RefundResult

    // Process based on provider
    if (input.provider === 'STRIPE') {
      result = await processStripeRefund(input)
    } else if (input.provider === 'PAYSTACK') {
      result = await processPaystackRefund(input)
    } else {
      result = {
        success: false,
        error: 'Unsupported payment provider',
      }
    }

    // Update refund based on result
    if (result.success) {
      await prisma.refund.update({
        where: { id: input.refundId },
        data: {
          status: 'COMPLETED',
          providerRefundId: result.providerRefundId,
          processedAt: new Date(),
          metadata: {
            completedAt: new Date().toISOString(),
            providerResponse: result.refund,
          },
        },
      })

      // Update payment status to REFUNDED
      await updatePaymentRefundStatus(input.paymentId)
    } else {
      await prisma.refund.update({
        where: { id: input.refundId },
        data: {
          status: 'FAILED',
          failureReason: result.error,
          metadata: {
            failedAt: new Date().toISOString(),
            error: result.error,
          },
        },
      })
    }

    return result
  } catch (error) {
    console.error('Error processing refund:', error)

    // Update refund to FAILED status
    await prisma.refund.update({
      where: { id: input.refundId },
      data: {
        status: 'FAILED',
        failureReason: error instanceof Error ? error.message : 'Unknown error',
      },
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process refund',
    }
  }
}

/**
 * Process Stripe refund
 * NOTE: Requires Stripe SDK to be installed and configured
 */
async function processStripeRefund(input: RefundProcessInput): Promise<RefundResult> {
  try {
    // NOTE: This is a placeholder implementation
    // In production, you would use the Stripe SDK:
    //
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    // const refund = await stripe.refunds.create({
    //   payment_intent: input.providerPaymentId,
    //   amount: Math.round(input.amount * 100), // Convert to cents
    //   reason: 'requested_by_customer',
    //   metadata: {
    //     refundId: input.refundId,
    //   },
    // }, {
    //   idempotencyKey: input.idempotencyKey,
    // })

    // For now, simulate successful refund
    console.log('[STRIPE REFUND]', {
      paymentId: input.providerPaymentId,
      amount: input.amount,
      refundId: input.refundId,
    })

    return {
      success: true,
      providerRefundId: `re_${Date.now()}`, // Simulated Stripe refund ID
      refund: {
        id: `re_${Date.now()}`,
        amount: Math.round(input.amount * 100),
        currency: 'usd',
        status: 'succeeded',
      },
    }
  } catch (error) {
    console.error('Stripe refund error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Stripe refund failed',
    }
  }
}

/**
 * Process Paystack refund
 * NOTE: Requires Paystack SDK to be installed and configured
 */
async function processPaystackRefund(input: RefundProcessInput): Promise<RefundResult> {
  try {
    // NOTE: This is a placeholder implementation
    // In production, you would use the Paystack API:
    //
    // const response = await fetch('https://api.paystack.co/refund', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     transaction: input.providerPaymentId,
    //     amount: Math.round(input.amount * 100), // Convert to kobo
    //   }),
    // })
    // const data = await response.json()

    // For now, simulate successful refund
    console.log('[PAYSTACK REFUND]', {
      transaction: input.providerPaymentId,
      amount: input.amount,
      refundId: input.refundId,
    })

    return {
      success: true,
      providerRefundId: `rfnd_${Date.now()}`, // Simulated Paystack refund ID
      refund: {
        id: `rfnd_${Date.now()}`,
        amount: Math.round(input.amount * 100),
        currency: 'NGN',
        status: 'success',
      },
    }
  } catch (error) {
    console.error('Paystack refund error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Paystack refund failed',
    }
  }
}

// ============================================
// REFUND STATUS MANAGEMENT
// ============================================

/**
 * Update payment status based on refunds
 * If all refunds are completed and total equals payment amount, mark payment as REFUNDED
 */
async function updatePaymentRefundStatus(paymentId: string): Promise<void> {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      refunds: {
        where: {
          status: 'COMPLETED',
        },
      },
    },
  })

  if (!payment) return

  const totalRefunded = payment.refunds.reduce(
    (sum, refund) => sum + Number(refund.amount),
    0
  )

  const paymentAmount = Number(payment.amount)

  // If fully refunded, update payment status
  if (totalRefunded >= paymentAmount) {
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'REFUNDED',
      },
    })

    // Update booking status to REFUNDED
    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: {
        status: 'REFUNDED',
      },
    })
  }
}

/**
 * Get refund by ID
 */
export async function getRefundById(refundId: string) {
  return prisma.refund.findUnique({
    where: { id: refundId },
    include: {
      payment: {
        include: {
          booking: {
            include: {
              package: {
                select: {
                  id: true,
                  title: true,
                  type: true,
                },
              },
              user: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      },
    },
  })
}

/**
 * Get refunds for a booking
 */
export async function getBookingRefunds(bookingId: string) {
  return prisma.refund.findMany({
    where: { bookingId },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

/**
 * Get refunds for a payment
 */
export async function getPaymentRefunds(paymentId: string) {
  return prisma.refund.findMany({
    where: { paymentId },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

/**
 * Cancel a pending refund
 */
export async function cancelRefund(
  refundId: string,
  cancelledBy: string,
  reason: string
): Promise<RefundResult> {
  try {
    const refund = await prisma.refund.findUnique({
      where: { id: refundId },
    })

    if (!refund) {
      return {
        success: false,
        error: 'Refund not found',
      }
    }

    if (refund.status !== 'PENDING') {
      return {
        success: false,
        error: `Cannot cancel refund with status: ${refund.status}`,
      }
    }

    const updatedRefund = await prisma.refund.update({
      where: { id: refundId },
      data: {
        status: 'CANCELLED',
        metadata: {
          ...((refund.metadata as Record<string, any>) || {}),
          cancelledBy,
          cancelledAt: new Date().toISOString(),
          cancellationReason: reason,
        },
      },
    })

    return {
      success: true,
      refund: updatedRefund,
    }
  } catch (error) {
    console.error('Error cancelling refund:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cancel refund',
    }
  }
}

// ============================================
// REFUND STATISTICS
// ============================================

/**
 * Get refund statistics for a date range
 */
export async function getRefundStatistics(startDate: Date, endDate: Date) {
  const refunds = await prisma.refund.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  })

  const totalRefunds = refunds.length
  const completedRefunds = refunds.filter((r) => r.status === 'COMPLETED').length
  const failedRefunds = refunds.filter((r) => r.status === 'FAILED').length
  const pendingRefunds = refunds.filter((r) => r.status === 'PENDING').length

  const totalAmount = refunds
    .filter((r) => r.status === 'COMPLETED')
    .reduce((sum, r) => sum + Number(r.amount), 0)

  const byProvider = {
    STRIPE: refunds.filter((r) => r.provider === 'STRIPE').length,
    PAYSTACK: refunds.filter((r) => r.provider === 'PAYSTACK').length,
  }

  const byType = {
    FULL: refunds.filter((r) => r.refundType === 'FULL').length,
    PARTIAL: refunds.filter((r) => r.refundType === 'PARTIAL').length,
  }

  return {
    totalRefunds,
    completedRefunds,
    failedRefunds,
    pendingRefunds,
    totalAmount,
    byProvider,
    byType,
    successRate: totalRefunds > 0 ? (completedRefunds / totalRefunds) * 100 : 0,
  }
}
