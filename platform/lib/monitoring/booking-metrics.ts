/**
 * Booking Metrics & Analytics
 *
 * Tracks booking flow performance, conversion rates,
 * and business metrics for Sprint 3
 */

import { logger } from '@/lib/logger'
import { trackEvent } from '@/lib/analytics'
import { alertManager } from '@/lib/alerts'

export interface BookingMetrics {
  // Funnel metrics
  viewedPackage: number
  startedBooking: number
  completedForm: number
  confirmedBooking: number

  // Performance metrics
  avgBookingTime: number // milliseconds
  formAbandonmentRate: number // percentage

  // Business metrics
  totalBookings: number
  totalRevenue: number
  avgBookingValue: number

  // Error metrics
  bookingErrors: number
  paymentFailures: number
  availabilityErrors: number
}

export interface BookingEvent {
  type: 'view' | 'start' | 'complete' | 'confirm' | 'error' | 'abandon'
  packageId?: string
  userId?: string
  bookingId?: string
  timestamp: Date
  duration?: number
  error?: string
  metadata?: Record<string, any>
}

class BookingMetricsTracker {
  private events: BookingEvent[] = []
  private sessions: Map<string, BookingSession> = new Map()
  private maxEventsSize = 10000

  /**
   * Track booking event
   */
  trackEvent(event: BookingEvent): void {
    // Add to events log
    this.events.push(event)

    // Maintain events size
    if (this.events.length > this.maxEventsSize) {
      this.events.shift()
    }

    // Track in analytics
    switch (event.type) {
      case 'view':
        trackEvent('booking_view', {
          packageId: event.packageId,
        })
        break

      case 'start':
        trackEvent('booking_start', {
          packageId: event.packageId,
          userId: event.userId,
        })
        this.startSession(event)
        break

      case 'complete':
        trackEvent('booking_complete', {
          packageId: event.packageId,
          userId: event.userId,
          bookingId: event.bookingId,
          duration: event.duration,
        })
        this.completeSession(event)
        break

      case 'confirm':
        trackEvent('booking_confirm', {
          bookingId: event.bookingId,
          userId: event.userId,
          ...event.metadata,
        })
        break

      case 'error':
        trackEvent('booking_error', {
          error: event.error,
          packageId: event.packageId,
          userId: event.userId,
        })

        logger.error('Booking error', new Error(event.error || 'Unknown error'), {
          action: 'booking_error',
          resource: event.packageId,
          userId: event.userId,
          metadata: event.metadata,
        })

        // Alert on high error rate
        const recentErrors = this.events.filter(
          (e) => e.type === 'error' && Date.now() - e.timestamp.getTime() < 5 * 60 * 1000
        ).length

        if (recentErrors > 10) {
          alertManager.triggerAlert({
            type: 'high_error_rate',
            message: `High booking error rate: ${recentErrors} errors in 5 minutes`,
            severity: 'critical',
            context: {
              errorCount: recentErrors,
              recentError: event.error,
            },
          })
        }
        break

      case 'abandon':
        trackEvent('booking_abandon', {
          packageId: event.packageId,
          userId: event.userId,
          duration: event.duration,
        })
        this.abandonSession(event)
        break
    }

    // Log event
    logger.info('Booking event tracked', {
      action: 'booking_event',
      metadata: event,
    })
  }

  /**
   * Start booking session
   */
  private startSession(event: BookingEvent): void {
    if (!event.userId) return

    this.sessions.set(event.userId, {
      userId: event.userId,
      packageId: event.packageId,
      startTime: event.timestamp,
      steps: ['start'],
    })
  }

  /**
   * Complete booking session
   */
  private completeSession(event: BookingEvent): void {
    if (!event.userId) return

    const session = this.sessions.get(event.userId)
    if (session) {
      session.endTime = event.timestamp
      session.bookingId = event.bookingId
      session.steps.push('complete')
      session.duration =
        session.endTime.getTime() - session.startTime.getTime()
    }
  }

  /**
   * Abandon booking session
   */
  private abandonSession(event: BookingEvent): void {
    if (!event.userId) return

    const session = this.sessions.get(event.userId)
    if (session) {
      session.endTime = event.timestamp
      session.abandoned = true
      session.steps.push('abandon')
    }
  }

  /**
   * Get booking metrics
   */
  getMetrics(timeRange?: { start: Date; end: Date }): BookingMetrics {
    const events = timeRange
      ? this.events.filter(
          (e) => e.timestamp >= timeRange.start && e.timestamp <= timeRange.end
        )
      : this.events

    const viewedPackage = events.filter((e) => e.type === 'view').length
    const startedBooking = events.filter((e) => e.type === 'start').length
    const completedForm = events.filter((e) => e.type === 'complete').length
    const confirmedBooking = events.filter((e) => e.type === 'confirm').length

    const bookingErrors = events.filter((e) => e.type === 'error').length
    const paymentFailures = events.filter(
      (e) => e.type === 'error' && e.error?.includes('payment')
    ).length
    const availabilityErrors = events.filter(
      (e) => e.type === 'error' && e.error?.includes('availability')
    ).length

    // Calculate conversion rates
    const formAbandonmentRate =
      startedBooking > 0
        ? ((startedBooking - completedForm) / startedBooking) * 100
        : 0

    // Calculate average booking time
    const completedSessions = Array.from(this.sessions.values()).filter(
      (s) => s.duration !== undefined
    )
    const avgBookingTime =
      completedSessions.length > 0
        ? completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0) /
          completedSessions.length
        : 0

    // Business metrics (would come from database in production)
    const totalBookings = confirmedBooking
    const totalRevenue = 0 // Calculate from actual bookings
    const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0

    return {
      viewedPackage,
      startedBooking,
      completedForm,
      confirmedBooking,
      avgBookingTime,
      formAbandonmentRate,
      totalBookings,
      totalRevenue,
      avgBookingValue,
      bookingErrors,
      paymentFailures,
      availabilityErrors,
    }
  }

  /**
   * Get conversion funnel
   */
  getConversionFunnel(): {
    view: number
    start: number
    complete: number
    confirm: number
    viewToStart: number
    startToComplete: number
    completeToConfirm: number
    overallConversion: number
  } {
    const metrics = this.getMetrics()

    const viewToStart =
      metrics.viewedPackage > 0
        ? (metrics.startedBooking / metrics.viewedPackage) * 100
        : 0

    const startToComplete =
      metrics.startedBooking > 0
        ? (metrics.completedForm / metrics.startedBooking) * 100
        : 0

    const completeToConfirm =
      metrics.completedForm > 0
        ? (metrics.confirmedBooking / metrics.completedForm) * 100
        : 0

    const overallConversion =
      metrics.viewedPackage > 0
        ? (metrics.confirmedBooking / metrics.viewedPackage) * 100
        : 0

    return {
      view: metrics.viewedPackage,
      start: metrics.startedBooking,
      complete: metrics.completedForm,
      confirm: metrics.confirmedBooking,
      viewToStart,
      startToComplete,
      completeToConfirm,
      overallConversion,
    }
  }

  /**
   * Get error breakdown
   */
  getErrorBreakdown(): Record<string, number> {
    const errors: Record<string, number> = {}

    this.events
      .filter((e) => e.type === 'error' && e.error)
      .forEach((e) => {
        const error = e.error || 'Unknown'
        errors[error] = (errors[error] || 0) + 1
      })

    return errors
  }

  /**
   * Get average booking time by step
   */
  getAverageStepTimes(): {
    viewToStart: number
    startToComplete: number
    completeToConfirm: number
  } {
    // This would require more detailed session tracking
    // Simplified version for now
    const completedSessions = Array.from(this.sessions.values()).filter(
      (s) => s.duration !== undefined
    )

    const avgDuration =
      completedSessions.length > 0
        ? completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0) /
          completedSessions.length
        : 0

    return {
      viewToStart: avgDuration * 0.1, // Estimated 10%
      startToComplete: avgDuration * 0.7, // Estimated 70%
      completeToConfirm: avgDuration * 0.2, // Estimated 20%
    }
  }

  /**
   * Clear metrics
   */
  clearMetrics(): void {
    this.events = []
    this.sessions.clear()
    logger.info('Booking metrics cleared', { action: 'clear_metrics' })
  }
}

interface BookingSession {
  userId: string
  packageId?: string
  bookingId?: string
  startTime: Date
  endTime?: Date
  duration?: number
  steps: string[]
  abandoned?: boolean
}

export const bookingMetrics = new BookingMetricsTracker()

/**
 * Booking flow helpers
 */
export const BookingFlow = {
  /**
   * Track package view
   */
  trackView(packageId: string, userId?: string) {
    bookingMetrics.trackEvent({
      type: 'view',
      packageId,
      userId,
      timestamp: new Date(),
    })
  },

  /**
   * Track booking start
   */
  trackStart(packageId: string, userId: string) {
    bookingMetrics.trackEvent({
      type: 'start',
      packageId,
      userId,
      timestamp: new Date(),
    })
  },

  /**
   * Track booking completion
   */
  trackComplete(
    packageId: string,
    userId: string,
    bookingId: string,
    duration: number
  ) {
    bookingMetrics.trackEvent({
      type: 'complete',
      packageId,
      userId,
      bookingId,
      timestamp: new Date(),
      duration,
    })
  },

  /**
   * Track booking confirmation
   */
  trackConfirm(bookingId: string, userId: string, metadata?: Record<string, any>) {
    bookingMetrics.trackEvent({
      type: 'confirm',
      bookingId,
      userId,
      timestamp: new Date(),
      metadata,
    })
  },

  /**
   * Track booking error
   */
  trackError(
    error: string,
    packageId?: string,
    userId?: string,
    metadata?: Record<string, any>
  ) {
    bookingMetrics.trackEvent({
      type: 'error',
      error,
      packageId,
      userId,
      timestamp: new Date(),
      metadata,
    })
  },

  /**
   * Track booking abandonment
   */
  trackAbandon(packageId: string, userId: string, duration: number) {
    bookingMetrics.trackEvent({
      type: 'abandon',
      packageId,
      userId,
      timestamp: new Date(),
      duration,
    })
  },
}

/**
 * Create booking metrics API endpoint
 */
export function createBookingMetricsEndpoint() {
  return {
    getMetrics: (timeRange?: { start: Date; end: Date }) =>
      bookingMetrics.getMetrics(timeRange),
    getConversionFunnel: () => bookingMetrics.getConversionFunnel(),
    getErrorBreakdown: () => bookingMetrics.getErrorBreakdown(),
    getAverageStepTimes: () => bookingMetrics.getAverageStepTimes(),
    clearMetrics: () => bookingMetrics.clearMetrics(),
  }
}
