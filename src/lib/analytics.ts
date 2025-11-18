import posthog from 'posthog-js'

// Initialize PostHog
export function initializeAnalytics() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') {
          posthog.debug()
        }
      },
      capture_pageview: false, // We'll handle this manually for better control
      capture_pageleave: true,
      autocapture: true,
      disable_session_recording: process.env.NODE_ENV === 'development',
    })
  }
}

// Track page views
export function trackPageView(url?: string) {
  if (typeof window !== 'undefined') {
    posthog.capture('$pageview', {
      $current_url: url || window.location.href,
    })
  }
}

// Track custom events
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    posthog.capture(eventName, properties)
  }
}

// Identify user
export function identifyUser(userId: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    posthog.identify(userId, properties)
  }
}

// Reset user session (on logout)
export function resetUser() {
  if (typeof window !== 'undefined') {
    posthog.reset()
  }
}

// Track auth events
export const trackAuthEvent = {
  signup: (method: 'email' | 'google' | 'facebook') => {
    trackEvent('user_signup', { method })
  },
  login: (method: 'email' | 'google' | 'facebook') => {
    trackEvent('user_login', { method })
  },
  logout: () => {
    trackEvent('user_logout')
    resetUser()
  },
  passwordReset: () => {
    trackEvent('password_reset_requested')
  },
  emailVerified: () => {
    trackEvent('email_verified')
  },
}

// Track booking events
export const trackBookingEvent = {
  viewPackage: (packageId: string, packageType: string) => {
    trackEvent('package_viewed', { packageId, packageType })
  },
  addToCart: (packageId: string, price: number) => {
    trackEvent('add_to_cart', { packageId, price })
  },
  initiateCheckout: (packageId: string, price: number) => {
    trackEvent('checkout_initiated', { packageId, price })
  },
  completeBooking: (bookingId: string, amount: number, currency: string) => {
    trackEvent('booking_completed', { bookingId, amount, currency })
  },
}

// Track search events
export const trackSearchEvent = {
  search: (query: string, filters?: Record<string, any>) => {
    trackEvent('search_performed', { query, ...filters })
  },
  filter: (filterType: string, filterValue: string) => {
    trackEvent('filter_applied', { filterType, filterValue })
  },
}

// Feature flags helper
export function getFeatureFlag(flagName: string): boolean {
  if (typeof window !== 'undefined') {
    return posthog.isFeatureEnabled(flagName) || false
  }
  return false
}

export { posthog }
