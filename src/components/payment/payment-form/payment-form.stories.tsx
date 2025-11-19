import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { PaymentForm, type PaymentFormData } from './payment-form'
import type { VerticalTheme } from '@/lib/types/vertical-themes'

const meta = {
  title: 'Components/Payment/PaymentForm',
  component: PaymentForm,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Payment form component supporting Stripe and Paystack payment flows. Features card input, validation, loading states, and billing address collection.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    provider: {
      control: 'select',
      options: ['stripe', 'paystack'],
      description: 'Payment provider',
    },
    vertical: {
      control: 'select',
      options: ['stays', 'events', 'experiences', 'cars', 'marketplace', 'community'],
      description: 'Vertical theme for colored styling',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant',
    },
    loading: {
      control: 'boolean',
      description: 'Loading/Processing state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    showSaveCard: {
      control: 'boolean',
      description: 'Show save card checkbox',
    },
    showBillingAddress: {
      control: 'boolean',
      description: 'Show billing address fields',
    },
    amount: {
      control: 'number',
      description: 'Amount to charge',
    },
    currency: {
      control: 'text',
      description: 'Currency code',
    },
  },
} satisfies Meta<typeof PaymentForm>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Interactive Wrapper
// ============================================================================

const InteractiveWrapper = ({
  onSubmit,
  ...props
}: React.ComponentProps<typeof PaymentForm>) => {
  const [formData, setFormData] = useState<PaymentFormData>({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: PaymentFormData) => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setLoading(false)
    console.log('Payment submitted:', data)
    onSubmit?.(data)
  }

  return (
    <PaymentForm
      {...props}
      data={formData}
      onDataChange={setFormData}
      onSubmit={handleSubmit}
      loading={loading}
    />
  )
}

// ============================================================================
// Stories
// ============================================================================

export const StripeDefault: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    provider: 'stripe',
    amount: 47250,
    currency: 'NGN',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default Stripe payment form with card input fields.',
      },
    },
  },
}

export const PaystackDefault: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    provider: 'paystack',
    amount: 47250,
    currency: 'NGN',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default Paystack payment form with email input.',
      },
    },
  },
}

export const VerticalThemes: Story = {
  render: () => {
    const verticals: VerticalTheme[] = [
      'stays',
      'events',
      'experiences',
      'cars',
      'marketplace',
      'community',
    ]

    return (
      <div className="space-y-8">
        {verticals.map((vertical) => (
          <div key={vertical} className="space-y-2">
            <h3 className="text-lg font-semibold capitalize">{vertical}</h3>
            <InteractiveWrapper provider="stripe" vertical={vertical} amount={50000} />
          </div>
        ))}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Payment forms with all vertical theme variations.',
      },
    },
  },
}

export const WithSaveCard: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    provider: 'stripe',
    amount: 47250,
    showSaveCard: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Stripe form with option to save card for future use.',
      },
    },
  },
}

export const WithBillingAddress: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    provider: 'stripe',
    amount: 47250,
    showBillingAddress: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Payment form with billing address fields.',
      },
    },
  },
}

export const WithAllOptions: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    provider: 'stripe',
    amount: 47250,
    showSaveCard: true,
    showBillingAddress: true,
    vertical: 'experiences',
  },
  parameters: {
    docs: {
      description: {
        story: 'Full payment form with all optional fields enabled.',
      },
    },
  },
}

export const LoadingState: Story = {
  render: (args) => <PaymentForm {...args} />,
  args: {
    provider: 'stripe',
    amount: 47250,
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Payment form in loading/processing state.',
      },
    },
  },
}

export const DisabledState: Story = {
  render: (args) => <PaymentForm {...args} />,
  args: {
    provider: 'stripe',
    amount: 47250,
    disabled: true,
    data: {
      cardholderName: 'John Doe',
      cardNumber: '4242 4242 4242 4242',
      cardExpiry: '12/25',
      cardCvc: '123',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled payment form (e.g., during review before final submission).',
      },
    },
  },
}

export const WithValidationErrors: Story = {
  render: (args) => <PaymentForm {...args} />,
  args: {
    provider: 'stripe',
    amount: 47250,
    errors: {
      cardholderName: 'Name is required',
      cardNumber: 'Invalid card number',
      cardExpiry: 'Card has expired',
      cardCvc: 'Invalid CVC',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Payment form showing validation errors.',
      },
    },
  },
}

export const PaystackWithEmail: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    provider: 'paystack',
    amount: 47250,
    data: {
      email: 'user@example.com',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Paystack form pre-filled with user email.',
      },
    },
  },
}

export const CustomSubmitButton: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    provider: 'stripe',
    amount: 47250,
    submitButtonText: 'Complete Booking',
    vertical: 'experiences',
  },
  parameters: {
    docs: {
      description: {
        story: 'Payment form with custom submit button text.',
      },
    },
  },
}

export const SmallSize: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    provider: 'stripe',
    amount: 47250,
    size: 'sm',
  },
  parameters: {
    docs: {
      description: {
        story: 'Small size variant for compact layouts.',
      },
    },
  },
}

export const LargeSize: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    provider: 'stripe',
    amount: 47250,
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Large size variant for prominent payment sections.',
      },
    },
  },
}

export const WithoutAmount: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    provider: 'stripe',
  },
  parameters: {
    docs: {
      description: {
        story: 'Payment form without amount display (amount determined later).',
      },
    },
  },
}

export const RealWorldCheckout: Story = {
  render: () => {
    const [formData, setFormData] = useState<PaymentFormData>({})
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (data: PaymentFormData) => {
      setLoading(true)
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2500))
      setLoading(false)
      setSuccess(true)
    }

    if (success) {
      return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600">Your booking has been confirmed.</p>
        </div>
      )
    }

    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Complete Your Payment</h2>

        {/* Booking Summary */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3">
          <h3 className="font-semibold">Booking Summary</h3>
          <div className="flex items-start gap-3">
            <div className="w-20 h-20 bg-gray-300 rounded-lg flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium">Lagos Island Experience</h4>
              <p className="text-sm text-gray-600">Dec 24, 2025 - Dec 25, 2025</p>
              <p className="text-sm text-gray-600">2 Guests</p>
            </div>
          </div>
          <div className="space-y-1 pt-3 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Base Price</span>
              <span>₦45,000</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Service Fee</span>
              <span>₦2,250</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t border-gray-200">
              <span>Total</span>
              <span className="text-lg">₦47,250</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <PaymentForm
          provider="stripe"
          data={formData}
          onDataChange={setFormData}
          onSubmit={handleSubmit}
          loading={loading}
          amount={47250}
          vertical="experiences"
          showSaveCard
        />
      </div>
    )
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          'Complete checkout flow with booking summary, payment form, and success state.',
      },
    },
  },
}

export const ComparisonStripevPaystack: Story = {
  render: () => (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Stripe</h3>
        <InteractiveWrapper provider="stripe" amount={47250} vertical="stays" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Paystack</h3>
        <InteractiveWrapper provider="paystack" amount={47250} vertical="stays" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of Stripe and Paystack payment forms.',
      },
    },
  },
}
