import type { Meta, StoryObj } from '@storybook/react'
import { Hero } from './hero'

const meta: Meta<typeof Hero> = {
  title: 'Home/Hero',
  component: Hero,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Hero section height',
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Content alignment',
    },
    overlay: {
      control: 'select',
      options: ['none', 'light', 'medium', 'dark', 'gradient'],
      description: 'Background overlay darkness',
    },
    vertical: {
      control: 'select',
      options: ['stays', 'events', 'experiences', 'cars', 'marketplace', 'community'],
      description: 'Marketplace vertical theme',
    },
  },
}

export default meta
type Story = StoryObj<typeof Hero>

// Default Hero
export const Default: Story = {
  args: {
    title: 'Experience Lagos Like Never Before',
    subtitle: 'Discover amazing stays, events, and experiences this December',
    ctaText: 'Explore Packages',
    secondaryCtaText: 'Learn More',
  },
}

// With Background Image
export const WithBackgroundImage: Story = {
  args: {
    title: 'Your December Adventure Awaits',
    subtitle: 'Book unforgettable experiences across Nigeria',
    ctaText: 'Get Started',
    backgroundImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1920&h=1080&fit=crop',
    overlay: 'dark',
  },
}

// Sizes
export const Small: Story = {
  args: {
    title: 'Compact Hero Section',
    subtitle: 'Perfect for secondary pages',
    ctaText: 'Browse',
    size: 'sm',
    vertical: 'stays',
  },
}

export const Medium: Story = {
  args: {
    title: 'Medium Hero Section',
    subtitle: 'Balanced size for most pages',
    ctaText: 'Discover',
    size: 'md',
    vertical: 'events',
  },
}

export const Large: Story = {
  args: {
    title: 'Large Hero Section',
    subtitle: 'Great for landing pages',
    ctaText: 'Explore Now',
    size: 'lg',
    vertical: 'experiences',
  },
}

export const ExtraLarge: Story = {
  args: {
    title: 'Extra Large Hero',
    subtitle: 'Maximum impact for homepage',
    ctaText: 'Start Exploring',
    size: 'xl',
    vertical: 'marketplace',
  },
}

// Alignment
export const LeftAlign: Story = {
  args: {
    title: 'Left Aligned Content',
    subtitle: 'Great for editorial layouts',
    ctaText: 'Read More',
    align: 'left',
    vertical: 'stays',
  },
}

export const CenterAlign: Story = {
  args: {
    title: 'Center Aligned Content',
    subtitle: 'Classic hero layout',
    ctaText: 'Get Started',
    align: 'center',
    vertical: 'events',
  },
}

export const RightAlign: Story = {
  args: {
    title: 'Right Aligned Content',
    subtitle: 'Unique presentation style',
    ctaText: 'Discover',
    align: 'right',
    vertical: 'experiences',
  },
}

// Vertical Themes
export const StaysVertical: Story = {
  args: {
    title: 'Find Your Perfect Stay',
    subtitle: 'Luxury accommodations across Lagos and beyond',
    ctaText: 'Browse Stays',
    vertical: 'stays',
  },
}

export const EventsVertical: Story = {
  args: {
    title: 'December Events You Can\'t Miss',
    subtitle: 'Concerts, parties, and cultural celebrations',
    ctaText: 'View Events',
    vertical: 'events',
  },
}

export const ExperiencesVertical: Story = {
  args: {
    title: 'Unique Experiences Await',
    subtitle: 'Tours, adventures, and memorable moments',
    ctaText: 'Explore Experiences',
    vertical: 'experiences',
  },
}

export const CarsVertical: Story = {
  args: {
    title: 'Ride in Style',
    subtitle: 'Premium car rentals and chauffeur services',
    ctaText: 'Book a Ride',
    vertical: 'cars',
  },
}

export const MarketplaceVertical: Story = {
  args: {
    title: 'December Marketplace',
    subtitle: 'Shop gifts, fashion, and festive essentials',
    ctaText: 'Start Shopping',
    vertical: 'marketplace',
  },
}

export const CommunityVertical: Story = {
  args: {
    title: 'Join the Community',
    subtitle: 'Connect with people celebrating December in Lagos',
    ctaText: 'Get Involved',
    vertical: 'community',
  },
}

// Overlay Variations
export const NoOverlay: Story = {
  args: {
    title: 'No Overlay',
    subtitle: 'Pure gradient background',
    ctaText: 'Explore',
    overlay: 'none',
    vertical: 'stays',
  },
}

export const LightOverlay: Story = {
  args: {
    title: 'Light Overlay',
    subtitle: 'Subtle darkening effect',
    ctaText: 'Explore',
    overlay: 'light',
    backgroundImage: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=1920&h=1080&fit=crop',
  },
}

export const DarkOverlay: Story = {
  args: {
    title: 'Dark Overlay',
    subtitle: 'Strong contrast for text readability',
    ctaText: 'Explore',
    overlay: 'dark',
    backgroundImage: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920&h=1080&fit=crop',
  },
}

export const GradientOverlay: Story = {
  args: {
    title: 'Gradient Overlay',
    subtitle: 'Smooth fade effect from dark to light',
    ctaText: 'Explore',
    overlay: 'gradient',
    backgroundImage: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1920&h=1080&fit=crop',
  },
}

// Single CTA
export const SingleCTA: Story = {
  args: {
    title: 'One Call to Action',
    subtitle: 'Focused user journey',
    ctaText: 'Get Started',
    vertical: 'events',
  },
}

// No CTAs
export const NoCTAs: Story = {
  args: {
    title: 'Information Only',
    subtitle: 'No call to action buttons',
    vertical: 'experiences',
  },
}

// Custom Content
export const WithCustomContent: Story = {
  args: {
    title: 'Hero with Custom Content',
    subtitle: 'Add any custom React components below',
    ctaText: 'Learn More',
    vertical: 'stays',
  },
  render: (args) => (
    <Hero {...args}>
      <div className="flex flex-wrap gap-6 justify-center items-center text-white mt-8">
        <div className="text-center">
          <div className="text-3xl font-bold">500+</div>
          <div className="text-sm">Packages</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">10K+</div>
          <div className="text-sm">Happy Customers</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">4.9★</div>
          <div className="text-sm">Average Rating</div>
        </div>
      </div>
    </Hero>
  ),
}

// Real-world Example: Homepage
export const Homepage: Story = {
  args: {
    title: 'One Detty December 2025',
    subtitle: 'Your gateway to the ultimate December experience in Lagos',
    ctaText: 'Explore Packages',
    secondaryCtaText: 'How It Works',
    size: 'xl',
    backgroundImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1920&h=1080&fit=crop',
    overlay: 'dark',
  },
}

// Real-world Example: Category Page
export const CategoryPage: Story = {
  args: {
    title: 'December Events',
    subtitle: 'The biggest parties, concerts, and cultural celebrations',
    ctaText: 'Browse All Events',
    size: 'md',
    align: 'left',
    vertical: 'events',
    overlay: 'medium',
  },
}
