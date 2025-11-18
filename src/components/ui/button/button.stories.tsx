import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'outline', 'destructive', 'link'],
      description: 'Button visual style',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon'],
      description: 'Button size',
    },
    vertical: {
      control: 'select',
      options: ['stays', 'events', 'experiences', 'cars', 'marketplace', 'community'],
      description: 'Marketplace vertical theme',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading spinner',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable button',
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Button',
    variant: 'secondary',
  },
}

export const Ghost: Story = {
  args: {
    children: 'Button',
    variant: 'ghost',
  },
}

export const Outline: Story = {
  args: {
    children: 'Button',
    variant: 'outline',
  },
}

export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
  },
}

export const Link: Story = {
  args: {
    children: 'Learn More',
    variant: 'link',
  },
}

export const Small: Story = {
  args: {
    children: 'Small',
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    children: 'Large',
    size: 'lg',
  },
}

export const Loading: Story = {
  args: {
    children: 'Please wait',
    loading: true,
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
}

// Vertical Themes
export const StaysVertical: Story = {
  args: {
    children: 'Book Stay',
    vertical: 'stays',
  },
}

export const EventsVertical: Story = {
  args: {
    children: 'Book Event',
    vertical: 'events',
  },
}

export const ExperiencesVertical: Story = {
  args: {
    children: 'Book Experience',
    vertical: 'experiences',
  },
}

export const CarsVertical: Story = {
  args: {
    children: 'Rent Car',
    vertical: 'cars',
  },
}

export const MarketplaceVertical: Story = {
  args: {
    children: 'Buy Now',
    vertical: 'marketplace',
  },
}

export const CommunityVertical: Story = {
  args: {
    children: 'Join Community',
    vertical: 'community',
  },
}

// All Vertical Themes Showcase
export const AllVerticals: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Vertical Themes</h3>
        <div className="flex flex-wrap gap-2">
          <Button vertical="stays">Stays</Button>
          <Button vertical="events">Events</Button>
          <Button vertical="experiences">Experiences</Button>
          <Button vertical="cars">Cars</Button>
          <Button vertical="marketplace">Marketplace</Button>
          <Button vertical="community">Community</Button>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Variants</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Sizes</h3>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">States</h3>
        <div className="flex flex-wrap gap-2">
          <Button>Default</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>
    </div>
  ),
}

// Real-world Examples
export const BookingExample: Story = {
  render: () => (
    <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-bold">December in Lagos Package</h3>
      <p className="text-gray-600">Experience the best of December in Lagos with exclusive events and stays.</p>
      <div className="flex gap-2">
        <Button vertical="events">Book Now</Button>
        <Button variant="outline">Learn More</Button>
      </div>
    </div>
  ),
}
