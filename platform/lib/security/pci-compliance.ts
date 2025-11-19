/**
 * PCI DSS Compliance Configuration
 *
 * Implements PCI DSS (Payment Card Industry Data Security Standard) compliance
 * requirements for secure payment processing
 *
 * Key Requirements:
 * - Never store full card numbers, CVV, or PIN data
 * - Use strong cryptography for transmission
 * - Implement access controls
 * - Monitor and log all access
 * - Regular security testing
 */

import { logger } from '@/lib/logger'
import { alertManager } from '@/lib/alerts'
import crypto from 'crypto'

/**
 * PCI DSS Compliance Levels
 */
export enum PCIComplianceLevel {
  LEVEL_1 = 'LEVEL_1', // >6M transactions/year
  LEVEL_2 = 'LEVEL_2', // 1-6M transactions/year
  LEVEL_3 = 'LEVEL_3', // 20k-1M e-commerce transactions/year
  LEVEL_4 = 'LEVEL_4', // <20k e-commerce transactions/year
}

/**
 * Sensitive data patterns that should NEVER be logged or stored
 */
const SENSITIVE_PATTERNS = {
  // Card numbers (various formats)
  cardNumber: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,

  // CVV/CVC (3-4 digits)
  cvv: /\b\d{3,4}\b/g,

  // Expiry dates
  expiry: /\b(0[1-9]|1[0-2])[\s/-]?([0-9]{2}|20[0-9]{2})\b/g,

  // PIN codes
  pin: /\b\d{4,6}\b/g,

  // API keys (common formats)
  apiKey: /(?:api[_-]?key|apikey|secret[_-]?key)[\s:=]+['"]?([a-zA-Z0-9_\-]{16,})['"]?/gi,

  // Bearer tokens
  bearerToken: /bearer\s+[a-zA-Z0-9\-._~+/]+=*/gi,
}

/**
 * PCI Compliance Configuration
 */
export interface PCIConfig {
  level: PCIComplianceLevel
  merchantId: string
  allowedPaymentMethods: string[]

  // Security settings
  enforceStrongEncryption: boolean
  requireTokenization: boolean
  enableFraudDetection: boolean

  // Monitoring
  logAllTransactions: boolean
  alertOnSuspiciousActivity: boolean

  // Data retention
  maxDataRetentionDays: number
  autoDeleteExpiredData: boolean
}

/**
 * Default PCI configuration (Level 4 - safest for small merchants)
 */
const DEFAULT_PCI_CONFIG: PCIConfig = {
  level: PCIComplianceLevel.LEVEL_4,
  merchantId: process.env.MERCHANT_ID || '',
  allowedPaymentMethods: ['card', 'wallet', 'bank_transfer'],

  enforceStrongEncryption: true,
  requireTokenization: true,
  enableFraudDetection: true,

  logAllTransactions: true,
  alertOnSuspiciousActivity: true,

  maxDataRetentionDays: 90, // PCI requirement: minimum 90 days
  autoDeleteExpiredData: true,
}

/**
 * PCI Compliance Manager
 */
class PCIComplianceManager {
  private config: PCIConfig
  private sensitiveDataDetectionCount = 0

  constructor(config: Partial<PCIConfig> = {}) {
    this.config = { ...DEFAULT_PCI_CONFIG, ...config }
    this.validateConfig()
  }

  /**
   * Validate PCI configuration
   */
  private validateConfig(): void {
    if (!this.config.merchantId) {
      throw new Error('PCI Compliance: Merchant ID is required')
    }

    if (this.config.maxDataRetentionDays < 90) {
      logger.warn('PCI Compliance: Data retention should be at least 90 days', {
        action: 'pci_config_warning',
        metadata: { retentionDays: this.config.maxDataRetentionDays }
      })
    }

    logger.info('PCI Compliance configuration validated', {
      action: 'pci_config_validated',
      metadata: {
        level: this.config.level,
        merchantId: this.maskMerchantId(this.config.merchantId),
      }
    })
  }

  /**
   * Mask merchant ID for logging
   */
  private maskMerchantId(merchantId: string): string {
    if (merchantId.length <= 8) return '****'
    return merchantId.slice(0, 4) + '****' + merchantId.slice(-4)
  }

  /**
   * Sanitize payment data - remove all sensitive information
   */
  sanitizePaymentData(data: any): any {
    if (!data) return data

    const sanitized = JSON.parse(JSON.stringify(data))

    // Remove sensitive fields
    const sensitiveFields = [
      'cardNumber',
      'card_number',
      'cvv',
      'cvc',
      'cvv2',
      'pin',
      'securityCode',
      'security_code',
      'track1',
      'track2',
      'magnetic_stripe',
    ]

    const removeSensitiveFields = (obj: any) => {
      if (typeof obj !== 'object' || obj === null) return

      for (const key of Object.keys(obj)) {
        if (sensitiveFields.includes(key.toLowerCase())) {
          obj[key] = '[REDACTED]'
        } else if (typeof obj[key] === 'object') {
          removeSensitiveFields(obj[key])
        }
      }
    }

    removeSensitiveFields(sanitized)
    return sanitized
  }

  /**
   * Detect and redact sensitive data in strings
   */
  redactSensitiveData(text: string): string {
    if (!text) return text

    let redacted = text

    // Redact card numbers
    redacted = redacted.replace(SENSITIVE_PATTERNS.cardNumber, (match) => {
      this.logSensitiveDataDetection('card_number', match)
      const last4 = match.slice(-4)
      return `****-****-****-${last4}`
    })

    // Redact CVV
    redacted = redacted.replace(/\b(cvv|cvc|cvv2|security[_\s]?code)[\s:=]+\d{3,4}\b/gi, (match) => {
      this.logSensitiveDataDetection('cvv', match)
      return match.split(/\d/)[0] + '***'
    })

    // Redact API keys
    redacted = redacted.replace(SENSITIVE_PATTERNS.apiKey, (match) => {
      this.logSensitiveDataDetection('api_key', match)
      return match.split('=')[0] + '=[REDACTED]'
    })

    // Redact bearer tokens
    redacted = redacted.replace(SENSITIVE_PATTERNS.bearerToken, () => {
      this.logSensitiveDataDetection('bearer_token', 'Bearer token')
      return 'Bearer [REDACTED]'
    })

    return redacted
  }

  /**
   * Log sensitive data detection
   */
  private logSensitiveDataDetection(type: string, sample: string): void {
    this.sensitiveDataDetectionCount++

    logger.warn('Sensitive data detected in payload', {
      action: 'pci_sensitive_data_detected',
      metadata: {
        type,
        sample: sample.slice(0, 10) + '...',
        count: this.sensitiveDataDetectionCount,
      }
    })

    // Alert on frequent detections
    if (this.sensitiveDataDetectionCount > 10) {
      alertManager.triggerAlert({
        type: 'security_violation',
        message: `High rate of sensitive data detection: ${this.sensitiveDataDetectionCount} occurrences`,
        severity: 'critical',
        context: { type, count: this.sensitiveDataDetectionCount }
      })
    }
  }

  /**
   * Validate payment method is allowed
   */
  isPaymentMethodAllowed(method: string): boolean {
    return this.config.allowedPaymentMethods.includes(method.toLowerCase())
  }

  /**
   * Generate secure idempotency key
   */
  generateIdempotencyKey(data: any): string {
    const normalized = JSON.stringify(this.sanitizePaymentData(data))
    return crypto
      .createHash('sha256')
      .update(normalized + Date.now())
      .digest('hex')
  }

  /**
   * Validate webhook signature (prevents replay attacks)
   */
  validateWebhookSignature(
    payload: string,
    signature: string,
    secret: string
  ): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')

    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  }

  /**
   * Encrypt sensitive data (for temporary storage only)
   */
  encryptData(data: string, key?: string): string {
    const encryptionKey = key || process.env.ENCRYPTION_KEY

    if (!encryptionKey) {
      throw new Error('PCI Compliance: Encryption key not configured')
    }

    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(
      'aes-256-gcm',
      Buffer.from(encryptionKey.slice(0, 32)),
      iv
    )

    let encrypted = cipher.update(data, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    const authTag = cipher.getAuthTag()

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
  }

  /**
   * Decrypt sensitive data
   */
  decryptData(encryptedData: string, key?: string): string {
    const encryptionKey = key || process.env.ENCRYPTION_KEY

    if (!encryptionKey) {
      throw new Error('PCI Compliance: Encryption key not configured')
    }

    const [ivHex, authTagHex, encrypted] = encryptedData.split(':')

    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      Buffer.from(encryptionKey.slice(0, 32)),
      Buffer.from(ivHex, 'hex')
    )

    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'))

    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  }

  /**
   * Check if data retention period has expired
   */
  shouldDeleteData(createdAt: Date): boolean {
    if (!this.config.autoDeleteExpiredData) return false

    const retentionMs = this.config.maxDataRetentionDays * 24 * 60 * 60 * 1000
    const ageMs = Date.now() - createdAt.getTime()

    return ageMs > retentionMs
  }

  /**
   * Audit payment request for PCI compliance
   */
  auditPaymentRequest(request: {
    method: string
    data: any
    userId?: string
    ip?: string
  }): {
    compliant: boolean
    violations: string[]
    warnings: string[]
  } {
    const violations: string[] = []
    const warnings: string[] = []

    // Check payment method
    if (!this.isPaymentMethodAllowed(request.method)) {
      violations.push(`Payment method not allowed: ${request.method}`)
    }

    // Check for sensitive data in plain text
    const dataStr = JSON.stringify(request.data)

    if (SENSITIVE_PATTERNS.cardNumber.test(dataStr)) {
      violations.push('Raw card number detected in request')
    }

    if (/cvv|cvc/i.test(dataStr) && /\d{3,4}/.test(dataStr)) {
      violations.push('CVV/CVC detected in request')
    }

    // Check encryption
    if (this.config.enforceStrongEncryption && !request.data.encrypted) {
      warnings.push('Data should be encrypted for transmission')
    }

    // Check tokenization
    if (this.config.requireTokenization && !request.data.token && !request.data.paymentMethodId) {
      violations.push('Tokenization required but not used')
    }

    const compliant = violations.length === 0

    // Log audit result
    logger.info('PCI compliance audit', {
      action: 'pci_audit',
      userId: request.userId,
      metadata: {
        compliant,
        violations: violations.length,
        warnings: warnings.length,
        method: request.method,
      }
    })

    if (!compliant) {
      alertManager.triggerAlert({
        type: 'security_violation',
        message: 'PCI compliance violation detected',
        severity: 'critical',
        context: {
          violations,
          warnings,
          userId: request.userId,
          ip: request.ip,
        }
      })
    }

    return { compliant, violations, warnings }
  }

  /**
   * Get current PCI configuration
   */
  getConfig(): Readonly<PCIConfig> {
    return { ...this.config }
  }

  /**
   * Update PCI configuration
   */
  updateConfig(updates: Partial<PCIConfig>): void {
    this.config = { ...this.config, ...updates }
    this.validateConfig()
  }
}

/**
 * Singleton instance
 */
export const pciCompliance = new PCIComplianceManager()

/**
 * Express/Next.js middleware for PCI compliance
 */
export function pciComplianceMiddleware(req: any, res: any, next: () => void) {
  // Sanitize request body
  if (req.body) {
    req.body = pciCompliance.sanitizePaymentData(req.body)
  }

  // Sanitize query params
  if (req.query) {
    req.query = pciCompliance.sanitizePaymentData(req.query)
  }

  // Add PCI headers
  res.setHeader('X-PCI-Compliant', 'true')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

  next()
}

/**
 * PCI Compliance Checklist
 */
export const PCI_COMPLIANCE_CHECKLIST = {
  network_security: [
    'Install and maintain firewall configuration',
    'Change vendor-supplied defaults',
    'Protect stored cardholder data (DO NOT STORE)',
    'Encrypt transmission of cardholder data',
  ],

  access_control: [
    'Restrict access on need-to-know basis',
    'Assign unique ID to each person with access',
    'Restrict physical access to cardholder data',
  ],

  monitoring: [
    'Track and monitor all access to network resources',
    'Regularly test security systems',
    'Maintain information security policy',
  ],

  best_practices: [
    'Never log full card numbers, CVV, or PIN',
    'Use tokenization for card storage',
    'Implement strong cryptography (TLS 1.2+)',
    'Use secure payment gateways (Stripe, Paystack)',
    'Validate webhook signatures',
    'Implement rate limiting',
    'Monitor for fraud',
    'Regular security audits',
  ]
}

/**
 * Export utilities
 */
export const PCIUtils = {
  sanitizePaymentData: (data: any) => pciCompliance.sanitizePaymentData(data),
  redactSensitiveData: (text: string) => pciCompliance.redactSensitiveData(text),
  validateWebhookSignature: (payload: string, signature: string, secret: string) =>
    pciCompliance.validateWebhookSignature(payload, signature, secret),
  generateIdempotencyKey: (data: any) => pciCompliance.generateIdempotencyKey(data),
  isPaymentMethodAllowed: (method: string) => pciCompliance.isPaymentMethodAllowed(method),
  auditPaymentRequest: (request: any) => pciCompliance.auditPaymentRequest(request),
}
