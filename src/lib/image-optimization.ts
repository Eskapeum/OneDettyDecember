/**
 * Image Optimization Utilities
 *
 * Provides helpers for optimizing images in the OneDettyDecember platform
 * Includes blur placeholders, responsive images, and lazy loading
 */

export interface ImageConfig {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
  fill?: boolean
  className?: string
}

/**
 * Generates optimized image props for Next.js Image component
 */
export function getOptimizedImageProps(config: ImageConfig): ImageConfig {
  const {
    quality = 80,
    placeholder = 'empty',
    priority = false,
    ...rest
  } = config

  return {
    ...rest,
    quality,
    placeholder,
    priority,
    loading: priority ? 'eager' : 'lazy',
  } as ImageConfig
}

/**
 * Generates responsive image sizes string
 *
 * @param breakpoints - Custom breakpoints (optional)
 * @returns Sizes string for Next.js Image component
 */
export function getResponsiveSizes(
  breakpoints?: { maxWidth: number; size: string }[]
): string {
  const defaultBreakpoints = [
    { maxWidth: 640, size: '100vw' },
    { maxWidth: 768, size: '50vw' },
    { maxWidth: 1024, size: '33vw' },
    { maxWidth: 1280, size: '25vw' },
  ]

  const points = breakpoints || defaultBreakpoints

  return points
    .map(({ maxWidth, size }) => `(max-width: ${maxWidth}px) ${size}`)
    .concat(['20vw'])
    .join(', ')
}

/**
 * Generates a blur placeholder data URL
 *
 * @param width - Blur placeholder width
 * @param height - Blur placeholder height
 * @returns Base64 encoded blur data URL
 */
export function generateBlurDataURL(
  width: number = 10,
  height: number = 10
): string {
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return ''
  }

  // Create gradient for blur effect
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#f3f4f6')
  gradient.addColorStop(0.5, '#e5e7eb')
  gradient.addColorStop(1, '#d1d5db')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  return canvas.toDataURL()
}

// Shimmer effect for loading state
export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f3f4f6" offset="20%" />
      <stop stop-color="#e5e7eb" offset="50%" />
      <stop stop-color="#f3f4f6" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f3f4f6" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

export const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

/**
 * Generates a shimmer placeholder
 */
export function getShimmerPlaceholder(w: number, h: number): string {
  return `data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`
}

/**
 * Dummy createCanvas for server-side rendering
 * In a real implementation, you might use a library like 'canvas' or 'sharp'
 */
function createCanvas(width: number, height: number) {
  // This is a placeholder - in production, use 'canvas' npm package
  // or generate static blur placeholders
  return {
    getContext: () => null,
    toDataURL: () => '',
  }
}

/**
 * Image optimization presets for common use cases
 */
export const ImagePresets = {
  /**
   * Package card images
   */
  packageCard: {
    width: 400,
    height: 300,
    quality: 80,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    placeholder: 'blur' as const,
  },

  /**
   * Package hero image
   */
  packageHero: {
    width: 1200,
    height: 600,
    quality: 90,
    priority: true,
    sizes: '100vw',
  },

  /**
   * Thumbnail images
   */
  thumbnail: {
    width: 150,
    height: 150,
    quality: 75,
    sizes: '150px',
  },

  /**
   * Avatar images
   */
  avatar: {
    width: 80,
    height: 80,
    quality: 80,
    sizes: '80px',
  },

  /**
   * Full-width hero images
   */
  hero: {
    width: 1920,
    height: 1080,
    quality: 90,
    priority: true,
    sizes: '100vw',
  },

  /**
   * Gallery images
   */
  gallery: {
    width: 800,
    height: 600,
    quality: 85,
    sizes: '(max-width: 640px) 100vw, 800px',
  },
}

/**
 * Get image URL with transformations
 * For use with Supabase Storage or other CDN
 */
export function getTransformedImageURL(
  baseURL: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'avif' | 'jpg' | 'png'
  }
): string {
  const { width, height, quality = 80, format = 'webp' } = options
  const params = new URLSearchParams()

  if (width) params.set('width', width.toString())
  if (height) params.set('height', height.toString())
  params.set('quality', quality.toString())
  params.set('format', format)

  return `${baseURL}?${params.toString()}`
}

/**
 * Calculate aspect ratio
 */
export function getAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
  const divisor = gcd(width, height)
  return `${width / divisor}/${height / divisor}`
}

/**
 * Get srcset for responsive images
 */
export function getSrcSet(
  baseURL: string,
  widths: number[] = [640, 750, 828, 1080, 1200, 1920]
): string {
  return widths
    .map((width) => {
      const url = getTransformedImageURL(baseURL, { width })
      return `${url} ${width}w`
    })
    .join(', ')
}

/**
 * Image loader for external sources
 * Compatible with Next.js Image loader prop
 */
export function imageLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}): string {
  // For Supabase Storage
  if (src.includes('supabase.co/storage')) {
    return getTransformedImageURL(src, { width, quality })
  }

  // For Unsplash
  if (src.includes('unsplash.com')) {
    return `${src}?w=${width}&q=${quality || 80}&fm=webp&fit=crop`
  }

  // Default: return as-is
  return src
}

/**
 * Preload critical images
 * Call this in the document head or page component
 */
export function preloadImage(href: string, as: 'image' = 'image'): void {
  if (typeof window === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = as
  link.href = href
  link.type = 'image/webp'
  document.head.appendChild(link)
}

/**
 * Lazy load images with Intersection Observer
 * For custom implementations outside of Next.js Image
 */
export function lazyLoadImage(
  element: HTMLImageElement,
  options?: IntersectionObserverInit
): void {
  if (typeof window === 'undefined') return
  if (!('IntersectionObserver' in window)) {
    // Fallback for browsers without IntersectionObserver
    loadImage(element)
    return
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadImage(element)
        observer.unobserve(element)
      }
    })
  }, options)

  observer.observe(element)
}

function loadImage(img: HTMLImageElement): void {
  const src = img.dataset.src
  if (src) {
    img.src = src
    img.removeAttribute('data-src')
  }
}
