import type { Meta, StoryObj } from '@storybook/react'
import { FeaturedPackages, type Package } from './featured-packages'

// Sample package data
const samplePackages: Package[] = [
  {
    id: '1',
    title: 'Luxury Beach Villa - Lekki',
    description: 'Stunning 5-bedroom beachfront villa with private pool and chef service',
    price: 500000,
    image: 'https://images.unsplash.com/photo-1582610116397-edb318620f90?w=800&h=600&fit=crop',
    vertical: 'stays',
    rating: 4.9,
    reviewCount: 127,
    location: 'Lekki Phase 1, Lagos',
    tags: ['Beachfront', 'Pool', 'Chef'],
    availability: 'available',
  },
  {
    id: '2',
    title: 'Afronation Festival Pass',
    description: '3-day all-access pass to Africa\'s biggest music festival',
    price: 150000,
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
    vertical: 'events',
    rating: 4.8,
    reviewCount: 543,
    location: 'Eko Atlantic, Lagos',
    tags: ['Music', 'Festival', '3 Days'],
    availability: 'limited',
  },
  {
    id: '3',
    title: 'Island Hopping Adventure',
    description: 'Guided tour of Lagos islands with snorkeling and beach BBQ',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    vertical: 'experiences',
    rating: 4.7,
    reviewCount: 89,
    location: 'Ikoyi Marina, Lagos',
    tags: ['Adventure', 'Boat', 'Food'],
    availability: 'available',
  },
  {
    id: '4',
    title: 'Luxury SUV with Chauffeur',
    description: 'Range Rover Sport with professional driver for 24 hours',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop',
    vertical: 'cars',
    rating: 5.0,
    reviewCount: 234,
    location: 'VI, Lagos',
    tags: ['Luxury', 'Chauffeur', '24hrs'],
    availability: 'available',
  },
  {
    id: '5',
    title: 'December Fashion Bundle',
    description: 'Curated outfit package from top Nigerian designers',
    price: 250000,
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop',
    vertical: 'marketplace',
    rating: 4.6,
    reviewCount: 67,
    location: 'Lekki, Lagos',
    tags: ['Fashion', 'Designer', 'Bundle'],
    availability: 'limited',
  },
  {
    id: '6',
    title: 'Community Meetup Pass',
    description: 'Access to exclusive networking events throughout December',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop',
    vertical: 'community',
    rating: 4.5,
    reviewCount: 156,
    location: 'Multiple Locations',
    tags: ['Networking', 'Events', 'Monthly'],
    availability: 'available',
  },
  {
    id: '7',
    title: 'Penthouse Suite - Ikoyi',
    description: 'Modern penthouse with panoramic city views and concierge',
    price: 750000,
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&h=600&fit=crop',
    vertical: 'stays',
    rating: 4.9,
    reviewCount: 201,
    location: 'Ikoyi, Lagos',
    tags: ['Luxury', 'Views', 'Concierge'],
    availability: 'sold-out',
  },
  {
    id: '8',
    title: 'New Year\'s Eve Gala',
    description: 'Black-tie dinner and party at the most exclusive venue',
    price: 200000,
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop',
    vertical: 'events',
    rating: 4.8,
    reviewCount: 89,
    location: 'Eko Hotel, VI',
    tags: ['Gala', 'NYE', 'Premium'],
    availability: 'limited',
  },
]

const meta: Meta<typeof FeaturedPackages> = {
  title: 'Home/FeaturedPackages',
  component: FeaturedPackages,
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: 'select',
      options: [2, 3, 4],
      description: 'Grid columns (responsive)',
    },
    filterVertical: {
      control: 'select',
      options: [undefined, 'stays', 'events', 'experiences', 'cars', 'marketplace', 'community'],
      description: 'Filter packages by vertical',
    },
  },
}

export default meta
type Story = StoryObj<typeof FeaturedPackages>

// Default
export const Default: Story = {
  args: {
    packages: samplePackages,
  },
}

// With Subtitle
export const WithSubtitle: Story = {
  args: {
    title: 'Featured Packages',
    subtitle: 'Handpicked experiences for an unforgettable December',
    packages: samplePackages,
  },
}

// Limited Display
export const Limited: Story = {
  args: {
    title: 'Top Picks',
    subtitle: 'Our most popular packages',
    packages: samplePackages,
    limit: 3,
  },
}

// Grid Columns
export const TwoColumns: Story = {
  args: {
    title: 'Two Column Grid',
    packages: samplePackages.slice(0, 4),
    columns: 2,
  },
}

export const ThreeColumns: Story = {
  args: {
    title: 'Three Column Grid',
    packages: samplePackages.slice(0, 6),
    columns: 3,
  },
}

export const FourColumns: Story = {
  args: {
    title: 'Four Column Grid',
    packages: samplePackages,
    columns: 4,
  },
}

// Filtered by Vertical
export const StaysOnly: Story = {
  args: {
    title: 'Featured Stays',
    subtitle: 'Luxury accommodations for your December getaway',
    packages: samplePackages,
    filterVertical: 'stays',
  },
}

export const EventsOnly: Story = {
  args: {
    title: 'Featured Events',
    subtitle: 'Don\'t miss these exclusive December events',
    packages: samplePackages,
    filterVertical: 'events',
  },
}

export const ExperiencesOnly: Story = {
  args: {
    title: 'Featured Experiences',
    subtitle: 'Unique adventures and memorable moments',
    packages: samplePackages,
    filterVertical: 'experiences',
  },
}

export const CarsOnly: Story = {
  args: {
    title: 'Featured Cars',
    subtitle: 'Ride in style this December',
    packages: samplePackages,
    filterVertical: 'cars',
  },
}

export const MarketplaceOnly: Story = {
  args: {
    title: 'Featured Products',
    subtitle: 'Curated fashion and gifts for the season',
    packages: samplePackages,
    filterVertical: 'marketplace',
  },
}

export const CommunityOnly: Story = {
  args: {
    title: 'Community Events',
    subtitle: 'Connect with like-minded people',
    packages: samplePackages,
    filterVertical: 'community',
  },
}

// No View All Button
export const NoViewAll: Story = {
  args: {
    title: 'All Packages',
    packages: samplePackages.slice(0, 6),
    showViewAll: false,
  },
}

// Empty State
export const EmptyState: Story = {
  args: {
    title: 'No Packages Found',
    subtitle: 'Try adjusting your filters',
    packages: [],
  },
}

// Real-world Example: Homepage
export const Homepage: Story = {
  args: {
    title: 'Featured This December',
    subtitle: 'Our most popular packages across all categories',
    packages: samplePackages.slice(0, 6),
    columns: 3,
    showViewAll: true,
  },
}

// Real-world Example: Category Page
export const CategoryPageStays: Story = {
  args: {
    title: 'All Stays',
    subtitle: `${samplePackages.filter(p => p.vertical === 'stays').length} properties available`,
    packages: samplePackages,
    filterVertical: 'stays',
    columns: 3,
    showViewAll: false,
  },
}

// With Click Handlers
export const WithClickHandlers: Story = {
  args: {
    title: 'Interactive Packages',
    subtitle: 'Click on a package or the "View All" button',
    packages: samplePackages.slice(0, 3),
    onPackageClick: (pkg) => {
      alert(`Clicked: ${pkg.title}`)
    },
    onViewAllClick: () => {
      alert('View All clicked!')
    },
  },
}

// Sold Out & Limited Availability
export const AvailabilityStates: Story = {
  args: {
    title: 'Availability Examples',
    subtitle: 'Notice the different availability badges',
    packages: [
      samplePackages[0], // available
      samplePackages[1], // limited
      samplePackages[6], // sold-out
    ],
  },
}
