import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { VerticalTheme } from '@/types/vertical'
import { Button } from '@/components/ui/button'

const heroVariants = cva(
  'relative w-full overflow-hidden',
  {
    variants: {
      size: {
        sm: 'min-h-[300px] py-12',
        md: 'min-h-[400px] py-16',
        lg: 'min-h-[500px] py-20',
        xl: 'min-h-[600px] py-24',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
    },
    defaultVariants: {
      size: 'lg',
      align: 'center',
    },
  }
)

const overlayVariants = cva(
  'absolute inset-0 z-0',
  {
    variants: {
      overlay: {
        none: 'bg-transparent',
        light: 'bg-black/20',
        medium: 'bg-black/40',
        dark: 'bg-black/60',
        gradient: 'bg-gradient-to-br from-black/60 to-black/20',
      },
    },
    defaultVariants: {
      overlay: 'medium',
    },
  }
)

export interface HeroProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof heroVariants>,
    VariantProps<typeof overlayVariants> {
  /**
   * Hero title (large heading)
   */
  title: string
  /**
   * Hero subtitle/description
   */
  subtitle?: string
  /**
   * Background image URL
   */
  backgroundImage?: string
  /**
   * Background gradient (if no image)
   */
  gradient?: string
  /**
   * Primary CTA button text
   */
  ctaText?: string
  /**
   * Primary CTA button click handler
   */
  onCtaClick?: () => void
  /**
   * Secondary CTA button text
   */
  secondaryCtaText?: string
  /**
   * Secondary CTA button click handler
   */
  onSecondaryCtaClick?: () => void
  /**
   * Marketplace vertical theme
   */
  vertical?: VerticalTheme
  /**
   * Custom content to render below CTAs
   */
  children?: React.ReactNode
}

const Hero = React.forwardRef<HTMLDivElement, HeroProps>(
  (
    {
      className,
      size,
      align,
      overlay,
      title,
      subtitle,
      backgroundImage,
      gradient,
      ctaText,
      onCtaClick,
      secondaryCtaText,
      onSecondaryCtaClick,
      vertical,
      children,
      ...props
    },
    ref
  ) => {
    // Vertical gradient backgrounds
    const verticalGradients = {
      stays: 'linear-gradient(135deg, #2A9D8F 0%, #1B6B61 100%)',
      events: 'linear-gradient(135deg, #E63946 0%, #B02A34 100%)',
      experiences: 'linear-gradient(135deg, #FB8500 0%, #C96A00 100%)',
      cars: 'linear-gradient(135deg, #003566 0%, #002347 100%)',
      marketplace: 'linear-gradient(135deg, #7209B7 0%, #550788 100%)',
      community: 'linear-gradient(135deg, #FFD60A 0%, #CCA700 100%)',
    }

    const backgroundStyle = backgroundImage
      ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : gradient
      ? { background: gradient }
      : vertical
      ? { background: verticalGradients[vertical] }
      : { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }

    return (
      <div
        ref={ref}
        className={cn(heroVariants({ size, align }), className)}
        style={backgroundStyle}
        {...props}
      >
        {/* Overlay */}
        <div className={cn(overlayVariants({ overlay }))} />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className={cn(
            'max-w-4xl',
            align === 'center' && 'mx-auto',
            align === 'right' && 'ml-auto'
          )}>
            {/* Title */}
            <h1 className={cn(
              'font-bold text-white mb-4',
              size === 'sm' && 'text-3xl md:text-4xl',
              size === 'md' && 'text-4xl md:text-5xl',
              size === 'lg' && 'text-5xl md:text-6xl',
              size === 'xl' && 'text-6xl md:text-7xl'
            )}>
              {title}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <p className={cn(
                'text-white/90 mb-8',
                size === 'sm' && 'text-base md:text-lg',
                size === 'md' && 'text-lg md:text-xl',
                size === 'lg' && 'text-xl md:text-2xl',
                size === 'xl' && 'text-2xl md:text-3xl'
              )}>
                {subtitle}
              </p>
            )}

            {/* CTAs */}
            {(ctaText || secondaryCtaText) && (
              <div className={cn(
                'flex flex-wrap gap-4',
                align === 'center' && 'justify-center',
                align === 'right' && 'justify-end'
              )}>
                {ctaText && (
                  <Button
                    size="lg"
                    variant="primary"
                    onClick={onCtaClick}
                    className="bg-white text-gray-900 hover:bg-white/90"
                  >
                    {ctaText}
                  </Button>
                )}
                {secondaryCtaText && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={onSecondaryCtaClick}
                    className="border-white text-white hover:bg-white/10"
                  >
                    {secondaryCtaText}
                  </Button>
                )}
              </div>
            )}

            {/* Custom content */}
            {children && (
              <div className="mt-8">
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
)
Hero.displayName = 'Hero'

export { Hero, heroVariants }
