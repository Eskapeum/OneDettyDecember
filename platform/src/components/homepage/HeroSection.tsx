// Mock implementation for HeroSection component
// This will be replaced with actual implementation

import React from 'react'

interface HeroSectionProps {
  title: string
  subtitle: string
  searchPlaceholder: string
  backgroundImage: string
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  searchPlaceholder,
  backgroundImage,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [showSuggestions, setShowSuggestions] = React.useState(false)

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Mock navigation
      console.log(`Navigate to /search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleCTAClick = (type: string) => {
    console.log(`Navigate to /search?type=${type}`)
  }

  const handleDestinationClick = (city: string) => {
    console.log(`Navigate to /search?city=${city}`)
  }

  return (
    <section
      data-testid="hero-section"
      className="mobile-layout"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      data-bg-lazy="true"
    >
      <h1>{title}</h1>
      <p>{subtitle}</p>

      <div data-testid="search-container" className="mobile-search">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setShowSuggestions(e.target.value.length > 0)
          }}
          onKeyPress={handleKeyPress}
          role="searchbox"
          aria-label="Search packages"
        />
        <button onClick={handleSearch} aria-label="Search">
          Search
        </button>

        {showSuggestions && searchQuery === 'Lagos' && (
          <div>
            <div onClick={() => setSearchQuery('Lagos events')}>Lagos events</div>
            <div onClick={() => setSearchQuery('Lagos hotels')}>Lagos hotels</div>
            <div onClick={() => setSearchQuery('Lagos Beach Party')}>Lagos Beach Party</div>
          </div>
        )}
      </div>

      <div>
        <button onClick={() => handleCTAClick('EVENT')}>Explore Events</button>
        <button onClick={() => handleCTAClick('STAY')}>Find Stays</button>
        <button onClick={() => handleCTAClick('EXPERIENCE')}>Discover Experiences</button>
      </div>

      <div>
        <h2>Popular Destinations</h2>
        <div onClick={() => handleDestinationClick('Lagos')}>
          <img src="/images/lagos.jpg" alt="Lagos destination" />
          Lagos
        </div>
        <div onClick={() => handleDestinationClick('Accra')}>
          <img src="/images/accra.jpg" alt="Accra destination" />
          Accra
        </div>
        <div onClick={() => handleDestinationClick('Abuja')}>
          <img src="/images/abuja.jpg" alt="Abuja destination" />
          Abuja
        </div>
      </div>
    </section>
  )
}

export default HeroSection
