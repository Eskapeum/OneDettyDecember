/**
 * Payment Monitoring Dashboard
 *
 * Comprehensive payment monitoring, analytics, and alerting system
 * for tracking payment health, fraud detection, and business metrics
 */

import { logger } from '@/lib/logger'
import { alertManager } from '@/lib/alerts'

/**
 * Payment provider types
 */
export type PaymentProvider = 'stripe' | 'paystack'

/**
 * Payment status types
 */
export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'canceled'
  | 'refunded'
  | 'partially_refunded'

/**
 * Payment event types
 */
export type PaymentEventType =
  | 'created'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'refunded'
  | 'disputed'
  | 'webhook_received'
  | 'fraud_detected'

/**
 * Payment metrics interface
 */
export interface PaymentMetrics {
  // Volume metrics
  totalPayments: number
  successfulPayments: number
  failedPayments: number
  refundedPayments: number
  disputedPayments: number

  // Financial metrics
  totalVolume: number // in cents
  successfulVolume: number
  refundedVolume: number
  netVolume: number

  // Performance metrics
  avgProcessingTime: number // milliseconds
  successRate: number // percentage
  failureRate: number // percentage
  refundRate: number // percentage

  // Fraud metrics
  fraudAttempts: number
  fraudPrevented: number
  suspiciousTransactions: number
}

/**
 * Payment event interface
 */
export interface PaymentEvent {
  type: PaymentEventType
  provider: PaymentProvider
  paymentId: string
  bookingId?: string
  userId?: string
  amount: number // in cents
  currency: string
  status: PaymentStatus
  timestamp: Date
  processingTime?: number
  error?: string
  metadata?: Record<string, any>
}

/**
 * Payment alert thresholds
 */
export interface PaymentAlertThresholds {
  // Failure rate
  maxFailureRate: number // percentage (default: 5%)
  failureWindow: number // minutes (default: 15)

  // Processing time
  maxProcessingTime: number // milliseconds (default: 5000)
  slowPaymentThreshold: number // milliseconds (default: 3000)

  // Volume
  minHourlyVolume: number // payments (default: 1)
  maxHourlyVolume: number // payments (default: 1000)

  // Fraud
  maxFraudAttempts: number // per hour (default: 10)
  suspiciousAmountThreshold: number // cents (default: 100000 = $1000)
}

/**
 * Default alert thresholds
 */
const DEFAULT_ALERT_THRESHOLDS: PaymentAlertThresholds = {
  maxFailureRate: 5, // 5%
  failureWindow: 15, // 15 minutes

  maxProcessingTime: 5000, // 5 seconds
  slowPaymentThreshold: 3000, // 3 seconds

  minHourlyVolume: 1,
  maxHourlyVolume: 1000,

  maxFraudAttempts: 10,
  suspiciousAmountThreshold: 100000, // $1000
}

/**
 * Payment monitoring dashboard
 */
class PaymentDashboard {
  private events: PaymentEvent[] = []
  private maxEventsSize = 10000
  private thresholds: PaymentAlertThresholds

  // Provider-specific metrics
  private providerMetrics: Map<PaymentProvider, PaymentMetrics> = new Map()

  constructor(thresholds: Partial<PaymentAlertThresholds> = {}) {
    this.thresholds = { ...DEFAULT_ALERT_THRESHOLDS, ...thresholds }
    this.initializeProviderMetrics()
  }

  /**
   * Initialize metrics for each provider
   */
  private initializeProviderMetrics(): void {
    const providers: PaymentProvider[] = ['stripe', 'paystack']

    providers.forEach((provider) => {
      this.providerMetrics.set(provider, this.getEmptyMetrics())
    })
  }

  /**
   * Get empty metrics object
   */
  private getEmptyMetrics(): PaymentMetrics {
    return {
      totalPayments: 0,
      successfulPayments: 0,
      failedPayments: 0,
      refundedPayments: 0,
      disputedPayments: 0,
      totalVolume: 0,
      successfulVolume: 0,
      refundedVolume: 0,
      netVolume: 0,
      avgProcessingTime: 0,
      successRate: 0,
      failureRate: 0,
      refundRate: 0,
      fraudAttempts: 0,
      fraudPrevented: 0,
      suspiciousTransactions: 0,
    }
  }

  /**
   * Track payment event
   */
  trackEvent(event: PaymentEvent): void {
    // Add to events log
    this.events.push(event)

    // Maintain events size
    if (this.events.length > this.maxEventsSize) {
      this.events.shift()
    }

    // Update provider metrics
    this.updateProviderMetrics(event)

    // Check alerts
    this.checkAlerts(event)

    // Log event
    logger.info('Payment event tracked', {
      action: 'payment_event',
      metadata: {
        type: event.type,
        provider: event.provider,
        paymentId: event.paymentId,
        amount: event.amount,
        status: event.status,
      }
    })
  }

  /**
   * Update provider metrics
   */
  private updateProviderMetrics(event: PaymentEvent): void {
    const metrics = this.providerMetrics.get(event.provider)
    if (!metrics) return

    // Update counts
    metrics.totalPayments++
    metrics.totalVolume += event.amount

    switch (event.status) {
      case 'succeeded':
        metrics.successfulPayments++
        metrics.successfulVolume += event.amount
        break

      case 'failed':
        metrics.failedPayments++
        break

      case 'refunded':
      case 'partially_refunded':
        metrics.refundedPayments++
        metrics.refundedVolume += event.amount
        break

      case 'disputed':
        metrics.disputedPayments++
        break
    }

    // Calculate rates
    if (metrics.totalPayments > 0) {
      metrics.successRate = (metrics.successfulPayments / metrics.totalPayments) * 100
      metrics.failureRate = (metrics.failedPayments / metrics.totalPayments) * 100
      metrics.refundRate = (metrics.refundedPayments / metrics.totalPayments) * 100
    }

    // Calculate net volume
    metrics.netVolume = metrics.successfulVolume - metrics.refundedVolume

    // Update processing time
    if (event.processingTime) {
      const totalProcessingTime = metrics.avgProcessingTime * (metrics.totalPayments - 1)
      metrics.avgProcessingTime = (totalProcessingTime + event.processingTime) / metrics.totalPayments
    }

    // Track fraud
    if (event.type === 'fraud_detected') {
      metrics.fraudAttempts++
      if (event.status === 'failed') {
        metrics.fraudPrevented++
      }
    }

    // Track suspicious transactions
    if (event.amount > this.thresholds.suspiciousAmountThreshold) {
      metrics.suspiciousTransactions++
    }
  }

  /**
   * Check alert thresholds
   */
  private checkAlerts(event: PaymentEvent): void {
    // Check failure rate
    this.checkFailureRate(event.provider)

    // Check processing time
    if (event.processingTime && event.processingTime > this.thresholds.maxProcessingTime) {
      alertManager.triggerAlert({
        type: 'slow_response',
        message: `Payment processing exceeded threshold: ${event.processingTime}ms`,
        severity: 'warning',
        context: {
          paymentId: event.paymentId,
          provider: event.provider,
          processingTime: event.processingTime,
          threshold: this.thresholds.maxProcessingTime,
        }
      })
    }

    // Check fraud
    if (event.type === 'fraud_detected') {
      const recentFraud = this.events.filter(
        (e) =>
          e.type === 'fraud_detected' &&
          Date.now() - e.timestamp.getTime() < 60 * 60 * 1000 // last hour
      ).length

      if (recentFraud > this.thresholds.maxFraudAttempts) {
        alertManager.triggerAlert({
          type: 'security_violation',
          message: `High fraud attempt rate: ${recentFraud} attempts in last hour`,
          severity: 'critical',
          context: {
            attempts: recentFraud,
            threshold: this.thresholds.maxFraudAttempts,
            provider: event.provider,
          }
        })
      }
    }

    // Check suspicious amount
    if (event.amount > this.thresholds.suspiciousAmountThreshold) {
      logger.warn('Suspicious payment amount detected', {
        action: 'suspicious_payment',
        metadata: {
          paymentId: event.paymentId,
          amount: event.amount,
          threshold: this.thresholds.suspiciousAmountThreshold,
          userId: event.userId,
        }
      })
    }
  }

  /**
   * Check failure rate threshold
   */
  private checkFailureRate(provider: PaymentProvider): void {
    const windowMs = this.thresholds.failureWindow * 60 * 1000
    const recentEvents = this.events.filter(
      (e) =>
        e.provider === provider &&
        Date.now() - e.timestamp.getTime() < windowMs
    )

    if (recentEvents.length === 0) return

    const failed = recentEvents.filter((e) => e.status === 'failed').length
    const failureRate = (failed / recentEvents.length) * 100

    if (failureRate > this.thresholds.maxFailureRate) {
      alertManager.triggerAlert({
        type: 'high_error_rate',
        message: `High payment failure rate: ${failureRate.toFixed(2)}%`,
        severity: 'critical',
        context: {
          provider,
          failureRate,
          threshold: this.thresholds.maxFailureRate,
          failedCount: failed,
          totalCount: recentEvents.length,
          window: this.thresholds.failureWindow,
        }
      })
    }
  }

  /**
   * Get metrics for a specific provider
   */
  getProviderMetrics(provider: PaymentProvider): PaymentMetrics {
    return { ...this.providerMetrics.get(provider)! }
  }

  /**
   * Get overall metrics (all providers combined)
   */
  getOverallMetrics(): PaymentMetrics {
    const overall = this.getEmptyMetrics()

    this.providerMetrics.forEach((metrics) => {
      overall.totalPayments += metrics.totalPayments
      overall.successfulPayments += metrics.successfulPayments
      overall.failedPayments += metrics.failedPayments
      overall.refundedPayments += metrics.refundedPayments
      overall.disputedPayments += metrics.disputedPayments

      overall.totalVolume += metrics.totalVolume
      overall.successfulVolume += metrics.successfulVolume
      overall.refundedVolume += metrics.refundedVolume
      overall.netVolume += metrics.netVolume

      overall.fraudAttempts += metrics.fraudAttempts
      overall.fraudPrevented += metrics.fraudPrevented
      overall.suspiciousTransactions += metrics.suspiciousTransactions
    })

    // Calculate overall rates
    if (overall.totalPayments > 0) {
      overall.successRate = (overall.successfulPayments / overall.totalPayments) * 100
      overall.failureRate = (overall.failedPayments / overall.totalPayments) * 100
      overall.refundRate = (overall.refundedPayments / overall.totalPayments) * 100
    }

    // Calculate average processing time
    const processingTimes = Array.from(this.providerMetrics.values())
      .map((m) => m.avgProcessingTime)
      .filter((t) => t > 0)

    if (processingTimes.length > 0) {
      overall.avgProcessingTime =
        processingTimes.reduce((sum, t) => sum + t, 0) / processingTimes.length
    }

    return overall
  }

  /**
   * Get payment breakdown by status
   */
  getPaymentBreakdown(provider?: PaymentProvider): Record<PaymentStatus, number> {
    const events = provider
      ? this.events.filter((e) => e.provider === provider)
      : this.events

    const breakdown: Record<string, number> = {}

    events.forEach((event) => {
      breakdown[event.status] = (breakdown[event.status] || 0) + 1
    })

    return breakdown as Record<PaymentStatus, number>
  }

  /**
   * Get payment volume over time
   */
  getVolumeOverTime(
    interval: 'hour' | 'day' | 'week' | 'month',
    provider?: PaymentProvider
  ): Array<{ timestamp: Date; volume: number; count: number }> {
    const events = provider
      ? this.events.filter((e) => e.provider === provider && e.status === 'succeeded')
      : this.events.filter((e) => e.status === 'succeeded')

    const intervalMs = {
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
    }[interval]

    const grouped = new Map<number, { volume: number; count: number }>()

    events.forEach((event) => {
      const bucket = Math.floor(event.timestamp.getTime() / intervalMs) * intervalMs

      const existing = grouped.get(bucket) || { volume: 0, count: 0 }
      existing.volume += event.amount
      existing.count++
      grouped.set(bucket, existing)
    })

    return Array.from(grouped.entries())
      .map(([timestamp, data]) => ({
        timestamp: new Date(timestamp),
        volume: data.volume,
        count: data.count,
      }))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  }

  /**
   * Get recent payment events
   */
  getRecentEvents(limit: number = 50, provider?: PaymentProvider): PaymentEvent[] {
    const events = provider
      ? this.events.filter((e) => e.provider === provider)
      : this.events

    return events.slice(-limit).reverse()
  }

  /**
   * Get failed payments with errors
   */
  getFailedPayments(limit: number = 20, provider?: PaymentProvider): PaymentEvent[] {
    const failed = this.events.filter(
      (e) =>
        e.status === 'failed' &&
        (provider ? e.provider === provider : true)
    )

    return failed.slice(-limit).reverse()
  }

  /**
   * Get error breakdown
   */
  getErrorBreakdown(provider?: PaymentProvider): Record<string, number> {
    const failed = this.events.filter(
      (e) =>
        e.status === 'failed' &&
        e.error &&
        (provider ? e.provider === provider : true)
    )

    const breakdown: Record<string, number> = {}

    failed.forEach((event) => {
      const error = event.error || 'Unknown'
      breakdown[error] = (breakdown[error] || 0) + 1
    })

    return breakdown
  }

  /**
   * Get health status
   */
  getHealthStatus(): {
    status: 'healthy' | 'degraded' | 'unhealthy'
    issues: string[]
    metrics: PaymentMetrics
  } {
    const metrics = this.getOverallMetrics()
    const issues: string[] = []
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'

    // Check failure rate
    if (metrics.failureRate > this.thresholds.maxFailureRate * 2) {
      issues.push(`Critical failure rate: ${metrics.failureRate.toFixed(2)}%`)
      status = 'unhealthy'
    } else if (metrics.failureRate > this.thresholds.maxFailureRate) {
      issues.push(`High failure rate: ${metrics.failureRate.toFixed(2)}%`)
      status = status === 'healthy' ? 'degraded' : status
    }

    // Check processing time
    if (metrics.avgProcessingTime > this.thresholds.maxProcessingTime) {
      issues.push(`Slow processing: ${metrics.avgProcessingTime.toFixed(0)}ms`)
      status = status === 'healthy' ? 'degraded' : status
    }

    // Check fraud
    if (metrics.fraudAttempts > this.thresholds.maxFraudAttempts) {
      issues.push(`High fraud attempts: ${metrics.fraudAttempts}`)
      status = 'unhealthy'
    }

    return { status, issues, metrics }
  }

  /**
   * Clear old events (keep only recent data)
   */
  clearOldEvents(retentionDays: number = 30): number {
    const retentionMs = retentionDays * 24 * 60 * 60 * 1000
    const cutoff = Date.now() - retentionMs

    const beforeCount = this.events.length
    this.events = this.events.filter((e) => e.timestamp.getTime() > cutoff)

    const cleared = beforeCount - this.events.length

    logger.info('Cleared old payment events', {
      action: 'clear_old_events',
      metadata: { cleared, retentionDays }
    })

    return cleared
  }

  /**
   * Update alert thresholds
   */
  updateThresholds(updates: Partial<PaymentAlertThresholds>): void {
    this.thresholds = { ...this.thresholds, ...updates }

    logger.info('Payment alert thresholds updated', {
      action: 'update_thresholds',
      metadata: this.thresholds
    })
  }

  /**
   * Get current thresholds
   */
  getThresholds(): PaymentAlertThresholds {
    return { ...this.thresholds }
  }
}

/**
 * Singleton instance
 */
export const paymentDashboard = new PaymentDashboard()

/**
 * Payment tracking helpers
 */
export const PaymentTracking = {
  /**
   * Track payment created
   */
  trackCreated(payment: {
    provider: PaymentProvider
    paymentId: string
    bookingId?: string
    userId?: string
    amount: number
    currency: string
  }) {
    paymentDashboard.trackEvent({
      type: 'created',
      provider: payment.provider,
      paymentId: payment.paymentId,
      bookingId: payment.bookingId,
      userId: payment.userId,
      amount: payment.amount,
      currency: payment.currency,
      status: 'pending',
      timestamp: new Date(),
    })
  },

  /**
   * Track payment processing
   */
  trackProcessing(payment: {
    provider: PaymentProvider
    paymentId: string
    processingTime?: number
  }) {
    paymentDashboard.trackEvent({
      type: 'processing',
      provider: payment.provider,
      paymentId: payment.paymentId,
      amount: 0, // Will be updated on success
      currency: 'USD',
      status: 'processing',
      timestamp: new Date(),
      processingTime: payment.processingTime,
    })
  },

  /**
   * Track payment succeeded
   */
  trackSucceeded(payment: {
    provider: PaymentProvider
    paymentId: string
    bookingId?: string
    userId?: string
    amount: number
    currency: string
    processingTime?: number
  }) {
    paymentDashboard.trackEvent({
      type: 'succeeded',
      provider: payment.provider,
      paymentId: payment.paymentId,
      bookingId: payment.bookingId,
      userId: payment.userId,
      amount: payment.amount,
      currency: payment.currency,
      status: 'succeeded',
      timestamp: new Date(),
      processingTime: payment.processingTime,
    })
  },

  /**
   * Track payment failed
   */
  trackFailed(payment: {
    provider: PaymentProvider
    paymentId: string
    bookingId?: string
    userId?: string
    amount: number
    currency: string
    error: string
    processingTime?: number
  }) {
    paymentDashboard.trackEvent({
      type: 'failed',
      provider: payment.provider,
      paymentId: payment.paymentId,
      bookingId: payment.bookingId,
      userId: payment.userId,
      amount: payment.amount,
      currency: payment.currency,
      status: 'failed',
      timestamp: new Date(),
      error: payment.error,
      processingTime: payment.processingTime,
    })
  },

  /**
   * Track payment refunded
   */
  trackRefunded(payment: {
    provider: PaymentProvider
    paymentId: string
    bookingId?: string
    userId?: string
    amount: number
    currency: string
    partial?: boolean
  }) {
    paymentDashboard.trackEvent({
      type: 'refunded',
      provider: payment.provider,
      paymentId: payment.paymentId,
      bookingId: payment.bookingId,
      userId: payment.userId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.partial ? 'partially_refunded' : 'refunded',
      timestamp: new Date(),
    })
  },

  /**
   * Track fraud detected
   */
  trackFraud(payment: {
    provider: PaymentProvider
    paymentId: string
    userId?: string
    amount: number
    reason: string
  }) {
    paymentDashboard.trackEvent({
      type: 'fraud_detected',
      provider: payment.provider,
      paymentId: payment.paymentId,
      userId: payment.userId,
      amount: payment.amount,
      currency: 'USD',
      status: 'failed',
      timestamp: new Date(),
      error: payment.reason,
    })
  },
}

/**
 * Create payment dashboard API endpoints
 */
export function createPaymentDashboardEndpoints() {
  return {
    getOverallMetrics: () => paymentDashboard.getOverallMetrics(),
    getProviderMetrics: (provider: PaymentProvider) =>
      paymentDashboard.getProviderMetrics(provider),
    getPaymentBreakdown: (provider?: PaymentProvider) =>
      paymentDashboard.getPaymentBreakdown(provider),
    getVolumeOverTime: (interval: 'hour' | 'day' | 'week' | 'month', provider?: PaymentProvider) =>
      paymentDashboard.getVolumeOverTime(interval, provider),
    getRecentEvents: (limit?: number, provider?: PaymentProvider) =>
      paymentDashboard.getRecentEvents(limit, provider),
    getFailedPayments: (limit?: number, provider?: PaymentProvider) =>
      paymentDashboard.getFailedPayments(limit, provider),
    getErrorBreakdown: (provider?: PaymentProvider) =>
      paymentDashboard.getErrorBreakdown(provider),
    getHealthStatus: () => paymentDashboard.getHealthStatus(),
  }
}
