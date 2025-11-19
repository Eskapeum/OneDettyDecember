'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { VerticalTheme } from '@/lib/types/vertical-themes'

// ============================================================================
// Types
// ============================================================================

interface PaymentSuccessData {
  paymentId: string
  bookingId: string
  amount: number
  currency: string
  paymentMethod: string
  provider: 'stripe' | 'paystack'
  timestamp: string
  receiptUrl?: string
  bookingDetails?: {
    title: string
    dates: string
    guests: number
    vertical: VerticalTheme
  }
}

// ============================================================================
// Vertical Theme Colors
// ============================================================================

const verticalColors: Record<VerticalTheme, { bg: string; text: string; button: string }> = {
  stays: { bg: 'bg-blue-50', text: 'text-blue-700', button: 'bg-blue-600 hover:bg-blue-700' },
  events: { bg: 'bg-purple-50', text: 'text-purple-700', button: 'bg-purple-600 hover:bg-purple-700' },
  experiences: { bg: 'bg-green-50', text: 'text-green-700', button: 'bg-green-600 hover:bg-green-700' },
  cars: { bg: 'bg-red-50', text: 'text-red-700', button: 'bg-red-600 hover:bg-red-700' },
  marketplace: { bg: 'bg-yellow-50', text: 'text-yellow-900', button: 'bg-yellow-600 hover:bg-yellow-700' },
  community: { bg: 'bg-pink-50', text: 'text-pink-700', button: 'bg-pink-600 hover:bg-pink-700' },
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(date)
}

// ============================================================================
// Component
// ============================================================================

export default function PaymentSuccessPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [paymentData, setPaymentData] = React.useState<PaymentSuccessData | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    // Fetch payment details
    const fetchPaymentData = async () => {
      try {
        setLoading(true)
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/payments/${params.id}`)
        // const data = await response.json()

        // Mock data for demonstration
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockData: PaymentSuccessData = {
          paymentId: params.id as string,
          bookingId: 'BKG-' + Math.random().toString(36).substring(7).toUpperCase(),
          amount: 47250,
          currency: 'NGN',
          paymentMethod: 'Visa •••• 4242',
          provider: 'stripe',
          timestamp: new Date().toISOString(),
          receiptUrl: `/receipts/${params.id}`,
          bookingDetails: {
            title: 'Lagos Island Experience',
            dates: 'Dec 24, 2025 - Dec 25, 2025',
            guests: 2,
            vertical: 'experiences',
          },
        }

        setPaymentData(mockData)
        setError(null)
      } catch (err) {
        console.error('Error fetching payment data:', err)
        setError('Failed to load payment details. Please contact support.')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchPaymentData()
    }
  }, [params.id])

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Confirming your payment...</p>
        </div>
      </div>
    )
  }

  // Error State
  if (error || !paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something Went Wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  const vertical = paymentData.bookingDetails?.vertical || 'experiences'

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
          {/* Success Icon */}
          <div
            className={cn(
              'w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center',
              verticalColors[vertical].bg
            )}
          >
            <svg
              className={cn('w-10 h-10', verticalColors[vertical].text)}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-lg text-gray-600 mb-6">
            Your booking has been confirmed. We've sent a confirmation email with all the details.
          </p>

          {/* Payment Amount */}
          <div className={cn('inline-flex items-center gap-2 px-6 py-3 rounded-lg', verticalColors[vertical].bg)}>
            <span className="text-gray-600">Amount Paid:</span>
            <span className={cn('text-2xl font-bold', verticalColors[vertical].text)}>
              {formatPrice(paymentData.amount, paymentData.currency)}
            </span>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Details</h2>

          <div className="space-y-4">
            {/* Booking ID */}
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Booking ID</span>
              <span className="font-semibold text-gray-900">{paymentData.bookingId}</span>
            </div>

            {/* Payment ID */}
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Payment ID</span>
              <span className="font-mono text-sm text-gray-900">{paymentData.paymentId}</span>
            </div>

            {/* Payment Method */}
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-semibold text-gray-900">{paymentData.paymentMethod}</span>
            </div>

            {/* Payment Provider */}
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Provider</span>
              <span className="font-semibold text-gray-900 capitalize">{paymentData.provider}</span>
            </div>

            {/* Date & Time */}
            <div className="flex justify-between py-3">
              <span className="text-gray-600">Date & Time</span>
              <span className="text-gray-900">{formatDate(paymentData.timestamp)}</span>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        {paymentData.bookingDetails && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Details</h2>

            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Experience</span>
                <span className="font-semibold text-gray-900">{paymentData.bookingDetails.title}</span>
              </div>

              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Dates</span>
                <span className="text-gray-900">{paymentData.bookingDetails.dates}</span>
              </div>

              <div className="flex justify-between py-3">
                <span className="text-gray-600">Guests</span>
                <span className="text-gray-900">
                  {paymentData.bookingDetails.guests}{' '}
                  {paymentData.bookingDetails.guests === 1 ? 'Guest' : 'Guests'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What's Next?</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white',
                  verticalColors[vertical].button
                )}
              >
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Check Your Email</h3>
                <p className="text-gray-600 text-sm">
                  We've sent a confirmation email with your booking details and receipt.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div
                className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white',
                  verticalColors[vertical].button
                )}
              >
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Prepare for Your Experience</h3>
                <p className="text-gray-600 text-sm">
                  Review the details and prepare for an amazing experience!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div
                className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white',
                  verticalColors[vertical].button
                )}
              >
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Need Help?</h3>
                <p className="text-gray-600 text-sm">
                  Contact our support team anytime if you have questions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push(`/bookings/${paymentData.bookingId}`)}
            className={cn(
              'flex-1 px-6 py-4 text-white font-semibold rounded-lg transition-colors',
              verticalColors[vertical].button
            )}
          >
            View Booking Details
          </button>

          {paymentData.receiptUrl && (
            <button
              onClick={() => router.push(paymentData.receiptUrl!)}
              className="flex-1 px-6 py-4 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Download Receipt
            </button>
          )}

          <button
            onClick={() => router.push('/')}
            className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            Return Home
          </button>
        </div>

        {/* Support */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <a href="/support" className={cn('font-semibold hover:underline', verticalColors[vertical].text)}>
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
