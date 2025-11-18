import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { VerticalTheme } from '@/types/vertical'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Marketplace vertical theme
   */
  vertical?: VerticalTheme
  /**
   * Show loading spinner
   */
  loading?: boolean
  /**
   * Icon to display before children
   */
  leftIcon?: React.ReactNode
  /**
   * Icon to display after children
   */
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, vertical, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    // Apply vertical theming if specified
    const verticalStyles = vertical
      ? {
          stays: 'data-[vertical=stays]:bg-[#2A9D8F] data-[vertical=stays]:hover:bg-[#2A9D8F]/90 data-[vertical=stays]:text-white',
          events: 'data-[vertical=events]:bg-[#E63946] data-[vertical=events]:hover:bg-[#E63946]/90 data-[vertical=events]:text-white',
          experiences: 'data-[vertical=experiences]:bg-[#FB8500] data-[vertical=experiences]:hover:bg-[#FB8500]/90 data-[vertical=experiences]:text-white',
          cars: 'data-[vertical=cars]:bg-[#003566] data-[vertical=cars]:hover:bg-[#003566]/90 data-[vertical=cars]:text-white',
          marketplace: 'data-[vertical=marketplace]:bg-[#7209B7] data-[vertical=marketplace]:hover:bg-[#7209B7]/90 data-[vertical=marketplace]:text-white',
          community: 'data-[vertical=community]:bg-[#FFD60A] data-[vertical=community]:hover:bg-[#FFD60A]/90 data-[vertical=community]:text-black',
        }[vertical]
      : ''

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }), verticalStyles)}
        ref={ref}
        data-vertical={vertical}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {leftIcon && !loading && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
