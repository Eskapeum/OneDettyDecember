import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'dot'],
      description: 'Badge visual style',
    },
    vertical: {
      control: 'select',
      options: ['stays', 'events', 'experiences', 'cars', 'marketplace', 'community'],
      description: 'Marketplace vertical theme',
    },
    showDot: {
      control: 'boolean',
      description: 'Show dot indicator',
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {
    children: 'Badge',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
}

export const Destructive: Story = {
  args: {
    children: 'Destructive',
    variant: 'destructive',
  },
}

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
}

export const Dot: Story = {
  args: {
    children: 'Active',
    variant: 'dot',
  },
}

// Vertical Themes
export const StaysVertical: Story = {
  args: {
    children: 'Stays',
    vertical: 'stays',
  },
}

export const EventsVertical: Story = {
  args: {
    children: 'Events',
    vertical: 'events',
  },
}

export const ExperiencesVertical: Story = {
  args: {
    children: 'Experiences',
    vertical: 'experiences',
  },
}

export const CarsVertical: Story = {
  args: {
    children: 'Cars',
    vertical: 'cars',
  },
}

export const MarketplaceVertical: Story = {
  args: {
    children: 'Marketplace',
    vertical: 'marketplace',
  },
}

export const CommunityVertical: Story = {
  args: {
    children: 'Community',
    vertical: 'community',
  },
}

// Status Badges
export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge vertical="events">Available</Badge>
      <Badge variant="destructive">Sold Out</Badge>
      <Badge variant="secondary">Upcoming</Badge>
      <Badge variant="outline">Draft</Badge>
      <Badge variant="dot" vertical="stays">Live</Badge>
    </div>
  ),
}

// All Verticals
export const AllVerticals: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Solid Badges</h3>
        <div className="flex flex-wrap gap-2">
          <Badge vertical="stays">Stays</Badge>
          <Badge vertical="events">Events</Badge>
          <Badge vertical="experiences">Experiences</Badge>
          <Badge vertical="cars">Cars</Badge>
          <Badge vertical="marketplace">Marketplace</Badge>
          <Badge vertical="community">Community</Badge>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Dot Badges</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="dot" vertical="stays">Stays Available</Badge>
          <Badge variant="dot" vertical="events">Event Live</Badge>
          <Badge variant="dot" vertical="experiences">Tour Active</Badge>
          <Badge variant="dot" vertical="cars">Car Ready</Badge>
          <Badge variant="dot" vertical="marketplace">In Stock</Badge>
          <Badge variant="dot" vertical="community">Group Active</Badge>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Outline Badges</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Default</Badge>
          <Badge variant="outline">Pending</Badge>
          <Badge variant="outline">Processing</Badge>
        </div>
      </div>
    </div>
  ),
}

// Real-world Examples
export const EventCard: Story = {
  render: () => (
    <div className="space-y-2 p-6 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <h3 className="text-xl font-bold">Detty December Concert</h3>
        <Badge vertical="events">Events</Badge>
        <Badge variant="dot" vertical="events">50 tickets left</Badge>
      </div>
      <p className="text-gray-600">December 27, 2025 • Eko Hotel, Lagos</p>
      <div className="flex gap-2">
        <Badge variant="outline">Afrobeats</Badge>
        <Badge variant="outline">Live Music</Badge>
        <Badge variant="outline">VIP Available</Badge>
      </div>
    </div>
  ),
}

export const StayCard: Story = {
  render: () => (
    <div className="space-y-2 p-6 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <h3 className="text-xl font-bold">Luxury Beach Villa</h3>
        <Badge vertical="stays">Stays</Badge>
        <Badge variant="destructive">Limited</Badge>
      </div>
      <p className="text-gray-600">Lekki, Lagos • Sleeps 6</p>
      <div className="flex gap-2">
        <Badge variant="outline">Pool</Badge>
        <Badge variant="outline">Beach Access</Badge>
        <Badge variant="outline">WiFi</Badge>
      </div>
    </div>
  ),
}
