'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { VerticalTheme } from '@/types/vertical'

// ============================================================================
// Types & Interfaces
// ============================================================================

export type PaymentProvider = 'stripe' | 'paystack'

export interface PaymentMethod {
  id: string
  provider: PaymentProvider
  label: string
  description?: string
  icon?: React.ReactNode
  supportedMethods?: string[] // e.g., ['card', 'apple-pay', 'google-pay']
  badge?: string // e.g., 'Popular', 'Best for Africa'
  disabled?: boolean
}

export interface PaymentMethodSelectorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof selectorVariants> {
  /**
   * Available payment methods
   */
  methods: PaymentMethod[]

  /**
   * Currently selected payment method ID
   */
  selectedMethod?: string

  /**
   * Callback when payment method is selected
   */
  onMethodSelect?: (methodId: string, provider: PaymentProvider) => void

  /**
   * Visual variant theme
   */
  vertical?: VerticalTheme

  /**
   * Loading state
   */
  loading?: boolean

  /**
   * Disabled state
   */
  disabled?: boolean

  /**
   * Show payment method icons
   */
  showIcons?: boolean

  /**
   * Show supported payment types (cards, wallets, etc.)
   */
  showSupportedMethods?: boolean

  /**
   * Error message
   */
  error?: string

  /**
   * Required field indicator
   */
  required?: boolean
}

// ============================================================================
// Component Variants (CVA)
// ============================================================================

const selectorVariants = cva('w-full space-y-3', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
    layout: {
      vertical: 'flex flex-col gap-3',
      grid: 'grid grid-cols-1 md:grid-cols-2 gap-3',
    },
  },
  defaultVariants: {
    size: 'md',
    layout: 'vertical',
  },
})

const methodCardVariants = cva(
  'relative flex items-start gap-4 p-4 border-2 rounded-lg transition-all cursor-pointer hover:shadow-md',
  {
    variants: {
      selected: {
        true: 'border-primary ring-2 ring-primary ring-opacity-20 bg-primary/5',
        false: 'border-gray-300 hover:border-gray-400',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed hover:shadow-none',
        false: '',
      },
    },
    defaultVariants: {
      selected: false,
      disabled: false,
    },
  }
)

// ============================================================================
// Vertical Theme Colors
// ============================================================================

const verticalColors: Record<VerticalTheme, { border: string; bg: string; text: string }> = {
  stays: { border: 'border-blue-600', bg: 'bg-blue-50', text: 'text-blue-700' },
  events: { border: 'border-purple-600', bg: 'bg-purple-50', text: 'text-purple-700' },
  experiences: { border: 'border-green-600', bg: 'bg-green-50', text: 'text-green-700' },
  cars: { border: 'border-red-600', bg: 'bg-red-50', text: 'text-red-700' },
  marketplace: { border: 'border-yellow-600', bg: 'bg-yellow-50', text: 'text-yellow-900' },
  community: { border: 'border-pink-600', bg: 'bg-pink-50', text: 'text-pink-700' },
}

// ============================================================================
// Default Payment Method Icons
// ============================================================================

const StripeIcon = () => (
  <svg className="w-12 h-8" viewBox="0 0 60 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M59.6 12.5c0-6.9-3.4-12.5-9.9-12.5S39.8 5.6 39.8 12.5c0 8.3 4.7 12.5 11.5 12.5 3.3 0 5.8-.7 7.7-1.7v-5.8c-1.9.9-4.1 1.5-6.8 1.5-2.7 0-5.1-.9-5.4-4.2h12.7c0-.3.1-1.5.1-2.3zm-12.8-2.1c0-3.1 1.9-4.4 3-4.4 1.4 0 2.9 1.3 2.9 4.4h-5.9zm-7.5-9.1c-2.7 0-4.4 1.3-5.4 2.1l-.4-1.7h-6.2V24.5l7-1.5V16c1 .7 2.5 1.8 4.8 1.8 4.9 0 9.3-3.9 9.3-12.6-.1-7.9-4.5-12-8.1-12zm-1.7 17.7c-1.6 0-2.5-.6-3.1-1.3V8.9c.7-.7 1.6-1.2 3.1-1.2 2.4 0 4 2.7 4 6.1s-1.7 6.2-4 6.2zM23.4 3.5c0 2.1-1.5 3.6-4 3.6h-1.9v11.8h-7V0h8.9c5.9 0 10.1 2.3 10.1 8.1 0 3.6-2 6-5.5 7.3l6.1 9.5h-7.9L17.5 16v-2.4h1.9c2.5 0 4-1.5 4-3.6s-1.5-3.5-4-3.5h-1.9v7.9h7v-11z"
      fill="#635BFF"
    />
  </svg>
)

const PaystackIcon = () => (
  <svg className="w-12 h-8" viewBox="0 0 60 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M30 0C13.4 0 0 5.6 0 12.5S13.4 25 30 25s30-5.6 30-12.5S46.6 0 30 0zm0 20c-13.3 0-24-3.4-24-7.5S16.7 5 30 5s24 3.4 24 7.5-10.7 7.5-24 7.5z"
      fill="#00C3F7"
    />
    <circle cx="30" cy="12.5" r="5" fill="#00C3F7" />
  </svg>
)

// ============================================================================
// Component
// ============================================================================

export const PaymentMethodSelector = React.forwardRef<
  HTMLDivElement,
  PaymentMethodSelectorProps
>(
  (
    {
      methods,
      selectedMethod,
      onMethodSelect,
      vertical,
      loading = false,
      disabled = false,
      showIcons = true,
      showSupportedMethods = true,
      error,
      required = false,
      size,
      layout,
      className,
      ...props
    },
    ref
  ) => {
    const handleSelect = (method: PaymentMethod) => {
      if (disabled || loading || method.disabled) return
      onMethodSelect?.(method.id, method.provider)
    }

    const handleKeyDown = (e: React.KeyboardEvent, method: PaymentMethod) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleSelect(method)
      }
    }

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {/* Label */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-900">
            Payment Method
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
          <p className="mt-1 text-sm text-gray-600">
            Choose how you'd like to pay for your booking
          </p>
        </div>

        {/* Methods */}
        <div className={cn(selectorVariants({ size, layout }))}>
          {methods.map((method) => {
            const isSelected = selectedMethod === method.id
            const isDisabled = disabled || loading || method.disabled

            return (
              <div
                key={method.id}
                role="radio"
                aria-checked={isSelected}
                aria-disabled={isDisabled}
                tabIndex={isDisabled ? -1 : 0}
                onClick={() => handleSelect(method)}
                onKeyDown={(e) => handleKeyDown(e, method)}
                className={cn(
                  methodCardVariants({ selected: isSelected, disabled: isDisabled }),
                  vertical && isSelected && verticalColors[vertical].border,
                  vertical && isSelected && verticalColors[vertical].bg
                )}
              >
                {/* Radio Button */}
                <div className="flex-shrink-0 mt-1">
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                      isSelected
                        ? vertical
                          ? verticalColors[vertical].border.replace('border-', 'border-')
                          : 'border-primary'
                        : 'border-gray-300'
                    )}
                  >
                    {isSelected && (
                      <div
                        className={cn(
                          'w-3 h-3 rounded-full',
                          vertical ? verticalColors[vertical].border.replace('border-', 'bg-') : 'bg-primary'
                        )}
                      />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      {showIcons && method.icon && (
                        <div className="flex-shrink-0">{method.icon}</div>
                      )}

                      {/* Label */}
                      <div>
                        <p className="font-semibold text-gray-900">{method.label}</p>
                        {method.description && (
                          <p className="text-sm text-gray-600 mt-0.5">{method.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Badge */}
                    {method.badge && (
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                          vertical
                            ? `${verticalColors[vertical].bg} ${verticalColors[vertical].text}`
                            : 'bg-blue-100 text-blue-700'
                        )}
                      >
                        {method.badge}
                      </span>
                    )}
                  </div>

                  {/* Supported Methods */}
                  {showSupportedMethods && method.supportedMethods && method.supportedMethods.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {method.supportedMethods.map((supportedMethod) => (
                        <span
                          key={supportedMethod}
                          className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-xs text-gray-700"
                        >
                          {supportedMethod}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
            <span>Loading payment methods...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <svg
              className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Help Text */}
        {!error && (
          <p className="mt-3 text-xs text-gray-500">
            All transactions are secure and encrypted. Your payment information is never stored on our servers.
          </p>
        )}
      </div>
    )
  }
)

PaymentMethodSelector.displayName = 'PaymentMethodSelector'

// ============================================================================
// Exports
// ============================================================================

export { StripeIcon, PaystackIcon }
