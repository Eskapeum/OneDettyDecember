// OneDettyDecember Dark Mode System
// Complete dark theme with tokens and utilities

import { colors } from './design-tokens'

/**
 * Dark mode color tokens
 * Complementary to the light mode tokens in design-tokens.ts
 */
export const darkColors = {
  // Dark mode backgrounds
  background: {
    primary: '#0A0A0A',      // Near black
    secondary: '#1A1A1A',    // Dark gray (existing Unity Black)
    tertiary: '#262626',     // Lighter dark
    elevated: '#303030',     // Cards/elevated surfaces
  },

  // Dark mode text
  text: {
    primary: '#FAFAFA',      // Near white
    secondary: '#E5E5E5',    // Light gray
    tertiary: '#A3A3A3',     // Muted gray
    disabled: '#737373',     // Disabled text
  },

  // Brand colors remain the same but with adjusted opacity for dark mode
  brand: {
    gold: '#FFB700',         // Detty Gold (same)
    goldMuted: '#E6A600',    // Slightly darker for dark mode
    midnight: '#264653',     // Midnight Indigo (same)
    midnightLight: '#2D5260', // Lighter for dark mode
  },

  // Vertical colors adjusted for dark mode (slightly muted)
  verticals: {
    events: '#E63946',        // Afrobeat Red (same)
    eventsDark: '#D62839',    // Darker variant
    stays: '#2A9D8F',         // Coastal Emerald (same)
    staysDark: '#238276',     // Darker variant
    experiences: '#FB8500',   // Festival Orange (same)
    experiencesDark: '#E07700', // Darker variant
    cars: '#003566',          // Atlantic Blue (same)
    carsDark: '#002A52',      // Darker variant
    marketplace: '#7209B7',   // Highlife Purple (same)
    marketplaceDark: '#5F07A0', // Darker variant
    community: '#FFD60A',     // Danfo Yellow (same)
    communityDark: '#E6C109', // Darker variant
  },

  // Semantic colors for dark mode
  semantic: {
    success: '#10B981',       // Green (same)
    successMuted: '#059669',  // Darker green
    warning: '#F59E0B',       // Amber (same)
    warningMuted: '#D97706',  // Darker amber
    error: '#EF4444',         // Red (same)
    errorMuted: '#DC2626',    // Darker red
    info: '#3B82F6',          // Blue (same)
    infoMuted: '#2563EB',     // Darker blue
  },

  // Border colors for dark mode
  border: {
    primary: '#404040',       // Subtle borders
    secondary: '#525252',     // Medium borders
    focus: '#FFB700',         // Focus state (brand gold)
  },
}

/**
 * Theme type
 */
export type Theme = 'light' | 'dark' | 'system'

/**
 * CSS custom properties for dark mode
 * Apply to :root or [data-theme="dark"]
 */
export const darkModeCSSVariables = {
  // Backgrounds
  '--bg-primary': darkColors.background.primary,
  '--bg-secondary': darkColors.background.secondary,
  '--bg-tertiary': darkColors.background.tertiary,
  '--bg-elevated': darkColors.background.elevated,

  // Text
  '--text-primary': darkColors.text.primary,
  '--text-secondary': darkColors.text.secondary,
  '--text-tertiary': darkColors.text.tertiary,
  '--text-disabled': darkColors.text.disabled,

  // Brand
  '--brand-gold': darkColors.brand.gold,
  '--brand-gold-muted': darkColors.brand.goldMuted,
  '--brand-midnight': darkColors.brand.midnight,
  '--brand-midnight-light': darkColors.brand.midnightLight,

  // Borders
  '--border-primary': darkColors.border.primary,
  '--border-secondary': darkColors.border.secondary,
  '--border-focus': darkColors.border.focus,
}

/**
 * Tailwind dark mode classes
 * Use with dark: prefix
 */
export const darkModeClasses = {
  // Backgrounds
  bg: {
    primary: 'dark:bg-[#0A0A0A]',
    secondary: 'dark:bg-[#1A1A1A]',
    tertiary: 'dark:bg-[#262626]',
    elevated: 'dark:bg-[#303030]',
  },

  // Text
  text: {
    primary: 'dark:text-[#FAFAFA]',
    secondary: 'dark:text-[#E5E5E5]',
    tertiary: 'dark:text-[#A3A3A3]',
    disabled: 'dark:text-[#737373]',
  },

  // Borders
  border: {
    primary: 'dark:border-[#404040]',
    secondary: 'dark:border-[#525252]',
    focus: 'dark:border-[#FFB700]',
  },
}

/**
 * Get combined light/dark classes
 */
export const getThemedClasses = {
  // Background classes (light + dark)
  bgPrimary: 'bg-white dark:bg-[#0A0A0A]',
  bgSecondary: 'bg-[#F5F5F5] dark:bg-[#1A1A1A]',
  bgTertiary: 'bg-[#E5E5E5] dark:bg-[#262626]',
  bgElevated: 'bg-white dark:bg-[#303030]',

  // Text classes (light + dark)
  textPrimary: 'text-[#1A1A1A] dark:text-[#FAFAFA]',
  textSecondary: 'text-[#525252] dark:text-[#E5E5E5]',
  textTertiary: 'text-[#737373] dark:text-[#A3A3A3]',
  textDisabled: 'text-[#A3A3A3] dark:text-[#737373]',

  // Border classes (light + dark)
  borderPrimary: 'border-[#E5E5E5] dark:border-[#404040]',
  borderSecondary: 'border-[#D4D4D4] dark:border-[#525252]',
  borderFocus: 'border-[#FFB700] dark:border-[#FFB700]',
}

/**
 * Theme provider utilities
 */
export const themeUtils = {
  /**
   * Set theme in localStorage and apply to document
   */
  setTheme: (theme: Theme): void => {
    if (typeof window === 'undefined') return

    localStorage.setItem('theme', theme)

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', systemTheme)
    } else {
      document.documentElement.setAttribute('data-theme', theme)
    }
  },

  /**
   * Get current theme from localStorage or system preference
   */
  getTheme: (): Theme => {
    if (typeof window === 'undefined') return 'light'

    const stored = localStorage.getItem('theme') as Theme | null
    if (stored) return stored

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  },

  /**
   * Toggle between light and dark
   */
  toggleTheme: (): void => {
    const current = themeUtils.getTheme()
    const next = current === 'dark' ? 'light' : 'dark'
    themeUtils.setTheme(next)
  },

  /**
   * Initialize theme on page load
   */
  initTheme: (): void => {
    if (typeof window === 'undefined') return

    const theme = themeUtils.getTheme()
    themeUtils.setTheme(theme)

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const stored = localStorage.getItem('theme')
      if (stored === 'system' || !stored) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light')
      }
    })
  },
}

/**
 * Hook for theme state (use in React components)
 * Returns current theme and setter
 */
export const useTheme = (): [Theme, (theme: Theme) => void] => {
  if (typeof window === 'undefined') return ['light', () => {}]

  const currentTheme = themeUtils.getTheme()
  return [currentTheme, themeUtils.setTheme]
}

/**
 * Dark mode vertical color variants
 * Use these for vertical theming in dark mode
 */
export const getDarkVerticalColor = (vertical: 'events' | 'stays' | 'experiences' | 'cars' | 'marketplace' | 'community'): string => {
  const colorMap = {
    events: darkColors.verticals.eventsDark,
    stays: darkColors.verticals.staysDark,
    experiences: darkColors.verticals.experiencesDark,
    cars: darkColors.verticals.carsDark,
    marketplace: darkColors.verticals.marketplaceDark,
    community: darkColors.verticals.communityDark,
  }

  return colorMap[vertical]
}

/**
 * Combined vertical classes with dark mode support
 */
export const getThemedVerticalClasses = (vertical: 'events' | 'stays' | 'experiences' | 'cars' | 'marketplace' | 'community') => {
  const lightDarkMap = {
    events: 'bg-[#E63946] dark:bg-[#D62839] hover:bg-[#D62839] dark:hover:bg-[#C41F2A] text-white',
    stays: 'bg-[#2A9D8F] dark:bg-[#238276] hover:bg-[#238276] dark:hover:bg-[#1C6B60] text-white',
    experiences: 'bg-[#FB8500] dark:bg-[#E07700] hover:bg-[#E07700] dark:hover:bg-[#C66900] text-white',
    cars: 'bg-[#003566] dark:bg-[#002A52] hover:bg-[#002A52] dark:hover:bg-[#001F3F] text-white',
    marketplace: 'bg-[#7209B7] dark:bg-[#5F07A0] hover:bg-[#5F07A0] dark:hover:bg-[#4D0589] text-white',
    community: 'bg-[#FFD60A] dark:bg-[#E6C109] hover:bg-[#E6C109] dark:hover:bg-[#CCAC08] text-black dark:text-black',
  }

  return lightDarkMap[vertical]
}

/**
 * Common dark mode patterns
 */
export const darkModePatterns = {
  // Card with dark mode
  card: `${getThemedClasses.bgElevated} ${getThemedClasses.textPrimary} ${getThemedClasses.borderPrimary} border`,

  // Input with dark mode
  input: `${getThemedClasses.bgPrimary} ${getThemedClasses.textPrimary} ${getThemedClasses.borderPrimary} border focus:${getThemedClasses.borderFocus}`,

  // Button primary
  buttonPrimary: 'bg-[#FFB700] hover:bg-[#E6A600] text-black dark:bg-[#FFB700] dark:hover:bg-[#E6A600] dark:text-black',

  // Button secondary
  buttonSecondary: `${getThemedClasses.bgSecondary} ${getThemedClasses.textPrimary} hover:${getThemedClasses.bgTertiary}`,

  // Text heading
  heading: `${getThemedClasses.textPrimary} font-bold`,

  // Text body
  body: getThemedClasses.textSecondary,

  // Divider
  divider: `${getThemedClasses.borderPrimary} border-t`,
}
