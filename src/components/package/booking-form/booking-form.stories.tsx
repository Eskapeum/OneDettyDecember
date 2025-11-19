import type { Meta, StoryObj } from '@storybook/react'
import { BookingForm } from './booking-form'
import { useState } from 'react'

const meta: Meta<typeof BookingForm> = {
  title: 'Package/BookingForm',
  component: BookingForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof BookingForm>

// Default
export const Default: Story = {
  args: {
    price: 500000,
  },
}

// With Price Breakdown
export const WithPriceBreakdown: Story = {
  args: {
    price: 500000,
    initialValues: {
      checkIn: '2025-12-20',
      checkOut: '2025-12-23',
      guests: 2,
    },
    priceBreakdown: {
      basePrice: 500000,
      nights: 3,
      serviceFee: 50000,
      taxes: 37500,
      total: 1587500,
    },
  },
}

// Loading State
export const Loading: Story = {
  args: {
    price: 150000,
    loading: true,
  },
}

// Disabled State
export const Disabled: Story = {
  args: {
    price: 150000,
    disabled: true,
  },
}

// With Errors
export const WithErrors: Story = {
  args: {
    price: 500000,
    errors: {
      checkIn: 'Check-in date is required',
      checkOut: 'Check-out must be after check-in',
      guests: 'Maximum 10 guests allowed',
    },
  },
}

// Without Special Requests
export const NoSpecialRequests: Story = {
  args: {
    price: 500000,
    showSpecialRequests: false,
  },
}

// Without Price Breakdown
export const NoPriceBreakdown: Story = {
  args: {
    price: 500000,
    showPriceBreakdown: false,
  },
}

// Different Guest Limits
export const SmallGroup: Story = {
  args: {
    price: 75000,
    minGuests: 1,
    maxGuests: 4,
  },
}

export const LargeGroup: Story = {
  args: {
    price: 500000,
    minGuests: 1,
    maxGuests: 20,
  },
}

// Vertical Themes
export const StaysVertical: Story = {
  args: {
    price: 500000,
    vertical: 'stays',
  },
}

export const EventsVertical: Story = {
  args: {
    price: 150000,
    vertical: 'events',
  },
}

export const ExperiencesVertical: Story = {
  args: {
    price: 75000,
    vertical: 'experiences',
  },
}

export const CarsVertical: Story = {
  args: {
    price: 120000,
    vertical: 'cars',
  },
}

// Interactive Example
export const Interactive: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      checkIn: '',
      checkOut: '',
      guests: 2,
      specialRequests: '',
    })
    const [loading, setLoading] = useState(false)

    const handleSubmit = (data: any) => {
      setLoading(true)
      console.log('Form submitted:', data)
      setTimeout(() => {
        setLoading(false)
        alert('Booking request sent!')
      }, 2000)
    }

    // Calculate nights
    const nights =
      formData.checkIn && formData.checkOut
        ? Math.max(
            1,
            Math.ceil(
              (new Date(formData.checkOut).getTime() -
                new Date(formData.checkIn).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          )
        : 0

    const basePrice = 500000
    const priceBreakdown = nights > 0
      ? {
          basePrice,
          nights,
          serviceFee: basePrice * nights * 0.1,
          taxes: basePrice * nights * 0.075,
          total: basePrice * nights * 1.175,
        }
      : undefined

    return (
      <BookingForm
        price={basePrice}
        vertical="stays"
        initialValues={formData}
        priceBreakdown={priceBreakdown}
        loading={loading}
        onSubmit={handleSubmit}
        onDateChange={(checkIn, checkOut) => {
          setFormData((prev) => ({ ...prev, checkIn, checkOut }))
        }}
        onGuestChange={(guests) => {
          setFormData((prev) => ({ ...prev, guests }))
        }}
      />
    )
  },
}

// Real-world Example with Custom Components
export const WithCustomComponents: Story = {
  args: {
    price: 500000,
    vertical: 'stays',
    datePickerComponent: (
      <div className="p-4 border rounded-lg bg-muted">
        <p className="text-sm text-center">
          Custom Date Picker Component (from Tobi)
        </p>
      </div>
    ),
    guestSelectorComponent: (
      <div className="p-4 border rounded-lg bg-muted">
        <p className="text-sm text-center">
          Custom Guest Selector Component (from Tobi)
        </p>
      </div>
    ),
  },
}

// With Discount
export const WithDiscount: Story = {
  args: {
    price: 500000,
    initialValues: {
      checkIn: '2025-12-20',
      checkOut: '2025-12-23',
      guests: 4,
    },
    priceBreakdown: {
      basePrice: 500000,
      nights: 3,
      serviceFee: 150000,
      taxes: 112500,
      discount: 100000,
      total: 1662500,
    },
  },
}
