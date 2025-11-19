import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  PaymentMethodSelector,
  StripeIcon,
  PaystackIcon,
  type PaymentMethod,
} from './payment-method-selector'
import type { VerticalTheme } from '@/lib/types/vertical-themes'

const meta = {
  title: 'Components/Payment/PaymentMethodSelector',
  component: PaymentMethodSelector,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Payment method selector component supporting Stripe and Paystack with multiple payment options. Features vertical theming, loading states, and accessibility support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
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
    layout: {
      control: 'select',
      options: ['vertical', 'grid'],
      description: 'Layout style',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    showIcons: {
      control: 'boolean',
      description: 'Show payment provider icons',
    },
    showSupportedMethods: {
      control: 'boolean',
      description: 'Show supported payment methods',
    },
    required: {
      control: 'boolean',
      description: 'Required field indicator',
    },
  },
} satisfies Meta<typeof PaymentMethodSelector>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Mock Data
// ============================================================================

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'stripe',
    provider: 'stripe',
    label: 'Stripe',
    description: 'Credit card, Apple Pay, Google Pay',
    icon: <StripeIcon />,
    supportedMethods: ['Credit Card', 'Debit Card', 'Apple Pay', 'Google Pay'],
    badge: 'Popular',
  },
  {
    id: 'paystack',
    provider: 'paystack',
    label: 'Paystack',
    description: 'Cards, Bank Transfer, USSD, Mobile Money',
    icon: <PaystackIcon />,
    supportedMethods: ['Card', 'Bank Transfer', 'USSD', 'Mobile Money'],
    badge: 'Best for Africa',
  },
]

const mockStripeOnly: PaymentMethod[] = [
  {
    id: 'stripe',
    provider: 'stripe',
    label: 'Stripe',
    description: 'Credit card, Apple Pay, Google Pay',
    icon: <StripeIcon />,
    supportedMethods: ['Credit Card', 'Debit Card', 'Apple Pay', 'Google Pay'],
  },
]

const mockWithDisabled: PaymentMethod[] = [
  ...mockPaymentMethods,
  {
    id: 'cash',
    provider: 'stripe', // fallback
    label: 'Cash Payment',
    description: 'Pay with cash on arrival',
    supportedMethods: ['Cash'],
    disabled: true,
  },
]

// ============================================================================
// Interactive Wrapper
// ============================================================================

const InteractiveWrapper = ({
  methods,
  ...props
}: React.ComponentProps<typeof PaymentMethodSelector>) => {
  const [selectedMethod, setSelectedMethod] = useState<string>()

  return (
    <PaymentMethodSelector
      {...props}
      methods={methods}
      selectedMethod={selectedMethod}
      onMethodSelect={(methodId) => setSelectedMethod(methodId)}
    />
  )
}

// ============================================================================
// Stories
// ============================================================================

export const Default: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    methods: mockPaymentMethods,
    showIcons: true,
    showSupportedMethods: true,
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
            <InteractiveWrapper methods={mockPaymentMethods} vertical={vertical} />
          </div>
        ))}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Payment method selector with all vertical theme variations.',
      },
    },
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Small</h3>
        <InteractiveWrapper methods={mockPaymentMethods} size="sm" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Medium (Default)</h3>
        <InteractiveWrapper methods={mockPaymentMethods} size="md" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Large</h3>
        <InteractiveWrapper methods={mockPaymentMethods} size="lg" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different size variants for the payment method selector.',
      },
    },
  },
}

export const Layouts: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Vertical Layout (Default)</h3>
        <InteractiveWrapper methods={mockPaymentMethods} layout="vertical" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Grid Layout</h3>
        <InteractiveWrapper methods={mockPaymentMethods} layout="grid" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different layout options: vertical stacking or responsive grid.',
      },
    },
  },
}

export const SingleMethod: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    methods: mockStripeOnly,
  },
  parameters: {
    docs: {
      description: {
        story: 'Selector with only one payment method available.',
      },
    },
  },
}

export const WithDisabledOptions: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    methods: mockWithDisabled,
  },
  parameters: {
    docs: {
      description: {
        story: 'Payment selector with some methods disabled (e.g., cash payment temporarily unavailable).',
      },
    },
  },
}

export const LoadingState: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    methods: mockPaymentMethods,
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state while payment methods are being fetched.',
      },
    },
  },
}

export const DisabledState: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    methods: mockPaymentMethods,
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Entire selector disabled (e.g., during payment processing).',
      },
    },
  },
}

export const WithError: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    methods: mockPaymentMethods,
    error: 'Unable to load payment methods. Please try again.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Error state when payment methods cannot be loaded.',
      },
    },
  },
}

export const Required: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    methods: mockPaymentMethods,
    required: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Required field indicator shown in the label.',
      },
    },
  },
}

export const WithoutIcons: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    methods: mockPaymentMethods,
    showIcons: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Payment selector without provider icons.',
      },
    },
  },
}

export const WithoutSupportedMethods: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    methods: mockPaymentMethods,
    showSupportedMethods: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Payment selector without showing supported payment methods.',
      },
    },
  },
}

export const MinimalVersion: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    methods: mockPaymentMethods,
    showIcons: false,
    showSupportedMethods: false,
    size: 'sm',
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal version with no icons or supported methods shown.',
      },
    },
  },
}

export const RealWorldExample: Story = {
  render: () => {
    const [selectedMethod, setSelectedMethod] = useState<string>()
    const [loading, setLoading] = useState(false)

    const handleMethodSelect = (methodId: string) => {
      setSelectedMethod(methodId)
      setLoading(true)
      // Simulate API call
      setTimeout(() => setLoading(false), 1500)
    }

    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Complete Your Booking</h2>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Booking Summary</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Lagos Island Experience</span>
              <span className="font-medium">₦45,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service Fee</span>
              <span className="font-medium">₦2,250</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg">₦47,250</span>
            </div>
          </div>
        </div>

        <PaymentMethodSelector
          methods={mockPaymentMethods}
          selectedMethod={selectedMethod}
          onMethodSelect={handleMethodSelect}
          vertical="experiences"
          loading={loading}
          required
        />

        <button
          disabled={!selectedMethod || loading}
          className="mt-6 w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Processing...' : 'Continue to Payment'}
        </button>
      </div>
    )
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          'Real-world example showing the payment method selector in a booking flow with summary and CTA.',
      },
    },
  },
}

export const KeyboardNavigation: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    methods: mockPaymentMethods,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Fully keyboard accessible. Use Tab to navigate between options, Enter or Space to select.',
      },
    },
  },
}
