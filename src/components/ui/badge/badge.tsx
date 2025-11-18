import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { VerticalTheme } from '@/types/vertical'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        dot: 'border-transparent bg-transparent pl-0',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Marketplace vertical theme
   */
  vertical?: VerticalTheme
  /**
   * Show dot indicator (for dot variant)
   */
  showDot?: boolean
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, vertical, showDot, children, ...props }, ref) => {
    const verticalStyles = vertical
      ? {
          stays: 'bg-[#2A9D8F] text-white border-[#2A9D8F]',
          events: 'bg-[#E63946] text-white border-[#E63946]',
          experiences: 'bg-[#FB8500] text-white border-[#FB8500]',
          cars: 'bg-[#003566] text-white border-[#003566]',
          marketplace: 'bg-[#7209B7] text-white border-[#7209B7]',
          community: 'bg-[#FFD60A] text-black border-[#FFD60A]',
        }[vertical]
      : ''

    const dotColor = vertical
      ? {
          stays: '#2A9D8F',
          events: '#E63946',
          experiences: '#FB8500',
          cars: '#003566',
          marketplace: '#7209B7',
          community: '#FFD60A',
        }[vertical]
      : 'currentColor'

    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant }), vertical && verticalStyles, className)}
        data-vertical={vertical}
        {...props}
      >
        {(variant === 'dot' || showDot) && (
          <span
            className="mr-1.5 h-2 w-2 rounded-full"
            style={{ backgroundColor: dotColor }}
          />
        )}
        {children}
      </div>
    )
  }
)
Badge.displayName = 'Badge'

export { Badge, badgeVariants }
