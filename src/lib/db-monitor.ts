/**
 * Database Query Monitoring & Performance Tracking
 *
 * Provides utilities for monitoring database performance,
 * slow queries, and optimization insights
 */

import { logger } from './logger'
import { alertManager } from './alerts'

export interface QueryMetrics {
  query: string
  duration: number
  timestamp: Date
  success: boolean
  error?: Error
  model?: string
  operation?: string
  rowCount?: number
}

export interface SlowQueryThresholds {
  warning: number // milliseconds
  critical: number // milliseconds
}

class DatabaseMonitor {
  private queryLog: QueryMetrics[] = []
  private slowQueries: Map<string, number> = new Map()
  private maxLogSize = 1000

  // Thresholds in milliseconds
  private thresholds: SlowQueryThresholds = {
    warning: 500, // 500ms
    critical: 1000, // 1s
  }

  /**
   * Track a database query
   */
  trackQuery(metrics: QueryMetrics): void {
    // Add to log
    this.queryLog.push(metrics)

    // Maintain log size
    if (this.queryLog.length > this.maxLogSize) {
      this.queryLog.shift()
    }

    // Track slow queries
    if (metrics.duration > this.thresholds.warning) {
      const queryKey = this.normalizeQuery(metrics.query)
      const count = this.slowQueries.get(queryKey) || 0
      this.slowQueries.set(queryKey, count + 1)

      // Log slow query
      if (metrics.duration > this.thresholds.critical) {
        logger.warn('Critical slow query detected', {
          action: 'slow_query',
          resource: metrics.model,
          metadata: {
            query: queryKey,
            duration: metrics.duration,
            threshold: this.thresholds.critical,
            rowCount: metrics.rowCount,
          },
        })

        // Alert on critical slow queries
        if (count > 5) {
          alertManager.triggerAlert({
            type: 'slow_response',
            message: `Critical slow query: ${queryKey}`,
            severity: 'critical',
            context: {
              query: queryKey,
              duration: metrics.duration,
              occurrences: count,
            },
          })
        }
      } else {
        logger.debug('Slow query detected', {
          action: 'slow_query',
          resource: metrics.model,
          metadata: {
            query: queryKey,
            duration: metrics.duration,
            threshold: this.thresholds.warning,
          },
        })
      }
    }

    // Track failed queries
    if (!metrics.success && metrics.error) {
      logger.error('Database query failed', metrics.error, {
        action: 'query_error',
        resource: metrics.model,
        metadata: {
          query: this.normalizeQuery(metrics.query),
          operation: metrics.operation,
        },
      })
    }
  }

  /**
   * Normalize query for tracking (remove dynamic values)
   */
  private normalizeQuery(query: string): string {
    return query
      .replace(/'[^']*'/g, '?') // Replace string literals
      .replace(/\d+/g, '?') // Replace numbers
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .substring(0, 200) // Limit length
  }

  /**
   * Get query statistics
   */
  getStatistics(): {
    totalQueries: number
    slowQueries: number
    failedQueries: number
    avgDuration: number
    p95Duration: number
    p99Duration: number
  } {
    const totalQueries = this.queryLog.length
    const slowQueries = this.queryLog.filter(
      (q) => q.duration > this.thresholds.warning
    ).length
    const failedQueries = this.queryLog.filter((q) => !q.success).length

    const durations = this.queryLog.map((q) => q.duration).sort((a, b) => a - b)
    const avgDuration =
      durations.reduce((sum, d) => sum + d, 0) / durations.length || 0
    const p95Index = Math.floor(durations.length * 0.95)
    const p99Index = Math.floor(durations.length * 0.99)

    return {
      totalQueries,
      slowQueries,
      failedQueries,
      avgDuration: Math.round(avgDuration),
      p95Duration: durations[p95Index] || 0,
      p99Duration: durations[p99Index] || 0,
    }
  }

  /**
   * Get top slow queries
   */
  getSlowQueries(limit: number = 10): Array<{ query: string; count: number }> {
    return Array.from(this.slowQueries.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([query, count]) => ({ query, count }))
  }

  /**
   * Get recent queries
   */
  getRecentQueries(limit: number = 20): QueryMetrics[] {
    return this.queryLog.slice(-limit).reverse()
  }

  /**
   * Clear query log
   */
  clearLog(): void {
    this.queryLog = []
    this.slowQueries.clear()
    logger.info('Database query log cleared', { action: 'clear_log' })
  }

  /**
   * Set slow query thresholds
   */
  setThresholds(thresholds: Partial<SlowQueryThresholds>): void {
    this.thresholds = { ...this.thresholds, ...thresholds }
    logger.info('Database thresholds updated', {
      action: 'update_thresholds',
      metadata: this.thresholds,
    })
  }

  /**
   * Get current thresholds
   */
  getThresholds(): SlowQueryThresholds {
    return { ...this.thresholds }
  }
}

export const dbMonitor = new DatabaseMonitor()

/**
 * Middleware to track Prisma queries
 */
export function withQueryTracking<T>(
  operation: () => Promise<T>,
  context: {
    model?: string
    operation?: string
    query: string
  }
): Promise<T> {
  const startTime = Date.now()

  return operation()
    .then((result) => {
      const duration = Date.now() - startTime

      dbMonitor.trackQuery({
        query: context.query,
        duration,
        timestamp: new Date(),
        success: true,
        model: context.model,
        operation: context.operation,
        rowCount: Array.isArray(result) ? result.length : 1,
      })

      return result
    })
    .catch((error) => {
      const duration = Date.now() - startTime

      dbMonitor.trackQuery({
        query: context.query,
        duration,
        timestamp: new Date(),
        success: false,
        error,
        model: context.model,
        operation: context.operation,
      })

      throw error
    })
}

/**
 * Booking-specific query helpers
 */
export const BookingQueries = {
  /**
   * Track booking creation query
   */
  async create<T>(operation: () => Promise<T>): Promise<T> {
    return withQueryTracking(operation, {
      model: 'booking',
      operation: 'create',
      query: 'INSERT INTO bookings ...',
    })
  },

  /**
   * Track booking availability query
   */
  async checkAvailability<T>(
    packageId: string,
    operation: () => Promise<T>
  ): Promise<T> {
    return withQueryTracking(operation, {
      model: 'booking',
      operation: 'availability',
      query: `SELECT * FROM bookings WHERE packageId = '${packageId}' AND status IN ('CONFIRMED', 'PENDING')`,
    })
  },

  /**
   * Track user bookings query
   */
  async getUserBookings<T>(
    userId: string,
    operation: () => Promise<T>
  ): Promise<T> {
    return withQueryTracking(operation, {
      model: 'booking',
      operation: 'list',
      query: `SELECT * FROM bookings WHERE userId = '${userId}' ORDER BY bookingDate DESC`,
    })
  },

  /**
   * Track booking update query
   */
  async update<T>(
    bookingId: string,
    operation: () => Promise<T>
  ): Promise<T> {
    return withQueryTracking(operation, {
      model: 'booking',
      operation: 'update',
      query: `UPDATE bookings SET ... WHERE id = '${bookingId}'`,
    })
  },
}

/**
 * Package-specific query helpers
 */
export const PackageQueries = {
  /**
   * Track package detail query
   */
  async getDetails<T>(
    packageId: string,
    operation: () => Promise<T>
  ): Promise<T> {
    return withQueryTracking(operation, {
      model: 'package',
      operation: 'get',
      query: `SELECT * FROM packages WHERE id = '${packageId}'`,
    })
  },

  /**
   * Track package availability query
   */
  async checkAvailability<T>(
    packageId: string,
    operation: () => Promise<T>
  ): Promise<T> {
    return withQueryTracking(operation, {
      model: 'package',
      operation: 'availability',
      query: `SELECT availableSlots FROM packages WHERE id = '${packageId}' AND status = 'PUBLISHED'`,
    })
  },

  /**
   * Track package search query
   */
  async search<T>(operation: () => Promise<T>): Promise<T> {
    return withQueryTracking(operation, {
      model: 'package',
      operation: 'search',
      query: 'SELECT * FROM packages WHERE search_vector @@ to_tsquery(...)',
    })
  },
}

/**
 * Database health check
 */
export async function checkDatabaseHealth(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy'
  metrics: ReturnType<typeof dbMonitor.getStatistics>
  slowQueries: ReturnType<typeof dbMonitor.getSlowQueries>
}> {
  const metrics = dbMonitor.getStatistics()
  const slowQueries = dbMonitor.getSlowQueries(5)

  let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'

  // Determine health status
  if (metrics.p99Duration > 2000 || metrics.failedQueries > 10) {
    status = 'unhealthy'
  } else if (metrics.p95Duration > 1000 || metrics.slowQueries > 20) {
    status = 'degraded'
  }

  // Log health status
  logger.info('Database health check', {
    action: 'health_check',
    metadata: { status, ...metrics },
  })

  // Alert on unhealthy status
  if (status === 'unhealthy') {
    alertManager.triggerAlert({
      type: 'database_error',
      message: 'Database health is unhealthy',
      severity: 'critical',
      context: { metrics, slowQueries },
    })
  }

  return { status, metrics, slowQueries }
}

/**
 * Export for API routes
 */
export function createDatabaseMonitoringEndpoint() {
  return {
    getStatistics: () => dbMonitor.getStatistics(),
    getSlowQueries: (limit?: number) => dbMonitor.getSlowQueries(limit),
    getRecentQueries: (limit?: number) => dbMonitor.getRecentQueries(limit),
    checkHealth: () => checkDatabaseHealth(),
    clearLog: () => dbMonitor.clearLog(),
  }
}
