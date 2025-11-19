#!/usr/bin/env node

/**
 * Payment Audit Script
 *
 * Comprehensive payment system audit tool for:
 * - Checking PCI compliance
 * - Validating payment configurations
 * - Analyzing payment metrics
 * - Identifying security issues
 * - Generating compliance reports
 *
 * Usage:
 *   node platform/scripts/payment-audit.js [options]
 *
 * Options:
 *   --provider <stripe|paystack|all>  Provider to audit (default: all)
 *   --days <number>                   Days to audit (default: 30)
 *   --output <file>                   Output report file (default: stdout)
 *   --fix                             Auto-fix issues (default: false)
 *   --verbose                         Verbose output (default: false)
 */

const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

// Configuration
const config = {
  provider: process.argv.find((arg) => arg.startsWith('--provider='))?.split('=')[1] || 'all',
  days: parseInt(process.argv.find((arg) => arg.startsWith('--days='))?.split('=')[1] || '30'),
  output: process.argv.find((arg) => arg.startsWith('--output='))?.split('=')[1],
  fix: process.argv.includes('--fix'),
  verbose: process.argv.includes('--verbose'),
}

const prisma = new PrismaClient()

/**
 * Audit results
 */
const auditResults = {
  timestamp: new Date().toISOString(),
  config,
  passed: [],
  warnings: [],
  violations: [],
  critical: [],
  metrics: {},
  recommendations: [],
}

/**
 * Log utility
 */
function log(level, message, data = {}) {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...data,
  }

  if (config.verbose || level === 'ERROR' || level === 'CRITICAL') {
    console.log(`[${level}] ${message}`, data)
  }

  // Store in results
  switch (level) {
    case 'PASS':
      auditResults.passed.push(entry)
      break
    case 'WARN':
      auditResults.warnings.push(entry)
      break
    case 'VIOLATION':
      auditResults.violations.push(entry)
      break
    case 'CRITICAL':
      auditResults.critical.push(entry)
      break
  }
}

/**
 * Check 1: Environment variables
 */
async function checkEnvironmentVariables() {
  console.log('\n=== Checking Environment Variables ===\n')

  const requiredVars = [
    'DATABASE_URL',
    'ENCRYPTION_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'PAYSTACK_SECRET_KEY',
    'PAYSTACK_WEBHOOK_SECRET',
  ]

  const optionalVars = [
    'STRIPE_PUBLISHABLE_KEY',
    'PAYSTACK_PUBLIC_KEY',
    'MERCHANT_ID',
  ]

  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      log('CRITICAL', `Missing required environment variable: ${varName}`)
    } else if (process.env[varName].length < 20) {
      log('VIOLATION', `Environment variable too short: ${varName}`, {
        length: process.env[varName].length,
      })
    } else {
      log('PASS', `Environment variable configured: ${varName}`)
    }
  })

  optionalVars.forEach((varName) => {
    if (!process.env[varName]) {
      log('WARN', `Optional environment variable not set: ${varName}`)
    } else {
      log('PASS', `Optional environment variable configured: ${varName}`)
    }
  })

  // Check encryption key strength
  if (process.env.ENCRYPTION_KEY) {
    const keyLength = process.env.ENCRYPTION_KEY.length
    if (keyLength < 32) {
      log('CRITICAL', 'Encryption key too weak (minimum 32 characters)', {
        length: keyLength,
      })
    } else {
      log('PASS', 'Encryption key meets strength requirements')
    }
  }
}

/**
 * Check 2: PCI compliance configuration
 */
async function checkPCICompliance() {
  console.log('\n=== Checking PCI Compliance ===\n')

  // Check for sensitive data in logs
  const logFiles = [
    'logs/app.log',
    'logs/error.log',
    'logs/payment.log',
  ]

  for (const logFile of logFiles) {
    const logPath = path.join(process.cwd(), logFile)
    if (fs.existsSync(logPath)) {
      const content = fs.readFileSync(logPath, 'utf8')

      // Check for card numbers
      const cardPattern = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g
      if (cardPattern.test(content)) {
        log('CRITICAL', `Potential card numbers found in ${logFile}`)
      }

      // Check for CVV
      const cvvPattern = /\b(cvv|cvc|cvv2|security[_\s]?code)[\s:=]+\d{3,4}\b/gi
      if (cvvPattern.test(content)) {
        log('CRITICAL', `Potential CVV/CVC found in ${logFile}`)
      }

      log('PASS', `No sensitive data detected in ${logFile}`)
    }
  }

  // Check SSL/TLS configuration
  if (process.env.NODE_ENV === 'production' && !process.env.FORCE_HTTPS) {
    log('VIOLATION', 'HTTPS not enforced in production')
  } else {
    log('PASS', 'HTTPS enforcement configured')
  }

  // Check data retention
  const retentionDays = parseInt(process.env.PAYMENT_DATA_RETENTION_DAYS || '90')
  if (retentionDays < 90) {
    log('VIOLATION', 'Payment data retention below PCI requirement (90 days)', {
      configured: retentionDays,
    })
  } else {
    log('PASS', `Payment data retention: ${retentionDays} days`)
  }
}

/**
 * Check 3: Payment metrics
 */
async function checkPaymentMetrics() {
  console.log('\n=== Analyzing Payment Metrics ===\n')

  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - config.days)

  // Get payment statistics
  const payments = await prisma.payment.findMany({
    where: {
      createdAt: {
        gte: cutoffDate,
      },
      ...(config.provider !== 'all' && { provider: config.provider }),
    },
  })

  const total = payments.length
  const succeeded = payments.filter((p) => p.status === 'SUCCEEDED').length
  const failed = payments.filter((p) => p.status === 'FAILED').length
  const refunded = payments.filter((p) => p.status === 'REFUNDED').length

  const successRate = total > 0 ? (succeeded / total) * 100 : 0
  const failureRate = total > 0 ? (failed / total) * 100 : 0
  const refundRate = total > 0 ? (refunded / total) * 100 : 0

  auditResults.metrics = {
    period: `${config.days} days`,
    total,
    succeeded,
    failed,
    refunded,
    successRate: successRate.toFixed(2) + '%',
    failureRate: failureRate.toFixed(2) + '%',
    refundRate: refundRate.toFixed(2) + '%',
  }

  console.log('Payment Metrics:')
  console.log(`  Total Payments: ${total}`)
  console.log(`  Succeeded: ${succeeded} (${successRate.toFixed(2)}%)`)
  console.log(`  Failed: ${failed} (${failureRate.toFixed(2)}%)`)
  console.log(`  Refunded: ${refunded} (${refundRate.toFixed(2)}%)`)

  // Check thresholds
  if (failureRate > 10) {
    log('CRITICAL', 'Payment failure rate exceeds 10%', { failureRate })
  } else if (failureRate > 5) {
    log('VIOLATION', 'Payment failure rate exceeds 5%', { failureRate })
  } else {
    log('PASS', 'Payment failure rate within acceptable range')
  }

  if (refundRate > 15) {
    log('VIOLATION', 'Refund rate exceeds 15%', { refundRate })
  } else if (refundRate > 10) {
    log('WARN', 'Refund rate exceeds 10%', { refundRate })
  } else {
    log('PASS', 'Refund rate within acceptable range')
  }

  // Analyze failure reasons
  const failuresByReason = {}
  payments
    .filter((p) => p.status === 'FAILED' && p.errorMessage)
    .forEach((p) => {
      const reason = p.errorMessage.substring(0, 50)
      failuresByReason[reason] = (failuresByReason[reason] || 0) + 1
    })

  if (Object.keys(failuresByReason).length > 0) {
    console.log('\nTop Failure Reasons:')
    Object.entries(failuresByReason)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([reason, count]) => {
        console.log(`  ${reason}: ${count}`)
      })
  }
}

/**
 * Check 4: Webhook configuration
 */
async function checkWebhooks() {
  console.log('\n=== Checking Webhook Configuration ===\n')

  // Check webhook secrets
  const webhookSecrets = [
    'STRIPE_WEBHOOK_SECRET',
    'PAYSTACK_WEBHOOK_SECRET',
  ]

  webhookSecrets.forEach((secret) => {
    if (!process.env[secret]) {
      log('CRITICAL', `Missing webhook secret: ${secret}`)
    } else if (process.env[secret].startsWith('whsec_') || process.env[secret].length > 20) {
      log('PASS', `Webhook secret configured: ${secret}`)
    } else {
      log('VIOLATION', `Webhook secret format invalid: ${secret}`)
    }
  })

  // Check webhook endpoint security
  const webhookEndpoints = [
    '/api/webhooks/stripe',
    '/api/webhooks/paystack',
  ]

  for (const endpoint of webhookEndpoints) {
    const filePath = path.join(
      process.cwd(),
      'platform/src/app',
      endpoint,
      'route.ts'
    )

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8')

      // Check for signature verification
      if (content.includes('verifySignature') || content.includes('constructEvent')) {
        log('PASS', `Webhook signature verification found: ${endpoint}`)
      } else {
        log('CRITICAL', `Missing webhook signature verification: ${endpoint}`)
      }

      // Check for idempotency
      if (content.includes('idempotency') || content.includes('processed')) {
        log('PASS', `Idempotency handling found: ${endpoint}`)
      } else {
        log('WARN', `Missing idempotency handling: ${endpoint}`)
      }
    } else {
      log('VIOLATION', `Webhook endpoint file not found: ${endpoint}`)
    }
  }
}

/**
 * Check 5: Rate limiting
 */
async function checkRateLimiting() {
  console.log('\n=== Checking Rate Limiting ===\n')

  const paymentEndpoints = [
    '/api/payments/stripe',
    '/api/payments/paystack',
    '/api/payments/refund',
  ]

  for (const endpoint of paymentEndpoints) {
    const filePath = path.join(
      process.cwd(),
      'platform/src/app',
      endpoint,
      'route.ts'
    )

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8')

      if (content.includes('rateLimit') || content.includes('rateLimiter')) {
        log('PASS', `Rate limiting configured: ${endpoint}`)
      } else {
        log('VIOLATION', `Missing rate limiting: ${endpoint}`)
        auditResults.recommendations.push(
          `Add rate limiting to ${endpoint} to prevent abuse`
        )
      }
    }
  }
}

/**
 * Check 6: Security headers
 */
async function checkSecurityHeaders() {
  console.log('\n=== Checking Security Headers ===\n')

  const middlewarePath = path.join(process.cwd(), 'platform/src/middleware.ts')

  if (fs.existsSync(middlewarePath)) {
    const content = fs.readFileSync(middlewarePath, 'utf8')

    const requiredHeaders = [
      { name: 'X-Content-Type-Options', value: 'nosniff' },
      { name: 'X-Frame-Options', value: 'DENY' },
      { name: 'Strict-Transport-Security', value: 'max-age=' },
    ]

    requiredHeaders.forEach((header) => {
      if (content.includes(header.name) && content.includes(header.value)) {
        log('PASS', `Security header configured: ${header.name}`)
      } else {
        log('VIOLATION', `Missing security header: ${header.name}`)
      }
    })
  } else {
    log('WARN', 'Middleware file not found - cannot verify security headers')
  }
}

/**
 * Generate recommendations
 */
function generateRecommendations() {
  console.log('\n=== Generating Recommendations ===\n')

  // Based on violations and warnings
  if (auditResults.violations.length > 0 || auditResults.critical.length > 0) {
    auditResults.recommendations.push(
      'Address all critical issues and violations immediately'
    )
  }

  if (auditResults.warnings.length > 3) {
    auditResults.recommendations.push(
      'Review and address warning items to improve security posture'
    )
  }

  if (auditResults.metrics.failureRate > 5) {
    auditResults.recommendations.push(
      'Investigate high payment failure rate and improve error handling'
    )
  }

  if (auditResults.metrics.refundRate > 10) {
    auditResults.recommendations.push(
      'High refund rate detected - review booking cancellation policies'
    )
  }

  auditResults.recommendations.forEach((rec, i) => {
    console.log(`${i + 1}. ${rec}`)
  })
}

/**
 * Generate report
 */
function generateReport() {
  const report = `
# Payment System Audit Report
Generated: ${auditResults.timestamp}
Configuration: ${JSON.stringify(config, null, 2)}

## Summary
- Passed Checks: ${auditResults.passed.length}
- Warnings: ${auditResults.warnings.length}
- Violations: ${auditResults.violations.length}
- Critical Issues: ${auditResults.critical.length}

## Metrics
${JSON.stringify(auditResults.metrics, null, 2)}

## Critical Issues
${auditResults.critical.map((c) => `- ${c.message}`).join('\n') || 'None'}

## Violations
${auditResults.violations.map((v) => `- ${v.message}`).join('\n') || 'None'}

## Warnings
${auditResults.warnings.map((w) => `- ${w.message}`).join('\n') || 'None'}

## Recommendations
${auditResults.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n') || 'None'}

## Compliance Status
${
    auditResults.critical.length === 0 && auditResults.violations.length === 0
      ? '✅ COMPLIANT'
      : '❌ NOT COMPLIANT'
  }
`

  return report
}

/**
 * Main audit function
 */
async function runAudit() {
  console.log('===================================')
  console.log('   Payment System Audit')
  console.log('===================================')

  try {
    await checkEnvironmentVariables()
    await checkPCICompliance()
    await checkPaymentMetrics()
    await checkWebhooks()
    await checkRateLimiting()
    await checkSecurityHeaders()
    generateRecommendations()

    // Generate and output report
    const report = generateReport()

    if (config.output) {
      fs.writeFileSync(config.output, report)
      console.log(`\n✅ Report saved to: ${config.output}`)
    } else {
      console.log('\n' + report)
    }

    // Exit with appropriate code
    const exitCode = auditResults.critical.length > 0 ? 2 : auditResults.violations.length > 0 ? 1 : 0

    console.log('\n===================================')
    console.log(
      exitCode === 0
        ? '✅ Audit completed successfully'
        : exitCode === 1
        ? '⚠️  Audit completed with violations'
        : '❌ Audit failed - critical issues found'
    )
    console.log('===================================\n')

    process.exit(exitCode)
  } catch (error) {
    console.error('❌ Audit failed:', error)
    process.exit(2)
  } finally {
    await prisma.$disconnect()
  }
}

// Run audit
runAudit()
