'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { VerticalTheme } from '@/lib/types/vertical-themes'
import type { PaymentProvider } from '../payment-method-selector'

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface PaymentFormData {
  // Stripe fields
  cardNumber?: string
  cardExpiry?: string
  cardCvc?: string
  cardholderName?: string

  // Paystack fields
  email?: string

  // Common fields
  saveCard?: boolean
  billingAddress?: {
    street?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
}

export interface PaymentFormProps
  extends React.HTMLAttributes<HTMLFormElement>,
    VariantProps<typeof formVariants> {
  /**
   * Payment provider (determines which fields to show)
   */
  provider: PaymentProvider

  /**
   * Form data
   */
  data?: PaymentFormData

  /**
   * Callback when form data changes
   */
  onDataChange?: (data: PaymentFormData) => void

  /**
   * Callback when form is submitted
   */
  onSubmit?: (data: PaymentFormData) => void | Promise<void>

  /**
   * Visual variant theme
   */
  vertical?: VerticalTheme

  /**
   * Loading/Processing state
   */
  loading?: boolean

  /**
   * Disabled state
   */
  disabled?: boolean

  /**
   * Show save card option
   */
  showSaveCard?: boolean

  /**
   * Show billing address fields
   */
  showBillingAddress?: boolean

  /**
   * Form validation errors
   */
  errors?: Partial<Record<keyof PaymentFormData, string>>

  /**
   * Amount to be charged (for display)
   */
  amount?: number

  /**
   * Currency code
   */
  currency?: string

  /**
   * Submit button text
   */
  submitButtonText?: string

  /**
   * Custom Stripe elements (if using Stripe Elements)
   */
  stripeElementsSlot?: React.ReactNode

  /**
   * Custom Paystack component (if using Paystack inline)
   */
  paystackSlot?: React.ReactNode
}

// ============================================================================
// Component Variants (CVA)
// ============================================================================

const formVariants = cva('w-full space-y-6', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

const inputVariants = cva(
  'w-full px-4 py-3 border rounded-lg transition-all focus:outline-none focus:ring-2',
  {
    variants: {
      hasError: {
        true: 'border-red-500 focus:border-red-500 focus:ring-red-200',
        false: 'border-gray-300 focus:border-primary focus:ring-primary/20',
      },
      disabled: {
        true: 'bg-gray-100 cursor-not-allowed opacity-60',
        false: 'bg-white',
      },
    },
    defaultVariants: {
      hasError: false,
      disabled: false,
    },
  }
)

// ============================================================================
// Vertical Theme Colors
// ============================================================================

const verticalColors: Record<VerticalTheme, { ring: string; button: string }> = {
  stays: { ring: 'focus:ring-blue-200 focus:border-blue-600', button: 'bg-blue-600 hover:bg-blue-700' },
  events: { ring: 'focus:ring-purple-200 focus:border-purple-600', button: 'bg-purple-600 hover:bg-purple-700' },
  experiences: { ring: 'focus:ring-green-200 focus:border-green-600', button: 'bg-green-600 hover:bg-green-700' },
  cars: { ring: 'focus:ring-red-200 focus:border-red-600', button: 'bg-red-600 hover:bg-red-700' },
  marketplace: { ring: 'focus:ring-yellow-200 focus:border-yellow-600', button: 'bg-yellow-600 hover:bg-yellow-700' },
  community: { ring: 'focus:ring-pink-200 focus:border-pink-600', button: 'bg-pink-600 hover:bg-pink-700' },
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

const formatCardNumber = (value: string) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  const matches = v.match(/\d{4,16}/g)
  const match = (matches && matches[0]) || ''
  const parts = []

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4))
  }

  if (parts.length) {
    return parts.join(' ')
  } else {
    return value
  }
}

const formatExpiry = (value: string) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  if (v.length >= 2) {
    return `${v.substring(0, 2)}/${v.substring(2, 4)}`
  }
  return v
}

// ============================================================================
// Component
// ============================================================================

export const PaymentForm = React.forwardRef<HTMLFormElement, PaymentFormProps>(
  (
    {
      provider,
      data = {},
      onDataChange,
      onSubmit,
      vertical,
      loading = false,
      disabled = false,
      showSaveCard = true,
      showBillingAddress = false,
      errors = {},
      amount,
      currency = 'NGN',
      submitButtonText,
      stripeElementsSlot,
      paystackSlot,
      size,
      className,
      ...props
    },
    ref
  ) => {
    const [formData, setFormData] = React.useState<PaymentFormData>(data)

    React.useEffect(() => {
      setFormData(data)
    }, [data])

    const updateField = (field: keyof PaymentFormData, value: any) => {
      const newData = { ...formData, [field]: value }
      setFormData(newData)
      onDataChange?.(newData)
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (loading || disabled) return
      await onSubmit?.(formData)
    }

    const isDisabled = disabled || loading

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={cn(formVariants({ size }), className)}
        {...props}
      >
        {/* Amount Summary */}
        {amount !== undefined && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Amount to pay</span>
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(amount, currency)}
              </span>
            </div>
          </div>
        )}

        {/* Stripe Fields */}
        {provider === 'stripe' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Card Details</h3>

            {/* Custom Stripe Elements Slot */}
            {stripeElementsSlot ? (
              <div className="space-y-4">{stripeElementsSlot}</div>
            ) : (
              <>
                {/* Cardholder Name */}
                <div>
                  <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    id="cardholderName"
                    type="text"
                    value={formData.cardholderName || ''}
                    onChange={(e) => updateField('cardholderName', e.target.value)}
                    placeholder="John Doe"
                    disabled={isDisabled}
                    className={cn(
                      inputVariants({ hasError: !!errors.cardholderName, disabled: isDisabled }),
                      vertical && verticalColors[vertical].ring
                    )}
                  />
                  {errors.cardholderName && (
                    <p className="mt-1 text-sm text-red-600">{errors.cardholderName}</p>
                  )}
                </div>

                {/* Card Number */}
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    id="cardNumber"
                    type="text"
                    value={formData.cardNumber || ''}
                    onChange={(e) =>
                      updateField('cardNumber', formatCardNumber(e.target.value))
                    }
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    disabled={isDisabled}
                    className={cn(
                      inputVariants({ hasError: !!errors.cardNumber, disabled: isDisabled }),
                      vertical && verticalColors[vertical].ring
                    )}
                  />
                  {errors.cardNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                  )}
                </div>

                {/* Expiry & CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      id="cardExpiry"
                      type="text"
                      value={formData.cardExpiry || ''}
                      onChange={(e) => updateField('cardExpiry', formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      maxLength={5}
                      disabled={isDisabled}
                      className={cn(
                        inputVariants({ hasError: !!errors.cardExpiry, disabled: isDisabled }),
                        vertical && verticalColors[vertical].ring
                      )}
                    />
                    {errors.cardExpiry && (
                      <p className="mt-1 text-sm text-red-600">{errors.cardExpiry}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700 mb-2">
                      CVC
                    </label>
                    <input
                      id="cardCvc"
                      type="text"
                      value={formData.cardCvc || ''}
                      onChange={(e) =>
                        updateField('cardCvc', e.target.value.replace(/\D/g, ''))
                      }
                      placeholder="123"
                      maxLength={4}
                      disabled={isDisabled}
                      className={cn(
                        inputVariants({ hasError: !!errors.cardCvc, disabled: isDisabled }),
                        vertical && verticalColors[vertical].ring
                      )}
                    />
                    {errors.cardCvc && (
                      <p className="mt-1 text-sm text-red-600">{errors.cardCvc}</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Paystack Fields */}
        {provider === 'paystack' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Payment Details</h3>

            {/* Custom Paystack Slot */}
            {paystackSlot ? (
              <div className="space-y-4">{paystackSlot}</div>
            ) : (
              <>
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="you@example.com"
                    disabled={isDisabled}
                    className={cn(
                      inputVariants({ hasError: !!errors.email, disabled: isDisabled }),
                      vertical && verticalColors[vertical].ring
                    )}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    You'll receive payment confirmation and receipt at this email
                  </p>
                </div>

                {/* Info Box */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    After clicking "Pay Now", you'll be redirected to Paystack to complete your payment securely.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Save Card Option */}
        {showSaveCard && provider === 'stripe' && (
          <div className="flex items-start gap-3">
            <input
              id="saveCard"
              type="checkbox"
              checked={formData.saveCard || false}
              onChange={(e) => updateField('saveCard', e.target.checked)}
              disabled={isDisabled}
              className="mt-1 w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="saveCard" className="text-sm text-gray-700">
              Save card for future purchases (secure and PCI compliant)
            </label>
          </div>
        )}

        {/* Billing Address */}
        {showBillingAddress && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Billing Address</h3>

            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <input
                id="street"
                type="text"
                value={formData.billingAddress?.street || ''}
                onChange={(e) =>
                  updateField('billingAddress', {
                    ...formData.billingAddress,
                    street: e.target.value,
                  })
                }
                disabled={isDisabled}
                className={cn(
                  inputVariants({ disabled: isDisabled }),
                  vertical && verticalColors[vertical].ring
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  value={formData.billingAddress?.city || ''}
                  onChange={(e) =>
                    updateField('billingAddress', {
                      ...formData.billingAddress,
                      city: e.target.value,
                    })
                  }
                  disabled={isDisabled}
                  className={cn(
                    inputVariants({ disabled: isDisabled }),
                    vertical && verticalColors[vertical].ring
                  )}
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  id="state"
                  type="text"
                  value={formData.billingAddress?.state || ''}
                  onChange={(e) =>
                    updateField('billingAddress', {
                      ...formData.billingAddress,
                      state: e.target.value,
                    })
                  }
                  disabled={isDisabled}
                  className={cn(
                    inputVariants({ disabled: isDisabled }),
                    vertical && verticalColors[vertical].ring
                  )}
                />
              </div>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="flex items-start gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <svg
            className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <div className="text-sm text-gray-700">
            <p className="font-medium">Secure Payment</p>
            <p className="text-gray-600 mt-1">
              Your payment information is encrypted and secure. We never store your card details.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isDisabled}
          className={cn(
            'w-full px-6 py-4 text-white font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2',
            vertical
              ? `${verticalColors[vertical].button} focus:ring-${vertical === 'marketplace' ? 'yellow' : vertical === 'stays' ? 'blue' : vertical === 'events' ? 'purple' : vertical === 'experiences' ? 'green' : vertical === 'cars' ? 'red' : 'pink'}-600`
              : 'bg-primary hover:bg-primary/90 focus:ring-primary',
            isDisabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            submitButtonText ||
            `Pay ${amount !== undefined ? formatPrice(amount, currency) : 'Now'}`
          )}
        </button>

        {/* Terms */}
        <p className="text-xs text-center text-gray-500">
          By completing this payment, you agree to our{' '}
          <a href="#" className="text-primary hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </p>
      </form>
    )
  }
)

PaymentForm.displayName = 'PaymentForm'
