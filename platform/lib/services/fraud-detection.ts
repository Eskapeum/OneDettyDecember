/**
 * Fraud Detection Service
 * Sprint 4 - Payment Integration
 * Created by: Nesiah (Backend Lead)
 *
 * Detects fraudulent payment attempts using multiple signals
 */

import { prisma } from '../prisma'
import {
  type FraudDetectionInput,
  type FraudCheckResult,
} from '../validation/payment.validation'

// ============================================
// FRAUD DETECTION CONSTANTS
// ============================================

const RISK_THRESHOLDS = {
  LOW: 30,
  MEDIUM: 60,
  HIGH: 80,
  CRITICAL: 95,
}

const VELOCITY_LIMITS = {
  MAX_TRANSACTIONS_PER_HOUR: 5,
  MAX_TRANSACTIONS_PER_DAY: 20,
  MAX_FAILED_ATTEMPTS_PER_HOUR: 3,
}

const AMOUNT_LIMITS = {
  SUSPICIOUS_AMOUNT_THRESHOLD: 10000, // USD
  MAX_FIRST_TRANSACTION_AMOUNT: 1000, // USD
  RAPID_INCREASE_MULTIPLIER: 5,
}

// ============================================
// MAIN FRAUD DETECTION
// ============================================

/**
 * Perform comprehensive fraud detection on a payment attempt
 * Returns a risk score (0-100) and recommendation
 */
export async function detectFraud(input: FraudDetectionInput): Promise<FraudCheckResult> {
  const flags: FraudCheckResult['flags'] = []
  let riskScore = 0

  // 1. Velocity Checks
  const velocityResult = await checkVelocity(input.userId, input.bookingId)
  riskScore += velocityResult.score
  flags.push(...velocityResult.flags)

  // 2. Amount Anomaly Detection
  const amountResult = await checkAmountAnomalies(
    input.userId,
    input.amount,
    input.currency
  )
  riskScore += amountResult.score
  flags.push(...amountResult.flags)

  // 3. Geographic Checks
  if (input.ipAddress) {
    const geoResult = await checkGeographicAnomalies(input.userId, input.ipAddress)
    riskScore += geoResult.score
    flags.push(...geoResult.flags)
  }

  // 4. Payment Method Analysis
  if (input.paymentMethod) {
    const paymentMethodResult = await checkPaymentMethod(
      input.userId,
      input.paymentMethod
    )
    riskScore += paymentMethodResult.score
    flags.push(...paymentMethodResult.flags)
  }

  // 5. User History Analysis
  const historyResult = await checkUserHistory(input.userId)
  riskScore += historyResult.score
  flags.push(...historyResult.flags)

  // 6. Pattern Analysis
  const patternResult = await checkPatterns(input)
  riskScore += patternResult.score
  flags.push(...patternResult.flags)

  // Determine risk level
  const riskLevel = getRiskLevel(riskScore)

  // Determine recommendation
  const recommendation = getRecommendation(riskScore, flags)

  return {
    riskScore: Math.min(100, Math.round(riskScore)),
    riskLevel,
    flags,
    recommendation,
    metadata: {
      timestamp: new Date().toISOString(),
      userId: input.userId,
      bookingId: input.bookingId,
      amount: input.amount,
      currency: input.currency,
    },
  }
}

// ============================================
// VELOCITY CHECKS
// ============================================

/**
 * Check transaction velocity for suspicious patterns
 */
async function checkVelocity(userId: string, bookingId: string) {
  const flags: FraudCheckResult['flags'] = []
  let score = 0

  const now = new Date()
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  // Count recent bookings
  const recentBookings = await prisma.booking.findMany({
    where: {
      userId,
      createdAt: {
        gte: oneHourAgo,
      },
    },
  })

  const dailyBookings = await prisma.booking.findMany({
    where: {
      userId,
      createdAt: {
        gte: oneDayAgo,
      },
    },
  })

  // Check hourly velocity
  if (recentBookings.length >= VELOCITY_LIMITS.MAX_TRANSACTIONS_PER_HOUR) {
    score += 30
    flags.push({
      type: 'HIGH_VELOCITY_HOURLY',
      severity: 'CRITICAL',
      message: `${recentBookings.length} transactions in the last hour (limit: ${VELOCITY_LIMITS.MAX_TRANSACTIONS_PER_HOUR})`,
    })
  } else if (recentBookings.length >= VELOCITY_LIMITS.MAX_TRANSACTIONS_PER_HOUR - 2) {
    score += 15
    flags.push({
      type: 'ELEVATED_VELOCITY_HOURLY',
      severity: 'WARNING',
      message: `${recentBookings.length} transactions in the last hour`,
    })
  }

  // Check daily velocity
  if (dailyBookings.length >= VELOCITY_LIMITS.MAX_TRANSACTIONS_PER_DAY) {
    score += 20
    flags.push({
      type: 'HIGH_VELOCITY_DAILY',
      severity: 'WARNING',
      message: `${dailyBookings.length} transactions in the last 24 hours (limit: ${VELOCITY_LIMITS.MAX_TRANSACTIONS_PER_DAY})`,
    })
  }

  // Check failed payment attempts
  const recentPayments = await prisma.payment.findMany({
    where: {
      booking: {
        userId,
      },
      createdAt: {
        gte: oneHourAgo,
      },
      status: 'FAILED',
    },
  })

  if (recentPayments.length >= VELOCITY_LIMITS.MAX_FAILED_ATTEMPTS_PER_HOUR) {
    score += 40
    flags.push({
      type: 'MULTIPLE_FAILED_ATTEMPTS',
      severity: 'CRITICAL',
      message: `${recentPayments.length} failed payment attempts in the last hour`,
    })
  }

  return { score, flags }
}

// ============================================
// AMOUNT ANOMALY DETECTION
// ============================================

/**
 * Detect suspicious payment amounts
 */
async function checkAmountAnomalies(
  userId: string,
  amount: number,
  currency: string
) {
  const flags: FraudCheckResult['flags'] = []
  let score = 0

  // Get user's payment history
  const userBookings = await prisma.booking.findMany({
    where: {
      userId,
      status: {
        in: ['CONFIRMED', 'COMPLETED'],
      },
    },
    include: {
      payment: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Check if first transaction
  if (userBookings.length === 0) {
    if (amount > AMOUNT_LIMITS.MAX_FIRST_TRANSACTION_AMOUNT) {
      score += 25
      flags.push({
        type: 'HIGH_FIRST_TRANSACTION',
        severity: 'WARNING',
        message: `First transaction amount ($${amount}) exceeds typical first transaction limit ($${AMOUNT_LIMITS.MAX_FIRST_TRANSACTION_AMOUNT})`,
      })
    }
  } else {
    // Calculate average transaction amount
    const totalAmount = userBookings.reduce((sum, booking) => {
      return sum + Number(booking.totalPrice)
    }, 0)

    const avgAmount = totalAmount / userBookings.length

    // Check for unusual amount increase
    if (amount > avgAmount * AMOUNT_LIMITS.RAPID_INCREASE_MULTIPLIER) {
      score += 20
      flags.push({
        type: 'AMOUNT_SPIKE',
        severity: 'WARNING',
        message: `Transaction amount ($${amount}) is ${(amount / avgAmount).toFixed(1)}x higher than user average ($${avgAmount.toFixed(2)})`,
      })
    }
  }

  // Check for suspiciously high amounts
  if (amount > AMOUNT_LIMITS.SUSPICIOUS_AMOUNT_THRESHOLD) {
    score += 15
    flags.push({
      type: 'HIGH_AMOUNT',
      severity: 'WARNING',
      message: `High transaction amount: $${amount}`,
    })
  }

  // Check for round numbers (often associated with fraud)
  if (amount % 100 === 0 && amount >= 1000) {
    score += 5
    flags.push({
      type: 'ROUND_NUMBER',
      severity: 'INFO',
      message: `Suspicious round amount: $${amount}`,
    })
  }

  return { score, flags }
}

// ============================================
// GEOGRAPHIC ANOMALY DETECTION
// ============================================

/**
 * Detect suspicious geographic patterns
 */
async function checkGeographicAnomalies(userId: string, ipAddress: string) {
  const flags: FraudCheckResult['flags'] = []
  let score = 0

  // NOTE: In production, you would use a geolocation service like MaxMind or IP2Location
  // to get the country/city from the IP address and compare with user's profile

  // Placeholder: Check if IP is from a high-risk country
  // const ipLocation = await getIPLocation(ipAddress)

  // For now, just add a placeholder check
  flags.push({
    type: 'GEO_CHECK',
    severity: 'INFO',
    message: `IP address: ${ipAddress}`,
  })

  return { score, flags }
}

// ============================================
// PAYMENT METHOD ANALYSIS
// ============================================

/**
 * Analyze payment method for fraud signals
 */
async function checkPaymentMethod(
  userId: string,
  paymentMethod: FraudDetectionInput['paymentMethod']
) {
  const flags: FraudCheckResult['flags'] = []
  let score = 0

  if (!paymentMethod) {
    return { score, flags }
  }

  // Check for frequently changed payment methods
  const recentPayments = await prisma.payment.findMany({
    where: {
      booking: {
        userId,
      },
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      },
    },
  })

  // In production, you would extract and compare payment method fingerprints
  // For now, just check the count
  if (recentPayments.length > 10) {
    score += 10
    flags.push({
      type: 'MULTIPLE_PAYMENT_METHODS',
      severity: 'INFO',
      message: `User has used multiple payment methods recently`,
    })
  }

  return { score, flags }
}

// ============================================
// USER HISTORY ANALYSIS
// ============================================

/**
 * Analyze user's history for fraud indicators
 */
async function checkUserHistory(userId: string) {
  const flags: FraudCheckResult['flags'] = []
  let score = 0

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      bookings: {
        include: {
          payment: true,
        },
      },
    },
  })

  if (!user) {
    score += 20
    flags.push({
      type: 'USER_NOT_FOUND',
      severity: 'CRITICAL',
      message: 'User not found in database',
    })
    return { score, flags }
  }

  // Check account age
  const accountAge = Date.now() - new Date(user.createdAt).getTime()
  const accountAgeDays = accountAge / (1000 * 60 * 60 * 24)

  if (accountAgeDays < 1) {
    score += 15
    flags.push({
      type: 'NEW_ACCOUNT',
      severity: 'WARNING',
      message: `Account created less than 24 hours ago`,
    })
  }

  // Check for verified email
  if (!user.emailVerified) {
    score += 10
    flags.push({
      type: 'UNVERIFIED_EMAIL',
      severity: 'WARNING',
      message: 'Email not verified',
    })
  }

  // Check for suspicious booking patterns (all cancelled)
  const cancelledBookings = user.bookings.filter((b) => b.status === 'CANCELLED')
  if (user.bookings.length > 0) {
    const cancellationRate = cancelledBookings.length / user.bookings.length
    if (cancellationRate > 0.5) {
      score += 15
      flags.push({
        type: 'HIGH_CANCELLATION_RATE',
        severity: 'WARNING',
        message: `${(cancellationRate * 100).toFixed(0)}% cancellation rate`,
      })
    }
  }

  return { score, flags }
}

// ============================================
// PATTERN ANALYSIS
// ============================================

/**
 * Detect suspicious patterns in the transaction
 */
async function checkPatterns(input: FraudDetectionInput) {
  const flags: FraudCheckResult['flags'] = []
  let score = 0

  // Check for rapid repeated amounts
  const recentBookings = await prisma.booking.findMany({
    where: {
      userId: input.userId,
      createdAt: {
        gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
      },
    },
  })

  const sameAmountBookings = recentBookings.filter(
    (b) => Number(b.totalPrice) === input.amount
  )

  if (sameAmountBookings.length >= 3) {
    score += 20
    flags.push({
      type: 'REPEATED_AMOUNT',
      severity: 'WARNING',
      message: `Same amount ($${input.amount}) charged ${sameAmountBookings.length} times in the last hour`,
    })
  }

  return { score, flags }
}

// ============================================
// RISK SCORING HELPERS
// ============================================

/**
 * Determine risk level from score
 */
function getRiskLevel(score: number): FraudCheckResult['riskLevel'] {
  if (score >= RISK_THRESHOLDS.CRITICAL) return 'CRITICAL'
  if (score >= RISK_THRESHOLDS.HIGH) return 'HIGH'
  if (score >= RISK_THRESHOLDS.MEDIUM) return 'MEDIUM'
  return 'LOW'
}

/**
 * Determine recommendation based on score and flags
 */
function getRecommendation(
  score: number,
  flags: FraudCheckResult['flags']
): FraudCheckResult['recommendation'] {
  const hasCriticalFlags = flags.some((f) => f.severity === 'CRITICAL')

  if (hasCriticalFlags || score >= RISK_THRESHOLDS.CRITICAL) {
    return 'DECLINE'
  }

  if (score >= RISK_THRESHOLDS.HIGH) {
    return 'REVIEW'
  }

  if (score >= RISK_THRESHOLDS.MEDIUM) {
    return 'REVIEW'
  }

  return 'APPROVE'
}

// ============================================
// FRAUD REPORTING
// ============================================

/**
 * Log fraud check results for analysis
 */
export async function logFraudCheck(
  input: FraudDetectionInput,
  result: FraudCheckResult
): Promise<void> {
  try {
    // In production, you would log to a fraud detection system
    // For now, just console log
    console.log('[FRAUD CHECK]', {
      userId: input.userId,
      bookingId: input.bookingId,
      amount: input.amount,
      riskScore: result.riskScore,
      riskLevel: result.riskLevel,
      recommendation: result.recommendation,
      flagCount: result.flags.length,
    })

    // You could also store in database for analytics
    // await prisma.fraudCheck.create({ data: { ... } })
  } catch (error) {
    console.error('Error logging fraud check:', error)
  }
}
