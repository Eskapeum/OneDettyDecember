// OneDettyDecember Responsive Design Utilities
// Mobile-first responsive helpers for consistent breakpoint usage

import { breakpoints } from './design-tokens'

/**
 * Responsive breakpoint values
 * Mobile-first approach: styles apply from breakpoint and up
 */
export const responsive = {
  sm: breakpoints.sm,   // 640px - Small tablets
  md: breakpoints.md,   // 768px - Tablets
  lg: breakpoints.lg,   // 1024px - Small laptops
  xl: breakpoints.xl,   // 1280px - Desktops
  '2xl': breakpoints['2xl'], // 1536px - Large screens
} as const

/**
 * Container max-widths for different breakpoints
 * Centers content and provides consistent margins
 */
export const containerMaxWidths = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

/**
 * Container classes for different breakpoint constraints
 */
export const getContainerClasses = (maxWidth?: keyof typeof containerMaxWidths) => {
  const base = 'w-full mx-auto px-4 sm:px-6 lg:px-8'

  if (!maxWidth) {
    return base
  }

  const maxWidthMap = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
  }

  return `${base} ${maxWidthMap[maxWidth]}`
}

/**
 * Responsive spacing utilities
 * Returns responsive padding/margin classes
 */
export const responsiveSpacing = {
  // Padding utilities
  px: {
    mobile: 'px-4',      // 16px on mobile
    tablet: 'sm:px-6',   // 24px on tablet
    desktop: 'lg:px-8',  // 32px on desktop
    all: 'px-4 sm:px-6 lg:px-8', // Progressive spacing
  },
  py: {
    mobile: 'py-4',      // 16px on mobile
    tablet: 'sm:py-6',   // 24px on tablet
    desktop: 'lg:py-8',  // 32px on desktop
    all: 'py-4 sm:py-6 lg:py-8', // Progressive spacing
  },
  p: {
    mobile: 'p-4',       // 16px on mobile
    tablet: 'sm:p-6',    // 24px on tablet
    desktop: 'lg:p-8',   // 32px on desktop
    all: 'p-4 sm:p-6 lg:p-8', // Progressive spacing
  },

  // Margin utilities
  mx: {
    mobile: 'mx-4',
    tablet: 'sm:mx-6',
    desktop: 'lg:mx-8',
    all: 'mx-4 sm:mx-6 lg:mx-8',
  },
  my: {
    mobile: 'my-4',
    tablet: 'sm:my-6',
    desktop: 'lg:my-8',
    all: 'my-4 sm:my-6 lg:my-8',
  },
  m: {
    mobile: 'm-4',
    tablet: 'sm:m-6',
    desktop: 'lg:m-8',
    all: 'm-4 sm:m-6 lg:m-8',
  },
}

/**
 * Responsive grid utilities
 */
export const responsiveGrid = {
  cols: {
    '1-2-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '1-2-4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    '1-3': 'grid-cols-1 lg:grid-cols-3',
    '2-4': 'grid-cols-2 lg:grid-cols-4',
    '2-3-4': 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  },
  gap: {
    mobile: 'gap-4',
    tablet: 'sm:gap-6',
    desktop: 'lg:gap-8',
    all: 'gap-4 sm:gap-6 lg:gap-8',
  },
}

/**
 * Responsive typography utilities
 */
export const responsiveText = {
  // Heading sizes
  h1: 'text-3xl sm:text-4xl lg:text-5xl',
  h2: 'text-2xl sm:text-3xl lg:text-4xl',
  h3: 'text-xl sm:text-2xl lg:text-3xl',
  h4: 'text-lg sm:text-xl lg:text-2xl',
  h5: 'text-base sm:text-lg lg:text-xl',
  h6: 'text-sm sm:text-base lg:text-lg',

  // Body text
  body: 'text-base sm:text-base lg:text-lg',
  small: 'text-sm sm:text-sm lg:text-base',
  xs: 'text-xs sm:text-xs lg:text-sm',
}

/**
 * Responsive display utilities
 */
export const responsiveDisplay = {
  // Hide on mobile, show on desktop
  hideOnMobile: 'hidden md:block',
  // Show on mobile, hide on desktop
  showOnMobile: 'block md:hidden',
  // Show only on tablet
  showOnTablet: 'hidden md:block lg:hidden',
  // Show only on desktop
  showOnDesktop: 'hidden lg:block',
}

/**
 * Touch-friendly utilities for mobile
 * Ensures interactive elements meet accessibility standards
 */
export const touchFriendly = {
  // Minimum 44x44px touch target (WCAG 2.1)
  minTouchTarget: 'min-h-[44px] min-w-[44px]',
  // Standard touch target
  touchTarget: 'h-12 w-12', // 48px
  // Large touch target
  largeTouchTarget: 'h-14 w-14', // 56px
  // Button padding for touch
  buttonPadding: 'px-6 py-3', // At least 44px height
  // Input height for touch
  inputHeight: 'h-12', // 48px for easy tapping
}

/**
 * Responsive flex utilities
 */
export const responsiveFlex = {
  // Stack on mobile, row on desktop
  stackToRow: 'flex flex-col md:flex-row',
  // Row on mobile, stack on desktop (rare)
  rowToStack: 'flex flex-row md:flex-col',
  // Center on all screens
  center: 'flex items-center justify-center',
  // Responsive gap
  gap: {
    mobile: 'gap-4',
    tablet: 'sm:gap-6',
    desktop: 'lg:gap-8',
    all: 'gap-4 sm:gap-6 lg:gap-8',
  },
}

/**
 * Media query hooks for use in styled components or inline styles
 */
export const mediaQueries = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
} as const

/**
 * Viewport utilities for detecting screen size
 * Use with window.matchMedia or CSS
 */
export const viewportMatchers = {
  isMobile: `(max-width: ${parseInt(breakpoints.md) - 1}px)`,
  isTablet: `(min-width: ${breakpoints.md}) and (max-width: ${parseInt(breakpoints.lg) - 1}px)`,
  isDesktop: `(min-width: ${breakpoints.lg})`,
  isLargeDesktop: `(min-width: ${breakpoints.xl})`,
}

/**
 * Helper function to check if viewport matches a breakpoint
 * Client-side only
 */
export const useViewport = (breakpoint: keyof typeof breakpoints): boolean => {
  if (typeof window === 'undefined') return false

  const query = `(min-width: ${breakpoints[breakpoint]})`
  return window.matchMedia(query).matches
}

/**
 * Responsive aspect ratio utilities
 */
export const aspectRatio = {
  square: 'aspect-square',
  video: 'aspect-video', // 16:9
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  ultrawide: 'aspect-[21/9]',
}

/**
 * Common responsive patterns
 */
export const patterns = {
  // Hero section
  hero: {
    container: getContainerClasses('xl'),
    padding: responsiveSpacing.py.all,
    title: responsiveText.h1,
    subtitle: responsiveText.body,
  },

  // Card grid
  cardGrid: {
    container: getContainerClasses('2xl'),
    grid: `grid ${responsiveGrid.cols['1-2-3']} ${responsiveGrid.gap.all}`,
    padding: responsiveSpacing.p.all,
  },

  // Form layout
  form: {
    container: getContainerClasses('md'),
    padding: responsiveSpacing.p.all,
    inputHeight: touchFriendly.inputHeight,
    buttonHeight: touchFriendly.minTouchTarget,
  },

  // Navigation
  nav: {
    container: getContainerClasses('2xl'),
    padding: responsiveSpacing.px.all,
    height: 'h-16 md:h-20', // Taller on desktop
  },
}
