import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface ImageGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Array of image URLs
   */
  images: string[]
  /**
   * Alt text prefix (will append image number)
   */
  alt?: string
  /**
   * Gallery layout
   */
  layout?: 'grid' | 'masonry' | 'carousel'
  /**
   * Show lightbox on click
   */
  showLightbox?: boolean
  /**
   * Maximum height for gallery container
   */
  maxHeight?: number
  /**
   * Show image counter
   */
  showCounter?: boolean
  /**
   * Show "View All Photos" button
   */
  showViewAllButton?: boolean
  /**
   * View All Photos click handler
   */
  onViewAll?: () => void
}

const ImageGallery = React.forwardRef<HTMLDivElement, ImageGalleryProps>(
  (
    {
      className,
      images,
      alt = 'Gallery image',
      layout = 'grid',
      showLightbox = true,
      maxHeight = 500,
      showCounter = true,
      showViewAllButton = true,
      onViewAll,
      ...props
    },
    ref
  ) => {
    const [lightboxOpen, setLightboxOpen] = React.useState(false)
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0)

    const openLightbox = (index: number) => {
      if (showLightbox) {
        setCurrentImageIndex(index)
        setLightboxOpen(true)
      }
    }

    const nextImage = () => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }

    const previousImage = () => {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') previousImage()
    }

    React.useEffect(() => {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [lightboxOpen])

    // Grid Layout
    if (layout === 'grid') {
      return (
        <>
          <div
            ref={ref}
            className={cn('relative', className)}
            style={{ maxHeight: `${maxHeight}px` }}
            {...props}
          >
            <div className="grid grid-cols-4 gap-2 rounded-lg overflow-hidden h-full">
              {/* Main large image */}
              <div
                className="col-span-4 md:col-span-2 row-span-2 cursor-pointer group relative overflow-hidden"
                onClick={() => openLightbox(0)}
              >
                <img
                  src={images[0]}
                  alt={`${alt} 1`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>

              {/* Secondary images */}
              {images.slice(1, 5).map((image, idx) => (
                <div
                  key={idx}
                  className="hidden md:block col-span-1 cursor-pointer group relative overflow-hidden"
                  onClick={() => openLightbox(idx + 1)}
                >
                  <img
                    src={image}
                    alt={`${alt} ${idx + 2}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
              ))}
            </div>

            {/* View All Photos Button */}
            {showViewAllButton && images.length > 5 && (
              <div className="absolute bottom-4 right-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onViewAll || (() => openLightbox(0))}
                  className="bg-white/90 hover:bg-white"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  View all {images.length} photos
                </Button>
              </div>
            )}
          </div>

          {/* Lightbox */}
          {lightboxOpen && (
            <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
              {/* Close Button */}
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Previous Button */}
              {images.length > 1 && (
                <button
                  onClick={previousImage}
                  className="absolute left-4 z-10 text-white hover:text-gray-300 transition-colors"
                >
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Image */}
              <div className="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
                <img
                  src={images[currentImageIndex]}
                  alt={`${alt} ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Next Button */}
              {images.length > 1 && (
                <button
                  onClick={nextImage}
                  className="absolute right-4 z-10 text-white hover:text-gray-300 transition-colors"
                >
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              {/* Counter */}
              {showCounter && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}

              {/* Thumbnails */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-3xl overflow-x-auto px-4 scrollbar-hide">
                {images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      'w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all',
                      currentImageIndex === idx
                        ? 'border-white scale-110'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    )}
                  >
                    <img src={image} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )
    }

    // Carousel Layout
    if (layout === 'carousel') {
      return (
        <>
          <div
            ref={ref}
            className={cn('relative', className)}
            style={{ maxHeight: `${maxHeight}px` }}
            {...props}
          >
            <div className="relative overflow-hidden rounded-lg h-full">
              <img
                src={images[currentImageIndex]}
                alt={`${alt} ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={previousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Indicators */}
              {showCounter && images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={cn(
                        'w-2 h-2 rounded-full transition-all',
                        currentImageIndex === idx ? 'bg-white w-6' : 'bg-white/50'
                      )}
                    />
                  ))}
                </div>
              )}

              {/* View All Button */}
              {showViewAllButton && (
                <div className="absolute top-4 right-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onViewAll || (() => openLightbox(currentImageIndex))}
                    className="bg-white/90 hover:bg-white"
                  >
                    View all {images.length}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Lightbox (same as grid) */}
          {lightboxOpen && (
            <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute top-4 right-4 z-10 text-white"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
                <img
                  src={images[currentImageIndex]}
                  alt={`${alt} ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              {showCounter && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>
          )}
        </>
      )
    }

    return null
  }
)
ImageGallery.displayName = 'ImageGallery'

export { ImageGallery }
