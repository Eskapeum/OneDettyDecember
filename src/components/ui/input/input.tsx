import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { VerticalTheme } from '@/types/vertical'

const inputVariants = cva(
  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      state: {
        default: '',
        error: 'border-destructive focus-visible:ring-destructive',
        success: 'border-green-500 focus-visible:ring-green-500',
      },
      size: {
        sm: 'h-9',
        md: 'h-10',
        lg: 'h-11',
      },
    },
    defaultVariants: {
      state: 'default',
      size: 'md',
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /**
   * Input label
   */
  label?: string
  /**
   * Helper text displayed below input
   */
  helperText?: string
  /**
   * Error message
   */
  error?: string
  /**
   * Success message
   */
  success?: string
  /**
   * Icon to display on the left
   */
  leftIcon?: React.ReactNode
  /**
   * Icon to display on the right
   */
  rightIcon?: React.ReactNode
  /**
   * Marketplace vertical theme (affects focus ring color)
   */
  vertical?: VerticalTheme
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      helperText,
      error,
      success,
      leftIcon,
      rightIcon,
      vertical,
      state,
      size,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId()
    const helperTextId = `${inputId}-helper`
    const errorId = `${inputId}-error`

    // Determine state based on error/success props
    const computedState = error ? 'error' : success ? 'success' : state

    const verticalFocusStyles = vertical
      ? {
          stays: 'focus-visible:ring-[#2A9D8F]',
          events: 'focus-visible:ring-[#E63946]',
          experiences: 'focus-visible:ring-[#FB8500]',
          cars: 'focus-visible:ring-[#003566]',
          marketplace: 'focus-visible:ring-[#7209B7]',
          community: 'focus-visible:ring-[#FFD60A]',
        }[vertical]
      : ''

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium mb-2">
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ state: computedState, size }),
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              verticalFocusStyles,
              className
            )}
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperTextId : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-destructive">
            {error}
          </p>
        )}
        {success && !error && (
          <p className="mt-1.5 text-sm text-green-600">{success}</p>
        )}
        {helperText && !error && !success && (
          <p id={helperTextId} className="mt-1.5 text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input, inputVariants }
