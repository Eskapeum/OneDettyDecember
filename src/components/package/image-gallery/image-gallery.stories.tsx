import type { Meta, StoryObj } from '@storybook/react'
import { ImageGallery } from './image-gallery'

const sampleImages = [
  'https://images.unsplash.com/photo-1582610116397-edb318620f90?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop',
]

const meta: Meta<typeof ImageGallery> = {
  title: 'Package/ImageGallery',
  component: ImageGallery,
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: 'select',
      options: ['grid', 'carousel'],
      description: 'Gallery layout style',
    },
  },
}

export default meta
type Story = StoryObj<typeof ImageGallery>

// Default Grid Layout
export const Default: Story = {
  args: {
    images: sampleImages,
    alt: 'Villa',
  },
}

// Carousel Layout
export const Carousel: Story = {
  args: {
    images: sampleImages,
    alt: 'Villa',
    layout: 'carousel',
  },
}

// Grid Layout
export const GridLayout: Story = {
  args: {
    images: sampleImages,
    alt: 'Package',
    layout: 'grid',
  },
}

// Few Images (3)
export const FewImages: Story = {
  args: {
    images: sampleImages.slice(0, 3),
    alt: 'Package',
  },
}

// Many Images (8+)
export const ManyImages: Story = {
  args: {
    images: sampleImages,
    alt: 'Villa',
  },
}

// Without Lightbox
export const NoLightbox: Story = {
  args: {
    images: sampleImages,
    alt: 'Package',
    showLightbox: false,
  },
}

// Without Counter
export const NoCounter: Story = {
  args: {
    images: sampleImages,
    alt: 'Package',
    showCounter: false,
  },
}

// Without View All Button
export const NoViewAllButton: Story = {
  args: {
    images: sampleImages,
    alt: 'Package',
    showViewAllButton: false,
  },
}

// Custom Max Height
export const CustomHeight: Story = {
  args: {
    images: sampleImages,
    alt: 'Package',
    maxHeight: 300,
  },
}

export const TallHeight: Story = {
  args: {
    images: sampleImages,
    alt: 'Package',
    maxHeight: 600,
  },
}

// With Event Handler
export const WithViewAllHandler: Story = {
  args: {
    images: sampleImages,
    alt: 'Package',
    onViewAll: () => alert('View All Photos clicked!'),
  },
}

// Real-world Example
export const RealWorldExample: Story = {
  render: () => (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Luxury Beach Villa Gallery</h2>
      <ImageGallery
        images={sampleImages}
        alt="Luxury Beach Villa"
        layout="grid"
        showLightbox={true}
        showCounter={true}
        showViewAllButton={true}
        onViewAll={() => console.log('Opening full gallery view')}
      />
    </div>
  ),
}

// Comparison: Grid vs Carousel
export const Comparison: Story = {
  render: () => (
    <div className="space-y-8 p-4">
      <div>
        <h3 className="text-xl font-bold mb-4">Grid Layout</h3>
        <ImageGallery images={sampleImages} layout="grid" />
      </div>
      <div>
        <h3 className="text-xl font-bold mb-4">Carousel Layout</h3>
        <ImageGallery images={sampleImages} layout="carousel" />
      </div>
    </div>
  ),
}
