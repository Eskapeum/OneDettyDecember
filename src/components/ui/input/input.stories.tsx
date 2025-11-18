import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './input'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: 'Input type',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Input size',
    },
    state: {
      control: 'select',
      options: ['default', 'error', 'success'],
      description: 'Input validation state',
    },
    vertical: {
      control: 'select',
      options: ['stays', 'events', 'experiences', 'cars', 'marketplace', 'community'],
      description: 'Marketplace vertical theme (focus ring color)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable input',
    },
    required: {
      control: 'boolean',
      description: 'Mark as required',
    },
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'you@example.com',
    type: 'email',
  },
}

export const Required: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'John Doe',
    required: true,
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Username',
    placeholder: 'johndoe',
    helperText: 'Choose a unique username',
  },
}

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    type: 'email',
    error: 'Please enter a valid email address',
    defaultValue: 'invalid-email',
  },
}

export const WithSuccess: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    type: 'email',
    success: 'Email is available',
    defaultValue: 'user@example.com',
  },
}

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'Cannot type here',
    disabled: true,
  },
}

export const Small: Story = {
  args: {
    placeholder: 'Small input',
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    placeholder: 'Large input',
    size: 'lg',
  },
}

// Vertical Themes
export const StaysVertical: Story = {
  args: {
    label: 'Check-in Date',
    type: 'date',
    vertical: 'stays',
  },
}

export const EventsVertical: Story = {
  args: {
    label: 'Number of Tickets',
    type: 'number',
    vertical: 'events',
    placeholder: '1',
  },
}

export const ExperiencesVertical: Story = {
  args: {
    label: 'Number of Guests',
    type: 'number',
    vertical: 'experiences',
    placeholder: '2',
  },
}

// Form Examples
export const LoginForm: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        vertical="events"
        required
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        vertical="events"
        required
      />
    </div>
  ),
}

export const RegistrationForm: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Input
        label="Full Name"
        placeholder="John Doe"
        required
      />
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        required
      />
      <Input
        label="Phone Number"
        type="tel"
        placeholder="+234 800 000 0000"
        helperText="We'll send booking confirmations here"
      />
      <Input
        label="Password"
        type="password"
        placeholder="Create a strong password"
        helperText="At least 8 characters"
        required
      />
    </div>
  ),
}

export const BookingForm: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Input
        label="Event Name"
        placeholder="Detty December Concert"
        vertical="events"
        disabled
        defaultValue="Detty December Concert"
      />
      <Input
        label="Number of Tickets"
        type="number"
        placeholder="1"
        vertical="events"
        required
      />
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        vertical="events"
        required
      />
      <Input
        label="Phone Number"
        type="tel"
        placeholder="+234 800 000 0000"
        vertical="events"
        helperText="For ticket delivery"
        required
      />
    </div>
  ),
}

export const SearchInput: Story = {
  args: {
    type: 'search',
    placeholder: 'Search events, stays, experiences...',
    size: 'lg',
  },
}

// All Sizes
export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium (default)" />
      <Input size="lg" placeholder="Large" />
    </div>
  ),
}

// All States
export const AllStates: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <Input
        label="Default State"
        placeholder="Enter text"
      />
      <Input
        label="Error State"
        placeholder="Enter text"
        error="This field is required"
      />
      <Input
        label="Success State"
        placeholder="Enter text"
        success="Looks good!"
        defaultValue="Valid input"
      />
      <Input
        label="Disabled State"
        placeholder="Cannot edit"
        disabled
      />
    </div>
  ),
}
