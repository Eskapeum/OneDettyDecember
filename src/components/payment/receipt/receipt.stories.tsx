import type { Meta, StoryObj } from '@storybook/react'
import { Receipt, type ReceiptData } from './receipt'
import type { VerticalTheme } from '@/types/vertical'

const meta = {
  title: 'Components/Payment/Receipt',
  component: Receipt,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Comprehensive receipt component for displaying payment and booking details. Features print and download functionality, multiple status states, and vertical theming.',
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
    showPrintButton: {
      control: 'boolean',
      description: 'Show print button',
    },
    showDownloadButton: {
      control: 'boolean',
      description: 'Show download button',
    },
    hideCustomerDetails: {
      control: 'boolean',
      description: 'Hide customer details for privacy',
    },
    compact: {
      control: 'boolean',
      description: 'Compact mode with reduced spacing',
    },
  },
} satisfies Meta<typeof Receipt>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Mock Data
// ============================================================================

const mockReceiptPaid: ReceiptData = {
  receiptNumber: 'REC-2025-00123',
  paymentId: 'pi_3QK5GcFa2eGAhQ0x0GJBwXQz',
  bookingId: 'BKG-DEC2025-4567',
  issueDate: new Date('2025-12-15T14:30:00').toISOString(),
  provider: 'stripe',
  paymentMethod: 'Visa •••• 4242',
  transactionId: 'txn_1QK5GcFa2eGAhQ0x1234567',
  status: 'paid',
  currency: 'NGN',
  lineItems: [
    {
      id: '1',
      description: 'Lagos Island Experience - 2 Nights',
      quantity: 2,
      unitPrice: 22500,
      amount: 45000,
      type: 'base',
    },
    {
      id: '2',
      description: 'Service Fee',
      amount: 2250,
      type: 'fee',
    },
  ],
  subtotal: 45000,
  total: 47250,
  customer: {
    name: 'Chukwuemeka Okonkwo',
    email: 'chukwuemeka@example.com',
    phone: '+234 803 456 7890',
    address: {
      street: '15 Admiralty Way',
      city: 'Lekki',
      state: 'Lagos',
      country: 'Nigeria',
    },
  },
  merchant: {
    name: 'One Detty December',
    address: '123 Victoria Island, Lagos, Nigeria',
    email: 'support@onedettydecember.com',
    phone: '+234 800 123 4567',
    website: 'www.onedettydecember.com',
    taxId: 'TIN-123456789',
  },
  bookingDetails: {
    title: 'Lagos Island Experience',
    dates: 'December 24-25, 2025',
    guests: 2,
    location: 'Victoria Island, Lagos',
    vertical: 'experiences',
  },
  notes: [
    'Check-in time: 2:00 PM',
    'Check-out time: 11:00 AM',
    'Please bring a valid ID for verification',
    'Cancellation policy: Free cancellation up to 48 hours before check-in',
  ],
  termsUrl: 'https://onedettydecember.com/terms',
}

const mockReceiptRefunded: ReceiptData = {
  ...mockReceiptPaid,
  receiptNumber: 'REC-2025-00124',
  status: 'refunded',
  refundedAmount: 47250,
  lineItems: [
    ...mockReceiptPaid.lineItems,
    {
      id: '3',
      description: 'Full Refund',
      amount: -47250,
      type: 'refund',
    },
  ],
}

const mockReceiptPartialRefund: ReceiptData = {
  ...mockReceiptPaid,
  receiptNumber: 'REC-2025-00125',
  status: 'partially-refunded',
  refundedAmount: 23625,
  total: 23625,
  lineItems: [
    ...mockReceiptPaid.lineItems,
    {
      id: '3',
      description: 'Partial Refund (50%)',
      amount: -23625,
      type: 'refund',
    },
  ],
}

const mockReceiptWithDiscount: ReceiptData = {
  ...mockReceiptPaid,
  receiptNumber: 'REC-2025-00126',
  lineItems: [
    {
      id: '1',
      description: 'Lagos Island Experience - 2 Nights',
      quantity: 2,
      unitPrice: 22500,
      amount: 45000,
      type: 'base',
    },
    {
      id: '2',
      description: 'Early Bird Discount',
      amount: 4500,
      type: 'discount',
    },
    {
      id: '3',
      description: 'Service Fee',
      amount: 2025,
      type: 'fee',
    },
  ],
  subtotal: 42525,
  total: 42525,
}

const mockReceiptPaystack: ReceiptData = {
  ...mockReceiptPaid,
  receiptNumber: 'REC-2025-00127',
  provider: 'paystack',
  paymentMethod: 'Bank Transfer - GTBank',
  paymentId: 'ps_abc123def456',
  transactionId: 'TRF-456789-123',
}

const mockReceiptMinimal: ReceiptData = {
  receiptNumber: 'REC-2025-00128',
  paymentId: 'pi_simple123',
  issueDate: new Date().toISOString(),
  provider: 'stripe',
  paymentMethod: 'Card',
  status: 'paid',
  currency: 'NGN',
  lineItems: [
    {
      id: '1',
      description: 'Service Payment',
      amount: 50000,
    },
  ],
  subtotal: 50000,
  total: 50000,
  customer: {
    name: 'John Doe',
    email: 'john@example.com',
  },
  merchant: {
    name: 'One Detty December',
    email: 'support@onedettydecember.com',
  },
}

// ============================================================================
// Stories
// ============================================================================

export const Default: Story = {
  args: {
    data: mockReceiptPaid,
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
      <div className="space-y-12">
        {verticals.map((vertical) => {
          const data = {
            ...mockReceiptPaid,
            bookingDetails: {
              ...mockReceiptPaid.bookingDetails!,
              vertical,
            },
          }
          return (
            <div key={vertical} className="space-y-4">
              <h3 className="text-lg font-semibold capitalize">{vertical}</h3>
              <Receipt data={data} vertical={vertical} showPrintButton={false} />
            </div>
          )
        })}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Receipt with all vertical theme variations.',
      },
    },
  },
}

export const RefundedStatus: Story = {
  args: {
    data: mockReceiptRefunded,
  },
  parameters: {
    docs: {
      description: {
        story: 'Receipt showing a fully refunded payment.',
      },
    },
  },
}

export const PartiallyRefundedStatus: Story = {
  args: {
    data: mockReceiptPartialRefund,
  },
  parameters: {
    docs: {
      description: {
        story: 'Receipt showing a partially refunded payment.',
      },
    },
  },
}

export const WithDiscount: Story = {
  args: {
    data: mockReceiptWithDiscount,
  },
  parameters: {
    docs: {
      description: {
        story: 'Receipt with discount applied to the booking.',
      },
    },
  },
}

export const PaystackProvider: Story = {
  args: {
    data: mockReceiptPaystack,
  },
  parameters: {
    docs: {
      description: {
        story: 'Receipt for a payment processed via Paystack.',
      },
    },
  },
}

export const MinimalReceipt: Story = {
  args: {
    data: mockReceiptMinimal,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal receipt with only required fields.',
      },
    },
  },
}

export const HideCustomerDetails: Story = {
  args: {
    data: mockReceiptPaid,
    hideCustomerDetails: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Receipt with customer details hidden for privacy.',
      },
    },
  },
}

export const CompactMode: Story = {
  args: {
    data: mockReceiptPaid,
    compact: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact version with reduced spacing.',
      },
    },
  },
}

export const SmallSize: Story = {
  args: {
    data: mockReceiptPaid,
    size: 'sm',
  },
  parameters: {
    docs: {
      description: {
        story: 'Small size variant for compact displays.',
      },
    },
  },
}

export const LargeSize: Story = {
  args: {
    data: mockReceiptPaid,
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Large size variant for prominent displays.',
      },
    },
  },
}

export const WithoutActionButtons: Story = {
  args: {
    data: mockReceiptPaid,
    showPrintButton: false,
    showDownloadButton: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Receipt without print and download buttons.',
      },
    },
  },
}

export const ComplexLineItems: Story = {
  args: {
    data: {
      ...mockReceiptPaid,
      lineItems: [
        {
          id: '1',
          description: 'Lagos Island Experience - Standard Package',
          quantity: 1,
          unitPrice: 30000,
          amount: 30000,
          type: 'base',
        },
        {
          id: '2',
          description: 'Premium Add-on - Sunset Cruise',
          quantity: 2,
          unitPrice: 7500,
          amount: 15000,
          type: 'base',
        },
        {
          id: '3',
          description: 'Group Discount (10%)',
          amount: 4500,
          type: 'discount',
        },
        {
          id: '4',
          description: 'Service Fee',
          amount: 2025,
          type: 'fee',
        },
        {
          id: '5',
          description: 'Tourism Tax (5%)',
          amount: 2026,
          type: 'tax',
        },
      ],
      subtotal: 44551,
      total: 44551,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Receipt with multiple line items including packages, add-ons, discounts, fees, and taxes.',
      },
    },
  },
}

export const RealWorldExample: Story = {
  render: () => {
    const handlePrint = () => {
      console.log('Print clicked')
      window.print()
    }

    const handleDownload = () => {
      console.log('Download clicked')
      // In real app: generate PDF
    }

    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-50">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Receipt</h2>
          <p className="text-gray-600">
            Your payment was successful. You can print or download this receipt for your records.
          </p>
        </div>

        <Receipt
          data={mockReceiptPaid}
          vertical="experiences"
          onPrint={handlePrint}
          onDownload={handleDownload}
        />

        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            <strong>Need help?</strong> Contact us at{' '}
            <a href="mailto:support@onedettydecember.com" className="text-green-600 hover:underline">
              support@onedettydecember.com
            </a>{' '}
            or call{' '}
            <a href="tel:+2348001234567" className="text-green-600 hover:underline">
              +234 800 123 4567
            </a>
          </p>
        </div>
      </div>
    )
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Real-world example showing receipt in a complete page layout with support info.',
      },
    },
  },
}

export const PrintPreview: Story = {
  args: {
    data: mockReceiptPaid,
    showPrintButton: false,
    showDownloadButton: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Print preview - this is how the receipt will appear when printed (action buttons hidden).',
      },
    },
  },
}

export const MultipleReceipts: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Paid Receipt</h3>
        <Receipt data={mockReceiptPaid} showPrintButton={false} vertical="stays" />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Refunded Receipt</h3>
        <Receipt data={mockReceiptRefunded} showPrintButton={false} vertical="events" />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">With Discount</h3>
        <Receipt data={mockReceiptWithDiscount} showPrintButton={false} vertical="experiences" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of different receipt states and variations.',
      },
    },
  },
}
