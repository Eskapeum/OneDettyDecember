import type { Meta, StoryObj } from '@storybook/react'
import { PackageDetail, type PackageDetailData } from './package-detail'

// Sample package data
const samplePackage: PackageDetailData = {
  id: '1',
  title: 'Luxury Beach Villa - Lekki Peninsula',
  description: `Experience the ultimate December getaway in this stunning 5-bedroom beachfront villa.

Located on the pristine shores of Lekki, this exclusive property offers breathtaking ocean views, a private infinity pool, and direct beach access. Perfect for families or groups looking for a luxurious coastal retreat.

The villa features modern amenities, spacious living areas, and a fully equipped kitchen. Our dedicated staff including a private chef and housekeeping ensure your stay is nothing short of exceptional.`,
  price: 500000,
  location: 'Lekki Phase 1, Lagos',
  vertical: 'stays',
  rating: 4.9,
  reviewCount: 127,
  images: [
    'https://images.unsplash.com/photo-1582610116397-edb318620f90?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
  ],
  highlights: [
    'Private beach access with white sand',
    'Infinity pool overlooking the ocean',
    'Professional chef service included',
    'Daily housekeeping',
    '5 spacious bedrooms with en-suite bathrooms',
    'Modern entertainment system',
  ],
  amenities: [
    { icon: '🏊', label: 'Pool' },
    { icon: '🏖️', label: 'Beach Access' },
    { icon: '👨‍🍳', label: 'Chef Service' },
    { icon: '📶', label: 'WiFi' },
    { icon: '❄️', label: 'AC' },
    { icon: '🚗', label: 'Parking' },
    { icon: '🎮', label: 'Entertainment' },
    { icon: '🧺', label: 'Laundry' },
    { icon: '🔒', label: 'Security' },
  ],
  host: {
    name: 'Luxury Stays Lagos',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    verified: true,
    joinedDate: 'December 2022',
    responseRate: 98,
    responseTime: 'Within 1 hour',
  },
  policies: {
    checkIn: 'After 3:00 PM',
    checkOut: 'Before 11:00 AM',
    cancellation: 'Free cancellation up to 7 days before check-in. 50% refund if cancelled 3-7 days before. Non-refundable within 3 days.',
    rules: [
      'No smoking indoors',
      'No parties or events',
      'Pets not allowed',
      'Maximum 10 guests',
      'Quiet hours: 10 PM - 8 AM',
    ],
  },
}

const eventPackage: PackageDetailData = {
  id: '2',
  title: 'Afronation Festival 2025 - VIP Experience',
  description: `Get ready for the biggest Afrobeats festival in Africa!

Afronation 2025 brings together the hottest African and international artists for 3 unforgettable nights at Eko Atlantic. This VIP package includes all-access passes, backstage meet & greets, premium viewing area, and exclusive after-parties.

Experience performances from Burna Boy, Wizkid, Davido, Tems, and 50+ more artists across 5 stages. VIP amenities include dedicated entrances, air-conditioned lounges, premium bars, and complimentary food & beverages.`,
  price: 150000,
  location: 'Eko Atlantic, Lagos',
  vertical: 'events',
  rating: 4.8,
  reviewCount: 543,
  images: [
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&h=400&fit=crop',
  ],
  highlights: [
    '3-day all-access VIP pass',
    'Backstage meet & greet opportunities',
    'Premium viewing area near main stage',
    'Exclusive VIP after-parties',
    'Complimentary food & beverages',
    'Air-conditioned VIP lounge access',
  ],
  amenities: [
    { icon: '🎤', label: 'VIP Access' },
    { icon: '🍾', label: 'Premium Bar' },
    { icon: '🍽️', label: 'Catering' },
    { icon: '❄️', label: 'AC Lounge' },
    { icon: '🚻', label: 'VIP Restrooms' },
    { icon: '🅿️', label: 'Valet Parking' },
  ],
  host: {
    name: 'Afronation Events',
    verified: true,
    joinedDate: 'January 2020',
    responseRate: 100,
    responseTime: 'Within 30 minutes',
  },
  policies: {
    cancellation: 'Non-refundable. Tickets can be transferred to another person up to 24 hours before the event.',
    rules: [
      'Must be 18+ to attend',
      'Valid ID required for entry',
      'No outside food or drinks',
      'No professional cameras',
      'Wristbands must be worn at all times',
    ],
  },
}

const meta: Meta<typeof PackageDetail> = {
  title: 'Package/PackageDetail',
  component: PackageDetail,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof PackageDetail>

// Default
export const Default: Story = {
  args: {
    package: samplePackage,
  },
}

// Event Package
export const EventPackage: Story = {
  args: {
    package: eventPackage,
  },
}

// Without Booking Sidebar
export const NoBookingSidebar: Story = {
  args: {
    package: samplePackage,
    showBookingSidebar: false,
  },
}

// With Custom Booking Sidebar
export const CustomBookingSidebar: Story = {
  args: {
    package: samplePackage,
    bookingSidebar: (
      <div className="bg-card border rounded-lg p-6">
        <h3 className="font-bold mb-4">Custom Booking Widget</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Your custom booking form goes here
        </p>
        <button className="w-full bg-primary text-primary-foreground rounded-lg py-2">
          Check Availability
        </button>
      </div>
    ),
  },
}

// Minimal Package (No Extras)
export const MinimalPackage: Story = {
  args: {
    package: {
      id: '3',
      title: 'Simple Package',
      description: 'A basic package with minimal information.',
      price: 50000,
      location: 'Lagos',
      vertical: 'community',
      images: ['https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&h=800&fit=crop'],
    },
  },
}

// All Verticals
export const StaysVertical: Story = {
  args: {
    package: {
      ...samplePackage,
      vertical: 'stays',
    },
  },
}

export const EventsVertical: Story = {
  args: {
    package: {
      ...eventPackage,
      vertical: 'events',
    },
  },
}

export const ExperiencesVertical: Story = {
  args: {
    package: {
      ...samplePackage,
      title: 'Island Hopping Adventure',
      vertical: 'experiences',
      images: [
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop',
      ],
    },
  },
}

export const CarsVertical: Story = {
  args: {
    package: {
      ...samplePackage,
      title: 'Luxury SUV with Chauffeur',
      description: 'Range Rover Sport with professional driver for 24 hours',
      vertical: 'cars',
      price: 120000,
      images: [
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1200&h=800&fit=crop',
      ],
    },
  },
}

export const MarketplaceVertical: Story = {
  args: {
    package: {
      ...samplePackage,
      title: 'December Fashion Bundle',
      description: 'Curated outfit package from top Nigerian designers',
      vertical: 'marketplace',
      price: 250000,
      images: [
        'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=800&fit=crop',
      ],
    },
  },
}

export const CommunityVertical: Story = {
  args: {
    package: {
      ...samplePackage,
      title: 'Community Meetup Pass',
      description: 'Access to exclusive networking events throughout December',
      vertical: 'community',
      price: 30000,
      images: [
        'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&h=800&fit=crop',
      ],
    },
  },
}

// With Event Handlers
export const WithHandlers: Story = {
  args: {
    package: samplePackage,
    onBookNow: () => alert('Book Now clicked!'),
    onContactHost: () => alert('Contact Host clicked!'),
    onShare: () => alert('Share clicked!'),
    onSave: () => alert('Save clicked!'),
  },
}

// Real-world Example
export const RealWorld: Story = {
  render: () => (
    <PackageDetail
      package={samplePackage}
      onBookNow={() => console.log('Redirect to booking page')}
      onContactHost={() => console.log('Open contact modal')}
      onShare={() => console.log('Open share modal')}
      onSave={() => console.log('Toggle save status')}
      reviewsSection={
        <section>
          <h2 className="text-2xl font-bold mb-4">Reviews ({samplePackage.reviewCount})</h2>
          <div className="space-y-4">
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-500">★★★★★</span>
                <span className="font-semibold">Amazing experience!</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The villa exceeded all expectations. Beautiful location, amazing staff, and perfect for our family vacation.
              </p>
              <p className="text-xs text-muted-foreground mt-2">- John D. • December 2024</p>
            </div>
          </div>
        </section>
      }
      relatedPackages={
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Similar packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border rounded-lg p-4">
              <p className="text-sm">Related package 1</p>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <p className="text-sm">Related package 2</p>
            </div>
          </div>
        </section>
      }
    />
  ),
}
