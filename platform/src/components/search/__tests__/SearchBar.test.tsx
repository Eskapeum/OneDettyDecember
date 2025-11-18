/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from '../SearchBar'

// Mock search API
const mockSearchAPI = {
  search: jest.fn(),
  getSuggestions: jest.fn(),
}

jest.mock('@/lib/api/search', () => ({
  searchAPI: mockSearchAPI,
}))

// Mock router
const mockPush = jest.fn()
const mockQuery = {}
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    query: mockQuery,
  }),
  useSearchParams: () => new URLSearchParams(),
}))

describe('SearchBar Component', () => {
  const defaultProps = {
    placeholder: 'Search for events, stays, experiences...',
    onSearch: jest.fn(),
    showSuggestions: true,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders search input with placeholder', () => {
      render(<SearchBar {...defaultProps} />)
      
      const searchInput = screen.getByPlaceholderText(/search for events/i)
      expect(searchInput).toBeInTheDocument()
      expect(searchInput).toHaveAttribute('type', 'text')
    })

    it('renders search button', () => {
      render(<SearchBar {...defaultProps} />)
      
      const searchButton = screen.getByRole('button', { name: /search/i })
      expect(searchButton).toBeInTheDocument()
    })

    it('renders with custom placeholder', () => {
      render(<SearchBar {...defaultProps} placeholder="Find your adventure" />)
      
      expect(screen.getByPlaceholderText('Find your adventure')).toBeInTheDocument()
    })

    it('renders search icon', () => {
      render(<SearchBar {...defaultProps} />)
      
      const searchIcon = screen.getByTestId('search-icon')
      expect(searchIcon).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('handles text input correctly', async () => {
      const user = userEvent.setup()
      render(<SearchBar {...defaultProps} />)
      
      const searchInput = screen.getByPlaceholderText(/search for events/i)
      await user.type(searchInput, 'Lagos events')
      
      expect(searchInput).toHaveValue('Lagos events')
    })

    it('calls onSearch when search button is clicked', async () => {
      const user = userEvent.setup()
      const onSearch = jest.fn()
      render(<SearchBar {...defaultProps} onSearch={onSearch} />)
      
      const searchInput = screen.getByPlaceholderText(/search for events/i)
      const searchButton = screen.getByRole('button', { name: /search/i })
      
      await user.type(searchInput, 'beach party')
      await user.click(searchButton)
      
      expect(onSearch).toHaveBeenCalledWith('beach party')
    })

    it('calls onSearch when Enter key is pressed', async () => {
      const user = userEvent.setup()
      const onSearch = jest.fn()
      render(<SearchBar {...defaultProps} onSearch={onSearch} />)
      
      const searchInput = screen.getByPlaceholderText(/search for events/i)
      await user.type(searchInput, 'concert{enter}')
      
      expect(onSearch).toHaveBeenCalledWith('concert')
    })

    it('clears input when clear button is clicked', async () => {
      const user = userEvent.setup()
      render(<SearchBar {...defaultProps} />)
      
      const searchInput = screen.getByPlaceholderText(/search for events/i)
      await user.type(searchInput, 'test query')
      
      const clearButton = screen.getByRole('button', { name: /clear/i })
      await user.click(clearButton)
      
      expect(searchInput).toHaveValue('')
    })
  })

  describe('Autocomplete Functionality', () => {
    it('shows suggestions when typing', async () => {
      const user = userEvent.setup()
      mockSearchAPI.getSuggestions.mockResolvedValue([
        { id: '1', text: 'Lagos Beach Party', type: 'event' },
        { id: '2', text: 'Lagos Hotels', type: 'stay' },
        { id: '3', text: 'Lagos Tours', type: 'experience' },
      ])
      
      render(<SearchBar {...defaultProps} />)
      
      const searchInput = screen.getByPlaceholderText(/search for events/i)
      await user.type(searchInput, 'Lagos')
      
      await waitFor(() => {
        expect(screen.getByText('Lagos Beach Party')).toBeInTheDocument()
        expect(screen.getByText('Lagos Hotels')).toBeInTheDocument()
        expect(screen.getByText('Lagos Tours')).toBeInTheDocument()
      })
    })

    it('selects suggestion when clicked', async () => {
      const user = userEvent.setup()
      const onSearch = jest.fn()
      mockSearchAPI.getSuggestions.mockResolvedValue([
        { id: '1', text: 'Lagos Beach Party', type: 'event' },
      ])
      
      render(<SearchBar {...defaultProps} onSearch={onSearch} />)
      
      const searchInput = screen.getByPlaceholderText(/search for events/i)
      await user.type(searchInput, 'Lagos')
      
      await waitFor(() => {
        expect(screen.getByText('Lagos Beach Party')).toBeInTheDocument()
      })
      
      await user.click(screen.getByText('Lagos Beach Party'))
      
      expect(searchInput).toHaveValue('Lagos Beach Party')
      expect(onSearch).toHaveBeenCalledWith('Lagos Beach Party')
    })

    it('navigates suggestions with keyboard', async () => {
      const user = userEvent.setup()
      mockSearchAPI.getSuggestions.mockResolvedValue([
        { id: '1', text: 'Lagos Beach Party', type: 'event' },
        { id: '2', text: 'Lagos Hotels', type: 'stay' },
      ])
      
      render(<SearchBar {...defaultProps} />)
      
      const searchInput = screen.getByPlaceholderText(/search for events/i)
      await user.type(searchInput, 'Lagos')
      
      await waitFor(() => {
        expect(screen.getByText('Lagos Beach Party')).toBeInTheDocument()
      })
      
      // Navigate down
      await user.keyboard('{ArrowDown}')
      expect(screen.getByText('Lagos Beach Party')).toHaveClass('highlighted')
      
      // Navigate down again
      await user.keyboard('{ArrowDown}')
      expect(screen.getByText('Lagos Hotels')).toHaveClass('highlighted')
      
      // Navigate up
      await user.keyboard('{ArrowUp}')
      expect(screen.getByText('Lagos Beach Party')).toHaveClass('highlighted')
    })

    it('hides suggestions when clicking outside', async () => {
      const user = userEvent.setup()
      mockSearchAPI.getSuggestions.mockResolvedValue([
        { id: '1', text: 'Lagos Beach Party', type: 'event' },
      ])
      
      render(
        <div>
          <SearchBar {...defaultProps} />
          <div data-testid="outside">Outside element</div>
        </div>
      )
      
      const searchInput = screen.getByPlaceholderText(/search for events/i)
      await user.type(searchInput, 'Lagos')
      
      await waitFor(() => {
        expect(screen.getByText('Lagos Beach Party')).toBeInTheDocument()
      })
      
      await user.click(screen.getByTestId('outside'))
      
      await waitFor(() => {
        expect(screen.queryByText('Lagos Beach Party')).not.toBeInTheDocument()
      })
    })

    it('debounces API calls for suggestions', async () => {
      const user = userEvent.setup()
      mockSearchAPI.getSuggestions.mockResolvedValue([])
      
      render(<SearchBar {...defaultProps} />)
      
      const searchInput = screen.getByPlaceholderText(/search for events/i)
      
      // Type quickly
      await user.type(searchInput, 'L')
      await user.type(searchInput, 'a')
      await user.type(searchInput, 'g')
      await user.type(searchInput, 'o')
      await user.type(searchInput, 's')
      
      // Should only call API once after debounce
      await waitFor(() => {
        expect(mockSearchAPI.getSuggestions).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Loading States', () => {
    it('shows loading indicator when searching', async () => {
      const user = userEvent.setup()
      const onSearch = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
      
      render(<SearchBar {...defaultProps} onSearch={onSearch} />)
      
      const searchInput = screen.getByPlaceholderText(/search for events/i)
      const searchButton = screen.getByRole('button', { name: /search/i })
      
      await user.type(searchInput, 'test')
      await user.click(searchButton)
      
      expect(screen.getByTestId('search-loading')).toBeInTheDocument()
    })

    it('shows loading indicator when fetching suggestions', async () => {
      const user = userEvent.setup()
      mockSearchAPI.getSuggestions.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
      
      render(<SearchBar {...defaultProps} />)
      
      const searchInput = screen.getByPlaceholderText(/search for events/i)
      await user.type(searchInput, 'Lagos')
      
      expect(screen.getByTestId('suggestions-loading')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('handles suggestion API errors gracefully', async () => {
      const user = userEvent.setup()
      mockSearchAPI.getSuggestions.mockRejectedValue(new Error('API Error'))
      
      render(<SearchBar {...defaultProps} />)
      
      const searchInput = screen.getByPlaceholderText(/search for events/i)
      await user.type(searchInput, 'Lagos')
      
      await waitFor(() => {
        expect(screen.queryByText('Lagos Beach Party')).not.toBeInTheDocument()
      })
      
      // Should not show error to user, just fail silently
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<SearchBar {...defaultProps} />)
      
      const searchInput = screen.getByRole('searchbox')
      expect(searchInput).toHaveAttribute('aria-label', 'Search packages')
      
      const searchButton = screen.getByRole('button', { name: /search/i })
      expect(searchButton).toHaveAttribute('aria-label', 'Search')
    })

    it('has proper ARIA attributes for suggestions', async () => {
      const user = userEvent.setup()
      mockSearchAPI.getSuggestions.mockResolvedValue([
        { id: '1', text: 'Lagos Beach Party', type: 'event' },
      ])
      
      render(<SearchBar {...defaultProps} />)
      
      const searchInput = screen.getByRole('searchbox')
      await user.type(searchInput, 'Lagos')
      
      await waitFor(() => {
        expect(searchInput).toHaveAttribute('aria-expanded', 'true')
        expect(searchInput).toHaveAttribute('aria-autocomplete', 'list')
        
        const suggestionsList = screen.getByRole('listbox')
        expect(suggestionsList).toBeInTheDocument()
        
        const suggestion = screen.getByRole('option')
        expect(suggestion).toHaveAttribute('aria-selected', 'false')
      })
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<SearchBar {...defaultProps} />)
      
      // Tab to search input
      await user.tab()
      expect(screen.getByRole('searchbox')).toHaveFocus()
      
      // Tab to search button
      await user.tab()
      expect(screen.getByRole('button', { name: /search/i })).toHaveFocus()
    })
  })
})
