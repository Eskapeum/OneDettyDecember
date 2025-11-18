import type { Meta, StoryObj } from '@storybook/react'
import { SearchBar, type SearchSuggestion } from './search-bar'
import { useState } from 'react'

const sampleSuggestions: SearchSuggestion[] = [
  { id: '1', text: 'Beach villa in Lekki', type: 'package', vertical: 'stays' },
  { id: '2', text: 'Afronation Festival', type: 'package', vertical: 'events' },
  { id: '3', text: 'Island hopping tour', type: 'package', vertical: 'experiences' },
  { id: '4', text: 'Lagos, Nigeria', type: 'location' },
  { id: '5', text: 'Ikoyi, Lagos', type: 'location' },
  { id: '6', text: 'Lekki Phase 1', type: 'location' },
  { id: '7', text: 'Luxury cars', type: 'category', vertical: 'cars' },
  { id: '8', text: 'December fashion', type: 'category', vertical: 'marketplace' },
  { id: '9', text: 'Networking events', type: 'category', vertical: 'community' },
  { id: '10', text: 'New Year\'s Eve', type: 'recent' },
]

const meta: Meta<typeof SearchBar> = {
  title: 'Search/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'full'],
      description: 'Search bar width',
    },
    vertical: {
      control: 'select',
      options: [undefined, 'stays', 'events', 'experiences', 'cars', 'marketplace', 'community'],
      description: 'Vertical theme for focus ring',
    },
  },
}

export default meta
type Story = StoryObj<typeof SearchBar>

// Default
export const Default: Story = {
  args: {},
}

// With Placeholder
export const WithPlaceholder: Story = {
  args: {
    placeholder: 'What are you looking for?',
  },
}

// Sizes
export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Search...',
  },
}

export const Medium: Story = {
  args: {
    size: 'md',
    placeholder: 'Search packages...',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Search for packages, events, experiences...',
  },
}

export const FullWidth: Story = {
  args: {
    size: 'full',
    placeholder: 'Search across all categories...',
  },
}

// Without Buttons
export const NoSearchButton: Story = {
  args: {
    showSearchButton: false,
    placeholder: 'Press Enter to search...',
  },
}

export const NoFilterButton: Story = {
  args: {
    showFilterButton: false,
  },
}

export const MinimalNoButtons: Story = {
  args: {
    showSearchButton: false,
    showFilterButton: false,
    placeholder: 'Minimal search bar...',
  },
}

// Loading State
export const Loading: Story = {
  args: {
    loading: true,
    value: 'Searching...',
  },
}

// With Suggestions
export const WithSuggestions: Story = {
  args: {
    suggestions: sampleSuggestions,
    showSuggestions: true,
  },
}

// Vertical Themes
export const StaysTheme: Story = {
  args: {
    vertical: 'stays',
    placeholder: 'Search for stays...',
  },
}

export const EventsTheme: Story = {
  args: {
    vertical: 'events',
    placeholder: 'Search for events...',
  },
}

export const ExperiencesTheme: Story = {
  args: {
    vertical: 'experiences',
    placeholder: 'Search for experiences...',
  },
}

export const CarsTheme: Story = {
  args: {
    vertical: 'cars',
    placeholder: 'Search for cars...',
  },
}

export const MarketplaceTheme: Story = {
  args: {
    vertical: 'marketplace',
    placeholder: 'Search marketplace...',
  },
}

export const CommunityTheme: Story = {
  args: {
    vertical: 'community',
    placeholder: 'Search community...',
  },
}

// Interactive Example
export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)

    const filteredSuggestions = sampleSuggestions.filter((s) =>
      s.text.toLowerCase().includes(value.toLowerCase())
    )

    return (
      <div className="space-y-4">
        <SearchBar
          value={value}
          onValueChange={(v) => {
            setValue(v)
            setShowSuggestions(v.length > 0)
          }}
          onSearch={(v) => {
            alert(`Searching for: ${v}`)
            setShowSuggestions(false)
          }}
          onFilterClick={() => alert('Filter clicked!')}
          suggestions={filteredSuggestions}
          showSuggestions={showSuggestions}
          onSuggestionClick={(s) => {
            alert(`Selected: ${s.text}`)
            setShowSuggestions(false)
          }}
        />
        <div className="text-sm text-muted-foreground">
          Current value: <code className="bg-muted px-2 py-1 rounded">{value || '(empty)'}</code>
        </div>
      </div>
    )
  },
}

// With Event Handlers
export const WithHandlers: Story = {
  args: {
    placeholder: 'Try typing or clicking buttons...',
    suggestions: sampleSuggestions.slice(0, 5),
    showSuggestions: true,
    onSearch: (value) => alert(`Search: ${value}`),
    onFilterClick: () => alert('Filter button clicked!'),
    onSuggestionClick: (s) => alert(`Suggestion clicked: ${s.text}`),
  },
}

// Real-world Example: Homepage
export const Homepage: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)

    return (
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-12 rounded-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4 text-center">
            Find Your Perfect December Experience
          </h1>
          <SearchBar
            size="full"
            value={value}
            onValueChange={(v) => {
              setValue(v)
              setShowSuggestions(v.length > 0)
            }}
            onSearch={(v) => {
              console.log('Searching:', v)
              setShowSuggestions(false)
            }}
            suggestions={sampleSuggestions.filter((s) =>
              s.text.toLowerCase().includes(value.toLowerCase())
            )}
            showSuggestions={showSuggestions}
            onSuggestionClick={(s) => {
              setValue(s.text)
              setShowSuggestions(false)
            }}
          />
        </div>
      </div>
    )
  },
}

// Real-world Example: Search Page
export const SearchPage: Story = {
  render: () => {
    const [value, setValue] = useState('Lagos beach')
    const [loading, setLoading] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)

    const handleSearch = (v: string) => {
      setLoading(true)
      setShowSuggestions(false)
      setTimeout(() => {
        setLoading(false)
        alert(`Results for: ${v}`)
      }, 1500)
    }

    return (
      <div className="max-w-4xl mx-auto p-4">
        <SearchBar
          size="full"
          value={value}
          onValueChange={(v) => {
            setValue(v)
            setShowSuggestions(v.length > 0)
          }}
          onSearch={handleSearch}
          onFilterClick={() => alert('Open filters')}
          suggestions={sampleSuggestions}
          showSuggestions={showSuggestions}
          loading={loading}
        />

        {loading && (
          <div className="mt-8 text-center text-muted-foreground">
            Searching...
          </div>
        )}
      </div>
    )
  },
}
