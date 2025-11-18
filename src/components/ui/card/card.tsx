import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { VerticalTheme } from '@/types/vertical'

const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-sm transition-all',
  {
    variants: {
      variant: {
        default: 'border-border',
        bordered: 'border-2',
        elevated: 'shadow-md hover:shadow-lg',
      },
      hoverable: {
        true: 'cursor-pointer hover:shadow-md hover:-translate-y-1',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      hoverable: false,
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /**
   * Marketplace vertical theme (shows as left border accent)
   */
  vertical?: VerticalTheme
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, hoverable, vertical, ...props }, ref) => {
    const verticalBorderStyles = vertical
      ? {
          stays: 'border-l-4 border-l-[#2A9D8F]',
          events: 'border-l-4 border-l-[#E63946]',
          experiences: 'border-l-4 border-l-[#FB8500]',
          cars: 'border-l-4 border-l-[#003566]',
          marketplace: 'border-l-4 border-l-[#7209B7]',
          community: 'border-l-4 border-l-[#FFD60A]',
        }[vertical]
      : ''

    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, hoverable }), verticalBorderStyles, className)}
        data-vertical={vertical}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-2xl font-semibold leading-none tracking-tight', className)} {...props} />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }
