// OneDettyDecember Icon System
// Centralized icon management with Lucide React

import { getIconClasses, type Size } from './component-variants'
import { getVerticalColor, type Vertical } from './vertical-theme'

/**
 * Icon library: Lucide React
 * https://lucide.dev/
 *
 * Installation:
 * npm install lucide-react
 *
 * Usage:
 * import { Heart, User, Calendar } from 'lucide-react'
 */

/**
 * Icon size mapping
 * Maps our Size type to pixel values
 */
export const iconSizes = {
  xs: 12,  // 12px
  sm: 16,  // 16px
  md: 20,  // 20px - Default
  lg: 24,  // 24px
  xl: 32,  // 32px
} as const

/**
 * Icon color presets
 */
export const iconColors = {
  // Neutral colors
  primary: '#1A1A1A',
  secondary: '#525252',
  tertiary: '#737373',
  white: '#FFFFFF',
  black: '#000000',

  // Brand colors
  gold: '#FFB700',
  midnight: '#264653',

  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Vertical colors (imported from vertical-theme)
  events: '#E63946',
  stays: '#2A9D8F',
  experiences: '#FB8500',
  cars: '#003566',
  marketplace: '#7209B7',
  community: '#FFD60A',
}

/**
 * Icon props interface for type safety
 */
export interface IconProps {
  size?: Size | number
  color?: keyof typeof iconColors | string
  vertical?: Vertical
  className?: string
  strokeWidth?: number
}

/**
 * Get icon size value
 */
export const getIconSize = (size?: Size | number): number => {
  if (typeof size === 'number') return size
  return iconSizes[size || 'md']
}

/**
 * Get icon color value
 */
export const getIconColor = (color?: keyof typeof iconColors | string, vertical?: Vertical): string => {
  // Vertical color takes precedence
  if (vertical) {
    return getVerticalColor(vertical)
  }

  // Named color from preset
  if (color && color in iconColors) {
    return iconColors[color as keyof typeof iconColors]
  }

  // Custom color or default
  return color || iconColors.primary
}

/**
 * Get complete icon props
 */
export const getIconProps = ({
  size = 'md',
  color,
  vertical,
  className = '',
  strokeWidth = 2,
}: IconProps = {}): {
  size: number
  color: string
  className: string
  strokeWidth: number
} => {
  return {
    size: getIconSize(size),
    color: getIconColor(color, vertical),
    className: `${getIconClasses({ size: typeof size === 'string' ? size : 'md' })} ${className}`.trim(),
    strokeWidth,
  }
}

/**
 * Common icon sets by category
 * Reference for commonly used icons
 */
export const iconSets = {
  // Navigation
  navigation: {
    menu: 'Menu',
    close: 'X',
    chevronLeft: 'ChevronLeft',
    chevronRight: 'ChevronRight',
    chevronUp: 'ChevronUp',
    chevronDown: 'ChevronDown',
    arrowLeft: 'ArrowLeft',
    arrowRight: 'ArrowRight',
    home: 'Home',
  },

  // User & Profile
  user: {
    user: 'User',
    users: 'Users',
    userCircle: 'UserCircle',
    userPlus: 'UserPlus',
    userMinus: 'UserMinus',
    userCheck: 'UserCheck',
    settings: 'Settings',
    logout: 'LogOut',
    login: 'LogIn',
  },

  // Events vertical
  events: {
    calendar: 'Calendar',
    clock: 'Clock',
    mapPin: 'MapPin',
    ticket: 'Ticket',
    music: 'Music',
    party: 'PartyPopper',
    star: 'Star',
  },

  // Stays vertical
  stays: {
    home: 'Home',
    bed: 'Bed',
    building: 'Building',
    mapPin: 'MapPin',
    key: 'Key',
    door: 'DoorOpen',
  },

  // Experiences vertical
  experiences: {
    compass: 'Compass',
    map: 'Map',
    camera: 'Camera',
    image: 'Image',
    palmTree: 'Palmtree',
    plane: 'Plane',
  },

  // Cars vertical
  cars: {
    car: 'Car',
    truck: 'Truck',
    bus: 'Bus',
    plane: 'Plane',
    navigation: 'Navigation',
    fuel: 'Fuel',
  },

  // Marketplace vertical
  marketplace: {
    shoppingBag: 'ShoppingBag',
    shoppingCart: 'ShoppingCart',
    package: 'Package',
    tag: 'Tag',
    dollarSign: 'DollarSign',
    creditCard: 'CreditCard',
  },

  // Community vertical
  community: {
    users: 'Users',
    messageCircle: 'MessageCircle',
    heart: 'Heart',
    share: 'Share2',
    thumbsUp: 'ThumbsUp',
    award: 'Award',
  },

  // Actions
  actions: {
    plus: 'Plus',
    minus: 'Minus',
    edit: 'Edit',
    trash: 'Trash2',
    copy: 'Copy',
    download: 'Download',
    upload: 'Upload',
    search: 'Search',
    filter: 'Filter',
    check: 'Check',
    x: 'X',
  },

  // Status & Feedback
  status: {
    checkCircle: 'CheckCircle',
    xCircle: 'XCircle',
    alertCircle: 'AlertCircle',
    alertTriangle: 'AlertTriangle',
    info: 'Info',
    help: 'HelpCircle',
    loading: 'Loader',
  },

  // Social
  social: {
    facebook: 'Facebook',
    twitter: 'Twitter',
    instagram: 'Instagram',
    linkedin: 'Linkedin',
    youtube: 'Youtube',
    mail: 'Mail',
    phone: 'Phone',
  },

  // Media
  media: {
    play: 'Play',
    pause: 'Pause',
    volume: 'Volume2',
    volumeOff: 'VolumeX',
    image: 'Image',
    video: 'Video',
    mic: 'Mic',
    micOff: 'MicOff',
  },

  // File & Document
  file: {
    file: 'File',
    fileText: 'FileText',
    folder: 'Folder',
    folderOpen: 'FolderOpen',
    download: 'Download',
    upload: 'Upload',
  },
}

/**
 * Common icon usage patterns
 */
export const iconPatterns = {
  // Vertical icon with color
  verticalIcon: (vertical: Vertical, size: Size = 'md') => ({
    ...getIconProps({ size, vertical }),
  }),

  // Action icon (neutral)
  actionIcon: (size: Size = 'md') => ({
    ...getIconProps({ size, color: 'primary' }),
  }),

  // Success icon
  successIcon: (size: Size = 'md') => ({
    ...getIconProps({ size, color: 'success' }),
  }),

  // Error icon
  errorIcon: (size: Size = 'md') => ({
    ...getIconProps({ size, color: 'error' }),
  }),

  // Brand icon (gold)
  brandIcon: (size: Size = 'md') => ({
    ...getIconProps({ size, color: 'gold' }),
  }),

  // Loading spinner
  loadingIcon: (size: Size = 'md') => ({
    ...getIconProps({ size, color: 'primary' }),
    className: `${getIconClasses({ size })} animate-spin`,
  }),
}

/**
 * Icon wrapper component helper
 * Use this pattern for consistent icon rendering
 */
export const createIconWrapper = (IconComponent: any, props: IconProps = {}) => {
  const iconProps = getIconProps(props)

  return {
    IconComponent,
    ...iconProps,
  }
}

/**
 * Dark mode icon colors
 */
export const darkModeIconColors = {
  primary: '#FAFAFA',
  secondary: '#E5E5E5',
  tertiary: '#A3A3A3',
}

/**
 * Get icon color with dark mode support
 */
export const getThemedIconColor = (
  color?: keyof typeof iconColors | string,
  vertical?: Vertical,
  isDark?: boolean
): string => {
  // Vertical color (same in light/dark)
  if (vertical) {
    return getVerticalColor(vertical)
  }

  // Dark mode adjustments for neutral colors
  if (isDark && color) {
    if (color === 'primary') return darkModeIconColors.primary
    if (color === 'secondary') return darkModeIconColors.secondary
    if (color === 'tertiary') return darkModeIconColors.tertiary
  }

  return getIconColor(color, vertical)
}

/**
 * Icon animation classes
 */
export const iconAnimations = {
  spin: 'animate-spin',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  ping: 'animate-ping',
  hover: 'transition-transform hover:scale-110 duration-200',
  rotate90: 'transform rotate-90',
  rotate180: 'transform rotate-180',
  rotate270: 'transform rotate-270',
}

/**
 * Example usage documentation
 *
 * // Basic usage with Lucide React
 * import { Heart } from 'lucide-react'
 * import { getIconProps } from '@/lib/icon-system'
 *
 * <Heart {...getIconProps({ size: 'md', color: 'error' })} />
 *
 * // Vertical icon
 * import { Calendar } from 'lucide-react'
 * import { iconPatterns } from '@/lib/icon-system'
 *
 * <Calendar {...iconPatterns.verticalIcon('events', 'lg')} />
 *
 * // Loading spinner
 * import { Loader } from 'lucide-react'
 * import { iconPatterns } from '@/lib/icon-system'
 *
 * <Loader {...iconPatterns.loadingIcon('md')} />
 */

/**
 * Installation instructions
 *
 * 1. Install Lucide React:
 *    npm install lucide-react
 *
 * 2. Import icons as needed:
 *    import { Heart, User, Calendar } from 'lucide-react'
 *
 * 3. Use with icon system:
 *    <Heart {...getIconProps({ size: 'md', vertical: 'events' })} />
 *
 * 4. Browse all icons:
 *    https://lucide.dev/icons
 */
