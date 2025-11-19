/**
 * Payment Reconciliation Service
 * Sprint 4 - Payment Integration
 * Created by: Nesiah (Backend Lead)
 *
 * Reconciles payment records between internal database and payment providers
 */

import { prisma } from '../prisma'
import {
  type ReconciliationInput,
  type ReconciliationRecord,
} from '../validation/payment.validation'

// ============================================
// TYPES
// ============================================

export interface ReconciliationReport {
  summary: {
    totalPayments: number
    matched: number
    unmatched: number
    discrepancies: number
    matchRate: number
    totalInternalAmount: number
    totalProviderAmount: number
    totalDiscrepancy: number
  }
  records: ReconciliationRecord[]
  byProvider: {
    STRIPE: {
      total: number
      matched: number
      unmatched: number
      discrepancies: number
    }
    PAYSTACK: {
      total: number
      matched: number
      unmatched: number
      discrepancies: number
    }
  }
  metadata: {
    startDate: string
    endDate: string
    generatedAt: string
    reconciliationId: string
  }
}

export interface ProviderPayment {
  id: string
  amount: number
  currency: string
  status: string
  created: number
  metadata?: Record<string, any>
}

// ============================================
// MAIN RECONCILIATION
// ============================================

/**
 * Perform payment reconciliation for a date range
 * Compares internal payment records with provider records
 */
export async function reconcilePayments(
  input: ReconciliationInput
): Promise<ReconciliationReport> {
  const startDate = new Date(input.startDate)
  const endDate = new Date(input.endDate)

  // Fetch internal payments
  const internalPayments = await prisma.payment.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      ...(input.provider !== 'ALL' ? { provider: input.provider } : {}),
      status: {
        in: ['COMPLETED', 'REFUNDED'],
      },
    },
    include: {
      booking: {
        select: {
          id: true,
          userId: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Fetch provider payments (simulated for now)
  const providerPayments = await fetchProviderPayments(
    input.provider,
    startDate,
    endDate
  )

  // Reconcile records
  const records: ReconciliationRecord[] = []
  let matchedCount = 0
  let unmatchedCount = 0
  let discrepancyCount = 0
  let totalInternalAmount = 0
  let totalProviderAmount = 0
  let totalDiscrepancy = 0

  // Process each internal payment
  for (const payment of internalPayments) {
    const providerPayment = providerPayments.find(
      (p) => p.id === payment.providerPaymentId
    )

    const internalAmount = Number(payment.amount)
    const providerAmount = providerPayment ? providerPayment.amount : 0

    totalInternalAmount += internalAmount

    if (providerPayment) {
      totalProviderAmount += providerAmount

      const amountDifference = Math.abs(internalAmount - providerAmount)
      const matched = amountDifference < 0.01 // Allow 1 cent difference for rounding

      if (matched) {
        matchedCount++
        records.push({
          paymentId: payment.id,
          bookingId: payment.bookingId,
          providerPaymentId: payment.providerPaymentId || '',
          internalAmount,
          providerAmount,
          matched: true,
          status: 'MATCHED',
        })
      } else {
        discrepancyCount++
        totalDiscrepancy += amountDifference
        records.push({
          paymentId: payment.id,
          bookingId: payment.bookingId,
          providerPaymentId: payment.providerPaymentId || '',
          internalAmount,
          providerAmount,
          matched: false,
          discrepancy: amountDifference,
          status: 'DISCREPANCY',
          notes: `Amount mismatch: Internal $${internalAmount} vs Provider $${providerAmount}`,
        })
      }
    } else {
      unmatchedCount++
      records.push({
        paymentId: payment.id,
        bookingId: payment.bookingId,
        providerPaymentId: payment.providerPaymentId || 'UNKNOWN',
        internalAmount,
        providerAmount: 0,
        matched: false,
        status: 'UNMATCHED',
        notes: 'Payment not found in provider records',
      })
    }
  }

  // Check for payments in provider but not in our database
  for (const providerPayment of providerPayments) {
    const internalPayment = internalPayments.find(
      (p) => p.providerPaymentId === providerPayment.id
    )

    if (!internalPayment) {
      unmatchedCount++
      records.push({
        paymentId: 'UNKNOWN',
        bookingId: 'UNKNOWN',
        providerPaymentId: providerPayment.id,
        internalAmount: 0,
        providerAmount: providerPayment.amount,
        matched: false,
        status: 'UNMATCHED',
        notes: 'Payment found in provider but not in internal database',
      })
    }
  }

  // Calculate provider-specific stats
  const stripePayments = records.filter((r) =>
    r.providerPaymentId.startsWith('pi_') || r.providerPaymentId.startsWith('ch_')
  )
  const paystackPayments = records.filter(
    (r) => !r.providerPaymentId.startsWith('pi_') && !r.providerPaymentId.startsWith('ch_')
  )

  const byProvider = {
    STRIPE: calculateProviderStats(stripePayments),
    PAYSTACK: calculateProviderStats(paystackPayments),
  }

  // Filter records based on status if requested
  const filteredRecords =
    input.status === 'ALL'
      ? records
      : records.filter((r) => r.status === input.status)

  // Apply pagination
  const startIndex = (input.page - 1) * input.limit
  const endIndex = startIndex + input.limit
  const paginatedRecords = filteredRecords.slice(startIndex, endIndex)

  const report: ReconciliationReport = {
    summary: {
      totalPayments: records.length,
      matched: matchedCount,
      unmatched: unmatchedCount,
      discrepancies: discrepancyCount,
      matchRate: records.length > 0 ? (matchedCount / records.length) * 100 : 0,
      totalInternalAmount,
      totalProviderAmount,
      totalDiscrepancy,
    },
    records: paginatedRecords,
    byProvider,
    metadata: {
      startDate: input.startDate,
      endDate: input.endDate,
      generatedAt: new Date().toISOString(),
      reconciliationId: `recon_${Date.now()}`,
    },
  }

  return report
}

// ============================================
// PROVIDER INTEGRATION
// ============================================

/**
 * Fetch payments from provider APIs
 * NOTE: This is a placeholder implementation
 */
async function fetchProviderPayments(
  provider: 'STRIPE' | 'PAYSTACK' | 'ALL',
  startDate: Date,
  endDate: Date
): Promise<ProviderPayment[]> {
  const payments: ProviderPayment[] = []

  // In production, you would fetch from actual provider APIs:
  //
  // STRIPE:
  // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
  // const charges = await stripe.charges.list({
  //   created: {
  //     gte: Math.floor(startDate.getTime() / 1000),
  //     lte: Math.floor(endDate.getTime() / 1000),
  //   },
  //   limit: 100,
  // })
  // payments.push(...charges.data.map(charge => ({
  //   id: charge.id,
  //   amount: charge.amount / 100,
  //   currency: charge.currency,
  //   status: charge.status,
  //   created: charge.created,
  //   metadata: charge.metadata,
  // })))
  //
  // PAYSTACK:
  // const response = await fetch('https://api.paystack.co/transaction', {
  //   headers: {
  //     Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
  //   },
  //   params: {
  //     from: startDate.toISOString(),
  //     to: endDate.toISOString(),
  //   },
  // })
  // const data = await response.json()
  // payments.push(...data.data.map(tx => ({
  //   id: tx.reference,
  //   amount: tx.amount / 100,
  //   currency: tx.currency,
  //   status: tx.status,
  //   created: new Date(tx.paid_at).getTime() / 1000,
  //   metadata: tx.metadata,
  // })))

  // For now, return empty array (will cause all payments to be unmatched)
  console.log('[RECONCILIATION]', {
    provider,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    note: 'Using placeholder provider payment fetch',
  })

  return payments
}

/**
 * Fetch Stripe payments
 */
async function fetchStripePayments(
  startDate: Date,
  endDate: Date
): Promise<ProviderPayment[]> {
  // Placeholder implementation
  return []
}

/**
 * Fetch Paystack payments
 */
async function fetchPaystackPayments(
  startDate: Date,
  endDate: Date
): Promise<ProviderPayment[]> {
  // Placeholder implementation
  return []
}

// ============================================
// RECONCILIATION HELPERS
// ============================================

/**
 * Calculate statistics for a specific provider
 */
function calculateProviderStats(records: ReconciliationRecord[]) {
  const matched = records.filter((r) => r.status === 'MATCHED').length
  const unmatched = records.filter((r) => r.status === 'UNMATCHED').length
  const discrepancies = records.filter((r) => r.status === 'DISCREPANCY').length

  return {
    total: records.length,
    matched,
    unmatched,
    discrepancies,
  }
}

/**
 * Generate reconciliation report in different formats
 */
export async function generateReconciliationReport(
  input: ReconciliationInput,
  format: 'JSON' | 'CSV' | 'PDF' = 'JSON'
): Promise<string | ReconciliationReport> {
  const report = await reconcilePayments(input)

  switch (format) {
    case 'JSON':
      return report

    case 'CSV':
      return generateCSVReport(report)

    case 'PDF':
      // In production, you would generate a PDF using a library like PDFKit
      return JSON.stringify(report, null, 2)

    default:
      return report
  }
}

/**
 * Generate CSV format report
 */
function generateCSVReport(report: ReconciliationReport): string {
  const headers = [
    'Payment ID',
    'Booking ID',
    'Provider Payment ID',
    'Internal Amount',
    'Provider Amount',
    'Discrepancy',
    'Status',
    'Notes',
  ]

  const rows = report.records.map((record) => [
    record.paymentId,
    record.bookingId,
    record.providerPaymentId,
    record.internalAmount.toFixed(2),
    record.providerAmount.toFixed(2),
    record.discrepancy?.toFixed(2) || '0.00',
    record.status,
    record.notes || '',
  ])

  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')

  return csv
}

// ============================================
// AUTOMATED RECONCILIATION
// ============================================

/**
 * Schedule automated daily reconciliation
 * NOTE: In production, this would be called by a cron job or scheduler
 */
export async function performDailyReconciliation(): Promise<ReconciliationReport> {
  const endDate = new Date()
  const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000) // Yesterday

  const input: ReconciliationInput = {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    provider: 'ALL',
    status: 'ALL',
    page: 1,
    limit: 1000,
  }

  const report = await reconcilePayments(input)

  // Log results
  console.log('[DAILY RECONCILIATION]', {
    date: endDate.toISOString().split('T')[0],
    totalPayments: report.summary.totalPayments,
    matchRate: report.summary.matchRate.toFixed(2) + '%',
    discrepancies: report.summary.discrepancies,
    totalDiscrepancy: report.summary.totalDiscrepancy.toFixed(2),
  })

  // In production, you would:
  // 1. Store the report in the database
  // 2. Send alerts if match rate is below threshold
  // 3. Generate notifications for discrepancies

  return report
}

/**
 * Get reconciliation statistics for a date range
 */
export async function getReconciliationStats(startDate: Date, endDate: Date) {
  const payments = await prisma.payment.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      status: {
        in: ['COMPLETED', 'REFUNDED'],
      },
    },
  })

  const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0)

  const byProvider = {
    STRIPE: payments.filter((p) => p.provider === 'STRIPE'),
    PAYSTACK: payments.filter((p) => p.provider === 'PAYSTACK'),
  }

  return {
    totalPayments: payments.length,
    totalAmount,
    byProvider: {
      STRIPE: {
        count: byProvider.STRIPE.length,
        amount: byProvider.STRIPE.reduce((sum, p) => sum + Number(p.amount), 0),
      },
      PAYSTACK: {
        count: byProvider.PAYSTACK.length,
        amount: byProvider.PAYSTACK.reduce((sum, p) => sum + Number(p.amount), 0),
      },
    },
  }
}

/**
 * Fix a reconciliation discrepancy
 */
export async function fixDiscrepancy(
  paymentId: string,
  correctedAmount: number,
  notes: string
): Promise<{ success: boolean; message: string }> {
  try {
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        amount: correctedAmount,
        metadata: {
          reconciliationFix: {
            correctedAt: new Date().toISOString(),
            notes,
          },
        },
      },
    })

    return {
      success: true,
      message: 'Discrepancy fixed successfully',
    }
  } catch (error) {
    console.error('Error fixing discrepancy:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fix discrepancy',
    }
  }
}
