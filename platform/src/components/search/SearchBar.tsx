// Mock implementation for SearchBar component
// This will be replaced with actual implementation

import React from 'react'

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  showSuggestions?: boolean
  loading?: boolean
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch,
  showSuggestions = true,
  loading = false,
}) => {
  const [query, setQuery] = React.useState('')
  const [suggestions, setSuggestions] = React.useState<any[]>([])
  const [showSuggestionsList, setShowSuggestionsList] = React.useState(false)
  const [suggestionsLoading, setSuggestionsLoading] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (value.length > 0 && showSuggestions) {
      setShowSuggestionsList(true)
      setSuggestionsLoading(true)

      // Mock suggestions for testing
      if (value === 'Lagos') {
        setTimeout(() => {
          setSuggestions([
            { id: '1', text: 'Lagos Beach Party', type: 'package' },
            { id: '2', text: 'Lagos Hotels', type: 'category' },
            { id: '3', text: 'Lagos Tours', type: 'package' },
          ])
          setSuggestionsLoading(false)
        }, 100)
      } else {
        setSuggestions([])
        setSuggestionsLoading(false)
      }
    } else {
      setShowSuggestionsList(false)
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (suggestion: any) => {
    setQuery(suggestion.text)
    setShowSuggestionsList(false)
    onSearch?.(suggestion.text)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div data-testid="search-icon">🔍</div>
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          role="searchbox"
          aria-label="Search packages"
          aria-expanded={showSuggestionsList}
          aria-autocomplete="list"
          aria-owns={showSuggestionsList ? 'suggestions-list' : undefined}
        />
        <button type="submit" aria-label="Search" disabled={loading}>
          {loading ? <div data-testid="search-loading">Loading...</div> : 'Search'}
        </button>
        <button type="button" aria-label="Clear" onClick={() => setQuery('')}>
          Clear
        </button>
      </form>

      {showSuggestionsList && (
        <div>
          {suggestionsLoading && <div data-testid="suggestions-loading">Loading suggestions...</div>}
          {suggestions.length > 0 && (
            <ul id="suggestions-list" role="listbox" aria-label="Search suggestions">
              {suggestions.map((suggestion, index) => (
                <li
                  key={suggestion.id}
                  role="option"
                  aria-selected={false}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={index === 0 ? 'highlighted' : ''}
                >
                  {suggestion.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar
