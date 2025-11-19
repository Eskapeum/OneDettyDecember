import * as React from 'react'
import { cn } from '@/lib/utils'
import type { VerticalTheme } from '@/types/vertical'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'

export interface PackageDetailData {
  id: string
  title: string
  description: string
  price: number
  currency?: string
  location: string
  vertical: VerticalTheme
  rating?: number
  reviewCount?: number
  images: string[]
  highlights?: string[]
  amenities?: Array<{
    icon: string
    label: string
  }>
  host?: {
    name: string
    avatar?: string
    verified?: boolean
    joinedDate?: string
    responseRate?: number
    responseTime?: string
  }
  policies?: {
    cancellation?: string
    checkIn?: string
    checkOut?: string
    rules?: string[]
  }
}

export interface PackageDetailProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Package data
   */
  package: PackageDetailData
  /**
   * Show booking sidebar
   */
  showBookingSidebar?: boolean
  /**
   * Booking sidebar content (custom component)
   */
  bookingSidebar?: React.ReactNode
  /**
   * Reviews component (custom)
   */
  reviewsSection?: React.ReactNode
  /**
   * Related packages component (custom)
   */
  relatedPackages?: React.ReactNode
  /**
   * Image gallery component (custom)
   */
  imageGallery?: React.ReactNode
  /**
   * Book now click handler
   */
  onBookNow?: () => void
  /**
   * Contact host click handler
   */
  onContactHost?: () => void
  /**
   * Share click handler
   */
  onShare?: () => void
  /**
   * Save/favorite click handler
   */
  onSave?: () => void
}

const PackageDetail = React.forwardRef<HTMLDivElement, PackageDetailProps>(
  (
    {
      className,
      package: pkg,
      showBookingSidebar = true,
      bookingSidebar,
      reviewsSection,
      relatedPackages,
      imageGallery,
      onBookNow,
      onContactHost,
      onShare,
      onSave,
      ...props
    },
    ref
  ) => {
    const formatPrice = (price: number, currency = 'NGN') => {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
      }).format(price)
    }

    return (
      <div ref={ref} className={cn('pb-12', className)} {...props}>
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <a href="/" className="hover:text-foreground transition-colors">
              Home
            </a>
            <span>/</span>
            <a href="/packages" className="hover:text-foreground transition-colors">
              Packages
            </a>
            <span>/</span>
            <span className="capitalize">{pkg.vertical}</span>
            <span>/</span>
            <span className="text-foreground truncate max-w-[200px]">{pkg.title}</span>
          </nav>
        </div>

        {/* Header */}
        <div className="container mx-auto px-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge vertical={pkg.vertical}>
                  {pkg.vertical.charAt(0).toUpperCase() + pkg.vertical.slice(1)}
                </Badge>
                {pkg.host?.verified && (
                  <Badge variant="outline" className="gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verified
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{pkg.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  {pkg.rating && (
                    <>
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold">{pkg.rating.toFixed(1)}</span>
                    </>
                  )}
                  {pkg.reviewCount && (
                    <span className="text-muted-foreground">
                      ({pkg.reviewCount} {pkg.reviewCount === 1 ? 'review' : 'reviews'})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  <span>{pkg.location}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={onShare}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </Button>
              <Button variant="ghost" size="icon" onClick={onSave}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          {imageGallery || (
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-4 gap-2 rounded-lg overflow-hidden h-[400px]">
                <div className="col-span-4 md:col-span-2 row-span-2">
                  <img
                    src={pkg.images[0]}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {pkg.images.slice(1, 5).map((image, idx) => (
                  <div key={idx} className="hidden md:block col-span-1">
                    <img src={image} alt={`${pkg.title} ${idx + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <section>
                <h2 className="text-2xl font-bold mb-4">About this package</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {pkg.description}
                </p>
              </section>

              {/* Highlights */}
              {pkg.highlights && pkg.highlights.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-4">Highlights</h2>
                  <ul className="space-y-2">
                    {pkg.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Amenities */}
              {pkg.amenities && pkg.amenities.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-4">What's included</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {pkg.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-2xl">{amenity.icon}</span>
                        <span className="text-sm">{amenity.label}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Host Info */}
              {pkg.host && (
                <section>
                  <h2 className="text-2xl font-bold mb-4">Hosted by {pkg.host.name}</h2>
                  <Card className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar
                        src={pkg.host.avatar}
                        alt={pkg.host.name}
                        initials={pkg.host.name.substring(0, 2).toUpperCase()}
                        size="lg"
                        vertical={pkg.vertical}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{pkg.host.name}</h3>
                          {pkg.host.verified && (
                            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        {pkg.host.joinedDate && (
                          <p className="text-sm text-muted-foreground mb-3">
                            Joined {pkg.host.joinedDate}
                          </p>
                        )}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {pkg.host.responseRate && (
                            <div>
                              <div className="font-semibold">{pkg.host.responseRate}%</div>
                              <div className="text-muted-foreground">Response rate</div>
                            </div>
                          )}
                          {pkg.host.responseTime && (
                            <div>
                              <div className="font-semibold">{pkg.host.responseTime}</div>
                              <div className="text-muted-foreground">Response time</div>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={onContactHost}
                        >
                          Contact Host
                        </Button>
                      </div>
                    </div>
                  </Card>
                </section>
              )}

              {/* Policies */}
              {pkg.policies && (
                <section>
                  <h2 className="text-2xl font-bold mb-4">Policies</h2>
                  <div className="space-y-4">
                    {pkg.policies.checkIn && (
                      <div>
                        <h3 className="font-semibold mb-1">Check-in</h3>
                        <p className="text-muted-foreground">{pkg.policies.checkIn}</p>
                      </div>
                    )}
                    {pkg.policies.checkOut && (
                      <div>
                        <h3 className="font-semibold mb-1">Check-out</h3>
                        <p className="text-muted-foreground">{pkg.policies.checkOut}</p>
                      </div>
                    )}
                    {pkg.policies.cancellation && (
                      <div>
                        <h3 className="font-semibold mb-1">Cancellation</h3>
                        <p className="text-muted-foreground">{pkg.policies.cancellation}</p>
                      </div>
                    )}
                    {pkg.policies.rules && pkg.policies.rules.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-1">House rules</h3>
                        <ul className="space-y-1">
                          {pkg.policies.rules.map((rule, idx) => (
                            <li key={idx} className="text-muted-foreground">• {rule}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Reviews */}
              {reviewsSection}

              {/* Related Packages */}
              {relatedPackages}
            </div>

            {/* Right Column - Booking Sidebar */}
            {showBookingSidebar && (
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  {bookingSidebar || (
                    <Card className="p-6">
                      <div className="mb-4">
                        <div className="text-3xl font-bold">
                          {formatPrice(pkg.price, pkg.currency)}
                        </div>
                        <div className="text-sm text-muted-foreground">per booking</div>
                      </div>
                      <Button
                        size="lg"
                        className="w-full"
                        vertical={pkg.vertical}
                        onClick={onBookNow}
                      >
                        Book Now
                      </Button>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
)
PackageDetail.displayName = 'PackageDetail'

export { PackageDetail }
