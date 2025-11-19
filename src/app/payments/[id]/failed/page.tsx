'use client'

import * as React from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { VerticalTheme } from '@/lib/types/vertical-themes'

// ============================================================================
// Types
// ============================================================================

interface PaymentFailureData {
  paymentId: string
  amount: number
  currency: string
  provider: 'stripe' | 'paystack'
  errorCode?: string
  errorMessage: string
  timestamp: string
  bookingDetails?: {
    title: string
    dates: string
    guests: number
    vertical: VerticalTheme
  }
  retryable: boolean
  supportedActions: Array<'retry' | 'change-method' | 'contact-support'>
}

type FailureReason =
  | 'insufficient-funds'
  | 'card-declined'
  | 'expired-card'
  | 'invalid-card'
  | 'network-error'
  | 'authentication-failed'
  | 'limit-exceeded'
  | 'unknown'

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
// Failure Reason Messages
// ============================================================================

const failureReasonMessages: Record<
  FailureReason,
  { title: string; message: string; icon: string }
> = {
  'insufficient-funds': {
    title: 'Insufficient Funds',
    message: 'Your card does not have enough funds to complete this transaction.',
    icon: 'wallet',
  },
  'card-declined': {
    title: 'Card Declined',
    message:
      'Your card was declined by your bank. Please try a different payment method or contact your bank.',
    icon: 'card',
  },
  'expired-card': {
    title: 'Card Expired',
    message: 'The card you used has expired. Please use a different card.',
    icon: 'calendar',
  },
  'invalid-card': {
    title: 'Invalid Card',
    message: 'The card information you entered is invalid. Please check and try again.',
    icon: 'alert',
  },
  'network-error': {
    title: 'Network Error',
    message:
      'We encountered a network error while processing your payment. Please try again.',
    icon: 'wifi',
  },
  'authentication-failed': {
    title: 'Authentication Failed',
    message: '3D Secure authentication failed. Please try again or use a different card.',
    icon: 'lock',
  },
  'limit-exceeded': {
    title: 'Limit Exceeded',
    message: 'This transaction exceeds your card limit. Please try a different payment method.',
    icon: 'trending-up',
  },
  unknown: {
    title: 'Payment Failed',
    message: 'Your payment could not be processed. Please try again or contact support.',
    icon: 'x-circle',
  },
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

const getFailureReason = (errorCode?: string): FailureReason => {
  if (!errorCode) return 'unknown'

  const code = errorCode.toLowerCase()
  if (code.includes('insufficient') || code.includes('funds')) return 'insufficient-funds'
  if (code.includes('declined')) return 'card-declined'
  if (code.includes('expired')) return 'expired-card'
  if (code.includes('invalid')) return 'invalid-card'
  if (code.includes('network')) return 'network-error'
  if (code.includes('authentication') || code.includes('3ds')) return 'authentication-failed'
  if (code.includes('limit')) return 'limit-exceeded'

  return 'unknown'
}

// ============================================================================
// Component
// ============================================================================

export default function PaymentFailedPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = React.useState(true)
  const [paymentData, setPaymentData] = React.useState<PaymentFailureData | null>(null)

  React.useEffect(() => {
    // Fetch payment failure details
    const fetchPaymentData = async () => {
      try {
        setLoading(true)
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/payments/${params.id}/failure`)
        // const data = await response.json()

        // Mock data for demonstration
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const errorCode = searchParams.get('error') || 'card-declined'

        const mockData: PaymentFailureData = {
          paymentId: params.id as string,
          amount: 47250,
          currency: 'NGN',
          provider: 'stripe',
          errorCode: errorCode,
          errorMessage: 'Your card was declined. Please try another payment method.',
          timestamp: new Date().toISOString(),
          bookingDetails: {
            title: 'Lagos Island Experience',
            dates: 'Dec 24, 2025 - Dec 25, 2025',
            guests: 2,
            vertical: 'experiences',
          },
          retryable: true,
          supportedActions: ['retry', 'change-method', 'contact-support'],
        }

        setPaymentData(mockData)
      } catch (err) {
        console.error('Error fetching payment failure data:', err)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchPaymentData()
    }
  }, [params.id, searchParams])

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    )
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Not Found</h2>
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
  const failureReason = getFailureReason(paymentData.errorCode)
  const reasonInfo = failureReasonMessages[failureReason]

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Failure Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
          {/* Failure Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-600"
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

          {/* Failure Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{reasonInfo.title}</h1>
          <p className="text-lg text-gray-600 mb-6">{reasonInfo.message}</p>

          {/* Payment Amount */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-lg">
            <span className="text-gray-600">Attempted Amount:</span>
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(paymentData.amount, paymentData.currency)}
            </span>
          </div>
        </div>

        {/* Error Details */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Details</h2>

          <div className="space-y-4">
            {/* Payment ID */}
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Payment ID</span>
              <span className="font-mono text-sm text-gray-900">{paymentData.paymentId}</span>
            </div>

            {/* Error Code */}
            {paymentData.errorCode && (
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Error Code</span>
                <span className="font-mono text-sm text-red-600">{paymentData.errorCode}</span>
              </div>
            )}

            {/* Provider */}
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

        {/* Booking Details (if available) */}
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

        {/* What to Do Next */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What Should I Do?</h2>

          <div className="space-y-4">
            {failureReason === 'insufficient-funds' && (
              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Try these options:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use a different card with sufficient funds</li>
                    <li>Add funds to your current card and try again</li>
                    <li>Choose a different payment method like bank transfer</li>
                  </ul>
                </div>
              </div>
            )}

            {failureReason === 'card-declined' && (
              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Common reasons for declined cards:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Your bank may have blocked the transaction for security</li>
                    <li>You may have reached your spending limit</li>
                    <li>Contact your bank to authorize the payment</li>
                    <li>Try using a different payment method</li>
                  </ul>
                </div>
              </div>
            )}

            {failureReason === 'network-error' && (
              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">This was likely a temporary issue:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Check your internet connection</li>
                    <li>Try again in a few moments</li>
                    <li>If the problem persists, contact support</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {paymentData.supportedActions.includes('retry') && paymentData.retryable && (
            <button
              onClick={() => router.push(`/payments/new?booking=${paymentData.paymentId}`)}
              className={cn(
                'flex-1 px-6 py-4 text-white font-semibold rounded-lg transition-colors',
                verticalColors[vertical].button
              )}
            >
              Try Again
            </button>
          )}

          {paymentData.supportedActions.includes('change-method') && (
            <button
              onClick={() => router.push(`/payments/new?booking=${paymentData.paymentId}&change_method=true`)}
              className="flex-1 px-6 py-4 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Change Payment Method
            </button>
          )}

          {paymentData.supportedActions.includes('contact-support') && (
            <button
              onClick={() => router.push('/support')}
              className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              Contact Support
            </button>
          )}
        </div>

        {/* Additional Help */}
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          <h3 className="font-semibold text-gray-900 mb-2">Need Assistance?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Our support team is here to help you complete your booking. We're available 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:support@onedettydecember.com"
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              support@onedettydecember.com
            </a>
            <a
              href="tel:+2341234567890"
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +234 123 456 7890
            </a>
          </div>
        </div>

        {/* Return Home Link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
          >
            ← Return to Homepage
          </button>
        </div>
      </div>
    </div>
  )
}
