import * as Sentry from '@sentry/nextjs'
import { logger } from './logger'

interface AlertConfig {
  enabled: boolean
  threshold: number
  window: number // in minutes
  cooldown: number // in minutes
}

interface Alert {
  type: AlertType
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  context?: Record<string, any>
  timestamp: Date
}

type AlertType =
  | 'high_error_rate'
  | 'slow_response'
  | 'database_error'
  | 'payment_failure'
  | 'auth_failure'
  | 'api_down'

class AlertManager {
  private config: Record<AlertType, AlertConfig> = {
    high_error_rate: {
      enabled: true,
      threshold: 10, // 10 errors
      window: 5, // in 5 minutes
      cooldown: 15, // don't alert again for 15 min
    },
    slow_response: {
      enabled: true,
      threshold: 5, // 5 slow requests
      window: 5,
      cooldown: 10,
    },
    database_error: {
      enabled: true,
      threshold: 3,
      window: 5,
      cooldown: 15,
    },
    payment_failure: {
      enabled: true,
      threshold: 3,
      window: 10,
      cooldown: 30,
    },
    auth_failure: {
      enabled: true,
      threshold: 10,
      window: 5,
      cooldown: 10,
    },
    api_down: {
      enabled: true,
      threshold: 1,
      window: 1,
      cooldown: 5,
    },
  }

  private alertHistory: Map<AlertType, Date> = new Map()

  private shouldAlert(type: AlertType): boolean {
    const config = this.config[type]
    if (!config.enabled) return false

    const lastAlert = this.alertHistory.get(type)
    if (!lastAlert) return true

    const cooldownMs = config.cooldown * 60 * 1000
    const timeSinceLastAlert = Date.now() - lastAlert.getTime()

    return timeSinceLastAlert > cooldownMs
  }

  private recordAlert(type: AlertType) {
    this.alertHistory.set(type, new Date())
  }

  private sendAlert(alert: Alert) {
    // Log to console
    logger.warn(`ALERT [${alert.severity.toUpperCase()}]: ${alert.message}`, {
      action: 'alert_triggered',
      metadata: {
        type: alert.type,
        ...alert.context,
      },
    })

    // Send to Sentry
    Sentry.captureMessage(`Alert: ${alert.message}`, {
      level: alert.severity === 'critical' ? 'fatal' : 'warning',
      tags: {
        alert_type: alert.type,
        severity: alert.severity,
      },
      extra: alert.context,
    })

    // In production, you could also:
    // - Send to Slack/Discord webhook
    // - Send email via Resend
    // - Trigger PagerDuty
    // - Send SMS via Twilio
  }

  triggerAlert(alert: Omit<Alert, 'timestamp'>) {
    if (!this.shouldAlert(alert.type)) {
      return
    }

    const fullAlert: Alert = {
      ...alert,
      timestamp: new Date(),
    }

    this.sendAlert(fullAlert)
    this.recordAlert(alert.type)
  }

  // Convenience methods for common alerts
  highErrorRate(count: number, errors: string[]) {
    this.triggerAlert({
      type: 'high_error_rate',
      severity: 'high',
      message: `High error rate detected: ${count} errors in last 5 minutes`,
      context: {
        count,
        errors: errors.slice(0, 5), // First 5 errors
      },
    })
  }

  slowResponse(endpoint: string, duration: number) {
    this.triggerAlert({
      type: 'slow_response',
      severity: 'medium',
      message: `Slow response detected: ${endpoint} took ${duration}ms`,
      context: {
        endpoint,
        duration,
      },
    })
  }

  databaseError(error: Error, query?: string) {
    this.triggerAlert({
      type: 'database_error',
      severity: 'critical',
      message: `Database error: ${error.message}`,
      context: {
        error: error.message,
        stack: error.stack,
        query,
      },
    })
  }

  paymentFailure(bookingId: string, amount: number, error: string) {
    this.triggerAlert({
      type: 'payment_failure',
      severity: 'high',
      message: `Payment failure for booking ${bookingId}`,
      context: {
        bookingId,
        amount,
        error,
      },
    })
  }

  authFailure(count: number, ips: string[]) {
    this.triggerAlert({
      type: 'auth_failure',
      severity: 'medium',
      message: `Multiple auth failures detected: ${count} attempts`,
      context: {
        count,
        ips: ips.slice(0, 5),
      },
    })
  }

  apiDown(service: string) {
    this.triggerAlert({
      type: 'api_down',
      severity: 'critical',
      message: `API endpoint down: ${service}`,
      context: {
        service,
      },
    })
  }
}

// Export singleton
export const alertManager = new AlertManager()

// Export types
export type { Alert, AlertType, AlertConfig }
