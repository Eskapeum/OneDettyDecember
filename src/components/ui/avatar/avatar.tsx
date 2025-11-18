import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { VerticalTheme } from '@/types/vertical'

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full',
  {
    variants: {
      size: {
        xs: 'h-6 w-6',
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const statusIndicatorVariants = cva(
  'absolute bottom-0 right-0 block rounded-full ring-2 ring-background',
  {
    variants: {
      size: {
        xs: 'h-1.5 w-1.5',
        sm: 'h-2 w-2',
        md: 'h-2.5 w-2.5',
        lg: 'h-3 w-3',
        xl: 'h-4 w-4',
      },
      status: {
        online: 'bg-green-500',
        offline: 'bg-gray-400',
        away: 'bg-yellow-500',
        busy: 'bg-red-500',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  /**
   * Image source URL
   */
  src?: string
  /**
   * Alt text for image
   */
  alt: string
  /**
   * Fallback initials (e.g., "JD" for John Doe)
   */
  initials?: string
  /**
   * Status indicator
   */
  status?: 'online' | 'offline' | 'away' | 'busy'
  /**
   * Marketplace vertical theme (affects background color for initials)
   */
  vertical?: VerticalTheme
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, alt, initials, status, vertical, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false)

    const verticalBgStyles = vertical
      ? {
          stays: 'bg-[#2A9D8F] text-white',
          events: 'bg-[#E63946] text-white',
          experiences: 'bg-[#FB8500] text-white',
          cars: 'bg-[#003566] text-white',
          marketplace: 'bg-[#7209B7] text-white',
          community: 'bg-[#FFD60A] text-black',
        }[vertical]
      : 'bg-muted text-muted-foreground'

    const showImage = src && !imageError
    const showInitials = !showImage && initials

    return (
      <div ref={ref} className={cn(avatarVariants({ size }), className)} {...props}>
        {showImage ? (
          <img
            src={src}
            alt={alt}
            className="aspect-square h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : showInitials ? (
          <div className={cn('flex h-full w-full items-center justify-center font-medium', verticalBgStyles)}>
            <span className={size === 'xs' ? 'text-xs' : size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : size === 'xl' ? 'text-xl' : 'text-sm'}>
              {initials}
            </span>
          </div>
        ) : (
          <div className={cn('flex h-full w-full items-center justify-center', verticalBgStyles)}>
            <svg
              className={size === 'xs' ? 'h-3 w-3' : size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : size === 'xl' ? 'h-8 w-8' : 'h-5 w-5'}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        {status && (
          <span className={cn(statusIndicatorVariants({ size, status }))} />
        )}
      </div>
    )
  }
)
Avatar.displayName = 'Avatar'

// Avatar Group Component
export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Maximum number of avatars to show
   */
  max?: number
  /**
   * Avatar size
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, max = 3, size = 'md', children, ...props }, ref) => {
    const childArray = React.Children.toArray(children)
    const visibleChildren = max ? childArray.slice(0, max) : childArray
    const hiddenCount = childArray.length - visibleChildren.length

    return (
      <div ref={ref} className={cn('flex -space-x-2', className)} {...props}>
        {visibleChildren.map((child, index) =>
          React.isValidElement(child)
            ? React.cloneElement(child, {
                ...child.props,
                size,
                className: cn('ring-2 ring-background', child.props.className),
                key: index,
              } as any)
            : child
        )}
        {hiddenCount > 0 && (
          <div
            className={cn(
              avatarVariants({ size }),
              'flex items-center justify-center bg-muted text-muted-foreground ring-2 ring-background font-medium'
            )}
          >
            <span className={size === 'xs' ? 'text-xs' : size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : size === 'xl' ? 'text-xl' : 'text-sm'}>
              +{hiddenCount}
            </span>
          </div>
        )}
      </div>
    )
  }
)
AvatarGroup.displayName = 'AvatarGroup'

export { Avatar, AvatarGroup, avatarVariants }
