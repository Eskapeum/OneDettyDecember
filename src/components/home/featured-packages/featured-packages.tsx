import * as React from 'react'
import { cn } from '@/lib/utils'
import type { VerticalTheme } from '@/types/vertical'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface Package {
  id: string
  title: string
  description: string
  price: number
  currency?: string
  image: string
  vertical: VerticalTheme
  rating?: number
  reviewCount?: number
  location?: string
  tags?: string[]
  availability?: 'available' | 'limited' | 'sold-out'
}

export interface FeaturedPackagesProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Section title
   */
  title?: string
  /**
   * Section subtitle
   */
  subtitle?: string
  /**
   * Array of packages to display
   */
  packages: Package[]
  /**
   * Maximum number of packages to show
   */
  limit?: number
  /**
   * Filter by vertical (shows only packages from this vertical)
   */
  filterVertical?: VerticalTheme
  /**
   * Grid columns (responsive)
   */
  columns?: 2 | 3 | 4
  /**
   * Show "View All" button
   */
  showViewAll?: boolean
  /**
   * "View All" button click handler
   */
  onViewAllClick?: () => void
  /**
   * Package card click handler
   */
  onPackageClick?: (pkg: Package) => void
}

const FeaturedPackages = React.forwardRef<HTMLDivElement, FeaturedPackagesProps>(
  (
    {
      className,
      title = 'Featured Packages',
      subtitle,
      packages,
      limit,
      filterVertical,
      columns = 3,
      showViewAll = true,
      onViewAllClick,
      onPackageClick,
      ...props
    },
    ref
  ) => {
    // Filter and limit packages
    let displayPackages = filterVertical
      ? packages.filter((pkg) => pkg.vertical === filterVertical)
      : packages

    if (limit) {
      displayPackages = displayPackages.slice(0, limit)
    }

    const gridColsClass = {
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    }[columns]

    const formatPrice = (price: number, currency = 'NGN') => {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
      }).format(price)
    }

    return (
      <div ref={ref} className={cn('py-12 md:py-16', className)} {...props}>
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">{title}</h2>
            {subtitle && (
              <p className="text-muted-foreground text-lg">{subtitle}</p>
            )}
          </div>

          {/* Packages Grid */}
          <div className={cn('grid gap-6', gridColsClass)}>
            {displayPackages.map((pkg) => (
              <Card
                key={pkg.id}
                hoverable
                vertical={pkg.vertical}
                className="group cursor-pointer overflow-hidden"
                onClick={() => onPackageClick?.(pkg)}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Availability Badge */}
                  {pkg.availability && pkg.availability !== 'available' && (
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant={pkg.availability === 'sold-out' ? 'destructive' : 'default'}
                      >
                        {pkg.availability === 'sold-out' ? 'Sold Out' : 'Limited'}
                      </Badge>
                    </div>
                  )}
                  {/* Vertical Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge vertical={pkg.vertical}>
                      {pkg.vertical.charAt(0).toUpperCase() + pkg.vertical.slice(1)}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Title */}
                  <h3 className="font-semibold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                    {pkg.title}
                  </h3>

                  {/* Location */}
                  {pkg.location && (
                    <p className="text-sm text-muted-foreground mb-2">
                      📍 {pkg.location}
                    </p>
                  )}

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {pkg.description}
                  </p>

                  {/* Tags */}
                  {pkg.tags && pkg.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {pkg.tags.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Footer: Rating & Price */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    {/* Rating */}
                    {pkg.rating && (
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{pkg.rating.toFixed(1)}</span>
                        {pkg.reviewCount && (
                          <span className="text-muted-foreground">
                            ({pkg.reviewCount})
                          </span>
                        )}
                      </div>
                    )}
                    {/* Price */}
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        {formatPrice(pkg.price, pkg.currency)}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {displayPackages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No packages found</p>
            </div>
          )}

          {/* View All Button */}
          {showViewAll && displayPackages.length > 0 && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={onViewAllClick}
              >
                View All Packages
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }
)
FeaturedPackages.displayName = 'FeaturedPackages'

export { FeaturedPackages }
