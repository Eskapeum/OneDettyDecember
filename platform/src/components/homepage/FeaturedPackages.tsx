// Mock implementation for FeaturedPackages component
// This will be replaced with actual implementation

import React from 'react'

interface Package {
  id: string
  title: string
  description: string
  price: number
  currency: string
  type: string
  location: string
  images: string[]
  vendor: { businessName: string }
  rating: number
  reviewCount: number
}

interface FeaturedPackagesProps {
  title: string
  subtitle: string
  packages: Package[]
  loading: boolean
  error?: string | null
  onRetry?: () => void
  onFavorite?: (packageId: string) => void
}

export const FeaturedPackages: React.FC<FeaturedPackagesProps> = ({
  title,
  subtitle,
  packages,
  loading,
  error,
  onRetry,
  onFavorite,
}) => {
  if (loading) {
    return (
      <section data-testid="featured-packages-loading">
        <div data-testid="loading-spinner">Loading...</div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} data-testid="package-card-skeleton">Loading package...</div>
        ))}
      </section>
    )
  }

  if (error) {
    return (
      <section>
        <div>Failed to load packages</div>
        <div>{error}</div>
        <button onClick={onRetry}>Try again</button>
      </section>
    )
  }

  if (packages.length === 0) {
    return (
      <section>
        <div>No featured packages available</div>
        <div>Check back soon</div>
        <button>Browse all packages</button>
      </section>
    )
  }

  const handlePackageClick = (packageId: string) => {
    console.log(`Navigate to /packages/${packageId}`)
  }

  const handleShare = async (pkg: Package) => {
    if (navigator.share) {
      await navigator.share({
        title: pkg.title,
        text: pkg.description,
        url: `/packages/${pkg.id}`,
      })
    }
  }

  return (
    <section role="region" aria-label="Featured Packages">
      <h2>{title}</h2>
      <p>{subtitle}</p>

      <div data-testid="packages-grid" className="mobile-grid">
        <div data-testid="packages-carousel" className="scrolled swiped">
          {packages.map((pkg, index) => (
            <article
              key={pkg.id}
              data-testid={`package-card-${pkg.id}`}
              onClick={() => handlePackageClick(pkg.id)}
            >
              <img
                src={pkg.images[0]}
                alt={pkg.title}
                loading={index < 2 ? 'eager' : 'lazy'}
              />
              <h3>{pkg.title}</h3>
              <p>{pkg.description}</p>
              <div>₦{pkg.price.toLocaleString()}</div>
              <div>{pkg.location}</div>
              <div>{pkg.vendor.businessName}</div>
              <div>{pkg.rating}</div>
              <div>({pkg.reviewCount} reviews)</div>
              <div>{pkg.type === 'EVENT' ? 'Event' : pkg.type === 'STAY' ? 'Stay' : 'Experience'}</div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onFavorite?.(pkg.id)
                }}
                aria-label="Add to favorites"
              >
                Add to favorites
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleShare(pkg)
                }}
                aria-label="Share"
              >
                Share
              </button>
            </article>
          ))}
        </div>
      </div>

      {packages.length > 6 && (
        <div>
          <button aria-label="Previous packages">Previous</button>
          <button aria-label="Next packages">Next</button>
        </div>
      )}

      <div data-testid="package-quick-view" style={{ display: 'none' }}>
        Quick view content
      </div>

      <div aria-live="polite">Featured packages loaded</div>
    </section>
  )
}

export default FeaturedPackages
