import type { Meta, StoryObj } from '@storybook/react'
import { Avatar, AvatarGroup } from './avatar'

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Avatar size',
    },
    status: {
      control: 'select',
      options: ['online', 'offline', 'away', 'busy'],
      description: 'Status indicator',
    },
    vertical: {
      control: 'select',
      options: ['stays', 'events', 'experiences', 'cars', 'marketplace', 'community'],
      description: 'Marketplace vertical theme (for initials background)',
    },
  },
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  args: {
    alt: 'User',
    initials: 'JD',
  },
}

export const WithImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    alt: 'John Doe',
  },
}

export const WithInitials: Story = {
  args: {
    alt: 'John Doe',
    initials: 'JD',
  },
}

export const WithStatus: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    alt: 'John Doe',
    status: 'online',
  },
}

// Sizes
export const ExtraSmall: Story = {
  args: {
    alt: 'User',
    initials: 'XS',
    size: 'xs',
  },
}

export const Small: Story = {
  args: {
    alt: 'User',
    initials: 'SM',
    size: 'sm',
  },
}

export const Medium: Story = {
  args: {
    alt: 'User',
    initials: 'MD',
    size: 'md',
  },
}

export const Large: Story = {
  args: {
    alt: 'User',
    initials: 'LG',
    size: 'lg',
  },
}

export const ExtraLarge: Story = {
  args: {
    alt: 'User',
    initials: 'XL',
    size: 'xl',
  },
}

// Status Indicators
export const Online: Story = {
  args: {
    alt: 'User',
    initials: 'ON',
    status: 'online',
  },
}

export const Offline: Story = {
  args: {
    alt: 'User',
    initials: 'OFF',
    status: 'offline',
  },
}

export const Away: Story = {
  args: {
    alt: 'User',
    initials: 'AW',
    status: 'away',
  },
}

export const Busy: Story = {
  args: {
    alt: 'User',
    initials: 'BS',
    status: 'busy',
  },
}

// Vertical Themes
export const StaysVertical: Story = {
  args: {
    alt: 'Host',
    initials: 'ST',
    vertical: 'stays',
  },
}

export const EventsVertical: Story = {
  args: {
    alt: 'Organizer',
    initials: 'EV',
    vertical: 'events',
  },
}

export const ExperiencesVertical: Story = {
  args: {
    alt: 'Guide',
    initials: 'EX',
    vertical: 'experiences',
  },
}

export const CarsVertical: Story = {
  args: {
    alt: 'Driver',
    initials: 'CR',
    vertical: 'cars',
  },
}

export const MarketplaceVertical: Story = {
  args: {
    alt: 'Seller',
    initials: 'MP',
    vertical: 'marketplace',
  },
}

export const CommunityVertical: Story = {
  args: {
    alt: 'Member',
    initials: 'CM',
    vertical: 'community',
  },
}

// Avatar Group
export const GroupDefault: StoryObj<typeof AvatarGroup> = {
  render: () => (
    <AvatarGroup>
      <Avatar alt="User 1" initials="U1" vertical="stays" />
      <Avatar alt="User 2" initials="U2" vertical="events" />
      <Avatar alt="User 3" initials="U3" vertical="experiences" />
      <Avatar alt="User 4" initials="U4" vertical="cars" />
      <Avatar alt="User 5" initials="U5" vertical="marketplace" />
    </AvatarGroup>
  ),
}

export const GroupWithMax: StoryObj<typeof AvatarGroup> = {
  render: () => (
    <AvatarGroup max={3}>
      <Avatar alt="User 1" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
      <Avatar alt="User 2" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" />
      <Avatar alt="User 3" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" />
      <Avatar alt="User 4" initials="U4" />
      <Avatar alt="User 5" initials="U5" />
    </AvatarGroup>
  ),
}

// All Sizes Showcase
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar alt="XS" initials="XS" size="xs" />
      <Avatar alt="SM" initials="SM" size="sm" />
      <Avatar alt="MD" initials="MD" size="md" />
      <Avatar alt="LG" initials="LG" size="lg" />
      <Avatar alt="XL" initials="XL" size="xl" />
    </div>
  ),
}

// All Verticals
export const AllVerticals: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <div className="space-y-2">
        <Avatar alt="Stays" initials="ST" vertical="stays" />
        <p className="text-xs text-center">Stays</p>
      </div>
      <div className="space-y-2">
        <Avatar alt="Events" initials="EV" vertical="events" />
        <p className="text-xs text-center">Events</p>
      </div>
      <div className="space-y-2">
        <Avatar alt="Experiences" initials="EX" vertical="experiences" />
        <p className="text-xs text-center">Experiences</p>
      </div>
      <div className="space-y-2">
        <Avatar alt="Cars" initials="CR" vertical="cars" />
        <p className="text-xs text-center">Cars</p>
      </div>
      <div className="space-y-2">
        <Avatar alt="Marketplace" initials="MP" vertical="marketplace" />
        <p className="text-xs text-center">Marketplace</p>
      </div>
      <div className="space-y-2">
        <Avatar alt="Community" initials="CM" vertical="community" />
        <p className="text-xs text-center">Community</p>
      </div>
    </div>
  ),
}

// Real-world Examples
export const UserProfile: Story = {
  render: () => (
    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
      <Avatar
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
        alt="John Doe"
        size="lg"
        status="online"
      />
      <div>
        <h3 className="font-semibold">John Doe</h3>
        <p className="text-sm text-gray-500">Traveler • Lagos, Nigeria</p>
      </div>
    </div>
  ),
}

export const VendorProfile: Story = {
  render: () => (
    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
      <Avatar
        alt="Luxury Stays Lagos"
        initials="LS"
        size="lg"
        vertical="stays"
      />
      <div>
        <h3 className="font-semibold">Luxury Stays Lagos</h3>
        <p className="text-sm text-gray-500">Host • 4.9★ (127 reviews)</p>
      </div>
    </div>
  ),
}

export const EventAttendees: Story = {
  render: () => (
    <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
      <p className="text-sm font-medium">43 people are attending</p>
      <AvatarGroup max={5} size="sm">
        <Avatar alt="User 1" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
        <Avatar alt="User 2" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" />
        <Avatar alt="User 3" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" />
        <Avatar alt="User 4" initials="U4" vertical="events" />
        <Avatar alt="User 5" initials="U5" vertical="events" />
        <Avatar alt="User 6" initials="U6" vertical="events" />
        <Avatar alt="User 7" initials="U7" vertical="events" />
      </AvatarGroup>
    </div>
  ),
}
