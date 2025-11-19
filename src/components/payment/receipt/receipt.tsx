'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { VerticalTheme } from '@/lib/types/vertical-themes'

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface ReceiptLineItem {
  id: string
  description: string
  quantity?: number
  unitPrice?: number
  amount: number
  type?: 'base' | 'fee' | 'tax' | 'discount' | 'refund'
}

export interface ReceiptData {
  // Receipt metadata
  receiptNumber: string
  paymentId: string
  bookingId?: string
  issueDate: string

  // Payment details
  provider: 'stripe' | 'paystack'
  paymentMethod: string
  transactionId?: string
  status: 'paid' | 'refunded' | 'partially-refunded'

  // Amounts
  lineItems: ReceiptLineItem[]
  subtotal: number
  total: number
  currency: string
  refundedAmount?: number

  // Customer details
  customer: {
    name: string
    email: string
    phone?: string
    address?: {
      street?: string
      city?: string
      state?: string
      country?: string
    }
  }

  // Merchant details
  merchant: {
    name: string
    logo?: string
    address?: string
    email?: string
    phone?: string
    website?: string
    taxId?: string
  }

  // Booking details (if applicable)
  bookingDetails?: {
    title: string
    dates: string
    guests?: number
    location?: string
    vertical?: VerticalTheme
  }

  // Notes
  notes?: string[]
  termsUrl?: string
}

export interface ReceiptProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof receiptVariants> {
  /**
   * Receipt data
   */
  data: ReceiptData

  /**
   * Visual variant theme
   */
  vertical?: VerticalTheme

  /**
   * Show print button
   */
  showPrintButton?: boolean

  /**
   * Show download button
   */
  showDownloadButton?: boolean

  /**
   * Callback when print is clicked
   */
  onPrint?: () => void

  /**
   * Callback when download is clicked
   */
  onDownload?: () => void

  /**
   * Hide customer details (for privacy)
   */
  hideCustomerDetails?: boolean

  /**
   * Compact mode (less spacing)
   */
  compact?: boolean
}

// ============================================================================
// Component Variants (CVA)
// ============================================================================

const receiptVariants = cva('bg-white', {
  variants: {
    size: {
      sm: 'text-sm max-w-xl',
      md: 'text-base max-w-2xl',
      lg: 'text-lg max-w-3xl',
    },
    printable: {
      true: 'print:shadow-none print:border-none',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    printable: true,
  },
})

// ============================================================================
// Vertical Theme Colors
// ============================================================================

const verticalColors: Record<VerticalTheme, { bg: string; text: string; border: string }> = {
  stays: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  events: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  experiences: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  cars: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  marketplace: { bg: 'bg-yellow-50', text: 'text-yellow-900', border: 'border-yellow-200' },
  community: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
}

// ============================================================================
// Utilities
// ============================================================================

const formatPrice = (amount: number, currency: string = 'NGN') => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateString: string, includeTime: boolean = true) => {
  const date = new Date(dateString)
  if (includeTime) {
    return new Intl.DateTimeFormat('en-NG', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(date)
  }
  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'long',
  }).format(date)
}

// ============================================================================
// Component
// ============================================================================

export const Receipt = React.forwardRef<HTMLDivElement, ReceiptProps>(
  (
    {
      data,
      vertical,
      showPrintButton = true,
      showDownloadButton = true,
      onPrint,
      onDownload,
      hideCustomerDetails = false,
      compact = false,
      size,
      className,
      ...props
    },
    ref
  ) => {
    const handlePrint = () => {
      if (onPrint) {
        onPrint()
      } else {
        window.print()
      }
    }

    const handleDownload = () => {
      if (onDownload) {
        onDownload()
      } else {
        // Default: open print dialog with save as PDF option
        window.print()
      }
    }

    const currentVertical = vertical || data.bookingDetails?.vertical || 'experiences'

    return (
      <div
        ref={ref}
        className={cn(receiptVariants({ size, printable: true }), 'mx-auto', className)}
        {...props}
      >
        {/* Action Buttons (hidden on print) */}
        {(showPrintButton || showDownloadButton) && (
          <div className="mb-6 flex gap-3 print:hidden">
            {showPrintButton && (
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print Receipt
              </button>
            )}

            {showDownloadButton && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download PDF
              </button>
            )}
          </div>
        )}

        {/* Receipt Container */}
        <div className="border-2 border-gray-200 rounded-lg overflow-hidden print:border-gray-400">
          {/* Header */}
          <div
            className={cn(
              'p-8 border-b-2 border-gray-200',
              currentVertical && verticalColors[currentVertical].bg
            )}
          >
            <div className="flex items-start justify-between mb-6">
              {/* Merchant Logo & Info */}
              <div className="flex-1">
                {data.merchant.logo ? (
                  <img
                    src={data.merchant.logo}
                    alt={data.merchant.name}
                    className="h-12 mb-4"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {data.merchant.name}
                  </h1>
                )}
                {data.merchant.address && (
                  <p className="text-sm text-gray-600">{data.merchant.address}</p>
                )}
                {data.merchant.phone && (
                  <p className="text-sm text-gray-600">Tel: {data.merchant.phone}</p>
                )}
                {data.merchant.email && (
                  <p className="text-sm text-gray-600">Email: {data.merchant.email}</p>
                )}
              </div>

              {/* Receipt Badge */}
              <div className="text-right">
                <div
                  className={cn(
                    'inline-block px-4 py-2 rounded-lg mb-2',
                    data.status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : data.status === 'refunded'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                  )}
                >
                  <span className="font-semibold uppercase text-sm">
                    {data.status === 'paid'
                      ? 'Paid'
                      : data.status === 'refunded'
                        ? 'Refunded'
                        : 'Partially Refunded'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Receipt</p>
                <p className="font-mono text-sm font-semibold text-gray-900">
                  #{data.receiptNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Receipt Info */}
          <div className={cn('p-8 border-b-2 border-gray-200', compact && 'p-6')}>
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Receipt Number</p>
                  <p className="font-semibold text-gray-900">{data.receiptNumber}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment ID</p>
                  <p className="font-mono text-xs text-gray-900">{data.paymentId}</p>
                </div>

                {data.bookingId && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Booking ID</p>
                    <p className="font-semibold text-gray-900">{data.bookingId}</p>
                  </div>
                )}

                {data.transactionId && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
                    <p className="font-mono text-xs text-gray-900">{data.transactionId}</p>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Issue Date</p>
                  <p className="text-gray-900">{formatDate(data.issueDate)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                  <p className="text-gray-900">{data.paymentMethod}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Provider</p>
                  <p className="text-gray-900 capitalize">{data.provider}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          {!hideCustomerDetails && (
            <div className={cn('p-8 border-b-2 border-gray-200 print:p-6', compact && 'p-6')}>
              <h3 className="font-semibold text-gray-900 mb-4">Bill To</h3>
              <div className="space-y-1">
                <p className="font-medium text-gray-900">{data.customer.name}</p>
                <p className="text-sm text-gray-600">{data.customer.email}</p>
                {data.customer.phone && (
                  <p className="text-sm text-gray-600">{data.customer.phone}</p>
                )}
                {data.customer.address && (
                  <div className="text-sm text-gray-600 mt-2">
                    {data.customer.address.street && <p>{data.customer.address.street}</p>}
                    {(data.customer.address.city || data.customer.address.state) && (
                      <p>
                        {data.customer.address.city}
                        {data.customer.address.city && data.customer.address.state && ', '}
                        {data.customer.address.state}
                      </p>
                    )}
                    {data.customer.address.country && <p>{data.customer.address.country}</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Booking Details */}
          {data.bookingDetails && (
            <div className={cn('p-8 border-b-2 border-gray-200', compact && 'p-6')}>
              <h3 className="font-semibold text-gray-900 mb-4">Booking Details</h3>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{data.bookingDetails.title}</p>
                <p className="text-sm text-gray-600">{data.bookingDetails.dates}</p>
                {data.bookingDetails.guests && (
                  <p className="text-sm text-gray-600">
                    {data.bookingDetails.guests}{' '}
                    {data.bookingDetails.guests === 1 ? 'Guest' : 'Guests'}
                  </p>
                )}
                {data.bookingDetails.location && (
                  <p className="text-sm text-gray-600">{data.bookingDetails.location}</p>
                )}
              </div>
            </div>
          )}

          {/* Line Items */}
          <div className={cn('p-8', compact && 'p-6')}>
            <h3 className="font-semibold text-gray-900 mb-4">Payment Breakdown</h3>

            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-sm font-medium text-gray-700">Description</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-700">Qty</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-700">
                    Unit Price
                  </th>
                  <th className="text-right py-3 text-sm font-medium text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.lineItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-3 text-gray-900">
                      {item.description}
                      {item.type === 'discount' && (
                        <span className="ml-2 text-xs text-green-600">(Discount)</span>
                      )}
                      {item.type === 'refund' && (
                        <span className="ml-2 text-xs text-red-600">(Refunded)</span>
                      )}
                    </td>
                    <td className="py-3 text-right text-gray-900">
                      {item.quantity || '-'}
                    </td>
                    <td className="py-3 text-right text-gray-900">
                      {item.unitPrice ? formatPrice(item.unitPrice, data.currency) : '-'}
                    </td>
                    <td className="py-3 text-right text-gray-900 font-medium">
                      {item.type === 'discount' || item.type === 'refund' ? '-' : ''}
                      {formatPrice(Math.abs(item.amount), data.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="mt-6 space-y-3">
              <div className="flex justify-between py-3 border-t border-gray-200">
                <span className="text-gray-700">Subtotal</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(data.subtotal, data.currency)}
                </span>
              </div>

              {data.refundedAmount && data.refundedAmount > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-red-600">Refunded Amount</span>
                  <span className="font-medium text-red-600">
                    -{formatPrice(data.refundedAmount, data.currency)}
                  </span>
                </div>
              )}

              <div className="flex justify-between py-4 border-t-2 border-gray-300">
                <span className="text-lg font-bold text-gray-900">Total Paid</span>
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(data.total, data.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          {(data.notes || data.termsUrl) && (
            <div className={cn('p-8 bg-gray-50 border-t-2 border-gray-200', compact && 'p-6')}>
              {data.notes && data.notes.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {data.notes.map((note, index) => (
                      <li key={index}>• {note}</li>
                    ))}
                  </ul>
                </div>
              )}

              {data.termsUrl && (
                <p className="text-xs text-gray-500">
                  View our{' '}
                  <a
                    href={data.termsUrl}
                    className="text-primary hover:underline print:text-gray-700"
                  >
                    Terms and Conditions
                  </a>
                </p>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="p-6 bg-gray-100 text-center border-t border-gray-200">
            <p className="text-xs text-gray-600">
              Thank you for your business! This is an official receipt for your payment.
            </p>
            {data.merchant.website && (
              <p className="text-xs text-gray-500 mt-1">{data.merchant.website}</p>
            )}
          </div>
        </div>
      </div>
    )
  }
)

Receipt.displayName = 'Receipt'
