/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HeroSection } from '../HeroSection'

// Mock router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock search API
const mockSearchAPI = {
  getSuggestions: jest.fn(),
}

jest.mock('@/lib/api/search', () => ({
  searchAPI: mockSearchAPI,
}))

describe('HeroSection Component', () => {
  const defaultProps = {
    title: 'Discover Amazing Events, Stays & Experiences',
    subtitle: 'Find the perfect packages for your next adventure in West Africa',
    searchPlaceholder: 'Search for events, stays, experiences...',
    backgroundImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders hero section with title and subtitle', () => {
      render(<HeroSection {...defaultProps} />)
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Discover Amazing Events, Stays & Experiences'
      )
      expect(screen.getByText(/find the perfect packages/i)).toBeInTheDocument()
    })

    it('renders search bar', () => {
      render(<HeroSection {...defaultProps} />)
      
      const searchInput = screen.getByPlaceholderText(/search for events/i)
      expect(searchInput).toBeInTheDocument()
      expect(searchInput).toHaveAttribute('type', 'text')
      
      const searchButton = screen.getByRole('button', { name: /search/i })
      expect(searchButton).toBeInTheDocument()
    })

    it('renders background image', () => {
      render(<HeroSection {...defaultProps} />)
      
      const heroContainer = screen.getByTestId('hero-section')
      expect(heroContainer).toHaveStyle({
        backgroundImage: `url(${defaultProps.backgroundImage})`,
      })
    })

    it('renders call-to-action buttons', () => {
      render(<HeroSection {...defaultProps} />)
      
      expect(screen.getByRole('button', { name: /explore events/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /find stays/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /discover experiences/i })).toBeInTheDocument()
    })

    it('renders popular destinations', () => {
      render(<HeroSection {...defaultProps} />)
      
      expect(screen.getByText(/popular destinations/i)).toBeInTheDocument()
      expect(screen.getByText('Lagos')).toBeInTheDocument()
      expect(screen.getByText('Accra')).toBeInTheDocument()
      expect(screen.getByText('Abuja')).toBeInTheDocument()
    })
  })

  describe('Search Functionality', () => {
    it('handles search input', async () => {
      const user = userEvent.setup()
      render(<HeroSection {...defaultProps} />)
      
      const searchInput = screen.getByPlaceholderText(/search for events/i)
      await user.type(searchInput, 'Lagos beach party')
      
      expect(searchInput).toHaveValue('Lagos beach party')
    })

    it('performs search on button click', async () => {
      const user = userEvent.setup()
      render(<HeroSection {...defaultProps} />)
      
      const searchInput = screen.getByPlaceholderText(/search for events/i)
      const searchButton = screen.getByRole('button', { name: /search/i })
      
      await user.type(searchInput, 'Lagos events')
      await user.click(searchButton)
      
      expect(mockPush).toHaveBeenCalledWith('/search?q=Lagos+events')
    })

    it('performs search on Enter key press', async () => {
      const user = userEvent.setup()
      render(<HeroSection {...defaultProps} />)
      
      const searchInput = screen.getByPlaceholderText(/search for events/i)
      await user.type(searchInput, 'beach party{enter}')
      
      expect(mockPush).toHaveBeenCalledWith('/search?q=beach+party')
    })

    it('shows search suggestions', async () => {
      const user = userEvent.setup()
      mockSearchAPI.getSuggestions.mockResolvedValue([
        { id: '1', text: 'Lagos Beach Party', type: 'event' },
        { id: '2', text: 'Lagos Hotels', type: 'stay' },
      ])
      
      render(<HeroSection {...defaultProps} />)
      
      const searchInput = screen.getByPlaceholderText(/search for events/i)
      await user.type(searchInput, 'Lagos')
      
      await waitFor(() => {
        expect(screen.getByText('Lagos Beach Party')).toBeInTheDocument()
        expect(screen.getByText('Lagos Hotels')).toBeInTheDocument()
      })
    })

    it('selects suggestion on click', async () => {
      const user = userEvent.setup()
      mockSearchAPI.getSuggestions.mockResolvedValue([
        { id: '1', text: 'Lagos Beach Party', type: 'event' },
      ])
      
      render(<HeroSection {...defaultProps} />)
      
      const searchInput = screen.getByPlaceholderText(/search for events/i)
      await user.type(searchInput, 'Lagos')
      
      await waitFor(() => {
        expect(screen.getByText('Lagos Beach Party')).toBeInTheDocument()
      })
      
      await user.click(screen.getByText('Lagos Beach Party'))
      
      expect(mockPush).toHaveBeenCalledWith('/search?q=Lagos+Beach+Party')
    })
  })

  describe('Call-to-Action Buttons', () => {
    it('navigates to events page', async () => {
      const user = userEvent.setup()
      render(<HeroSection {...defaultProps} />)
      
      await user.click(screen.getByRole('button', { name: /explore events/i }))
      
      expect(mockPush).toHaveBeenCalledWith('/search?type=EVENT')
    })

    it('navigates to stays page', async () => {
      const user = userEvent.setup()
      render(<HeroSection {...defaultProps} />)
      
      await user.click(screen.getByRole('button', { name: /find stays/i }))
      
      expect(mockPush).toHaveBeenCalledWith('/search?type=STAY')
    })

    it('navigates to experiences page', async () => {
      const user = userEvent.setup()
      render(<HeroSection {...defaultProps} />)
      
      await user.click(screen.getByRole('button', { name: /discover experiences/i }))
      
      expect(mockPush).toHaveBeenCalledWith('/search?type=EXPERIENCE')
    })
  })

  describe('Popular Destinations', () => {
    it('navigates to destination search', async () => {
      const user = userEvent.setup()
      render(<HeroSection {...defaultProps} />)
      
      await user.click(screen.getByText('Lagos'))
      
      expect(mockPush).toHaveBeenCalledWith('/search?city=Lagos')
    })

    it('shows destination images', () => {
      render(<HeroSection {...defaultProps} />)
      
      const destinationImages = screen.getAllByRole('img', { name: /destination/i })
      expect(destinationImages.length).toBeGreaterThan(0)
      
      destinationImages.forEach(img => {
        expect(img).toHaveAttribute('src')
        expect(img).toHaveAttribute('alt')
      })
    })
  })

  describe('Responsive Design', () => {
    it('adapts layout for mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      
      render(<HeroSection {...defaultProps} />)
      
      const heroSection = screen.getByTestId('hero-section')
      expect(heroSection).toHaveClass('mobile-layout')
    })

    it('shows mobile-optimized search', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      
      render(<HeroSection {...defaultProps} />)
      
      const searchContainer = screen.getByTestId('search-container')
      expect(searchContainer).toHaveClass('mobile-search')
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<HeroSection {...defaultProps} />)
      
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toBeInTheDocument()
      
      const h2Elements = screen.getAllByRole('heading', { level: 2 })
      expect(h2Elements.length).toBeGreaterThan(0)
    })

    it('has proper ARIA labels', () => {
      render(<HeroSection {...defaultProps} />)
      
      const searchInput = screen.getByRole('searchbox')
      expect(searchInput).toHaveAttribute('aria-label', 'Search packages')
      
      const searchButton = screen.getByRole('button', { name: /search/i })
      expect(searchButton).toHaveAttribute('aria-label', 'Search')
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<HeroSection {...defaultProps} />)
      
      // Tab through interactive elements
      await user.tab()
      expect(screen.getByRole('searchbox')).toHaveFocus()
      
      await user.tab()
      expect(screen.getByRole('button', { name: /search/i })).toHaveFocus()
      
      await user.tab()
      expect(screen.getByRole('button', { name: /explore events/i })).toHaveFocus()
    })

    it('has proper alt text for images', () => {
      render(<HeroSection {...defaultProps} />)
      
      const images = screen.getAllByRole('img')
      images.forEach(img => {
        const alt = img.getAttribute('alt')
        expect(alt).toBeTruthy()
        expect(alt?.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Performance', () => {
    it('lazy loads background image', () => {
      render(<HeroSection {...defaultProps} />)
      
      const heroSection = screen.getByTestId('hero-section')
      expect(heroSection).toHaveAttribute('data-bg-lazy', 'true')
    })

    it('preloads critical images', () => {
      render(<HeroSection {...defaultProps} />)
      
      const preloadLinks = document.querySelectorAll('link[rel="preload"]')
      const imagePreloads = Array.from(preloadLinks).filter(link => 
        link.getAttribute('as') === 'image'
      )
      
      expect(imagePreloads.length).toBeGreaterThan(0)
    })
  })

  describe('Error Handling', () => {
    it('handles search API errors gracefully', async () => {
      const user = userEvent.setup()
      mockSearchAPI.getSuggestions.mockRejectedValue(new Error('API Error'))
      
      render(<HeroSection {...defaultProps} />)
      
      const searchInput = screen.getByPlaceholderText(/search for events/i)
      await user.type(searchInput, 'Lagos')
      
      // Should not show error to user, just fail silently
      await waitFor(() => {
        expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
      })
    })

    it('handles empty search gracefully', async () => {
      const user = userEvent.setup()
      render(<HeroSection {...defaultProps} />)
      
      const searchButton = screen.getByRole('button', { name: /search/i })
      await user.click(searchButton)
      
      // Should not navigate with empty search
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('Analytics', () => {
    it('tracks search interactions', async () => {
      const user = userEvent.setup()
      const mockAnalytics = jest.fn()
      
      // Mock analytics
      window.gtag = mockAnalytics
      
      render(<HeroSection {...defaultProps} />)
      
      const searchInput = screen.getByPlaceholderText(/search for events/i)
      await user.type(searchInput, 'Lagos events')
      await user.press('Enter')
      
      expect(mockAnalytics).toHaveBeenCalledWith('event', 'search', {
        search_term: 'Lagos events',
        source: 'hero_section',
      })
    })

    it('tracks CTA button clicks', async () => {
      const user = userEvent.setup()
      const mockAnalytics = jest.fn()
      
      window.gtag = mockAnalytics
      
      render(<HeroSection {...defaultProps} />)
      
      await user.click(screen.getByRole('button', { name: /explore events/i }))
      
      expect(mockAnalytics).toHaveBeenCalledWith('event', 'cta_click', {
        cta_type: 'explore_events',
        source: 'hero_section',
      })
    })
  })
})
