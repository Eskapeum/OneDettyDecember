import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export interface Review {
  id: string
  author: {
    name: string
    avatar?: string
    location?: string
  }
  rating: number
  date: string
  comment: string
  helpful?: number
  images?: string[]
  response?: {
    author: string
    date: string
    comment: string
  }
}

export interface ReviewsSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Array of reviews
   */
  reviews: Review[]
  /**
   * Average rating
   */
  averageRating?: number
  /**
   * Total review count
   */
  totalReviews?: number
  /**
   * Rating breakdown (1-5 stars)
   */
  ratingBreakdown?: Record<number, number>
  /**
   * Maximum reviews to show initially
   */
  initialDisplayCount?: number
  /**
   * Show "Load More" button
   */
  showLoadMore?: boolean
  /**
   * Load more click handler
   */
  onLoadMore?: () => void
  /**
   * Write review click handler
   */
  onWriteReview?: () => void
  /**
   * Helpful click handler
   */
  onMarkHelpful?: (reviewId: string) => void
  /**
   * Review images click handler
   */
  onImageClick?: (imageUrl: string) => void
}

const ReviewsSection = React.forwardRef<HTMLDivElement, ReviewsSectionProps>(
  (
    {
      className,
      reviews,
      averageRating,
      totalReviews,
      ratingBreakdown,
      initialDisplayCount = 5,
      showLoadMore = true,
      onLoadMore,
      onWriteReview,
      onMarkHelpful,
      onImageClick,
      ...props
    },
    ref
  ) => {
    const [displayCount, setDisplayCount] = React.useState(initialDisplayCount)

    const displayedReviews = reviews.slice(0, displayCount)
    const hasMore = displayCount < reviews.length

    const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
      const sizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-xl',
      }

      return (
        <div className={cn('flex items-center gap-0.5', sizeClasses[size])}>
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={i < rating ? 'text-yellow-500' : 'text-gray-300'}
            >
              ★
            </span>
          ))}
        </div>
      )
    }

    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} ${Math.floor(diffDays / 7) === 1 ? 'week' : 'weeks'} ago`
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} ${Math.floor(diffDays / 30) === 1 ? 'month' : 'months'} ago`
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    }

    return (
      <section ref={ref} className={cn('space-y-6', className)} {...props}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">
              Reviews {totalReviews && `(${totalReviews})`}
            </h2>
            {averageRating && (
              <div className="flex items-center gap-2">
                {renderStars(Math.round(averageRating), 'lg')}
                <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
                <span className="text-muted-foreground">out of 5</span>
              </div>
            )}
          </div>
          {onWriteReview && (
            <Button onClick={onWriteReview}>Write a Review</Button>
          )}
        </div>

        {/* Rating Breakdown */}
        {ratingBreakdown && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Rating breakdown</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingBreakdown[star] || 0
                const percentage = totalReviews ? (count / totalReviews) * 100 : 0

                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-sm w-16">{star} stars</span>
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-yellow-500 h-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {count}
                    </span>
                  </div>
                )
              })}
            </div>
          </Card>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {displayedReviews.map((review) => (
            <Card key={review.id} className="p-6">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <Avatar
                    src={review.author.avatar}
                    alt={review.author.name}
                    initials={review.author.name.substring(0, 2).toUpperCase()}
                    size="md"
                  />
                  <div>
                    <div className="font-semibold">{review.author.name}</div>
                    {review.author.location && (
                      <div className="text-sm text-muted-foreground">
                        {review.author.location}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {renderStars(review.rating, 'sm')}
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDate(review.date)}
                  </div>
                </div>
              </div>

              {/* Review Comment */}
              <p className="text-muted-foreground leading-relaxed mb-4">
                {review.comment}
              </p>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mb-4 overflow-x-auto">
                  {review.images.map((image, idx) => (
                    <button
                      key={idx}
                      onClick={() => onImageClick?.(image)}
                      className="shrink-0 w-24 h-24 rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={image}
                        alt={`Review image ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Helpful Button */}
              {onMarkHelpful && (
                <div className="flex items-center gap-4 pt-4 border-t">
                  <button
                    onClick={() => onMarkHelpful(review.id)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    Helpful {review.helpful ? `(${review.helpful})` : ''}
                  </button>
                </div>
              )}

              {/* Host Response */}
              {review.response && (
                <div className="mt-4 pl-6 border-l-2 border-primary">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">Host Response</Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(review.response.date)}
                    </span>
                  </div>
                  <div className="font-semibold text-sm mb-1">
                    {review.response.author}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {review.response.comment}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Load More */}
        {showLoadMore && hasMore && (
          <div className="text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                if (onLoadMore) {
                  onLoadMore()
                } else {
                  setDisplayCount((prev) => prev + initialDisplayCount)
                }
              }}
            >
              Load More Reviews ({reviews.length - displayCount} remaining)
            </Button>
          </div>
        )}

        {/* Empty State */}
        {reviews.length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to share your experience!
            </p>
            {onWriteReview && (
              <Button onClick={onWriteReview}>Write the First Review</Button>
            )}
          </Card>
        )}
      </section>
    )
  }
)
ReviewsSection.displayName = 'ReviewsSection'

export { ReviewsSection }
