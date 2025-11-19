/**
 * Refund API Endpoint
 * Sprint 4 - Payment Integration
 * Created by: Nesiah (Backend Lead)
 *
 * POST /api/payments/refund - Create refund request
 * GET /api/payments/refund - Get refund status
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  createRefundRequest,
  processRefund,
  getRefundById,
  getBookingRefunds,
} from '@/lib/services/refund.service'
import {
  refundCreateSchema,
  refundProcessSchema,
  type RefundCreateInput,
} from '@/lib/validation/payment.validation'

// ============================================
// CREATE REFUND REQUEST
// ============================================

/**
 * POST /api/payments/refund
 * Create a new refund request
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validated = refundCreateSchema.parse(body) as RefundCreateInput

    // TODO: Get authenticated user from session
    // For now, using a placeholder
    const requestedBy = 'system' // Replace with actual user ID from auth

    // Create refund request
    const result = await createRefundRequest(validated, requestedBy)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 400 }
      )
    }

    // If refund was created, attempt to process it
    const refund = result.refund
    if (refund) {
      // Get payment details for processing
      const { payment } = await getRefundById(refund.id)

      if (payment && payment.providerPaymentId) {
        // Process the refund asynchronously
        const processInput = {
          paymentId: payment.id,
          refundId: refund.id,
          amount: Number(refund.amount),
          provider: refund.provider,
          providerPaymentId: payment.providerPaymentId,
          idempotencyKey: `refund_${refund.id}`,
        }

        // Validate process input
        refundProcessSchema.parse(processInput)

        // Process refund (in production, this would be async/queued)
        processRefund(processInput).catch((error) => {
          console.error('Error processing refund:', error)
        })
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Refund request created successfully',
        refund: result.refund,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Refund creation error:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}

// ============================================
// GET REFUND STATUS
// ============================================

/**
 * GET /api/payments/refund?refundId=xxx
 * or
 * GET /api/payments/refund?bookingId=xxx
 *
 * Get refund status by refund ID or all refunds for a booking
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const refundId = searchParams.get('refundId')
    const bookingId = searchParams.get('bookingId')

    if (!refundId && !bookingId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Either refundId or bookingId is required',
        },
        { status: 400 }
      )
    }

    // Get refund by ID
    if (refundId) {
      const refund = await getRefundById(refundId)

      if (!refund) {
        return NextResponse.json(
          {
            success: false,
            error: 'Refund not found',
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        refund,
      })
    }

    // Get all refunds for booking
    if (bookingId) {
      const refunds = await getBookingRefunds(bookingId)

      return NextResponse.json({
        success: true,
        refunds,
        total: refunds.length,
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid request',
      },
      { status: 400 }
    )
  } catch (error) {
    console.error('Refund fetch error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
