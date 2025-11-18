/**
 * Vertical marketplace themes for OneDettyDecember platform
 * Each vertical has a unique color scheme and represents a different marketplace category
 */
export type VerticalTheme =
  | 'stays'        // Accommodations, hotels, Airbnbs
  | 'events'       // Concerts, parties, nightlife
  | 'experiences'  // Tours, activities, adventures
  | 'cars'         // Car rentals, transfers
  | 'marketplace'  // Products, merch, items
  | 'community'    // Forums, groups, social

/**
 * Color mapping for each vertical theme
 * Used for consistent theming across components
 */
export const VERTICAL_COLORS = {
  stays: '#2A9D8F',       // Coastal Emerald
  events: '#E63946',      // Afrobeat Red
  experiences: '#FB8500', // Festival Orange
  cars: '#003566',        // Atlantic Blue
  marketplace: '#7209B7', // Highlife Purple
  community: '#FFD60A',   // Danfo Yellow
} as const

/**
 * Color names for each vertical
 */
export const VERTICAL_COLOR_NAMES = {
  stays: 'Coastal Emerald',
  events: 'Afrobeat Red',
  experiences: 'Festival Orange',
  cars: 'Atlantic Blue',
  marketplace: 'Highlife Purple',
  community: 'Danfo Yellow',
} as const

/**
 * Helper function to get color for a vertical theme
 */
export function getVerticalColor(vertical: VerticalTheme): string {
  return VERTICAL_COLORS[vertical]
}

/**
 * Helper function to get color name for a vertical theme
 */
export function getVerticalColorName(vertical: VerticalTheme): string {
  return VERTICAL_COLOR_NAMES[vertical]
}
