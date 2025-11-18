/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FeaturedPackages } from '../FeaturedPackages'

// Mock router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock packages API
const mockPackagesAPI = {
  getFeatured: jest.fn(),
}

jest.mock('@/lib/api/packages', () => ({
  packagesAPI: mockPackagesAPI,
}))

// Mock intersection observer for lazy loading
const mockIntersectionObserver = jest.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})
window.IntersectionObserver = mockIntersectionObserver

describe('FeaturedPackages Component', () => {
  const mockPackages = [
    {
      id: 'pkg-1',
      title: 'Lagos Beach Party',
      description: 'Amazing beach party experience',
      price: 50000,
      currency: 'NGN',
      type: 'EVENT',
      location: 'Victoria Island, Lagos',
      images: ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300'],
      startDate: '2025-12-25T18:00:00Z',
      vendor: {
        id: 'vendor-1',
        businessName: 'Lagos Event Planners',
      },
      rating: 4.8,
      reviewCount: 156,
      featured: true,
    },
    {
      id: 'pkg-2',
      title: 'Luxury Hotel Stay',
      description: '5-star hotel experience',
      price: 120000,
      currency: 'NGN',
      type: 'STAY',
      location: 'Ikoyi, Lagos',
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300'],
      startDate: '2025-12-20T15:00:00Z',
      vendor: {
        id: 'vendor-2',
        businessName: 'Luxury Hotels Ltd',
      },
      rating: 4.9,
      reviewCount: 89,
      featured: true,
    },
  ]

  const defaultProps = {
    title: 'Featured Packages',
    subtitle: 'Discover our handpicked selection of amazing experiences',
    packages: mockPackages,
    loading: false,
    error: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockPackagesAPI.getFeatured.mockResolvedValue(mockPackages)
  })

  describe('Rendering', () => {
    it('renders section title and subtitle', () => {
      render(<FeaturedPackages {...defaultProps} />)
      
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Featured Packages')
      expect(screen.getByText(/handpicked selection/i)).toBeInTheDocument()
    })

    it('renders package cards', () => {
      render(<FeaturedPackages {...defaultProps} />)
      
      expect(screen.getByText('Lagos Beach Party')).toBeInTheDocument()
      expect(screen.getByText('Luxury Hotel Stay')).toBeInTheDocument()
      
      expect(screen.getByText('₦50,000')).toBeInTheDocument()
      expect(screen.getByText('₦120,000')).toBeInTheDocument()
    })

    it('renders package images', () => {
      render(<FeaturedPackages {...defaultProps} />)
      
      const images = screen.getAllByRole('img')
      expect(images.length).toBeGreaterThan(0)
      
      images.forEach(img => {
        expect(img).toHaveAttribute('src')
        expect(img).toHaveAttribute('alt')
      })
    })

    it('renders package ratings', () => {
      render(<FeaturedPackages {...defaultProps} />)
      
      expect(screen.getByText('4.8')).toBeInTheDocument()
      expect(screen.getByText('4.9')).toBeInTheDocument()
      expect(screen.getByText('(156 reviews)')).toBeInTheDocument()
      expect(screen.getByText('(89 reviews)')).toBeInTheDocument()
    })

    it('renders package types', () => {
      render(<FeaturedPackages {...defaultProps} />)
      
      expect(screen.getByText('Event')).toBeInTheDocument()
      expect(screen.getByText('Stay')).toBeInTheDocument()
    })

    it('renders vendor information', () => {
      render(<FeaturedPackages {...defaultProps} />)
      
      expect(screen.getByText('Lagos Event Planners')).toBeInTheDocument()
      expect(screen.getByText('Luxury Hotels Ltd')).toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('shows loading skeleton', () => {
      render(<FeaturedPackages {...defaultProps} loading={true} packages={[]} />)
      
      expect(screen.getByTestId('featured-packages-loading')).toBeInTheDocument()
      expect(screen.getAllByTestId('package-card-skeleton')).toHaveLength(6) // Default skeleton count
    })

    it('shows loading spinner', () => {
      render(<FeaturedPackages {...defaultProps} loading={true} packages={[]} />)
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })
  })

  describe('Error State', () => {
    it('shows error message', () => {
      render(<FeaturedPackages {...defaultProps} error="Failed to load packages" packages={[]} />)
      
      expect(screen.getByText(/failed to load packages/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
    })

    it('retries loading on button click', async () => {
      const user = userEvent.setup()
      const onRetry = jest.fn()
      
      render(<FeaturedPackages {...defaultProps} error="Failed to load" packages={[]} onRetry={onRetry} />)
      
      await user.click(screen.getByRole('button', { name: /try again/i }))
      
      expect(onRetry).toHaveBeenCalled()
    })
  })

  describe('Empty State', () => {
    it('shows empty state when no packages', () => {
      render(<FeaturedPackages {...defaultProps} packages={[]} />)
      
      expect(screen.getByText(/no featured packages available/i)).toBeInTheDocument()
      expect(screen.getByText(/check back soon/i)).toBeInTheDocument()
    })

    it('shows browse all packages button in empty state', () => {
      render(<FeaturedPackages {...defaultProps} packages={[]} />)
      
      expect(screen.getByRole('button', { name: /browse all packages/i })).toBeInTheDocument()
    })
  })

  describe('Package Interactions', () => {
    it('navigates to package detail on card click', async () => {
      const user = userEvent.setup()
      render(<FeaturedPackages {...defaultProps} />)
      
      await user.click(screen.getByText('Lagos Beach Party'))
      
      expect(mockPush).toHaveBeenCalledWith('/packages/pkg-1')
    })

    it('navigates to package detail on image click', async () => {
      const user = userEvent.setup()
      render(<FeaturedPackages {...defaultProps} />)
      
      const packageImage = screen.getAllByRole('img')[0]
      await user.click(packageImage)
      
      expect(mockPush).toHaveBeenCalledWith('/packages/pkg-1')
    })

    it('shows package quick view on hover', async () => {
      const user = userEvent.setup()
      render(<FeaturedPackages {...defaultProps} />)
      
      const packageCard = screen.getByTestId('package-card-pkg-1')
      await user.hover(packageCard)
      
      await waitFor(() => {
        expect(screen.getByTestId('package-quick-view')).toBeVisible()
      })
    })

    it('adds package to favorites', async () => {
      const user = userEvent.setup()
      const onFavorite = jest.fn()
      
      render(<FeaturedPackages {...defaultProps} onFavorite={onFavorite} />)
      
      const favoriteButton = screen.getAllByRole('button', { name: /add to favorites/i })[0]
      await user.click(favoriteButton)
      
      expect(onFavorite).toHaveBeenCalledWith('pkg-1')
    })

    it('shares package', async () => {
      const user = userEvent.setup()
      const mockShare = jest.fn()
      
      // Mock Web Share API
      Object.defineProperty(navigator, 'share', {
        value: mockShare,
        writable: true,
      })
      
      render(<FeaturedPackages {...defaultProps} />)
      
      const shareButton = screen.getAllByRole('button', { name: /share/i })[0]
      await user.click(shareButton)
      
      expect(mockShare).toHaveBeenCalledWith({
        title: 'Lagos Beach Party',
        text: 'Amazing beach party experience',
        url: expect.stringContaining('/packages/pkg-1'),
      })
    })
  })

  describe('Carousel Functionality', () => {
    it('shows navigation arrows when packages overflow', () => {
      const manyPackages = Array.from({ length: 10 }, (_, i) => ({
        ...mockPackages[0],
        id: `pkg-${i}`,
        title: `Package ${i}`,
      }))
      
      render(<FeaturedPackages {...defaultProps} packages={manyPackages} />)
      
      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
    })

    it('navigates carousel with arrow buttons', async () => {
      const user = userEvent.setup()
      const manyPackages = Array.from({ length: 10 }, (_, i) => ({
        ...mockPackages[0],
        id: `pkg-${i}`,
        title: `Package ${i}`,
      }))
      
      render(<FeaturedPackages {...defaultProps} packages={manyPackages} />)
      
      const nextButton = screen.getByRole('button', { name: /next/i })
      await user.click(nextButton)
      
      // Should scroll to show more packages
      expect(screen.getByTestId('packages-carousel')).toHaveClass('scrolled')
    })

    it('supports touch/swipe navigation', async () => {
      const manyPackages = Array.from({ length: 10 }, (_, i) => ({
        ...mockPackages[0],
        id: `pkg-${i}`,
        title: `Package ${i}`,
      }))
      
      render(<FeaturedPackages {...defaultProps} packages={manyPackages} />)
      
      const carousel = screen.getByTestId('packages-carousel')
      
      // Simulate touch events
      fireEvent.touchStart(carousel, {
        touches: [{ clientX: 100, clientY: 0 }],
      })
      fireEvent.touchMove(carousel, {
        touches: [{ clientX: 50, clientY: 0 }],
      })
      fireEvent.touchEnd(carousel)
      
      expect(carousel).toHaveClass('swiped')
    })
  })

  describe('Responsive Design', () => {
    it('adapts grid layout for mobile', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      
      render(<FeaturedPackages {...defaultProps} />)
      
      const packagesGrid = screen.getByTestId('packages-grid')
      expect(packagesGrid).toHaveClass('mobile-grid')
    })

    it('shows fewer packages on mobile', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      
      const manyPackages = Array.from({ length: 10 }, (_, i) => ({
        ...mockPackages[0],
        id: `pkg-${i}`,
        title: `Package ${i}`,
      }))
      
      render(<FeaturedPackages {...defaultProps} packages={manyPackages} />)
      
      // Should show only 2 packages per row on mobile
      const visiblePackages = screen.getAllByTestId(/package-card-/)
      expect(visiblePackages.length).toBeLessThanOrEqual(4) // 2 rows × 2 packages
    })
  })

  describe('Performance', () => {
    it('lazy loads package images', () => {
      render(<FeaturedPackages {...defaultProps} />)
      
      const images = screen.getAllByRole('img')
      images.forEach(img => {
        expect(img).toHaveAttribute('loading', 'lazy')
      })
    })

    it('preloads first few package images', () => {
      render(<FeaturedPackages {...defaultProps} />)
      
      const firstImages = screen.getAllByRole('img').slice(0, 2)
      firstImages.forEach(img => {
        expect(img).toHaveAttribute('loading', 'eager')
      })
    })

    it('implements virtual scrolling for many packages', () => {
      const manyPackages = Array.from({ length: 100 }, (_, i) => ({
        ...mockPackages[0],
        id: `pkg-${i}`,
        title: `Package ${i}`,
      }))
      
      render(<FeaturedPackages {...defaultProps} packages={manyPackages} />)
      
      // Should only render visible packages
      const renderedPackages = screen.getAllByTestId(/package-card-/)
      expect(renderedPackages.length).toBeLessThan(20) // Virtual scrolling limit
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<FeaturedPackages {...defaultProps} />)
      
      const h2 = screen.getByRole('heading', { level: 2 })
      expect(h2).toHaveTextContent('Featured Packages')
      
      const h3Elements = screen.getAllByRole('heading', { level: 3 })
      expect(h3Elements.length).toBe(mockPackages.length)
    })

    it('has proper ARIA labels', () => {
      render(<FeaturedPackages {...defaultProps} />)
      
      const section = screen.getByRole('region', { name: /featured packages/i })
      expect(section).toBeInTheDocument()
      
      const packageCards = screen.getAllByRole('article')
      expect(packageCards.length).toBe(mockPackages.length)
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<FeaturedPackages {...defaultProps} />)
      
      // Tab through package cards
      await user.tab()
      expect(screen.getAllByTestId(/package-card-/)[0]).toHaveFocus()
      
      await user.tab()
      expect(screen.getAllByRole('button', { name: /add to favorites/i })[0]).toHaveFocus()
    })

    it('announces dynamic content changes', async () => {
      const { rerender } = render(<FeaturedPackages {...defaultProps} loading={true} packages={[]} />)
      
      rerender(<FeaturedPackages {...defaultProps} loading={false} />)
      
      const announcement = screen.getByText(/featured packages loaded/i)
      expect(announcement).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('Analytics', () => {
    it('tracks package card clicks', async () => {
      const user = userEvent.setup()
      const mockAnalytics = jest.fn()
      
      window.gtag = mockAnalytics
      
      render(<FeaturedPackages {...defaultProps} />)
      
      await user.click(screen.getByText('Lagos Beach Party'))
      
      expect(mockAnalytics).toHaveBeenCalledWith('event', 'package_click', {
        package_id: 'pkg-1',
        package_title: 'Lagos Beach Party',
        source: 'featured_packages',
        position: 0,
      })
    })

    it('tracks carousel interactions', async () => {
      const user = userEvent.setup()
      const mockAnalytics = jest.fn()
      
      window.gtag = mockAnalytics
      
      const manyPackages = Array.from({ length: 10 }, (_, i) => ({
        ...mockPackages[0],
        id: `pkg-${i}`,
        title: `Package ${i}`,
      }))
      
      render(<FeaturedPackages {...defaultProps} packages={manyPackages} />)
      
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      expect(mockAnalytics).toHaveBeenCalledWith('event', 'carousel_navigation', {
        direction: 'next',
        source: 'featured_packages',
      })
    })
  })

  describe('API Integration', () => {
    it('fetches featured packages on mount', async () => {
      render(<FeaturedPackages {...defaultProps} packages={[]} />)
      
      await waitFor(() => {
        expect(mockPackagesAPI.getFeatured).toHaveBeenCalledWith({
          limit: 8,
          featured: true,
        })
      })
    })

    it('handles API errors gracefully', async () => {
      mockPackagesAPI.getFeatured.mockRejectedValue(new Error('API Error'))
      
      render(<FeaturedPackages {...defaultProps} packages={[]} />)
      
      await waitFor(() => {
        expect(screen.getByText(/failed to load packages/i)).toBeInTheDocument()
      })
    })

    it('retries API call on error', async () => {
      const user = userEvent.setup()
      mockPackagesAPI.getFeatured.mockRejectedValueOnce(new Error('API Error'))
      mockPackagesAPI.getFeatured.mockResolvedValueOnce(mockPackages)
      
      const onRetry = jest.fn()
      render(<FeaturedPackages {...defaultProps} error="API Error" packages={[]} onRetry={onRetry} />)
      
      await user.click(screen.getByRole('button', { name: /try again/i }))
      
      expect(onRetry).toHaveBeenCalled()
    })
  })
})
