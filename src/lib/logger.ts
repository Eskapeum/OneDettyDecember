import * as Sentry from '@sentry/nextjs'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  userId?: string
  action?: string
  resource?: string
  metadata?: Record<string, any>
}

class Logger {
  private shouldLog(level: LogLevel): boolean {
    if (process.env.NODE_ENV === 'production') {
      return level !== 'debug'
    }
    return true
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` | ${JSON.stringify(context)}` : ''
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`
  }

  private sendToSentry(level: LogLevel, message: string, context?: LogContext) {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      const sentryLevel =
        level === 'error' ? 'error' : level === 'warn' ? 'warning' : 'info'

      Sentry.captureMessage(message, {
        level: sentryLevel,
        tags: {
          action: context?.action,
          resource: context?.resource,
        },
        extra: {
          ...context?.metadata,
          userId: context?.userId,
        },
      })
    }
  }

  debug(message: string, context?: LogContext) {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, context))
    }
  }

  info(message: string, context?: LogContext) {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message, context))
    }
  }

  warn(message: string, context?: LogContext) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, context))
      this.sendToSentry('warn', message, context)
    }
  }

  error(message: string, error?: Error | unknown, context?: LogContext) {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, context), error)

      if (error instanceof Error) {
        Sentry.captureException(error, {
          tags: {
            action: context?.action,
            resource: context?.resource,
          },
          extra: {
            message,
            ...context?.metadata,
            userId: context?.userId,
          },
        })
      } else {
        this.sendToSentry('error', message, context)
      }
    }
  }

  // Specialized logging methods
  auth = {
    loginSuccess: (userId: string, method: string) => {
      this.info('User logged in successfully', {
        userId,
        action: 'login',
        metadata: { method },
      })
    },
    loginFailed: (email: string, reason: string) => {
      this.warn('Login attempt failed', {
        action: 'login_failed',
        metadata: { email, reason },
      })
    },
    signupSuccess: (userId: string, method: string) => {
      this.info('User signed up successfully', {
        userId,
        action: 'signup',
        metadata: { method },
      })
    },
    signupFailed: (email: string, reason: string) => {
      this.warn('Signup attempt failed', {
        action: 'signup_failed',
        metadata: { email, reason },
      })
    },
    passwordReset: (userId: string) => {
      this.info('Password reset requested', {
        userId,
        action: 'password_reset',
      })
    },
    emailVerified: (userId: string) => {
      this.info('Email verified', {
        userId,
        action: 'email_verified',
      })
    },
  }

  api = {
    requestStart: (method: string, path: string, userId?: string) => {
      this.debug('API request started', {
        userId,
        action: 'api_request',
        resource: path,
        metadata: { method },
      })
    },
    requestSuccess: (method: string, path: string, duration: number) => {
      this.debug('API request completed', {
        action: 'api_success',
        resource: path,
        metadata: { method, duration },
      })
    },
    requestFailed: (method: string, path: string, error: Error, statusCode: number) => {
      this.error('API request failed', error, {
        action: 'api_error',
        resource: path,
        metadata: { method, statusCode },
      })
    },
  }

  booking = {
    created: (bookingId: string, userId: string, packageId: string) => {
      this.info('Booking created', {
        userId,
        action: 'booking_created',
        resource: bookingId,
        metadata: { packageId },
      })
    },
    cancelled: (bookingId: string, userId: string, reason: string) => {
      this.info('Booking cancelled', {
        userId,
        action: 'booking_cancelled',
        resource: bookingId,
        metadata: { reason },
      })
    },
    paymentSuccess: (bookingId: string, amount: number, currency: string) => {
      this.info('Payment successful', {
        action: 'payment_success',
        resource: bookingId,
        metadata: { amount, currency },
      })
    },
    paymentFailed: (bookingId: string, error: Error, amount: number) => {
      this.error('Payment failed', error, {
        action: 'payment_failed',
        resource: bookingId,
        metadata: { amount },
      })
    },
  }

  database = {
    queryStart: (query: string) => {
      this.debug('Database query started', {
        action: 'db_query',
        metadata: { query },
      })
    },
    querySuccess: (query: string, duration: number, rows: number) => {
      this.debug('Database query completed', {
        action: 'db_success',
        metadata: { query, duration, rows },
      })
    },
    queryFailed: (query: string, error: Error) => {
      this.error('Database query failed', error, {
        action: 'db_error',
        metadata: { query },
      })
    },
    connectionError: (error: Error) => {
      this.error('Database connection failed', error, {
        action: 'db_connection_error',
      })
    },
  }
}

// Export singleton instance
export const logger = new Logger()

// Export types
export type { LogLevel, LogContext }
