// OneDettyDecember Component Variant System
// Type-safe variant system for consistent component styling

import { getVerticalClasses, getVerticalBorderClasses, type Vertical } from './vertical-theme'
import { getThemedClasses, getThemedVerticalClasses } from './dark-mode'
import { transitions } from './animations'

/**
 * Size variants for components
 */
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Component state variants
 */
export type State = 'default' | 'hover' | 'active' | 'disabled' | 'focus' | 'loading' | 'error' | 'success'

/**
 * Visual variant types
 */
export type Variant = 'solid' | 'outline' | 'ghost' | 'link' | 'gradient'

/**
 * Size configuration for different component types
 */
export const sizeVariants = {
  // Button sizes
  button: {
    xs: 'px-2.5 py-1.5 text-xs min-h-[32px]',
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-2.5 text-base min-h-[44px]', // Default, touch-friendly
    lg: 'px-6 py-3 text-lg min-h-[48px]',
    xl: 'px-8 py-4 text-xl min-h-[56px]',
  },

  // Input sizes
  input: {
    xs: 'px-2.5 py-1.5 text-xs h-[32px]',
    sm: 'px-3 py-2 text-sm h-[36px]',
    md: 'px-4 py-2.5 text-base h-[44px]', // Default, touch-friendly
    lg: 'px-4 py-3 text-lg h-[48px]',
    xl: 'px-5 py-4 text-xl h-[56px]',
  },

  // Badge sizes
  badge: {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm', // Default
    lg: 'px-3 py-1.5 text-base',
    xl: 'px-4 py-2 text-lg',
  },

  // Avatar sizes
  avatar: {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base', // Default
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  },

  // Icon sizes
  icon: {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5', // Default
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  },

  // Card padding
  card: {
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-4', // Default
    lg: 'p-6',
    xl: 'p-8',
  },
}

/**
 * Border radius variants
 */
export const radiusVariants = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
}

/**
 * Shadow variants
 */
export const shadowVariants = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
}

/**
 * Button variant classes
 */
export const buttonVariants = {
  // Visual variants
  variant: {
    solid: 'font-semibold',
    outline: 'border-2 bg-transparent font-semibold',
    ghost: 'bg-transparent hover:bg-opacity-10 font-medium',
    link: 'bg-transparent underline-offset-4 hover:underline font-medium p-0',
    gradient: 'font-semibold bg-gradient-to-r',
  },

  // State classes
  state: {
    default: 'cursor-pointer',
    hover: 'hover:opacity-90',
    active: 'active:scale-95',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-[#FFB700] focus:ring-offset-2',
    loading: 'cursor-wait opacity-75',
    error: '',
    success: '',
  },
}

/**
 * Input variant classes
 */
export const inputVariants = {
  variant: {
    solid: `${getThemedClasses.bgPrimary} border`,
    outline: 'bg-transparent border-2',
    ghost: 'bg-transparent border-0 border-b-2',
    link: '',
    gradient: '',
  },

  state: {
    default: `${getThemedClasses.borderPrimary}`,
    hover: `hover:${getThemedClasses.borderSecondary}`,
    active: '',
    disabled: 'opacity-50 cursor-not-allowed',
    focus: `focus:outline-none focus:ring-2 focus:ring-[#FFB700] focus:${getThemedClasses.borderFocus}`,
    loading: 'cursor-wait',
    error: 'border-red-500 focus:ring-red-500',
    success: 'border-green-500 focus:ring-green-500',
  },
}

/**
 * Card variant classes
 */
export const cardVariants = {
  variant: {
    solid: `${getThemedClasses.bgElevated}`,
    outline: `${getThemedClasses.bgPrimary} border-2 ${getThemedClasses.borderPrimary}`,
    ghost: 'bg-transparent',
    link: '',
    gradient: 'bg-gradient-to-br',
  },

  state: {
    default: '',
    hover: 'hover:shadow-md transition-shadow',
    active: '',
    disabled: 'opacity-50',
    focus: `focus:outline-none focus:ring-2 focus:ring-[#FFB700]`,
    loading: '',
    error: 'border-red-500',
    success: 'border-green-500',
  },
}

/**
 * Badge variant classes
 */
export const badgeVariants = {
  variant: {
    solid: 'font-semibold',
    outline: 'border-2 bg-transparent font-semibold',
    ghost: 'bg-opacity-20 font-medium',
    link: '',
    gradient: 'font-semibold bg-gradient-to-r',
  },
}

/**
 * Get button classes with all variants
 */
export const getButtonClasses = ({
  size = 'md',
  variant = 'solid',
  vertical,
  radius = 'lg',
  fullWidth = false,
}: {
  size?: Size
  variant?: Variant
  vertical?: Vertical
  radius?: keyof typeof radiusVariants
  fullWidth?: boolean
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200'

  const sizeClass = sizeVariants.button[size]
  const variantClass = buttonVariants.variant[variant]
  const radiusClass = radiusVariants[radius]
  const stateClasses = `${buttonVariants.state.default} ${buttonVariants.state.hover} ${buttonVariants.state.active} ${buttonVariants.state.focus}`
  const widthClass = fullWidth ? 'w-full' : ''

  // Vertical-specific or brand color
  let colorClasses = ''
  if (vertical) {
    if (variant === 'solid') {
      colorClasses = getThemedVerticalClasses(vertical)
    } else if (variant === 'outline') {
      const borderClass = getVerticalBorderClasses(vertical)
      colorClasses = `${borderClass} ${getThemedClasses.textPrimary} hover:${getThemedVerticalClasses(vertical).split(' ')[0]}`
    }
  } else {
    // Default brand gold
    if (variant === 'solid') {
      colorClasses = 'bg-[#FFB700] hover:bg-[#E6A600] text-black'
    } else if (variant === 'outline') {
      colorClasses = `border-[#FFB700] ${getThemedClasses.textPrimary} hover:bg-[#FFB700] hover:text-black`
    }
  }

  return `${baseClasses} ${sizeClass} ${variantClass} ${radiusClass} ${stateClasses} ${colorClasses} ${widthClass}`.trim()
}

/**
 * Get input classes with all variants
 */
export const getInputClasses = ({
  size = 'md',
  variant = 'solid',
  state = 'default',
  radius = 'lg',
  fullWidth = true,
}: {
  size?: Size
  variant?: Variant
  state?: State
  radius?: keyof typeof radiusVariants
  fullWidth?: boolean
}) => {
  const baseClasses = `${getThemedClasses.textPrimary} ${transitions.base} placeholder:text-gray-400`

  const sizeClass = sizeVariants.input[size]
  const variantClass = inputVariants.variant[variant]
  const stateClass = inputVariants.state[state]
  const radiusClass = radiusVariants[radius]
  const widthClass = fullWidth ? 'w-full' : ''

  return `${baseClasses} ${sizeClass} ${variantClass} ${stateClass} ${radiusClass} ${widthClass}`.trim()
}

/**
 * Get card classes with all variants
 */
export const getCardClasses = ({
  size = 'md',
  variant = 'solid',
  vertical,
  radius = 'lg',
  shadow = 'md',
  interactive = false,
}: {
  size?: Size
  variant?: Variant
  vertical?: Vertical
  radius?: keyof typeof radiusVariants
  shadow?: keyof typeof shadowVariants
  interactive?: boolean
}) => {
  const baseClasses = getThemedClasses.textPrimary

  const sizeClass = sizeVariants.card[size]
  const variantClass = cardVariants.variant[variant]
  const radiusClass = radiusVariants[radius]
  const shadowClass = shadowVariants[shadow]
  const interactiveClass = interactive ? `${cardVariants.state.hover} cursor-pointer` : ''

  // Vertical border accent
  let borderAccent = ''
  if (vertical && variant === 'outline') {
    borderAccent = `border-l-4 ${getVerticalBorderClasses(vertical)}`
  }

  return `${baseClasses} ${sizeClass} ${variantClass} ${radiusClass} ${shadowClass} ${interactiveClass} ${borderAccent}`.trim()
}

/**
 * Get badge classes with all variants
 */
export const getBadgeClasses = ({
  size = 'md',
  variant = 'solid',
  vertical,
  radius = 'full',
}: {
  size?: Size
  variant?: Variant
  vertical?: Vertical
  radius?: keyof typeof radiusVariants
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium whitespace-nowrap'

  const sizeClass = sizeVariants.badge[size]
  const variantClass = badgeVariants.variant[variant]
  const radiusClass = radiusVariants[radius]

  // Vertical-specific colors
  let colorClasses = ''
  if (vertical) {
    if (variant === 'solid') {
      colorClasses = getThemedVerticalClasses(vertical)
    } else if (variant === 'outline') {
      const borderClass = getVerticalBorderClasses(vertical)
      colorClasses = `${borderClass} ${getThemedClasses.textPrimary}`
    } else if (variant === 'ghost') {
      colorClasses = getThemedVerticalClasses(vertical).replace('bg-', 'bg-opacity-20 bg-')
    }
  } else {
    // Default brand gold
    if (variant === 'solid') {
      colorClasses = 'bg-[#FFB700] text-black'
    } else if (variant === 'outline') {
      colorClasses = `border-2 border-[#FFB700] ${getThemedClasses.textPrimary}`
    }
  }

  return `${baseClasses} ${sizeClass} ${variantClass} ${radiusClass} ${colorClasses}`.trim()
}

/**
 * Get avatar classes
 */
export const getAvatarClasses = ({
  size = 'md',
  radius = 'full',
}: {
  size?: Size
  radius?: keyof typeof radiusVariants
}) => {
  const baseClasses = 'inline-flex items-center justify-center overflow-hidden bg-gray-200 dark:bg-gray-700'

  const sizeClass = sizeVariants.avatar[size]
  const radiusClass = radiusVariants[radius]

  return `${baseClasses} ${sizeClass} ${radiusClass}`.trim()
}

/**
 * Get icon classes
 */
export const getIconClasses = ({
  size = 'md',
}: {
  size?: Size
}) => {
  return sizeVariants.icon[size]
}

/**
 * Common component patterns with variants
 */
export const componentPatterns = {
  // Primary CTA button
  primaryButton: getButtonClasses({ size: 'lg', variant: 'solid' }),

  // Secondary button
  secondaryButton: getButtonClasses({ size: 'md', variant: 'outline' }),

  // Vertical action button
  verticalButton: (vertical: Vertical) => getButtonClasses({ size: 'md', variant: 'solid', vertical }),

  // Standard input
  standardInput: getInputClasses({ size: 'md', variant: 'solid' }),

  // Interactive card
  interactiveCard: getCardClasses({ variant: 'outline', shadow: 'md', interactive: true }),

  // Vertical badge
  verticalBadge: (vertical: Vertical) => getBadgeClasses({ size: 'sm', variant: 'solid', vertical }),

  // Profile avatar
  profileAvatar: getAvatarClasses({ size: 'md', radius: 'full' }),
}
