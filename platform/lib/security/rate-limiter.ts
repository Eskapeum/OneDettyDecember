/**
 * Rate Limiting Configuration for Payment Endpoints
 *
 * Implements token bucket algorithm for rate limiting to prevent:
 * - Payment abuse
 * - Brute force attacks
 * - DDoS attacks
 * - Resource exhaustion
 */

import { logger } from '@/lib/logger'
import { alertManager } from '@/lib/alerts'

/**
 * Rate limit configuration per endpoint type
 */
export interface RateLimitConfig {
  maxRequests: number // Maximum requests in window
  windowMs: number // Time window in milliseconds
  skipSuccessfulRequests?: boolean // Don't count successful requests
  skipFailedRequests?: boolean // Don't count failed requests
  keyGenerator?: (req: any) => string // Custom key generator
}

/**
 * Default rate limits for different endpoint types
 */
export const RATE_LIMITS = {
  // Payment creation (strict)
  payment: {
    maxRequests: 10,
    windowMs: 15 * 60 * 1000, // 15 minutes
  } as RateLimitConfig,

  // Payment webhook (very strict - should only come from payment providers)
  webhook: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
  } as RateLimitConfig,

  // Refund requests (very strict)
  refund: {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
  } as RateLimitConfig,

  // Payment status check (moderate)
  status: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minute
  } as RateLimitConfig,

  // General API (lenient)
  api: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
  } as RateLimitConfig,
}

/**
 * Rate limiter using in-memory token bucket
 */
class RateLimiter {
  private buckets: Map<
    string,
    {
      tokens: number
      lastRefill: number
      violations: number
    }
  > = new Map()

  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    // Clean up old buckets every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  /**
   * Check if request is allowed
   */
  async isAllowed(
    key: string,
    config: RateLimitConfig
  ): Promise<{
    allowed: boolean
    remaining: number
    resetAt: number
  }> {
    const now = Date.now()
    const bucket = this.buckets.get(key)

    // Initialize bucket if not exists
    if (!bucket) {
      this.buckets.set(key, {
        tokens: config.maxRequests - 1,
        lastRefill: now,
        violations: 0,
      })

      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetAt: now + config.windowMs,
      }
    }

    // Refill tokens based on time passed
    const timeSinceLastRefill = now - bucket.lastRefill
    const refillAmount = Math.floor(
      (timeSinceLastRefill / config.windowMs) * config.maxRequests
    )

    if (refillAmount > 0) {
      bucket.tokens = Math.min(
        config.maxRequests,
        bucket.tokens + refillAmount
      )
      bucket.lastRefill = now
    }

    // Check if tokens available
    if (bucket.tokens > 0) {
      bucket.tokens--
      return {
        allowed: true,
        remaining: bucket.tokens,
        resetAt: bucket.lastRefill + config.windowMs,
      }
    }

    // Rate limit exceeded
    bucket.violations++

    // Alert on repeated violations
    if (bucket.violations > 5) {
      this.handleRateLimitViolation(key, bucket.violations)
    }

    return {
      allowed: false,
      remaining: 0,
      resetAt: bucket.lastRefill + config.windowMs,
    }
  }

  /**
   * Handle rate limit violation
   */
  private handleRateLimitViolation(key: string, violations: number): void {
    logger.warn('Rate limit violation detected', {
      action: 'rate_limit_violation',
      metadata: {
        key,
        violations,
      }
    })

    if (violations > 10) {
      alertManager.triggerAlert({
        type: 'security_violation',
        message: `Severe rate limit violation: ${violations} attempts`,
        severity: 'critical',
        context: {
          key,
          violations,
        }
      })
    }
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    this.buckets.delete(key)
    logger.info('Rate limit reset', {
      action: 'rate_limit_reset',
      metadata: { key }
    })
  }

  /**
   * Clean up old buckets
   */
  private cleanup(): void {
    const now = Date.now()
    const maxAge = 60 * 60 * 1000 // 1 hour

    let cleaned = 0
    this.buckets.forEach((bucket, key) => {
      if (now - bucket.lastRefill > maxAge) {
        this.buckets.delete(key)
        cleaned++
      }
    })

    if (cleaned > 0) {
      logger.debug('Rate limiter cleanup', {
        action: 'rate_limit_cleanup',
        metadata: { cleaned }
      })
    }
  }

  /**
   * Get current bucket state (for debugging)
   */
  getBucketState(key: string): {
    tokens: number
    violations: number
    lastRefill: number
  } | null {
    const bucket = this.buckets.get(key)
    return bucket ? { ...bucket } : null
  }

  /**
   * Cleanup on shutdown
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.buckets.clear()
  }
}

/**
 * Singleton instance
 */
export const rateLimiter = new RateLimiter()

/**
 * Generate rate limit key from request
 */
export function generateRateLimitKey(
  req: any,
  prefix: string = 'general'
): string {
  // Use IP + User ID if authenticated, otherwise just IP
  const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.ip || 'unknown'
  const userId = req.userId || req.user?.id

  return userId ? `${prefix}:user:${userId}` : `${prefix}:ip:${ip}`
}

/**
 * Express/Next.js middleware factory
 */
export function createRateLimitMiddleware(
  endpointType: keyof typeof RATE_LIMITS,
  customConfig?: Partial<RateLimitConfig>
) {
  const config = {
    ...RATE_LIMITS[endpointType],
    ...customConfig,
  }

  return async (req: any, res: any, next: () => void) => {
    const key = config.keyGenerator
      ? config.keyGenerator(req)
      : generateRateLimitKey(req, endpointType)

    const result = await rateLimiter.isAllowed(key, config)

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', config.maxRequests.toString())
    res.setHeader('X-RateLimit-Remaining', result.remaining.toString())
    res.setHeader('X-RateLimit-Reset', new Date(result.resetAt).toISOString())

    if (!result.allowed) {
      logger.warn('Rate limit exceeded', {
        action: 'rate_limit_exceeded',
        metadata: {
          key,
          endpoint: endpointType,
          resetAt: new Date(result.resetAt).toISOString(),
        }
      })

      res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000),
        resetAt: new Date(result.resetAt).toISOString(),
      })

      return
    }

    next()
  }
}

/**
 * Next.js API route wrapper
 */
export function withRateLimit<T>(
  handler: (req: any, res: any) => Promise<T>,
  endpointType: keyof typeof RATE_LIMITS,
  customConfig?: Partial<RateLimitConfig>
) {
  const middleware = createRateLimitMiddleware(endpointType, customConfig)

  return async (req: any, res: any): Promise<T | void> => {
    return new Promise((resolve, reject) => {
      middleware(req, res, () => {
        handler(req, res).then(resolve).catch(reject)
      })
    })
  }
}

/**
 * IP-based rate limiter for webhooks (stricter)
 */
export function createWebhookRateLimiter(allowedIPs?: string[]) {
  return async (req: any, res: any, next: () => void) => {
    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.ip

    // Check if IP is in allowlist
    if (allowedIPs && allowedIPs.length > 0) {
      if (!allowedIPs.includes(ip)) {
        logger.warn('Webhook request from unauthorized IP', {
          action: 'webhook_unauthorized_ip',
          metadata: { ip }
        })

        res.status(403).json({
          error: 'Forbidden',
          message: 'Unauthorized IP address',
        })

        return
      }
    }

    // Apply standard rate limiting
    const key = `webhook:ip:${ip}`
    const result = await rateLimiter.isAllowed(key, RATE_LIMITS.webhook)

    if (!result.allowed) {
      logger.warn('Webhook rate limit exceeded', {
        action: 'webhook_rate_limit',
        metadata: { ip }
      })

      res.status(429).json({
        error: 'Too Many Requests',
        message: 'Webhook rate limit exceeded',
        retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000),
      })

      return
    }

    next()
  }
}

/**
 * Utility to check rate limit without consuming tokens
 */
export async function checkRateLimit(
  key: string,
  endpointType: keyof typeof RATE_LIMITS
): Promise<{
  allowed: boolean
  remaining: number
  resetAt: number
}> {
  const state = rateLimiter.getBucketState(key)

  if (!state) {
    return {
      allowed: true,
      remaining: RATE_LIMITS[endpointType].maxRequests,
      resetAt: Date.now() + RATE_LIMITS[endpointType].windowMs,
    }
  }

  return {
    allowed: state.tokens > 0,
    remaining: state.tokens,
    resetAt: state.lastRefill + RATE_LIMITS[endpointType].windowMs,
  }
}

/**
 * Cleanup on process exit
 */
process.on('beforeExit', () => {
  rateLimiter.destroy()
})

/**
 * Export utilities
 */
export const RateLimitUtils = {
  isAllowed: (key: string, config: RateLimitConfig) => rateLimiter.isAllowed(key, config),
  reset: (key: string) => rateLimiter.reset(key),
  getBucketState: (key: string) => rateLimiter.getBucketState(key),
  generateKey: generateRateLimitKey,
  check: checkRateLimit,
}
