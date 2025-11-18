import type { Meta, StoryObj } from '@storybook/react'
import { SearchResults, type FilterGroup } from './search-results'
import type { Package } from '@/components/home/featured-packages'
import { useState } from 'react'

// Sample results data
const sampleResults: Package[] = [
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
    availability: 'available',
  },
]

// Sample filter groups
const sampleFilterGroups: FilterGroup[] = [
  {
    id: 'vertical',
    label: 'Category',
    type: 'checkbox',
    options: [
      { id: 'stays', label: 'Stays', count: 45 },
      { id: 'events', label: 'Events', count: 32 },
      { id: 'experiences', label: 'Experiences', count: 28 },
      { id: 'cars', label: 'Cars', count: 15 },
      { id: 'marketplace', label: 'Marketplace', count: 67 },
      { id: 'community', label: 'Community', count: 23 },
    ],
  },
  {
    id: 'price',
    label: 'Price Range',
    type: 'range',
    min: 0,
    max: 1000000,
  },
  {
    id: 'location',
    label: 'Location',
    type: 'checkbox',
    options: [
      { id: 'lekki', label: 'Lekki', count: 34 },
      { id: 'vi', label: 'Victoria Island', count: 28 },
      { id: 'ikoyi', label: 'Ikoyi', count: 22 },
      { id: 'yaba', label: 'Yaba', count: 15 },
    ],
  },
  {
    id: 'rating',
    label: 'Minimum Rating',
    type: 'checkbox',
    options: [
      { id: '4.5', label: '4.5★ & up', count: 56 },
      { id: '4.0', label: '4.0★ & up', count: 89 },
      { id: '3.5', label: '3.5★ & up', count: 124 },
    ],
  },
]

const meta: Meta<typeof SearchResults> = {
  title: 'Search/SearchResults',
  component: SearchResults,
  tags: ['autodocs'],
  argTypes: {
    viewMode: {
      control: 'select',
      options: ['grid', 'list'],
      description: 'Results view mode',
    },
  },
}

export default meta
type Story = StoryObj<typeof SearchResults>

// Default
export const Default: Story = {
  args: {
    results: sampleResults,
    query: 'Lagos beach',
    totalResults: 42,
  },
}

// With Filters
export const WithFilters: Story = {
  args: {
    results: sampleResults,
    query: 'December packages',
    totalResults: 156,
    filterGroups: sampleFilterGroups,
    showFilters: true,
  },
}

// Grid View
export const GridView: Story = {
  args: {
    results: sampleResults,
    query: 'Luxury experiences',
    totalResults: 28,
    viewMode: 'grid',
  },
}

// List View
export const ListView: Story = {
  args: {
    results: sampleResults,
    query: 'Beach packages',
    totalResults: 18,
    viewMode: 'list',
  },
}

// Loading State
export const Loading: Story = {
  args: {
    results: [],
    query: 'Lagos events',
    loading: true,
  },
}

// Empty Results
export const EmptyResults: Story = {
  args: {
    results: [],
    query: 'Nonexistent package xyz',
    totalResults: 0,
  },
}

// No Filters
export const NoFilters: Story = {
  args: {
    results: sampleResults,
    query: 'All packages',
    showFilters: false,
  },
}

// With Pagination
export const WithPagination: Story = {
  args: {
    results: sampleResults,
    query: 'December',
    totalResults: 156,
    currentPage: 2,
    totalPages: 8,
  },
}

// Single Result
export const SingleResult: Story = {
  args: {
    results: [sampleResults[0]],
    query: 'Lekki beach villa',
    totalResults: 1,
  },
}

// Many Results
export const ManyResults: Story = {
  args: {
    results: [...sampleResults, ...sampleResults, ...sampleResults],
    query: 'Lagos',
    totalResults: 423,
    filterGroups: sampleFilterGroups,
  },
}

// Interactive Example
export const Interactive: Story = {
  render: () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [showFilters, setShowFilters] = useState(true)
    const [currentSort, setCurrentSort] = useState('relevance')
    const [currentPage, setCurrentPage] = useState(1)

    return (
      <SearchResults
        results={sampleResults}
        query="Lagos December packages"
        totalResults={156}
        filterGroups={sampleFilterGroups}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        currentSort={currentSort}
        onSortChange={setCurrentSort}
        currentPage={currentPage}
        totalPages={8}
        onPageChange={setCurrentPage}
        onPackageClick={(pkg) => alert(`Clicked: ${pkg.title}`)}
        onFilterChange={(groupId, value) => {
          console.log('Filter changed:', groupId, value)
        }}
      />
    )
  },
}

// Real-world Example: Search Page
export const SearchPage: Story = {
  render: () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [currentSort, setCurrentSort] = useState('relevance')
    const [loading, setLoading] = useState(false)

    const handleSortChange = (sortId: string) => {
      setLoading(true)
      setCurrentSort(sortId)
      setTimeout(() => setLoading(false), 800)
    }

    return (
      <div className="min-h-screen bg-background">
        <SearchResults
          results={loading ? [] : sampleResults}
          query="Beach packages in Lagos"
          totalResults={42}
          filterGroups={sampleFilterGroups}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          currentSort={currentSort}
          onSortChange={handleSortChange}
          loading={loading}
          onPackageClick={(pkg) => {
            alert(`Opening package: ${pkg.title}`)
          }}
        />
      </div>
    )
  },
}

// Filtered by Category
export const FilteredStays: Story = {
  args: {
    results: sampleResults.filter((r) => r.vertical === 'stays'),
    query: 'Luxury stays',
    totalResults: 45,
    filterGroups: sampleFilterGroups,
  },
}

export const FilteredEvents: Story = {
  args: {
    results: sampleResults.filter((r) => r.vertical === 'events'),
    query: 'December events',
    totalResults: 32,
    filterGroups: sampleFilterGroups,
  },
}
