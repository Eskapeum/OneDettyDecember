import * as React from 'react'
import { cn } from '@/lib/utils'
import type { VerticalTheme } from '@/types/vertical'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export interface BookingFormData {
  checkIn?: string
  checkOut?: string
  guests?: number
  specialRequests?: string
}

export interface PriceBreakdown {
  basePrice: number
  nights?: number
  serviceFee?: number
  taxes?: number
  discount?: number
  total: number
}

export interface BookingFormProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Package price per night/booking
   */
  price: number
  /**
   * Currency code
   */
  currency?: string
  /**
   * Marketplace vertical theme
   */
  vertical?: VerticalTheme
  /**
   * Initial form values
   */
  initialValues?: BookingFormData
  /**
   * Price breakdown
   */
  priceBreakdown?: PriceBreakdown
  /**
   * Minimum guests
   */
  minGuests?: number
  /**
   * Maximum guests
   */
  maxGuests?: number
  /**
   * Availability calendar (custom component slot)
   */
  datePickerComponent?: React.ReactNode
  /**
   * Guest selector (custom component slot)
   */
  guestSelectorComponent?: React.ReactNode
  /**
   * Show special requests field
   */
  showSpecialRequests?: boolean
  /**
   * Show price breakdown
   */
  showPriceBreakdown?: boolean
  /**
   * Loading state
   */
  loading?: boolean
  /**
   * Disabled state
   */
  disabled?: boolean
  /**
   * Form submit handler
   */
  onSubmit?: (data: BookingFormData) => void
  /**
   * Date change handler
   */
  onDateChange?: (checkIn: string, checkOut: string) => void
  /**
   * Guest count change handler
   */
  onGuestChange?: (guests: number) => void
  /**
   * Validation errors
   */
  errors?: Record<string, string>
}

const BookingForm = React.forwardRef<HTMLDivElement, BookingFormProps>(
  (
    {
      className,
      price,
      currency = 'NGN',
      vertical,
      initialValues,
      priceBreakdown,
      minGuests = 1,
      maxGuests = 10,
      datePickerComponent,
      guestSelectorComponent,
      showSpecialRequests = true,
      showPriceBreakdown = true,
      loading = false,
      disabled = false,
      onSubmit,
      onDateChange,
      onGuestChange,
      errors = {},
      ...props
    },
    ref
  ) => {
    const [formData, setFormData] = React.useState<BookingFormData>(
      initialValues || {
        guests: 1,
        specialRequests: '',
      }
    )

    const formatPrice = (amount: number) => {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
      }).format(amount)
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSubmit?.(formData)
    }

    const handleGuestChange = (increment: boolean) => {
      setFormData((prev) => {
        const newGuests = increment
          ? Math.min((prev.guests || 1) + 1, maxGuests)
          : Math.max((prev.guests || 1) - 1, minGuests)

        onGuestChange?.(newGuests)
        return { ...prev, guests: newGuests }
      })
    }

    // Calculate price breakdown
    const breakdown = priceBreakdown || {
      basePrice: price,
      nights: formData.checkIn && formData.checkOut ? 1 : 0,
      serviceFee: price * 0.1,
      taxes: price * 0.075,
      total: price + price * 0.1 + price * 0.075,
    }

    return (
      <Card
        ref={ref}
        className={cn('p-6', className)}
        {...props}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Price Header */}
          <div className="pb-6 border-b">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{formatPrice(price)}</span>
              <span className="text-muted-foreground">per booking</span>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Select dates
            </label>
            {datePickerComponent || (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    type="date"
                    placeholder="Check-in"
                    value={formData.checkIn || ''}
                    onChange={(e) => {
                      const newCheckIn = e.target.value
                      setFormData((prev) => ({ ...prev, checkIn: newCheckIn }))
                      if (formData.checkOut) {
                        onDateChange?.(newCheckIn, formData.checkOut)
                      }
                    }}
                    error={errors.checkIn}
                    disabled={disabled}
                  />
                </div>
                <div>
                  <Input
                    type="date"
                    placeholder="Check-out"
                    value={formData.checkOut || ''}
                    onChange={(e) => {
                      const newCheckOut = e.target.value
                      setFormData((prev) => ({ ...prev, checkOut: newCheckOut }))
                      if (formData.checkIn) {
                        onDateChange?.(formData.checkIn, newCheckOut)
                      }
                    }}
                    error={errors.checkOut}
                    disabled={disabled}
                  />
                </div>
              </div>
            )}
            {errors.dates && (
              <p className="text-sm text-destructive mt-1">{errors.dates}</p>
            )}
          </div>

          {/* Guest Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Guests
            </label>
            {guestSelectorComponent || (
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Number of guests</div>
                  <div className="text-sm text-muted-foreground">
                    Maximum {maxGuests} guests
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleGuestChange(false)}
                    disabled={disabled || (formData.guests || 1) <= minGuests}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </Button>
                  <span className="w-12 text-center font-medium">
                    {formData.guests || 1}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleGuestChange(true)}
                    disabled={disabled || (formData.guests || 1) >= maxGuests}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </Button>
                </div>
              </div>
            )}
            {errors.guests && (
              <p className="text-sm text-destructive mt-1">{errors.guests}</p>
            )}
          </div>

          {/* Special Requests */}
          {showSpecialRequests && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Special requests (optional)
              </label>
              <textarea
                className={cn(
                  'w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring',
                  'resize-none transition-shadow',
                  errors.specialRequests && 'border-destructive'
                )}
                placeholder="Any special requirements or requests..."
                value={formData.specialRequests || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, specialRequests: e.target.value }))
                }
                disabled={disabled}
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.specialRequests && (
                  <p className="text-sm text-destructive">{errors.specialRequests}</p>
                )}
                <p className="text-xs text-muted-foreground ml-auto">
                  {(formData.specialRequests || '').length}/500
                </p>
              </div>
            </div>
          )}

          {/* Price Breakdown */}
          {showPriceBreakdown && breakdown.nights && breakdown.nights > 0 && (
            <div className="space-y-3 pt-6 border-t">
              <h3 className="font-semibold">Price breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {formatPrice(breakdown.basePrice)} × {breakdown.nights}{' '}
                    {breakdown.nights === 1 ? 'night' : 'nights'}
                  </span>
                  <span>{formatPrice(breakdown.basePrice * breakdown.nights)}</span>
                </div>
                {breakdown.serviceFee && breakdown.serviceFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service fee</span>
                    <span>{formatPrice(breakdown.serviceFee)}</span>
                  </div>
                )}
                {breakdown.taxes && breakdown.taxes > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes</span>
                    <span>{formatPrice(breakdown.taxes)}</span>
                  </div>
                )}
                {breakdown.discount && breakdown.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(breakdown.discount)}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between font-bold text-lg pt-3 border-t">
                <span>Total</span>
                <span>{formatPrice(breakdown.total)}</span>
              </div>
            </div>
          )}

          {/* Terms & Conditions */}
          <div className="pt-6 border-t">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                className="mt-1 rounded border-input"
                disabled={disabled}
              />
              <span className="text-sm text-muted-foreground">
                I agree to the{' '}
                <a href="/terms" className="text-foreground underline hover:no-underline">
                  terms and conditions
                </a>{' '}
                and{' '}
                <a href="/cancellation" className="text-foreground underline hover:no-underline">
                  cancellation policy
                </a>
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            vertical={vertical}
            disabled={disabled || loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </>
            ) : (
              'Request to Book'
            )}
          </Button>

          {/* Helper Text */}
          <p className="text-xs text-center text-muted-foreground">
            You won't be charged yet
          </p>
        </form>
      </Card>
    )
  }
)
BookingForm.displayName = 'BookingForm'

export { BookingForm }
