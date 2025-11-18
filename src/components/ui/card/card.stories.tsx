import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'
import { Button } from '../button'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'elevated'],
      description: 'Card visual style',
    },
    hoverable: {
      control: 'boolean',
      description: 'Enable hover effects',
    },
    vertical: {
      control: 'select',
      options: ['stays', 'events', 'experiences', 'cars', 'marketplace', 'community'],
      description: 'Marketplace vertical theme (left border accent)',
    },
  },
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content area with some text to demonstrate the layout.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
}

export const Bordered: Story = {
  render: () => (
    <Card variant="bordered">
      <CardHeader>
        <CardTitle>Bordered Card</CardTitle>
        <CardDescription>This card has a thicker border</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Content with bordered variant style.</p>
      </CardContent>
    </Card>
  ),
}

export const Elevated: Story = {
  render: () => (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Elevated Card</CardTitle>
        <CardDescription>This card has enhanced shadow effects</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Content with elevated variant style.</p>
      </CardContent>
    </Card>
  ),
}

export const Hoverable: Story = {
  render: () => (
    <Card hoverable>
      <CardHeader>
        <CardTitle>Hoverable Card</CardTitle>
        <CardDescription>Hover over this card to see the effect</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card lifts and shows shadow on hover.</p>
      </CardContent>
    </Card>
  ),
}

// Vertical Themes
export const StaysVertical: Story = {
  render: () => (
    <Card vertical="stays">
      <CardHeader>
        <CardTitle>Luxury Beach Villa</CardTitle>
        <CardDescription>Lekki, Lagos</CardDescription>
      </CardHeader>
      <CardContent>
        <p>3 bedrooms • 2 bathrooms • Pool</p>
        <p className="text-2xl font-bold mt-2">₦250,000/night</p>
      </CardContent>
      <CardFooter>
        <Button vertical="stays">Book Stay</Button>
      </CardFooter>
    </Card>
  ),
}

export const EventsVertical: Story = {
  render: () => (
    <Card vertical="events">
      <CardHeader>
        <CardTitle>Detty December Concert</CardTitle>
        <CardDescription>Eko Hotel, Lagos</CardDescription>
      </CardHeader>
      <CardContent>
        <p>December 27, 2025 • 8:00 PM</p>
        <p className="text-2xl font-bold mt-2">₦15,000</p>
      </CardContent>
      <CardFooter>
        <Button vertical="events">Get Tickets</Button>
      </CardFooter>
    </Card>
  ),
}

export const ExperiencesVertical: Story = {
  render: () => (
    <Card vertical="experiences">
      <CardHeader>
        <CardTitle>Lagos Night Tour</CardTitle>
        <CardDescription>VI & Lekki Nightlife</CardDescription>
      </CardHeader>
      <CardContent>
        <p>5 hours • Includes drinks</p>
        <p className="text-2xl font-bold mt-2">₦35,000</p>
      </CardContent>
      <CardFooter>
        <Button vertical="experiences">Book Tour</Button>
      </CardFooter>
    </Card>
  ),
}

export const CarsVertical: Story = {
  render: () => (
    <Card vertical="cars">
      <CardHeader>
        <CardTitle>Mercedes-Benz GLE</CardTitle>
        <CardDescription>2024 Model • Automatic</CardDescription>
      </CardHeader>
      <CardContent>
        <p>SUV • 7 seats • GPS</p>
        <p className="text-2xl font-bold mt-2">₦80,000/day</p>
      </CardContent>
      <CardFooter>
        <Button vertical="cars">Rent Now</Button>
      </CardFooter>
    </Card>
  ),
}

export const MarketplaceVertical: Story = {
  render: () => (
    <Card vertical="marketplace">
      <CardHeader>
        <CardTitle>Detty December Merch</CardTitle>
        <CardDescription>Limited Edition T-Shirt</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Sizes: S, M, L, XL</p>
        <p className="text-2xl font-bold mt-2">₦12,000</p>
      </CardContent>
      <CardFooter>
        <Button vertical="marketplace">Add to Cart</Button>
      </CardFooter>
    </Card>
  ),
}

export const CommunityVertical: Story = {
  render: () => (
    <Card vertical="community">
      <CardHeader>
        <CardTitle>Lagos December Squad</CardTitle>
        <CardDescription>Connect with travelers</CardDescription>
      </CardHeader>
      <CardContent>
        <p>1,234 members • 50+ events</p>
      </CardContent>
      <CardFooter>
        <Button vertical="community">Join Group</Button>
      </CardFooter>
    </Card>
  ),
}

// All Verticals Showcase
export const AllVerticals: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card vertical="stays" hoverable>
        <CardHeader>
          <CardTitle>Stays</CardTitle>
          <CardDescription>Coastal Emerald</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Accommodations, hotels, Airbnbs</p>
        </CardContent>
      </Card>
      <Card vertical="events" hoverable>
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription>Afrobeat Red</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Concerts, parties, nightlife</p>
        </CardContent>
      </Card>
      <Card vertical="experiences" hoverable>
        <CardHeader>
          <CardTitle>Experiences</CardTitle>
          <CardDescription>Festival Orange</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Tours, activities, adventures</p>
        </CardContent>
      </Card>
      <Card vertical="cars" hoverable>
        <CardHeader>
          <CardTitle>Cars</CardTitle>
          <CardDescription>Atlantic Blue</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Car rentals, transfers</p>
        </CardContent>
      </Card>
      <Card vertical="marketplace" hoverable>
        <CardHeader>
          <CardTitle>Marketplace</CardTitle>
          <CardDescription>Highlife Purple</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Products, merch, items</p>
        </CardContent>
      </Card>
      <Card vertical="community" hoverable>
        <CardHeader>
          <CardTitle>Community</CardTitle>
          <CardDescription>Danfo Yellow</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Forums, groups, social</p>
        </CardContent>
      </Card>
    </div>
  ),
}
